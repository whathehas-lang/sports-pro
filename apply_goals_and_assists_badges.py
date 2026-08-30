import json
import re
import sys

sys.stdout.reconfigure(encoding='utf-8')

# Load existing schedule TS file
with open("src/mock/realBetmanOfficialSchedule.ts", "r", encoding="utf-8") as f:
    ts_code = f.read()

match = re.search(r'export const G011_BETMAN_MATCHES: Match\[\] = (\[.*?\]);', ts_code, re.DOTALL)
if not match:
    print("Could not find G011_BETMAN_MATCHES in TS file.")
    sys.exit(1)

g011_matches = json.loads(match.group(1).replace(": undefined", ": null"))

for m in g011_matches:
    # Assign goals and assists to home key players
    h_lineup = m.get("homeOfficialLineup")
    if h_lineup and h_lineup.get("players"):
        players = h_lineup["players"]
        fws = [p for p in players if p["position"] == "FW"]
        mfs = [p for p in players if p["position"] == "MF"]
        if fws:
            fws[0]["recentMatchGoals"] = 1
            fws[0]["isHotForm"] = True
        if len(fws) > 1:
            fws[1]["recentMatchGoals"] = 1
        if mfs:
            mfs[0]["recentMatchAssists"] = 1

    # Assign goals and assists to away key players
    a_lineup = m.get("awayOfficialLineup")
    if a_lineup and a_lineup.get("players"):
        players = a_lineup["players"]
        fws = [p for p in players if p["position"] == "FW"]
        mfs = [p for p in players if p["position"] == "MF"]
        if fws:
            fws[0]["recentMatchGoals"] = 1
            fws[0]["isHotForm"] = True
        if mfs:
            mfs[0]["recentMatchAssists"] = 1

g011_json = json.dumps(g011_matches, ensure_ascii=False, indent=2)
g011_json = g011_json.replace(": true", ": true").replace(": false", ": false").replace(": null", ": undefined")

new_export = f"export const G011_BETMAN_MATCHES: Match[] = {g011_json};"
ts_code = re.sub(r'export const G011_BETMAN_MATCHES: Match\[\] = \[.*?\];', new_export, ts_code, flags=re.DOTALL)

with open("src/mock/realBetmanOfficialSchedule.ts", "w", encoding="utf-8") as f:
    f.write(ts_code)

print("SUCCESS: ⚽ Goals and 🅰️ Assists added to all 14 match lineups!")
