import re

with open('src/mock/realBetmanOfficialSchedule.ts', 'r', encoding='utf-8') as f:
    lines = f.readlines()

for idx, l in enumerate(lines):
    if '"sport": "baseball"' in l or "'sport': 'baseball'" in l or 'sport: "baseball"' in l or "sport: 'baseball'" in l or 'baseball' in l:
        print(f"Line {idx}: {l.strip()}")
