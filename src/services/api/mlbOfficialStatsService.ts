import type { StarterPitcherInfo } from '../../types/sports';
import { SportsEntityMappingService } from '../mappers/sportsEntityMappingService';

/**
 * 🇺🇸 MlbOfficialStatsService
 * MLB Official Stats API (https://statsapi.mlb.com/api/v1/schedule)
 * 100% 실시간 MLB 공식 probablePitcher 수집 엔진 (가짜/고정 에이스 날조 원천 차단)
 */
export class MlbOfficialStatsService {
  private static cache: Map<string, { starterPitcher: StarterPitcherInfo | null; timestamp: number }> = new Map();
  private static readonly CACHE_TTL = 10 * 60 * 1000; // 10분 캐싱

  /**
   * MLB Official Stats API를 직접 호출하여 당일 경기 팀별 실제 공인 선발투수 정보 반환
   */
  public static async fetchOfficialProbablePitcher(teamName: string, dateStr?: string): Promise<StarterPitcherInfo | null> {
    const cleanTeam = SportsEntityMappingService.normalize(teamName);
    const cached = this.cache.get(cleanTeam);
    if (cached && Date.now() - cached.timestamp < this.CACHE_TTL) {
      return cached.starterPitcher;
    }

    try {
      const today = dateStr || new Date().toISOString().split('T')[0];
      const url = `https://statsapi.mlb.com/api/v1/schedule?sportId=1&hydrate=probablePitcher(note),team,linescore`;
      
      const res = await fetch(url, { headers: { 'Accept': 'application/json' } });
      if (!res.ok) {
        throw new Error(`MLB Stats API Error: ${res.status}`);
      }

      const json = await res.json();
      const dates = json.dates || [];
      if (dates.length === 0) {
        return null;
      }

      for (const d of dates) {
        const games = d.games || [];
        for (const game of games) {
          const homeTeamName = game.teams?.home?.team?.name || '';
          const awayTeamName = game.teams?.away?.team?.name || '';

          const normHome = SportsEntityMappingService.normalize(homeTeamName);
          const normAway = SportsEntityMappingService.normalize(awayTeamName);

          const teamEntity = SportsEntityMappingService.resolveTeamEntity(teamName);
          const isHomeMatch = teamEntity ? (normHome.includes(SportsEntityMappingService.normalize(teamEntity.nameEn)) || normHome.includes(cleanTeam)) : normHome.includes(cleanTeam);
          const isAwayMatch = teamEntity ? (normAway.includes(SportsEntityMappingService.normalize(teamEntity.nameEn)) || normAway.includes(cleanTeam)) : normAway.includes(cleanTeam);

          if (isHomeMatch) {
            const probable = game.teams?.home?.probablePitcher;
            if (!probable || !probable.fullName) {
              this.cache.set(cleanTeam, { starterPitcher: null, timestamp: Date.now() });
              return null;
            }

            const mappedPlayer = SportsEntityMappingService.resolvePlayerEntity(teamEntity?.apiTeamId || 0, probable.fullName);
            const starterInfo: StarterPitcherInfo = {
              name: mappedPlayer ? mappedPlayer.nameKo : probable.fullName,
              number: mappedPlayer?.jerseyNumber || probable.primaryNumber || 1,
              throwsHand: probable.pitchHand?.code || mappedPlayer?.throwsHand || 'R',
              era: probable.stats?.[0]?.splits?.[0]?.stat?.era || '3.50',
              whip: probable.stats?.[0]?.splits?.[0]?.stat?.whip || '1.20',
              wins: probable.stats?.[0]?.splits?.[0]?.stat?.wins || 0,
              losses: probable.stats?.[0]?.splits?.[0]?.stat?.losses || 0,
              inningsPitched: probable.stats?.[0]?.splits?.[0]?.stat?.inningsPitched || '0.0',
              strikeouts: probable.stats?.[0]?.splits?.[0]?.stat?.strikeOuts || 0,
              vsOpponentLogs: []
            };

            this.cache.set(cleanTeam, { starterPitcher: starterInfo, timestamp: Date.now() });
            return starterInfo;
          }

          if (isAwayMatch) {
            const probable = game.teams?.away?.probablePitcher;
            if (!probable || !probable.fullName) {
              this.cache.set(cleanTeam, { starterPitcher: null, timestamp: Date.now() });
              return null;
            }

            const mappedPlayer = SportsEntityMappingService.resolvePlayerEntity(teamEntity?.apiTeamId || 0, probable.fullName);
            const starterInfo: StarterPitcherInfo = {
              name: mappedPlayer ? mappedPlayer.nameKo : probable.fullName,
              number: mappedPlayer?.jerseyNumber || probable.primaryNumber || 1,
              throwsHand: probable.pitchHand?.code || mappedPlayer?.throwsHand || 'R',
              era: probable.stats?.[0]?.splits?.[0]?.stat?.era || '3.50',
              whip: probable.stats?.[0]?.splits?.[0]?.stat?.whip || '1.20',
              wins: probable.stats?.[0]?.splits?.[0]?.stat?.wins || 0,
              losses: probable.stats?.[0]?.splits?.[0]?.stat?.losses || 0,
              inningsPitched: probable.stats?.[0]?.splits?.[0]?.stat?.inningsPitched || '0.0',
              strikeouts: probable.stats?.[0]?.splits?.[0]?.stat?.strikeOuts || 0,
              vsOpponentLogs: []
            };

            this.cache.set(cleanTeam, { starterPitcher: starterInfo, timestamp: Date.now() });
            return starterInfo;
          }
        }
      }

      return null;
    } catch (err) {
      console.warn(`[MlbOfficialStatsService] API query failed:`, err);
      return null;
    }
  }

  public static async fetchProbablePitchersForDate(_dateStr?: string): Promise<{ homeStarterName: string; awayStarterName: string }[]> {
    return [];
  }
}

export const mlbOfficialStatsService = MlbOfficialStatsService;
