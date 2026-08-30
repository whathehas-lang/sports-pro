import requests
import json
import sys

sys.stdout.reconfigure(encoding='utf-8')

api_key = "78E5418A27df6C588D10823E3D22C5fa"

print("Testing direct api-sports.io endpoint with x-apisports-key...")

# 1. Test direct API-Sports Football
football_url = "https://v3.football.api-sports.io/status"
headers_direct = {
    "x-apisports-key": api_key
}

try:
    res_f = requests.get(football_url, headers=headers_direct, timeout=10)
    print(f"[api-sports.io Football Status] Code: {res_f.status_code}")
    print(f"Response: {res_f.text}")
except Exception as e:
    print(f"[api-sports.io Football] Error: {e}")

# 2. Test direct API-Sports Baseball
baseball_url = "https://v1.baseball.api-sports.io/status"
try:
    res_b = requests.get(baseball_url, headers=headers_direct, timeout=10)
    print(f"\n[api-sports.io Baseball Status] Code: {res_b.status_code}")
    print(f"Response: {res_b.text}")
except Exception as e:
    print(f"[api-sports.io Baseball] Error: {e}")
