import requests
import json
import time
import os
import sys

sys.stdout.reconfigure(encoding='utf-8')

api_key = "78E5418A27df6C588D10823E3D22C5fa"
headers = {"x-apisports-key": api_key}

# Load cached squads if available
cache_file = "all_fetched_squads_cache.json"
if os.path.exists(cache_file):
    with open(cache_file, "r", encoding="utf-8") as f:
        squads_cache = json.load(f)
else:
    squads_cache = {}

# Load 105 authentic Betman matches
with open("betman_100_percent_real.json", "r", encoding="utf-8") as f:
    betman_matches = json.load(f)

print(f"Total authentic Betman matches: {len(betman_matches)}")

# Helper to search for a team ID on API-Football
def search_team_id(team_name):
    clean_name = team_name.replace("FC", "").replace("유나이티드", "").replace("시티", "").strip()
    url = "https://v3.football.api-sports.io/teams"
    try:
        res = requests.get(url, headers=headers, params={"search": clean_name}, timeout=10)
        if res.status_code == 200:
            data = res.json()
            teams = data.get("response", [])
            if teams:
                tid = teams[0].get("team", {}).get("id")
                return tid
    except Exception as e:
        print(f"Search error for {team_name}: {e}")
    return None

def get_squad(team_name, default_id=None):
    if team_name in squads_cache and len(squads_cache[team_name]) > 0:
        return squads_cache[team_name]
    
    tid = default_id
    if not tid:
        # Search via API
        tid = search_team_id(team_name)
    
    if tid:
        url = "https://v3.football.api-sports.io/players/squads"
        try:
            res = requests.get(url, headers=headers, params={"team": tid}, timeout=10)
            if res.status_code == 200:
                data = res.json()
                players = data.get("response", [{}])[0].get("players", [])
                if players:
                    squads_cache[team_name] = players
                    print(f" -> Fetched squad for [{team_name}] (ID: {tid}): {len(players)} players")
                    time.sleep(0.1)
                    return players
        except Exception as e:
            print(f"Squad fetch error for {team_name} (ID: {tid}): {e}")
    return []

# Process unique football teams
football_matches = [m for m in betman_matches if m.get("sport") == "soccer"]
print(f"Total football matches in Betman schedule: {len(football_matches)}")

for m in football_matches:
    h = m.get("homeTeam")
    a = m.get("awayTeam")
    if h and h not in squads_cache:
        get_squad(h)
    if a and a not in squads_cache:
        get_squad(a)

# Save updated cache
with open(cache_file, "w", encoding="utf-8") as f:
    json.dump(squads_cache, f, ensure_ascii=False, indent=2)

print(f"Saved {len(squads_cache)} team squads to {cache_file}")
