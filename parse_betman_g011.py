import json
import re
import sys
from bs4 import BeautifulSoup

sys.stdout.reconfigure(encoding='utf-8')

with open("betman_g011_page.html", "r", encoding="utf-8") as f:
    html = f.read()

soup = BeautifulSoup(html, "html.parser")

rows = soup.find_all("tr")
parsed_matches = []

for r in rows:
    text = r.get_text(separator=" ", strip=True)
    cells = [c.get_text(strip=True) for c in r.find_all(["td", "th"])]
    if len(cells) >= 4:
        print(f"Row: {cells}")

