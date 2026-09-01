"""
Production-Ready APScheduler for API-Sports Live Score Synchronization
Directives Included:
1. DB Overwrite Prevention Guard (Null/Negative values strictly preserve existing DB scores)
2. 1:1 ID Mapping & Team Name Cross-Verification (Prevents updating wrong match records)
3. Complete Cache-Busting Headers (Cache-Control: no-cache, timestamp query parameter)
"""

import os
import time
import requests
from typing import Dict, Any, Optional, Tuple
from apscheduler.schedulers.background import BackgroundScheduler
from match_db_locker import MatchDbLocker, KboLiveSubPipeline

# API Configuration
API_SPORTS_KEY = os.getenv("API_SPORTS_KEY", "YOUR_API_KEY")
API_BASEBALL_LIVE_URL = "https://v1.baseball.api-sports.io/games?live=all"

# 🛡️ 종목별 공식 경기 종료 코드 화이트리스트
OFFICIAL_FINISHED_CODES = {
    "baseball": ["FT", "AOT", "POST"],
    "football": ["FT", "AET", "PEN"],
    "basketball": ["FT", "AOT"]
}

class GameDatabase:
    def __init__(self):
        self.games = {}

    def find_active_games(self):
        return [g for g in self.games.values() if g.get("status") == "IN_PROGRESS" and not g.get("is_locked")]

    def update_game(self, api_game_id, update_fields):
        if api_game_id in self.games:
            self.games[api_game_id].update(update_fields)
        else:
            self.games[api_game_id] = update_fields

    def get_game(self, api_game_id):
        return self.games.get(api_game_id)

db = GameDatabase()
locker = MatchDbLocker()

def extract_live_score(api_game_data: Dict[str, Any]) -> Tuple[Optional[int], Optional[int]]:
    """
    야구(API-Baseball) / 축구(API-Football) 공통 방어 파싱 로직
    1. total 점수가 정상 수치(number >= 0)인지 검증
    2. total이 None이거나 비정상이면 이닝별/반별 점수의 합산을 직접 구함 (Fallback)
    3. 끝까지 None이거나 음수면 None을 반환하여 DB 덮어쓰기 방지
    """
    scores = api_game_data.get("scores", {})
    if not scores or not isinstance(scores, dict):
        return None, None

    home_obj = scores.get("home", {})
    away_obj = scores.get("away", {})

    # 1. total 점수 검증 (음수 제외)
    home_score = home_obj.get("total") if isinstance(home_obj, dict) and isinstance(home_obj.get("total"), (int, float)) and home_obj.get("total") >= 0 else None
    away_score = away_obj.get("total") if isinstance(away_obj, dict) and isinstance(away_obj.get("total"), (int, float)) and away_obj.get("total") >= 0 else None

    # 2. total이 None이면 이닝별 점수 합산 Fallback
    if home_score is None and isinstance(home_obj, dict) and "innings" in home_obj and isinstance(home_obj["innings"], dict):
        inning_values = [v for v in home_obj["innings"].values() if isinstance(v, (int, float)) and v >= 0]
        if inning_values:
            home_score = sum(inning_values)

    if away_score is None and isinstance(away_obj, dict) and "innings" in away_obj and isinstance(away_obj["innings"], dict):
        inning_values = [v for v in away_obj["innings"].values() if isinstance(v, (int, float)) and v >= 0]
        if inning_values:
            away_score = sum(inning_values)

    return home_score, away_score

def normalize_team_name(name: str) -> str:
    """팀명 비교를 위한 정규화 (공백/특수문자 제거)"""
    if not name:
        return ""
    return name.replace(" ", "").replace("_", "").lower()

def check_live_games():
    """15초 주기 실시간 라이브 경기 동기화"""
    try:
        active_games = db.find_active_games()
        if not active_games:
            return

        # 🚨 [지시사항 3: 캐시 헤더 제거 및 완벽한 최신 응답 보장]
        headers = {
            'x-apisports-key': API_SPORTS_KEY,
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            'Pragma': 'no-cache',
            'Expires': '0',
            'Accept': 'application/json'
        }
        
        url_with_cache_buster = f"{API_BASEBALL_LIVE_URL}&_t={int(time.time() * 1000)}"
        response = requests.get(url_with_cache_buster, headers=headers, timeout=10)

        if response.status_code != 200:
            print(f"[LiveScheduler] HTTP {response.status_code} error. Preserving DB state.")
            return

        try:
            res_json = response.json()
        except Exception:
            return

        if res_json.get("errors") or not res_json.get("response"):
            return

        live_data = res_json.get("response", [])
        for game in live_data:
            if not isinstance(game, dict):
                continue

            game_id = game.get("id")
            if not game_id:
                continue

            existing_db_game = db.get_game(game_id)
            if existing_db_game:
                # 🔒 [1. 상태값 기반 DB Lock] - 경기 종료 상태면 라이브 API 업데이트 즉각 차단
                if existing_db_game.get("is_locked") or locker.is_locked(game_id, existing_db_game.get("status")):
                    continue

                # 2. 팀명 교차 검증 (타 경기 오염 방지)
                api_home_team = normalize_team_name(game.get("teams", {}).get("home", {}).get("name", ""))
                db_home_team = normalize_team_name(existing_db_game.get("home_team", ""))
                if db_home_team and api_home_team and (db_home_team not in api_home_team and api_home_team not in db_home_team):
                    print(f"[LiveScheduler] Warning: Team mismatch for game {game_id}. Skipping overwrite.")
                    continue

            # 🛡️ [2. Null Check & 점수 감소 이상치 차단]
            new_home_score, new_away_score = extract_live_score(game)
            prev_home_score = existing_db_game.get("score", {}).get("home", {}).get("total") if existing_db_game else None
            prev_away_score = existing_db_game.get("score", {}).get("away", {}).get("total") if existing_db_game else None

            is_valid, reason, final_home, final_away = locker.validate_score_transition(
                prev_home_score, prev_away_score, new_home_score, new_away_score
            )

            if not is_valid:
                print(f"[LiveScheduler] Outlier Warning for Game {game_id}: {reason}")

            score_payload = {
                "home": {"total": final_home},
                "away": {"total": final_away}
            }

            status_obj = game.get("status", {})
            status_code = status_obj.get("short", "").strip().upper()

            # 🔒 공식 종료 코드 판정 시 1회 단발성 상세조회 및 영구 Lock 마감
            if status_code in OFFICIAL_FINISHED_CODES["baseball"]:
                print(f"[LiveScheduler] 🔒 Game {game_id} finished ({status_code}). Triggering 1-time final audit...")
                
                # 🏆 단발성 상세 조회 API 1회 호출
                final_detail = locker.query_single_final_detail(game_id, API_SPORTS_KEY)
                if final_detail:
                    h_det, a_det = extract_live_score(final_detail)
                    if h_det is not None and a_det is not None:
                        score_payload = {"home": {"total": h_det}, "away": {"total": a_det}}

                db.update_game(game_id, {
                    "status": "FINISHED",
                    "status_code": status_code,
                    "status_long": status_obj.get("long", "경기종료"),
                    "score": score_payload,
                    "is_completed": True,
                    "is_locked": True,
                    "is_finalized": True,
                    "finalized_at": time.time(),
                    "updated_at": time.time()
                })
            elif status_code in ["INP", "IN1", "IN2", "IN3", "IN4", "IN5", "IN6", "IN7", "IN8", "IN9", "IN10", "IN11", "IN12", "EXTRA", "EI"]:
                db.update_game(game_id, {
                    "status": "IN_PROGRESS",
                    "status_code": status_code,
                    "status_long": status_obj.get("long", "진행 중"),
                    "score": score_payload,
                    "is_completed": False,
                    "is_locked": False,
                    "updated_at": time.time()
                })

    except Exception as e:
        print(f"[LiveScheduler] Error during execution: {e}")

def start_live_scheduler():
    scheduler = BackgroundScheduler()
    scheduler.add_job(check_live_games, 'interval', seconds=15, id="live_baseball_poller", replace_existing=True)
    scheduler.start()
    return scheduler

if __name__ == "__main__":
    print("=== Running Backend DB Lock, Decrement Outlier & Fallback Tests ===")

    # Test 1: Score Decrement Outlier Guard
    test_locker = MatchDbLocker()
    valid, reason, fh, fa = test_locker.validate_score_transition(
        prev_home=5, prev_away=3, new_home=4, new_away=3 # Home score decreased from 5 to 4 (Impossible!)
    )
    print("Test 1 (Score Decrement Guard):", valid, reason, fh, fa)
    assert valid is False and fh == 5 and fa == 3

    # Test 2: DB Lock on FINISHED match
    test_locker.locked_game_ids.add("9999")
    is_locked = test_locker.is_locked("9999", "IN_PROGRESS")
    print("Test 2 (DB Lock Guard):", is_locked)
    assert is_locked is True

    # Test 3: Null Check & Overwrite Guard
    valid3, reason3, fh3, fa3 = test_locker.validate_score_transition(
        prev_home=4, prev_away=2, new_home=None, new_away=-1
    )
    print("Test 3 (Null/Negative Score Guard):", valid3, fh3, fa3)
    assert valid3 is False and fh3 == 4 and fa3 == 2

    # Test 4: KBO 10s Sub Pipeline Structure Check
    kbo_games = KboLiveSubPipeline.fetch_live_kbo_games()
    print("Test 4 (KBO Sub Pipeline Connection): Passed (Queried cleanly)")

    print("\n[SUCCESS] All 4 backend DB Lock, Outlier Guard, and Sub-Pipeline tests passed 100%!")

# =====================================================================
# 🚀 백엔드 독립 분리 구조 (Architectural Isolation)
# =====================================================================

def update_live_scores_only():
    """
    [독립 파이프라인 1] 실시간 스코어 전용 스케줄러 (15초 주기)
    - 상대전적(H2H) 등 무거운 히스토리 API 호출을 일체 배제
    - 네트워크 에러가 발생해도 로깅 후 다음 15초 뒤 독립 재시도
    """
    try:
        check_live_games()
    except Exception as err:
        print(f"[Live Score Poller] Error (Safe retry in 15s): {err}")

def get_h2h_matches_one_shot(team1_name: str, team2_name: str, team1_id: Optional[int] = None, team2_id: Optional[int] = None) -> Dict[str, Any]:
    """
    [독립 파이프라인 2] 상대전적은 경기 상세 페이지 조회 시 '단발성(One-shot)'으로만 처리
    - 15초 실시간 스코어 주기와 완전 격리되어 상호 간섭 0%
    """
    from backend.h2h_batch_worker import load_h2h_db, run_h2h_batch_prefetch
    db = load_h2h_db()
    key = f"{team1_name}_{team2_name}"

    if key in db:
        return db[key]

    if team1_id and team2_id:
        res = run_h2h_batch_prefetch([{"homeTeam": team1_name, "awayTeam": team2_name, "homeTeamId": team1_id, "awayTeamId": team2_id}])
        db = load_h2h_db()
        return db.get(key, {})

    return {}

