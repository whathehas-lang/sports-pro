import type { Match, StarterPitcherInfo } from '../../types/sports';
import { KboOfficialLiveCollector } from '../crawler/kboOfficialLiveCollector';
import { MlbOfficialStatsService } from '../api/mlbOfficialStatsService';
import { NpbOfficialStarterService } from '../api/npbOfficialStarterService';
import { FootballH2HRecentFormEngine } from './footballH2HRecentFormEngine';
import { BaseballLiveStarterHub } from '../api/baseballLiveStarterHub';

/**
 * ⚾ MultiSourceBaseballOrchestrator
 * KBO, MLB, NPB 3대 야구 리그의 실시간 선발투수 및 경기 데이터를
 * 공식 API 및 공식 사이트 경유로만 100% 팩트 기반 수집하는 엔진
 * (임의 추측 또는 5선발 가짜 데이터 원천 차단)
 */
export class MultiSourceBaseballOrchestrator {
  public static async enrichMatchesWithMultiSource(matches: Match[]): Promise<Match[]> {
    // 실시간 최신 선발투수 팩트 동기화 (로컬 백엔드 / Firebase / 공식)
    await BaseballLiveStarterHub.syncOfficialStarters().catch(() => {});

    return Promise.all(
      matches.map(async (m) => {
        if (m.sport !== 'baseball') return m;

        let homeStarter: StarterPitcherInfo | null = null;
        let awayStarter: StarterPitcherInfo | null = null;

        // 현재 시스템 날짜 기준 YYYY-MM-DD 및 MM.DD 계산
        const now = new Date();
        const pad = (n: number) => String(n).padStart(2, '0');
        const todayDateStr = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
        const todayMmDd = `${pad(now.getMonth() + 1)}.${pad(now.getDate())}`;
        
        const tmrw = new Date(now.getTime() + 24 * 60 * 60 * 1000);
        const tmrwDateStr = `${tmrw.getFullYear()}-${pad(tmrw.getMonth() + 1)}-${pad(tmrw.getDate())}`;
        const tmrwMmDd = `${pad(tmrw.getMonth() + 1)}.${pad(tmrw.getDate())}`;

        const matchTime = m.matchTime || '';
        const isToday = matchTime.includes(todayMmDd) || matchTime.includes(todayDateStr) || (!matchTime.includes('.') && !matchTime.includes('-'));
        const isTomorrow = matchTime.includes(tmrwMmDd) || matchTime.includes(tmrwDateStr);

        // 1. KBO 경기인 경우 -> BaseballLiveStarterHub 공식 실시간 수집 연동
        const isKbo = m.league.includes('KBO') || m.countryFlag === '🇰🇷' || 
          ['LG', '두산', '한화', 'KIA', '삼성', '롯데', '키움', 'KT', 'SSG', 'NC'].some(t => m.homeTeam.name.includes(t) || m.awayTeam.name.includes(t));

        if (isKbo) {
          if (isToday) {
            homeStarter = BaseballLiveStarterHub.getStarterPitcher(m.homeTeam.name, m.matchTime);
            awayStarter = BaseballLiveStarterHub.getStarterPitcher(m.awayTeam.name, m.matchTime);
            if (!homeStarter || !awayStarter) {
              const kboStarters = await KboOfficialLiveCollector.getOfficialStarterForMatch(m);
              homeStarter = homeStarter || kboStarters.homeStarter;
              awayStarter = awayStarter || kboStarters.awayStarter;
            }
          }
          // 내일/미래 KBO는 공식 발표 전이므로 null 유지 (선발 미정)
        } else if (m.league.includes('MLB') || m.countryFlag === '🇺🇸') {
          // 2. MLB 경기인 경우 -> MLB 연맹 공식 Stats API 실시간 조회
          if (isToday) {
            homeStarter = await MlbOfficialStatsService.fetchOfficialProbablePitcher(m.homeTeam.name, todayDateStr);
            awayStarter = await MlbOfficialStatsService.fetchOfficialProbablePitcher(m.awayTeam.name, todayDateStr);
          } else if (isTomorrow) {
            homeStarter = await MlbOfficialStatsService.fetchOfficialProbablePitcher(m.homeTeam.name, tmrwDateStr);
            awayStarter = await MlbOfficialStatsService.fetchOfficialProbablePitcher(m.awayTeam.name, tmrwDateStr);
          }
        } else if (m.league.includes('NPB') || m.countryFlag === '🇯🇵' || 
          ['야쿠르트', '주니치', '히로시마', '요미우리', '라쿠텐', '니혼햄', '오릭스', '지바롯데', '소프트뱅크', '세이부'].some(t => m.homeTeam.name.includes(t) || m.awayTeam.name.includes(t))) {
          // 3. NPB 경기인 경우 -> BaseballLiveStarterHub 및 공식 예고선발 수집
          if (isToday) {
            homeStarter = BaseballLiveStarterHub.getStarterPitcher(m.homeTeam.name, m.matchTime);
            awayStarter = BaseballLiveStarterHub.getStarterPitcher(m.awayTeam.name, m.matchTime);
            if (!homeStarter || !awayStarter) {
              homeStarter = homeStarter || await NpbOfficialStarterService.fetchOfficialStarterByDate(m.homeTeam.name, 'TODAY');
              awayStarter = awayStarter || await NpbOfficialStarterService.fetchOfficialStarterByDate(m.awayTeam.name, 'TODAY');
            }
          }
        }

        // 4. 공식 공시가 없을 경우 사전 스케줄의 값 또는 null (미정) 설정
        const finalHomeStarter = homeStarter || null;
        const finalAwayStarter = awayStarter || null;

        const baseEnriched: Match = {
          ...m,
          homeTeam: {
            ...m.homeTeam,
            name: m.homeTeam.name,
            starterPitcherInfo: finalHomeStarter
          },
          awayTeam: {
            ...m.awayTeam,
            name: m.awayTeam.name,
            starterPitcherInfo: finalAwayStarter
          },
          isPitcherAnnounced: Boolean(finalHomeStarter && finalAwayStarter),
          isDataCheckingPending: false
        };

        // ⚔️ 2단계: H2H 및 최근 경기 로그 결합
        return FootballH2HRecentFormEngine.enrichH2HAndRecentLogs(baseEnriched);
      })
    );
  }
}
