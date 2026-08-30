import requests
import json
import time
import sys

sys.stdout.reconfigure(encoding='utf-8')

api_key = "78E5418A27df6C588D10823E3D22C5fa"
headers = {"x-apisports-key": api_key}

# Team name mapping to API-Football Search queries / IDs
TEAM_SEARCH_MAP = {
    "맨체스터U": 33,
    "맨체스터시티": 50,
    "아스널": 42,
    "첼시": 49,
    "리버풀": 40,
    "토트넘": 47,
    "뉴캐슬": 34,
    "바르셀로나": 529,
    "레알마드리드": 541,
    "아틀레티코": 530,
    "바이에른뮌헨": 157,
    "도르트문트": 165,
    "라이프치히": 173,
    "레버쿠젠": 168,
    "인터밀란": 505,
    "유벤투스": 496,
    "AC밀란": 489,
    "AS로마": 497,
    "나폴리": 492,
    "파리생제르맹": 85,
    "마르세유": 81,
    "모나코": 91,
    "울버햄프턴": 39,
    "브라이턴": 51,
    "풀럼": 36,
    "웨스트햄": 48,
    "에버턴": 45,
    "노팅엄": 65,
    "브렌트퍼드": 55,
    "크리스털팰리스": 52,
    "본머스": 35,
    "애스턴빌라": 66,
    "사우샘프턴": 41,
    "레스터": 46,
    "입스위치": 57,
    "리즈": 63,
    "선덜랜드": 71,
    "웨스트브롬": 60,
    "FC서울": 2748,
    "전북현대": 2749,
    "울산HD": 2750,
    "포항스틸러스": 2751,
    "수원삼성": 2752,
    "인천유나이티드": 2753,
    "강원FC": 2754,
    "제주유나이티드": 2755,
    "대구FC": 2756,
    "광주FC": 2757,
    "대전하나": 2758,
    "김천상무": 2759
}

print(f"Total mapped team search queries: {len(TEAM_SEARCH_MAP)}")

# Function to fetch squad for a team
squad_cache = {}
def get_team_squad(team_id):
    if team_id in squad_cache:
        return squad_cache[team_id]
    url = "https://v3.football.api-sports.io/players/squads"
    try:
        res = requests.get(url, headers=headers, params={"team": team_id}, timeout=10)
        if res.status_code == 200:
            data = res.json()
            players = data.get("response", [{}])[0].get("players", [])
            squad_cache[team_id] = players
            print(f" -> Fetched Team {team_id}: {len(players)} players")
            time.sleep(0.1) # Respect rate limits
            return players
    except Exception as e:
        print(f"Error fetching team {team_id}: {e}")
    return []

# Prefetch top teams
for name, tid in list(TEAM_SEARCH_MAP.items())[:10]:
    get_team_squad(tid)

with open("fetched_squads_cache.json", "w", encoding="utf-8") as f:
    json.dump(squad_cache, f, ensure_ascii=False, indent=2)

print("Saved fetched_squads_cache.json")
