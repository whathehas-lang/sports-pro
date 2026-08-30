import requests
import json
import sys

sys.stdout.reconfigure(encoding='utf-8')

api_key = "78E5418A27df6C588D10823E3D22C5fa"

print("Testing API-Baseball and API-Football with user's RapidAPI Key...")

# 1. Test API-Baseball
baseball_url = "https://api-baseball.p.rapidapi.com/games"
headers_baseball = {
    "x-rapidapi-key": api_key,
    "x-rapidapi-host": "api-baseball.p.rapidapi.com"
}

try:
    res_b = requests.get(baseball_url, headers=headers_baseball, params={"date": "2024-08-29"}, timeout=10)
    print(f"[API-Baseball] Status Code: {res_b.status_code}")
    print(f"[API-Baseball] Response Snippet: {res_b.text[:400]}")
    if res_b.status_code == 200:
        data = res_b.json()
        print(f"[API-Baseball] Games count: {len(data.get('response', []))}")
except Exception as e:
    print(f"[API-Baseball] Error: {e}")

# 2. Test API-Football
football_url = "https://api-football-v1.p.rapidapi.com/v3/fixtures"
headers_football = {
    "x-rapidapi-key": api_key,
    "x-rapidapi-host": "api-football-v1.p.rapidapi.com"
}

try:
    res_f = requests.get(football_url, headers=headers_football, params={"date": "2024-08-29"}, timeout=10)
    print(f"\n[API-Football] Status Code: {res_f.status_code}")
    print(f"[API-Football] Response Snippet: {res_f.text[:400]}")
    if res_f.status_code == 200:
        data = res_f.json()
        print(f"[API-Football] Fixtures count: {len(data.get('response', []))}")
except Exception as e:
    print(f"[API-Football] Error: {e}")
