import requests
import json
import sys

sys.stdout.reconfigure(encoding='utf-8')

API_KEY = "78E5418A27df6C588D10823E3D22C5fa"
HEADERS = {"x-apisports-key": API_KEY}

def fetch_h2h(team1_id, team2_id):
    url = f"https://v3.football.api-sports.io/fixtures/headtohead?h2h={team1_id}-{team2_id}"
    res = requests.get(url, headers=HEADERS).json()
    matches = res.get("response", [])
    logs = []
    home_w = 0
    draw_cnt = 0
    away_w = 0
    for m in matches[:10]:
        date_raw = m["fixture"]["date"][:10].replace("-", ".")
        h_name = m["teams"]["home"]["name"]
        a_name = m["teams"]["away"]["name"]
        h_score = m["goals"]["home"]
        a_score = m["goals"]["away"]
        winner = m["teams"]["home"]["name"] if m["teams"]["home"].get("winner") else (m["teams"]["away"]["name"] if m["teams"]["away"].get("winner") else "무승부")
        if h_score is not None and a_score is not None:
            logs.append({
                "dateStr": date_raw,
                "homeTeam": h_name,
                "awayTeam": a_name,
                "homeScore": h_score,
                "awayScore": a_score,
                "winnerName": winner
            })
    return logs

def fetch_team_recent(team_id):
    url = f"https://v3.football.api-sports.io/fixtures?team={team_id}&last=10"
    res = requests.get(url, headers=HEADERS).json()
    matches = res.get("response", [])
    logs = []
    for m in matches:
        date_raw = m["fixture"]["date"][5:10].replace("-", ".")
        is_home = m["teams"]["home"]["id"] == team_id
        opp_name = m["teams"]["away"]["name"] if is_home else m["teams"]["home"]["name"]
        t_score = m["goals"]["home"] if is_home else m["goals"]["away"]
        opp_score = m["goals"]["away"] if is_home else m["goals"]["home"]
        res_str = "승" if (t_score is not None and opp_score is not None and t_score > opp_score) else ("패" if (t_score is not None and opp_score is not None and t_score < opp_score) else "무")
        if t_score is not None and opp_score is not None:
            logs.append({
                "dateStr": date_raw,
                "opponentName": opp_name,
                "homeOrAway": "HOME" if is_home else "AWAY",
                "teamScore": t_score,
                "opponentScore": opp_score,
                "resultStr": res_str
            })
    return logs

print("Fetching Bournemouth (35) vs Everton (45) H2H & Recent...")
b_e_h2h = fetch_h2h(35, 45)
b_recent = fetch_team_recent(35)
e_recent = fetch_team_recent(45)

print("\n--- Real Bournemouth vs Everton H2H (Last 5) ---")
for h in b_e_h2h[:5]:
    print(f"  {h['dateStr']} {h['homeTeam']} {h['homeScore']}:{h['awayScore']} {h['awayTeam']} -> {h['winnerName']}")

print("\n--- Real Bournemouth Recent Matches (Last 5) ---")
for r in b_recent[:5]:
    print(f"  {r['dateStr']} vs {r['opponentName']} ({r['homeOrAway']}) {r['teamScore']}:{r['opponentScore']} ({r['resultStr']})")

print("\n--- Real Everton Recent Matches (Last 5) ---")
for r in e_recent[:5]:
    print(f"  {r['dateStr']} vs {r['opponentName']} ({r['homeOrAway']}) {r['teamScore']}:{r['opponentScore']} ({r['resultStr']})")
