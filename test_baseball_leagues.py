import requests
import json
import sys

sys.stdout.reconfigure(encoding='utf-8')

api_key = "78E5418A27df6C588D10823E3D22C5fa"
headers = {"x-apisports-key": api_key}

# Check leagues available in API-Baseball
url = "https://v1.baseball.api-sports.io/leagues"
res = requests.get(url, headers=headers)
print(f"Leagues Status: {res.status_code}")
data = res.json()
leagues = data.get("response", [])
print(f"Total Baseball Leagues: {len(leagues)}")
for lg in leagues:
    name = lg.get("name", "")
    country = lg.get("country", {}).get("name", "")
    if any(k in name.lower() or k in country.lower() for k in ["kbo", "npb", "korea", "japan", "mlb", "usa"]):
        print(f" - [{lg.get('id')}] {country} / {name}")
