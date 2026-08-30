import json
import re

with open('src/mock/realBetmanOfficialSchedule.ts', 'r', encoding='utf-8') as f:
    code = f.read()

# Check all baseball matches in REAL_BETMAN_OFFICIAL_MATCHES
matches_raw = re.findall(r'(\{\s*"id":\s*"bm_\d+".*?"sport":\s*"baseball".*?\n  \})', code, re.DOTALL)
print(f"Total baseball matches in REAL_BETMAN_OFFICIAL_MATCHES: {len(matches_raw)}")

for idx, m_str in enumerate(matches_raw[:5]):
    print(f"\n--- Baseball Match #{idx+1} ---")
    home_name = re.search(r'"homeTeam":\s*\{\s*"id":\s*".*?",\s*"name":\s*"([^"]+)"', m_str)
    away_name = re.search(r'"awayTeam":\s*\{\s*"id":\s*".*?",\s*"name":\s*"([^"]+)"', m_str)
    h_lineup = re.search(r'"homeOfficialLineup":\s*(\{.*?\n    \})', m_str, re.DOTALL)
    print(f"Teams: {home_name.group(1) if home_name else 'N/A'} vs {away_name.group(1) if away_name else 'N/A'}")
    if h_lineup:
        print("Home Lineup snippet:", h_lineup.group(1)[:250])
    else:
        print("Home Lineup: NONE (Missing!)")
