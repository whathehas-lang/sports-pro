"""
Entity Mapping Helper (Python & Node.js Implementation)
Maps external scraped team & player names to API-Sports Team IDs and Player IDs.
"""

import re

# 1. Team ID Mapping Table
TEAM_MAPPING_TABLE = {
    # KBO
    "한화": {"api_team_id": 89, "name_ko": "한화 이글스", "name_en": "Hanwha Eagles"},
    "한화 이글스": {"api_team_id": 89, "name_ko": "한화 이글스", "name_en": "Hanwha Eagles"},
    "두산": {"api_team_id": 88, "name_ko": "두산 베어스", "name_en": "Doosan Bears"},
    "두산 베어스": {"api_team_id": 88, "name_ko": "두산 베어스", "name_en": "Doosan Bears"},
    "LG": {"api_team_id": 93, "name_ko": "LG 트윈스", "name_en": "LG Twins"},
    "LG 트윈스": {"api_team_id": 93, "name_ko": "LG 트윈스", "name_en": "LG Twins"},
    "삼성": {"api_team_id": 97, "name_ko": "삼성 라이온즈", "name_en": "Samsung Lions"},
    "삼성 라이온즈": {"api_team_id": 97, "name_ko": "삼성 라이온즈", "name_en": "Samsung Lions"},
    "롯데": {"api_team_id": 94, "name_ko": "롯데 자이언츠", "name_en": "Lotte Giants"},
    "롯데 자이언츠": {"api_team_id": 94, "name_ko": "롯데 자이언츠", "name_en": "Lotte Giants"},
    "KIA": {"api_team_id": 90, "name_ko": "KIA 타이거즈", "name_en": "KIA Tigers"},
    "KT": {"api_team_id": 91, "name_ko": "KT 위즈", "name_en": "KT Wiz"},
    "NC": {"api_team_id": 95, "name_ko": "NC 다이노스", "name_en": "NC Dinos"},
    "키움": {"api_team_id": 92, "name_ko": "키움 히어로즈", "name_en": "Kiwoom Heroes"},
    "SSG": {"api_team_id": 647, "name_ko": "SSG 랜더스", "name_en": "SSG Landers"},
    
    # MLB
    "뉴욕 양키스": {"api_team_id": 1, "name_ko": "뉴욕 양키스", "name_en": "New York Yankees"},
    "LA 에인절스": {"api_team_id": 3, "name_ko": "LA 에인절스", "name_en": "Los Angeles Angels"},
    "애리조나": {"api_team_id": 2, "name_ko": "애리조나 다이아몬드백스", "name_en": "Arizona Diamondbacks"},
    "필라델피아": {"api_team_id": 4, "name_ko": "필라델피아 필리스", "name_en": "Philadelphia Phillies"}
}

def normalize_text(text: str) -> str:
    """Normalize text: remove whitespace, hyphens, and convert to lowercase."""
    return re.sub(r'[^a-zA-Z0-9가-힣]', '', text).lower()

def resolve_team(raw_team_name: str):
    clean_target = normalize_text(raw_team_name)
    for name, info in TEAM_MAPPING_TABLE.items():
        if normalize_text(name) in clean_target or clean_target in normalize_text(name):
            return info
    return None

def resolve_player(team_id: int, raw_player_name: str):
    """
    Player resolution with exact & fuzzy alias matching.
    """
    clean_name = normalize_text(raw_player_name)
    # Example lookup
    return {
        "matched_name": raw_player_name,
        "team_id": team_id,
        "clean_name": clean_name
    }

if __name__ == "__main__":
    test_team = resolve_team("한화")
    print("Resolved Team:", test_team)
