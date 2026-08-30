import json
import sys

sys.stdout.reconfigure(encoding='utf-8')

with open("fetched_squads_cache.json", "r", encoding="utf-8") as f:
    squads = json.load(f)

tottenham_players = squads.get("47", [])
print(f"Total Tottenham Players in API-Football: {len(tottenham_players)}")
for p in tottenham_players:
    print(f" - #{p.get('number')} {p.get('name')} ({p.get('position')}) Age: {p.get('age')}")
