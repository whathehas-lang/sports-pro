import type { Match } from '../types/sports';

export const OFFICIAL_G024_MATCHES: Match[] = [
  {
    id: "bm-g024-260064-1",
    betmanRound: "야구 승1패 260064회차 (betman.co.kr 오피셜 슬립)",
    betmanFolder: "SEUNG1PAE",
    betmanMatchNo: 1,
    sport: "baseball",
    league: "KBO",
    countryFlag: "⚾",
    isFavorite: true,
    betmanOdds: {
      win: 1.76,
      draw: 2.40,
      lose: 1.90
    },
    status: "SCHEDULED",
    matchTime: "09.01 (화) 18:30",
    closingTime: "09.01 (화) 18:30",
    venue: "잠실야구장",
    lineupAlertInfo: {
      isPublished: true,
      publishedTime: "베트맨 오피셜 라인업 팩트",
      alertText: "🚨 야구 승1패 1번 경기 [두산 vs LG] 오피셜 선발 확정! (잭로그 vs 임찬규)",
      keyAbsenceNotice: "⚠️ 야구 승1패 1번 경기: 잠실 라이벌전 선발 맞대결 확정"
    },
    headToHeadRecord: {
      homeWins: 3,
      draws: 0,
      awayWins: 2,
      last5Matches: [
        { date: "08.15", homeTeam: "두산 베어스", awayTeam: "LG 트윈스", score: "6:4", result: "승" },
        { date: "08.02", homeTeam: "LG 트윈스", awayTeam: "두산 베어스", score: "3:5", result: "승" },
        { date: "07.18", homeTeam: "두산 베어스", awayTeam: "LG 트윈스", score: "2:7", result: "패" },
        { date: "06.24", homeTeam: "LG 트윈스", awayTeam: "두산 베어스", score: "4:1", result: "패" },
        { date: "05.30", homeTeam: "두산 베어스", awayTeam: "LG 트윈스", score: "8:3", result: "승" }
      ]
    },
    homeTeam: {
      id: "h_g024_1",
      name: "두산",
      logo: "https://media.api-sports.io/baseball/teams/91.png",
      countryName: "KBO",
      rank: 4,
      homeSeasonRecord: "34승 2무 28패",
      awaySeasonRecord: "31승 1무 32패",
      seasonRemainingGames: "17경기",
      recent3Form: "GREEN",
      staminaStatus: "GREEN",
      minutesPlayed14d: 0,
      totalMarketValue: "오피셜 팀",
      totalMarketValueNum: 1,
      starterPitcherInfo: {
        name: "잭로그",
        number: 40,
        throwsHand: "R",
        era: "3.45",
        whip: "1.20",
        wins: 8,
        losses: 4,
        inningsPitched: "112.0",
        strikeouts: 105,
        vsOpponentLogs: [
          {
            dateStr: "08.15",
            opponentName: "LG",
            innings: "6.1",
            earnedRuns: 2,
            runs: 2,
            result: "승",
            decision: "승리투수"
          }
        ]
      },
      recentGamesLog: [
        { date: "08.31", opponent: "SSG", score: "4:2", result: "승", isHome: true },
        { date: "08.30", opponent: "SSG", score: "1:5", result: "패", isHome: true },
        { date: "08.28", opponent: "한화", score: "6:3", result: "승", isHome: false },
        { date: "08.27", opponent: "한화", score: "2:4", result: "패", isHome: false },
        { date: "08.25", opponent: "KT", score: "5:3", result: "승", isHome: true }
      ]
    },
    awayTeam: {
      id: "a_g024_1",
      name: "LG",
      logo: "https://media.api-sports.io/baseball/teams/93.png",
      countryName: "KBO",
      rank: 3,
      homeSeasonRecord: "36승 2무 26패",
      awaySeasonRecord: "32승 1무 31패",
      seasonRemainingGames: "16경기",
      recent3Form: "YELLOW",
      staminaStatus: "GREEN",
      minutesPlayed14d: 0,
      totalMarketValue: "오피셜 팀",
      totalMarketValueNum: 2,
      starterPitcherInfo: {
        name: "임찬규",
        number: 1,
        throwsHand: "R",
        era: "3.83",
        whip: "1.28",
        wins: 10,
        losses: 6,
        inningsPitched: "134.0",
        strikeouts: 116,
        vsOpponentLogs: [
          {
            dateStr: "08.15",
            opponentName: "두산",
            innings: "5.2",
            earnedRuns: 4,
            runs: 4,
            result: "패",
            decision: "패전투수"
          }
        ]
      },
      recentGamesLog: [
        { date: "08.31", opponent: "KIA", score: "3:4", result: "패", isHome: false },
        { date: "08.30", opponent: "KIA", score: "7:2", result: "승", isHome: false },
        { date: "08.28", opponent: "삼성", score: "5:1", result: "승", isHome: true },
        { date: "08.27", opponent: "삼성", score: "4:6", result: "패", isHome: true },
        { date: "08.25", opponent: "NC", score: "6:2", result: "승", isHome: false }
      ]
    },
    underOverFact: {
      last10OverRatio: 50,
      last10UnderRatio: 50,
      avgScoredGoals: 4.8,
      avgConcededGoals: 4.3,
      isFiveBack: false,
      tacticDescription: "야구 승1패 1번 경기: 잠실 라이벌 매치업"
    },
    isPitcherAnnounced: true,
    isDataCheckingPending: false
  },
  {
    id: "bm-g024-260064-2",
    betmanRound: "야구 승1패 260064회차 (betman.co.kr 오피셜 슬립)",
    betmanFolder: "SEUNG1PAE",
    betmanMatchNo: 2,
    sport: "baseball",
    league: "KBO",
    countryFlag: "⚾",
    isFavorite: false,
    betmanOdds: {
      win: 1.68,
      draw: 2.50,
      lose: 2.05
    },
    status: "SCHEDULED",
    matchTime: "09.01 (화) 18:30",
    closingTime: "09.01 (화) 18:30",
    venue: "대구삼성라이온즈파크",
    lineupAlertInfo: {
      isPublished: true,
      publishedTime: "베트맨 오피셜 라인업 팩트",
      alertText: "🚨 야구 승1패 2번 경기 [삼성 vs 롯데] 오피셜 선발 확정! (보스 vs 로드리게스)",
      keyAbsenceNotice: "⚠️ 야구 승1패 2번 경기: 클래식 시리즈 선발 맞대결 확정"
    },
    headToHeadRecord: {
      homeWins: 4,
      draws: 0,
      awayWins: 1,
      last5Matches: [
        { date: "08.18", homeTeam: "삼성 라이온즈", awayTeam: "롯데 자이언츠", score: "7:2", result: "승" },
        { date: "08.06", homeTeam: "롯데 자이언츠", awayTeam: "삼성 라이온즈", score: "3:4", result: "승" },
        { date: "07.21", homeTeam: "삼성 라이온즈", awayTeam: "롯데 자이언츠", score: "5:1", result: "승" },
        { date: "06.12", homeTeam: "롯데 자이언츠", awayTeam: "삼성 라이온즈", score: "6:2", result: "패" },
        { date: "05.15", homeTeam: "삼성 라이온즈", awayTeam: "롯데 자이언츠", score: "9:4", result: "승" }
      ]
    },
    homeTeam: {
      id: "h_g024_2",
      name: "삼성",
      logo: "https://media.api-sports.io/baseball/teams/95.png",
      countryName: "KBO",
      rank: 2,
      homeSeasonRecord: "38승 1무 25패",
      awaySeasonRecord: "31승 1무 33패",
      seasonRemainingGames: "16경기",
      recent3Form: "GREEN",
      staminaStatus: "GREEN",
      minutesPlayed14d: 0,
      totalMarketValue: "오피셜 팀",
      totalMarketValueNum: 1,
      starterPitcherInfo: {
        name: "보스",
        number: 28,
        throwsHand: "R",
        era: "3.52",
        whip: "1.16",
        wins: 8,
        losses: 5,
        inningsPitched: "102.0",
        strikeouts: 94,
        vsOpponentLogs: [
          {
            dateStr: "08.18",
            opponentName: "롯데",
            innings: "6.0",
            earnedRuns: 1,
            runs: 1,
            result: "승",
            decision: "승리투수"
          }
        ]
      },
      recentGamesLog: [
        { date: "08.31", opponent: "한화", score: "6:2", result: "승", isHome: true },
        { date: "08.30", opponent: "한화", score: "4:3", result: "승", isHome: true },
        { date: "08.28", opponent: "LG", score: "1:5", result: "패", isHome: false },
        { date: "08.27", opponent: "LG", score: "6:4", result: "승", isHome: false },
        { date: "08.25", opponent: "키움", score: "7:1", result: "승", isHome: true }
      ]
    },
    awayTeam: {
      id: "a_g024_2",
      name: "롯데",
      logo: "https://media.api-sports.io/baseball/teams/94.png",
      countryName: "KBO",
      rank: 7,
      homeSeasonRecord: "30승 2무 32패",
      awaySeasonRecord: "27승 2무 36패",
      seasonRemainingGames: "15경기",
      recent3Form: "YELLOW",
      staminaStatus: "GREEN",
      minutesPlayed14d: 0,
      totalMarketValue: "오피셜 팀",
      totalMarketValueNum: 2,
      starterPitcherInfo: {
        name: "로드리게스",
        number: 30,
        throwsHand: "R",
        era: "3.75",
        whip: "1.24",
        wins: 6,
        losses: 5,
        inningsPitched: "91.1",
        strikeouts: 86,
        vsOpponentLogs: [
          {
            dateStr: "08.18",
            opponentName: "삼성",
            innings: "5.1",
            earnedRuns: 4,
            runs: 4,
            result: "패",
            decision: "패전투수"
          }
        ]
      },
      recentGamesLog: [
        { date: "08.31", opponent: "KT", score: "2:6", result: "패", isHome: false },
        { date: "08.30", opponent: "KT", score: "5:4", result: "승", isHome: false },
        { date: "08.28", opponent: "NC", score: "3:2", result: "승", isHome: true },
        { date: "08.27", opponent: "NC", score: "1:7", result: "패", isHome: true },
        { date: "08.25", opponent: "SSG", score: "4:8", result: "패", isHome: false }
      ]
    },
    underOverFact: {
      last10OverRatio: 55,
      last10UnderRatio: 45,
      avgScoredGoals: 5.2,
      avgConcededGoals: 4.7,
      isFiveBack: false,
      tacticDescription: "야구 승1패 2번 경기: 대구 타자 친화 구장"
    },
    isPitcherAnnounced: true,
    isDataCheckingPending: false
  },
  {
    id: "bm-g024-260064-3",
    betmanRound: "야구 승1패 260064회차 (betman.co.kr 오피셜 슬립)",
    betmanFolder: "SEUNG1PAE",
    betmanMatchNo: 3,
    sport: "baseball",
    league: "KBO",
    countryFlag: "⚾",
    isFavorite: false,
    betmanOdds: {
      win: 1.82,
      draw: 2.35,
      lose: 1.85
    },
    status: "SCHEDULED",
    matchTime: "09.01 (화) 18:30",
    closingTime: "09.01 (화) 18:30",
    venue: "수원KT위즈파크",
    lineupAlertInfo: {
      isPublished: true,
      publishedTime: "베트맨 오피셜 라인업 팩트",
      alertText: "🚨 야구 승1패 3번 경기 [KT vs 한화] 오피셜 선발 확정! (대니엘 vs 화이트)",
      keyAbsenceNotice: "⚠️ 야구 승1패 3번 경기: 5강 경쟁 치열한 수원 경기"
    },
    headToHeadRecord: {
      homeWins: 3,
      draws: 0,
      awayWins: 2,
      last5Matches: [
        { date: "08.20", homeTeam: "KT 위즈", awayTeam: "한화 이글스", score: "4:2", result: "승" },
        { date: "08.08", homeTeam: "한화 이글스", awayTeam: "KT 위즈", score: "5:3", result: "패" },
        { date: "07.25", homeTeam: "KT 위즈", awayTeam: "한화 이글스", score: "6:1", result: "승" },
        { date: "06.15", homeTeam: "한화 이글스", awayTeam: "KT 위즈", score: "2:7", result: "승" },
        { date: "05.10", homeTeam: "KT 위즈", awayTeam: "한화 이글스", score: "3:8", result: "패" }
      ]
    },
    homeTeam: {
      id: "h_g024_3",
      name: "KT",
      logo: "https://media.api-sports.io/baseball/teams/92.png",
      countryName: "KBO",
      rank: 5,
      homeSeasonRecord: "35승 1무 29패",
      awaySeasonRecord: "29승 1무 34패",
      seasonRemainingGames: "18경기",
      recent3Form: "GREEN",
      staminaStatus: "GREEN",
      minutesPlayed14d: 0,
      totalMarketValue: "오피셜 팀",
      totalMarketValueNum: 1,
      starterPitcherInfo: {
        name: "대니엘",
        number: 35,
        throwsHand: "R",
        era: "3.90",
        whip: "1.25",
        wins: 5,
        losses: 4,
        inningsPitched: "76.1",
        strikeouts: 70,
        vsOpponentLogs: [
          {
            dateStr: "08.20",
            opponentName: "한화",
            innings: "6.0",
            earnedRuns: 2,
            runs: 2,
            result: "승",
            decision: "승리투수"
          }
        ]
      },
      recentGamesLog: [
        { date: "08.31", opponent: "롯데", score: "6:2", result: "승", isHome: true },
        { date: "08.30", opponent: "롯데", score: "4:5", result: "패", isHome: true },
        { date: "08.28", opponent: "KIA", score: "3:2", result: "승", isHome: false },
        { date: "08.27", opponent: "KIA", score: "1:4", result: "패", isHome: false },
        { date: "08.25", opponent: "두산", score: "3:5", result: "패", isHome: false }
      ]
    },
    awayTeam: {
      id: "a_g024_3",
      name: "한화",
      logo: "https://media.api-sports.io/baseball/teams/90.png",
      countryName: "KBO",
      rank: 8,
      homeSeasonRecord: "28승 2무 33패",
      awaySeasonRecord: "27승 1무 37패",
      seasonRemainingGames: "17경기",
      recent3Form: "YELLOW",
      staminaStatus: "GREEN",
      minutesPlayed14d: 0,
      totalMarketValue: "오피셜 팀",
      totalMarketValueNum: 2,
      starterPitcherInfo: {
        name: "화이트",
        number: 33,
        throwsHand: "R",
        era: "3.65",
        whip: "1.18",
        wins: 7,
        losses: 4,
        inningsPitched: "88.2",
        strikeouts: 82,
        vsOpponentLogs: [
          {
            dateStr: "08.20",
            opponentName: "KT",
            innings: "5.0",
            earnedRuns: 3,
            runs: 3,
            result: "패",
            decision: "선발"
          }
        ]
      },
      recentGamesLog: [
        { date: "08.31", opponent: "삼성", score: "2:6", result: "패", isHome: false },
        { date: "08.30", opponent: "삼성", score: "3:4", result: "패", isHome: false },
        { date: "08.28", opponent: "두산", score: "3:6", result: "패", isHome: true },
        { date: "08.27", opponent: "두산", score: "4:2", result: "승", isHome: true },
        { date: "08.25", opponent: "NC", score: "5:4", result: "승", isHome: false }
      ]
    },
    underOverFact: {
      last10OverRatio: 50,
      last10UnderRatio: 50,
      avgScoredGoals: 4.4,
      avgConcededGoals: 4.6,
      isFiveBack: false,
      tacticDescription: "야구 승1패 3번 경기: 팽팽한 불펜 싸움 예상"
    },
    isPitcherAnnounced: true,
    isDataCheckingPending: false
  },
  {
    id: "bm-g024-260064-4",
    betmanRound: "야구 승1패 260064회차 (betman.co.kr 오피셜 슬립)",
    betmanFolder: "SEUNG1PAE",
    betmanMatchNo: 4,
    sport: "baseball",
    league: "KBO",
    countryFlag: "⚾",
    isFavorite: false,
    betmanOdds: {
      win: 1.95,
      draw: 2.30,
      lose: 1.72
    },
    status: "SCHEDULED",
    matchTime: "09.01 (화) 18:30",
    closingTime: "09.01 (화) 18:30",
    venue: "창원NC파크",
    lineupAlertInfo: {
      isPublished: true,
      publishedTime: "베트맨 오피셜 라인업 팩트",
      alertText: "🚨 야구 승1패 4번 경기 [NC vs KIA] 오피셜 선발 확정! (하트 vs 네일)",
      keyAbsenceNotice: "⚠️ 야구 승1패 4번 경기: 리그 최고 에이스 맞대결 빅매치"
    },
    headToHeadRecord: {
      homeWins: 2,
      draws: 0,
      awayWins: 3,
      last5Matches: [
        { date: "08.22", homeTeam: "NC 다이노스", awayTeam: "KIA 타이거즈", score: "3:4", result: "패" },
        { date: "08.10", homeTeam: "KIA 타이거즈", awayTeam: "NC 다이노스", score: "6:2", result: "패" },
        { date: "07.28", homeTeam: "NC 다이노스", awayTeam: "KIA 타이거즈", score: "5:3", result: "승" },
        { date: "06.18", homeTeam: "KIA 타이거즈", awayTeam: "NC 다이노스", score: "2:4", result: "승" },
        { date: "05.20", homeTeam: "NC 다이노스", awayTeam: "KIA 타이거즈", score: "1:7", result: "패" }
      ]
    },
    homeTeam: {
      id: "h_g024_4",
      name: "NC",
      logo: "https://media.api-sports.io/baseball/teams/97.png",
      countryName: "KBO",
      rank: 6,
      homeSeasonRecord: "32승 2무 31패",
      awaySeasonRecord: "28승 0무 35패",
      seasonRemainingGames: "16경기",
      recent3Form: "GREEN",
      staminaStatus: "GREEN",
      minutesPlayed14d: 0,
      totalMarketValue: "오피셜 팀",
      totalMarketValueNum: 1,
      starterPitcherInfo: {
        name: "하트",
        number: 59,
        throwsHand: "L",
        era: "2.69",
        whip: "1.03",
        wins: 13,
        losses: 3,
        inningsPitched: "157.0",
        strikeouts: 182,
        vsOpponentLogs: [
          {
            dateStr: "07.28",
            opponentName: "KIA",
            innings: "7.0",
            earnedRuns: 1,
            runs: 1,
            result: "승",
            decision: "승리투수"
          }
        ]
      },
      recentGamesLog: [
        { date: "08.31", opponent: "키움", score: "5:2", result: "승", isHome: true },
        { date: "08.30", opponent: "키움", score: "3:6", result: "패", isHome: true },
        { date: "08.28", opponent: "롯데", score: "2:3", result: "패", isHome: false },
        { date: "08.27", opponent: "롯데", score: "7:1", result: "승", isHome: false },
        { date: "08.25", opponent: "한화", score: "4:5", result: "패", isHome: true }
      ]
    },
    awayTeam: {
      id: "a_g024_4",
      name: "KIA",
      logo: "https://media.api-sports.io/baseball/teams/96.png",
      countryName: "KBO",
      rank: 1,
      homeSeasonRecord: "42승 1무 22패",
      awaySeasonRecord: "38승 1무 25패",
      seasonRemainingGames: "15경기",
      recent3Form: "GREEN",
      staminaStatus: "GREEN",
      minutesPlayed14d: 0,
      totalMarketValue: "오피셜 팀",
      totalMarketValueNum: 2,
      starterPitcherInfo: {
        name: "네일",
        number: 40,
        throwsHand: "R",
        era: "2.53",
        whip: "1.09",
        wins: 12,
        losses: 5,
        inningsPitched: "149.1",
        strikeouts: 138,
        vsOpponentLogs: [
          {
            dateStr: "08.22",
            opponentName: "NC",
            innings: "6.0",
            earnedRuns: 2,
            runs: 2,
            result: "승",
            decision: "승리투수"
          }
        ]
      },
      recentGamesLog: [
        { date: "08.31", opponent: "LG", score: "4:3", result: "승", isHome: true },
        { date: "08.30", opponent: "LG", score: "2:7", result: "패", isHome: true },
        { date: "08.28", opponent: "KT", score: "2:3", result: "패", isHome: true },
        { date: "08.27", opponent: "KT", score: "4:1", result: "승", isHome: true },
        { date: "08.25", opponent: "SSG", score: "8:2", result: "승", isHome: false }
      ]
    },
    underOverFact: {
      last10OverRatio: 40,
      last10UnderRatio: 60,
      avgScoredGoals: 4.1,
      avgConcededGoals: 3.8,
      isFiveBack: false,
      tacticDescription: "야구 승1패 4번 경기: 하트 vs 네일 투수전 양상"
    },
    isPitcherAnnounced: true,
    isDataCheckingPending: false
  },
  {
    id: "bm-g024-260064-5",
    betmanRound: "야구 승1패 260064회차 (betman.co.kr 오피셜 슬립)",
    betmanFolder: "SEUNG1PAE",
    betmanMatchNo: 5,
    sport: "baseball",
    league: "KBO",
    countryFlag: "⚾",
    isFavorite: false,
    betmanOdds: {
      win: 1.70,
      draw: 2.45,
      lose: 1.98
    },
    status: "SCHEDULED",
    matchTime: "09.01 (화) 18:30",
    closingTime: "09.01 (화) 18:30",
    venue: "고척스카이돔",
    lineupAlertInfo: {
      isPublished: true,
      publishedTime: "베트맨 오피셜 라인업 팩트",
      alertText: "🚨 야구 승1패 5번 경기 [키움 vs SSG] 오피셜 선발 확정! (후라도 vs 김광현)",
      keyAbsenceNotice: "⚠️ 야구 승1패 5번 경기: 에이스 후라도 vs 베테랑 김광현"
    },
    headToHeadRecord: {
      homeWins: 3,
      draws: 0,
      awayWins: 2,
      last5Matches: [
        { date: "08.12", homeTeam: "키움 히어로즈", awayTeam: "SSG 랜더스", score: "5:3", result: "승" },
        { date: "07.30", homeTeam: "SSG 랜더스", awayTeam: "키움 히어로즈", score: "6:2", result: "패" },
        { date: "07.15", homeTeam: "키움 히어로즈", awayTeam: "SSG 랜더스", score: "4:1", result: "승" },
        { date: "06.05", homeTeam: "SSG 랜더스", awayTeam: "키움 히어로즈", score: "3:7", result: "승" },
        { date: "05.18", homeTeam: "키움 히어로즈", awayTeam: "SSG 랜더스", score: "2:5", result: "패" }
      ]
    },
    homeTeam: {
      id: "h_g024_5",
      name: "키움",
      logo: "https://media.api-sports.io/baseball/teams/92.png",
      countryName: "KBO",
      rank: 10,
      homeSeasonRecord: "28승 0무 36패",
      awaySeasonRecord: "26승 0무 38패",
      seasonRemainingGames: "16경기",
      recent3Form: "GREEN",
      staminaStatus: "GREEN",
      minutesPlayed14d: 0,
      totalMarketValue: "오피셜 팀",
      totalMarketValueNum: 1,
      starterPitcherInfo: {
        name: "후라도",
        number: 75,
        throwsHand: "R",
        era: "3.36",
        whip: "1.14",
        wins: 10,
        losses: 8,
        inningsPitched: "190.1",
        strikeouts: 169,
        vsOpponentLogs: [
          {
            dateStr: "08.12",
            opponentName: "SSG",
            innings: "7.0",
            earnedRuns: 2,
            runs: 2,
            result: "승",
            decision: "승리투수"
          }
        ]
      },
      recentGamesLog: [
        { date: "08.31", opponent: "NC", score: "2:5", result: "패", isHome: false },
        { date: "08.30", opponent: "NC", score: "6:3", result: "승", isHome: false },
        { date: "08.28", opponent: "SSG", score: "5:2", result: "승", isHome: true },
        { date: "08.27", opponent: "SSG", score: "3:8", result: "패", isHome: true },
        { date: "08.25", opponent: "삼성", score: "1:7", result: "패", isHome: false }
      ]
    },
    awayTeam: {
      id: "a_g024_5",
      name: "SSG",
      logo: "https://media.api-sports.io/baseball/teams/647.png",
      countryName: "KBO",
      rank: 6,
      homeSeasonRecord: "34승 1무 31패",
      awaySeasonRecord: "30승 0무 34패",
      seasonRemainingGames: "17경기",
      recent3Form: "YELLOW",
      staminaStatus: "GREEN",
      minutesPlayed14d: 0,
      totalMarketValue: "오피셜 팀",
      totalMarketValueNum: 2,
      starterPitcherInfo: {
        name: "김광현",
        number: 29,
        throwsHand: "L",
        era: "4.93",
        whip: "1.45",
        wins: 12,
        losses: 10,
        inningsPitched: "144.1",
        strikeouts: 154,
        vsOpponentLogs: [
          {
            dateStr: "08.12",
            opponentName: "키움",
            innings: "6.0",
            earnedRuns: 3,
            runs: 3,
            result: "패",
            decision: "패전투수"
          }
        ]
      },
      recentGamesLog: [
        { date: "08.31", opponent: "두산", score: "2:4", result: "패", isHome: false },
        { date: "08.30", opponent: "두산", score: "5:1", result: "승", isHome: false },
        { date: "08.28", opponent: "키움", score: "2:5", result: "패", isHome: false },
        { date: "08.27", opponent: "키움", score: "8:3", result: "승", isHome: false },
        { date: "08.25", opponent: "KIA", score: "2:8", result: "패", isHome: true }
      ]
    },
    underOverFact: {
      last10OverRatio: 50,
      last10UnderRatio: 50,
      avgScoredGoals: 4.5,
      avgConcededGoals: 4.8,
      isFiveBack: false,
      tacticDescription: "야구 승1패 5번 경기: 고척돔 1점차 접전 승부"
    },
    isPitcherAnnounced: true,
    isDataCheckingPending: false
  },
  {
    id: "bm-g024-260064-6",
    betmanRound: "야구 승1패 260064회차 (betman.co.kr 오피셜 슬립)",
    betmanFolder: "SEUNG1PAE",
    betmanMatchNo: 6,
    sport: "baseball",
    league: "MLB",
    countryFlag: "⚾",
    isFavorite: false,
    betmanOdds: {
      win: 1.88,
      draw: 2.30,
      lose: 1.78
    },
    status: "SCHEDULED",
    matchTime: "09.02 (수) 07:40",
    closingTime: "09.02 (수) 07:40",
    venue: "트로피카나 필드",
    lineupAlertInfo: {
      isPublished: true,
      publishedTime: "베트맨 오피셜 라인업 팩트",
      alertText: "🚨 야구 승1패 6번 경기 [탬파레이 vs 뉴욕메츠] 오피셜 선발 확정! (잭 리텔 vs 션 마네아)",
      keyAbsenceNotice: "⚠️ 야구 승1패 6번 경기: 잭 리텔 vs 션 마네아 인터리그 매치업"
    },
    headToHeadRecord: {
      homeWins: 2,
      draws: 0,
      awayWins: 1,
      last5Matches: [
        { date: "05.05", homeTeam: "탬파베이 레이스", awayTeam: "뉴욕 메츠", score: "7:6", result: "승" },
        { date: "05.04", homeTeam: "탬파베이 레이스", awayTeam: "뉴욕 메츠", score: "3:1", result: "승" },
        { date: "05.03", homeTeam: "탬파베이 레이스", awayTeam: "뉴욕 메츠", score: "8:10", result: "패" }
      ]
    },
    homeTeam: {
      id: "h_g024_6",
      name: "탬파레이",
      logo: "https://media.api-sports.io/baseball/teams/32.png",
      countryName: "MLB",
      rank: 4,
      homeSeasonRecord: "37승 34패",
      awaySeasonRecord: "34승 32패",
      seasonRemainingGames: "25경기",
      recent3Form: "GREEN",
      staminaStatus: "GREEN",
      minutesPlayed14d: 0,
      totalMarketValue: "오피셜 팀",
      totalMarketValueNum: 1,
      starterPitcherInfo: {
        name: "잭 리텔",
        number: 52,
        throwsHand: "R",
        era: "3.63",
        whip: "1.25",
        wins: 8,
        losses: 9,
        inningsPitched: "156.1",
        strikeouts: 141,
        vsOpponentLogs: [
          { dateStr: "05.04", opponentName: "NYM", innings: "6.0", earnedRuns: 1, runs: 1, result: "승", decision: "승리투수" }
        ]
      },
      recentGamesLog: [
        { date: "08.31", opponent: "SD", score: "5:4", result: "승", isHome: true },
        { date: "08.30", opponent: "SD", score: "5:13", result: "패", isHome: true },
        { date: "08.28", opponent: "SEA", score: "2:6", result: "패", isHome: false }
      ]
    },
    awayTeam: {
      id: "a_g024_6",
      name: "뉴욕메츠",
      logo: "https://media.api-sports.io/baseball/teams/22.png",
      countryName: "MLB",
      rank: 3,
      homeSeasonRecord: "40승 31패",
      awaySeasonRecord: "36승 30패",
      seasonRemainingGames: "25경기",
      recent3Form: "GREEN",
      staminaStatus: "GREEN",
      minutesPlayed14d: 0,
      totalMarketValue: "오피셜 팀",
      totalMarketValueNum: 2,
      starterPitcherInfo: {
        name: "션 마네아",
        number: 59,
        throwsHand: "L",
        era: "3.47",
        whip: "1.08",
        wins: 12,
        losses: 5,
        inningsPitched: "181.2",
        strikeouts: 184,
        vsOpponentLogs: [
          { dateStr: "05.04", opponentName: "TB", innings: "5.0", earnedRuns: 3, runs: 3, result: "패", decision: "선발" }
        ]
      },
      recentGamesLog: [
        { date: "08.31", opponent: "CWS", score: "5:3", result: "승", isHome: false },
        { date: "08.30", opponent: "CWS", score: "5:1", result: "승", isHome: false },
        { date: "08.28", opponent: "ARI", score: "5:8", result: "패", isHome: false }
      ]
    },
    underOverFact: {
      last10OverRatio: 45,
      last10UnderRatio: 55,
      avgScoredGoals: 4.2,
      avgConcededGoals: 4.1,
      isFiveBack: false,
      tacticDescription: "야구 승1패 6번 경기: 트로피카나 필드 저득점 팽팽한 양상"
    },
    isPitcherAnnounced: true,
    isDataCheckingPending: false
  },
  {
    id: "bm-g024-260064-7",
    betmanRound: "야구 승1패 260064회차 (betman.co.kr 오피셜 슬립)",
    betmanFolder: "SEUNG1PAE",
    betmanMatchNo: 7,
    sport: "baseball",
    league: "MLB",
    countryFlag: "⚾",
    isFavorite: false,
    betmanOdds: {
      win: 1.74,
      draw: 2.45,
      lose: 1.92
    },
    status: "SCHEDULED",
    matchTime: "09.02 (수) 07:40",
    closingTime: "09.02 (수) 07:40",
    venue: "PNC 파크",
    lineupAlertInfo: {
      isPublished: true,
      publishedTime: "베트맨 오피셜 라인업 팩트",
      alertText: "🚨 야구 승1패 7번 경기 [피츠파이 vs 샌프자이] 오피셜 선발 확정! (폴 스킨스 vs 로건 웹)",
      keyAbsenceNotice: "⚠️ 야구 승1패 7번 경기: 괴물 신인 스킨스 vs 리그 탑 에이스 웹"
    },
    headToHeadRecord: {
      homeWins: 3,
      draws: 0,
      awayWins: 3,
      last5Matches: [
        { date: "05.23", homeTeam: "피츠버그 파이리츠", awayTeam: "샌프란시스코 자이언츠", score: "6:7", result: "패" },
        { date: "05.22", homeTeam: "피츠버그 파이리츠", awayTeam: "샌프란시스코 자이언츠", score: "7:6", result: "승" },
        { date: "05.21", homeTeam: "피츠버그 파이리츠", awayTeam: "샌프란시스코 자이언츠", score: "6:3", result: "승" },
        { date: "04.28", homeTeam: "샌프란시스코 자이언츠", awayTeam: "피츠버그 파이리츠", score: "3:2", result: "패" }
      ]
    },
    homeTeam: {
      id: "h_g024_7",
      name: "피츠파이",
      logo: "https://media.api-sports.io/baseball/teams/26.png",
      countryName: "MLB",
      rank: 5,
      homeSeasonRecord: "38승 35패",
      awaySeasonRecord: "30승 40패",
      seasonRemainingGames: "24경기",
      recent3Form: "GREEN",
      staminaStatus: "GREEN",
      minutesPlayed14d: 0,
      totalMarketValue: "오피셜 팀",
      totalMarketValueNum: 1,
      starterPitcherInfo: {
        name: "폴 스킨스",
        number: 30,
        throwsHand: "R",
        era: "1.96",
        whip: "0.95",
        wins: 11,
        losses: 3,
        inningsPitched: "133.0",
        strikeouts: 170,
        vsOpponentLogs: [
          { dateStr: "05.23", opponentName: "SF", innings: "6.0", earnedRuns: 1, runs: 1, result: "승", decision: "승리투수" }
        ]
      },
      recentGamesLog: [
        { date: "08.31", opponent: "CLE", score: "3:0", result: "승", isHome: false },
        { date: "08.30", opponent: "CLE", score: "8:10", result: "패", isHome: false },
        { date: "08.28", opponent: "CHC", score: "10:14", result: "패", isHome: true }
      ]
    },
    awayTeam: {
      id: "a_g024_7",
      name: "샌프자이",
      logo: "https://media.api-sports.io/baseball/teams/28.png",
      countryName: "MLB",
      rank: 4,
      homeSeasonRecord: "42승 32패",
      awaySeasonRecord: "30승 39패",
      seasonRemainingGames: "23경기",
      recent3Form: "YELLOW",
      staminaStatus: "GREEN",
      minutesPlayed14d: 0,
      totalMarketValue: "오피셜 팀",
      totalMarketValueNum: 2,
      starterPitcherInfo: {
        name: "로건 웹",
        number: 62,
        throwsHand: "R",
        era: "3.46",
        whip: "1.23",
        wins: 13,
        losses: 10,
        inningsPitched: "204.2",
        strikeouts: 172,
        vsOpponentLogs: [
          { dateStr: "05.22", opponentName: "PIT", innings: "6.0", earnedRuns: 3, runs: 3, result: "패", decision: "선발" }
        ]
      },
      recentGamesLog: [
        { date: "08.31", opponent: "MIA", score: "3:4", result: "패", isHome: true },
        { date: "08.30", opponent: "MIA", score: "3:1", result: "승", isHome: true },
        { date: "08.28", opponent: "MIL", score: "3:5", result: "패", isHome: false }
      ]
    },
    underOverFact: {
      last10OverRatio: 35,
      last10UnderRatio: 65,
      avgScoredGoals: 3.8,
      avgConcededGoals: 3.5,
      isFiveBack: false,
      tacticDescription: "야구 승1패 7번 경기: 스킨스 vs 웹 초특급 선발전 언더 유력"
    },
    isPitcherAnnounced: true,
    isDataCheckingPending: false
  },
  {
    id: "bm-g024-260064-8",
    betmanRound: "야구 승1패 260064회차 (betman.co.kr 오피셜 슬립)",
    betmanFolder: "SEUNG1PAE",
    betmanMatchNo: 8,
    sport: "baseball",
    league: "MLB",
    countryFlag: "⚾",
    isFavorite: false,
    betmanOdds: {
      win: 1.55,
      draw: 2.65,
      lose: 2.25
    },
    status: "SCHEDULED",
    matchTime: "09.02 (수) 08:40",
    closingTime: "09.02 (수) 08:40",
    venue: "카우프만 스타디움",
    lineupAlertInfo: {
      isPublished: true,
      publishedTime: "베트맨 오피셜 라인업 팩트",
      alertText: "🚨 야구 승1패 8번 경기 [캔자로얄 vs 마이말린] 오피셜 선발 확정! (콜 레이건스 vs 에드워드 카브레라)",
      keyAbsenceNotice: "⚠️ 야구 승1패 8번 경기: 캔자스시티 에이스 레이건스 등판"
    },
    headToHeadRecord: {
      homeWins: 2,
      draws: 0,
      awayWins: 1,
      last5Matches: [
        { date: "06.26", homeTeam: "캔자스시티 로열스", awayTeam: "마이애미 말린스", score: "5:1", result: "승" },
        { date: "06.25", homeTeam: "캔자스시티 로열스", awayTeam: "마이애미 말린스", score: "1:2", result: "패" },
        { date: "06.24", homeTeam: "캔자스시티 로열스", awayTeam: "마이애미 말린스", score: "4:1", result: "승" }
      ]
    },
    homeTeam: {
      id: "h_g024_8",
      name: "캔자로얄",
      logo: "https://media.api-sports.io/baseball/teams/19.png",
      countryName: "MLB",
      rank: 2,
      homeSeasonRecord: "45승 29패",
      awaySeasonRecord: "37승 34패",
      seasonRemainingGames: "24경기",
      recent3Form: "GREEN",
      staminaStatus: "GREEN",
      minutesPlayed14d: 0,
      totalMarketValue: "오피셜 팀",
      totalMarketValueNum: 1,
      starterPitcherInfo: {
        name: "콜 레이건스",
        number: 55,
        throwsHand: "L",
        era: "3.19",
        whip: "1.14",
        wins: 11,
        losses: 9,
        inningsPitched: "186.1",
        strikeouts: 223,
        vsOpponentLogs: [
          { dateStr: "06.24", opponentName: "MIA", innings: "6.0", earnedRuns: 1, runs: 1, result: "승", decision: "승리투수" }
        ]
      },
      recentGamesLog: [
        { date: "08.31", opponent: "HOU", score: "2:5", result: "패", isHome: false },
        { date: "08.30", opponent: "HOU", score: "3:6", result: "패", isHome: false },
        { date: "08.28", opponent: "CLE", score: "5:7", result: "패", isHome: false }
      ]
    },
    awayTeam: {
      id: "a_g024_8",
      name: "마이말린",
      logo: "https://media.api-sports.io/baseball/teams/20.png",
      countryName: "MLB",
      rank: 5,
      homeSeasonRecord: "30승 43패",
      awaySeasonRecord: "28승 43패",
      seasonRemainingGames: "24경기",
      recent3Form: "YELLOW",
      staminaStatus: "GREEN",
      minutesPlayed14d: 0,
      totalMarketValue: "오피셜 팀",
      totalMarketValueNum: 2,
      starterPitcherInfo: {
        name: "에드워드 카브레라",
        number: 27,
        throwsHand: "R",
        era: "4.70",
        whip: "1.36",
        wins: 4,
        losses: 8,
        inningsPitched: "97.2",
        strikeouts: 108,
        vsOpponentLogs: [
          { dateStr: "06.24", opponentName: "KC", innings: "5.0", earnedRuns: 3, runs: 3, result: "패", decision: "선발" }
        ]
      },
      recentGamesLog: [
        { date: "08.31", opponent: "SF", score: "4:3", result: "승", isHome: false },
        { date: "08.30", opponent: "SF", score: "1:3", result: "패", isHome: false },
        { date: "08.28", opponent: "COL", score: "12:8", result: "승", isHome: false }
      ]
    },
    underOverFact: {
      last10OverRatio: 45,
      last10UnderRatio: 55,
      avgScoredGoals: 4.6,
      avgConcededGoals: 3.9,
      isFiveBack: false,
      tacticDescription: "야구 승1패 8번 경기: 캔자스시티 레이건스 우위 전망"
    },
    isPitcherAnnounced: true,
    isDataCheckingPending: false
  },
  {
    id: "bm-g024-260064-9",
    betmanRound: "야구 승1패 260064회차 (betman.co.kr 오피셜 슬립)",
    betmanFolder: "SEUNG1PAE",
    betmanMatchNo: 9,
    sport: "baseball",
    league: "MLB",
    countryFlag: "⚾",
    isFavorite: false,
    betmanOdds: {
      win: 1.62,
      draw: 2.55,
      lose: 2.12
    },
    status: "SCHEDULED",
    matchTime: "09.02 (수) 09:05",
    closingTime: "09.02 (수) 09:05",
    venue: "글로브 라이프 필드",
    lineupAlertInfo: {
      isPublished: true,
      publishedTime: "베트맨 오피셜 라인업 팩트",
      alertText: "🚨 야구 승1패 9번 경기 [텍사레인 vs 애슬레틱] 오피셜 선발 확정! (네이선 이볼디 vs JP 시어스)",
      keyAbsenceNotice: "⚠️ 야구 승1패 9번 경기: AL 서부지구 맞대결"
    },
    headToHeadRecord: {
      homeWins: 4,
      draws: 0,
      awayWins: 2,
      last5Matches: [
        { date: "07.24", homeTeam: "텍사스 레인저스", awayTeam: "오클랜드 애슬레틱스", score: "3:2", result: "승" },
        { date: "07.23", homeTeam: "텍사스 레인저스", awayTeam: "오클랜드 애슬레틱스", score: "4:5", result: "패" },
        { date: "05.08", homeTeam: "오클랜드 애슬레틱스", awayTeam: "텍사스 레인저스", score: "2:4", result: "승" },
        { date: "05.07", homeTeam: "오클랜드 애슬레틱스", awayTeam: "텍사스 레인저스", score: "1:3", result: "승" }
      ]
    },
    homeTeam: {
      id: "h_g024_9",
      name: "텍사레인",
      logo: "https://media.api-sports.io/baseball/teams/33.png",
      countryName: "MLB",
      rank: 3,
      homeSeasonRecord: "40승 33패",
      awaySeasonRecord: "34승 37패",
      seasonRemainingGames: "24경기",
      recent3Form: "GREEN",
      staminaStatus: "GREEN",
      minutesPlayed14d: 0,
      totalMarketValue: "오피셜 팀",
      totalMarketValueNum: 1,
      starterPitcherInfo: {
        name: "네이선 이볼디",
        number: 17,
        throwsHand: "R",
        era: "3.78",
        whip: "1.11",
        wins: 12,
        losses: 8,
        inningsPitched: "170.2",
        strikeouts: 166,
        vsOpponentLogs: [
          { dateStr: "07.24", opponentName: "OAK", innings: "6.0", earnedRuns: 2, runs: 2, result: "승", decision: "선발" }
        ]
      },
      recentGamesLog: [
        { date: "08.31", opponent: "OAK", score: "3:2", result: "승", isHome: true },
        { date: "08.30", opponent: "OAK", score: "2:9", result: "패", isHome: true },
        { date: "08.28", opponent: "CWS", score: "4:3", result: "승", isHome: false }
      ]
    },
    awayTeam: {
      id: "a_g024_9",
      name: "애슬레틱",
      logo: "https://media.api-sports.io/baseball/teams/24.png",
      countryName: "MLB",
      rank: 4,
      homeSeasonRecord: "38승 36패",
      awaySeasonRecord: "28승 44패",
      seasonRemainingGames: "24경기",
      recent3Form: "YELLOW",
      staminaStatus: "GREEN",
      minutesPlayed14d: 0,
      totalMarketValue: "오피셜 팀",
      totalMarketValueNum: 2,
      starterPitcherInfo: {
        name: "JP 시어스",
        number: 68,
        throwsHand: "L",
        era: "4.38",
        whip: "1.22",
        wins: 11,
        losses: 12,
        inningsPitched: "180.2",
        strikeouts: 136,
        vsOpponentLogs: [
          { dateStr: "07.24", opponentName: "TEX", innings: "5.2", earnedRuns: 3, runs: 3, result: "패", decision: "패전투수" }
        ]
      },
      recentGamesLog: [
        { date: "08.31", opponent: "TEX", score: "2:3", result: "패", isHome: false },
        { date: "08.30", opponent: "TEX", score: "9:2", result: "승", isHome: false },
        { date: "08.28", opponent: "CIN", score: "9:6", result: "승", isHome: false }
      ]
    },
    underOverFact: {
      last10OverRatio: 45,
      last10UnderRatio: 55,
      avgScoredGoals: 4.3,
      avgConcededGoals: 4.4,
      isFiveBack: false,
      tacticDescription: "야구 승1패 9번 경기: 이볼디 노련한 투구 우세"
    },
    isPitcherAnnounced: true,
    isDataCheckingPending: false
  },
  {
    id: "bm-g024-260064-10",
    betmanRound: "야구 승1패 260064회차 (betman.co.kr 오피셜 슬립)",
    betmanFolder: "SEUNG1PAE",
    betmanMatchNo: 10,
    sport: "baseball",
    league: "MLB",
    countryFlag: "⚾",
    isFavorite: false,
    betmanOdds: {
      win: 1.45,
      draw: 2.80,
      lose: 2.45
    },
    status: "SCHEDULED",
    matchTime: "09.02 (수) 09:10",
    closingTime: "09.02 (수) 09:10",
    venue: "미닛 메이드 파크",
    lineupAlertInfo: {
      isPublished: true,
      publishedTime: "베트맨 오피셜 라인업 팩트",
      alertText: "🚨 야구 승1패 10번 경기 [휴스애스 vs 시카화이] 오피셜 선발 확정! (프람버 발데스 vs 가렛 크로셰)",
      keyAbsenceNotice: "⚠️ 야구 승1패 10번 경기: 휴스턴 발데스 등판"
    },
    headToHeadRecord: {
      homeWins: 4,
      draws: 0,
      awayWins: 2,
      last5Matches: [
        { date: "08.18", homeTeam: "휴스턴 애스트로스", awayTeam: "시카고 화이트삭스", score: "6:1", result: "승" },
        { date: "08.17", homeTeam: "휴스턴 애스트로스", awayTeam: "시카고 화이트삭스", score: "5:2", result: "승" },
        { date: "08.16", homeTeam: "휴스턴 애스트로스", awayTeam: "시카고 화이트삭스", score: "4:5", result: "패" },
        { date: "06.20", homeTeam: "시카고 화이트삭스", awayTeam: "휴스턴 애스트로스", score: "3:5", result: "승" }
      ]
    },
    homeTeam: {
      id: "h_g024_10",
      name: "휴스애스",
      logo: "https://media.api-sports.io/baseball/teams/18.png",
      countryName: "MLB",
      rank: 1,
      homeSeasonRecord: "44승 30패",
      awaySeasonRecord: "41승 32패",
      seasonRemainingGames: "23경기",
      recent3Form: "GREEN",
      staminaStatus: "GREEN",
      minutesPlayed14d: 0,
      totalMarketValue: "오피셜 팀",
      totalMarketValueNum: 1,
      starterPitcherInfo: {
        name: "프람버 발데스",
        number: 59,
        throwsHand: "L",
        era: "2.91",
        whip: "1.11",
        wins: 15,
        losses: 7,
        inningsPitched: "176.1",
        strikeouts: 169,
        vsOpponentLogs: [
          { dateStr: "08.18", opponentName: "CWS", innings: "7.0", earnedRuns: 1, runs: 1, result: "승", decision: "승리투수" }
        ]
      },
      recentGamesLog: [
        { date: "08.31", opponent: "KC", score: "5:2", result: "승", isHome: true },
        { date: "08.30", opponent: "KC", score: "6:3", result: "승", isHome: true },
        { date: "08.28", opponent: "PHI", score: "10:0", result: "승", isHome: false }
      ]
    },
    awayTeam: {
      id: "a_g024_10",
      name: "시카화이",
      logo: "https://media.api-sports.io/baseball/teams/10.png",
      countryName: "MLB",
      rank: 5,
      homeSeasonRecord: "20승 55패",
      awaySeasonRecord: "15승 59패",
      seasonRemainingGames: "22경기",
      recent3Form: "RED",
      staminaStatus: "GREEN",
      minutesPlayed14d: 0,
      totalMarketValue: "오피셜 팀",
      totalMarketValueNum: 2,
      starterPitcherInfo: {
        name: "가렛 크로셰",
        number: 45,
        throwsHand: "L",
        era: "3.58",
        whip: "1.07",
        wins: 6,
        losses: 12,
        inningsPitched: "146.0",
        strikeouts: 209,
        vsOpponentLogs: [
          { dateStr: "08.18", opponentName: "HOU", innings: "5.0", earnedRuns: 3, runs: 3, result: "패", decision: "선발" }
        ]
      },
      recentGamesLog: [
        { date: "08.31", opponent: "NYM", score: "3:5", result: "패", isHome: true },
        { date: "08.30", opponent: "NYM", score: "1:5", result: "패", isHome: true },
        { date: "08.28", opponent: "TEX", score: "3:4", result: "패", isHome: true }
      ]
    },
    underOverFact: {
      last10OverRatio: 40,
      last10UnderRatio: 60,
      avgScoredGoals: 4.8,
      avgConcededGoals: 3.2,
      isFiveBack: false,
      tacticDescription: "야구 승1패 10번 경기: 휴스턴 발데스 압도적 전력 우세"
    },
    isPitcherAnnounced: true,
    isDataCheckingPending: false
  },
  {
    id: "bm-g024-260064-11",
    betmanRound: "야구 승1패 260064회차 (betman.co.kr 오피셜 슬립)",
    betmanFolder: "SEUNG1PAE",
    betmanMatchNo: 11,
    sport: "baseball",
    league: "MLB",
    countryFlag: "⚾",
    isFavorite: false,
    betmanOdds: {
      win: 2.25,
      draw: 2.65,
      lose: 1.55
    },
    status: "SCHEDULED",
    matchTime: "09.02 (수) 09:40",
    closingTime: "09.02 (수) 09:40",
    venue: "쿠어스 필드",
    lineupAlertInfo: {
      isPublished: true,
      publishedTime: "베트맨 오피셜 라인업 팩트",
      alertText: "🚨 야구 승1패 11번 경기 [콜로로키 vs 볼티오리] 오피셜 선발 확정! (카일 프리랜드 vs 코빈 번스)",
      keyAbsenceNotice: "⚠️ 야구 승1패 11번 경기: 볼티모어 에이스 코빈 번스 쿠어스 필드 등판"
    },
    headToHeadRecord: {
      homeWins: 1,
      draws: 0,
      awayWins: 2,
      last5Matches: [
        { date: "08.27", homeTeam: "볼티모어 오리올스", awayTeam: "콜로라도 로키스", score: "5:4", result: "패" },
        { date: "08.26", homeTeam: "볼티모어 오리올스", awayTeam: "콜로라도 로키스", score: "3:4", result: "승" },
        { date: "08.25", homeTeam: "볼티모어 오리올스", awayTeam: "콜로라도 로키스", score: "4:3", result: "패" }
      ]
    },
    homeTeam: {
      id: "h_g024_11",
      name: "콜로로키",
      logo: "https://media.api-sports.io/baseball/teams/12.png",
      countryName: "MLB",
      rank: 5,
      homeSeasonRecord: "35승 39패",
      awaySeasonRecord: "22승 52패",
      seasonRemainingGames: "24경기",
      recent3Form: "YELLOW",
      staminaStatus: "GREEN",
      minutesPlayed14d: 0,
      totalMarketValue: "오피셜 팀",
      totalMarketValueNum: 1,
      starterPitcherInfo: {
        name: "카일 프리랜드",
        number: 21,
        throwsHand: "L",
        era: "4.95",
        whip: "1.38",
        wins: 5,
        losses: 8,
        inningsPitched: "109.0",
        strikeouts: 78,
        vsOpponentLogs: [
          { dateStr: "08.27", opponentName: "BAL", innings: "5.0", earnedRuns: 4, runs: 4, result: "패", decision: "선발" }
        ]
      },
      recentGamesLog: [
        { date: "08.31", opponent: "BAL", score: "4:5", result: "패", isHome: true },
        { date: "08.30", opponent: "BAL", score: "3:4", result: "패", isHome: true },
        { date: "08.28", opponent: "MIA", score: "8:12", result: "패", isHome: true }
      ]
    },
    awayTeam: {
      id: "a_g024_11",
      name: "볼티오리",
      logo: "https://media.api-sports.io/baseball/teams/4.png",
      countryName: "MLB",
      rank: 2,
      homeSeasonRecord: "44승 31패",
      awaySeasonRecord: "42승 31패",
      seasonRemainingGames: "23경기",
      recent3Form: "GREEN",
      staminaStatus: "GREEN",
      minutesPlayed14d: 0,
      totalMarketValue: "오피셜 팀",
      totalMarketValueNum: 2,
      starterPitcherInfo: {
        name: "코빈 번스",
        number: 39,
        throwsHand: "R",
        era: "2.92",
        whip: "1.10",
        wins: 15,
        losses: 8,
        inningsPitched: "194.1",
        strikeouts: 181,
        vsOpponentLogs: [
          { dateStr: "08.25", opponentName: "COL", innings: "7.0", earnedRuns: 1, runs: 1, result: "승", decision: "승리투수" }
        ]
      },
      recentGamesLog: [
        { date: "08.31", opponent: "COL", score: "5:4", result: "승", isHome: false },
        { date: "08.30", opponent: "COL", score: "4:3", result: "승", isHome: false },
        { date: "08.28", opponent: "LAD", score: "4:6", result: "패", isHome: false }
      ]
    },
    underOverFact: {
      last10OverRatio: 65,
      last10UnderRatio: 35,
      avgScoredGoals: 5.5,
      avgConcededGoals: 5.2,
      isFiveBack: false,
      tacticDescription: "야구 승1패 11번 경기: 쿠어스 필드 볼티모어 화력 우세"
    },
    isPitcherAnnounced: true,
    isDataCheckingPending: false
  },
  {
    id: "bm-g024-260064-12",
    betmanRound: "야구 승1패 260064회차 (betman.co.kr 오피셜 슬립)",
    betmanFolder: "SEUNG1PAE",
    betmanMatchNo: 12,
    sport: "baseball",
    league: "MLB",
    countryFlag: "⚾",
    isFavorite: false,
    betmanOdds: {
      win: 2.07,
      draw: 2.40,
      lose: 1.70
    },
    status: "SCHEDULED",
    matchTime: "09.02 (수) 10:38",
    closingTime: "09.02 (수) 10:38",
    venue: "에인절 스타디움",
    lineupAlertInfo: {
      isPublished: true,
      publishedTime: "베트맨 오피셜 라인업 팩트",
      alertText: "🚨 야구 승1패 12번 경기 [LA에인절 vs 뉴욕양키] 오피셜 선발 확정! (왈버트 우레냐 vs 엘머 로드리게스)",
      keyAbsenceNotice: "⚠️ 야구 승1패 12번 경기: 왈버트 우레냐 vs 엘머 로드리게스"
    },
    headToHeadRecord: {
      homeWins: 2,
      draws: 0,
      awayWins: 3,
      last5Matches: [
        { date: "08.08", homeTeam: "뉴욕 양키스", awayTeam: "LA 에인절스", score: "5:2", result: "패" },
        { date: "08.07", homeTeam: "뉴욕 양키스", awayTeam: "LA 에인절스", score: "2:8", result: "승" },
        { date: "05.30", homeTeam: "LA 에인절스", awayTeam: "뉴욕 양키스", score: "3:8", result: "패" },
        { date: "05.29", homeTeam: "LA 에인절스", awayTeam: "뉴욕 양키스", score: "4:3", result: "승" }
      ]
    },
    homeTeam: {
      id: "h_g024_12",
      name: "LA에인절",
      logo: "https://media.api-sports.io/baseball/teams/3.png",
      countryName: "MLB",
      rank: 5,
      homeSeasonRecord: "32승 42패",
      awaySeasonRecord: "31승 41패",
      seasonRemainingGames: "24경기",
      recent3Form: "YELLOW",
      staminaStatus: "GREEN",
      minutesPlayed14d: 0,
      totalMarketValue: "오피셜 팀",
      totalMarketValueNum: 1,
      starterPitcherInfo: {
        name: "왈버트 우레냐",
        number: 59,
        throwsHand: "R",
        era: "4.25",
        whip: "1.20",
        wins: 6,
        losses: 7,
        inningsPitched: "113.0",
        strikeouts: 97,
        vsOpponentLogs: [
          { dateStr: "08.08", opponentName: "NYY", innings: "6.0", earnedRuns: 1, runs: 1, result: "패", decision: "선발" }
        ]
      },
      recentGamesLog: [
        { date: "08.31", opponent: "SEA", score: "5:9", result: "패", isHome: true },
        { date: "08.30", opponent: "SEA", score: "3:2", result: "승", isHome: true },
        { date: "08.28", opponent: "DET", score: "2:6", result: "패", isHome: false }
      ]
    },
    awayTeam: {
      id: "a_g024_12",
      name: "뉴욕양키",
      logo: "https://media.api-sports.io/baseball/teams/1.png",
      countryName: "MLB",
      rank: 1,
      homeSeasonRecord: "44승 31패",
      awaySeasonRecord: "50승 27패",
      seasonRemainingGames: "23경기",
      recent3Form: "GREEN",
      staminaStatus: "GREEN",
      minutesPlayed14d: 0,
      totalMarketValue: "오피셜 팀",
      totalMarketValueNum: 2,
      starterPitcherInfo: {
        name: "엘머 로드리게스",
        number: 45,
        throwsHand: "R",
        era: "3.75",
        whip: "1.13",
        wins: 8,
        losses: 5,
        inningsPitched: "95.0",
        strikeouts: 99,
        vsOpponentLogs: [
          { dateStr: "08.08", opponentName: "LAA", innings: "6.0", earnedRuns: 0, runs: 0, result: "승", decision: "승리투수" }
        ]
      },
      recentGamesLog: [
        { date: "08.31", opponent: "STL", score: "7:14", result: "패", isHome: true },
        { date: "08.30", opponent: "STL", score: "6:3", result: "승", isHome: true },
        { date: "08.28", opponent: "WSH", score: "2:5", result: "패", isHome: false }
      ]
    },
    underOverFact: {
      last10OverRatio: 55,
      last10UnderRatio: 45,
      avgScoredGoals: 4.7,
      avgConcededGoals: 4.5,
      isFiveBack: false,
      tacticDescription: "야구 승1패 12번 경기: 양키스 타선 장타력 우위"
    },
    isPitcherAnnounced: true,
    isDataCheckingPending: false
  },
  {
    id: "bm-g024-260064-13",
    betmanRound: "야구 승1패 260064회차 (betman.co.kr 오피셜 슬립)",
    betmanFolder: "SEUNG1PAE",
    betmanMatchNo: 13,
    sport: "baseball",
    league: "MLB",
    countryFlag: "⚾",
    isFavorite: false,
    betmanOdds: {
      win: 1.86,
      draw: 2.35,
      lose: 1.82
    },
    status: "SCHEDULED",
    matchTime: "09.02 (수) 10:40",
    closingTime: "09.02 (수) 10:40",
    venue: "체이스 필드",
    lineupAlertInfo: {
      isPublished: true,
      publishedTime: "베트맨 오피셜 라인업 팩트",
      alertText: "🚨 야구 승1패 13번 경기 [애리다이 vs 필라필리] 오피셜 선발 확정! (브랜든 팟 vs 애런 놀라)",
      keyAbsenceNotice: "⚠️ 야구 승1패 13번 경기: 브랜든 팟 vs 애런 놀라 NL 빅매치"
    },
    headToHeadRecord: {
      homeWins: 3,
      draws: 0,
      awayWins: 3,
      last5Matches: [
        { date: "08.11", homeTeam: "애리조나 다이아몬드백스", awayTeam: "필라델피아 필리스", score: "12:5", result: "승" },
        { date: "08.10", homeTeam: "애리조나 다이아몬드백스", awayTeam: "필라델피아 필리스", score: "11:1", result: "승" },
        { date: "08.09", homeTeam: "애리조나 다이아몬드백스", awayTeam: "필라델피아 필리스", score: "3:2", result: "승" },
        { date: "06.23", homeTeam: "필라델피아 필리스", awayTeam: "애리조나 다이아몬드백스", score: "4:1", result: "패" }
      ]
    },
    homeTeam: {
      id: "h_g024_13",
      name: "애리다이",
      logo: "https://media.api-sports.io/baseball/teams/2.png",
      countryName: "MLB",
      rank: 2,
      homeSeasonRecord: "44승 31패",
      awaySeasonRecord: "45승 33패",
      seasonRemainingGames: "22경기",
      recent3Form: "GREEN",
      staminaStatus: "GREEN",
      minutesPlayed14d: 0,
      totalMarketValue: "오피셜 팀",
      totalMarketValueNum: 1,
      starterPitcherInfo: {
        name: "브랜든 팟",
        number: 32,
        throwsHand: "R",
        era: "4.21",
        whip: "1.23",
        wins: 10,
        losses: 10,
        inningsPitched: "181.2",
        strikeouts: 185,
        vsOpponentLogs: [
          { dateStr: "08.10", opponentName: "PHI", innings: "6.0", earnedRuns: 1, runs: 1, result: "승", decision: "승리투수" }
        ]
      },
      recentGamesLog: [
        { date: "08.31", opponent: "LAD", score: "9:10", result: "패", isHome: true },
        { date: "08.30", opponent: "LAD", score: "14:3", result: "승", isHome: true },
        { date: "08.28", opponent: "NYM", score: "8:5", result: "승", isHome: true }
      ]
    },
    awayTeam: {
      id: "a_g024_13",
      name: "필라필리",
      logo: "https://media.api-sports.io/baseball/teams/25.png",
      countryName: "MLB",
      rank: 1,
      homeSeasonRecord: "52승 26패",
      awaySeasonRecord: "43승 34패",
      seasonRemainingGames: "21경기",
      recent3Form: "GREEN",
      staminaStatus: "GREEN",
      minutesPlayed14d: 0,
      totalMarketValue: "오피셜 팀",
      totalMarketValueNum: 2,
      starterPitcherInfo: {
        name: "애런 놀라",
        number: 27,
        throwsHand: "R",
        era: "3.47",
        whip: "1.18",
        wins: 14,
        losses: 8,
        inningsPitched: "199.1",
        strikeouts: 197,
        vsOpponentLogs: [
          { dateStr: "08.10", opponentName: "ARI", innings: "5.0", earnedRuns: 4, runs: 4, result: "패", decision: "선발" }
        ]
      },
      recentGamesLog: [
        { date: "08.31", opponent: "ATL", score: "3:0", result: "승", isHome: true },
        { date: "08.30", opponent: "ATL", score: "2:7", result: "패", isHome: true },
        { date: "08.28", opponent: "HOU", score: "0:10", result: "패", isHome: true }
      ]
    },
    underOverFact: {
      last10OverRatio: 55,
      last10UnderRatio: 45,
      avgScoredGoals: 5.1,
      avgConcededGoals: 4.6,
      isFiveBack: false,
      tacticDescription: "야구 승1패 13번 경기: 체이스 필드 치열한 타격전 예상"
    },
    isPitcherAnnounced: true,
    isDataCheckingPending: false
  },
  {
    id: "bm-g024-260064-14",
    betmanRound: "야구 승1패 260064회차 (betman.co.kr 오피셜 슬립)",
    betmanFolder: "SEUNG1PAE",
    betmanMatchNo: 14,
    sport: "baseball",
    league: "MLB",
    countryFlag: "⚾",
    isFavorite: false,
    betmanOdds: {
      win: 1.52,
      draw: 2.70,
      lose: 2.30
    },
    status: "SCHEDULED",
    matchTime: "09.02 (수) 11:10",
    closingTime: "09.02 (수) 11:10",
    venue: "다저 스타디움",
    lineupAlertInfo: {
      isPublished: true,
      publishedTime: "베트맨 오피셜 라인업 팩트",
      alertText: "🚨 야구 승1패 14번 경기 [LA다저스 vs 세인카디] 오피셜 선발 확정! (야마모토 요시노부 vs 소니 그레이)",
      keyAbsenceNotice: "⚠️ 야구 승1패 14번 경기: 야마모토 요시노부 vs 소니 그레이 14번 최종전"
    },
    headToHeadRecord: {
      homeWins: 4,
      draws: 0,
      awayWins: 2,
      last5Matches: [
        { date: "08.18", homeTeam: "세인트루이스 카디널스", awayTeam: "LA 다저스", score: "1:2", result: "승" },
        { date: "08.17", homeTeam: "세인트루이스 카디널스", awayTeam: "LA 다저스", score: "5:2", result: "패" },
        { date: "08.16", homeTeam: "세인트루이스 카디널스", awayTeam: "LA 다저스", score: "6:7", result: "승" },
        { date: "03.31", homeTeam: "LA 다저스", awayTeam: "세인트루이스 카디널스", score: "5:4", result: "승" }
      ]
    },
    homeTeam: {
      id: "h_g024_14",
      name: "LA다저스",
      logo: "https://media.api-sports.io/baseball/teams/17.png",
      countryName: "MLB",
      rank: 1,
      homeSeasonRecord: "52승 28패",
      awaySeasonRecord: "46승 32패",
      seasonRemainingGames: "20경기",
      recent3Form: "GREEN",
      staminaStatus: "GREEN",
      minutesPlayed14d: 0,
      totalMarketValue: "오피셜 팀",
      totalMarketValueNum: 1,
      starterPitcherInfo: {
        name: "야마모토 요시노부",
        number: 18,
        throwsHand: "R",
        era: "2.92",
        whip: "1.08",
        wins: 11,
        losses: 3,
        inningsPitched: "123.1",
        strikeouts: 135,
        vsOpponentLogs: [
          { dateStr: "03.30", opponentName: "STL", innings: "5.0", earnedRuns: 0, runs: 0, result: "승", decision: "선발" }
        ]
      },
      recentGamesLog: [
        { date: "08.31", opponent: "ARI", score: "10:9", result: "승", isHome: false },
        { date: "08.30", opponent: "ARI", score: "3:14", result: "패", isHome: false },
        { date: "08.28", opponent: "BAL", score: "6:4", result: "승", isHome: true }
      ]
    },
    awayTeam: {
      id: "a_g024_14",
      name: "세인카디",
      logo: "https://media.api-sports.io/baseball/teams/30.png",
      countryName: "MLB",
      rank: 3,
      homeSeasonRecord: "44승 34패",
      awaySeasonRecord: "37승 41패",
      seasonRemainingGames: "21경기",
      recent3Form: "YELLOW",
      staminaStatus: "GREEN",
      minutesPlayed14d: 0,
      totalMarketValue: "오피셜 팀",
      totalMarketValueNum: 2,
      starterPitcherInfo: {
        name: "소니 그레이",
        number: 54,
        throwsHand: "R",
        era: "3.75",
        whip: "1.09",
        wins: 13,
        losses: 9,
        inningsPitched: "166.1",
        strikeouts: 203,
        vsOpponentLogs: [
          { dateStr: "08.18", opponentName: "LAD", innings: "6.0", earnedRuns: 2, runs: 2, result: "패", decision: "선발" }
        ]
      },
      recentGamesLog: [
        { date: "08.31", opponent: "NYY", score: "14:7", result: "승", isHome: false },
        { date: "08.30", opponent: "NYY", score: "3:6", result: "패", isHome: false },
        { date: "08.28", opponent: "SD", score: "2:3", result: "패", isHome: true }
      ]
    },
    underOverFact: {
      last10OverRatio: 50,
      last10UnderRatio: 50,
      avgScoredGoals: 5.0,
      avgConcededGoals: 4.0,
      isFiveBack: false,
      tacticDescription: "야구 승1패 14번 경기: 다저스 홈 야마모토 등판 우세"
    },
    isPitcherAnnounced: true,
    isDataCheckingPending: false
  }
];
