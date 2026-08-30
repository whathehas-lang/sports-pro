import requests
import json
import sys

sys.stdout.reconfigure(encoding='utf-8')

api_key = "78E5418A27df6C588D10823E3D22C5fa"
headers = {"x-apisports-key": api_key}

# Search for teams like Manchester City (ID: 50), Arsenal (ID: 42), Chelsea (ID: 49), Real Madrid (ID: 541), Barcelona (ID: 529), etc.
team_ids = [50, 42, 49, 33, 40, 541, 529] # Man City, Arsenal, Chelsea, Man Utd, Liverpool, Real Madrid, Barcelona

print("Testing Squads Fetch from API-Football Pro...")
url = "https://v3.football.api-sports.io/players/squads"
res = requests.get(url, headers=headers, params={"team": 50}) # Man City
print(f"Man City Squad Status: {res.status_code}")
if res.status_code == 200:
    data = res.json()
    players = data.get("response", [{}])[0].get("players", [])
    print(f"Man City Real Players Count: {len(players)}")
    for p in players[:5]:
        print(f" - #{p.get('number')} {p.get('name')} ({p.get('position')})")

