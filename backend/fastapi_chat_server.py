# -*- coding: utf-8 -*-
"""
🔥 TOKEON SPORTS - Python FastAPI WebSocket Real-time Match Chat & Live Game State Server
포트: 8001
기능:
1. 472개 전 경기별 독립 톡방 관리 (/ws/chat/{match_id})
2. 야구 다이아몬드 주자(1·2·3루) 실시간 점등 & 스코어/이닝 브로드캐스트
3. 렉 제로(0.01초) 양방향 대화 및 최근 50개 대화 복원
4. 시스템 주요 이벤트(홈런, 골, 역전) 황금색 톡방 자동 브로드캐스트
"""

import asyncio
import json
import time
from typing import Dict, List, Set, Optional
from fastapi import FastAPI, WebSocket, WebSocketDisconnect, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

app = FastAPI(
    title="Tokeon Sports Live Chat & WebSocket State Server",
    version="2.0.0",
    description="파이썬 FastAPI 기반 초고속 스포츠 실시간 경기 톡방 및 다이아몬드 주자 점등 브로드캐스터"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ChatMessage(BaseModel):
    id: str
    match_id: str
    sender: str
    text: str
    timestamp: str
    is_vip: bool = False
    badge: Optional[str] = None

class LiveMatchState(BaseModel):
    match_id: str
    sport: str = "baseball"
    status: str = "LIVE"
    inning_or_time: str = "7회초"
    home_score: int = 4
    away_score: int = 2
    outs: int = 1
    balls: int = 2
    strikes: int = 1
    runner_first: bool = True
    runner_second: bool = False
    runner_third: bool = True
    recent_event_text: Optional[str] = "🔥 7회초 1사 1·3루 득점권 찬스 전개중"

class MatchRoomManager:
    def __init__(self):
        self.rooms: Dict[str, Set[WebSocket]] = {}
        self.history: Dict[str, List[dict]] = {}
        self.live_states: Dict[str, dict] = {}

    def get_room_clients(self, match_id: str) -> Set[WebSocket]:
        if match_id not in self.rooms:
            self.rooms[match_id] = set()
        return self.rooms[match_id]

    async def connect(self, match_id: str, websocket: WebSocket):
        await websocket.accept()
        clients = self.get_room_clients(match_id)
        clients.add(websocket)
        
        is_dodgers = "184927" in match_id or "823907" in match_id or "dodger" in match_id.lower()
        if is_dodgers:
            try:
                mlb_live = MlbOfficialService.get_game_live_detail(823907)
                if mlb_live:
                    self.live_states[match_id] = {
                        "match_id": match_id,
                        "sport": "baseball",
                        "status": "LIVE" if mlb_live.get("isLive") else mlb_live.get("status", "LIVE"),
                        "inning_or_time": mlb_live.get("inning", "2회말"),
                        "home_score": mlb_live.get("homeScore", 0),
                        "away_score": mlb_live.get("awayScore", 1),
                        "outs": mlb_live.get("outs", 0),
                        "balls": mlb_live.get("balls", 0),
                        "strikes": mlb_live.get("strikes", 0),
                        "runner_first": mlb_live.get("bases", {}).get("first", False),
                        "runner_second": mlb_live.get("bases", {}).get("second", False),
                        "runner_third": mlb_live.get("bases", {}).get("third", False),
                        "pitcher": mlb_live.get("pitcher", ""),
                        "batter": mlb_live.get("batter", ""),
                        "recent_event_text": mlb_live.get("lastPlay") or f"⚡ {mlb_live.get('inning', '')} 진행중 | 투수 {mlb_live.get('pitcher', '')} vs 타자 {mlb_live.get('batter', '')}"
                    }
            except Exception as e:
                print("Error loading MLB live in connect:", e)
        elif match_id not in self.live_states:
            db_m = sports_db.get_match_by_id(match_id)
            if db_m:
                st = db_m.get("status", "SCHEDULED")
                h_sc = db_m.get("home_score", 0) if db_m.get("home_score") is not None else 0
                a_sc = db_m.get("away_score", 0) if db_m.get("away_score") is not None else 0
                detail = db_m.get("status_detail", "") or ("경기종료" if st == "FINISHED" else "경기예정")
                self.live_states[match_id] = {
                    "match_id": match_id,
                    "sport": db_m.get("sport", "baseball"),
                    "status": st,
                    "inning_or_time": detail,
                    "home_score": h_sc,
                    "away_score": a_sc,
                    "outs": 0,
                    "balls": 0,
                    "strikes": 0,
                    "runner_first": False,
                    "runner_second": False,
                    "runner_third": False,
                    "recent_event_text": f"경기 상태: {detail}"
                }
            else:
                self.live_states[match_id] = {
                    "match_id": match_id,
                    "sport": "baseball",
                    "status": "SCHEDULED",
                    "inning_or_time": "경기예정",
                    "home_score": 0,
                    "away_score": 0,
                    "outs": 0,
                    "balls": 0,
                    "strikes": 0,
                    "runner_first": False,
                    "runner_second": False,
                    "runner_third": False,
                    "recent_event_text": "⏱️ 경기 시작 대기 중입니다."
                }

        if match_id not in self.history:
            self.history[match_id] = [
                {
                    "id": f"msg_init_{int(time.time()*1000)}_1",
                    "match_id": match_id,
                    "sender": "⚡ 토큰시스템",
                    "text": "실시간 공식 경기 톡방에 입장하셨습니다! 매너 채팅을 준수해 주세요.",
                    "timestamp": time.strftime("%H:%M"),
                    "is_vip": True,
                    "badge": "공지"
                }
            ]

        init_payload = {
            "type": "INIT_ROOM_DATA",
            "match_id": match_id,
            "connected_users": len(clients),
            "live_state": self.live_states[match_id],
            "history": self.history[match_id][-50:]
        }
        await websocket.send_text(json.dumps(init_payload, ensure_ascii=False))
        await self.broadcast_user_count(match_id)

    def disconnect(self, match_id: str, websocket: WebSocket):
        clients = self.get_room_clients(match_id)
        if websocket in clients:
            clients.remove(websocket)

    async def broadcast_user_count(self, match_id: str):
        clients = self.get_room_clients(match_id)
        payload = {
            "type": "USER_COUNT_UPDATE",
            "match_id": match_id,
            "connected_users": max(1, len(clients))
        }
        await self.broadcast(match_id, payload)

    async def broadcast(self, match_id: str, message_dict: dict):
        clients = self.get_room_clients(match_id)
        dead_sockets = set()
        msg_text = json.dumps(message_dict, ensure_ascii=False)
        for client in list(clients):
            try:
                await client.send_text(msg_text)
            except Exception:
                dead_sockets.add(client)
        for dead in dead_sockets:
            clients.remove(dead)

    async def add_and_broadcast_message(self, match_id: str, msg_data: dict):
        if match_id not in self.history:
            self.history[match_id] = []
        self.history[match_id].append(msg_data)
        if len(self.history[match_id]) > 100:
            self.history[match_id] = self.history[match_id][-100:]

        payload = {
            "type": "NEW_CHAT_MESSAGE",
            "match_id": match_id,
            "message": msg_data
        }
        await self.broadcast(match_id, payload)

    async def update_and_broadcast_state(self, match_id: str, state_data: dict):
        self.live_states[match_id] = state_data
        payload = {
            "type": "LIVE_STATE_UPDATE",
            "match_id": match_id,
            "live_state": state_data
        }
        await self.broadcast(match_id, payload)

manager = MatchRoomManager()

@app.get("/health")
def health_check():
    return {
        "status": "OK",
        "service": "Tokeon FastAPI WebSocket Server",
        "active_rooms": len(manager.rooms),
        "total_connections": sum(len(c) for c in manager.rooms.values())
    }

@app.get("/api/matches/{match_id}/live")
def get_live_state(match_id: str):
    if match_id in manager.live_states:
        return manager.live_states[match_id]
    return {
        "match_id": match_id,
        "sport": "baseball",
        "status": "SCHEDULED",
        "inning_or_time": "경기 전",
        "home_score": 0,
        "away_score": 0,
        "runner_first": False,
        "runner_second": False,
        "runner_third": False
    }

@app.post("/api/matches/{match_id}/live")
async def update_live_state(match_id: str, state: LiveMatchState):
    state_dict = state.dict()
    await manager.update_and_broadcast_state(match_id, state_dict)
    return {"status": "SUCCESS", "live_state": state_dict}

@app.get("/api/matches/{match_id}/chat/history")
def get_chat_history(match_id: str):
    return {
        "match_id": match_id,
        "messages": manager.history.get(match_id, [])
    }

@app.post("/api/matches/{match_id}/chat/system_announcement")
async def post_system_announcement(match_id: str, text: str):
    msg = {
        "id": f"ann_{int(time.time()*1000)}",
        "match_id": match_id,
        "sender": "⚡ 시스템 알림",
        "text": text,
        "timestamp": time.strftime("%H:%M"),
        "is_vip": True,
        "badge": "속보"
    }
    await manager.add_and_broadcast_message(match_id, msg)
    return {"status": "SUCCESS", "message": msg}

# -------------------------------------------------------------
# 🎯 배트맨(Betman) 100% 무인 자동 수집 & 자가 무결성 검증 API
# -------------------------------------------------------------
try:
    from backend.betman_sync_service import betman_engine
except ImportError:
    from betman_sync_service import betman_engine

try:
    from backend.sports_db import db as sports_db
    from backend.sports_sync_worker import sync_worker as sports_sync_worker
    from backend.mlb_official_service import MlbOfficialService
except ImportError:
    from sports_db import db as sports_db
    from sports_sync_worker import sync_worker as sports_sync_worker
    from mlb_official_service import MlbOfficialService

@app.get("/api/betman/schedule")
def get_betman_schedule():
    return {
        "round": betman_engine.current_round,
        "syncTime": betman_engine.last_sync_time,
        "totalMatches": len(betman_engine.matches),
        "verification": betman_engine.verification_status,
        "matches": betman_engine.matches
    }

@app.get("/api/betman/status")
def get_betman_status():
    return {
        "round": betman_engine.current_round,
        "syncTime": betman_engine.last_sync_time,
        "totalMatches": len(betman_engine.matches),
        "verification": betman_engine.verification_status,
        "isSyncing": betman_engine.is_syncing,
        "lastError": betman_engine.last_error
    }

@app.post("/api/betman/sync")
async def trigger_betman_sync(force_round: Optional[int] = None):
    loop = asyncio.get_event_loop()
    res = await loop.run_in_executor(None, betman_engine.sync_from_betman, force_round)
    return res

# 🏆 SPORTS MASTER DB ENDPOINTS (API-Sports Persistent Storage)
@app.get("/api/sports/dates")
def get_sports_available_dates():
    return {
        "dates": sports_db.get_distinct_dates()
    }

@app.get("/api/sports/matches")
def get_sports_matches(date: Optional[str] = None, sport: Optional[str] = None):
    target_date = date or time.strftime("%Y-%m-%d")
    matches = sports_db.get_matches_by_date(target_date, sport)
    return {
        "date": target_date,
        "total": len(matches),
        "matches": matches
    }

@app.get("/api/sports/live")
def get_sports_live_matches():
    live_matches = sports_db.get_live_matches()
    return {
        "total": len(live_matches),
        "matches": live_matches
    }

@app.post("/api/sports/sync")
async def trigger_sports_sync(days: int = 3):
    loop = asyncio.get_event_loop()
    res = await loop.run_in_executor(None, sports_sync_worker.sync_past_days, days)
    return {
        "status": "success",
        "synced": res
    }

@app.websocket("/ws/chat/{match_id}")
async def websocket_chat_endpoint(websocket: WebSocket, match_id: str):
    await manager.connect(match_id, websocket)
    try:
        while True:
            data_text = await websocket.receive_text()
            try:
                data = json.loads(data_text)
                msg_type = data.get("type", "CHAT")

                if msg_type == "CHAT":
                    sender = data.get("sender", "익명유저")
                    text = data.get("text", "").strip()
                    if text:
                        new_msg = {
                            "id": f"msg_{int(time.time()*1000)}_{int(time.time())%100}",
                            "match_id": match_id,
                            "sender": sender,
                            "text": text,
                            "timestamp": time.strftime("%H:%M"),
                            "is_vip": data.get("is_vip", False),
                            "badge": data.get("badge", "회원")
                        }
                        await manager.add_and_broadcast_message(match_id, new_msg)

                elif msg_type == "UPDATE_RUNNERS":
                    cur_state = manager.live_states.get(match_id, {})
                    cur_state["runner_first"] = bool(data.get("runner_first", cur_state.get("runner_first", False)))
                    cur_state["runner_second"] = bool(data.get("runner_second", cur_state.get("runner_second", False)))
                    cur_state["runner_third"] = bool(data.get("runner_third", cur_state.get("runner_third", False)))
                    if "inning_or_time" in data:
                        cur_state["inning_or_time"] = data["inning_or_time"]
                    if "home_score" in data:
                        cur_state["home_score"] = int(data["home_score"])
                    if "away_score" in data:
                        cur_state["away_score"] = int(data["away_score"])
                    await manager.update_and_broadcast_state(match_id, cur_state)

            except json.JSONDecodeError:
                pass

    except WebSocketDisconnect:
        manager.disconnect(match_id, websocket)
        await manager.broadcast_user_count(match_id)
    except Exception:
        manager.disconnect(match_id, websocket)
        await manager.broadcast_user_count(match_id)

async def mlb_live_stream_task():
    """Background task to poll MLB official feed every 3 seconds for active rooms."""
    while True:
        try:
            active_rooms = [r for r in list(manager.rooms.keys()) if len(manager.get_room_clients(r)) > 0]
            for match_id in active_rooms:
                if "184927" in match_id or "823907" in match_id or "dodger" in match_id.lower():
                    mlb_live = MlbOfficialService.get_game_live_detail(823907)
                    if mlb_live:
                        cur_state = {
                            "match_id": match_id,
                            "sport": "baseball",
                            "status": "LIVE" if mlb_live.get("isLive") else mlb_live.get("status", "LIVE"),
                            "inning_or_time": mlb_live.get("inning", "2회말"),
                            "home_score": mlb_live.get("homeScore", 0),
                            "away_score": mlb_live.get("awayScore", 1),
                            "outs": mlb_live.get("outs", 0),
                            "balls": mlb_live.get("balls", 0),
                            "strikes": mlb_live.get("strikes", 0),
                            "runner_first": mlb_live.get("bases", {}).get("first", False),
                            "runner_second": mlb_live.get("bases", {}).get("second", False),
                            "runner_third": mlb_live.get("bases", {}).get("third", False),
                            "pitcher": mlb_live.get("pitcher", ""),
                            "batter": mlb_live.get("batter", ""),
                            "recent_event_text": mlb_live.get("lastPlay") or f"⚡ {mlb_live.get('inning', '')} 진행중 | 투수 {mlb_live.get('pitcher', '')} vs 타자 {mlb_live.get('batter', '')}"
                        }
                        await manager.update_and_broadcast_state(match_id, cur_state)
                        # Sync to SQLite DB for Dodgers
                        sports_db.upsert_match({
                            "game_id": "bb_184927",
                            "sport": "baseball",
                            "game_date": "2026-09-04",
                            "home_team": "LA 다저스",
                            "away_team": "세인트루이스",
                            "home_score": mlb_live.get("homeScore", 0),
                            "away_score": mlb_live.get("awayScore", 1),
                            "status": "LIVE",
                            "status_detail": f"{mlb_live.get('inning', '')} 진행중",
                            "updated_at": int(time.time())
                        })
        except Exception as e:
            print("Error in mlb_live_stream_task:", e)
        await asyncio.sleep(3)

@app.on_event("startup")
async def on_server_startup():
    asyncio.create_task(mlb_live_stream_task())

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)
