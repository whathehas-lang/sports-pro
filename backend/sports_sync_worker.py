# -*- coding: utf-8 -*-
"""
SportsSyncWorker: API-Sports Data Fetcher & DB Synchronizer
- Synchronizes Today's games & Past 3 Days results
- Supported: Baseball (MLB, NPB, KBO, etc.) & Football
- Safe DB storage via SportsMasterDB
- NOTE: API-Sports endpoints reject unknown parameters like _t. Keep query params clean!
"""

import os
import sys
import time
import datetime
import requests
from typing import Dict, Any, List, Optional

# Ensure current directory is in sys.path
sys.path.append(os.path.dirname(__file__))
from sports_db import db

API_SPORTS_KEY = os.getenv("API_SPORTS_KEY", "96ae3619c2c6f8f76ec75d64bd95d000")
BASEBALL_URL = "https://v1.baseball.api-sports.io"
FOOTBALL_URL = "https://v3.football.api-sports.io"

HEADERS = {
    "x-apisports-key": API_SPORTS_KEY,
    "Cache-Control": "no-cache, no-store, must-revalidate",
    "Pragma": "no-cache"
}

class SportsSyncWorker:
    def __init__(self):
        self.api_key = API_SPORTS_KEY
        self.last_sync_time = 0
        self.is_syncing = False

    def sync_date_baseball(self, date_str: str) -> int:
        """
        Fetch all baseball games for a given date (YYYY-MM-DD)
        """
        total_saved = 0
        url = f"{BASEBALL_URL}/games?date={date_str}"
        try:
            r = requests.get(url, headers=HEADERS, timeout=12)
            if r.status_code != 200:
                print(f"[SportsSyncWorker] Baseball HTTP {r.status_code} for {date_str}")
                return 0
            data = r.json()
            games = data.get("response", [])
            for g in games:
                parsed = self._parse_baseball_game(g)
                if parsed:
                    db.upsert_match(parsed)
                    total_saved += 1
        except Exception as e:
            print(f"[SportsSyncWorker] Error fetching baseball for {date_str}: {e}")
        return total_saved

    def _parse_baseball_game(self, g: Dict[str, Any]) -> Optional[Dict[str, Any]]:
        try:
            game_id = f"bb_{g['id']}"
            teams = g.get("teams", {})
            home_team = teams.get("home", {}).get("name", "Home")
            away_team = teams.get("away", {}).get("name", "Away")
            
            scores = g.get("scores", {})
            home_score = scores.get("home", {}).get("total")
            away_score = scores.get("away", {}).get("total")

            status_obj = g.get("status", {})
            raw_status = str(status_obj.get("short", "NS")).upper()

            # Status normalization
            if raw_status in ["FT", "AOT", "POST", "FINAL"]:
                status = "FINISHED"
            elif raw_status in ["INP", "LIVE"] or "INNING" in raw_status:
                status = "LIVE"
            else:
                status = "SCHEDULED"

            status_detail = status_obj.get("long", "")
            raw_date = g.get("date", "")
            game_date = raw_date[:10] if len(raw_date) >= 10 else datetime.date.today().isoformat()
            game_time = g.get("time", "")

            return {
                "game_id": game_id,
                "sport": "baseball",
                "league_id": g.get("league", {}).get("id"),
                "league_name": g.get("league", {}).get("name", "Baseball"),
                "season": str(g.get("season", "")),
                "game_date": game_date,
                "game_time": game_time,
                "home_team": home_team,
                "away_team": away_team,
                "home_score": home_score if isinstance(home_score, int) else None,
                "away_score": away_score if isinstance(away_score, int) else None,
                "status": status,
                "status_detail": status_detail,
                "period_scores": scores.get("home", {}).get("innings", {}),
                "is_locked": 1 if status == "FINISHED" else 0
            }
        except Exception as e:
            print(f"[SportsSyncWorker] Baseball parse error: {e}")
            return None

    def sync_date_football(self, date_str: str) -> int:
        """
        Fetch football matches for a given date
        """
        total_saved = 0
        url = f"{FOOTBALL_URL}/fixtures?date={date_str}"
        try:
            r = requests.get(url, headers=HEADERS, timeout=12)
            if r.status_code != 200:
                print(f"[SportsSyncWorker] Football HTTP {r.status_code} for {date_str}")
                return 0
            data = r.json()
            fixtures = data.get("response", [])
            for f in fixtures[:50]:  # Top 50 fixtures per day to conserve bandwidth
                parsed = self._parse_football_fixture(f)
                if parsed:
                    db.upsert_match(parsed)
                    total_saved += 1
        except Exception as e:
            print(f"[SportsSyncWorker] Error fetching football for {date_str}: {e}")
        return total_saved

    def _parse_football_fixture(self, f: Dict[str, Any]) -> Optional[Dict[str, Any]]:
        try:
            fixture = f.get("fixture", {})
            game_id = f"fb_{fixture['id']}"
            teams = f.get("teams", {})
            home_team = teams.get("home", {}).get("name", "Home")
            away_team = teams.get("away", {}).get("name", "Away")
            
            goals = f.get("goals", {})
            home_score = goals.get("home")
            away_score = goals.get("away")

            status_obj = fixture.get("status", {})
            raw_status = str(status_obj.get("short", "NS")).upper()

            if raw_status in ["FT", "AET", "PEN"]:
                status = "FINISHED"
            elif raw_status in ["1H", "2H", "HT", "ET", "LIVE"]:
                status = "LIVE"
            else:
                status = "SCHEDULED"

            status_detail = status_obj.get("long", "")
            raw_date = fixture.get("date", "")
            game_date = raw_date[:10] if len(raw_date) >= 10 else datetime.date.today().isoformat()
            game_time = raw_date[11:16] if len(raw_date) >= 16 else ""

            return {
                "game_id": game_id,
                "sport": "football",
                "league_id": f.get("league", {}).get("id"),
                "league_name": f.get("league", {}).get("name", "Football"),
                "season": str(f.get("league", {}).get("season", "")),
                "game_date": game_date,
                "game_time": game_time,
                "home_team": home_team,
                "away_team": away_team,
                "home_score": home_score if isinstance(home_score, int) else None,
                "away_score": away_score if isinstance(away_score, int) else None,
                "status": status,
                "status_detail": status_detail,
                "period_scores": f.get("score", {}),
                "is_locked": 1 if status == "FINISHED" else 0
            }
        except Exception as e:
            return None

    def sync_past_days(self, days_back: int = 3) -> Dict[str, int]:
        """
        Synchronizes past N days (e.g. 3 days ago, 2 days ago, yesterday, today)
        """
        self.is_syncing = True
        results = {}
        today = datetime.date.today()
        for i in range(days_back, -1, -1):
            target_date = (today - datetime.timedelta(days=i)).isoformat()
            saved_bb = self.sync_date_baseball(target_date)
            saved_fb = self.sync_date_football(target_date)
            results[target_date] = saved_bb + saved_fb
            print(f"[SportsSyncWorker] Synced {target_date}: {saved_bb} baseball, {saved_fb} football games")
        
        self.last_sync_time = int(time.time())
        self.is_syncing = False
        return results

sync_worker = SportsSyncWorker()

if __name__ == "__main__":
    print("Testing SportsSyncWorker...")
    res = sync_worker.sync_past_days(days_back=3)
    print("Sync Result:", res)
    dates = db.get_distinct_dates()
    print("DB Dates:", dates)
    for d in dates:
        matches = db.get_matches_by_date(d)
        print(f"Date {d}: {len(matches)} matches in DB")
