import type { ApiResponseWrapper } from './types';

export class SportsApiClient {
  private footballBaseUrl: string;
  private baseballBaseUrl: string;
  private apiKey: string;
  private useMockData: boolean;

  constructor() {
    this.footballBaseUrl = import.meta.env.VITE_FOOTBALL_API_URL || 'https://v3.football.api-sports.io';
    this.baseballBaseUrl = import.meta.env.VITE_BASEBALL_API_URL || 'https://v1.baseball.api-sports.io';
    this.apiKey = import.meta.env.VITE_SPORTS_API_KEY || '78E5418A27df6C588D10823E3D22C5fa';
    this.useMockData = import.meta.env.VITE_USE_MOCK_DATA === 'true';
  }

  public isMockMode(): boolean {
    return this.useMockData;
  }

  public async get<T>(
    endpoint: string,
    params?: Record<string, string>,
    sportType: 'football' | 'baseball' = 'football'
  ): Promise<ApiResponseWrapper<T> | null> {
    if (this.useMockData) {
      console.warn('[SportsApiClient] Running in MOCK mode.');
      return null;
    }

    try {
      const baseUrl = sportType === 'baseball' ? this.baseballBaseUrl : this.footballBaseUrl;
      const url = new URL(`${baseUrl}${endpoint}`);
      if (params) {
        Object.entries(params).forEach(([key, val]) => url.searchParams.append(key, val));
      }

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s timeout

      const response = await fetch(url.toString(), {
        method: 'GET',
        headers: {
          'x-apisports-key': this.apiKey,
          'Content-Type': 'application/json'
        },
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`API HTTP Error: ${response.status} ${response.statusText}`);
      }

      const data: ApiResponseWrapper<T> = await response.json();
      return data;
    } catch (error) {
      console.error(`[SportsApiClient] Request failed for ${endpoint}:`, error);
      return null;
    }
  }
}

export const sportsApiClient = new SportsApiClient();
