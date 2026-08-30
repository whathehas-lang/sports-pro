import json
import sys

sys.stdout.reconfigure(encoding='utf-8')

log_path = r"C:\Users\user\.gemini\antigravity\brain\9bb3e482-4c8f-4fb6-8be3-60140f5c63ea\.system_generated\logs\transcript.jsonl"

with open(log_path, "r", encoding="utf-8") as f:
    for i, line in enumerate(f):
        data = json.loads(line)
        content = str(data.get("content", ""))
        user_msg = str(data.get("type", ""))
        if any(term in content.lower() for term in ["rapid", "api-football", "api_key", "키", "v3"]):
            if data.get("source") == "USER_EXPLICIT" or "key" in content.lower() or "rapid" in content.lower():
                print(f"[{i}] [{data.get('source')}] {content[:200]}\n")
