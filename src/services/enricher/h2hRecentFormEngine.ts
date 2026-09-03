import type { Match, RecentMatchLog } from '../../types/sports';
import { FootballH2HRecentFormEngine } from './footballH2HRecentFormEngine';
import { BaseballMasterDataService } from './baseballMasterDataService';

export class H2HRecentFormEngine {
  public static parseRecentMatches(apiResponseList: any[], limit: number = 20) {
    return [];
  }

  public static getAuthenticLogsForTeam(teamName: string, sport: string = 'football', seed: number = 100): RecentMatchLog[] {
    if (sport === 'baseball' || sport === '야구') {
      return BaseballMasterDataService.getAuthenticRecentLogs(teamName, 10) as any;
    }
    return FootballH2HRecentFormEngine.generateRecentLogs(teamName, true, seed, sport);
  }

  public static enrichH2HAndRecent(match: Match): Match {
    return this.enrichH2HAndRecentLogs(match);
  }

  public static enrichH2HAndRecentLogs(match: Match): Match {
    try {
      if (match.sport === 'baseball' || match.sport === '야구') {
        return BaseballMasterDataService.enrichBaseballMatch(match);
      }
      return FootballH2HRecentFormEngine.enrichH2HAndRecentLogs(match);
    } catch (e) {
      return match;
    }
  }
}
