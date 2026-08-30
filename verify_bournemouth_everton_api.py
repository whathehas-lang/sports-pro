import requests
import json
import sys

sys.stdout.reconfigure(encoding='utf-8')

API_KEY = "78E5418A27df6C588D10823E3D22C5fa"
HEADERS = {"x-apisports-key": API_KEY}

# 1. Check Bournemouth (35) and Everton (45) H2H & recent fixtures
url_h2h = "https://v3.football.api-sports.io/fixtures/headtohead?h2h=35-45"
res_h2h = requests.get(url_h2h, headers=HEADERS).json()

print(f"H2H API Status: {res_h2h.get('results', 0)} matches found.")
if res_h2h.get("response"):
    latest_fixture = res_h2h["response"][0]
    fix_id = latest_fixture["fixture"]["id"]
    print(f"Latest Fixture ID: {fix_id}, Date: {latest_fixture['fixture']['date']}")

    # 2. Check Lineups for this latest fixture to verify exact official formation & XI
    url_lineups = f"https://v3.football.api-sports.io/fixtures/lineups?fixture={fix_id}"
    res_lineups = requests.get(url_lineups, headers=HEADERS).json()
    print("\n--- Official Lineup from API-Football for Bournemouth vs Everton ---")
    for team_lineup in res_lineups.get("response", []):
        tname = team_lineup["team"]["name"]
        formation = team_lineup.get("formation")
        coach = team_lineup.get("coach", {}).get("name")
        start_xi = [p["player"]["name"] for p in team_lineup.get("startXI", [])]
        print(f"Team: {tname} | Formation: {formation} | Coach: {coach}")
        print(f"  Starting XI: {start_xi}\n")

# 3. Check official squad rosters from API-Football
for tid, tname in [(35, "Bournemouth"), (45, "Everton")]:
    url_sq = f"https://v3.football.api-sports.io/players/squads?team={tid}"
    res_sq = requests.get(url_sq, headers=HEADERS).json()
    if res_sq.get("response"):
        squad = res_sq["response"][0]["players"]
        print(f"Official Squad for {tname} ({len(squad)} players):")
        for p in squad[:8]:
            print(f"  #{p.get('number')} {p.get('name')} ({p.get('position')})")
        print("  ...")
