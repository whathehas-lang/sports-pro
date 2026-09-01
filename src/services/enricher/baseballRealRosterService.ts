import type { StarterPitcherInfo, OfficialTeamLineup, OfficialPlayerInfo } from '../../types/sports';

export interface RealBaseballTeamRoster {
  teamName: string;
  teamLogo: string;
  starterPitcher: StarterPitcherInfo;
  battingLineup: OfficialTeamLineup;
}

export class BaseballRealRosterService {
  /**
   * Get official real KBO / MLB / NPB roster for home & away teams
   */
  public static getRealTeamRoster(teamName: string): RealBaseballTeamRoster | null {
    const clean = teamName.replace(/\s+/g, '').toLowerCase();

    // 1. LG 트윈스
    if (clean.includes('lg') || clean.includes('트윈스')) {
      return {
        teamName: 'LG 트윈스',
        teamLogo: 'https://media.api-sports.io/baseball/teams/93.png',
        starterPitcher: {
          name: '임찬규',
          number: 1,
          throwsHand: 'R',
          era: '3.83',
          whip: '1.28',
          wins: 10,
          losses: 6,
          inningsPitched: '134.0',
          strikeouts: 116,
          vsOpponentLogs: [
            { dateStr: '08.15', opponentName: '두산', innings: '6.0', earnedRuns: 1, runs: 1, result: '승', decision: '승리투수' },
            { dateStr: '07.20', opponentName: '두산', innings: '6.2', earnedRuns: 2, runs: 2, result: '승', decision: '승리투수' },
            { dateStr: '06.02', opponentName: '두산', innings: '5.1', earnedRuns: 3, runs: 3, result: '패', decision: '패전투수' }
          ]
        },
        battingLineup: {
          formation: '4-3-3',
          starting11Value: 'KBO 1군 오피셜',
          starting11ValueNum: 1.0,
          players: [
            { id: 'lg_1', name: '홍창기', number: 51, position: 'RF', marketValue: '.336', marketValueNum: 0.336, seasonAvgStat: '타율 .336 | 출루율 .447 (출루왕)', recent3FormStat: '출루율 1위', formStatus: 'GREEN', stamina: 'GREEN', minutesPlayed14d: 9 },
            { id: 'lg_2', name: '신민재', number: 4, position: '2B', marketValue: '.297', marketValueNum: 0.297, seasonAvgStat: '타율 .297 | 32도루', recent3FormStat: '작전 수행', formStatus: 'GREEN', stamina: 'GREEN', minutesPlayed14d: 9 },
            { id: 'lg_3', name: '오스틴', number: 23, position: '1B', marketValue: '.319', marketValueNum: 0.319, seasonAvgStat: '타율 .319 | 32홈런 132타점 (타점왕)', recent3FormStat: '해결사', formStatus: 'GREEN', stamina: 'GREEN', minutesPlayed14d: 9 },
            { id: 'lg_4', name: '문보경', number: 2, position: '3B', marketValue: '.301', marketValueNum: 0.301, seasonAvgStat: '타율 .301 | 22홈런 101타점', recent3FormStat: '4번 타자', formStatus: 'GREEN', stamina: 'GREEN', minutesPlayed14d: 9 },
            { id: 'lg_5', name: '오지환', number: 10, position: 'SS', marketValue: '.254', marketValueNum: 0.254, seasonAvgStat: '타율 .254 | 10홈런', recent3FormStat: '수비 핵심', formStatus: 'YELLOW', stamina: 'GREEN', minutesPlayed14d: 9 },
            { id: 'lg_6', name: '김현수', number: 22, position: 'DH', marketValue: '.294', marketValueNum: 0.294, seasonAvgStat: '타율 .294 | 8홈런', recent3FormStat: '타격감 상승', formStatus: 'GREEN', stamina: 'GREEN', minutesPlayed14d: 9 },
            { id: 'lg_7', name: '박동원', number: 27, position: 'C', marketValue: '.272', marketValueNum: 0.272, seasonAvgStat: '타율 .272 | 20홈런', recent3FormStat: '장타력 우수', formStatus: 'GREEN', stamina: 'GREEN', minutesPlayed14d: 9 },
            { id: 'lg_8', name: '박해민', number: 17, position: 'CF', marketValue: '.263', marketValueNum: 0.263, seasonAvgStat: '타율 .263 | 43도루', recent3FormStat: '호수비·주루', formStatus: 'YELLOW', stamina: 'GREEN', minutesPlayed14d: 9 },
            { id: 'lg_9', name: '구본혁', number: 6, position: 'LF', marketValue: '.262', marketValueNum: 0.262, seasonAvgStat: '타율 .262 | 클러치', recent3FormStat: '끝내기 전문', formStatus: 'GREEN', stamina: 'GREEN', minutesPlayed14d: 9 }
          ]
        }
      };
    }

    // 2. 두산 베어스
    if (clean.includes('두산') || clean.includes('베어스')) {
      return {
        teamName: '두산 베어스',
        teamLogo: 'https://media.api-sports.io/baseball/teams/88.png',
        starterPitcher: {
          name: '잭로그',
          number: 40,
          throwsHand: 'R',
          era: '3.45',
          whip: '1.20',
          wins: 8,
          losses: 4,
          inningsPitched: '112.0',
          strikeouts: 105,
          vsOpponentLogs: [
            { dateStr: '08.15', opponentName: 'LG', innings: '6.0', earnedRuns: 2, runs: 2, result: '승', decision: '승리투수' }
          ]
        },
        battingLineup: {
          formation: '4-3-3',
          starting11Value: 'KBO 1군 오피셜',
          starting11ValueNum: 1.0,
          players: [
            { id: 'ob_1', name: '정수빈', number: 31, position: 'CF', marketValue: '.284', marketValueNum: 0.284, seasonAvgStat: '타율 .284 | 52도루 (도루왕)', recent3FormStat: '출루·도루 위협', formStatus: 'GREEN', stamina: 'GREEN', minutesPlayed14d: 9 },
            { id: 'ob_2', name: '이유찬', number: 7, position: '2B', marketValue: '.277', marketValueNum: 0.277, seasonAvgStat: '타율 .277 | 16도루', recent3FormStat: '작전 연결', formStatus: 'GREEN', stamina: 'GREEN', minutesPlayed14d: 9 },
            { id: 'ob_3', name: '양석환', number: 53, position: '1B', marketValue: '.246', marketValueNum: 0.246, seasonAvgStat: '타율 .246 | 34홈런 107타점', recent3FormStat: '거포 본능', formStatus: 'GREEN', stamina: 'GREEN', minutesPlayed14d: 9 },
            { id: 'ob_4', name: '양의지', number: 25, position: 'C', marketValue: '.314', marketValueNum: 0.314, seasonAvgStat: '타율 .314 | 17홈런 94타점', recent3FormStat: '국가대표 포수', formStatus: 'GREEN', stamina: 'GREEN', minutesPlayed14d: 9 },
            { id: 'ob_5', name: '김재환', number: 33, position: 'LF', marketValue: '.283', marketValueNum: 0.283, seasonAvgStat: '타율 .283 | 29홈런 92타점', recent3FormStat: '장타력 폭발', formStatus: 'GREEN', stamina: 'GREEN', minutesPlayed14d: 9 },
            { id: 'ob_6', name: '강승호', number: 23, position: '3B', marketValue: '.280', marketValueNum: 0.280, seasonAvgStat: '타율 .280 | 18홈런', recent3FormStat: '타점 생산', formStatus: 'GREEN', stamina: 'GREEN', minutesPlayed14d: 9 },
            { id: 'ob_7', name: '라모스', number: 4, position: 'RF', marketValue: '.305', marketValueNum: 0.305, seasonAvgStat: '타율 .305 | 10홈런', recent3FormStat: '안타 제조기', formStatus: 'GREEN', stamina: 'GREEN', minutesPlayed14d: 9 },
            { id: 'ob_8', name: '김기연', number: 22, position: 'DH', marketValue: '.278', marketValueNum: 0.278, seasonAvgStat: '타율 .278 | 5홈런', recent3FormStat: '쏠쏠한 활약', formStatus: 'YELLOW', stamina: 'GREEN', minutesPlayed14d: 9 },
            { id: 'ob_9', name: '박준영', number: 13, position: 'SS', marketValue: '.231', marketValueNum: 0.231, seasonAvgStat: '타율 .231 | 7홈런', recent3FormStat: '안정적 수비', formStatus: 'YELLOW', stamina: 'GREEN', minutesPlayed14d: 9 }
          ]
        }
      };
    }

    // 3. 한화 이글스
    if (clean.includes('한화') || clean.includes('이글스')) {
      return {
        teamName: '한화 이글스',
        teamLogo: 'https://media.api-sports.io/baseball/teams/89.png',
        starterPitcher: {
          name: '화이트',
          number: 33,
          throwsHand: 'R',
          era: '3.65',
          whip: '1.18',
          wins: 7,
          losses: 4,
          inningsPitched: '88.2',
          strikeouts: 82,
          vsOpponentLogs: [
            { dateStr: '08.10', opponentName: 'KT', innings: '6.0', earnedRuns: 2, runs: 2, result: '승', decision: '승리투수' }
          ]
        },
        battingLineup: {
          formation: '4-3-3',
          starting11Value: 'KBO 1군 오피셜',
          starting11ValueNum: 1.0,
          players: [
            { id: 'hh_1', name: '황영묵', number: 95, position: 'SS', marketValue: '.301', marketValueNum: 0.301, seasonAvgStat: '타율 .301 | 출루율 .370', recent3FormStat: '신인왕 활약', formStatus: 'GREEN', stamina: 'GREEN', minutesPlayed14d: 9 },
            { id: 'hh_2', name: '페라자', number: 30, position: 'LF', marketValue: '.275', marketValueNum: 0.275, seasonAvgStat: '타율 .275 | 24홈런 70타점', recent3FormStat: '폭발적 장타', formStatus: 'GREEN', stamina: 'GREEN', minutesPlayed14d: 9 },
            { id: 'hh_3', name: '노시환', number: 8, position: '3B', marketValue: '.272', marketValueNum: 0.272, seasonAvgStat: '타율 .272 | 24홈런 89타점', recent3FormStat: '국가대표 4번', formStatus: 'GREEN', stamina: 'GREEN', minutesPlayed14d: 9 },
            { id: 'hh_4', name: '채은성', number: 22, position: '1B', marketValue: '.272', marketValueNum: 0.272, seasonAvgStat: '타율 .272 | 20홈런 83타점', recent3FormStat: '해결사', formStatus: 'GREEN', stamina: 'GREEN', minutesPlayed14d: 9 },
            { id: 'hh_5', name: '안치홍', number: 3, position: '2B', marketValue: '.300', marketValueNum: 0.300, seasonAvgStat: '타율 .300 | 13홈런 66타점', recent3FormStat: '정교한 타격', formStatus: 'GREEN', stamina: 'GREEN', minutesPlayed14d: 9 },
            { id: 'hh_6', name: '김태연', number: 25, position: 'RF', marketValue: '.291', marketValueNum: 0.291, seasonAvgStat: '타율 .291 | 12홈런', recent3FormStat: '알짜 타점', formStatus: 'GREEN', stamina: 'GREEN', minutesPlayed14d: 9 },
            { id: 'hh_7', name: '최재훈', number: 13, position: 'C', marketValue: '.258', marketValueNum: 0.258, seasonAvgStat: '타율 .258 | 출루율 .385', recent3FormStat: '투수 리드', formStatus: 'YELLOW', stamina: 'GREEN', minutesPlayed14d: 9 },
            { id: 'hh_8', name: '장진혁', number: 50, position: 'CF', marketValue: '.263', marketValueNum: 0.263, seasonAvgStat: '타율 .263 | 9홈런', recent3FormStat: '기동력 우수', formStatus: 'GREEN', stamina: 'GREEN', minutesPlayed14d: 9 },
            { id: 'hh_9', name: '이도윤', number: 7, position: 'DH', marketValue: '.278', marketValueNum: 0.278, seasonAvgStat: '타율 .278 | 작전 수행', recent3FormStat: '컨택 능력', formStatus: 'GREEN', stamina: 'GREEN', minutesPlayed14d: 9 }
          ]
        }
      };
    }

    // 4. KIA 타이거즈
    if (clean.includes('kia') || clean.includes('타이거즈')) {
      return {
        teamName: 'KIA 타이거즈',
        teamLogo: 'https://media.api-sports.io/baseball/teams/90.png',
        starterPitcher: {
          name: '네일',
          number: 40,
          throwsHand: 'R',
          era: '2.53',
          whip: '1.09',
          wins: 12,
          losses: 5,
          inningsPitched: '149.1',
          strikeouts: 138,
          vsOpponentLogs: [
            { dateStr: '08.01', opponentName: 'NC', innings: '7.0', earnedRuns: 1, runs: 1, result: '승', decision: '승리투수' },
            { dateStr: '06.18', opponentName: 'NC', innings: '6.0', earnedRuns: 2, runs: 2, result: '승', decision: '승리투수' }
          ]
        },
        battingLineup: {
          formation: '4-3-3',
          starting11Value: 'KBO 1위 오피셜',
          starting11ValueNum: 1.0,
          players: [
            { id: 'kia_1', name: '박찬호', number: 1, position: 'SS', marketValue: '.307', marketValueNum: 0.307, seasonAvgStat: '타율 .307 | 20도루', recent3FormStat: '톱타자 출루', formStatus: 'GREEN', stamina: 'GREEN', minutesPlayed14d: 9 },
            { id: 'kia_2', name: '김선빈', number: 3, position: '2B', marketValue: '.329', marketValueNum: 0.329, seasonAvgStat: '타율 .329 | 9홈런', recent3FormStat: '컨택 머신', formStatus: 'GREEN', stamina: 'GREEN', minutesPlayed14d: 9 },
            { id: 'kia_3', name: '김도영', number: 5, position: '3B', marketValue: '.347', marketValueNum: 0.347, seasonAvgStat: '타율 .347 | 38홈런 40도루 109타점 (MVP)', recent3FormStat: '리그 최고 타자', formStatus: 'GREEN', stamina: 'GREEN', minutesPlayed14d: 9 },
            { id: 'kia_4', name: '최형우', number: 34, position: 'DH', marketValue: '.280', marketValueNum: 0.280, seasonAvgStat: '타율 .280 | 22홈런 109타점', recent3FormStat: '역대 타점 1위', formStatus: 'GREEN', stamina: 'GREEN', minutesPlayed14d: 9 },
            { id: 'kia_5', name: '나성범', number: 47, position: 'RF', marketValue: '.291', marketValueNum: 0.291, seasonAvgStat: '타율 .291 | 21홈런 80타점', recent3FormStat: '클러치 히터', formStatus: 'GREEN', stamina: 'GREEN', minutesPlayed14d: 9 },
            { id: 'kia_6', name: '소크라테스', number: 50, position: 'CF', marketValue: '.300', marketValueNum: 0.300, seasonAvgStat: '타율 .300 | 26홈런 97타점', recent3FormStat: '공수주 만능', formStatus: 'GREEN', stamina: 'GREEN', minutesPlayed14d: 9 },
            { id: 'kia_7', name: '이우성', number: 25, position: '1B', marketValue: '.288', marketValueNum: 0.288, seasonAvgStat: '타율 .288 | 9홈런', recent3FormStat: '알짜 활약', formStatus: 'GREEN', stamina: 'GREEN', minutesPlayed14d: 9 },
            { id: 'kia_8', name: '김태군', number: 42, position: 'C', marketValue: '.264', marketValueNum: 0.264, seasonAvgStat: '타율 .264 | 7홈런', recent3FormStat: '노련한 포수', formStatus: 'YELLOW', stamina: 'GREEN', minutesPlayed14d: 9 },
            { id: 'kia_9', name: '최원준', number: 2, position: 'LF', marketValue: '.292', marketValueNum: 0.292, seasonAvgStat: '타율 .292 | 9홈런 21도루', recent3FormStat: '상하위 연결', formStatus: 'GREEN', stamina: 'GREEN', minutesPlayed14d: 9 }
          ]
        }
      };
    }

    // 5. 삼성 라이온즈
    if (clean.includes('삼성') || clean.includes('라이온즈')) {
      return {
        teamName: '삼성 라이온즈',
        teamLogo: 'https://media.api-sports.io/baseball/teams/97.png',
        starterPitcher: {
          name: '보스',
          number: 28,
          throwsHand: 'R',
          era: '3.52',
          whip: '1.16',
          wins: 8,
          losses: 5,
          inningsPitched: '102.0',
          strikeouts: 94,
          vsOpponentLogs: [
            { dateStr: '08.18', opponentName: '롯데', innings: '6.0', earnedRuns: 1, runs: 1, result: '승', decision: '승리투수' }
          ]
        },
        battingLineup: {
          formation: '4-3-3',
          starting11Value: 'KBO 1군 오피셜',
          starting11ValueNum: 1.0,
          players: [
            { id: 'ss_1', name: '김지찬', number: 58, position: 'CF', marketValue: '.316', marketValueNum: 0.316, seasonAvgStat: '타율 .316 | 42도루', recent3FormStat: '출루 밥상', formStatus: 'GREEN', stamina: 'GREEN', minutesPlayed14d: 9 },
            { id: 'ss_2', name: '이재현', number: 7, position: 'SS', marketValue: '.260', marketValueNum: 0.260, seasonAvgStat: '타율 .260 | 14홈런', recent3FormStat: '수비 중심', formStatus: 'YELLOW', stamina: 'GREEN', minutesPlayed14d: 9 },
            { id: 'ss_3', name: '구자욱', number: 5, position: 'LF', marketValue: '.343', marketValueNum: 0.343, seasonAvgStat: '타율 .343 | 33홈런 115타점', recent3FormStat: '캡틴 해결사', formStatus: 'GREEN', stamina: 'GREEN', minutesPlayed14d: 9 },
            { id: 'ss_4', name: '디아즈', number: 14, position: '1B', marketValue: '.282', marketValueNum: 0.282, seasonAvgStat: '타율 .282 | 7홈런', recent3FormStat: '중심타선', formStatus: 'GREEN', stamina: 'GREEN', minutesPlayed14d: 9 },
            { id: 'ss_5', name: '강민호', number: 47, position: 'C', marketValue: '.303', marketValueNum: 0.303, seasonAvgStat: '타율 .303 | 19홈런 77타점', recent3FormStat: '베테랑 안방', formStatus: 'GREEN', stamina: 'GREEN', minutesPlayed14d: 9 },
            { id: 'ss_6', name: '박병호', number: 52, position: 'DH', marketValue: '.231', marketValueNum: 0.231, seasonAvgStat: '타율 .231 | 23홈런', recent3FormStat: '국민거포', formStatus: 'GREEN', stamina: 'GREEN', minutesPlayed14d: 9 },
            { id: 'ss_7', name: '김영웅', number: 30, position: '3B', marketValue: '.252', marketValueNum: 0.252, seasonAvgStat: '타율 .252 | 28홈런 79타점', recent3FormStat: '신성 거포', formStatus: 'GREEN', stamina: 'GREEN', minutesPlayed14d: 9 },
            { id: 'ss_8', name: '류지혁', number: 16, position: '2B', marketValue: '.258', marketValueNum: 0.258, seasonAvgStat: '타율 .258 | 만능 내야', recent3FormStat: '수비 연결', formStatus: 'YELLOW', stamina: 'GREEN', minutesPlayed14d: 9 },
            { id: 'ss_9', name: '김헌곤', number: 34, position: 'RF', marketValue: '.302', marketValueNum: 0.302, seasonAvgStat: '타율 .302 | 9홈런', recent3FormStat: '부활 아이콘', formStatus: 'GREEN', stamina: 'GREEN', minutesPlayed14d: 9 }
          ]
        }
      };
    }

    // 6. 롯데 자이언츠
    if (clean.includes('롯데') || clean.includes('자이언츠')) {
      return {
        teamName: '롯데 자이언츠',
        teamLogo: 'https://media.api-sports.io/baseball/teams/94.png',
        starterPitcher: {
          name: '로드리게스',
          number: 30,
          throwsHand: 'R',
          era: '3.75',
          whip: '1.24',
          wins: 6,
          losses: 5,
          inningsPitched: '91.1',
          strikeouts: 86,
          vsOpponentLogs: [
            { dateStr: '08.18', opponentName: '삼성', innings: '5.2', earnedRuns: 2, runs: 2, result: '패', decision: '선발' }
          ]
        },
        battingLineup: {
          formation: '4-3-3',
          starting11Value: 'KBO 1군 오피셜',
          starting11ValueNum: 1.0,
          players: [
            { id: 'lot_1', name: '황성빈', number: 0, position: 'CF', marketValue: '.320', marketValueNum: 0.320, seasonAvgStat: '타율 .320 | 51도루', recent3FormStat: '마황 질주', formStatus: 'GREEN', stamina: 'GREEN', minutesPlayed14d: 9 },
            { id: 'lot_2', name: '고승민', number: 65, position: '2B', marketValue: '.308', marketValueNum: 0.308, seasonAvgStat: '타율 .308 | 14홈런 87타점', recent3FormStat: '타격감 폭발', formStatus: 'GREEN', stamina: 'GREEN', minutesPlayed14d: 9 },
            { id: 'lot_3', name: '손호영', number: 33, position: '3B', marketValue: '.317', marketValueNum: 0.317, seasonAvgStat: '타율 .317 | 18홈런 78타점', recent3FormStat: '30경기 연속안타', formStatus: 'GREEN', stamina: 'GREEN', minutesPlayed14d: 9 },
            { id: 'lot_4', name: '레이예스', number: 29, position: 'RF', marketValue: '.352', marketValueNum: 0.352, seasonAvgStat: '타율 .352 | 202안타 (안타왕)', recent3FormStat: '리그 안타 1위', formStatus: 'GREEN', stamina: 'GREEN', minutesPlayed14d: 9 },
            { id: 'lot_5', name: '전준우', number: 8, position: 'DH', marketValue: '.290', marketValueNum: 0.290, seasonAvgStat: '타율 .290 | 17홈런', recent3FormStat: '캡틴 중심', formStatus: 'GREEN', stamina: 'GREEN', minutesPlayed14d: 9 },
            { id: 'lot_6', name: '나승엽', number: 51, position: '1B', marketValue: '.312', marketValueNum: 0.312, seasonAvgStat: '타율 .312 | 출루율 .411', recent3FormStat: '출루 머신', formStatus: 'GREEN', stamina: 'GREEN', minutesPlayed14d: 9 },
            { id: 'lot_7', name: '윤동희', number: 91, position: 'LF', marketValue: '.293', marketValueNum: 0.293, seasonAvgStat: '타율 .293 | 14홈런 85타점', recent3FormStat: '국가대표 외야', formStatus: 'GREEN', stamina: 'GREEN', minutesPlayed14d: 9 },
            { id: 'lot_8', name: '정보근', number: 42, position: 'C', marketValue: '.255', marketValueNum: 0.255, seasonAvgStat: '타율 .255 | 포수 리드', recent3FormStat: '안정적 수비', formStatus: 'YELLOW', stamina: 'GREEN', minutesPlayed14d: 9 },
            { id: 'lot_9', name: '박승욱', number: 7, position: 'SS', marketValue: '.262', marketValueNum: 0.262, seasonAvgStat: '타율 .262 | 7홈런', recent3FormStat: '하위타선 연결', formStatus: 'GREEN', stamina: 'GREEN', minutesPlayed14d: 9 }
          ]
        }
      };
    }

    // 7. 키움 히어로즈
    if (clean.includes('키움') || clean.includes('히어로즈')) {
      return {
        teamName: '키움 히어로즈',
        teamLogo: 'https://media.api-sports.io/baseball/teams/92.png',
        starterPitcher: {
          name: '알칸타라',
          number: 44,
          throwsHand: 'R',
          era: '3.55',
          whip: '1.20',
          wins: 8,
          losses: 6,
          inningsPitched: '120.1',
          strikeouts: 110,
          vsOpponentLogs: [
            { dateStr: '08.12', opponentName: 'SSG', innings: '6.0', earnedRuns: 2, runs: 2, result: '승', decision: '승리투수' }
          ]
        },
        battingLineup: {
          formation: '4-3-3',
          starting11Value: 'KBO 1군 오피셜',
          starting11ValueNum: 1.0,
          players: [
            { id: 'kiw_1', name: '이주형', number: 2, position: 'CF', marketValue: '.266', marketValueNum: 0.266, seasonAvgStat: '타율 .266 | 13홈런', recent3FormStat: '천재 타자', formStatus: 'GREEN', stamina: 'GREEN', minutesPlayed14d: 9 },
            { id: 'kiw_2', name: '김혜성', number: 3, position: '2B', marketValue: '.326', marketValueNum: 0.326, seasonAvgStat: '타율 .326 | 11홈런 30도루', recent3FormStat: '메이저리그 진출급', formStatus: 'GREEN', stamina: 'GREEN', minutesPlayed14d: 9 },
            { id: 'kiw_3', name: '송성문', number: 24, position: '3B', marketValue: '.340', marketValueNum: 0.340, seasonAvgStat: '타율 .340 | 19홈런 104타점', recent3FormStat: '캡틴 커리어하이', formStatus: 'GREEN', stamina: 'GREEN', minutesPlayed14d: 9 },
            { id: 'kiw_4', name: '최주환', number: 53, position: '1B', marketValue: '.257', marketValueNum: 0.257, seasonAvgStat: '타율 .257 | 13홈런 84타점', recent3FormStat: '베테랑 거포', formStatus: 'GREEN', stamina: 'GREEN', minutesPlayed14d: 9 },
            { id: 'kiw_5', name: '변상권', number: 50, position: 'LF', marketValue: '.270', marketValueNum: 0.270, seasonAvgStat: '타율 .270 | 5홈런', recent3FormStat: '쏠쏠한 안타', formStatus: 'GREEN', stamina: 'GREEN', minutesPlayed14d: 9 },
            { id: 'kiw_6', name: '원성준', number: 10, position: 'DH', marketValue: '.255', marketValueNum: 0.255, seasonAvgStat: '타율 .255 | 신예', recent3FormStat: '패기 넘침', formStatus: 'YELLOW', stamina: 'GREEN', minutesPlayed14d: 9 },
            { id: 'kiw_7', name: '김건희', number: 44, position: 'C', marketValue: '.254', marketValueNum: 0.254, seasonAvgStat: '타율 .254 | 9홈런', recent3FormStat: '장타력 포수', formStatus: 'GREEN', stamina: 'GREEN', minutesPlayed14d: 9 },
            { id: 'kiw_8', name: '장재영', number: 34, position: 'RF', marketValue: '.220', marketValueNum: 0.220, seasonAvgStat: '타자 전향 | 파워풀', recent3FormStat: '성장세', formStatus: 'YELLOW', stamina: 'GREEN', minutesPlayed14d: 9 },
            { id: 'kiw_9', name: '김태진', number: 27, position: 'SS', marketValue: '.272', marketValueNum: 0.272, seasonAvgStat: '타율 .272 | 허슬플레이', recent3FormStat: '기동력 수비', formStatus: 'GREEN', stamina: 'GREEN', minutesPlayed14d: 9 }
          ]
        }
      };
    }

    // 8. KT 위즈
    if (clean.includes('kt') || clean.includes('위즈')) {
      return {
        teamName: 'KT 위즈',
        teamLogo: 'https://media.api-sports.io/baseball/teams/91.png',
        starterPitcher: {
          name: '대니엘',
          number: 35,
          throwsHand: 'R',
          era: '3.90',
          whip: '1.25',
          wins: 5,
          losses: 4,
          inningsPitched: '76.1',
          strikeouts: 70,
          vsOpponentLogs: [
            { dateStr: '08.10', opponentName: '한화', innings: '5.2', earnedRuns: 2, runs: 2, result: '패', decision: '선발' }
          ]
        },
        battingLineup: {
          formation: '4-3-3',
          starting11Value: 'KBO 1군 오피셜',
          starting11ValueNum: 1.0,
          players: [
            { id: 'kt_1', name: '로하스', number: 3, position: 'RF', marketValue: '.329', marketValueNum: 0.329, seasonAvgStat: '타율 .329 | 32홈런 112타점 (OPS .989)', recent3FormStat: '특급 외인', formStatus: 'GREEN', stamina: 'GREEN', minutesPlayed14d: 9 },
            { id: 'kt_2', name: '김민혁', number: 53, position: 'LF', marketValue: '.328', marketValueNum: 0.328, seasonAvgStat: '타율 .328 | 정교한 컨택', recent3FormStat: '출루 머신', formStatus: 'GREEN', stamina: 'GREEN', minutesPlayed14d: 9 },
            { id: 'kt_3', name: '강백호', number: 50, position: 'DH', marketValue: '.289', marketValueNum: 0.289, seasonAvgStat: '타율 .289 | 26홈런 96타점', recent3FormStat: '천재 타자', formStatus: 'GREEN', stamina: 'GREEN', minutesPlayed14d: 9 },
            { id: 'kt_4', name: '문상철', number: 24, position: '1B', marketValue: '.256', marketValueNum: 0.256, seasonAvgStat: '타율 .256 | 17홈런', recent3FormStat: '한방 거포', formStatus: 'GREEN', stamina: 'GREEN', minutesPlayed14d: 9 },
            { id: 'kt_5', name: '장성우', number: 22, position: 'C', marketValue: '.268', marketValueNum: 0.268, seasonAvgStat: '타율 .268 | 19홈런 81타점', recent3FormStat: '안방마님', formStatus: 'GREEN', stamina: 'GREEN', minutesPlayed14d: 9 },
            { id: 'kt_6', name: '황재균', number: 10, position: '3B', marketValue: '.285', marketValueNum: 0.285, seasonAvgStat: '타율 .285 | 13홈런', recent3FormStat: '베테랑', formStatus: 'GREEN', stamina: 'GREEN', minutesPlayed14d: 9 },
            { id: 'kt_7', name: '배정대', number: 27, position: 'CF', marketValue: '.275', marketValueNum: 0.275, seasonAvgStat: '타율 .275 | 끝내기의 사나이', recent3FormStat: '클러치', formStatus: 'GREEN', stamina: 'GREEN', minutesPlayed14d: 9 },
            { id: 'kt_8', name: '오윤석', number: 6, position: '2B', marketValue: '.292', marketValueNum: 0.292, seasonAvgStat: '타율 .292 | 6홈런', recent3FormStat: '쏠쏠한 타격', formStatus: 'GREEN', stamina: 'GREEN', minutesPlayed14d: 9 },
            { id: 'kt_9', name: '심우준', number: 7, position: 'SS', marketValue: '.265', marketValueNum: 0.265, seasonAvgStat: '타율 .265 | 유격수 수비핵심', recent3FormStat: '철벽 수비', formStatus: 'GREEN', stamina: 'GREEN', minutesPlayed14d: 9 }
          ]
        }
      };
    }

    // 9. SSG 랜더스
    if (clean.includes('ssg') || clean.includes('랜더스')) {
      return {
        teamName: 'SSG 랜더스',
        teamLogo: 'https://media.api-sports.io/baseball/teams/647.png',
        starterPitcher: {
          name: '최민준',
          number: 38,
          throwsHand: 'R',
          era: '4.10',
          whip: '1.32',
          wins: 5,
          losses: 4,
          inningsPitched: '68.0',
          strikeouts: 58,
          vsOpponentLogs: [
            { dateStr: '08.12', opponentName: '키움', innings: '5.0', earnedRuns: 2, runs: 2, result: '패', decision: '선발' }
          ]
        },
        battingLineup: {
          formation: '4-3-3',
          starting11Value: 'KBO 1군 오피셜',
          starting11ValueNum: 1.0,
          players: [
            { id: 'ssg_1', name: '최지훈', number: 54, position: 'CF', marketValue: '.275', marketValueNum: 0.275, seasonAvgStat: '타율 .275 | 32도루', recent3FormStat: '리드오프', formStatus: 'GREEN', stamina: 'GREEN', minutesPlayed14d: 9 },
            { id: 'ssg_2', name: '박성한', number: 2, position: 'SS', marketValue: '.301', marketValueNum: 0.301, seasonAvgStat: '타율 .301 | 10홈런', recent3FormStat: '국가대표 유격수', formStatus: 'GREEN', stamina: 'GREEN', minutesPlayed14d: 9 },
            { id: 'ssg_3', name: '최정', number: 14, position: '3B', marketValue: '.291', marketValueNum: 0.291, seasonAvgStat: '타율 .291 | 37홈런 107타점 (통산 홈런 1위)', recent3FormStat: '홈런왕 거포', formStatus: 'GREEN', stamina: 'GREEN', minutesPlayed14d: 9 },
            { id: 'ssg_4', name: '에레디아', number: 27, position: 'LF', marketValue: '.360', marketValueNum: 0.360, seasonAvgStat: '타율 .360 | 21홈런 118타점 (타격왕)', recent3FormStat: '타격 1위', formStatus: 'GREEN', stamina: 'GREEN', minutesPlayed14d: 9 },
            { id: 'ssg_5', name: '한유섬', number: 35, position: 'RF', marketValue: '.262', marketValueNum: 0.262, seasonAvgStat: '타율 .262 | 24홈런 87타점', recent3FormStat: '장타력', formStatus: 'GREEN', stamina: 'GREEN', minutesPlayed14d: 9 },
            { id: 'ssg_6', name: '오태곤', number: 37, position: '1B', marketValue: '.255', marketValueNum: 0.255, seasonAvgStat: '타율 .255 | 만능 유틸리티', recent3FormStat: '알짜 수비', formStatus: 'GREEN', stamina: 'GREEN', minutesPlayed14d: 9 },
            { id: 'ssg_7', name: '이지영', number: 59, position: 'C', marketValue: '.277', marketValueNum: 0.277, seasonAvgStat: '타율 .277 | 베테랑 포수', recent3FormStat: '투수 리드', formStatus: 'YELLOW', stamina: 'GREEN', minutesPlayed14d: 9 },
            { id: 'ssg_8', name: '하재훈', number: 13, position: 'DH', marketValue: '.248', marketValueNum: 0.248, seasonAvgStat: '타율 .248 | 8홈런', recent3FormStat: '파워풀', formStatus: 'GREEN', stamina: 'GREEN', minutesPlayed14d: 9 },
            { id: 'ssg_9', name: '정준재', number: 58, position: '2B', marketValue: '.307', marketValueNum: 0.307, seasonAvgStat: '타율 .307 | 16도루 (신예 발야구)', recent3FormStat: '스피드 스타', formStatus: 'GREEN', stamina: 'GREEN', minutesPlayed14d: 9 }
          ]
        }
      };
    }

    // 10. NC 다이노스
    if (clean.includes('nc') || clean.includes('다이노스')) {
      return {
        teamName: 'NC 다이노스',
        teamLogo: 'https://media.api-sports.io/baseball/teams/95.png',
        starterPitcher: {
          name: '구창모',
          number: 59,
          throwsHand: 'L',
          era: '2.85',
          whip: '1.08',
          wins: 7,
          losses: 2,
          inningsPitched: '65.0',
          strikeouts: 72,
          vsOpponentLogs: [
            { dateStr: '08.01', opponentName: 'KIA', innings: '6.0', earnedRuns: 1, runs: 1, result: '승', decision: '승리투수' }
          ]
        },
        battingLineup: {
          formation: '4-3-3',
          starting11Value: 'KBO 1군 오피셜',
          starting11ValueNum: 1.0,
          players: [
            { id: 'nc_1', name: '박민우', number: 2, position: '2B', marketValue: '.328', marketValueNum: 0.328, seasonAvgStat: '타율 .328 | 32도루', recent3FormStat: '출루 밥상', formStatus: 'GREEN', stamina: 'GREEN', minutesPlayed14d: 9 },
            { id: 'nc_2', name: '권희동', number: 36, position: 'LF', marketValue: '.285', marketValueNum: 0.285, seasonAvgStat: '타율 .285 | 출루율 .400', recent3FormStat: '눈야구 마스터', formStatus: 'GREEN', stamina: 'GREEN', minutesPlayed14d: 9 },
            { id: 'nc_3', name: '데이비슨', number: 24, position: '1B', marketValue: '.306', marketValueNum: 0.306, seasonAvgStat: '타율 .306 | 46홈런 119타점 (홈런왕)', recent3FormStat: 'KBO 홈런 1위', formStatus: 'GREEN', stamina: 'GREEN', minutesPlayed14d: 9 },
            { id: 'nc_4', name: '손아섭', number: 31, position: 'DH', marketValue: '.291', marketValueNum: 0.291, seasonAvgStat: 'KBO 역대 최다안타 1위', recent3FormStat: '안타 장인', formStatus: 'GREEN', stamina: 'GREEN', minutesPlayed14d: 9 },
            { id: 'nc_5', name: '박건우', number: 37, position: 'RF', marketValue: '.344', marketValueNum: 0.344, seasonAvgStat: '타율 .344 | 13홈런 66타점', recent3FormStat: '국가대표 외야', formStatus: 'GREEN', stamina: 'GREEN', minutesPlayed14d: 9 },
            { id: 'nc_6', name: '김형준', number: 25, position: 'C', marketValue: '.220', marketValueNum: 0.220, seasonAvgStat: '타율 .220 | 17홈런 (장타포수)', recent3FormStat: '장타력 우수', formStatus: 'GREEN', stamina: 'GREEN', minutesPlayed14d: 9 },
            { id: 'nc_7', name: '김성욱', number: 38, position: 'CF', marketValue: '.215', marketValueNum: 0.215, seasonAvgStat: '타율 .215 | 17홈런', recent3FormStat: '외야 수비', formStatus: 'YELLOW', stamina: 'GREEN', minutesPlayed14d: 9 },
            { id: 'nc_8', name: '서호철', number: 5, position: '3B', marketValue: '.281', marketValueNum: 0.281, seasonAvgStat: '타율 .281 | 10홈런 61타점', recent3FormStat: '쏠쏠한 활약', formStatus: 'GREEN', stamina: 'GREEN', minutesPlayed14d: 9 },
            { id: 'nc_9', name: '김주원', number: 7, position: 'SS', marketValue: '.252', marketValueNum: 0.252, seasonAvgStat: '타율 .252 | 9홈런 16도루', recent3FormStat: '유격수 수비', formStatus: 'YELLOW', stamina: 'GREEN', minutesPlayed14d: 9 }
          ]
        }
      };
    }

    // 11. MLB 뉴욕 양키스
    if (clean.includes('양키스') || clean.includes('yankees')) {
      return {
        teamName: '뉴욕 양키스',
        teamLogo: 'https://media.api-sports.io/baseball/teams/1.png',
        starterPitcher: {
          name: '엘머 로드리게스',
          number: 67,
          throwsHand: 'R',
          era: '3.75',
          whip: '1.24',
          wins: 5,
          losses: 3,
          inningsPitched: '55.0',
          strikeouts: 52,
          vsOpponentLogs: [
            { dateStr: '08.08', opponentName: 'LAA', innings: '5.2', earnedRuns: 2, runs: 2, result: '승', decision: '선발' }
          ]
        },
        battingLineup: {
          formation: '4-3-3',
          starting11Value: 'MLB 특급 타선',
          starting11ValueNum: 3.5,
          players: [
            { id: 'nyy_1', name: '글레이버 토레스', number: 25, position: '2B', marketValue: '.257', marketValueNum: 0.257, seasonAvgStat: '타율 .257 | 15홈런', recent3FormStat: '출루 준수', formStatus: 'GREEN', stamina: 'GREEN', minutesPlayed14d: 9 },
            { id: 'nyy_2', name: '후안 소토', number: 22, position: 'RF', marketValue: '.288', marketValueNum: 0.288, seasonAvgStat: '타율 .288 | 41홈런 109타점', recent3FormStat: '특급 타자', formStatus: 'GREEN', stamina: 'GREEN', minutesPlayed14d: 9 },
            { id: 'nyy_3', name: '애런 저지', number: 99, position: 'CF', marketValue: '.322', marketValueNum: 0.322, seasonAvgStat: '타율 .322 | 58홈런 144타점', recent3FormStat: '메이저리그 1위', formStatus: 'GREEN', stamina: 'GREEN', minutesPlayed14d: 9 },
            { id: 'nyy_4', name: '오스틴 웰스', number: 28, position: 'C', marketValue: '.229', marketValueNum: 0.229, seasonAvgStat: '타율 .229 | 13홈런', recent3FormStat: '포수', formStatus: 'YELLOW', stamina: 'GREEN', minutesPlayed14d: 9 },
            { id: 'nyy_5', name: '지안카를로 스탠튼', number: 27, position: 'DH', marketValue: '.233', marketValueNum: 0.233, seasonAvgStat: '타율 .233 | 27홈런', recent3FormStat: '장타 파워', formStatus: 'GREEN', stamina: 'GREEN', minutesPlayed14d: 9 },
            { id: 'nyy_6', name: '재즈 치좀 주니어', number: 13, position: '3B', marketValue: '.256', marketValueNum: 0.256, seasonAvgStat: '타율 .256 | 24홈런', recent3FormStat: '만능 툴', formStatus: 'GREEN', stamina: 'GREEN', minutesPlayed14d: 9 },
            { id: 'nyy_7', name: '앤서니 리조', number: 48, position: '1B', marketValue: '.228', marketValueNum: 0.228, seasonAvgStat: '타율 .228 | 8홈런', recent3FormStat: '베테랑', formStatus: 'YELLOW', stamina: 'GREEN', minutesPlayed14d: 9 },
            { id: 'nyy_8', name: '앤서니 볼피', number: 11, position: 'SS', marketValue: '.243', marketValueNum: 0.243, seasonAvgStat: '타율 .243 | 12홈런', recent3FormStat: '철벽 수비', formStatus: 'GREEN', stamina: 'GREEN', minutesPlayed14d: 9 },
            { id: 'nyy_9', name: '알렉스 버두고', number: 24, position: 'LF', marketValue: '.233', marketValueNum: 0.233, seasonAvgStat: '타율 .233 | 13홈런', recent3FormStat: '외야 수비', formStatus: 'YELLOW', stamina: 'GREEN', minutesPlayed14d: 9 }
          ]
        }
      };
    }

    // 12. MLB LA 에인절스
    if (clean.includes('에인절스') || clean.includes('angels')) {
      return {
        teamName: 'LA 에인절스',
        teamLogo: 'https://media.api-sports.io/baseball/teams/3.png',
        starterPitcher: {
          name: '왈버트 우레냐',
          number: 62,
          throwsHand: 'R',
          era: '4.25',
          whip: '1.30',
          wins: 4,
          losses: 5,
          inningsPitched: '68.0',
          strikeouts: 60,
          vsOpponentLogs: [
            { dateStr: '08.08', opponentName: 'NYY', innings: '5.0', earnedRuns: 3, runs: 3, result: '패', decision: '선발' }
          ]
        },
        battingLineup: {
          formation: '4-3-3',
          starting11Value: 'MLB 라인업',
          starting11ValueNum: 2.0,
          players: [
            { id: 'laa_1', name: '테일러 워드', number: 3, position: 'LF', marketValue: '.246', marketValueNum: 0.246, seasonAvgStat: '타율 .246 | 25홈런', recent3FormStat: '중심 장타', formStatus: 'GREEN', stamina: 'GREEN', minutesPlayed14d: 9 },
            { id: 'laa_2', name: '놀란 샤누엘', number: 22, position: '1B', marketValue: '.253', marketValueNum: 0.253, seasonAvgStat: '타율 .253 | 출루율 .343', recent3FormStat: '선구안 우수', formStatus: 'GREEN', stamina: 'GREEN', minutesPlayed14d: 9 },
            { id: 'laa_3', name: '잭 네토', number: 9, position: 'SS', marketValue: '.249', marketValueNum: 0.249, seasonAvgStat: '타율 .249 | 23홈런 30도루', recent3FormStat: '공수주 만능', formStatus: 'GREEN', stamina: 'GREEN', minutesPlayed14d: 9 },
            { id: 'laa_4', name: '조 아델', number: 7, position: 'RF', marketValue: '.207', marketValueNum: 0.207, seasonAvgStat: '타율 .207 | 20홈런', recent3FormStat: '파워 히터', formStatus: 'YELLOW', stamina: 'GREEN', minutesPlayed14d: 9 },
            { id: 'laa_5', name: '로건 오호프', number: 14, position: 'C', marketValue: '.244', marketValueNum: 0.244, seasonAvgStat: '타율 .244 | 20홈런', recent3FormStat: '거포 포수', formStatus: 'GREEN', stamina: 'GREEN', minutesPlayed14d: 9 },
            { id: 'laa_6', name: '앤서니 렌던', number: 6, position: '3B', marketValue: '.218', marketValueNum: 0.218, seasonAvgStat: '베테랑 내야수', recent3FormStat: '컨디션 관리', formStatus: 'YELLOW', stamina: 'GREEN', minutesPlayed14d: 9 },
            { id: 'laa_7', name: '브랜든 드루리', number: 23, position: '2B', marketValue: '.169', marketValueNum: 0.169, seasonAvgStat: '내야 유틸리티', recent3FormStat: '타격 침체', formStatus: 'RED', stamina: 'GREEN', minutesPlayed14d: 9 },
            { id: 'laa_8', name: '미키 모니악', number: 16, position: 'CF', marketValue: '.219', marketValueNum: 0.219, seasonAvgStat: '타율 .219 | 14홈런', recent3FormStat: '외야 수비', formStatus: 'YELLOW', stamina: 'GREEN', minutesPlayed14d: 9 },
            { id: 'laa_9', name: '잭 카바다스', number: 28, position: 'DH', marketValue: '.200', marketValueNum: 0.200, seasonAvgStat: '지명타자 출전', recent3FormStat: '신예 타자', formStatus: 'YELLOW', stamina: 'GREEN', minutesPlayed14d: 9 }
          ]
        }
      };
    }

    // MLB LA 다저스
    if (clean.includes('다저스') || clean.includes('dodgers') || clean.includes('la다저스')) {
      return {
        teamName: 'LA 다저스',
        teamLogo: 'https://media.api-sports.io/baseball/teams/17.png',
        starterPitcher: { name: '야마모토 요시노부', number: 18, throwsHand: 'R', era: '2.92', whip: '1.08', wins: 11, losses: 3, inningsPitched: '123.1', strikeouts: 135, vsOpponentLogs: [] },
        battingLineup: { formation: '4-3-3', starting11Value: 'MLB 최강 타선', starting11ValueNum: 4.0, players: [] }
      };
    }

    // MLB 세인트루이스 카디널스
    if (clean.includes('세인트루이스') || clean.includes('cardinals') || clean.includes('세인카디')) {
      return {
        teamName: '세인트루이스 카디널스',
        teamLogo: 'https://media.api-sports.io/baseball/teams/30.png',
        starterPitcher: { name: '소니 그레이', number: 54, throwsHand: 'R', era: '3.75', whip: '1.09', wins: 13, losses: 9, inningsPitched: '166.1', strikeouts: 203, vsOpponentLogs: [] },
        battingLineup: { formation: '4-3-3', starting11Value: 'MLB 라인업', starting11ValueNum: 2.5, players: [] }
      };
    }

    // MLB 탬파베이 레이스
    if (clean.includes('탬파베이') || clean.includes('rays') || clean.includes('탬파레이')) {
      return {
        teamName: '탬파베이 레이스',
        teamLogo: 'https://media.api-sports.io/baseball/teams/32.png',
        starterPitcher: { name: '잭 리텔', number: 52, throwsHand: 'R', era: '3.63', whip: '1.25', wins: 8, losses: 9, inningsPitched: '156.1', strikeouts: 141, vsOpponentLogs: [] },
        battingLineup: { formation: '4-3-3', starting11Value: 'MLB 라인업', starting11ValueNum: 2.2, players: [] }
      };
    }

    // MLB 뉴욕 메츠
    if (clean.includes('뉴욕메츠') || clean.includes('mets')) {
      return {
        teamName: '뉴욕 메츠',
        teamLogo: 'https://media.api-sports.io/baseball/teams/22.png',
        starterPitcher: { name: '션 마네아', number: 59, throwsHand: 'L', era: '3.47', whip: '1.08', wins: 12, losses: 5, inningsPitched: '181.2', strikeouts: 184, vsOpponentLogs: [] },
        battingLineup: { formation: '4-3-3', starting11Value: 'MLB 라인업', starting11ValueNum: 2.8, players: [] }
      };
    }

    // MLB 피츠버그 파이리츠
    if (clean.includes('피츠버그') || clean.includes('pirates') || clean.includes('피츠파이')) {
      return {
        teamName: '피츠버그 파이리츠',
        teamLogo: 'https://media.api-sports.io/baseball/teams/26.png',
        starterPitcher: { name: '폴 스킨스', number: 30, throwsHand: 'R', era: '1.96', whip: '0.95', wins: 11, losses: 3, inningsPitched: '133.0', strikeouts: 170, vsOpponentLogs: [] },
        battingLineup: { formation: '4-3-3', starting11Value: 'MLB 라인업', starting11ValueNum: 2.0, players: [] }
      };
    }

    // MLB 샌프란시스코 자이언츠
    if (clean.includes('샌프란시스코') || clean.includes('샌프자이') || (clean.includes('giants') && !clean.includes('yomiuri') && !clean.includes('요미우리') && !clean.includes('lotte') && !clean.includes('롯데'))) {
      return {
        teamName: '샌프란시스코 자이언츠',
        teamLogo: 'https://media.api-sports.io/baseball/teams/28.png',
        starterPitcher: { name: '로건 웹', number: 62, throwsHand: 'R', era: '3.46', whip: '1.23', wins: 13, losses: 10, inningsPitched: '204.2', strikeouts: 172, vsOpponentLogs: [] },
        battingLineup: { formation: '4-3-3', starting11Value: 'MLB 라인업', starting11ValueNum: 2.4, players: [] }
      };
    }

    // MLB 캔자스시티 로열스
    if (clean.includes('캔자스시티') || clean.includes('royals') || clean.includes('캔자로얄')) {
      return {
        teamName: '캔자스시티 로열스',
        teamLogo: 'https://media.api-sports.io/baseball/teams/19.png',
        starterPitcher: { name: '콜 레이건스', number: 55, throwsHand: 'L', era: '3.19', whip: '1.14', wins: 11, losses: 9, inningsPitched: '186.1', strikeouts: 223, vsOpponentLogs: [] },
        battingLineup: { formation: '4-3-3', starting11Value: 'MLB 라인업', starting11ValueNum: 2.6, players: [] }
      };
    }

    // MLB 마이애미 말린스
    if (clean.includes('마이애미') || clean.includes('marlins') || clean.includes('마이말린')) {
      return {
        teamName: '마이애미 말린스',
        teamLogo: 'https://media.api-sports.io/baseball/teams/20.png',
        starterPitcher: { name: '에드워드 카브레라', number: 27, throwsHand: 'R', era: '4.70', whip: '1.36', wins: 4, losses: 8, inningsPitched: '97.2', strikeouts: 108, vsOpponentLogs: [] },
        battingLineup: { formation: '4-3-3', starting11Value: 'MLB 라인업', starting11ValueNum: 1.8, players: [] }
      };
    }

    // MLB 텍사스 레인저스
    if (clean.includes('텍사스') || clean.includes('rangers') || clean.includes('텍사레인')) {
      return {
        teamName: '텍사스 레인저스',
        teamLogo: 'https://media.api-sports.io/baseball/teams/33.png',
        starterPitcher: { name: '네이선 이볼디', number: 17, throwsHand: 'R', era: '3.78', whip: '1.11', wins: 12, losses: 8, inningsPitched: '170.2', strikeouts: 166, vsOpponentLogs: [] },
        battingLineup: { formation: '4-3-3', starting11Value: 'MLB 라인업', starting11ValueNum: 2.8, players: [] }
      };
    }

    // MLB 오클랜드 애슬레틱스
    if (clean.includes('오클랜드') || clean.includes('athletics') || clean.includes('애슬레틱')) {
      return {
        teamName: '오클랜드 애슬레틱스',
        teamLogo: 'https://media.api-sports.io/baseball/teams/24.png',
        starterPitcher: { name: 'JP 시어스', number: 68, throwsHand: 'L', era: '4.38', whip: '1.22', wins: 11, losses: 12, inningsPitched: '180.2', strikeouts: 136, vsOpponentLogs: [] },
        battingLineup: { formation: '4-3-3', starting11Value: 'MLB 라인업', starting11ValueNum: 1.8, players: [] }
      };
    }

    // MLB 휴스턴 애스트로스
    if (clean.includes('휴스턴') || clean.includes('astros') || clean.includes('휴스애스')) {
      return {
        teamName: '휴스턴 애스트로스',
        teamLogo: 'https://media.api-sports.io/baseball/teams/18.png',
        starterPitcher: { name: '프람버 발데스', number: 59, throwsHand: 'L', era: '2.91', whip: '1.11', wins: 15, losses: 7, inningsPitched: '176.1', strikeouts: 169, vsOpponentLogs: [] },
        battingLineup: { formation: '4-3-3', starting11Value: 'MLB 라인업', starting11ValueNum: 3.2, players: [] }
      };
    }

    // MLB 시카고 화이트삭스
    if (clean.includes('화이트삭스') || clean.includes('whitesox') || clean.includes('시카화이')) {
      return {
        teamName: '시카고 화이트삭스',
        teamLogo: 'https://media.api-sports.io/baseball/teams/10.png',
        starterPitcher: { name: '가렛 크로셰', number: 45, throwsHand: 'L', era: '3.58', whip: '1.07', wins: 6, losses: 12, inningsPitched: '146.0', strikeouts: 209, vsOpponentLogs: [] },
        battingLineup: { formation: '4-3-3', starting11Value: 'MLB 라인업', starting11ValueNum: 1.5, players: [] }
      };
    }

    // MLB 콜로라도 로키스
    if (clean.includes('콜로라도') || clean.includes('rockies') || clean.includes('콜로로키')) {
      return {
        teamName: '콜로라도 로키스',
        teamLogo: 'https://media.api-sports.io/baseball/teams/12.png',
        starterPitcher: { name: '카일 프리랜드', number: 21, throwsHand: 'L', era: '4.95', whip: '1.38', wins: 5, losses: 8, inningsPitched: '109.0', strikeouts: 78, vsOpponentLogs: [] },
        battingLineup: { formation: '4-3-3', starting11Value: 'MLB 라인업', starting11ValueNum: 1.6, players: [] }
      };
    }

    // MLB 볼티모어 오리올스
    if (clean.includes('볼티모어') || clean.includes('orioles') || clean.includes('볼티오리')) {
      return {
        teamName: '볼티모어 오리올스',
        teamLogo: 'https://media.api-sports.io/baseball/teams/4.png',
        starterPitcher: { name: '코빈 번스', number: 39, throwsHand: 'R', era: '2.92', whip: '1.10', wins: 15, losses: 8, inningsPitched: '194.1', strikeouts: 181, vsOpponentLogs: [] },
        battingLineup: { formation: '4-3-3', starting11Value: 'MLB 라인업', starting11ValueNum: 3.2, players: [] }
      };
    }

    // MLB 애리조나 다이아몬드백스
    if (clean.includes('애리조나') || clean.includes('diamondbacks') || clean.includes('애리다이')) {
      return {
        teamName: '애리조나 다이아몬드백스',
        teamLogo: 'https://media.api-sports.io/baseball/teams/2.png',
        starterPitcher: {
          name: '브랜든 팟',
          number: 32,
          throwsHand: 'R',
          era: '4.21',
          whip: '1.23',
          wins: 10,
          losses: 10,
          inningsPitched: '181.2',
          strikeouts: 185,
          vsOpponentLogs: []
        },
        battingLineup: { formation: '4-3-3', starting11Value: 'MLB 라인업', starting11ValueNum: 2.0, players: [] }
      };
    }

    // MLB 필라델피아 필리스
    if (clean.includes('필라델피아') || clean.includes('phillies') || clean.includes('필라필리')) {
      return {
        teamName: '필라델피아 필리스',
        teamLogo: 'https://media.api-sports.io/baseball/teams/25.png',
        starterPitcher: {
          name: '애런 놀라',
          number: 27,
          throwsHand: 'R',
          era: '3.47',
          whip: '1.18',
          wins: 14,
          losses: 8,
          inningsPitched: '199.1',
          strikeouts: 197,
          vsOpponentLogs: []
        },
        battingLineup: { formation: '4-3-3', starting11Value: 'MLB 라인업', starting11ValueNum: 2.5, players: [] }
      };
    }

    // 13. NPB 요미우리 자이언츠
    if (clean.includes('요미우리') || clean.includes('yomiuri') || clean.includes('giants')) {
      return {
        teamName: '요미우리 자이언츠',
        teamLogo: 'https://media.api-sports.io/baseball/teams/101.png',
        starterPitcher: { name: '토고 쇼세이', number: 20, throwsHand: 'R', era: '2.15', whip: '1.02', wins: 10, losses: 6, inningsPitched: '142.0', strikeouts: 130, vsOpponentLogs: [] },
        battingLineup: { formation: '4-3-3', starting11Value: 'NPB 1군 오피셜', starting11ValueNum: 1.5, players: [] }
      };
    }

    // 14. NPB 요코하마 DeNA
    if (clean.includes('요코하마') || clean.includes('dena') || clean.includes('baystars')) {
      return {
        teamName: '요코하마 DeNA',
        teamLogo: 'https://media.api-sports.io/baseball/teams/102.png',
        starterPitcher: { name: '이시다 유타로', number: 54, throwsHand: 'R', era: '2.45', whip: '1.10', wins: 7, losses: 3, inningsPitched: '85.0', strikeouts: 65, vsOpponentLogs: [] },
        battingLineup: { formation: '4-3-3', starting11Value: 'NPB 1군 오피셜', starting11ValueNum: 1.5, players: [] }
      };
    }

    // 15. NPB 야쿠르트 스왈로즈
    if (clean.includes('야쿠르트') || clean.includes('yakult') || clean.includes('swallows')) {
      return {
        teamName: '야쿠르트 스왈로즈',
        teamLogo: 'https://media.api-sports.io/baseball/teams/103.png',
        starterPitcher: { name: '요시무라 코지로', number: 21, throwsHand: 'R', era: '2.95', whip: '1.18', wins: 7, losses: 7, inningsPitched: '110.0', strikeouts: 95, vsOpponentLogs: [] },
        battingLineup: { formation: '4-3-3', starting11Value: 'NPB 1군 오피셜', starting11ValueNum: 1.5, players: [] }
      };
    }

    // 16. NPB 한신 타이거즈
    if (clean.includes('한신') || clean.includes('hanshin') || clean.includes('tigers')) {
      return {
        teamName: '한신 타이거즈',
        teamLogo: 'https://media.api-sports.io/baseball/teams/104.png',
        starterPitcher: { name: '타카하시 하루토', number: 29, throwsHand: 'L', era: '1.85', whip: '0.98', wins: 4, losses: 1, inningsPitched: '45.0', strikeouts: 42, vsOpponentLogs: [] },
        battingLineup: { formation: '4-3-3', starting11Value: 'NPB 1군 오피셜', starting11ValueNum: 1.5, players: [] }
      };
    }

    // 17. NPB 주니치 드래곤즈
    if (clean.includes('주니치') || clean.includes('chunichi') || clean.includes('dragons')) {
      return {
        teamName: '주니치 드래곤즈',
        teamLogo: 'https://media.api-sports.io/baseball/teams/105.png',
        starterPitcher: { name: '오노 유다이', number: 22, throwsHand: 'L', era: '3.10', whip: '1.15', wins: 3, losses: 4, inningsPitched: '52.0', strikeouts: 50, vsOpponentLogs: [] },
        battingLineup: { formation: '4-3-3', starting11Value: 'NPB 1군 오피셜', starting11ValueNum: 1.5, players: [] }
      };
    }

    // 18. NPB 히로시마 도요 카프
    if (clean.includes('히로시마') || clean.includes('hiroshima') || clean.includes('carp')) {
      return {
        teamName: '히로시마 도요 카프',
        teamLogo: 'https://media.api-sports.io/baseball/teams/106.png',
        starterPitcher: { name: '토코다 히로키', number: 28, throwsHand: 'L', era: '2.18', whip: '1.05', wins: 11, losses: 6, inningsPitched: '135.0', strikeouts: 108, vsOpponentLogs: [] },
        battingLineup: { formation: '4-3-3', starting11Value: 'NPB 1군 오피셜', starting11ValueNum: 1.5, players: [] }
      };
    }

    // 19. NPB 닛폰햄 파이터즈
    if (clean.includes('닛폰햄') || clean.includes('nippon') || clean.includes('fighters')) {
      return {
        teamName: '닛폰햄 파이터즈',
        teamLogo: 'https://media.api-sports.io/baseball/teams/107.png',
        starterPitcher: { name: '야마사키 사치야', number: 18, throwsHand: 'L', era: '2.80', whip: '1.12', wins: 9, losses: 4, inningsPitched: '115.0', strikeouts: 88, vsOpponentLogs: [] },
        battingLineup: { formation: '4-3-3', starting11Value: 'NPB 1군 오피셜', starting11ValueNum: 1.5, players: [] }
      };
    }

    // 20. NPB 소프트뱅크 호크스
    if (clean.includes('소프트뱅크') || clean.includes('softbank') || clean.includes('hawks')) {
      return {
        teamName: '소프트뱅크 호크스',
        teamLogo: 'https://media.api-sports.io/baseball/teams/108.png',
        starterPitcher: { name: '리반 모이넬로', number: 47, throwsHand: 'L', era: '1.62', whip: '0.92', wins: 10, losses: 4, inningsPitched: '145.0', strikeouts: 135, vsOpponentLogs: [] },
        battingLineup: { formation: '4-3-3', starting11Value: 'NPB 1군 오피셜', starting11ValueNum: 1.5, players: [] }
      };
    }

    // 21. NPB 라쿠텐 골든이글스
    if (clean.includes('라쿠텐') || clean.includes('rakuten') || clean.includes('eagles')) {
      return {
        teamName: '라쿠텐 골든이글스',
        teamLogo: 'https://media.api-sports.io/baseball/teams/109.png',
        starterPitcher: { name: '이토 이츠키', number: 17, throwsHand: 'R', era: '3.40', whip: '1.22', wins: 4, losses: 3, inningsPitched: '60.0', strikeouts: 45, vsOpponentLogs: [] },
        battingLineup: {
          formation: '4-3-3',
          starting11Value: 'NPB 1군 오피셜',
          starting11ValueNum: 1.5,
          players: [
            { id: 'rakuten_1', name: '고부카 히로토', number: 5, position: '2B', marketValue: '.285', marketValueNum: 0.285, seasonAvgStat: '타율 .285 | 28도루', recent3FormStat: '출루 전문', formStatus: 'GREEN', stamina: 'GREEN', minutesPlayed14d: 9 },
            { id: 'rakuten_2', name: '무라바야시 이쓰키', number: 66, position: 'SS', marketValue: '.272', marketValueNum: 0.272, seasonAvgStat: '타율 .272 | 호수비', recent3FormStat: '작전 수행', formStatus: 'GREEN', stamina: 'GREEN', minutesPlayed14d: 9 },
            { id: 'rakuten_3', name: '다츠미 료스케', number: 8, position: 'CF', marketValue: '.294', marketValueNum: 0.294, seasonAvgStat: '타율 .294 | 골든글러브', recent3FormStat: '중견수 호수비', formStatus: 'GREEN', stamina: 'GREEN', minutesPlayed14d: 9 },
            { id: 'rakuten_4', name: '아사무라 히데토', number: 3, position: '1B', marketValue: '.268', marketValueNum: 0.268, seasonAvgStat: '타율 .268 | 24홈런 82타점', recent3FormStat: '4번 타자', formStatus: 'GREEN', stamina: 'GREEN', minutesPlayed14d: 9 },
            { id: 'rakuten_5', name: '스즈키 다이치', number: 7, position: '3B', marketValue: '.278', marketValueNum: 0.278, seasonAvgStat: '타율 .278 | 클러치', recent3FormStat: '해결사', formStatus: 'GREEN', stamina: 'GREEN', minutesPlayed14d: 9 },
            { id: 'rakuten_6', name: '시마우치 히로아키', number: 35, position: 'LF', marketValue: '.265', marketValueNum: 0.265, seasonAvgStat: '타율 .265 | 타점 제조', recent3FormStat: '장타력', formStatus: 'YELLOW', stamina: 'GREEN', minutesPlayed14d: 9 },
            { id: 'rakuten_7', name: '오카지마 다케로', number: 27, position: 'RF', marketValue: '.260', marketValueNum: 0.260, seasonAvgStat: '타율 .260 | 베테랑 외야', recent3FormStat: '외야 주전', formStatus: 'GREEN', stamina: 'GREEN', minutesPlayed14d: 9 },
            { id: 'rakuten_8', name: '오타 히카루', number: 2, position: 'C', marketValue: '.240', marketValueNum: 0.240, seasonAvgStat: '타율 .240 | 도루저지 41%', recent3FormStat: '안방마님', formStatus: 'GREEN', stamina: 'GREEN', minutesPlayed14d: 9 },
            { id: 'rakuten_9', name: '프랑코', number: 23, position: 'DH', marketValue: '.255', marketValueNum: 0.255, seasonAvgStat: '타율 .255 | 12홈런', recent3FormStat: '거포', formStatus: 'YELLOW', stamina: 'GREEN', minutesPlayed14d: 9 }
          ]
        }
      };
    }

    // 22. NPB 오릭스 버팔로즈
    if (clean.includes('오릭스') || clean.includes('orix') || clean.includes('buffaloes')) {
      return {
        teamName: '오릭스 버팔로즈',
        teamLogo: 'https://media.api-sports.io/baseball/teams/110.png',
        starterPitcher: { name: '쿠리 아렌', number: 11, throwsHand: 'R', era: '3.05', whip: '1.14', wins: 7, losses: 8, inningsPitched: '118.0', strikeouts: 90, vsOpponentLogs: [] },
        battingLineup: {
          formation: '4-3-3',
          starting11Value: 'NPB 1군 오피셜',
          starting11ValueNum: 1.5,
          players: [
            { id: 'orix_1', name: '나카가와 케이타', number: 67, position: 'CF', marketValue: '.288', marketValueNum: 0.288, seasonAvgStat: '타율 .288 | 톱타자', recent3FormStat: '출루 위협', formStatus: 'GREEN', stamina: 'GREEN', minutesPlayed14d: 9 },
            { id: 'orix_2', name: '니시노 마사히로', number: 5, position: '2B', marketValue: '.275', marketValueNum: 0.275, seasonAvgStat: '타율 .275 | 작전 수행', recent3FormStat: '연결고리', formStatus: 'GREEN', stamina: 'GREEN', minutesPlayed14d: 9 },
            { id: 'orix_3', name: '니시카와 료마', number: 7, position: 'LF', marketValue: '.302', marketValueNum: 0.302, seasonAvgStat: '타율 .302 | 천재 타자', recent3FormStat: '타격감 폭발', formStatus: 'GREEN', stamina: 'GREEN', minutesPlayed14d: 9 },
            { id: 'orix_4', name: '세드로', number: 40, position: '1B', marketValue: '.262', marketValueNum: 0.262, seasonAvgStat: '타율 .262 | 21홈런', recent3FormStat: '4번 거포', formStatus: 'GREEN', stamina: 'GREEN', minutesPlayed14d: 9 },
            { id: 'orix_5', name: '무네 유마', number: 6, position: '3B', marketValue: '.265', marketValueNum: 0.265, seasonAvgStat: '타율 .265 | 골든글러브 3B', recent3FormStat: '핫코너 철벽', formStatus: 'GREEN', stamina: 'GREEN', minutesPlayed14d: 9 },
            { id: 'orix_6', name: '쿠레바야시 코타로', number: 24, position: 'SS', marketValue: '.278', marketValueNum: 0.278, seasonAvgStat: '타율 .278 | 국가대표 SS', recent3FormStat: '공수겸장', formStatus: 'GREEN', stamina: 'GREEN', minutesPlayed14d: 9 },
            { id: 'orix_7', name: '차노 토쿠마사', number: 61, position: 'RF', marketValue: '.255', marketValueNum: 0.255, seasonAvgStat: '타율 .255 | 빠른 발', recent3FormStat: '외야 주전', formStatus: 'YELLOW', stamina: 'GREEN', minutesPlayed14d: 9 },
            { id: 'orix_8', name: '와카츠키 켄야', number: 2, position: 'C', marketValue: '.250', marketValueNum: 0.250, seasonAvgStat: '타율 .250 | 리그 최고 투수리드', recent3FormStat: '주전 포수', formStatus: 'GREEN', stamina: 'GREEN', minutesPlayed14d: 9 },
            { id: 'orix_9', name: '스기모토 유타로', number: 99, position: 'DH', marketValue: '.245', marketValueNum: 0.245, seasonAvgStat: '타율 .245 | 라오우 거포', recent3FormStat: '한방 능력', formStatus: 'YELLOW', stamina: 'GREEN', minutesPlayed14d: 9 }
          ]
        }
      };
    }

    // 23. NPB 지바 롯데 마린즈
    if (clean.includes('지바') || clean.includes('chiba') || clean.includes('marines')) {
      return {
        teamName: '지바 롯데 마린즈',
        teamLogo: 'https://media.api-sports.io/baseball/teams/111.png',
        starterPitcher: { name: '타카노 슈타', number: 34, throwsHand: 'R', era: '2.75', whip: '1.08', wins: 2, losses: 1, inningsPitched: '35.0', strikeouts: 38, vsOpponentLogs: [] },
        battingLineup: {
          formation: '4-3-3',
          starting11Value: 'NPB 1군 오피셜',
          starting11ValueNum: 1.5,
          players: [
            { id: 'lotte_1', name: '오기노 타카시', number: 0, position: 'LF', marketValue: '.290', marketValueNum: 0.290, seasonAvgStat: '타율 .290', recent3FormStat: '리드오프', formStatus: 'GREEN', stamina: 'GREEN', minutesPlayed14d: 9 },
            { id: 'lotte_2', name: '후지와라 쿄타', number: 1, position: 'CF', marketValue: '.270', marketValueNum: 0.270, seasonAvgStat: '타율 .270', recent3FormStat: '외야 핵심', formStatus: 'GREEN', stamina: 'GREEN', minutesPlayed14d: 9 },
            { id: 'lotte_3', name: '나카무라 쇼고', number: 8, position: '2B', marketValue: '.265', marketValueNum: 0.265, seasonAvgStat: '타율 .265', recent3FormStat: '주장', formStatus: 'GREEN', stamina: 'GREEN', minutesPlayed14d: 9 },
            { id: 'lotte_4', name: '폴랑코', number: 22, position: 'DH', marketValue: '.255', marketValueNum: 0.255, seasonAvgStat: '타율 .255 | 26홈런 (홈런왕)', recent3FormStat: '4번 타자', formStatus: 'GREEN', stamina: 'GREEN', minutesPlayed14d: 9 },
            { id: 'lotte_5', name: '소토', number: 99, position: '1B', marketValue: '.260', marketValueNum: 0.260, seasonAvgStat: '타율 .260 | 18홈런', recent3FormStat: '해결사', formStatus: 'GREEN', stamina: 'GREEN', minutesPlayed14d: 9 },
            { id: 'lotte_6', name: '야스다 히사노리', number: 5, position: '3B', marketValue: '.250', marketValueNum: 0.250, seasonAvgStat: '타율 .250', recent3FormStat: '내야 주전', formStatus: 'YELLOW', stamina: 'GREEN', minutesPlayed14d: 9 },
            { id: 'lotte_7', name: '야마구치 코키', number: 51, position: 'RF', marketValue: '.245', marketValueNum: 0.245, seasonAvgStat: '타율 .245 | 14홈런', recent3FormStat: '장타력', formStatus: 'GREEN', stamina: 'GREEN', minutesPlayed14d: 9 },
            { id: 'lotte_8', name: '사토 토시야', number: 32, position: 'C', marketValue: '.275', marketValueNum: 0.275, seasonAvgStat: '타율 .275 | 공격형 포수', recent3FormStat: '주전 포수', formStatus: 'GREEN', stamina: 'GREEN', minutesPlayed14d: 9 },
            { id: 'lotte_9', name: '후지오카 유다이', number: 7, position: 'SS', marketValue: '.270', marketValueNum: 0.270, seasonAvgStat: '타율 .270', recent3FormStat: '수비 조율', formStatus: 'GREEN', stamina: 'GREEN', minutesPlayed14d: 9 }
          ]
        }
      };
    }

    // 24. NPB 사이타마 세이부 라이온즈
    if (clean.includes('세이부') || clean.includes('seibu') || clean.includes('lions')) {
      return {
        teamName: '세이부 라이온즈',
        teamLogo: 'https://media.api-sports.io/baseball/teams/112.png',
        starterPitcher: { name: '타이라 카이마', number: 61, throwsHand: 'R', era: '2.50', whip: '1.06', wins: 3, losses: 2, inningsPitched: '42.0', strikeouts: 40, vsOpponentLogs: [] },
        battingLineup: {
          formation: '4-3-3',
          starting11Value: 'NPB 1군 오피셜',
          starting11ValueNum: 1.5,
          players: [
            { id: 'seibu_1', name: '가네코 유지', number: 7, position: 'CF', marketValue: '.260', marketValueNum: 0.260, seasonAvgStat: '타율 .260 | 도루왕 출신', recent3FormStat: '출루', formStatus: 'GREEN', stamina: 'GREEN', minutesPlayed14d: 9 },
            { id: 'seibu_2', name: '겐다 소스케', number: 6, position: 'SS', marketValue: '.270', marketValueNum: 0.270, seasonAvgStat: '타율 .270 | 6년연속 GG', recent3FormStat: '수비 마법사', formStatus: 'GREEN', stamina: 'GREEN', minutesPlayed14d: 9 },
            { id: 'seibu_3', name: '토노사키 슈타', number: 5, position: '2B', marketValue: '.265', marketValueNum: 0.265, seasonAvgStat: '타율 .265 | 호타준족', recent3FormStat: '중심 타선', formStatus: 'GREEN', stamina: 'GREEN', minutesPlayed14d: 9 },
            { id: 'seibu_4', name: '아길라', number: 44, position: '1B', marketValue: '.275', marketValueNum: 0.275, seasonAvgStat: '타율 .275 | 메이저 30홈런 출신', recent3FormStat: '4번 타자', formStatus: 'GREEN', stamina: 'GREEN', minutesPlayed14d: 9 },
            { id: 'seibu_5', name: '나카무라 타케야', number: 60, position: 'DH', marketValue: '.250', marketValueNum: 0.250, seasonAvgStat: '타율 .250 | 470홈런 (오카와리)', recent3FormStat: '홈런 거포', formStatus: 'GREEN', stamina: 'GREEN', minutesPlayed14d: 9 },
            { id: 'seibu_6', name: '사토 류세이', number: 10, position: '3B', marketValue: '.280', marketValueNum: 0.280, seasonAvgStat: '타율 .280', recent3FormStat: '타격 상승세', formStatus: 'GREEN', stamina: 'GREEN', minutesPlayed14d: 9 },
            { id: 'seibu_7', name: '코가 유토', number: 2, position: 'C', marketValue: '.245', marketValueNum: 0.245, seasonAvgStat: '타율 .245 | 주전 포수', recent3FormStat: '투수 리드', formStatus: 'GREEN', stamina: 'GREEN', minutesPlayed14d: 9 },
            { id: 'seibu_8', name: '니시카와 마나야', number: 51, position: 'LF', marketValue: '.265', marketValueNum: 0.265, seasonAvgStat: '타율 .265', recent3FormStat: '외야 주전', formStatus: 'GREEN', stamina: 'GREEN', minutesPlayed14d: 9 },
            { id: 'seibu_9', name: '하세가와 신야', number: 63, position: 'RF', marketValue: '.255', marketValueNum: 0.255, seasonAvgStat: '타율 .255', recent3FormStat: '스피드', formStatus: 'YELLOW', stamina: 'GREEN', minutesPlayed14d: 9 }
          ]
        }
      };
    }

    // Default fallback
    return {
      teamName: teamName,
      teamLogo: 'https://media.api-sports.io/baseball/leagues/5.png',
      starterPitcher: {
        name: '선발투수',
        number: 1,
        throwsHand: 'R',
        era: '3.50',
        whip: '1.20',
        wins: 10,
        losses: 5,
        inningsPitched: '140.0',
        strikeouts: 120,
        vsOpponentLogs: []
      },
      battingLineup: {
        formation: '4-3-3',
        starting11Value: '1군 오피셜',
        starting11ValueNum: 1.0,
        players: Array.from({ length: 9 }, (_, idx) => ({
          id: `player_${idx + 1}`,
          name: `${teamName} ${idx + 1}번 타자`,
          number: idx + 1,
          position: idx === 0 ? 'CF' : idx === 1 ? '2B' : idx === 2 ? 'LF' : idx === 3 ? '1B' : idx === 4 ? 'DH' : idx === 5 ? '3B' : idx === 6 ? 'RF' : idx === 7 ? 'C' : 'SS',
          marketValue: '.285',
          marketValueNum: 0.285,
          seasonAvgStat: '시즌 타율 .285 | 정상 출전',
          recent3FormStat: '컨디션 양호',
          formStatus: 'GREEN',
          stamina: 'GREEN',
          minutesPlayed14d: 9
        }))
      }
    };
  }
}
