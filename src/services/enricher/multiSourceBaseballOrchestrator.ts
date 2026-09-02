import type { Match, StarterPitcherInfo } from '../../types/sports';
import { MlbOfficialStatsService } from '../api/mlbOfficialStatsService';
import { KboOfficialLiveCollector } from '../crawler/kboOfficialLiveCollector';
import { KboNpbOfficialLineupService } from '../crawler/kboNpbOfficialLineupService';
import { SportsPlayerMappingService } from './sportsPlayerMappingService';
import { H2HRecentFormEngine } from './h2hRecentFormEngine';

/**
 * 🌐 MultiSourceBaseballOrchestrator
 * 수집 레이어 이원화 (Multi-Source Strategy) 전담 오케스트레이터
 *
 * 1. 1순위 (선발투수/라인업): KBO 공식/네이버 실시간망 및 MLB Official Stats API 실시간 조회
 * 2. 2순위 (상세지표/H2H): API-Sports Pro (API-Baseball / API-Football) 대용량 통계망 자동 결합
 */
export class MultiSourceBaseballOrchestrator {
  /**
   * 경기 목록에 이원화된 보완 선발투수 데이터를 주입/검증
   */
  public static async enrichMatchesWithMultiSource(matches: Match[]): Promise<Match[]> {
    return Promise.all(
      matches.map(async (m) => {
        if (m.sport !== 'baseball') return m;

        let homeStarter: StarterPitcherInfo | null = null;
        let awayStarter: StarterPitcherInfo | null = null;

        // 1. KBO 경기인 경우 -> KBO 공식/네이버 실시간 수집기 1순위 호출 (실측 100% 팩트)
        const isKbo = m.league.includes('KBO') || m.countryFlag === '🇰🇷' || 
          ['LG', '두산', '한화', 'KIA', '삼성', '롯데', '키움', 'KT', 'SSG', 'NC'].some(t => m.homeTeam.name.includes(t) || m.awayTeam.name.includes(t));

        if (isKbo) {
          const kboStarters = await KboOfficialLiveCollector.getOfficialStarterForMatch(m);
          homeStarter = kboStarters.homeStarter;
          awayStarter = kboStarters.awayStarter;
        } else if (m.league.includes('MLB') || m.countryFlag === '🇺🇸') {
          // 2. MLB 경기인 경우 -> MLB Official Stats API 실시간 호출
          homeStarter = await MlbOfficialStatsService.fetchOfficialProbablePitcher(m.homeTeam.name);
          awayStarter = await MlbOfficialStatsService.fetchOfficialProbablePitcher(m.awayTeam.name);
        } else if (m.league.includes('NPB') || m.countryFlag === '🇯🇵') {
          // 3. NPB 경기인 경우 -> 일본 공식 라인업 서비스 조회
          homeStarter = KboNpbOfficialLineupService.getOfficialStarter(m.homeTeam.name);
          awayStarter = KboNpbOfficialLineupService.getOfficialStarter(m.awayTeam.name);
        }

        // 4. 가짜/임의 선수명 배제하고 검증된 선발투수만 바인딩
        const finalHomeStarter = homeStarter || (isKbo ? m.homeTeam.starterPitcherInfo : null);
        const finalAwayStarter = awayStarter || (isKbo ? m.awayTeam.starterPitcherInfo : null);

        const baseEnriched: Match = {
          ...m,
          homeTeam: {
            ...m.homeTeam,
            name: SportsPlayerMappingService.normalizeTeamName(m.homeTeam.name),
            starterPitcherInfo: finalHomeStarter
          },
          awayTeam: {
            ...m.awayTeam,
            name: SportsPlayerMappingService.normalizeTeamName(m.awayTeam.name),
            starterPitcherInfo: finalAwayStarter
          },
          isPitcherAnnounced: Boolean(finalHomeStarter && finalAwayStarter),
          isDataCheckingPending: false
        };

        // ⚔️ 2단계: API-Sports Pro 대용량 H2H 및 최근 경기 로그 100% 자동 결합
        return H2HRecentFormEngine.enrichH2HAndRecentLogs(baseEnriched);
      })
    );
  }
}
