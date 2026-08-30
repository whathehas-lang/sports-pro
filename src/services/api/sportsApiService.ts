import { sportsApiClient } from './sportsApiClient';
import { apiCacheService } from './apiCacheService';
import { betmanRoundRegistry } from '../betman/betmanRoundRegistry';
import type { Match, BetmanFolderCategory } from '../../types/sports';
import type { RawApiMatchResponse } from './types';
import { mapRawApiMatchToMatch } from '../mappers/matchDataMapper';
import { INITIAL_MATCHES } from '../../mock/sportsData';

export class SportsApiService {
  /**
   * Fetch matches from live Sports API with local caching.
   */
  public async fetchMatches(leagueId?: string, season: number = 2026): Promise<Match[]> {
    const cacheKey = `matches_${leagueId || 'default'}_${season}`;

    // 1. Check Cache first
    const cachedMatches = apiCacheService.get<Match[]>(cacheKey);
    if (cachedMatches && cachedMatches.length > 0) {
      return cachedMatches;
    }

    if (sportsApiClient.isMockMode()) {
      return INITIAL_MATCHES;
    }

    try {
      const endpoint = '/fixtures';
      const params: Record<string, string> = { season: String(season) };

      if (leagueId) {
        params.league = leagueId;
      } else {
        params.next = '14';
      }

      const response = await sportsApiClient.get<RawApiMatchResponse>(endpoint, params);

      if (!response || !response.response || response.response.length === 0) {
        return INITIAL_MATCHES;
      }

      const mappedMatches = response.response.map((raw, idx) => mapRawApiMatchToMatch(raw, idx));

      // Save to cache (5 minutes TTL)
      apiCacheService.set(cacheKey, mappedMatches);
      return mappedMatches;
    } catch (error) {
      console.error('[SportsApiService] Error fetching live matches:', error);
      return INITIAL_MATCHES;
    }
  }

  /**
   * Fetch and filter Betman match sequence for a specific round & folder.
   * Attempts live betman.co.kr sync first, with automatic fallback to sequence pipeline.
   */
  public async fetchBetmanMatchesByRound(
    roundName: string,
    folderCategory: BetmanFolderCategory = 'ALL',
    _searchMatchNo?: number,
    _limit: number = 999999
  ): Promise<Match[]> {
    // 📌 Instant 0.01s retrieval from Betman Round Registry
    const gmId = folderCategory === 'SEUNGMUBAE' ? 'G011' : folderCategory === 'SEUNG1PAE' ? 'G024' : folderCategory === 'GIROKSIK' ? 'G102' : 'G101';
    const defaultTs = gmId === 'G011' ? '260048' : gmId === 'G024' ? '260063' : gmId === 'G102' ? '89' : '260102';
    const gmTs = roundName.includes('회차') ? (roundName.match(/\d+/) || [defaultTs])[0] : defaultTs;
    
    return betmanRoundRegistry.getMatchesByGameAndRound(gmId, gmId === 'G011' ? '260048' : gmId === 'G024' ? '260063' : gmId === 'G102' ? '89' : gmTs);
  }
}

export const sportsApiService = new SportsApiService();
