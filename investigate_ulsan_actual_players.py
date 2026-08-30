import requests
import json
import sys

sys.stdout.reconfigure(encoding='utf-8')

api_key = "78E5418A27df6C588D10823E3D22C5fa"
headers = {"x-apisports-key": api_key}

# Let's inspect the exact players returned for ID 2767 by API-Football
res = requests.get("https://v3.football.api-sports.io/players/squads", headers=headers, params={"team": 2767})
if res.status_code == 200:
    data = res.json().get("response", [{}])[0]
    team_info = data.get("team", {})
    players = data.get("players", [])
    print(f"Team ID 2767 Name: {team_info.get('name')}")
    print("Players in 2767:")
    for p in players:
        print(f"  #{p.get('number')} {p.get('name')} ({p.get('position')})")

# Let's find where Jo Hyeon-woo (조현우) and Joo Min-kyu (주민규) actually are in API-Football!
print("\n--- Searching for Jo Hyeon-woo (조현우) ---")
res_player = requests.get("https://v3.football.api-sports.io/players", headers=headers, params={"search": "Jo Hyeon-Woo", "season": 2024})
if res_player.status_code == 200:
    for item in res_player.json().get("response", []):
        pl = item.get("player", {})
        stats = item.get("statistics", [{}])[0]
        tm = stats.get("team", {})
        print(f"Player: {pl.get('name')} -> Team: {tm.get('name')} (Team ID: {tm.get('id')})")

print("\n--- Searching for Joo Min-Kyu (주민규) ---")
res_player2 = requests.get("https://v3.football.api-sports.io/players", headers=headers, params={"search": "Joo Min-Kyu", "season": 2024})
if res_player2.status_code == 200:
    for item in res_player2.json().get("response", []):
        pl = item.get("player", {})
        stats = item.get("statistics", [{}])[0]
        tm = stats.get("team", {})
        print(f"Player: {pl.get('name')} -> Team: {tm.get('name')} (Team ID: {tm.get('id')})")

