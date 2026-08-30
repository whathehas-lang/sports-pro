import re
import json

def parse_real_betman_text():
    with open("betman_body_text.txt", "r", encoding="utf-8") as f:
        text = f.read()

    # Regular expression to match match blocks:
    # Example block:
    # 08.29 (토)
    # 10:40 undefinedMLB 애슬레틱스VS볼티모어 오리올스
    # ...
    # 7254
    # 조합 · 한경기
    # 야구 승패
    # 애슬레틱스 vs 볼티모어 오리올스
    # 승
    # 1.85 ...

    pattern = re.compile(
        r'(\d{2}\.\d{2}\s*\([가-힣]+\))\s*\n\s*(\d{2}:\d{2})\s*(?:undefined)?([^\nVS]+)VS([^\n]+)\n[\s\S]*?(\d{4,5})\n[^\n]*\n([^\n]+)\n\s*([^\n]+)\s*vs\s*([^\n]+)',
        re.MULTILINE
    )

    matches = []
    seen_seq = set()

    for m in pattern.finditer(text):
        date_str = m.group(1).strip()
        time_str = m.group(2).strip()
        league_raw = m.group(3).strip()
        away_head = m.group(4).strip()
        seq_no = int(m.group(5).strip())
        game_type = m.group(6).strip()
        home_team = m.group(7).strip()
        away_team = m.group(8).strip()

        if seq_no in seen_seq:
            continue
        seen_seq.add(seq_no)

        sport = 'football'
        flag = '⚽'
        if '야구' in game_type or 'MLB' in league_raw or 'NPB' in league_raw or 'KBO' in league_raw:
            sport = 'baseball'
            flag = '🇰🇷' if 'KBO' in league_raw else '🇯🇵' if 'NPB' in league_raw else '⚾'
        elif '축구' in game_type or '리그' in league_raw:
            sport = 'football'
            flag = '🇯🇵' if '일본' in league_raw or 'J' in league_raw else '🇰🇷' if 'K' in league_raw else '⚽'

        matches.append({
            'seq': seq_no,
            'matchTime': f"{date_str} {time_str}",
            'league': league_raw,
            'gameType': game_type,
            'homeTeam': home_team,
            'awayTeam': away_team,
            'sport': sport,
            'flag': flag
        })

    print(f"Total pure matches parsed: {len(matches)}")
    with open("betman_100_percent_real.json", "w", encoding="utf-8") as f:
        json.dump(matches, f, ensure_ascii=False, indent=2)

if __name__ == "__main__":
    parse_real_betman_text()
