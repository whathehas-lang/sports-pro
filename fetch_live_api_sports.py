import requests
import json
import sys

sys.stdout.reconfigure(encoding='utf-8')

api_key = "78E5418A27df6C588D10823E3D22C5fa"
headers = {"x-apisports-key": api_key}

print("Fetching live baseball games for today...")
# Check today's baseball games
url = "https://v1.baseball.api-sports.io/games"
res = requests.get(url, headers=headers, params={"date": "2024-08-29"})
print(f"Status: {res.status_code}")
data = res.json()
games = data.get("response", [])
print(f"Total Baseball Games fetched: {len(games)}")

with open("live_api_baseball_games.json", "w", encoding="utf-8") as f:
    json.dump(games, f, ensure_ascii=False, indent=2)

print("Fetching live football fixtures for today...")
f_url = "https://v3.football.api-sports.io/fixtures"
res_f = requests.get(f_url, headers=headers, params={"date": "2024-08-29"})
print(f"Football Status: {res_f.status_code}")
f_data = res_f.json()
fixtures = f_data.get("response", [])
print(f"Total Football Fixtures fetched: {len(fixtures)}")

with open("live_api_football_fixtures.json", "w", encoding="utf-8") as f:
    json.dump(fixtures, f, ensure_ascii=False, indent=2)
