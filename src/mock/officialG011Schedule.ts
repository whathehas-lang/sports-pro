import type { Match } from '../types/sports';

export const OFFICIAL_G011_MATCHES: Match[] = [
  {
    id: "bm-g011-260049-1",
    betmanRound: "축구 승무패 260049회차 (betman.co.kr 오피셜 슬립)",
    betmanFolder: "SEUNGMUBAE",
    betmanMatchNo: 1,
    sport: "football",
    league: "잉글랜드 챔피언십",
    countryFlag: "⚽",
    isFavorite: true,
    betmanOdds: { win: 1.95, draw: 3.10, lose: 2.25 },
    status: "SCHEDULED",
    matchTime: "09.02 (수) 03:45",
    closingTime: "09.01 (화) 23:00",
    venue: "프래턴 파크",
    lineupAlertInfo: {
      isPublished: true,
      publishedTime: "베트맨 오피셜 라인업 팩트",
      alertText: "🚨 축구 승무패 1번 경기 [포츠머스 vs 더비카운] 오피셜 선발 라인업 확정!",
      keyAbsenceNotice: "⚠️ 포츠머스 주전 윙어 복귀 / 더비카운티 중원 주전 결장"
    },
    soccerWinFactorMetrics: {
      homeXg: 1.75, awayXg: 1.28, homeXga: 1.28, awayXga: 1.75, xgMarginDiff: 0.47,
      homeBigChances: 3, awayBigChances: 1, homeBigChancesConceded: 1, awayBigChancesConceded: 3,
      homeInsideBoxShotPct: 62.5, awayInsideBoxShotPct: 45.0, homeInsideBoxShots: 8, awayInsideBoxShots: 4, homeTotalShots: 14, awayTotalShots: 9,
      homeFieldTiltPct: 56.4, awayFieldTiltPct: 43.6, fieldTiltLeader: "HOME",
      homeFirstGoalWinPct: 78.5, awayFirstGoalWinPct: 64.2, homeFirstGoalUnbeatenPct: 88.0, awayFirstGoalUnbeatenPct: 75.0,
      winFactorVerdict: "홈팀 전방 압박 및 xG 생성 우위 (1.75 vs 1.28)",
      keyWinFactorAdvantage: "홈팀 전방 압박 및 xG 생성 우위 (1.75 vs 1.28)"
    },
    headToHeadRecord: {
      summaryText: "과거 맞대결 5경기: [포츠머스] 2승 2무 1패",
      homeWins: 2, draws: 2, awayWins: 1,
      last5Matches: [
        { dateStr: "04.03", homeScore: 2, awayScore: 2, winnerName: "무승부" },
        { dateStr: "10.28", homeScore: 1, awayScore: 1, winnerName: "무승부" },
        { dateStr: "03.11", homeScore: 1, awayScore: 0, winnerName: "포츠머스" },
        { dateStr: "11.19", homeScore: 3, awayScore: 1, winnerName: "포츠머스" },
        { dateStr: "08.15", homeScore: 1, awayScore: 2, winnerName: "더비카운" }
      ]
    },
    homeTeam: {
      id: "h_g011_1", name: "포츠머스", logo: "https://media.api-sports.io/football/teams/69.png", countryName: "잉글랜드 챔피언십", rank: 14,
      homeSeasonRecord: "6승 4무 3패", awaySeasonRecord: "4승 3무 6패", seasonRemainingGames: "23경기", recent3Form: "GREEN", staminaStatus: "GREEN", minutesPlayed14d: 0, totalMarketValue: "약 3,850만 유로", totalMarketValueNum: 38500000
    },
    awayTeam: {
      id: "a_g011_1", name: "더비카운", logo: "https://media.api-sports.io/football/teams/71.png", countryName: "잉글랜드 챔피언십", rank: 16,
      homeSeasonRecord: "5승 3무 5패", awaySeasonRecord: "3승 2무 8패", seasonRemainingGames: "23경기", recent3Form: "YELLOW", staminaStatus: "GREEN", minutesPlayed14d: 0, totalMarketValue: "약 3,420만 유로", totalMarketValueNum: 34200000
    },
    underOverFact: {
      last10OverRatio: 45, last10UnderRatio: 55, avgScoredGoals: 1.3, avgConcededGoals: 1.1, isFiveBack: false,
      tacticDescription: "축구 승무패 1번 경기: 홈 어드밴티지 포츠머스 우세 (투표율 50.5%)"
    }
  },
  {
    id: "bm-g011-260049-2",
    betmanRound: "축구 승무패 260049회차 (betman.co.kr 오피셜 슬립)",
    betmanFolder: "SEUNGMUBAE",
    betmanMatchNo: 2,
    sport: "football",
    league: "잉글랜드 챔피언십",
    countryFlag: "⚽",
    isFavorite: true,
    betmanOdds: { win: 2.15, draw: 3.05, lose: 2.10 },
    status: "SCHEDULED",
    matchTime: "09.02 (수) 03:45",
    closingTime: "09.01 (화) 23:00",
    venue: "딥데일",
    lineupAlertInfo: {
      isPublished: true,
      publishedTime: "베트맨 오피셜 라인업 팩트",
      alertText: "🚨 축구 승무패 2번 경기 [프레스턴 vs 브리스C] 오피셜 대진 확정!",
      keyAbsenceNotice: "⚠️ 브리스톨 시티 원정 화력 집중"
    },
    soccerWinFactorMetrics: {
      homeXg: 1.49, awayXg: 2.25, homeXga: 2.25, awayXga: 1.49, xgMarginDiff: -0.76,
      homeBigChances: 2, awayBigChances: 3, homeBigChancesConceded: 3, awayBigChancesConceded: 2,
      homeInsideBoxShotPct: 45.0, awayInsideBoxShotPct: 60.0, homeInsideBoxShots: 5, awayInsideBoxShots: 8, homeTotalShots: 11, awayTotalShots: 14,
      homeFieldTiltPct: 44.5, awayFieldTiltPct: 55.5, fieldTiltLeader: "AWAY",
      homeFirstGoalWinPct: 68.0, awayFirstGoalWinPct: 78.5, homeFirstGoalUnbeatenPct: 78.0, awayFirstGoalUnbeatenPct: 88.0,
      winFactorVerdict: "브리스톨 시티의 원정 역습 및 xG 우위 (50.0% 지지)",
      keyWinFactorAdvantage: "브리스톨 시티의 원정 역습 및 xG 우위 (50.0% 지지)"
    },
    headToHeadRecord: {
      summaryText: "과거 맞대결 3경기: [프레스턴] 1승 1무 1패",
      homeWins: 1, draws: 1, awayWins: 1,
      last5Matches: [
        { dateStr: "01.13", homeScore: 2, awayScore: 0, winnerName: "프레스턴" },
        { dateStr: "08.05", homeScore: 1, awayScore: 1, winnerName: "무승부" },
        { dateStr: "02.04", homeScore: 1, awayScore: 2, winnerName: "브리스C" }
      ]
    },
    homeTeam: {
      id: "h_g011_2", name: "프레스턴", logo: "https://media.api-sports.io/football/teams/70.png", countryName: "잉글랜드 챔피언십", rank: 12,
      homeSeasonRecord: "7승 3무 4패", awaySeasonRecord: "3승 4무 6패", seasonRemainingGames: "23경기", recent3Form: "YELLOW", staminaStatus: "GREEN", minutesPlayed14d: 0, totalMarketValue: "약 4,100만 유로", totalMarketValueNum: 41000000
    },
    awayTeam: {
      id: "a_g011_2", name: "브리스C", logo: "https://media.api-sports.io/football/teams/72.png", countryName: "잉글랜드 챔피언십", rank: 10,
      homeSeasonRecord: "6승 5무 3패", awaySeasonRecord: "4승 4무 5패", seasonRemainingGames: "23경기", recent3Form: "GREEN", staminaStatus: "GREEN", minutesPlayed14d: 0, totalMarketValue: "약 4,350만 유로", totalMarketValueNum: 43500000
    },
    underOverFact: {
      last10OverRatio: 50, last10UnderRatio: 50, avgScoredGoals: 1.4, avgConcededGoals: 1.3, isFiveBack: false,
      tacticDescription: "축구 승무패 2번 경기: 원정팀 브리스C 우세 전망"
    }
  },
  {
    id: "bm-g011-260049-3",
    betmanRound: "축구 승무패 260049회차 (betman.co.kr 오피셜 슬립)",
    betmanFolder: "SEUNGMUBAE",
    betmanMatchNo: 3,
    sport: "football",
    league: "잉글랜드 챔피언십",
    countryFlag: "⚽",
    isFavorite: false,
    betmanOdds: { win: 1.55, draw: 3.45, lose: 3.80 },
    status: "SCHEDULED",
    matchTime: "09.02 (수) 03:45",
    closingTime: "09.01 (화) 23:00",
    venue: "브래몰 레인",
    lineupAlertInfo: {
      isPublished: true,
      publishedTime: "베트맨 오피셜 라인업 팩트",
      alertText: "🚨 축구 승무패 3번 경기 [셰필드U vs 볼턴W] 오피셜 선발 확정!",
      keyAbsenceNotice: "⚠️ 셰필드 유나이티드 최정예 공격진 가동"
    },
    soccerWinFactorMetrics: {
      homeXg: 1.87, awayXg: 0.95, homeXga: 0.95, awayXga: 1.87, xgMarginDiff: 0.92,
      homeBigChances: 4, awayBigChances: 1, homeBigChancesConceded: 1, awayBigChancesConceded: 4,
      homeInsideBoxShotPct: 70.0, awayInsideBoxShotPct: 35.0, homeInsideBoxShots: 10, awayInsideBoxShots: 3, homeTotalShots: 17, awayTotalShots: 7,
      homeFieldTiltPct: 64.2, awayFieldTiltPct: 35.8, fieldTiltLeader: "HOME",
      homeFirstGoalWinPct: 85.0, awayFirstGoalWinPct: 50.0, homeFirstGoalUnbeatenPct: 92.0, awayFirstGoalUnbeatenPct: 60.0,
      winFactorVerdict: "홈팀 셰필드의 압도적인 전력 및 찬스 창출력 (투표율 70.6%)",
      keyWinFactorAdvantage: "홈팀 셰필드의 압도적인 전력 및 찬스 창출력 (투표율 70.6%)"
    },
    headToHeadRecord: {
      summaryText: "과거 맞대결 2경기: [셰필드U] 2승 0무 0패",
      homeWins: 2, draws: 0, awayWins: 0,
      last5Matches: [
        { dateStr: "02.02", homeScore: 2, awayScore: 0, winnerName: "셰필드U" },
        { dateStr: "08.25", homeScore: 3, awayScore: 0, winnerName: "셰필드U" }
      ]
    },
    homeTeam: {
      id: "h_g011_3", name: "셰필드U", logo: "https://media.api-sports.io/football/teams/62.png", countryName: "잉글랜드 챔피언십", rank: 2,
      homeSeasonRecord: "9승 2무 1패", awaySeasonRecord: "6승 3무 3패", seasonRemainingGames: "22경기", recent3Form: "GREEN", staminaStatus: "GREEN", minutesPlayed14d: 0, totalMarketValue: "약 9,200만 유로", totalMarketValueNum: 92000000
    },
    awayTeam: {
      id: "a_g011_3", name: "볼턴W", logo: "https://media.api-sports.io/football/teams/68.png", countryName: "잉글랜드 챔피언십", rank: 20,
      homeSeasonRecord: "4승 2무 7패", awaySeasonRecord: "2승 1무 10패", seasonRemainingGames: "22경기", recent3Form: "RED", staminaStatus: "GREEN", minutesPlayed14d: 0, totalMarketValue: "약 2,100만 유로", totalMarketValueNum: 21000000
    },
    underOverFact: {
      last10OverRatio: 60, last10UnderRatio: 40, avgScoredGoals: 2.1, avgConcededGoals: 0.8, isFiveBack: false,
      tacticDescription: "축구 승무패 3번 경기: 셰필드U 단통 승리 유력"
    }
  },
  {
    id: "bm-g011-260049-4",
    betmanRound: "축구 승무패 260049회차 (betman.co.kr 오피셜 슬립)",
    betmanFolder: "SEUNGMUBAE",
    betmanMatchNo: 4,
    sport: "football",
    league: "잉글랜드 챔피언십",
    countryFlag: "⚽",
    isFavorite: false,
    betmanOdds: { win: 1.85, draw: 3.20, lose: 2.40 },
    status: "SCHEDULED",
    matchTime: "09.02 (수) 03:45",
    closingTime: "09.01 (화) 23:00",
    venue: "스완지닷컴 스타디움",
    lineupAlertInfo: {
      isPublished: true,
      publishedTime: "베트맨 오피셜 라인업 팩트",
      alertText: "🚨 축구 승무패 4번 경기 [스완지C vs 왓포드] 오피셜 대진 확정!",
      keyAbsenceNotice: "⚠️ 스완지 점유율 축구 vs 왓포드 역습 전술"
    },
    soccerWinFactorMetrics: {
      homeXg: 2.59, awayXg: 1.06, homeXga: 1.06, awayXga: 2.59, xgMarginDiff: 1.53,
      homeBigChances: 3, awayBigChances: 1, homeBigChancesConceded: 1, awayBigChancesConceded: 3,
      homeInsideBoxShotPct: 65.0, awayInsideBoxShotPct: 40.0, homeInsideBoxShots: 8, awayInsideBoxShots: 4, homeTotalShots: 15, awayTotalShots: 8,
      homeFieldTiltPct: 62.0, awayFieldTiltPct: 38.0, fieldTiltLeader: "HOME",
      homeFirstGoalWinPct: 82.0, awayFirstGoalWinPct: 55.0, homeFirstGoalUnbeatenPct: 90.0, awayFirstGoalUnbeatenPct: 68.0,
      winFactorVerdict: "스완지 홈 점유율 우위 및 강력한 슈팅 창출 (67.8% 지지)",
      keyWinFactorAdvantage: "스완지 홈 점유율 우위 및 강력한 슈팅 창출 (67.8% 지지)"
    },
    headToHeadRecord: {
      summaryText: "과거 맞대결 3경기: [스완지C] 1승 1무 1패",
      homeWins: 1, draws: 1, awayWins: 1,
      last5Matches: [
        { dateStr: "03.06", homeScore: 1, awayScore: 1, winnerName: "무승부" },
        { dateStr: "10.24", homeScore: 0, awayScore: 1, winnerName: "왓포드" },
        { dateStr: "12.30", homeScore: 4, awayScore: 0, winnerName: "스완지C" }
      ]
    },
    homeTeam: {
      id: "h_g011_4", name: "스완지C", logo: "https://media.api-sports.io/football/teams/74.png", countryName: "잉글랜드 챔피언십", rank: 11,
      homeSeasonRecord: "6승 4무 4패", awaySeasonRecord: "4승 2무 7패", seasonRemainingGames: "23경기", recent3Form: "GREEN", staminaStatus: "GREEN", minutesPlayed14d: 0, totalMarketValue: "약 4,800만 유로", totalMarketValueNum: 48000000
    },
    awayTeam: {
      id: "a_g011_4", name: "왓포드", logo: "https://media.api-sports.io/football/teams/38.png", countryName: "잉글랜드 챔피언십", rank: 5,
      homeSeasonRecord: "7승 3무 2패", awaySeasonRecord: "4승 1무 6패", seasonRemainingGames: "23경기", recent3Form: "YELLOW", staminaStatus: "GREEN", minutesPlayed14d: 0, totalMarketValue: "약 5,600만 유로", totalMarketValueNum: 56000000
    },
    underOverFact: {
      last10OverRatio: 50, last10UnderRatio: 50, avgScoredGoals: 1.5, avgConcededGoals: 1.2, isFiveBack: false,
      tacticDescription: "축구 승무패 4번 경기: 스완지C 홈 단통 승리 유력"
    }
  },
  {
    id: "bm-g011-260049-5",
    betmanRound: "축구 승무패 260049회차 (betman.co.kr 오피셜 슬립)",
    betmanFolder: "SEUNGMUBAE",
    betmanMatchNo: 5,
    sport: "football",
    league: "EPL",
    countryFlag: "⚽",
    isFavorite: false,
    betmanOdds: { win: 1.72, draw: 3.35, lose: 2.80 },
    status: "SCHEDULED",
    matchTime: "09.02 (수) 03:45",
    closingTime: "09.01 (화) 23:00",
    venue: "런던 스타디움",
    lineupAlertInfo: {
      isPublished: true,
      publishedTime: "베트맨 오피셜 라인업 팩트",
      alertText: "🚨 축구 승무패 5번 경기 [웨스트햄 vs 울버햄튼] 프리미어리그 빅매치!",
      keyAbsenceNotice: "⚠️ 웨스트햄 쿠두스, 보웬 선발 출격"
    },
    soccerWinFactorMetrics: {
      homeXg: 2.23, awayXg: 1.39, homeXga: 1.39, awayXga: 2.23, xgMarginDiff: 0.84,
      homeBigChances: 3, awayBigChances: 2, homeBigChancesConceded: 2, awayBigChancesConceded: 3,
      homeInsideBoxShotPct: 60.0, awayInsideBoxShotPct: 45.0, homeInsideBoxShots: 8, awayInsideBoxShots: 5, homeTotalShots: 14, awayTotalShots: 11,
      homeFieldTiltPct: 58.5, awayFieldTiltPct: 41.5, fieldTiltLeader: "HOME",
      homeFirstGoalWinPct: 80.0, awayFirstGoalWinPct: 60.0, homeFirstGoalUnbeatenPct: 88.0, awayFirstGoalUnbeatenPct: 72.0,
      winFactorVerdict: "팽팽한 공방전 속 울버햄튼 원정 역습 변수 (42.9% 지지)",
      keyWinFactorAdvantage: "팽팽한 공방전 속 울버햄튼 원정 역습 변수 (42.9% 지지)"
    },
    headToHeadRecord: {
      summaryText: "과거 맞대결 3경기: [웨스트햄] 2승 0무 1패",
      homeWins: 2, draws: 0, awayWins: 1,
      last5Matches: [
        { dateStr: "04.06", homeScore: 2, awayScore: 1, winnerName: "웨스트햄" },
        { dateStr: "12.17", homeScore: 3, awayScore: 0, winnerName: "웨스트햄" },
        { dateStr: "01.14", homeScore: 0, awayScore: 1, winnerName: "울버햄튼" }
      ]
    },
    homeTeam: {
      id: "h_g011_5", name: "웨스트햄", logo: "https://media.api-sports.io/football/teams/48.png", countryName: "EPL", rank: 9,
      homeSeasonRecord: "7승 4무 4패", awaySeasonRecord: "5승 3무 6패", seasonRemainingGames: "20경기", recent3Form: "GREEN", staminaStatus: "GREEN", minutesPlayed14d: 0, totalMarketValue: "약 4억 8,000만 유로", totalMarketValueNum: 480000000
    },
    awayTeam: {
      id: "a_g011_5", name: "울버햄튼", logo: "https://media.api-sports.io/football/teams/39.png", countryName: "EPL", rank: 17,
      homeSeasonRecord: "3승 3무 7패", awaySeasonRecord: "2승 2무 8패", seasonRemainingGames: "20경기", recent3Form: "RED", staminaStatus: "GREEN", minutesPlayed14d: 0, totalMarketValue: "약 3억 5,000만 유로", totalMarketValueNum: 350000000
    },
    underOverFact: {
      last10OverRatio: 65, last10UnderRatio: 35, avgScoredGoals: 1.8, avgConcededGoals: 1.4, isFiveBack: false,
      tacticDescription: "축구 승무패 5번 경기: 팽팽한 백중세 접전"
    }
  },
  {
    id: "bm-g011-260049-6",
    betmanRound: "축구 승무패 260049회차 (betman.co.kr 오피셜 슬립)",
    betmanFolder: "SEUNGMUBAE",
    betmanMatchNo: 6,
    sport: "football",
    league: "잉글랜드 챔피언십",
    countryFlag: "⚽",
    isFavorite: false,
    betmanOdds: { win: 2.45, draw: 3.10, lose: 1.95 },
    status: "SCHEDULED",
    matchTime: "09.02 (수) 04:00",
    closingTime: "09.01 (화) 23:00",
    venue: "세인트 앤드루스",
    lineupAlertInfo: {
      isPublished: true,
      publishedTime: "베트맨 오피셜 라인업 팩트",
      alertText: "🚨 축구 승무패 6번 경기 [버밍엄C vs 사우샘프] 오피셜 대진 확정!",
      keyAbsenceNotice: "⚠️ 사우샘프턴 정예 라인업 가동"
    },
    soccerWinFactorMetrics: {
      homeXg: 1.27, awayXg: 2.13, homeXga: 2.13, awayXga: 1.27, xgMarginDiff: -0.86,
      homeBigChances: 1, awayBigChances: 3, homeBigChancesConceded: 3, awayBigChancesConceded: 1,
      homeInsideBoxShotPct: 40.0, awayInsideBoxShotPct: 65.0, homeInsideBoxShots: 4, awayInsideBoxShots: 8, homeTotalShots: 10, awayTotalShots: 15,
      homeFieldTiltPct: 41.0, awayFieldTiltPct: 59.0, fieldTiltLeader: "AWAY",
      homeFirstGoalWinPct: 65.0, awayFirstGoalWinPct: 80.0, homeFirstGoalUnbeatenPct: 75.0, awayFirstGoalUnbeatenPct: 90.0,
      winFactorVerdict: "사우샘프턴의 빌드업 전개 및 결정력 우위 (44.4% 지지)",
      keyWinFactorAdvantage: "사우샘프턴의 빌드업 전개 및 결정력 우위 (44.4% 지지)"
    },
    headToHeadRecord: {
      summaryText: "과거 맞대결 2경기: [버밍엄C] 0승 0무 2패",
      homeWins: 0, draws: 0, awayWins: 2,
      last5Matches: [
        { dateStr: "03.02", homeScore: 3, awayScore: 4, winnerName: "사우샘프" },
        { dateStr: "10.28", homeScore: 1, awayScore: 3, winnerName: "사우샘프" }
      ]
    },
    homeTeam: {
      id: "h_g011_6", name: "버밍엄C", logo: "https://media.api-sports.io/football/teams/64.png", countryName: "잉글랜드 챔피언십", rank: 18,
      homeSeasonRecord: "4승 3무 6패", awaySeasonRecord: "2승 2무 8패", seasonRemainingGames: "23경기", recent3Form: "YELLOW", staminaStatus: "GREEN", minutesPlayed14d: 0, totalMarketValue: "약 2,800만 유로", totalMarketValueNum: 28000000
    },
    awayTeam: {
      id: "a_g011_6", name: "사우샘프", logo: "https://media.api-sports.io/football/teams/41.png", countryName: "잉글랜드 챔피언십", rank: 3,
      homeSeasonRecord: "8승 3무 2패", awaySeasonRecord: "7승 2무 3패", seasonRemainingGames: "22경기", recent3Form: "GREEN", staminaStatus: "GREEN", minutesPlayed14d: 0, totalMarketValue: "약 1억 2,000만 유로", totalMarketValueNum: 120000000
    },
    underOverFact: {
      last10OverRatio: 55, last10UnderRatio: 45, avgScoredGoals: 1.6, avgConcededGoals: 1.5, isFiveBack: false,
      tacticDescription: "축구 승무패 6번 경기: 사우샘프턴 원정 승리 유력"
    }
  },
  {
    id: "bm-g011-260049-7",
    betmanRound: "축구 승무패 260049회차 (betman.co.kr 오피셜 슬립)",
    betmanFolder: "SEUNGMUBAE",
    betmanMatchNo: 7,
    sport: "football",
    league: "잉글랜드 챔피언십",
    countryFlag: "⚽",
    isFavorite: false,
    betmanOdds: { win: 2.10, draw: 3.15, lose: 2.15 },
    status: "SCHEDULED",
    matchTime: "09.02 (수) 04:00",
    closingTime: "09.01 (화) 23:00",
    venue: "bet365 스타디움",
    lineupAlertInfo: {
      isPublished: true,
      publishedTime: "베트맨 오피셜 라인업 팩트",
      alertText: "🚨 축구 승무패 7번 경기 [스토크C vs 노리치C] 오피셜 대진 확정!",
      keyAbsenceNotice: "⚠️ 스토크 홈 수비 조직력 vs 노리치 화력"
    },
    soccerWinFactorMetrics: {
      homeXg: 1.99, awayXg: 1.06, homeXga: 1.06, awayXga: 1.99, xgMarginDiff: 0.93,
      homeBigChances: 2, awayBigChances: 3, homeBigChancesConceded: 3, awayBigChancesConceded: 2,
      homeInsideBoxShotPct: 48.0, awayInsideBoxShotPct: 55.0, homeInsideBoxShots: 5, awayInsideBoxShots: 7, homeTotalShots: 11, awayTotalShots: 13,
      homeFieldTiltPct: 48.0, awayFieldTiltPct: 52.0, fieldTiltLeader: "AWAY",
      homeFirstGoalWinPct: 70.0, awayFirstGoalWinPct: 72.0, homeFirstGoalUnbeatenPct: 80.0, awayFirstGoalUnbeatenPct: 82.0,
      winFactorVerdict: "노리치C 원정 화력 우세 (투표율 57.3%)",
      keyWinFactorAdvantage: "노리치C 원정 화력 우세 (투표율 57.3%)"
    },
    headToHeadRecord: {
      summaryText: "과거 맞대결 3경기: [스토크C] 0승 1무 2패",
      homeWins: 0, draws: 1, awayWins: 2,
      last5Matches: [
        { dateStr: "03.16", homeScore: 0, awayScore: 3, winnerName: "노리치C" },
        { dateStr: "09.16", homeScore: 0, awayScore: 1, winnerName: "노리치C" },
        { dateStr: "03.18", homeScore: 0, awayScore: 0, winnerName: "무승부" }
      ]
    },
    homeTeam: {
      id: "h_g011_7", name: "스토크C", logo: "https://media.api-sports.io/football/teams/75.png", countryName: "잉글랜드 챔피언십", rank: 15,
      homeSeasonRecord: "5승 3무 5패", awaySeasonRecord: "3승 2무 7패", seasonRemainingGames: "23경기", recent3Form: "YELLOW", staminaStatus: "GREEN", minutesPlayed14d: 0, totalMarketValue: "약 3,600만 유로", totalMarketValueNum: 36000000
    },
    awayTeam: {
      id: "a_g011_7", name: "노리치C", logo: "https://media.api-sports.io/football/teams/71.png", countryName: "잉글랜드 챔피언십", rank: 8,
      homeSeasonRecord: "6승 4무 3패", awaySeasonRecord: "4승 3무 5패", seasonRemainingGames: "23경기", recent3Form: "GREEN", staminaStatus: "GREEN", minutesPlayed14d: 0, totalMarketValue: "약 5,200만 유로", totalMarketValueNum: 52000000
    },
    underOverFact: {
      last10OverRatio: 45, last10UnderRatio: 55, avgScoredGoals: 1.3, avgConcededGoals: 1.2, isFiveBack: false,
      tacticDescription: "축구 승무패 7번 경기: 노리치C 원정승 우세"
    }
  },
  {
    id: "bm-g011-260049-8",
    betmanRound: "축구 승무패 260049회차 (betman.co.kr 오피셜 슬립)",
    betmanFolder: "SEUNGMUBAE",
    betmanMatchNo: 8,
    sport: "football",
    league: "J리그",
    countryFlag: "⚽",
    isFavorite: false,
    betmanOdds: { win: 2.65, draw: 3.10, lose: 1.85 },
    status: "SCHEDULED",
    matchTime: "09.02 (수) 19:00",
    closingTime: "09.01 (화) 23:00",
    venue: "아지노모토 스타디움",
    lineupAlertInfo: {
      isPublished: true,
      publishedTime: "베트맨 오피셜 라인업 팩트",
      alertText: "🚨 축구 승무패 8번 경기 [도쿄베르 vs 비셀고베] J리그 빅매치!",
      keyAbsenceNotice: "⚠️ 비셀 고베 최정예 라인업 출격"
    },
    soccerWinFactorMetrics: {
      homeXg: 1.49, awayXg: 1.77, homeXga: 1.77, awayXga: 1.49, xgMarginDiff: -0.28,
      homeBigChances: 1, awayBigChances: 3, homeBigChancesConceded: 3, awayBigChancesConceded: 1,
      homeInsideBoxShotPct: 42.0, awayInsideBoxShotPct: 62.0, homeInsideBoxShots: 4, awayInsideBoxShots: 8, homeTotalShots: 10, awayTotalShots: 15,
      homeFieldTiltPct: 44.0, awayFieldTiltPct: 56.0, fieldTiltLeader: "AWAY",
      homeFirstGoalWinPct: 70.0, awayFirstGoalWinPct: 85.0, homeFirstGoalUnbeatenPct: 78.0, awayFirstGoalUnbeatenPct: 92.0,
      winFactorVerdict: "비셀 고베의 강력한 전방 압박 및 우승 동기부여 (72.5% 압도적 지지)",
      keyWinFactorAdvantage: "비셀 고베의 강력한 전방 압박 및 우승 동기부여 (72.5% 압도적 지지)"
    },
    headToHeadRecord: {
      summaryText: "과거 맞대결 2경기: [도쿄베르] 1승 0무 1패",
      homeWins: 1, draws: 0, awayWins: 1,
      last5Matches: [
        { dateStr: "05.26", homeScore: 1, awayScore: 0, winnerName: "도쿄베르" },
        { dateStr: "03.09", homeScore: 0, awayScore: 1, winnerName: "비셀고베" }
      ]
    },
    homeTeam: {
      id: "h_g011_8", name: "도쿄베르", logo: "https://media.api-sports.io/football/teams/297.png", countryName: "J리그", rank: 6,
      homeSeasonRecord: "7승 6무 3패", awaySeasonRecord: "6승 4무 5패", seasonRemainingGames: "9경기", recent3Form: "GREEN", staminaStatus: "GREEN", minutesPlayed14d: 0, totalMarketValue: "약 1,450만 유로", totalMarketValueNum: 14500000
    },
    awayTeam: {
      id: "a_g011_8", name: "비셀고베", logo: "https://media.api-sports.io/football/teams/294.png", countryName: "J리그", rank: 2,
      homeSeasonRecord: "10승 3무 2패", awaySeasonRecord: "8승 4무 3패", seasonRemainingGames: "9경기", recent3Form: "GREEN", staminaStatus: "GREEN", minutesPlayed14d: 0, totalMarketValue: "약 2,300만 유로", totalMarketValueNum: 23000000
    },
    underOverFact: {
      last10OverRatio: 50, last10UnderRatio: 50, avgScoredGoals: 1.6, avgConcededGoals: 1.1, isFiveBack: false,
      tacticDescription: "축구 승무패 8번 경기: 비셀 고베 단통 승리 유력"
    }
  },
  {
    id: "bm-g011-260049-9",
    betmanRound: "축구 승무패 260049회차 (betman.co.kr 오피셜 슬립)",
    betmanFolder: "SEUNGMUBAE",
    betmanMatchNo: 9,
    sport: "football",
    league: "J리그",
    countryFlag: "⚽",
    isFavorite: false,
    betmanOdds: { win: 1.90, draw: 3.15, lose: 2.45 },
    status: "SCHEDULED",
    matchTime: "09.02 (수) 19:00",
    closingTime: "09.01 (화) 23:00",
    venue: "마치다 GION 스타디움",
    lineupAlertInfo: {
      isPublished: true,
      publishedTime: "베트맨 오피셜 라인업 팩트",
      alertText: "🚨 축구 승무패 9번 경기 [마치다Z vs 가와사키] 오피셜 대진 확정!",
      keyAbsenceNotice: "⚠️ 마치다 철벽 수비 vs 가와사키 패스 축구"
    },
    soccerWinFactorMetrics: {
      homeXg: 2.11, awayXg: 1.06, homeXga: 1.06, awayXga: 2.11, xgMarginDiff: 1.05,
      homeBigChances: 3, awayBigChances: 2, homeBigChancesConceded: 2, awayBigChancesConceded: 3,
      homeInsideBoxShotPct: 56.0, awayInsideBoxShotPct: 48.0, homeInsideBoxShots: 7, awayInsideBoxShots: 5, homeTotalShots: 13, awayTotalShots: 11,
      homeFieldTiltPct: 52.0, awayFieldTiltPct: 48.0, fieldTiltLeader: "HOME",
      homeFirstGoalWinPct: 85.0, awayFirstGoalWinPct: 65.0, homeFirstGoalUnbeatenPct: 92.0, awayFirstGoalUnbeatenPct: 75.0,
      winFactorVerdict: "마치다의 세트피스 득점력 및 피지컬 우위 (52.9% 지지)",
      keyWinFactorAdvantage: "마치다의 세트피스 득점력 및 피지컬 우위 (52.9% 지지)"
    },
    headToHeadRecord: {
      summaryText: "과거 맞대결 1경기: [마치다Z] 1승 0무 0패",
      homeWins: 1, draws: 0, awayWins: 0,
      last5Matches: [
        { dateStr: "04.07", homeScore: 1, awayScore: 0, winnerName: "마치다Z" }
      ]
    },
    homeTeam: {
      id: "h_g011_9", name: "마치다Z", logo: "https://media.api-sports.io/football/teams/305.png", countryName: "J리그", rank: 1,
      homeSeasonRecord: "11승 2무 2패", awaySeasonRecord: "8승 4무 3패", seasonRemainingGames: "9경기", recent3Form: "GREEN", staminaStatus: "GREEN", minutesPlayed14d: 0, totalMarketValue: "약 1,800만 유로", totalMarketValueNum: 18000000
    },
    awayTeam: {
      id: "a_g011_9", name: "가와사키", logo: "https://media.api-sports.io/football/teams/296.png", countryName: "J리그", rank: 10,
      homeSeasonRecord: "6승 4무 4패", awaySeasonRecord: "3승 5무 7패", seasonRemainingGames: "9경기", recent3Form: "YELLOW", staminaStatus: "GREEN", minutesPlayed14d: 0, totalMarketValue: "약 2,100만 유로", totalMarketValueNum: 21000000
    },
    underOverFact: {
      last10OverRatio: 50, last10UnderRatio: 50, avgScoredGoals: 1.6, avgConcededGoals: 1.2, isFiveBack: false,
      tacticDescription: "축구 승무패 9번 경기: 선두 마치다Z 승리 우세"
    }
  },
  {
    id: "bm-g011-260049-10",
    betmanRound: "축구 승무패 260049회차 (betman.co.kr 오피셜 슬립)",
    betmanFolder: "SEUNGMUBAE",
    betmanMatchNo: 10,
    sport: "football",
    league: "J리그",
    countryFlag: "⚽",
    isFavorite: false,
    betmanOdds: { win: 2.20, draw: 3.10, lose: 2.05 },
    status: "SCHEDULED",
    matchTime: "09.02 (수) 19:00",
    closingTime: "09.01 (화) 23:00",
    venue: "IAI 스타디움 니혼다이라",
    lineupAlertInfo: {
      isPublished: true,
      publishedTime: "베트맨 오피셜 라인업 팩트",
      alertText: "🚨 축구 승무패 10번 경기 [시미즈S vs FC도쿄] 오피셜 대진 확정!",
      keyAbsenceNotice: "⚠️ FC도쿄 원정 집중력 우위"
    },
    soccerWinFactorMetrics: {
      homeXg: 1.16, awayXg: 1.77, homeXga: 1.77, awayXga: 1.16, xgMarginDiff: -0.61,
      homeBigChances: 1, awayBigChances: 3, homeBigChancesConceded: 3, awayBigChancesConceded: 1,
      homeInsideBoxShotPct: 45.0, awayInsideBoxShotPct: 60.0, homeInsideBoxShots: 4, awayInsideBoxShots: 7, homeTotalShots: 10, awayTotalShots: 13,
      homeFieldTiltPct: 46.0, awayFieldTiltPct: 54.0, fieldTiltLeader: "AWAY",
      homeFirstGoalWinPct: 68.0, awayFirstGoalWinPct: 78.0, homeFirstGoalUnbeatenPct: 76.0, awayFirstGoalUnbeatenPct: 86.0,
      winFactorVerdict: "FC도쿄 원정 승리 우세 (68.7% 압도적 지지)",
      keyWinFactorAdvantage: "FC도쿄 원정 승리 우세 (68.7% 압도적 지지)"
    },
    headToHeadRecord: {
      summaryText: "과거 맞대결 2경기: [시미즈S] 1승 0무 1패",
      homeWins: 1, draws: 0, awayWins: 1,
      last5Matches: [
        { dateStr: "05.15", homeScore: 1, awayScore: 2, winnerName: "FC도쿄" },
        { dateStr: "11.05", homeScore: 1, awayScore: 0, winnerName: "시미즈S" }
      ]
    },
    homeTeam: {
      id: "h_g011_10", name: "시미즈S", logo: "https://media.api-sports.io/football/teams/282.png", countryName: "J리그", rank: 8,
      homeSeasonRecord: "7승 4무 3패", awaySeasonRecord: "4승 3무 7패", seasonRemainingGames: "9경기", recent3Form: "GREEN", staminaStatus: "GREEN", minutesPlayed14d: 0, totalMarketValue: "약 1,550만 유로", totalMarketValueNum: 15500000
    },
    awayTeam: {
      id: "a_g011_10", name: "FC도쿄", logo: "https://media.api-sports.io/football/teams/284.png", countryName: "J리그", rank: 9,
      homeSeasonRecord: "6승 5무 4패", awaySeasonRecord: "4승 4무 6패", seasonRemainingGames: "9경기", recent3Form: "YELLOW", staminaStatus: "GREEN", minutesPlayed14d: 0, totalMarketValue: "약 1,720만 유로", totalMarketValueNum: 17200000
    },
    underOverFact: {
      last10OverRatio: 45, last10UnderRatio: 55, avgScoredGoals: 1.4, avgConcededGoals: 1.3, isFiveBack: false,
      tacticDescription: "축구 승무패 10번 경기: FC도쿄 원정승 우세"
    }
  },
  {
    id: "bm-g011-260049-11",
    betmanRound: "축구 승무패 260049회차 (betman.co.kr 오피셜 슬립)",
    betmanFolder: "SEUNGMUBAE",
    betmanMatchNo: 11,
    sport: "football",
    league: "J리그",
    countryFlag: "⚽",
    isFavorite: false,
    betmanOdds: { win: 1.95, draw: 3.10, lose: 2.30 },
    status: "SCHEDULED",
    matchTime: "09.02 (수) 19:00",
    closingTime: "09.01 (화) 23:00",
    venue: "요도코 사쿠라 스타디움",
    lineupAlertInfo: {
      isPublished: true,
      publishedTime: "베트맨 오피셜 라인업 팩트",
      alertText: "🚨 축구 승무패 11번 경기 [C오사카 vs 가시와R] 오피셜 대진 확정!",
      keyAbsenceNotice: "⚠️ 세레소 오사카 홈 화력 집중"
    },
    soccerWinFactorMetrics: {
      homeXg: 2.35, awayXg: 1.17, homeXga: 1.17, awayXga: 2.35, xgMarginDiff: 1.18,
      homeBigChances: 3, awayBigChances: 2, homeBigChancesConceded: 2, awayBigChancesConceded: 3,
      homeInsideBoxShotPct: 58.0, awayInsideBoxShotPct: 45.0, homeInsideBoxShots: 8, awayInsideBoxShots: 4, homeTotalShots: 14, awayTotalShots: 10,
      homeFieldTiltPct: 55.0, awayFieldTiltPct: 45.0, fieldTiltLeader: "HOME",
      homeFirstGoalWinPct: 78.0, awayFirstGoalWinPct: 60.0, homeFirstGoalUnbeatenPct: 86.0, awayFirstGoalUnbeatenPct: 72.0,
      winFactorVerdict: "가시와R 원정 승리 및 무승부 경합 (45.5% 지지)",
      keyWinFactorAdvantage: "가시와R 원정 승리 및 무승부 경합 (45.5% 지지)"
    },
    headToHeadRecord: {
      summaryText: "과거 맞대결 2경기: [C오사카] 1승 1무 0패",
      homeWins: 1, draws: 1, awayWins: 0,
      last5Matches: [
        { dateStr: "04.03", homeScore: 1, awayScore: 1, winnerName: "무승부" },
        { dateStr: "09.30", homeScore: 2, awayScore: 0, winnerName: "C오사카" }
      ]
    },
    homeTeam: {
      id: "h_g011_11", name: "C오사카", logo: "https://media.api-sports.io/football/teams/281.png", countryName: "J리그", rank: 7,
      homeSeasonRecord: "7승 4무 3패", awaySeasonRecord: "4승 5무 5패", seasonRemainingGames: "9경기", recent3Form: "GREEN", staminaStatus: "GREEN", minutesPlayed14d: 0, totalMarketValue: "약 1,750만 유로", totalMarketValueNum: 17500000
    },
    awayTeam: {
      id: "a_g011_11", name: "가시와R", logo: "https://media.api-sports.io/football/teams/285.png", countryName: "J리그", rank: 14,
      homeSeasonRecord: "5승 4무 5패", awaySeasonRecord: "3승 5무 7패", seasonRemainingGames: "9경기", recent3Form: "RED", staminaStatus: "GREEN", minutesPlayed14d: 0, totalMarketValue: "약 1,500만 유로", totalMarketValueNum: 15000000
    },
    underOverFact: {
      last10OverRatio: 50, last10UnderRatio: 50, avgScoredGoals: 1.5, avgConcededGoals: 1.3, isFiveBack: false,
      tacticDescription: "축구 승무패 11번 경기: 가시와R 원정 우세 및 무승부 변수"
    }
  },
  {
    id: "bm-g011-260049-12",
    betmanRound: "축구 승무패 260049회차 (betman.co.kr 오피셜 슬립)",
    betmanFolder: "SEUNGMUBAE",
    betmanMatchNo: 12,
    sport: "football",
    league: "J리그",
    countryFlag: "⚽",
    isFavorite: false,
    betmanOdds: { win: 1.62, draw: 3.35, lose: 3.10 },
    status: "SCHEDULED",
    matchTime: "09.02 (수) 19:00",
    closingTime: "09.01 (화) 23:00",
    venue: "에디온 피스 윙 히로시마",
    lineupAlertInfo: {
      isPublished: true,
      publishedTime: "베트맨 오피셜 라인업 팩트",
      alertText: "🚨 축구 승무패 12번 경기 [산프히로 vs 나고야G] 오피셜 대진 확정!",
      keyAbsenceNotice: "⚠️ 산프레체 히로시마 신구장 압도적 화력"
    },
    soccerWinFactorMetrics: {
      homeXg: 2.71, awayXg: 0.95, homeXga: 0.95, awayXga: 2.71, xgMarginDiff: 1.76,
      homeBigChances: 4, awayBigChances: 1, homeBigChancesConceded: 1, awayBigChancesConceded: 4,
      homeInsideBoxShotPct: 68.0, awayInsideBoxShotPct: 36.0, homeInsideBoxShots: 10, awayInsideBoxShots: 3, homeTotalShots: 16, awayTotalShots: 8,
      homeFieldTiltPct: 63.5, awayFieldTiltPct: 36.5, fieldTiltLeader: "HOME",
      homeFirstGoalWinPct: 88.0, awayFirstGoalWinPct: 50.0, homeFirstGoalUnbeatenPct: 95.0, awayFirstGoalUnbeatenPct: 62.0,
      winFactorVerdict: "산프레체의 폭발적인 공격 전환 및 압도적 전력 (76.7% 압도적 지지)",
      keyWinFactorAdvantage: "산프레체의 폭발적인 공격 전환 및 압도적 전력 (76.7% 압도적 지지)"
    },
    headToHeadRecord: {
      summaryText: "과거 맞대결 2경기: [산프히로] 1승 0무 1패",
      homeWins: 1, draws: 0, awayWins: 1,
      last5Matches: [
        { dateStr: "05.06", homeScore: 2, awayScore: 3, winnerName: "나고야G" },
        { dateStr: "09.30", homeScore: 3, awayScore: 1, winnerName: "산프히로" }
      ]
    },
    homeTeam: {
      id: "h_g011_12", name: "산프히로", logo: "https://media.api-sports.io/football/teams/290.png", countryName: "J리그", rank: 3,
      homeSeasonRecord: "9승 4무 1패", awaySeasonRecord: "6승 5무 3패", seasonRemainingGames: "9경기", recent3Form: "GREEN", staminaStatus: "GREEN", minutesPlayed14d: 0, totalMarketValue: "약 2,200만 유로", totalMarketValueNum: 22000000
    },
    awayTeam: {
      id: "a_g011_12", name: "나고야G", logo: "https://media.api-sports.io/football/teams/289.png", countryName: "J리그", rank: 12,
      homeSeasonRecord: "5승 3무 6패", awaySeasonRecord: "4승 2무 8패", seasonRemainingGames: "9경기", recent3Form: "RED", staminaStatus: "GREEN", minutesPlayed14d: 0, totalMarketValue: "약 1,600만 유로", totalMarketValueNum: 16000000
    },
    underOverFact: {
      last10OverRatio: 60, last10UnderRatio: 40, avgScoredGoals: 2.0, avgConcededGoals: 1.0, isFiveBack: false,
      tacticDescription: "축구 승무패 12번 경기: 산프레체 히로시마 단통 승리 유력"
    }
  },
  {
    id: "bm-g011-260049-13",
    betmanRound: "축구 승무패 260049회차 (betman.co.kr 오피셜 슬립)",
    betmanFolder: "SEUNGMUBAE",
    betmanMatchNo: 13,
    sport: "football",
    league: "J리그",
    countryFlag: "⚽",
    isFavorite: false,
    betmanOdds: { win: 2.10, draw: 3.15, lose: 2.15 },
    status: "SCHEDULED",
    matchTime: "09.02 (수) 19:00",
    closingTime: "09.01 (화) 23:00",
    venue: "베스트 덴키 스타디움",
    lineupAlertInfo: {
      isPublished: true,
      publishedTime: "베트맨 오피셜 라인업 팩트",
      alertText: "🚨 축구 승무패 13번 경기 [후쿠오카 vs 우라와R] 오피셜 대진 확정!",
      keyAbsenceNotice: "⚠️ 후쿠오카 홈 질식 수비 vs 우라와 공격진"
    },
    soccerWinFactorMetrics: {
      homeXg: 1.65, awayXg: 1.25, homeXga: 1.25, awayXga: 1.65, xgMarginDiff: 0.40,
      homeBigChances: 3, awayBigChances: 1, homeBigChancesConceded: 1, awayBigChancesConceded: 3,
      homeInsideBoxShotPct: 55.0, awayInsideBoxShotPct: 45.0, homeInsideBoxShots: 7, awayInsideBoxShots: 4, homeTotalShots: 13, awayTotalShots: 10,
      homeFieldTiltPct: 52.0, awayFieldTiltPct: 48.0, fieldTiltLeader: "HOME",
      homeFirstGoalWinPct: 78.0, awayFirstGoalWinPct: 62.0, homeFirstGoalUnbeatenPct: 86.0, awayFirstGoalUnbeatenPct: 74.0,
      winFactorVerdict: "후쿠오카 홈 수비 조직력 및 세트피스 우위 (45.0% 지지)",
      keyWinFactorAdvantage: "후쿠오카 홈 수비 조직력 및 세트피스 우위 (45.0% 지지)"
    },
    headToHeadRecord: {
      summaryText: "과거 맞대결 3경기: [후쿠오카] 1승 1무 1패",
      homeWins: 1, draws: 1, awayWins: 1,
      last5Matches: [
        { dateStr: "03.30", homeScore: 2, awayScore: 1, winnerName: "후쿠오카" },
        { dateStr: "11.25", homeScore: 0, awayScore: 0, winnerName: "무승부" },
        { dateStr: "04.29", homeScore: 0, awayScore: 1, winnerName: "우라와R" }
      ]
    },
    homeTeam: {
      id: "h_g011_13", name: "후쿠오카", logo: "https://media.api-sports.io/football/teams/300.png", countryName: "J리그", rank: 9,
      homeSeasonRecord: "6승 5무 3패", awaySeasonRecord: "4승 4무 6패", seasonRemainingGames: "9경기", recent3Form: "GREEN", staminaStatus: "GREEN", minutesPlayed14d: 0, totalMarketValue: "약 1,400만 유로", totalMarketValueNum: 14000000
    },
    awayTeam: {
      id: "a_g011_13", name: "우라와R", logo: "https://media.api-sports.io/football/teams/291.png", countryName: "J리그", rank: 11,
      homeSeasonRecord: "6승 3무 5패", awaySeasonRecord: "3승 5무 6패", seasonRemainingGames: "9경기", recent3Form: "YELLOW", staminaStatus: "GREEN", minutesPlayed14d: 0, totalMarketValue: "약 2,150만 유로", totalMarketValueNum: 21500000
    },
    underOverFact: {
      last10OverRatio: 40, last10UnderRatio: 60, avgScoredGoals: 1.3, avgConcededGoals: 1.1, isFiveBack: false,
      tacticDescription: "축구 승무패 13번 경기: 후쿠오카 홈 우세 전망"
    }
  },
  {
    id: "bm-g011-260049-14",
    betmanRound: "축구 승무패 260049회차 (betman.co.kr 오피셜 슬립)",
    betmanFolder: "SEUNGMUBAE",
    betmanMatchNo: 14,
    sport: "football",
    league: "J리그",
    countryFlag: "⚽",
    isFavorite: false,
    betmanOdds: { win: 2.30, draw: 3.10, lose: 1.95 },
    status: "SCHEDULED",
    matchTime: "09.02 (수) 19:00",
    closingTime: "09.01 (화) 23:00",
    venue: "트랜스코스모스 스타디움 나가사키",
    lineupAlertInfo: {
      isPublished: true,
      publishedTime: "베트맨 오피셜 라인업 팩트",
      alertText: "🚨 축구 승무패 14번 최종전 [V바렌나 vs G오사카] 오피셜 대진 확정!",
      keyAbsenceNotice: "⚠️ 감바 오사카 최정예 라인업 출격"
    },
    soccerWinFactorMetrics: {
      homeXg: 1.15, awayXg: 1.95, homeXga: 1.95, awayXga: 1.15, xgMarginDiff: -0.80,
      homeBigChances: 1, awayBigChances: 3, homeBigChancesConceded: 3, awayBigChancesConceded: 1,
      homeInsideBoxShotPct: 40.0, awayInsideBoxShotPct: 62.0, homeInsideBoxShots: 4, awayInsideBoxShots: 8, homeTotalShots: 10, awayTotalShots: 15,
      homeFieldTiltPct: 42.0, awayFieldTiltPct: 58.0, fieldTiltLeader: "AWAY",
      homeFirstGoalWinPct: 65.0, awayFirstGoalWinPct: 82.0, homeFirstGoalUnbeatenPct: 75.0, awayFirstGoalUnbeatenPct: 90.0,
      winFactorVerdict: "감바 오사카의 원정 빌드업 및 공격력 우위 (57.5% 지지)",
      keyWinFactorAdvantage: "감바 오사카의 원정 빌드업 및 공격력 우위 (57.5% 지지)"
    },
    headToHeadRecord: {
      summaryText: "과거 맞대결 2경기: [V바렌나] 0승 0무 2패",
      homeWins: 0, draws: 0, awayWins: 2,
      last5Matches: [
        { dateStr: "04.14", homeScore: 1, awayScore: 2, winnerName: "G오사카" },
        { dateStr: "09.22", homeScore: 0, awayScore: 2, winnerName: "G오사카" }
      ]
    },
    homeTeam: {
      id: "h_g011_14", name: "V바렌나", logo: "https://media.api-sports.io/football/teams/307.png", countryName: "J리그", rank: 15,
      homeSeasonRecord: "4승 3무 7패", awaySeasonRecord: "3승 3무 8패", seasonRemainingGames: "9경기", recent3Form: "YELLOW", staminaStatus: "GREEN", minutesPlayed14d: 0, totalMarketValue: "약 1,150만 유로", totalMarketValueNum: 11500000
    },
    awayTeam: {
      id: "a_g011_14", name: "G오사카", logo: "https://media.api-sports.io/football/teams/286.png", countryName: "J리그", rank: 4,
      homeSeasonRecord: "8승 4무 2패", awaySeasonRecord: "6승 3무 5패", seasonRemainingGames: "9경기", recent3Form: "GREEN", staminaStatus: "GREEN", minutesPlayed14d: 0, totalMarketValue: "약 2,100만 유로", totalMarketValueNum: 21000000
    },
    underOverFact: {
      last10OverRatio: 50, last10UnderRatio: 50, avgScoredGoals: 1.5, avgConcededGoals: 1.2, isFiveBack: false,
      tacticDescription: "축구 승무패 14번 경기: 감바 오사카 원정승 유력"
    }
  }
];
