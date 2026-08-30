import requests
import json
import time
import sys

sys.stdout.reconfigure(encoding='utf-8')

api_key = "78E5418A27df6C588D10823E3D22C5fa"
headers = {"x-apisports-key": api_key}

# Load existing cache
with open("fetched_squads_cache.json", "r", encoding="utf-8") as f:
    squads_cache = json.load(f)

# J-League / European / K-League Team IDs to fetch
MORE_TEAMS = {
    "시미즈 에스펄스": 301,
    "미토 홀리호크": 304,
    "FC마치다 젤비아": 1549,
    "이와키FC": 10404,
    "도치기 시티FC": 307,
    "주빌로 이와타": 289,
    "알비렉스 니가타": 296,
    "FC이마바리": 10403,
    "몬테디오 야마가타": 303,
    "아비스파 후쿠오카": 302,
    "콘사도레 삿포로": 288,
    "가시와 레이솔": 305,
    "제프 유나이티드": 306,
    "도쿠시마 보르티스": 308,
    "반포레 고후": 309,
    "파지아노 오카야마": 310,
    "요코하마FC": 311,
    "도쿄 베르디": 312,
    "렝스": 93,
    "툴루즈": 96,
    "낭트": 83,
    "렌": 94,
    "스타라스부르": 95,
    "브레스트": 1063,
    "생테티엔": 1062,
    "앙제": 77,
    "옥세르": 1061,
    "헤타페": 546,
    "지로나": 547,
    "라스팔마스": 534,
    "마요르카": 798,
    "셀타비고": 538,
    "알라베스": 542,
    "에스파뇰": 540,
    "바야돌리드": 720,
    "레가네스": 537,
    "오사수나": 727,
    "하이덴하임": 180,
    "아우크스부르크": 170,
    "베르더브레멘": 162,
    "프라이부르크": 160,
    "마인츠": 164,
    "보훔": 176,
    "장크트파울리": 186,
    "홀슈타인킬": 191,
    "묀헨글라트바흐": 163,
    "우니온베를린": 182,
    "호펜하임": 167
}

print(f"Fetching additional {len(MORE_TEAMS)} teams squads...")

for name, tid in MORE_TEAMS.items():
    str_tid = str(tid)
    if str_tid in squads_cache and len(squads_cache[str_tid]) > 0:
        continue
    url = "https://v3.football.api-sports.io/players/squads"
    try:
        res = requests.get(url, headers=headers, params={"team": tid}, timeout=10)
        if res.status_code == 200:
            data = res.json()
            players = data.get("response", [{}])[0].get("players", [])
            if players:
                squads_cache[str_tid] = players
                print(f" -> Fetched [{name}] (ID: {tid}): {len(players)} players (e.g. {players[0].get('name')})")
                time.sleep(0.08)
    except Exception as e:
        print(f"Error fetching {name} ({tid}): {e}")

with open("fetched_squads_cache.json", "w", encoding="utf-8") as f:
    json.dump(squads_cache, f, ensure_ascii=False, indent=2)

print(f"Total squads cached now: {len(squads_cache)}")
