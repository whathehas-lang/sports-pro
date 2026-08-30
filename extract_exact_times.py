import re
import os

if os.path.exists('betman_scraped_live.html'):
    with open('betman_scraped_live.html', 'r', encoding='utf-8') as f:
        html = f.read()

    # Find all date/time patterns like 08.29(토) 09:00 or 08/29 09:00 or 2026-08-29 or 09:00
    times = re.findall(r'\d{2}[\.\/-]\d{2}(?:\([가-힣]+\))?\s*\d{2}:\d{2}', html)
    print("Found exact date-times in HTML:", times[:30])
else:
    print("betman_scraped_live.html does not exist.")
