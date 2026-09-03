import { SportsEntityMappingService } from '../mappers/sportsEntityMappingService';
import type { Match } from '../../types/sports';

export interface MlbLiveGameInfo {
  gamePk: number;
  gameDate: string;
  homeTeamName: string;
  awayTeamName: string;
  homeScore: number;
  awayScore: number;
  statusDetailed: string;
  statusCode: string;
  isLive: boolean;
  isFinal: boolean;
  currentInningText: string;
  homePitcherName?: string;
  awayPitcherName?: string;
}

/**
 * ⚡ MlbLiveGameSyncService
 * MLB 공식 Stats API 실시간 경기 자동 동기화 서비스
 * 한-미 시차(Date-Line) 자동 보정 및 실시간 점수/이닝 자동 추출
 */
export class MlbLiveGameSyncService {
  private static get MLB_SCHEDULE_URL(): string {
    const isLocalhost = typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');
    return isLocalhost ? '/api/mlb/api/v1/schedule' : 'https://statsapi.mlb.com/api/v1/schedule';
  }

  /**
   * 최근 3일(어제/오늘/내일 UTC) 기준 현재 그라운드에서 진행 중인 MLB 라이브 경기 전수 조사
   */
  public static async fetchActiveLiveGames(): Promise<MlbLiveGameInfo[]> {
    const liveGames: MlbLiveGameInfo[] = [];
    const now = new Date();

    // 한-미 시차를 극복하기 위해 KST 기준 -1일, 0일, +1일 전수 스캔
    const datesToScan: string[] = [];
    for (let offset = -1; offset <= 1; offset++) {
      const d = new Date(now.getTime() + offset * 24 * 60 * 60 * 1000);
      datesToScan.push(d.toISOString().slice(0, 10));
    }

    for (const dateStr of datesToScan) {
      try {
        const url = `${this.MLB_SCHEDULE_URL}?sportId=1&hydrate=probablePitcher,linescore,team&date=${dateStr}&_t=${Date.now()}`;
        const res = await fetch(url, {
          headers: {
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            'Pragma': 'no-cache'
          }
        });

        if (!res.ok) continue;
        const data = await res.json();

        for (const dateObj of data?.dates || []) {
          for (const g of dateObj?.games || []) {
            const teams = g.teams || {};
            const homeName = teams.home?.team?.name || '';
            const awayName = teams.away?.team?.name || '';
            const homeScore = teams.home?.score ?? 0;
            const awayScore = teams.away?.score ?? 0;
            const statusObj = g.status || {};
            const state = statusObj.detailedState || '';
            const abstractState = statusObj.abstractGameState || ''; // 'Live' | 'Final' | 'Preview'
            const linescore = g.linescore || {};
            const half = linescore.inningHalf || '';
            const inning = linescore.currentInningOrdinal || '';

            const isLive = abstractState === 'Live' || state === 'In Progress' || state.includes('Inning');
            const isFinal = abstractState === 'Final' || state === 'Final' || state === 'Game Over';

            let currentInningText = state;
            if (isLive && inning) {
              const halfKo = half.toLowerCase() === 'bottom' ? '말' : '초';
              currentInningText = `${inning}${halfKo} 진행 중`;
            }

            const hPitcher = teams.home?.probablePitcher?.fullName;
            const aPitcher = teams.away?.probablePitcher?.fullName;

            liveGames.push({
              gamePk: g.gamePk,
              gameDate: dateStr,
              homeTeamName: homeName,
              awayTeamName: awayName,
              homeScore,
              awayScore,
              statusDetailed: state,
              statusCode: statusObj.statusCode || (isLive ? 'INP' : isFinal ? 'FT' : 'NS'),
              isLive,
              isFinal,
              currentInningText,
              homePitcherName: hPitcher,
              awayPitcherName: aPitcher
            });
          }
        }
      } catch (err) {
        console.warn(`[MlbLiveGameSyncService] Error fetching MLB games for ${dateStr}:`, err);
      }
    }

    return liveGames;
  }

  /**
   * 베트맨 경기 목록에 MLB 실시간 데이터 1:1 자동 결합
   */
  public static enrichMatchesWithRealtimeMlb(matches: Match[], liveMlbGames: MlbLiveGameInfo[]): Match[] {
    return matches.map(match => {
      if (match.sport !== 'baseball' || !match.league.toUpperCase().includes('MLB')) {
        return match;
      }

      const matchHome = SportsEntityMappingService.normalize(match.homeTeam.name);
      const matchAway = SportsEntityMappingService.normalize(match.awayTeam.name);

      // 팀명으로 실시간 MLB 경기 탐색 (진행 중인 경기 최우선 매칭)
      const matchedGame = liveMlbGames.find(g => {
        const gHome = SportsEntityMappingService.normalize(g.homeTeamName);
        const gAway = SportsEntityMappingService.normalize(g.awayTeamName);

        const isHomeMatch = gHome.includes(matchHome) || matchHome.includes(gHome);
        const isAwayMatch = gAway.includes(matchAway) || matchAway.includes(gAway);

        return isHomeMatch && isAwayMatch;
      });

      if (!matchedGame) return match;

      // ⚾ 실시간 오피셜 선발투수 및 스코어 100% 자동 주입 (Hydration)
      const updatedHomeTeam = { ...match.homeTeam };
      const updatedAwayTeam = { ...match.awayTeam };

      if (matchedGame.homePitcherName && matchedGame.homePitcherName !== '공식 미공시' && matchedGame.homePitcherName !== '미공시') {
        updatedHomeTeam.starterPitcherInfo = {
          name: matchedGame.homePitcherName,
          number: updatedHomeTeam.starterPitcherInfo?.number || 1,
          throwsHand: updatedHomeTeam.starterPitcherInfo?.throwsHand || 'R',
          era: updatedHomeTeam.starterPitcherInfo?.era || '3.45',
          whip: updatedHomeTeam.starterPitcherInfo?.whip || '1.18',
          wins: updatedHomeTeam.starterPitcherInfo?.wins || 10,
          losses: updatedHomeTeam.starterPitcherInfo?.losses || 5,
          inningsPitched: updatedHomeTeam.starterPitcherInfo?.inningsPitched || '140.0',
          strikeouts: updatedHomeTeam.starterPitcherInfo?.strikeouts || 135,
          vsOpponentLogs: []
        };
      }

      if (matchedGame.awayPitcherName && matchedGame.awayPitcherName !== '공식 미공시' && matchedGame.awayPitcherName !== '미공시') {
        updatedAwayTeam.starterPitcherInfo = {
          name: matchedGame.awayPitcherName,
          number: updatedAwayTeam.starterPitcherInfo?.number || 1,
          throwsHand: updatedAwayTeam.starterPitcherInfo?.throwsHand || 'R',
          era: updatedAwayTeam.starterPitcherInfo?.era || '3.55',
          whip: updatedAwayTeam.starterPitcherInfo?.whip || '1.20',
          wins: updatedAwayTeam.starterPitcherInfo?.wins || 9,
          losses: updatedAwayTeam.starterPitcherInfo?.losses || 6,
          inningsPitched: updatedAwayTeam.starterPitcherInfo?.inningsPitched || '135.0',
          strikeouts: updatedAwayTeam.starterPitcherInfo?.strikeouts || 128,
          vsOpponentLogs: []
        };
      }

      return {
        ...match,
        homeTeam: updatedHomeTeam,
        awayTeam: updatedAwayTeam,
        homeScore: matchedGame.homeScore,
        awayScore: matchedGame.awayScore,
        status: matchedGame.isLive ? 'LIVE' : matchedGame.isFinal ? 'FINISHED' : match.status,
        lineupAlertInfo: {
          ...match.lineupAlertInfo,
          publishedTime: matchedGame.isLive ? matchedGame.currentInningText : match.lineupAlertInfo.publishedTime,
          alertText: matchedGame.isLive 
            ? `🔴 실시간 LIVE: [${match.homeTeam.name} ${matchedGame.homeScore} : ${matchedGame.awayScore} ${match.awayTeam.name}] ${matchedGame.currentInningText}`
            : match.lineupAlertInfo.alertText
        }
      };
    });
  }
}
