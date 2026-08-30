import json
import re
import sys

sys.stdout.reconfigure(encoding='utf-8')

with open("src/mock/realBetmanOfficialSchedule.ts", "r", encoding="utf-8") as f:
    ts_code = f.read()

# Check instances of static records
home_records = re.findall(r'"homeSeasonRecord":\s*"([^"]+)"', ts_code)
away_records = re.findall(r'"awaySeasonRecord":\s*"([^"]+)"', ts_code)

print(f"Total homeSeasonRecord entries in ts file: {len(home_records)}")
from collections import Counter
print("Home Season Records distribution:")
for k, v in Counter(home_records).most_common(10):
    print(f"  - {k}: {v} times")

print("\nAway Season Records distribution:")
for k, v in Counter(away_records).most_common(10):
    print(f"  - {k}: {v} times")
