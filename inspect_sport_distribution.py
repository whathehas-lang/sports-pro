import re

with open('src/mock/realBetmanOfficialSchedule.ts', 'r', encoding='utf-8') as f:
    code = f.read()

sports = re.findall(r'"sport":\s*"([^"]+)"', code)
print("Sport distribution in realBetmanOfficialSchedule.ts:")
from collections import Counter
print(Counter(sports))
