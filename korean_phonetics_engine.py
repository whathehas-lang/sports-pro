import re
import sys

sys.stdout.reconfigure(encoding='utf-8')

# Comprehensive dictionary for known football players worldwide
GLOBAL_STAR_DICT = {
    # Bournemouth
    "Evanilson": "에바니우송", "B. Doak": "벤 도크", "D. Jebbison": "대니얼 제비슨",
    "Juanlu Sánchez": "후안루 산체스", "Juanlu Sanchez": "후안루 산체스", "T. Adams": "타일러 아담스",
    "A. Adli": "아민 아들리", "M. Aarons": "맥스 아론스", "J. Araujo": "훌리안 아라우호",
    "B. Diakité": "바포데 디아키테", "B. Diakite": "바포데 디아키테", "J. Hill": "제임스 힐",
    "K. Crampton": "캘런 크램프턴", "M. Tavernier": "마커스 태버니어", "R. Christie": "라이언 크리스티",
    "A. Scott": "알렉스 스콧", "L. Cook": "루이스 쿡", "A. Smith": "아담 스미스",
    "M. Senesi": "마르코스 세네시", "I. Zabarnyi": "일리야 자바르니", "Kepa": "케파",
    "Neto": "네투", "D. Brooks": "데이비드 브룩스", "D. Ouattara": "당고 우아타라",

    # Everton
    "D. Calvert-Lewin": "도미닉 칼버트-르윈", "D. McNeil": "드와이트 맥닐", "J. Harrison": "잭 해리슨",
    "I. Gueye": "이드리사 게예", "J. Garner": "제임스 가너", "A. Doucouré": "압둘라예 두쿠레",
    "A. Doucoure": "압둘라예 두쿠레", "J. Tarkowski": "제임스 타코우스키", "J. Branthwaite": "재러드 브랜스웨이트",
    "V. Mykolenko": "비탈리 미콜렌코", "S. Coleman": "셰이머스 콜먼", "J. Pickford": "조던 픽포드",
    "Beto": "베투", "Y. Chermiti": "유세프 체르미티", "J. Lindstrøm": "예스페르 린스트룀",
    "T. Iroegbunam": "티미 이로에그부남", "M. Keane": "마이클 킨", "J. Virginia": "주앙 버지니아",

    # Tottenham
    "D. Solanke": "도미닉 솔란케", "J. Maddison": "제임스 매디슨", "M. van de Ven": "미키 판더펜",
    "Pedro Porro": "페드로 포로", "D. Udogie": "데스티니 우도기", "Richarlison": "히샬리송",
    "M. Tel": "마티스 텔", "Sávio": "사비우", "P. Sarr": "파페 사르", "R. Bentancur": "로드리고 벤탄쿠르",
    "L. Bergvall": "루카스 베리발", "C. Gallagher": "코너 갤러거", "S. Tonali": "산드로 토날리",
    "K. Danso": "케빈 단소", "B. Davies": "벤 데이비스", "A. Gray": "아치 그레이",
    "M. Dúbravka": "마르틴 두브라브카", "A. Kinský": "안토닌 킨스키", "M. Moore": "마이키 무어",
    "C. Romero": "크리스티안 로메로", "G. Vicario": "굴리엘모 비카리오", "Dejan Kulusevski": "데얀 쿨루셉스키",
    "Son Heung-Min": "손흥민", "Heung-Min Son": "손흥민",

    # Newcastle
    "A. Isak": "알렉산더 이삭", "A. Gordon": "앤서니 고든", "H. Barnes": "하비 반스",
    "Bruno Guimarães": "브루노 기마랑이스", "J. Murphy": "제이콥 머피", "Joelinton": "조엘린톤",
    "S. Longstaff": "션 롱스태프", "J. Willock": "조 윌록", "F. Schär": "파비안 셰어",
    "D. Burn": "댄 번", "T. Livramento": "티노 리브라멘토", "L. Hall": "루이스 홀",
    "N. Pope": "닉 포프", "K. Trippier": "키어런 트리피어",

    # Chelsea
    "C. Palmer": "콜 파머", "N. Jackson": "니콜라 잭슨", "E. Fernández": "엔소 페르난데스",
    "M. Caicedo": "모이세스 카이세도", "L. Colwill": "리바이 콜윌", "R. James": "리스 제임스",
    "M. Gusto": "말로 귀스토", "Robert Sánchez": "로베르트 산체스", "J. Sancho": "제이든 산초",
    "P. Neto": "페드로 네투", "J. Félix": "주앙 펠릭스", "K. Dewsbury-Hall": "키어런 듀스버리홀",
    "Marc Cucurella": "마르크 쿠쿠레야", "A. Disasi": "악셀 디사시", "T. Adarabioyo": "토신 아다라비오요",
    "F. Jørgensen": "필립 요르겐센",

    # Man Utd
    "B. Fernandes": "브루노 페르난데스", "R. Højlund": "라스무스 회일룬", "M. Rashford": "마커스 래시포드",
    "A. Diallo": "아마드 디알로", "Kobbie Mainoo": "코비 마이누", "Casemiro": "카세미루",
    "L. Martínez": "리산드로 마르티네스", "M. de Ligt": "마테이스 더리흐트", "Diogo Dalot": "디오구 달로",
    "A. Onana": "안드레 오나나", "J. Zirkzee": "조슈아 지르크지", "M. Ugarte": "마누엘 우가르테",
    "A. Garnacho": "알레한드로 가르나초", "H. Maguire": "해리 매과이어", "L. Shaw": "루크 쇼",

    # Juventus
    "D. Vlahović": "두산 블라호비치", "K. Yıldız": "케난 일디즈", "T. Koopmeiners": "퇸 코프메이너르스",
    "Douglas Luiz": "더글라스 루이스", "M. Locatelli": "마누엘 로카텔리", "Bremer": "글레이송 브레메르",
    "M. Di Gregorio": "미켈레 디 그레고리오", "F. Conceição": "프란시스쿠 콘세이상",
    "N. González": "니콜라스 곤살레스", "K. Thuram": "케프렌 튀람", "A. Cambiaso": "안드레아 캄비아소",
    "F. Gatti": "페데리코 가티", "P. Kalulu": "피에르 칼룰루", "M. Perin": "마티아 페린",

    # Inter
    "Lautaro Martínez": "라우타로 마르티네스", "M. Thuram": "마르쿠스 튀람", "H. Çalhanoğlu": "하칸 찰하놀루",
    "N. Barella": "니콜로 바렐라", "H. Mkhitaryan": "헨리크 미키타리안", "F. Dimarco": "페데리코 디마르코",
    "A. Bastoni": "알레산드로 바스토니", "B. Pavard": "뱅자맹 파바르", "Y. Sommer": "얀 좀머",
    "D. Frattesi": "다비데 프라테시", "D. Dumfries": "덴젤 둠프리스", "Carlos Augusto": "카를로스 아우구스투",
    "M. Darmian": "마테오 다르미안", "F. Acerbi": "프란체스코 아체르비", "S. de Vrij": "스테판 더프레이",

    # Napoli
    "K. Kvaratskhelia": "흐비차 크바라츠헬리아", "R. Lukaku": "로멜루 루카쿠", "S. McTominay": "스콧 맥토미니",
    "A. Zambo Anguissa": "앙드레 프랑크 잠보 앙귀사", "Stanislav Lobotka": "스타니슬라프 로보트카",
    "G. Di Lorenzo": "조반니 디 로렌초", "A. Buongiorno": "알레산드로 본조르노", "Alex Meret": "알렉스 메렛",
    "M. Politano": "마테오 폴리타노", "David Neres": "다비드 네레스", "G. Raspadori": "자코모 라스파도리",
    "B. Gilmour": "빌리 길모어", "Leonardo Spinazzola": "레오나르도 스피나촐라", "A. Rrahmani": "아미르 라흐마니",

    # Lazio
    "M. Zaccagni": "마티아 자카니", "T. Castellanos": "발렌틴 카스테야노스", "M. Guendouzi": "마테오 귀엥두지",
    "Nuno Tavares": "누누 타바레스", "Ivan Provedel": "이반 프로베델", "Mario Gila": "마리오 힐라",
    "B. Dia": "불라예 디아", "Gustav Isaksen": "구스타브 이삭센", "N. Rovella": "니콜로 로벨라",
    "G. Castrovilli": "가에타노 카스트로빌리", "A. Romagnoli": "알레시오 로마뇰리", "M. Lazzari": "마누엘 라자리",

    # Fiorentina
    "M. Kean": "모이스 킨", "A. Guðmundsson": "알베르트 그뷔드뮌손", "D. Cataldi": "다닐로 카탈디",
    "Y. Adli": "야신 아들리", "E. Bove": "에도아르도 보베", "Robin Gosens": "로빈 고젠스",
    "Dodô": "도도", "L. Ranieri": "루카 라니에리", "P. Comuzzo": "피에트로 코무초",
    "David de Gea": "다비드 데 헤아", "C. Biraghi": "크리스티아노 비라기", "L. Martínez Quarta": "루카스 마르티네스 콰르타",

    # Fulham
    "Raúl Jiménez": "라울 히메네스", "Adama Traoré": "아다마 트라오레", "Alex Iwobi": "알렉스 이워비",
    "Emile Smith Rowe": "에밀 스미스 로우", "Andreas Pereira": "안드레아스 페레이라", "S. Lukić": "사샤 루키치",
    "Antonee Robinson": "안토니 로빈슨", "Kenny Tete": "케니 테테", "Calvin Bassey": "캘빈 배시",
    "J. Andersen": "요아킴 안데르센", "Bernd Leno": "베른트 레노",

    # Brentford
    "Bryan Mbeumo": "브라이언 음뵈모", "Yoane Wissa": "요안 위사", "K. Schade": "케빈 샤데",
    "M. Jensen": "마티아스 옌센", "C. Nørgaard": "크리스티안 뇌르고르", "Mikkel Damsgaard": "미켈 담스고르",
    "K. Lewis-Potter": "킨 루이스포터", "Vitaly Janelt": "비탈리 야넬트", "E. Pinnock": "에단 피녹",
    "N. Collins": "네이선 콜린스", "K. Ajer": "크리스토페르 아예르", "M. Flekken": "마르크 플레컨",

    # Brighton
    "K. Mitoma": "미토마 카오루", "Danny Welbeck": "대니 웰백", "Y. Minteh": "얀쿠바 민테",
    "Georginio Rutter": "조르지뇨 뤼터", "Carlos Baleba": "카를로스 발레바", "Y. Ayari": "야신 아야리",
    "Mats Wieffer": "마츠 비퍼", "J. Hinshelwood": "잭 힌셸우드", "Lewis Dunk": "루이스 덩크",
    "J. van Hecke": "얀 폴 판헤케", "P. Estupiñán": "페르비스 에스투피냔", "Bart Verbruggen": "바르트 페르브뤼헌",

    # Leeds
    "J. Piroe": "요엘 피루", "M. Solomon": "마노르 솔로몬", "W. Gnonto": "윌프리드 뇬토",
    "D. James": "대니얼 제임스", "B. Aaronson": "브렌던 에런슨", "I. Gruev": "일리야 그루에프",
    "A. Tanaka": "타나카 아오", "J. Firpo": "주니오르 피르포", "P. Struijk": "파스칼 스트라위크",
    "J. Rodon": "조 로든", "J. Bogle": "제이든 보글", "I. Meslier": "일란 멜리에",

    # Sunderland
    "Wilson Isidor": "윌슨 이지도르", "P. Roberts": "패트릭 로버츠", "R. Rigg": "크리스 리그",
    "J. Bellingham": "조브 벨링엄", "D. Neil": "댄 닐", "E. Mayenda": "엘리에서 마옌다",
    "D. Cirkin": "데니스 시르킨", "L. O'Nien": "루크 오나인", "T. Hume": "트레이 흄",
    "A. Patterson": "앤서니 패터슨",

    # Ipswich
    "L. Delap": "리암 델랍", "O. Hutchinson": "오마리 허친슨", "S. Szmodics": "새미 슈모딕스",
    "C. Chaplin": "코너 채플린", "J. Cajuste": "옌스 카유스테", "Sam Morsy": "샘 모르시",
    "K. Phillips": "캘빈 필립스", "L. Davis": "레이프 데이비스", "A. Tuanzebe": "악셀 튀앙제브",
    "Jacob Greaves": "제이콥 그리브스", "A. Muric": "아리야네트 무리치"
}

# Phonetic syllables dictionary
PHONETIC_PAIRS = [
    (r'sch', '슈'), (r'tion', '션'), (r'sion', '션'), (r'ch', '치'), (r'sh', '시'),
    (r'ph', '프'), (r'th', '트'), (r'ck', '크'), (r'qu', '퀴'), (r'wh', '호'),
    (r'al', '알'), (r'el', '엘'), (r'il', '일'), (r'ol', '올'), (r'ul', '울'),
    (r'an', '안'), (r'en', '엔'), (r'in', '인'), (r'on', '온'), (r'un', '운'),
    (r'ar', '아'), (r'er', '에'), (r'ir', '이'), (r'or', '오'), (r'ur', '어'),
    (r'ba', '바'), (r'be', '베'), (r'bi', '비'), (r'bo', '보'), (r'bu', '부'),
    (r'ca', '카'), (r'ce', '세'), (r'ci', '시'), (r'co', '코'), (r'cu', '쿠'),
    (r'da', '다'), (r'de', '데'), (r'di', '디'), (r'do', '도'), (r'du', '두'),
    (r'fa', '파'), (r'fe', '페'), (r'fi', '피'), (r'fo', '포'), (r'fu', '푸'),
    (r'ga', '가'), (r'ge', '게'), (r'gi', '기'), (r'go', '고'), (r'gu', '구'),
    (r'ha', '하'), (r'he', '헤'), (r'hi', '히'), (r'ho', '호'), (r'hu', '후'),
    (r'ja', '자'), (r'je', '제'), (r'ji', '지'), (r'jo', '조'), (r'ju', '주'),
    (r'ka', '카'), (r'ke', '케'), (r'ki', '키'), (r'ko', '코'), (r'ku', '쿠'),
    (r'la', '라'), (r'le', '레'), (r'li', '리'), (r'lo', '로'), (r'lu', '루'),
    (r'ma', '마'), (r'me', '메'), (r'mi', '미'), (r'mo', '모'), (r'mu', '무'),
    (r'na', '나'), (r'ne', '네'), (r'ni', '니'), (r'no', '노'), (r'nu', '누'),
    (r'pa', '파'), (r'pe', '페'), (r'pi', '피'), (r'po', '포'), (r'pu', '푸'),
    (r'ra', '라'), (r're', '레'), (r'ri', '리'), (r'ro', '로'), (r'ru', '루'),
    (r'sa', '사'), (r'se', '세'), (r'si', '시'), (r'so', '소'), (r'su', '수'),
    (r'ta', '타'), (r'te', '테'), (r'ti', '티'), (r'to', '토'), (r'tu', '투'),
    (r'va', '바'), (r've', '베'), (r'vi', '비'), (r'vo', '보'), (r'vu', '부'),
    (r'wa', '와'), (r'we', '웨'), (r'wi', '위'), (r'wo', '워'), (r'wu', '우'),
    (r'ya', '야'), (r'ye', '예'), (r'yi', '이'), (r'yo', '요'), (r'yu', '유'),
    (r'za', '자'), (r'ze', '제'), (r'zi', '지'), (r'zo', '조'), (r'zu', '주'),
    (r'a', '아'), (r'e', '에'), (r'i', '이'), (r'o', '오'), (r'u', '우'),
    (r'b', '브'), (r'c', '크'), (r'd', '드'), (r'f', '프'), (r'g', '그'),
    (r'h', '흐'), (r'j', '즈'), (r'k', '크'), (r'l', '르'), (r'm', '름'),
    (r'n', '른'), (r'p', '프'), (r'r', '르'), (r's', '스'), (r't', '트'),
    (r'v', '브'), (r'w', '우'), (r'x', '크스'), (r'y', '이'), (r'z', '즈')
]

KOREAN_NAMES_MAP = {
    "kim": "김", "lee": "이", "park": "박", "choi": "최", "jung": "정", "jeong": "정",
    "kang": "강", "cho": "조", "jo": "조", "yoon": "윤", "jang": "장", "lim": "임",
    "han": "한", "oh": "오", "seo": "서", "shin": "신", "kwon": "권", "hwang": "황",
    "ahn": "안", "song": "송", "hong": "홍", "jeon": "전", "moon": "문", "son": "손",
    "bae": "배", "baek": "백", "min": "민", "dong": "동", "gyeong": "경", "seung": "승",
    "hyun": "현", "jin": "진", "woo": "우", "suk": "석", "won": "원", "tae": "태",
    "hoon": "훈", "jae": "재", "hee": "희", "hyuk": "혁", "sang": "상", "young": "영"
}

def transliterate_to_korean(name):
    if not name:
        return "선수"
    
    # 1. Exact match in Star Dict
    for k, v in GLOBAL_STAR_DICT.items():
        if k.lower() == name.lower() or k.lower() in name.lower():
            return v
    
    # 2. Check Korean syllable match
    parts = re.split(r'[\s\-]+', name)
    korean_syllables = []
    is_korean = True
    for part in parts:
        clean = part.lower().strip()
        if clean in KOREAN_NAMES_MAP:
            korean_syllables.append(KOREAN_NAMES_MAP[clean])
        elif len(clean) > 1 and clean.endswith('.'):
            continue
        else:
            is_korean = False
            break
    if is_korean and len(korean_syllables) > 0:
        return "".join(korean_syllables)
    
    # 3. Phonetic transliteration for European/Foreign names
    res = ""
    # Process word by word
    words = re.split(r'[\s\-]+', name)
    out_words = []
    for word in words:
        clean_word = word.strip()
        if len(clean_word) <= 2 and clean_word.endswith('.'):
            continue # Skip single initial
        # Check dictionary
        found = False
        for k, v in GLOBAL_STAR_DICT.items():
            if k.lower() == clean_word.lower():
                out_words.append(v)
                found = True
                break
        if found:
            continue
        
        # Apply phonetics
        w = clean_word.lower()
        # strip non-ascii accents
        w = re.sub(r'[éèêë]', 'e', w)
        w = re.sub(r'[áàâäãå]', 'a', w)
        w = re.sub(r'[íìîï]', 'i', w)
        w = re.sub(r'[óòôöõø]', 'o', w)
        w = re.sub(r'[úùûü]', 'u', w)
        w = re.sub(r'[ćčç]', 'c', w)
        w = re.sub(r'[ñ]', 'n', w)
        w = re.sub(r'[šś]', 's', w)
        w = re.sub(r'[žźż]', 'z', w)
        
        w_trans = ""
        idx = 0
        while idx < len(w):
            matched = False
            for pat, kor in PHONETIC_PAIRS:
                if w[idx:].startswith(pat):
                    w_trans += kor
                    idx += len(pat)
                    matched = True
                    break
            if not matched:
                idx += 1
        
        if w_trans:
            out_words.append(w_trans)
        else:
            out_words.append(word)
            
    final_name = " ".join(out_words)
    if re.search(r'[\uac00-\ud7a3]', final_name):
        return final_name
    return name

print("Testing Translation:")
test_cases = [
    "Evanilson", "B. Doak", "D. Jebbison", "Juanlu Sánchez", "T. Adams", "A. Adli",
    "M. Aarons", "J. Araujo", "B. Diakité", "J. Hill", "K. Crampton",
    "D. Calvert-Lewin", "D. McNeil", "J. Harrison", "I. Gueye", "J. Pickford",
    "D. Solanke", "J. Maddison", "M. van de Ven", "Pedro Porro"
]
for t in test_cases:
    print(f"  {t} -> {transliterate_to_korean(t)}")
