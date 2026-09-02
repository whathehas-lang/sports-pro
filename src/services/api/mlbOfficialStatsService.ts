import type { StarterPitcherInfo } from '../../types/sports';
import { SportsEntityMappingService } from '../mappers/sportsEntityMappingService';

/**
 * 🇺🇸 MlbOfficialStatsService
 * MLB 메이저리그 선발투수 3단계 우선순위 수집 엔진
 * 1순위: API-Baseball (가장 빠른 선발 라인업 등록)
 * 2순위: MLB Official Stats API (statsapi.mlb.com 공인 probablePitcher)
 * 3순위: 미발표 시 '선발 미정 ⏳' 표출 (가짜/과거 선수 임의 날조 0% 원천 차단)
 */
export class MlbOfficialStatsService {
  private static cache: Map<string, { starterPitcher: StarterPitcherInfo | null; timestamp: number }> = new Map();
  private static readonly CACHE_TTL = 10 * 60 * 1000; // 10분 캐싱

  /**
   * 3단계 우선순위로 MLB 팀의 당일 선발투수 조회
   */
  public static async fetchOfficialProbablePitcher(teamName: string, dateStr?: string): Promise<StarterPitcherInfo | null> {
    const cleanTeam = SportsEntityMappingService.normalize(teamName);
    const cached = this.cache.get(cleanTeam);
    if (cached && Date.now() - cached.timestamp < this.CACHE_TTL) {
      return cached.starterPitcher;
    }

    // 1단계: API-Baseball 1순위 조회
    try {
      const apiBaseballStarter = await this.fetchFromApiBaseball(teamName, dateStr);
      if (apiBaseballStarter) {
        this.cache.set(cleanTeam, { starterPitcher: apiBaseballStarter, timestamp: Date.now() });
        return apiBaseballStarter;
      }
    } catch (e) {
      console.warn('[MlbOfficialStatsService] API-Baseball fetch warning:', e);
    }

    // 2단계: MLB Official Stats API 2순위 조회
    try {
      const mlbStatsStarter = await this.fetchFromMlbStatsApi(teamName, dateStr);
      if (mlbStatsStarter) {
        this.cache.set(cleanTeam, { starterPitcher: mlbStatsStarter, timestamp: Date.now() });
        return mlbStatsStarter;
      }
    } catch (e) {
      console.warn('[MlbOfficialStatsService] MLB Stats API fetch warning:', e);
    }

    // 3단계: 양쪽 모두 미발표인 경우 -> null 반환하여 '선발 미정 ⏳' 표출
    this.cache.set(cleanTeam, { starterPitcher: null, timestamp: Date.now() });
    return null;
  }

  /**
   * 1순위: API-Baseball Pro 실시간 수집
   */
  private static async fetchFromApiBaseball(teamName: string, dateStr?: string): Promise<StarterPitcherInfo | null> {
    const apiKey = '96ae3619c2c6f8f76ec75d64bd95d000';
    const targetDate = dateStr || new Date().toISOString().split('T')[0];
    const url = `https://v1.baseball.api-sports.io/games?league=1&season=2024&date=${targetDate}&timezone=Asia/Seoul`;

    const res = await fetch(url, {
      headers: {
        'x-apisports-key': apiKey,
        'x-rapidapi-key': apiKey
      }
    });

    if (!res.ok) return null;
    const json = await res.json();
    const games = json.response || [];

    const normTarget = SportsEntityMappingService.normalize(teamName);

    for (const g of games) {
      const homeName = g.teams?.home?.name || '';
      const awayName = g.teams?.away?.name || '';
      const isHome = SportsEntityMappingService.normalize(homeName).includes(normTarget) || normTarget.includes(SportsEntityMappingService.normalize(homeName));
      const isAway = SportsEntityMappingService.normalize(awayName).includes(normTarget) || normTarget.includes(SportsEntityMappingService.normalize(awayName));

      if (isHome && g.lineups?.home?.starting_pitcher?.name) {
        const pitcher = g.lineups.home.starting_pitcher;
        return {
          name: pitcher.name,
          number: pitcher.number || 1,
          throwsHand: pitcher.hand || 'R',
          era: pitcher.era || '3.50',
          whip: '1.20',
          wins: 0,
          losses: 0,
          inningsPitched: '0.0',
          strikeouts: 0,
          vsOpponentLogs: []
        };
      }

      if (isAway && g.lineups?.away?.starting_pitcher?.name) {
        const pitcher = g.lineups.away.starting_pitcher;
        return {
          name: pitcher.name,
          number: pitcher.number || 1,
          throwsHand: pitcher.hand || 'R',
          era: pitcher.era || '3.50',
          whip: '1.20',
          wins: 0,
          losses: 0,
          inningsPitched: '0.0',
          strikeouts: 0,
          vsOpponentLogs: []
        };
      }
    }

    return null;
  }

  /**
   * 2순위: MLB 연맹 공식 Stats API (statsapi.mlb.com) 수집
   */
  private static async fetchFromMlbStatsApi(teamName: string, dateStr?: string): Promise<StarterPitcherInfo | null> {
    const today = dateStr || new Date().toISOString().split('T')[0];
    const url = `https://statsapi.mlb.com/api/v1/schedule?sportId=1&date=${today}&hydrate=probablePitcher(note),team,linescore`;
    
    const res = await fetch(url, { headers: { 'Accept': 'application/json' } });
    if (!res.ok) return null;

    const json = await res.json();
    const dates = json.dates || [];
    if (dates.length === 0) return null;

    const cleanTeam = SportsEntityMappingService.normalize(teamName);

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
          if (!probable || !probable.fullName) return null;

          const mappedPlayer = SportsEntityMappingService.resolvePlayerEntity(teamEntity?.apiTeamId || 0, probable.fullName);
          return {
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
        }

        if (isAwayMatch) {
          const probable = game.teams?.away?.probablePitcher;
          if (!probable || !probable.fullName) return null;

          const mappedPlayer = SportsEntityMappingService.resolvePlayerEntity(teamEntity?.apiTeamId || 0, probable.fullName);
          return {
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
        }
      }
    }

    return null;
  }
}
