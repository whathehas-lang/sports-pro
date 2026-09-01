import type { Match, StarterPitcherInfo } from '../../types/sports';
import { MlbOfficialStatsService } from '../api/mlbOfficialStatsService';
import { KboNpbOfficialLineupService } from '../crawler/kboNpbOfficialLineupService';
import { SportsPlayerMappingService } from './sportsPlayerMappingService';
import { H2HRecentFormEngine } from './h2hRecentFormEngine';

/**
 * 🌐 MultiSourceBaseballOrchestrator
 * 수집 레이어 이원화 (Multi-Source Strategy) 전담 오케스트레이터
 *
 * 1. 메인 API (API-Sports): 일정, 팀 기본 정보, 실시간 스코어, 텍스트 중계 관리
 * 2. 보완 데이터원 (선발 전용):
 *    - KBO / NPB: 공식 홈페이지 예고선발 크롤링 데이터원 (koreabaseball.com, npb.jp)
 *    - MLB: MLB Official Stats API (https://statsapi.mlb.com/api/v1/schedule) 직접 호출
 */
export class MultiSourceBaseballOrchestrator {
  /**
   * 경기 목록에 이원화된 보완 선발투수 데이터를 주입/검증
   */
  public static async enrichMatchesWithMultiSource(matches: Match[]): Promise<Match[]> {
    return Promise.all(
      matches.map(async (m) => {
        if (m.sport !== 'baseball') return m;

        const isHomeStarterValid = !!m.homeTeam.starterPitcherInfo?.name && 
          !m.homeTeam.starterPitcherInfo.name.includes('선발투수') && 
          !m.homeTeam.starterPitcherInfo.name.includes('미정') && 
          m.homeTeam.starterPitcherInfo.name !== '선발';

        const isAwayStarterValid = !!m.awayTeam.starterPitcherInfo?.name && 
          !m.awayTeam.starterPitcherInfo.name.includes('선발투수') && 
          !m.awayTeam.starterPitcherInfo.name.includes('미정') && 
          m.awayTeam.starterPitcherInfo.name !== '선발';

        let homeStarter: StarterPitcherInfo | null = isHomeStarterValid ? m.homeTeam.starterPitcherInfo : null;
        let awayStarter: StarterPitcherInfo | null = isAwayStarterValid ? m.awayTeam.starterPitcherInfo : null;

        // 1. MLB 경기인 경우 -> 미정인 선발투수에 대해 MLB Official Stats API 호출
        if ((!homeStarter || !awayStarter) && (m.league.includes('MLB') || m.countryFlag === '🇺🇸')) {
          if (!homeStarter) {
            homeStarter = await MlbOfficialStatsService.fetchOfficialProbablePitcher(m.homeTeam.name);
          }
          if (!awayStarter) {
            awayStarter = await MlbOfficialStatsService.fetchOfficialProbablePitcher(m.awayTeam.name);
          }
        }

        // 2. KBO / NPB 경기인 경우 -> 미정인 선발투수에 대해 공식 홈페이지 크롤러 데이터원 조회
        if (!homeStarter || !awayStarter) {
          if (m.league.includes('KBO') || m.league.includes('NPB') || m.countryFlag === '⚾') {
            homeStarter = homeStarter || KboNpbOfficialLineupService.getOfficialStarter(m.homeTeam.name);
            awayStarter = awayStarter || KboNpbOfficialLineupService.getOfficialStarter(m.awayTeam.name);
          }
        }

        // 3. 최종 Fallback 및 한글 정규화
        const rawHomeStarter = homeStarter || m.homeTeam.starterPitcherInfo;
        const rawAwayStarter = awayStarter || m.awayTeam.starterPitcherInfo;

        const finalHomeStarter = rawHomeStarter ? SportsPlayerMappingService.mapApiPitcherToKorean(rawHomeStarter, m.homeTeam.name) : null;
        const finalAwayStarter = rawAwayStarter ? SportsPlayerMappingService.mapApiPitcherToKorean(rawAwayStarter, m.awayTeam.name) : null;

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


        // ⚔️ 상대전적 및 최근 경기 로그 100% 오피셜 자동 바인딩
        return H2HRecentFormEngine.enrichH2HAndRecentLogs(baseEnriched);
      })
    );
  }
}
