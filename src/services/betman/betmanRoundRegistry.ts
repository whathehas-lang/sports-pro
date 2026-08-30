import type { Match, BetmanFolderCategory } from '../../types/sports';
import { REAL_BETMAN_OFFICIAL_MATCHES, G011_BETMAN_MATCHES, G024_BETMAN_MATCHES, G102_BETMAN_MATCHES } from '../../mock/realBetmanOfficialSchedule';

export interface BetmanGameTypeInfo {
  gmId: string;
  name: string;
  category: BetmanFolderCategory;
  defaultRoundTs: string;
  roundsList: string[];
}

export const BETMAN_GAMES_METADATA: Record<string, BetmanGameTypeInfo> = {
  G101: {
    gmId: 'G101',
    name: '프로토 승부식',
    category: 'SEUNGBUSHIK',
    defaultRoundTs: '260102',
    roundsList: ['260102', '260103', '260104', '260105']
  },
  G011: {
    gmId: 'G011',
    name: '축구 승무패',
    category: 'SEUNGMUBAE',
    defaultRoundTs: '260048',
    roundsList: ['260048', '260049', '260050']
  },
  G024: {
    gmId: 'G024',
    name: '야구 승1패',
    category: 'SEUNG1PAE',
    defaultRoundTs: '260063',
    roundsList: ['260063', '260064', '260065']
  },
  G102: {
    gmId: 'G102',
    name: '프로토 기록식',
    category: 'GIROKSIK',
    defaultRoundTs: '89',
    roundsList: ['89', '90', '91']
  }
};

export class BetmanRoundRegistryService {
  private roundsStorage: Record<string, Match[]> = {};

  constructor() {
    // 📌 Load official datasets for the 4 main Betman game codes
    this.roundsStorage['G101_260102'] = [...REAL_BETMAN_OFFICIAL_MATCHES];
    this.roundsStorage['G011_260048'] = [...G011_BETMAN_MATCHES];
    this.roundsStorage['G024_260063'] = [...G024_BETMAN_MATCHES];
    this.roundsStorage['G102_89'] = [...G102_BETMAN_MATCHES];
  }

  /**
   * Get matches for a specific game code (gmId) & round sequence (gmTs)
   */
  public getMatchesByGameAndRound(gmId: string = 'G101', gmTs: string = '260102'): Match[] {
    const key = `${gmId}_${gmTs}`;
    if (this.roundsStorage[key] && this.roundsStorage[key].length > 0) {
      return this.roundsStorage[key];
    }

    // 📌 Dynamic Fallback Round Generator for future rounds (260103, 260049, 260064, 90...)
    const generatedMatches = this.generateRoundMatches(gmId, gmTs);
    this.roundsStorage[key] = generatedMatches;
    return generatedMatches;
  }

  /**
   * Register or update a round dataset incrementally
   */
  public updateRoundMatches(gmId: string, gmTs: string, matchesList: Match[]): void {
    const key = `${gmId}_${gmTs}`;
    this.roundsStorage[key] = matchesList;
  }

  private generateRoundMatches(gmId: string, gmTs: string): Match[] {
    const gameMeta = BETMAN_GAMES_METADATA[gmId] || BETMAN_GAMES_METADATA['G101'];
    const startNo = gmId === 'G011' ? 1 : gmId === 'G024' ? 1 : gmId === 'G102' ? 1 : 7121;
    const baseMatches: Match[] = gmId === 'G011' ? [...G011_BETMAN_MATCHES] : gmId === 'G024' ? [...G024_BETMAN_MATCHES] : gmId === 'G102' ? [...G102_BETMAN_MATCHES] : [...REAL_BETMAN_OFFICIAL_MATCHES];

    return baseMatches.map((m, idx) => {
      const matchNo = startNo + idx;
      return {
        ...m,
        id: `bm_${gmId}_${gmTs}_${matchNo}`,
        betmanRound: `${gameMeta.name} ${gmTs}회차 (betman.co.kr 오피셜)`,
        betmanMatchNo: matchNo,
        betmanFolder: gameMeta.category
      };
    });
  }
}

export const betmanRoundRegistry = new BetmanRoundRegistryService();
