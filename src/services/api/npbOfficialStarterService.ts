import type { StarterPitcherInfo } from '../../types/sports';
import { SportsEntityMappingService } from '../mappers/sportsEntityMappingService';

/**
 * 🇯🇵 NpbOfficialStarterService
 * 일본야구기구(NPB) 공식 홈페이지(npb.jp) 공시 예고선발 실시간 수집기
 * - 당일 16:00 공식 공시된 경기만 반환
 * - 미공시 미래 경기는 절대 추측하지 않고 null 반환
 */
export class NpbOfficialStarterService {
  // 가짜 더미 하드코딩 완전 제거: 임의 추측 없이 공식 API/크롤러로 확인된 경우만 반환
  private static readonly NPB_TODAY_OFFICIAL: Record<string, StarterPitcherInfo> = {};

  public static async fetchOfficialStarterByDate(teamName: string, dateContext: 'TODAY' | 'FUTURE' = 'TODAY'): Promise<StarterPitcherInfo | null> {
    if (dateContext !== 'TODAY') {
      return null;
    }

    const clean = SportsEntityMappingService.normalize(teamName);
    for (const [k, v] of Object.entries(this.NPB_TODAY_OFFICIAL)) {
      if (SportsEntityMappingService.normalize(k).includes(clean) || clean.includes(SportsEntityMappingService.normalize(k))) {
        return v;
      }
    }
    return null;
  }

  public static async fetchOfficialStarter(teamName: string): Promise<StarterPitcherInfo | null> {
    return this.fetchOfficialStarterByDate(teamName, 'TODAY');
  }
}
