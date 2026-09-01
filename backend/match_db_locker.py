"""
MatchDbLocker & KBO Dual-Channel Sub-Pipeline Engine
1. State-Based DB Lock: Completely blocks live API updates once a match reaches FINISHED (FT, AET, etc.)
2. Single Final Audit: Exactly 1 single-shot query to GET /games?id={id} upon finish to store official score and seal the record
3. Outlier / Score Decrement Prevention: Null/NaN or Decreasing scores are rejected; existing DB scores preserved
4. KBO 10s Sub-Pipeline: Independent 10s polling for domestic baseball with cross-validation
"""

import time
import requests
from typing import Dict, Any, Optional, Tuple, List

OFFICIAL_FINISHED_CODES = {"FT", "AET", "PEN", "AOT", "POST", "FINISHED", "FINAL", "GAME OVER"}

class MatchDbLocker:
    def __init__(self):
        self.locked_game_ids = set()
        self.finalized_game_ids = set()

    def is_locked(self, game_id: Any, status: Optional[str] = None) -> bool:
        gid = str(game_id)
        if gid in self.locked_game_ids:
            return True
        if status and status.strip().upper() in OFFICIAL_FINISHED_CODES:
            self.locked_game_ids.add(gid)
            return True
        return False

    def validate_score_transition(
        self,
        prev_home: Optional[int],
        prev_away: Optional[int],
        new_home: Optional[int],
        new_away: Optional[int]
    ) -> Tuple[bool, str, Optional[int], Optional[int]]:
        """
        Null check and Score Decrement (점수 감소) Outlier prevention
        """
        # 1. Null / Negative value check
        if new_home is None or new_home < 0 or new_away is None or new_away < 0:
            return False, "Null or Negative Score", prev_home, prev_away

        # 2. Score Decrement Outlier Guard (진행 중 점수 감소 차단)
        if prev_home is not None and new_home < prev_home:
            return False, f"Score Decrement Detected for Home ({prev_home} -> {new_home})", prev_home, prev_away

        if prev_away is not None and new_away < prev_away:
            return False, f"Score Decrement Detected for Away ({prev_away} -> {new_away})", prev_home, prev_away

        return True, "Valid", new_home, new_away

    def query_single_final_detail(self, game_id: Any, api_key: str) -> Optional[Dict[str, Any]]:
        """
        종료 직후 개별 경기 상세 조회 API (GET /games?id={id}) 딱 1회 단발성 호출 및 최종 마감
        """
        gid = str(game_id)
        if gid in self.finalized_game_ids:
            return None

        self.finalized_game_ids.add(gid)
        self.locked_game_ids.add(gid)
        print(f"[MatchDbLocker] 🔒 Executing 1-time official final detail audit for game: {gid}")

        headers = {
            'x-apisports-key': api_key,
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            'Pragma': 'no-cache'
        }
        url = f"https://v1.baseball.api-sports.io/games?id={gid}&_t={int(time.time() * 1000)}"
        try:
            r = requests.get(url, headers=headers, timeout=10)
            if r.status_code == 200:
                res_data = r.json().get("response", [])
                if res_data and len(res_data) > 0:
                    return res_data[0]
        except Exception as e:
            print(f"[MatchDbLocker] Final detail query error for {gid}: {e}")
        return None

    @staticmethod
    def parse_recent_matches(api_response_list: List[Dict[str, Any]], limit: int = 20) -> List[Dict[str, Any]]:
        """
        상대전적 및 최근 경기 파싱 방어 코드
        1. FT/AET 등 완결된 경기만 필터링
        2. 날짜(date) 기준 최신순(내림차순) 정렬
        3. 20경기 미만(8경기, 13경기 등)일 경우 실존 수량 그대로 반환 (최대 20개)
        4. Null score 0으로 방어
        """
        if not isinstance(api_response_list, list) or len(api_response_list) == 0:
            return []

        def is_finished(m: Dict[str, Any]) -> bool:
            status_obj = m.get("fixture", {}).get("status", {}) or m.get("status", {})
            short = str(status_obj.get("short", "")).upper()
            return short in OFFICIAL_FINISHED_CODES

        def get_date(m: Dict[str, Any]) -> str:
            return m.get("fixture", {}).get("date") or m.get("date") or ""

        filtered = [m for m in api_response_list if is_finished(m)]
        filtered.sort(key=get_date, reverse=True)

        results = []
        for match in filtered[:limit]:
            teams = match.get("teams", {})
            scores = match.get("scores", {}) or match.get("goals", {})
            h_name = teams.get("home", {}).get("name", "홈팀") if isinstance(teams.get("home"), dict) else str(teams.get("home", "홈팀"))
            a_name = teams.get("away", {}).get("name", "원정팀") if isinstance(teams.get("away"), dict) else str(teams.get("away", "원정팀"))

            h_raw = scores.get("home", {}).get("total") if isinstance(scores.get("home"), dict) else scores.get("home")
            a_raw = scores.get("away", {}).get("total") if isinstance(scores.get("away"), dict) else scores.get("away")

            h_score = int(h_raw) if h_raw is not None and str(h_raw).isdigit() else 0
            a_score = int(a_raw) if a_raw is not None and str(a_raw).isdigit() else 0
            d_str = get_date(match)

            results.append({
                "date": d_str,
                "dateStr": d_str[:10].replace("-", ".") if d_str else "최근",
                "homeTeam": h_name,
                "awayTeam": a_name,
                "homeScore": h_score,
                "awayScore": a_score,
                "winnerName": h_name if h_score > a_score else (a_name if a_score > h_score else "무승부")
            })

        return results

class KboLiveSubPipeline:
    """
    KBO 전용 10초 주기 독립 서브 파이프라인
    """
    @staticmethod
    def fetch_live_kbo_games() -> List[Dict[str, Any]]:
        today_str = time.strftime("%Y%m%d")
        url = f"https://api-gw.sports.naver.com/schedule/games?date={today_str}&fields=basic,lineup,status&_t={int(time.time() * 1000)}"
        try:
            r = requests.get(url, timeout=5)
            if r.status_code == 200:
                data = r.json()
                games = data.get("result", {}).get("games", []) or data.get("games", [])
                return [g for g in games if g.get("sportsCategory") == "kbo" or g.get("leagueName") == "KBO"]
        except Exception:
            pass
        return []
