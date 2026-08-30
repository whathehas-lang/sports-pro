import requests
import json
import time
import os
import sys

sys.stdout.reconfigure(encoding='utf-8')

api_key = "78E5418A27df6C588D10823E3D22C5fa"
headers = {"x-apisports-key": api_key}

# Load 105 authentic Betman matches
with open("betman_100_percent_real.json", "r", encoding="utf-8") as f:
    betman_matches = json.load(f)

# Load cached squads if available
cache_file = "fetched_squads_cache.json"
if os.path.exists(cache_file):
    with open(cache_file, "r", encoding="utf-8") as f:
        squads_cache = json.load(f)
else:
    squads_cache = {}

print(f"Loaded {len(betman_matches)} authentic Betman matches and {len(squads_cache)} cached team squads.")

# Team ID map for key teams across EPL, La Liga, Bundesliga, Serie A, Ligue 1, K-League, J-League
TEAM_ID_MAP = {
    # EPL
    "맨체스터시티": 50, "맨체스터유나이티드": 33, "아스널": 42, "첼시": 49, "리버풀": 40,
    "토트넘": 47, "토트넘 홋스퍼": 47, "뉴캐슬": 34, "울버햄프턴": 39, "브라이턴": 51,
    "풀럼": 36, "웨스트햄": 48, "에버턴": 45, "노팅엄": 65, "브렌트퍼드": 55,
    "크리스털팰리스": 52, "본머스": 35, "애스턴빌라": 66, "사우샘프턴": 41, "레스터": 46, "입스위치": 57,
    # La Liga
    "바르셀로나": 529, "레알마드리드": 541, "아틀레티코": 530, "아틀레티코 마드리드": 530,
    "비야레알": 533, "세비야": 536, "소시에다드": 548, "발렌시아": 532, "헤타페": 546,
    # Bundesliga
    "바이에른뮌헨": 157, "도르트문트": 165, "라이프치히": 173, "레버쿠젠": 168,
    "슈투트가르트": 172, "프랑크푸르트": 169, "볼프스부르크": 161,
    # Serie A
    "인터밀란": 505, "유벤투스": 496, "AC밀란": 489, "AS로마": 497, "나폴리": 492, "라치오": 487, "아탈란타": 499,
    # Ligue 1
    "파리생제르맹": 85, "마르세유": 81, "모나코": 91, "릴": 79, "리옹": 80,
    # K-League
    "FC서울": 2748, "전북현대": 2749, "울산HD": 2750, "포항스틸러스": 2751, "수원삼성": 2752,
    "인천유나이티드": 2753, "강원FC": 2754, "제주유나이티드": 2755, "대구FC": 2756, "광주FC": 2757,
    # J-League
    "감바 오사카": 294, "산프레체 히로시마": 295, "가와사키 프론탈레": 292, "비셀 고베": 291,
    "요코하마 F. 마리노스": 286, "우라와 레즈": 287, "가시마 앤틀러스": 285, "나고야 그램퍼스": 297,
    "FC도쿄": 290, "세레소 오사카": 293, "쇼난 벨마레": 299, "교토 상가": 300, "사간 도스": 298
}

def fetch_squad_for_team(tid):
    str_tid = str(tid)
    if str_tid in squads_cache and len(squads_cache[str_tid]) > 0:
        return squads_cache[str_tid]
    url = "https://v3.football.api-sports.io/players/squads"
    try:
        res = requests.get(url, headers=headers, params={"team": tid}, timeout=10)
        if res.status_code == 200:
            data = res.json()
            players = data.get("response", [{}])[0].get("players", [])
            squads_cache[str_tid] = players
            print(f" -> Fetched real squad for Team ID {tid}: {len(players)} players")
            time.sleep(0.05)
            return players
    except Exception as e:
        print(f"Error fetching squad for {tid}: {e}")
    return []

# Fetch all mapped teams
for name, tid in TEAM_ID_MAP.items():
    fetch_squad_for_team(tid)

# Save updated cache
with open("fetched_squads_cache.json", "w", encoding="utf-8") as f:
    json.dump(squads_cache, f, ensure_ascii=False, indent=2)

print(f"All squads cached. Now building 100% real player lineup models...")
