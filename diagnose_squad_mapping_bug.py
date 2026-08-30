import json
import re
import sys

sys.stdout.reconfigure(encoding='utf-8')

# Check what happened with Ulsan vs Gimcheon:
with open("betman_100_percent_real.json", "r", encoding="utf-8") as f:
    raw_matches = json.load(f)

with open("fetched_squads_cache.json", "r", encoding="utf-8") as f:
    squads_cache = json.load(f)

m = [x for x in raw_matches if x.get("seq") == 7417][0]
print(f"Match: {m['homeTeam']} vs {m['awayTeam']}")

# Let's inspect squads_cache for Korean teams
for tid, players in squads_cache.items():
    pnames = [p.get("name") for p in players[:5]]
    if any("Kim Bong-Soo" in p or "Ha Chang-Rae" in p for p in pnames):
        print(f"Squad ID {tid} has Kim Bong-Soo / Ha Chang-Rae: {pnames}")

