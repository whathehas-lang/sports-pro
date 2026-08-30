import json
import sys

sys.stdout.reconfigure(encoding='utf-8')

with open("betman_100_percent_real.json", "r", encoding="utf-8") as f:
    matches = json.load(f)

with open("fetched_squads_cache.json", "r", encoding="utf-8") as f:
    squads_cache = json.load(f)

print("Checking team names in Betman schedule for Korea, England, France, Germany...")

TEAM_ID_MAP = {
    # EPL
    "맨체스터시티": "50", "맨체스터유나이티드": "33", "맨체스터U": "33", "아스널": "42", "첼시": "49", "리버풀": "40",
    "토트넘": "47", "토트넘 홋스퍼": "47", "뉴캐슬": "34", "울버햄프턴": "39", "브라이턴": "51",
    "풀럼": "36", "웨스트햄": "48", "에버턴": "45", "노팅엄": "65", "브렌트퍼드": "55",
    "크리스털팰리스": "52", "본머스": "35", "애스턴빌라": "66", "사우샘프턴": "41", "레스터": "46", "입스위치": "57",
    # La Liga
    "바르셀로나": "529", "레알마드리드": "541", "아틀레티코": "530",
    # Bundesliga
    "바이에른뮌헨": "157", "도르트문트": "165", "라이프치히": "173", "레버쿠젠": "168",
    "슈투트가르트": "172", "프랑크푸르트": "169", "볼프스부르크": "161", "하이덴하임": "180",
    # Ligue 1
    "파리생제르맹": "85", "마르세유": "81", "모나코": "91", "릴": "79", "리옹": "80",
    # K-League
    "FC서울": "2748", "전북현대": "2749", "울산HD": "2750", "포항스틸러스": "2751", "수원삼성": "2752",
    "인천유나이티드": "2753", "강원FC": "2754", "제주유나이티드": "2755", "대구FC": "2756", "광주FC": "2757"
}

for m in matches:
    league = m.get("league", "")
    h = m.get("homeTeam", "")
    a = m.get("awayTeam", "")
    sport = m.get("sport", "")
    seq = m.get("seq", "")
    
    if any(k in league for k in ["EPL", "프리미어", "영국", "분데스", "독일", "리그앙", "프랑스", "라리가", "스페인", "K리그", "한국"]):
        # Check if matched in TEAM_ID_MAP
        h_matched = any(k in h or h in k for k in TEAM_ID_MAP)
        a_matched = any(k in a or a in k for k in TEAM_ID_MAP)
        print(f"[{seq}] {league} | {h} (matched: {h_matched}) vs {a} (matched: {a_matched})")

