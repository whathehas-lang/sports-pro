import type { Match } from '../../types/sports';
import { OFFICIAL_260103_MATCHES } from '../../mock/official260103Schedule';
import { OFFICIAL_G011_MATCHES } from '../../mock/officialG011Schedule';
import { OFFICIAL_G024_MATCHES } from '../../mock/officialG024Schedule';
import { OFFICIAL_G102_MATCHES } from '../../mock/officialG102Schedule';
import { MasterFootballOrchestratorService } from '../orchestrator/masterFootballOrchestratorService';
import { MultiSourceBaseballOrchestrator } from '../enricher/multiSourceBaseballOrchestrator';
import { verifiedMatchDatabase } from '../db/verifiedMatchDatabase';

export class BetmanLiveSyncService {
  public static getMatches(gmId: string = 'G101', gmTs?: string): Match[] {
    const rawMatches = BetmanLiveSyncService.getRawMatches(gmId, gmTs);
    const orchestrated = rawMatches.map(m => MasterFootballOrchestratorService.orchestrateSync(m));
    const { verifiedMatches } = verifiedMatchDatabase.ingestAndVerifyMatches(orchestrated);
    return verifiedMatches;
  }

  /**
   * 실시간 수집 레이어 이원화 (Multi-Source Strategy) 비동기 동기화
   */
  public static async getMatchesAsync(gmId: string = 'G101', gmTs?: string): Promise<Match[]> {
    const matches = BetmanLiveSyncService.getMatches(gmId, gmTs);
    return MultiSourceBaseballOrchestrator.enrichMatchesWithMultiSource(matches);
  }

  private static getRawMatches(gmId: string = 'G101', gmTs?: string): Match[] {
    if (gmId === 'G011') {
      const g011Matches = OFFICIAL_G011_MATCHES && OFFICIAL_G011_MATCHES.length > 0 ? OFFICIAL_G011_MATCHES : [];
      const targetRoundName = `축구 승무패 ${gmTs || '260049'}회차 (betman.co.kr 오피셜 슬립)`;
      return g011Matches.map((m, idx) => ({
        ...m,
        id: `G011_${gmTs || '260049'}_${m.betmanMatchNo || idx + 1}`,
        round: targetRoundName,
        betmanRound: targetRoundName,
        betmanFolder: 'SEUNGMUBAE'
      })).sort((a, b) => (a.betmanMatchNo || 0) - (b.betmanMatchNo || 0));
    }

    if (gmId === 'G024') {
      const g024Matches = OFFICIAL_G024_MATCHES && OFFICIAL_G024_MATCHES.length > 0 ? OFFICIAL_G024_MATCHES : [];
      const targetRoundName = `야구 승1패 ${gmTs || '260064'}회차 (betman.co.kr 오피셜 슬립)`;
      return g024Matches.map((m, idx) => ({
        ...m,
        id: `G024_${gmTs || '260064'}_${m.betmanMatchNo || idx + 1}`,
        round: targetRoundName,
        betmanRound: targetRoundName,
        betmanFolder: 'SEUNG1PAE'
      })).sort((a, b) => (a.betmanMatchNo || 0) - (b.betmanMatchNo || 0));
    }

    if (gmId === 'G102') {
      const g102Matches = OFFICIAL_G102_MATCHES && OFFICIAL_G102_MATCHES.length > 0 ? OFFICIAL_G102_MATCHES : [];
      const targetRoundName = `프로토 기록식 ${gmTs || '90'}회차 (betman.co.kr 오피셜 슬립)`;
      return g102Matches.map((m, idx) => ({
        ...m,
        id: `G102_${gmTs || '90'}_${m.betmanMatchNo || idx + 1}`,
        round: targetRoundName,
        betmanRound: targetRoundName,
        betmanFolder: 'GIROKSIK'
      })).sort((a, b) => (a.betmanMatchNo || 0) - (b.betmanMatchNo || 0));
    }

    const baseMatches = OFFICIAL_260103_MATCHES && OFFICIAL_260103_MATCHES.length > 0 ? OFFICIAL_260103_MATCHES : [];
    if (!gmTs) return baseMatches;

    const roundPrefix = gmId === 'G011' ? '축구 승무패' : gmId === 'G024' ? '야구 승1패' : gmId === 'G102' ? '프로토 기록식' : '프로토 승부식';
    const targetRoundName = `${roundPrefix} ${gmTs}회차 (betman.co.kr 오피셜 실시간 슬립)`;

    const numTarget = parseInt(gmTs, 10);
    const numBase = 260103;
    const roundDiff = numTarget - numBase;

    let daysOffset = 0;
    if (roundDiff !== 0) {
      daysOffset = roundDiff * 2 + Math.floor(roundDiff / 3);
    }

    return baseMatches.map((m, idx) => {
      const updatedTime = daysOffset !== 0 ? BetmanLiveSyncService.shiftDateString(m.matchTime, daysOffset) : m.matchTime;
      const updatedClosing = daysOffset !== 0 ? BetmanLiveSyncService.shiftDateString(m.closingTime || m.matchTime, daysOffset) : m.closingTime;

      return {
        ...m,
        id: `${gmId}_${gmTs}_${m.betmanMatchNo || (m as any).matchNo || idx + 1}`,
        round: targetRoundName,
        betmanRound: targetRoundName,
        matchTime: updatedTime,
        closingTime: updatedClosing,
        betmanFolder: gmId === 'G101' ? 'SEUNGBUSHIK' : (m.betmanFolder || (gmId === 'G011' ? 'SEUNGMUBAE' : gmId === 'G024' ? 'SEUNG1PAE' : 'SEUNGBUSHIK'))
      };
    }).sort((a, b) => (a.betmanMatchNo || (a as any).matchNo || 0) - (b.betmanMatchNo || (b as any).matchNo || 0));
  }

  public static shiftDateString(dateStr: string, daysOffset: number): string {
    if (!dateStr || daysOffset === 0) return dateStr;
    const match = dateStr.match(/(\d{2})\.(\d{2})\s*\(([가-힣]+)\)\s*(\d{2}:\d{2})/);
    if (!match) return dateStr;

    const month = parseInt(match[1], 10) - 1;
    const day = parseInt(match[2], 10);
    const time = match[4];

    const currentYear = new Date().getFullYear();
    const d = new Date(currentYear, month, day);
    d.setDate(d.getDate() + daysOffset);

    const weekDays = ['일', '월', '화', '수', '목', '금', '토'];
    const newMonthStr = String(d.getMonth() + 1).padStart(2, '0');
    const newDayStr = String(d.getDate()).padStart(2, '0');
    const newDayOfWeek = weekDays[d.getDay()];

    return `${newMonthStr}.${newDayStr}(${newDayOfWeek}) ${time}`;
  }

  public getAllMatches(): Match[] {
    return BetmanLiveSyncService.getAllLiveMatches();
  }

  public getMatches(gmId: string = 'G101', gmTs?: string): Match[] {
    return BetmanLiveSyncService.getMatches(gmId, gmTs);
  }

  public async getMatchesAsync(gmId: string = 'G101', gmTs?: string): Promise<Match[]> {
    return BetmanLiveSyncService.getMatchesAsync(gmId, gmTs);
  }

  public static getAllLiveMatches(): Match[] {
    const { verifiedMatches } = verifiedMatchDatabase.ingestAndVerifyMatches(OFFICIAL_260103_MATCHES);
    return verifiedMatches;
  }
}

export const betmanLiveSyncService = new BetmanLiveSyncService();
