import json
import re
import sys

sys.stdout.reconfigure(encoding='utf-8')

# 1. Direct Name Dictionary for authentic players
NAME_DICT = {
    # Ulsan HD
    "Lee Dong-Gyeong": "이동경", "Yago Cariello": "야고", "Lee Hui-Gyun": "이희균",
    "D. Bojanić": "보야니치", "Park Woo-jin": "박우진", "Lee Min-Hyeok": "이민혁",
    "Kim Young-Gwon": "김영권", "Jung Seung-Hyun": "정승현", "Yoon Jong-Gyu": "윤종규",
    "Seo Myeong-Kwan": "서명관", "Choi Ju-ho": "최주호", "Jo Hyeon-Woo": "조현우",
    "Cho Hyun-Taek": "조현택", "Kang Sang-Woo": "강상우", "Lee Jin-Hyun": "이진현",
    "Erick Farias": "에릭 파리아스", "T. Oude Kotte": "아우더 코터", "Sim Sang-Min": "심상민",
    "Lee Gyu-Sung": "이규성", "Marcão": "말컹", "Pedrinho": "페드리뇨",

    # FC Seoul
    "J. Lingard": "제시 린가드", "Ki Sung-Yueng": "기성용", "S. Iljutcenko": "일류첸코",
    "Cho Young-Wook": "조영욱", "Gu Sung-Yun": "구성윤", "Kang Sang-Woo": "강상우",
    "Kim Ju-Sung": "김주성", "Choi Jun": "최준", "Lee Seung-Mo": "이승모",

    # Jeonbuk Motors
    "Park Jin-Seob": "박진섭", "Song Min-Kyu": "송민규", "Kim Jin-Su": "김진수",
    "Tiago Orobó": "티아고", "Moon Seon-Min": "문선민", "Lee Yeong-Jae": "이영재",
    "Hong Jeong-Ho": "홍정호", "Kim Tae-Hwan": "김태환", "Kim Jeong-Hoon": "김정훈",

    # Gimcheon Sangmu
    "Kim Bong-Soo": "김봉수", "Kim Hyeon-Ug": "김현욱", "Kim Jun-Bum": "김준범",
    "Ha Chang-Rae": "하창래", "Jeong Jae-Hee": "정재희", "M. Ishida": "마사 (이시다)",
    "Lee Dong-Jun": "이동준", "Won Du-Jae": "원두재", "Kim Dae-Won": "김대원",

    # Tottenham
    "D. Solanke": "도미닉 솔란케", "J. Maddison": "제임스 매디슨", "M. van de Ven": "미키 판더펜",
    "Pedro Porro": "페드로 포로", "D. Udogie": "데스티니 우도기", "Richarlison": "히샬리송",
    "M. Tel": "마티스 텔", "Sávio": "사비우", "P. Sarr": "파페 사르", "R. Bentancur": "벤탄쿠르",
    "L. Bergvall": "루카스 베리발", "C. Gallagher": "코너 갤러거", "S. Tonali": "산드로 토날리",
    "K. Danso": "케빈 단소", "B. Davies": "벤 데이비스", "A. Gray": "아치 그레이",
    "M. Dúbravka": "마르틴 두브라브카", "A. Kinský": "안토닌 킨스키", "M. Moore": "마이키 무어",

    # EPL Stars
    "E. Haaland": "에를링 홀란", "K. De Bruyne": "더브라위너", "P. Foden": "필 포든",
    "Rodri": "로드리", "R. Dias": "후벵 디아스", "Ederson": "에데르송",
    "B. Saka": "부카요 사카", "M. Ødegaard": "외데고르", "D. Rice": "데클란 라이스",
    "K. Havertz": "카이 하베르츠", "William Saliba": "살리바", "Gabriel Magalhães": "마갈량이스",
    "M. Salah": "모하메드 살라", "V. van Dijk": "반 다이크", "A. Mac Allister": "맥 앨리스터",
    "C. Palmer": "콜 파머", "N. Jackson": "니콜라 잭슨", "E. Fernández": "엔소 페르난데스",
    "B. Fernandes": "브루노 페르난데스", "R. Højlund": "라스무스 회일룬", "M. Rashford": "래시포드",

    # La Liga / Real Madrid / Barca
    "K. Mbappé": "킬리안 음바페", "J. Bellingham": "주드 벨링엄", "Vinícius Júnior": "비니시우스",
    "Rodrygo": "호드리구", "F. Valverde": "발베르데", "A. Rüdiger": "뤼디거", "T. Courtois": "쿠르투아",
    "R. Lewandowski": "레반도프스키", "L. Yamal": "라민 야말", "Pedri": "페드리", "Gavi": "가비",
    "Raphinha": "하피냐", "J. Koundé": "쿤데", "P. Cubarsí": "쿠바르시", "M. ter Stegen": "테어 슈테겐",
    "A. Griezmann": "앙투안 그리즈만", "J. Álvarez": "훌리안 알바레스", "J. Oblak": "오블락",

    # Bundesliga / Bayern Munich / PSG
    "H. Kane": "해리 케인", "J. Musiala": "자말 무시알라", "Kim Min-Jae": "김민재",
    "L. Sané": "르로이 사네", "M. Neuer": "마누엘 노이어", "A. Davies": "알폰소 데이비스",
    "O. Dembélé": "우스만 뎀벨레", "Lee Kang-In": "이강인", "B. Barcola": "바르콜라",
    "Marquinhos": "마르키뇨스", "G. Donnarumma": "돈나룸마", "Vitinha": "비티냐",

    # J-League Stars
    "Takashi Inui": "이누이 타카시", "Shuichi Gonda": "슈이치 곤다", "Carlinhos Junior": "카를리뇨스",
    "Kyung-won Kwon": "권경원", "Kwon Kyung-Won": "권경원", "Koya Kitagawa": "키타가와 코야",
    "Reon Yamahara": "야마하라 레온", "Lucas Braga": "루카스 브라가", "Kota Miyamoto": "미야모토 코타"
}

# Korean Syllable Mapping table for automated Romanized Korean transliteration
SYLLABLE_MAP = {
    # Family names & common syllables
    "kim": "김", "lee": "이", "yi": "이", "rhee": "이", "park": "박", "pak": "박", "bak": "박",
    "choi": "최", "choe": "최", "jung": "정", "jeong": "정", "chung": "정",
    "kang": "강", "gang": "강", "cho": "조", "jo": "조", "yoon": "윤", "yun": "윤",
    "jang": "장", "chang": "장", "lim": "임", "im": "임", "rim": "임",
    "han": "한", "oh": "오", "o": "오", "seo": "서", "suh": "서", "shin": "신", "sin": "신",
    "kwon": "권", "gwon": "권", "hwang": "황", "whang": "황", "ahn": "안", "an": "안",
    "song": "송", "hong": "홍", "jeon": "전", "jun": "전", "chun": "전",
    "moon": "문", "mun": "문", "son": "손", "sohn": "손", "bae": "배", "bai": "배",
    "baek": "백", "paik": "백", "heo": "허", "hur": "허", "huh": "허",
    "yoo": "유", "yu": "유", "ryu": "류", "nam": "남", "sim": "심", "shim": "심",
    "noh": "노", "roh": "노", "no": "노", "ha": "하", "kwak": "곽", "gwak": "곽",
    "sung": "성", "seong": "성", "cha": "차", "joo": "주", "ju": "주", "chu": "주",
    "woo": "우", "wu": "우", "koo": "구", "gu": "구", "ku": "구", "min": "민",
    "dong": "동", "gyeong": "경", "kyung": "경", "seung": "승", "hyun": "현", "hyeon": "현",
    "jin": "진", "suk": "석", "seok": "석", "won": "원", "tae": "태", "hoon": "훈", "hun": "훈",
    "jae": "재", "hee": "희", "hyuk": "혁", "hyeok": "혁", "sang": "상", "young": "영", "yeong": "영",
    "chul": "철", "cheol": "철", "soo": "수", "su": "수", "ho": "호", "kwang": "광", "gwang": "광",
    "il": "일", "woong": "웅", "ung": "웅", "yong": "용", "ki": "기", "gi": "기", "myeong": "명",
    "myung": "명", "kwan": "관", "gwan": "관", "seok": "석", "woo": "우", "gyu": "규", "kyu": "규",
    "hwi": "휘", "dae": "대", "deok": "덕", "beom": "범", "bum": "범", "chan": "찬", "eun": "은",
    "joong": "중", "jung": "중", "man": "만", "sun": "선", "seon": "선", "ye": "예", "bo": "보",
    "kyu": "규", "woon": "운", "un": "운", "wook": "욱", "ug": "욱", "uk": "욱"
}

def translate_player_name_to_korean(name):
    if not name:
        return "선수"
    
    # 1. Exact match in dictionary
    for k, v in NAME_DICT.items():
        if k.lower() == name.lower() or k.lower() in name.lower():
            return v
    
    # 2. Syllable-based translation for Korean names (e.g. "Lee Dong-Gyeong", "Kim Young-Gwon")
    # Split by spaces and hyphens
    parts = re.split(r'[\s\-]+', name)
    korean_syllables = []
    for part in parts:
        clean_part = part.lower().strip()
        if clean_part in SYLLABLE_MAP:
            korean_syllables.append(SYLLABLE_MAP[clean_part])
        elif len(clean_part) > 1 and clean_part.endswith('.'):
            # Initials like "D." or "J."
            continue
        else:
            korean_syllables.append(part)
    
    translated = "".join(korean_syllables)
    # If translation produced pure Korean characters, return it
    if re.search(r'[\uac00-\ud7a3]', translated):
        return translated
    
    # 3. Fallback to clean name
    return name

print("Testing translation:")
test_names = [
    "Lee Dong-Gyeong", "Yago Cariello", "Lee Hui-Gyun", "D. Bojanić",
    "Park Woo-jin", "Lee Min-Hyeok", "Kim Young-Gwon", "Jung Seung-Hyun",
    "Yoon Jong-Gyu", "Seo Myeong-Kwan", "Jo Hyeon-Woo", "J. Maddison", "D. Solanke"
]
for n in test_names:
    print(f"  {n} -> {translate_player_name_to_korean(n)}")
