import requests
import json
import sys
from korean_phonetics_engine import transliterate_to_korean

sys.stdout.reconfigure(encoding='utf-8')

API_KEY = "78E5418A27df6C588D10823E3D22C5fa"
HEADERS = {"x-apisports-key": API_KEY}

TEAMS = [
    {"name": "본머스", "id": 35},
    {"name": "에버턴", "id": 45},
    {"name": "토트넘 홋스퍼", "id": 47},
    {"name": "뉴캐슬 유나이티드", "id": 34},
    {"name": "첼시", "id": 49},
    {"name": "맨체스터 유나이티드", "id": 33},
    {"name": "유벤투스", "id": 496},
    {"name": "인터 밀란", "id": 505}
]

print("=== REAL API-FOOTBALL LAST FIXTURE GOALSCORERS & ASSISTS ===")
for t in TEAMS:
    # 1. Get last fixture ID
    url = f"https://v3.football.api-sports.io/fixtures?team={t['id']}&last=1"
    try:
        res = requests.get(url, headers=HEADERS, timeout=10).json()
        fixtures = res.get("response", [])
        if fixtures:
            fix = fixtures[0]
            fid = fix["fixture"]["id"]
            date_str = fix["fixture"]["date"][:10]
            h_name = fix["teams"]["home"]["name"]
            a_name = fix["teams"]["away"]["name"]
            score = f"{fix['goals']['home']}:{fix['goals']['away']}"
            
            # 2. Get events for this fixture
            ev_url = f"https://v3.football.api-sports.io/fixtures/events?fixture={fid}"
            ev_res = requests.get(ev_url, headers=HEADERS, timeout=10).json()
            events = ev_res.get("response", [])
            
            goals = []
            assists = []
            for ev in events:
                if ev.get("team", {}).get("id") == t["id"]:
                    if ev.get("type") == "Goal":
                        p_name = ev.get("player", {}).get("name", "")
                        a_name = ev.get("assist", {}).get("name", "")
                        if p_name:
                            goals.append(transliterate_to_korean(p_name))
                        if a_name:
                            assists.append(transliterate_to_korean(a_name))
            
            print(f"[{t['name']}] 직전경기 ({date_str} {h_name} vs {a_name} {score})")
            print(f"  - ⚽ 실제 득점자: {', '.join(goals) if goals else '무득점'}")
            print(f"  - 🅰️ 실제 어시스트: {', '.join(assists) if assists else '없음'}")
    except Exception as e:
        print(f"[{t['name']}] Error: {e}")
