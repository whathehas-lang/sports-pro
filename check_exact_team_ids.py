import requests
import json
import sys

sys.stdout.reconfigure(encoding='utf-8')

api_key = "78E5418A27df6C588D10823E3D22C5fa"
headers = {"x-apisports-key": api_key}

for tid in [2748, 2749, 2750, 2751, 2752, 2753, 2754, 2755, 2756, 2757]:
    res = requests.get("https://v3.football.api-sports.io/teams", headers=headers, params={"id": tid})
    if res.status_code == 200:
        team_data = res.json().get("response", [{}])[0].get("team", {})
        print(f"ID {tid} -> Official Name: {team_data.get('name')} (Country: {team_data.get('country')})")

# Let's search for actual Ulsan HD, Jeonbuk, etc.
for q in ["Ulsan", "Jeonbuk", "Gimcheon", "Seoul", "Pohang", "Gangwon"]:
    res = requests.get("https://v3.football.api-sports.io/teams", headers=headers, params={"search": q})
    if res.status_code == 200:
        teams = res.json().get("response", [])
        for t in teams:
            tm = t.get("team", {})
            print(f"Search '{q}' -> ID: {tm.get('id')}, Name: {tm.get('name')}, Country: {tm.get('country')}")

