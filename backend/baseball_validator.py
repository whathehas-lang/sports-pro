"""
Baseball Data Cross-Validation & Anomaly Detection Module (Python Backend)
Rejects physically impossible data, raises outlier warning flags, and quarantines anomalies.
"""

from typing import Dict, Any, List, Tuple

class BaseballDataValidator:
    @staticmethod
    def parse_innings_to_decimal(innings_str: str) -> float:
        """'5.2' -> 5.666, '0.1' -> 0.333"""
        if not innings_str:
            return 0.0
        try:
            parts = str(innings_str).split('.')
            full_innings = int(parts[0])
            outs = int(parts[1]) if len(parts) > 1 else 0
            return full_innings + (outs / 3.0)
        except Exception:
            return 0.0

    @classmethod
    def validate_pitcher_record(cls, pitcher: Dict[str, Any]) -> Tuple[bool, str, List[str]]:
        """
        Validate single pitcher record.
        Returns: (is_valid, action, issues_list)
        action: 'SAVE', 'REJECT', 'WARNING', 'QUARANTINE'
        """
        issues = []
        name = pitcher.get("name", "Unknown")
        total_pitches = pitcher.get("pitches", 0)
        strikes = pitcher.get("strikes", 0)
        balls = pitcher.get("balls", 0)
        innings_str = str(pitcher.get("innings", "0.0"))
        dec_innings = cls.parse_innings_to_decimal(innings_str)

        # 🚨 Rule 1: 음수값 검증
        if total_pitches < 0 or strikes < 0 or balls < 0:
            issues.append(f"[ERROR] Negative value detected for {name}: pitches={total_pitches}")
            return False, "REJECT", issues

        # 🚨 Rule 2: 총 투구수 < 스트라이크 수 + 볼수 ➡️ DB 저장 즉시 거부 (REJECT)
        if strikes > 0 and balls > 0 and total_pitches < (strikes + balls):
            issues.append(
                f"[REJECT] Impossible pitch sum: {name} total pitches ({total_pitches}) < strikes ({strikes}) + balls ({balls})"
            )
            return False, "REJECT", issues

        # 🚨 Rule 3: 1명 투수 총 투구수 > 160구 ➡️ 이상치(Outlier) 경고 플래그 생성
        if total_pitches > 160:
            issues.append(
                f"[WARNING] Outlier detected: {name} thrown {total_pitches} pitches (>160 threshold)"
            )

        # 🚨 Rule 4: 이닝 수 대비 투구수 불일치 ➡️ 검증 대기(QUARANTINE) 전환
        if dec_innings > 0:
            if dec_innings <= 0.34 and total_pitches >= 65:
                issues.append(
                    f"[QUARANTINE] Anomaly: {name} pitched {total_pitches} pitches in only {innings_str} IP"
                )
                return False, "QUARANTINE", issues
            elif dec_innings >= 6.0 and total_pitches < 25:
                issues.append(
                    f"[QUARANTINE] Anomaly: {name} pitched only {total_pitches} pitches in {innings_str} IP"
                )
                return False, "QUARANTINE", issues

        if any("[WARNING]" in i for i in issues):
            return True, "WARNING", issues

        return True, "SAVE", issues

if __name__ == "__main__":
    # Self-test rules
    # Test 1: Impossible pitches (90 < 60 + 40)
    p1 = {"name": "테스트1", "pitches": 90, "strikes": 60, "balls": 40, "innings": "5.0"}
    valid1, act1, msg1 = BaseballDataValidator.validate_pitcher_record(p1)
    print("Test 1 (Sum mismatch):", act1, msg1)
    assert act1 == "REJECT"

    # Test 2: Outlier (175 pitches)
    p2 = {"name": "테스트2", "pitches": 175, "strikes": 100, "balls": 65, "innings": "8.0"}
    valid2, act2, msg2 = BaseballDataValidator.validate_pitcher_record(p2)
    print("Test 2 (160+ Outlier):", act2, msg2)
    assert act2 == "WARNING"

    # Test 3: Inning mismatch (0.1 IP with 75 pitches)
    p3 = {"name": "테스트3", "pitches": 75, "strikes": 40, "balls": 30, "innings": "0.1"}
    valid3, act3, msg3 = BaseballDataValidator.validate_pitcher_record(p3)
    print("Test 3 (Inning Anomaly):", act3, msg3)
    assert act3 == "QUARANTINE"

    print("All validation rules passed successfully!")
