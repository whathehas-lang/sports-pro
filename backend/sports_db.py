# -*- coding: utf-8 -*-
"""
SportsMasterDB: SQLite Persistent Database Engine for Sports Matches
- WAL mode for zero-lock concurrent reads and writes
- Full UPSERT support on game_id
- Stores today's games, live scores, and past games (e.g. 3 days ago)
"""

import sqlite3
import os
import json
import time
from typing import Dict, Any, List, Optional

DB_DIR = os.path.join(os.path.dirname(__file__), "data")
DB_PATH = os.path.join(DB_DIR, "sports_master.db")

class SportsMasterDB:
    def __init__(self, db_path: str = DB_PATH):
        self.db_path = db_path
        os.makedirs(os.path.dirname(self.db_path), exist_ok=True)
        self._init_db()

    def _get_connection(self) -> sqlite3.Connection:
        conn = sqlite3.connect(self.db_path, timeout=20.0)
        conn.row_factory = sqlite3.Row
        # WAL mode ensures readers never block writers and writers never block readers
        conn.execute("PRAGMA journal_mode=WAL;")
        conn.execute("PRAGMA synchronous=NORMAL;")
        return conn

    def _init_db(self):
        with self._get_connection() as conn:
            conn.execute("""
                CREATE TABLE IF NOT EXISTS matches (
                    game_id TEXT PRIMARY KEY,
                    sport TEXT NOT NULL,
                    league_id INTEGER,
                    league_name TEXT,
                    season TEXT,
                    game_date TEXT NOT NULL,
                    game_time TEXT,
                    home_team TEXT NOT NULL,
                    away_team TEXT NOT NULL,
                    home_score INTEGER,
                    away_score INTEGER,
                    status TEXT NOT NULL DEFAULT 'SCHEDULED',
                    status_detail TEXT,
                    period_scores_json TEXT,
                    stats_json TEXT,
                    is_locked INTEGER DEFAULT 0,
                    updated_at INTEGER NOT NULL
                );
            """)
            conn.execute("CREATE INDEX IF NOT EXISTS idx_matches_date ON matches(game_date);")
            conn.execute("CREATE INDEX IF NOT EXISTS idx_matches_sport ON matches(sport);")
            conn.execute("CREATE INDEX IF NOT EXISTS idx_matches_status ON matches(status);")
            conn.commit()

    def upsert_match(self, match_data: Dict[str, Any]) -> bool:
        """
        UPSERT a match into DB.
        If the match is already locked (FINISHED), prevents unwanted score degradation.
        """
        game_id = str(match_data["game_id"])
        sport = match_data.get("sport", "baseball")
        league_id = match_data.get("league_id")
        league_name = match_data.get("league_name", "")
        season = str(match_data.get("season", ""))
        game_date = str(match_data.get("game_date", ""))
        game_time = str(match_data.get("game_time", ""))
        home_team = str(match_data.get("home_team", ""))
        away_team = str(match_data.get("away_team", ""))
        home_score = match_data.get("home_score")
        away_score = match_data.get("away_score")
        status = str(match_data.get("status", "SCHEDULED")).upper()
        status_detail = str(match_data.get("status_detail", ""))
        period_scores_json = json.dumps(match_data.get("period_scores", {}), ensure_ascii=False) if isinstance(match_data.get("period_scores"), (dict, list)) else "{}"
        stats_json = json.dumps(match_data.get("stats", {}), ensure_ascii=False) if isinstance(match_data.get("stats"), (dict, list)) else "{}"
        is_locked = 1 if status in ["FINISHED", "FT", "AET", "FINAL", "POST"] else int(match_data.get("is_locked", 0))
        now_ts = int(time.time())

        sql = """
            INSERT INTO matches (
                game_id, sport, league_id, league_name, season,
                game_date, game_time, home_team, away_team,
                home_score, away_score, status, status_detail,
                period_scores_json, stats_json, is_locked, updated_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            ON CONFLICT(game_id) DO UPDATE SET
                sport = excluded.sport,
                league_id = excluded.league_id,
                league_name = excluded.league_name,
                season = excluded.season,
                game_date = excluded.game_date,
                game_time = excluded.game_time,
                home_team = excluded.home_team,
                away_team = excluded.away_team,
                home_score = CASE 
                    WHEN matches.is_locked = 1 THEN matches.home_score
                    WHEN excluded.home_score IS NOT NULL AND excluded.home_score >= 0 THEN excluded.home_score
                    ELSE matches.home_score
                END,
                away_score = CASE 
                    WHEN matches.is_locked = 1 THEN matches.away_score
                    WHEN excluded.away_score IS NOT NULL AND excluded.away_score >= 0 THEN excluded.away_score
                    ELSE matches.away_score
                END,
                status = CASE 
                    WHEN matches.is_locked = 1 THEN matches.status
                    ELSE excluded.status
                END,
                status_detail = excluded.status_detail,
                period_scores_json = excluded.period_scores_json,
                stats_json = CASE WHEN excluded.stats_json != '{}' THEN excluded.stats_json ELSE matches.stats_json END,
                is_locked = CASE WHEN excluded.is_locked = 1 THEN 1 ELSE matches.is_locked END,
                updated_at = excluded.updated_at;
        """
        with self._get_connection() as conn:
            conn.execute(sql, (
                game_id, sport, league_id, league_name, season,
                game_date, game_time, home_team, away_team,
                home_score, away_score, status, status_detail,
                period_scores_json, stats_json, is_locked, now_ts
            ))
            conn.commit()
        return True

    def get_matches_by_date(self, game_date: str, sport: Optional[str] = None) -> List[Dict[str, Any]]:
        with self._get_connection() as conn:
            if sport:
                cur = conn.execute(
                    "SELECT * FROM matches WHERE game_date = ? AND sport = ? ORDER BY game_time ASC, game_id ASC",
                    (game_date, sport)
                )
            else:
                cur = conn.execute(
                    "SELECT * FROM matches WHERE game_date = ? ORDER BY sport ASC, game_time ASC, game_id ASC",
                    (game_date,)
                )
            rows = cur.fetchall()
            return [dict(row) for row in rows]

    def get_live_matches(self) -> List[Dict[str, Any]]:
        with self._get_connection() as conn:
            cur = conn.execute(
                "SELECT * FROM matches WHERE status = 'LIVE' ORDER BY updated_at DESC"
            )
            return [dict(row) for row in cur.fetchall()]

    def get_distinct_dates(self) -> List[str]:
        with self._get_connection() as conn:
            cur = conn.execute("SELECT DISTINCT game_date FROM matches ORDER BY game_date DESC LIMIT 14")
            return [row["game_date"] for row in cur.fetchall()]

    def get_match_by_id(self, game_id: str) -> Optional[Dict[str, Any]]:
        with self._get_connection() as conn:
            cur = conn.execute("SELECT * FROM matches WHERE game_id = ?", (str(game_id),))
            row = cur.fetchone()
            return dict(row) if row else None

db = SportsMasterDB()
