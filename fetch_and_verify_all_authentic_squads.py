import requests
import json
import time
import re
import sys

sys.stdout.reconfigure(encoding='utf-8')

api_key = "78E5418A27df6C588D10823E3D22C5fa"
headers = {"x-apisports-key": api_key}

# 1. Exact verified team IDs from API-Football
EXACT_VERIFIED_TEAMS = {
    # K-League 1 & 2
    "울산HDFC": 2767, "울산HD": 2767, "울산": 2767,
    "전북현대모터스": 2762, "전북현대": 2762, "전북": 2762,
    "FC서울": 2766, "서울": 2766,
    "포항스틸러스": 2764, "포항": 2764,
    "강원FC": 2746, "강원": 2746,
    "김천상무프로축구단": 2768, "김천상무": 2768, "김천": 2768,
    "광주FC": 2747, "광주": 2747,
    "제주유나이티드": 2765, "제주": 2765,
    "대전하나시티즌": 2750, "대전": 2750,
    "대구FC": 2763, "대구": 2763,
    "수원FC": 2756,
    "인천유나이티드": 2769, "인천": 2769,
    "수원삼성블루윙즈": 2761, "수원삼성": 2761,
    "부산아이파크": 2752, "부산": 2752,
    "성남FC": 2757, "성남": 2757,
    "부천FC1995": 2759, "부천": 2759,
    "FC안양": 2748, "안양": 2748,
    "경남FC": 2751, "경남": 2751,
    "서울이랜드": 2749, "김포FC": 9171, "충남아산": 7105,

    # EPL
    "토트넘": 47, "토트넘홋스퍼": 47, "뉴캐슬": 34, "뉴캐슬유나이티드": 34,
    "맨체스터시티": 50, "맨시티": 50, "맨체스터유나이티드": 33, "맨유": 33, "맨체스터U": 33,
    "아스널": 42, "첼시": 49, "리버풀": 40, "울버햄프턴": 39, "브라이턴": 51, "브라이턴&호브앨비언": 51,
    "풀럼": 36, "웨스트햄": 48, "에버턴": 45, "노팅엄": 65, "노팅엄포리스트": 65,
    "브렌트퍼드": 55, "크리스털팰리스": 52, "본머스": 35, "AFC본머스": 35,
    "애스턴빌라": 66, "사우샘프턴": 41, "레스터": 46, "입스위치": 57, "입스위치타운": 57,
    "리즈": 63, "리즈유나이티드": 63, "선덜랜드": 71,

    # La Liga
    "레알마드리드": 541, "바르셀로나": 529, "아틀레티코": 530, "아틀레티코마드리드": 530,
    "비야레알": 533, "세비야": 536, "레알소시에다드": 548, "소시에다드": 548,
    "발렌시아": 532, "헤타페": 546, "지로나": 547, "라스팔마스": 534,
    "마요르카": 798, "RCD마요르카": 798, "셀타비고": 538, "RC셀타데비고": 538,
    "알라베스": 542, "에스파뇰": 540, "RCD에스파뇰": 540, "바야돌리드": 720,
    "레가네스": 537, "오사수나": 727, "레알베티스": 543, "베티스": 543, "아틀레틱빌바오": 531,

    # Bundesliga
    "바이에른뮌헨": 157, "도르트문트": 165, "라이프치히": 173, "RB라이프치히": 173,
    "레버쿠젠": 168, "바이어04레버쿠젠": 168, "슈투트가르트": 172, "프랑크푸르트": 169,
    "볼프스부르크": 161, "하이덴하임": 180, "아우크스부르크": 170, "베르더브레멘": 162,
    "프라이부르크": 160, "마인츠": 164, "보훔": 176, "장크트파울리": 186,
    "홀슈타인킬": 191, "묀헨글라트바흐": 163, "보루시아묀헨글라트바흐": 163,
    "우니온베를린": 182, "호펜하임": 167, "TSG1899호펜하임": 167,

    # Ligue 1
    "파리생제르맹": 85, "PSG": 85, "마르세유": 81, "모나코": 91, "릴": 79, "리옹": 80, "올랭피크리옹": 80,
    "렝스": 93, "RC랑스": 93, "툴루즈": 96, "낭트": 83, "렌": 94, "스타드렌": 94,
    "스트라스부르": 95, "RC스트라스부르": 95, "브레스트": 1063, "스타드브레스투아29": 1063,
    "생테티엔": 1062, "앙제": 77, "앙제SCO": 77, "옥세르": 1061, "AJ오세르": 1061, "니스": 84, "OGC니스": 84,

    # J-League
    "시미즈": 301, "시미즈에스펄스": 301, "미토": 304, "미토홀리호크": 304,
    "마치다": 1549, "FC마치다젤비아": 1549, "도치기": 307, "도치기시티FC": 307,
    "주빌로이와타": 289, "알비렉스니가타": 296, "몬테디오야마가타": 303,
    "아비스파후쿠오카": 302, "콘사도레삿포로": 288, "가시와레이솔": 305, "제프유나이티드": 306,
    "도쿠시마보르티스": 308, "반포레고후": 309, "파지아노오카야마": 310,
    "요코하마FC": 311, "도쿄베르디": 312, "감바오사카": 294, "산프레체히로시마": 295,
    "가와사키프론탈레": 292, "비셀고베": 291, "요코하마F마리노스": 286, "요코하마F.마리노스": 286,
    "우라와레즈": 287, "가시마앤틀러스": 285, "나고야그램퍼스": 297, "FC도쿄": 290,
    "세레소오사카": 293, "쇼난벨마레": 299, "교토상가": 300, "사간도스": 298
}

# Load existing cache
try:
    with open("fetched_squads_cache.json", "r", encoding="utf-8") as f:
        squads_cache = json.load(f)
except Exception:
    squads_cache = {}

unique_tids = list(set(EXACT_VERIFIED_TEAMS.values()))
print(f"Fetching squads for {len(unique_tids)} authentic verified team IDs...")

fetched_count = 0
for tid in unique_tids:
    str_tid = str(tid)
    if str_tid in squads_cache and len(squads_cache[str_tid]) > 0:
        continue
    url = "https://v3.football.api-sports.io/players/squads"
    try:
        res = requests.get(url, headers=headers, params={"team": tid}, timeout=10)
        if res.status_code == 200:
            players = res.json().get("response", [{}])[0].get("players", [])
            if players:
                squads_cache[str_tid] = players
                fetched_count += 1
                print(f" -> Successfully fetched authentic squad for Team ID {tid}: {len(players)} players (Sample: {players[0].get('name')})")
                time.sleep(0.08)
    except Exception as e:
        print(f"Error fetching ID {tid}: {e}")

with open("fetched_squads_cache.json", "w", encoding="utf-8") as f:
    json.dump(squads_cache, f, ensure_ascii=False, indent=2)

print(f"DONE! Total authentic squads in cache: {len(squads_cache.keys())}")
