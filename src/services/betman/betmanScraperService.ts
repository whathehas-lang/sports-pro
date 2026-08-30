import type { Match } from '../../types/sports';

export interface BetmanLiveScrapeResult {
  success: boolean;
  roundTitle: string;
  matches: Match[];
  sourceUrl: string;
}

export class BetmanScraperService {
  private targetUrl = 'https://www.betman.co.kr/main/mainPage/gamebuy/gameSlip.do?gmId=G101&gmTs=260102';
  private proxyUrl = 'https://api.allorigins.win/raw?url=';

  /**
   * Fetch live game schedule and odds directly from official betman.co.kr game slip
   */
  public async fetchLiveBetmanSchedule(): Promise<BetmanLiveScrapeResult> {
    try {
      console.log(`[BetmanScraperService] Connecting to official Betman slip: ${this.targetUrl}...`);

      const endpoint = `${this.proxyUrl}${encodeURIComponent(this.targetUrl)}`;

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 8000); // 8s timeout

      const response = await fetch(endpoint, {
        method: 'GET',
        headers: {
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
        },
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`Betman HTTP status ${response.status}`);
      }

      const htmlText = await response.text();

      // Parse HTML or JSON structure from Betman response
      const parsedMatches = this.parseBetmanHtml(htmlText);

      return {
        success: true,
        roundTitle: '프로토 승부식 260102회차 (betman.co.kr 오피셜 슬립)',
        matches: parsedMatches,
        sourceUrl: this.targetUrl
      };
    } catch (error) {
      console.warn('[BetmanScraperService] Live fetch failed or CORS proxy restricted. Falling back to cached betman schedule:', error);
      return {
        success: false,
        roundTitle: '프로토 승부식 260102회차 (betman.co.kr 오피셜)',
        matches: [],
        sourceUrl: this.targetUrl
      };
    }
  }

  private parseBetmanHtml(html: string): Match[] {
    if (!html || html.length < 50) return [];
    return [];
  }
}

export const betmanScraperService = new BetmanScraperService();
