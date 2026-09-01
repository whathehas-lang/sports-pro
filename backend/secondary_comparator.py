"""
Secondary Source Cross-Comparator (Python Backend)
Compares Primary API (API-Baseball) with Official Secondary Data (KBO/MLB Official Stats)
"""

import sys
from typing import Dict, Any, Tuple

class SecondarySourceComparator:
    @staticmethod
    def compare_pitch_counts(
        pitcher_name: str,
        primary_pitches: int,
        secondary_pitches: int,
        source_name: str = "Official Source"
    ) -> Tuple[int, str, str]:
        """
        Compare primary API pitch count against official secondary ground truth.
        Returns: (final_pitches, verdict, evidence_text)
        """
        delta = abs(primary_pitches - secondary_pitches)

        if delta == 0:
            return (
                primary_pitches,
                "PERFECT_MATCH",
                f"[MATCH] {pitcher_name} {primary_pitches} pitches ({source_name} 100% Match)"
            )
        elif delta <= 2:
            # 1~2 pitches discrepancy -> auto-correct using official secondary source
            return (
                secondary_pitches,
                "MINOR_AUTO_CORRECTED",
                f"[AUTO-CORRECT] {pitcher_name} {primary_pitches} -> {secondary_pitches} ({source_name} corrected {delta} pitch delta)"
            )
        else:
            # >=3 pitches major discrepancy -> override with official ground truth
            return (
                secondary_pitches,
                "MAJOR_OVERRIDDEN",
                f"[OVERRIDE] Major API discrepancy: {primary_pitches} -> {secondary_pitches} ({source_name} ground truth enforced)"
            )

if __name__ == "__main__":
    # Test 1: Exact match
    p, v, msg = SecondarySourceComparator.compare_pitch_counts("Lim Chan-gyu", 82, 82, "KBO Official")
    print("Test 1:", v, msg)
    assert p == 82 and v == "PERFECT_MATCH"

    # Test 2: Minor 1-pitch lag
    p, v, msg = SecondarySourceComparator.compare_pitch_counts("Kim Taek-yeon", 17, 18, "KBO Official")
    print("Test 2:", v, msg)
    assert p == 18 and v == "MINOR_AUTO_CORRECTED"

    # Test 3: Major API discrepancy (e.g. API returned 45, Official is 88)
    p, v, msg = SecondarySourceComparator.compare_pitch_counts("Gerrit Cole", 45, 88, "MLB Official Stats API")
    print("Test 3:", v, msg)
    assert p == 88 and v == "MAJOR_OVERRIDDEN"

    print("SecondarySourceComparator self-tests: ALL PASS")
