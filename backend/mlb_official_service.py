import urllib.request
import json
import logging
from typing import Dict, Any, Optional, List

logger = logging.getLogger("mlb_official_service")

class MlbOfficialService:
    @staticmethod
    def get_live_games() -> List[Dict[str, Any]]:
        """Fetch today's MLB schedule and linescore from official MLB Stats API."""
        url = "https://statsapi.mlb.com/api/v1/schedule?sportId=1&hydrate=linescore,team"
        req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
        try:
            with urllib.request.urlopen(req, timeout=5) as res:
                data = json.loads(res.read().decode("utf-8"))
                games = []
                for d in data.get("dates", []):
                    for g in d.get("games", []):
                        games.append(g)
                return games
        except Exception as e:
            logger.error(f"Error fetching MLB schedule: {e}")
            return []

    @staticmethod
    def get_game_live_detail(game_pk: int) -> Optional[Dict[str, Any]]:
        """Fetch live pitch-by-pitch, runners, counts, scores from official MLB feed."""
        url = f"https://statsapi.mlb.com/api/v1.1/game/{game_pk}/feed/live"
        req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
        try:
            with urllib.request.urlopen(req, timeout=4) as res:
                data = json.loads(res.read().decode("utf-8"))
                live_data = data.get("liveData", {})
                linescore = live_data.get("linescore", {})
                teams = linescore.get("teams", {})
                current_play = live_data.get("plays", {}).get("currentPlay", {})
                game_data = data.get("gameData", {})
                status = game_data.get("status", {}).get("detailedState", "In Progress")

                away_team_data = game_data.get("teams", {}).get("away", {})
                home_team_data = game_data.get("teams", {}).get("home", {})

                inning = linescore.get("currentInningOrdinal", "1st")
                inning_state = linescore.get("inningState", "")  # Top, Bottom, Middle, End
                
                # Inning Korean translation
                inning_kr = inning.replace("1st", "1회").replace("2nd", "2회").replace("3rd", "3회")\
                                  .replace("4th", "4회").replace("5th", "5회").replace("6th", "6회")\
                                  .replace("7th", "7회").replace("8th", "8회").replace("9th", "9회")
                if inning_state == "Top":
                    inning_full = f"{inning_kr}초"
                elif inning_state == "Bottom":
                    inning_full = f"{inning_kr}말"
                elif inning_state in ["Middle", "End"]:
                    inning_full = f"{inning_kr} {inning_state}"
                else:
                    inning_full = inning_kr

                balls = linescore.get("balls", 0)
                strikes = linescore.get("strikes", 0)
                outs = linescore.get("outs", 0)

                away_score = teams.get("away", {}).get("runs", 0)
                home_score = teams.get("home", {}).get("runs", 0)

                offense = linescore.get("offense", {})
                runner_1b = offense.get("first") is not None
                runner_2b = offense.get("second") is not None
                runner_3b = offense.get("third") is not None

                batter = offense.get("batter", {}).get("fullName", "")
                pitcher = linescore.get("defense", {}).get("pitcher", {}).get("fullName", "")
                last_play = current_play.get("result", {}).get("description", "")

                return {
                    "gamePk": game_pk,
                    "status": status,
                    "isLive": "Progress" in status or "Live" in status,
                    "inning": inning_full,
                    "inningState": inning_state,
                    "balls": balls,
                    "strikes": strikes,
                    "outs": outs,
                    "homeScore": home_score,
                    "awayScore": away_score,
                    "homeTeam": "LA 다저스" if "Dodgers" in home_team_data.get("name", "") else home_team_data.get("name", ""),
                    "awayTeam": "세인트루이스" if "Cardinals" in away_team_data.get("name", "") else away_team_data.get("name", ""),
                    "bases": {
                        "first": runner_1b,
                        "second": runner_2b,
                        "third": runner_3b
                    },
                    "pitcher": pitcher,
                    "batter": batter,
                    "lastPlay": last_play
                }
        except Exception as e:
            logger.error(f"Error fetching game {game_pk} live: {e}")
            return None

if __name__ == "__main__":
    detail = MlbOfficialService.get_game_live_detail(823907)
    print("Fetched detail:", json.dumps(detail, ensure_ascii=True))
