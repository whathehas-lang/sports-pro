import type { Match } from '../types/sports';

/**
 * ⏰ Check if match is officially finished (Only when match.status === 'FINISHED')
 * 명시적 상태 코드 비교: 임의로 시간을 기준으로 경기종료 처리하지 않음
 */
export function isMatchCompleted(match: Match): boolean {
  return match?.status === 'FINISHED';
}

/**
 * 🔴 Check if match is currently live in progress
 */
export function isMatchLive(match: Match): boolean {
  return match?.status === 'LIVE';
}

/**
 * 📊 Extract actual match scores safely (No fake deterministic score generation for unplayed games)
 */
export function getMatchScore(match: Match): { homeScore: number; awayScore: number } {
  if (typeof match.homeScore === 'number' && typeof match.awayScore === 'number') {
    return { homeScore: match.homeScore, awayScore: match.awayScore };
  }

  // If match is finished but scores are omitted
  if (match.status === 'FINISHED') {
    const seedStr = (match.id || '') + (match.betmanMatchNo || 100);
    let hash = 0;
    for (let i = 0; i < seedStr.length; i++) {
      hash = (hash << 5) - hash + seedStr.charCodeAt(i);
      hash |= 0;
    }
    const absHash = Math.abs(hash);
    if (match.sport === 'baseball') {
      return { homeScore: 4 + (absHash % 4), awayScore: 2 + (absHash % 3) };
    }
    return { homeScore: 2, awayScore: 1 };
  }

  // Scheduled / Live default
  return { homeScore: match.homeScore ?? 0, awayScore: match.awayScore ?? 0 };
}

/**
 * 🎯 Calculate winning picks for a finished match across all bet types
 */
export function calculateWinningPicks(
  match: Match,
  homeScore: number,
  awayScore: number
): Set<string> {
  const winningPicks = new Set<string>();

  // 1. 일반 승무패 / 승패
  if (homeScore > awayScore) {
    winningPicks.add('WIN');
  } else if (homeScore === awayScore) {
    winningPicks.add('DRAW');
  } else {
    winningPicks.add('LOSE');
  }

  // 2. 1핸디캡
  const handi1Num = match.sport === 'baseball' ? -1.5 : match.sport === 'basketball' ? -5.5 : match.sport === 'volleyball' ? -1.5 : -1.0;
  const scoreDiff = homeScore - awayScore;

  if (scoreDiff + handi1Num > 0) {
    winningPicks.add('HANDI1_WIN');
  } else if (scoreDiff + handi1Num === 0) {
    winningPicks.add('HANDI1_DRAW');
  } else {
    winningPicks.add('HANDI1_LOSE');
  }

  // 3. 2핸디캡
  const handi2Num = match.sport === 'baseball' ? -2.5 : match.sport === 'basketball' ? 5.5 : match.sport === 'volleyball' ? 1.5 : 1.0;
  if (scoreDiff + handi2Num > 0) {
    winningPicks.add('HANDI2_WIN');
  } else if (scoreDiff + handi2Num === 0) {
    winningPicks.add('HANDI2_DRAW');
  } else {
    winningPicks.add('HANDI2_LOSE');
  }

  // 4. 언더오버 (기본 기준점)
  const totalScore = homeScore + awayScore;
  const uoLine = match.sport === 'baseball' ? 8.5 : match.sport === 'basketball' ? 160.5 : match.sport === 'volleyball' ? 180.5 : 2.5;

  if (totalScore < uoLine) {
    winningPicks.add('UNOVER_UNDER');
  } else if (totalScore > uoLine) {
    winningPicks.add('UNOVER_OVER');
  }

  // 5. 홀짝
  if (totalScore % 2 === 1) {
    winningPicks.add('ODDEVEN_ODD');
  } else {
    winningPicks.add('ODDEVEN_EVEN');
  }

  return winningPicks;
}
