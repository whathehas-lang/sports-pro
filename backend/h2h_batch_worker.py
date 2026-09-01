"""
H2H Batch Prefetch Worker (하루 1회 / 경기 시작 2시간 전 배치 사전 수집 엔진)
1. 경기 직전 외부 API 실시간 호출 차단 -> 서버/클라이언트 부하 0%
2. 하루 1회 (새벽 04:00 KST) 또는 경기 시작 2시간 전(T-2h) 배치로 H2H 데이터 사전 스크랩
3. parse_recent_matches 방어 파서 통과 후 내부 DB (backend/data/h2h_verified_db.json)에 영구 저장
"""

import sys
import io
import json
import os
import time
import requests
from typing import Dict, Any, List

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from backend.match_db_locker import MatchDbLocker

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

DB_PATH = os.path.join(os.path.dirname(__file__), "data", "h2h_verified_db.json")

def load_h2h_db() -> Dict[str, Any]:
    if os.path.exists(DB_PATH):
        try:
            with open(DB_PATH, "r", encoding="utf-8") as f:
                return json.load(f)
        except Exception:
            return {}
    return {}

def save_h2h_db(db: Dict[str, Any]):
    os.makedirs(os.path.dirname(DB_PATH), exist_ok=True)
    with open(DB_PATH, "w", encoding="utf-8") as f:
        json.dump(db, f, ensure_ascii=False, indent=2)

def run_h2h_batch_prefetch(matchups: List[Dict[str, Any]], api_key: str = "02cbc5113771eefb4A3F6D14606C2af9") -> Dict[str, Any]:
    db = load_h2h_db()
    prefetched = 0
    skipped = 0
    failed = 0

    print(f"[H2HBatchWorker] 🚀 Starting H2H Batch Prefetch for {len(matchups)} matchups...")

    for m in matchups:
        h_name = m.get("homeTeam")
        a_name = m.get("awayTeam")
        h_id = m.get("homeTeamId")
        a_id = m.get("awayTeamId")
        key = f"{h_name}_{a_name}"

        # 1. 이미 내부 DB에 안전하게 보관되어 있으면 외부 API 호출 없이 스킵
        if key in db:
            skipped += 1
            continue

        if not h_id or not a_id:
            skipped += 1
            continue

        print(f"[H2HBatchWorker] 🔍 [Team ID Mapping Check] {h_name} (ID: {h_id}) vs {a_name} (ID: {a_id})")

        is_baseball = m.get("sport") == "baseball" or m.get("league") in ["MLB", "KBO", "NPB"]
        headers = {
            'x-apisports-key': api_key,
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            'Pragma': 'no-cache'
        }
        raw_list = []

        try:
            # 1. Direct H2H Endpoint (All seasons, last 20)
            if is_baseball:
                url = f"https://v1.baseball.api-sports.io/games/h2h?h2h={h_id}-{a_id}"
            else:
                url = f"https://v3.football.api-sports.io/fixtures/headtohead?h2h={h_id}-{a_id}&last=20"
            
            print(f"[H2HBatchWorker] 🌐 Request URL: {url}")
            res = requests.get(url, headers=headers, timeout=10)
            if res.status_code == 200:
                raw_list = res.json().get("response", [])

            # 2. Fallback: If empty, query both teams' recent games/fixtures and cross-filter
            if not raw_list:
                print(f"[H2HBatchWorker] ⚠️ Direct H2H empty for {key}. Activating Fallback: Cross-filtering recent team fixtures...")
                if is_baseball:
                    url_h = f"https://v1.baseball.api-sports.io/games?team={h_id}&season=2026"
                    url_a = f"https://v1.baseball.api-sports.io/games?team={a_id}&season=2026"
                else:
                    url_h = f"https://v3.football.api-sports.io/fixtures?team={h_id}&season=2024"
                    url_a = f"https://v3.football.api-sports.io/fixtures?team={a_id}&season=2024"

                print(f"[H2HBatchWorker] 🌐 Request URL: {url_h}")
                print(f"[H2HBatchWorker] 🌐 Request URL: {url_a}")
                res_h = requests.get(url_h, headers=headers, timeout=10)
                res_a = requests.get(url_a, headers=headers, timeout=10)
                fixtures_h = res_h.json().get("response", []) if res_h.status_code == 200 else []
                fixtures_a = res_a.json().get("response", []) if res_a.status_code == 200 else []

                seen_ids = set()
                for f in fixtures_h + fixtures_a:
                    th = f.get("teams", {}).get("home", {}).get("id")
                    ta = f.get("teams", {}).get("away", {}).get("id")
                    fid = f.get("fixture", {}).get("id") or f.get("id")
                    if fid and fid not in seen_ids:
                        if (th == h_id and ta == a_id) or (th == a_id and ta == h_id):
                            seen_ids.add(fid)
                            raw_list.append(f)

            parsed = MatchDbLocker.parse_recent_matches(raw_list, limit=20)
            if parsed:
                h_wins = sum(1 for r in parsed if r["homeScore"] > r["awayScore"])
                a_wins = sum(1 for r in parsed if r["awayScore"] > r["homeScore"])
                draws = sum(1 for r in parsed if r["homeScore"] == r["awayScore"])
                verdict = f"{h_name} 우세 🟢" if h_wins > a_wins else (f"{a_name} 우세 🔵" if a_wins > h_wins else "동률 🤝")

                db[key] = {
                    "h2hKey": key,
                    "homeTeamName": h_name,
                    "awayTeamName": a_name,
                    "summaryText": f"최근 맞대결 전적: {len(parsed)}경기 {h_wins}승 {draws}무 {a_wins}패 ({verdict})",
                    "homeWins": h_wins,
                    "draws": draws,
                    "awayWins": a_wins,
                    "last5Matches": parsed,
                    "lastFetchedAt": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
                    "source": "BATCH_PREFETCH",
                    "status": "VERIFIED"
                }
                prefetched += 1
                continue
        except Exception as e:
            print(f"[H2HBatchWorker] Batch fetch error for {key}: {e}")
            failed += 1

    save_h2h_db(db)
    print(f"[H2HBatchWorker] ✅ Batch finished. Total DB items: {len(db)} (Prefetched: {prefetched}, Cached: {skipped}, Failed: {failed})")
    return {"total": len(matchups), "prefetched": prefetched, "cached": skipped, "failed": failed}

if __name__ == "__main__":
    sample_matchups = [
        {"homeTeam": "아스널", "awayTeam": "첼시", "homeTeamId": 42, "awayTeamId": 49},
        {"homeTeam": "맨체스터 시티", "awayTeam": "리버풀", "homeTeamId": 50, "awayTeamId": 40}
    ]
    report = run_h2h_batch_prefetch(sample_matchups)
    print("Batch Report:", report)
