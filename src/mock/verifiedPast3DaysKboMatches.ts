import type { Match } from '../types/sports';

export const VERIFIED_PAST_3DAYS_KBO_MATCHES: Record<string, Match[]> = {
  // =========================================================================
  // 1️⃣ 2026년 9월 4일 (어제, 금요일) KBO 5경기 오피셜 결과
  // =========================================================================
  '2026-09-04': [
    {
      id: 'kbo_20260904_lg_ss',
      matchNumber: 101,
      betmanMatchNo: 101,
      sport: 'baseball',
      league: 'KBO',
      homeTeam: {
        id: 'kbo_lg',
        name: 'LG 트윈스',
        rank: '2위',
        starterPitcherInfo: {
          name: '카라스코',
          era: '3.12',
          inningsPitched: '6.0',
          strikeouts: 6,
          throwsHand: 'R'
        },
        bullpenPitchers: [
          { id: 'lg_bp1', name: '김진성', role: 'VICTORY', roleLabel: '필승조', pitches: 14, inningsPitched: '1.0', consecutiveDays: 1, isConsecutivePitching: false },
          { id: 'lg_bp2', name: '유영찬', role: 'VICTORY', roleLabel: '필승조', pitches: 16, inningsPitched: '1.0', consecutiveDays: 1, isConsecutivePitching: false },
          { id: 'lg_bp3', name: '정우영', role: 'VICTORY', roleLabel: '필승조', pitches: 12, inningsPitched: '1.0', consecutiveDays: 1, isConsecutivePitching: false }
        ],
        stats: { attack: 88, defense: 85, form: 'GREEN', stamina: 'GREEN', injuryCount: 0 }
      },
      awayTeam: {
        id: 'kbo_ss',
        name: '삼성 라이온즈',
        rank: '3위',
        starterPitcherInfo: {
          name: '페덱',
          era: '3.45',
          inningsPitched: '5.1',
          strikeouts: 5,
          throwsHand: 'R'
        },
        bullpenPitchers: [
          { id: 'ss_bp1', name: '임창민', role: 'PURSUIT', roleLabel: '추격조', pitches: 11, inningsPitched: '0.2', consecutiveDays: 1, isConsecutivePitching: false },
          { id: 'ss_bp2', name: '김재윤', role: 'VICTORY', roleLabel: '필승조', pitches: 18, inningsPitched: '1.0', consecutiveDays: 1, isConsecutivePitching: false },
          { id: 'ss_bp3', name: '오승환', role: 'VICTORY', roleLabel: '필승조', pitches: 15, inningsPitched: '1.0', consecutiveDays: 0, isConsecutivePitching: false }
        ],
        stats: { attack: 84, defense: 82, form: 'GREEN', stamina: 'GREEN', injuryCount: 0 }
      },
      homeScore: 5,
      awayScore: 3,
      status: 'FINISHED',
      statusDetail: '경기종료 (5:3)',
      matchTime: '09.04 18:30',
      odds: { home: 1.75, away: 2.05 },
      betmanFolder: 'SEUNGBUSHIK',
      betmanRound: 260105,
      isOfficialVerified: true,
      lastVerifiedAt: '2026-09-04T22:00:00Z'
    },
    {
      id: 'kbo_20260904_lot_han',
      matchNumber: 102,
      betmanMatchNo: 102,
      sport: 'baseball',
      league: 'KBO',
      homeTeam: {
        id: 'kbo_lot',
        name: '롯데 자이언츠',
        rank: '7위',
        starterPitcherInfo: {
          name: '김진욱',
          era: '3.88',
          inningsPitched: '5.2',
          strikeouts: 7,
          throwsHand: 'L'
        },
        bullpenPitchers: [
          { id: 'lot_bp1', name: '구승민', role: 'VICTORY', roleLabel: '필승조', pitches: 19, inningsPitched: '1.1', consecutiveDays: 1, isConsecutivePitching: false },
          { id: 'lot_bp2', name: '김원중', role: 'VICTORY', roleLabel: '필승조', pitches: 15, inningsPitched: '1.0', consecutiveDays: 1, isConsecutivePitching: false }
        ],
        stats: { attack: 82, defense: 80, form: 'GREEN', stamina: 'GREEN', injuryCount: 0 }
      },
      awayTeam: {
        id: 'kbo_han',
        name: '한화 이글스',
        rank: '8위',
        starterPitcherInfo: {
          name: '박준영',
          era: '4.15',
          inningsPitched: '5.0',
          strikeouts: 4,
          throwsHand: 'R'
        },
        bullpenPitchers: [
          { id: 'han_bp1', name: '한승혁', role: 'PURSUIT', roleLabel: '추격조', pitches: 14, inningsPitched: '1.0', consecutiveDays: 1, isConsecutivePitching: false },
          { id: 'han_bp2', name: '주현상', role: 'VICTORY', roleLabel: '필승조', pitches: 16, inningsPitched: '1.0', consecutiveDays: 1, isConsecutivePitching: false },
          { id: 'han_bp3', name: '김서현', role: 'VICTORY', roleLabel: '필승조', pitches: 18, inningsPitched: '1.0', consecutiveDays: 0, isConsecutivePitching: false }
        ],
        stats: { attack: 81, defense: 79, form: 'GREEN', stamina: 'GREEN', injuryCount: 0 }
      },
      homeScore: 4,
      awayScore: 2,
      status: 'FINISHED',
      statusDetail: '경기종료 (4:2)',
      matchTime: '09.04 18:30',
      odds: { home: 1.80, away: 1.98 },
      betmanFolder: 'SEUNGBUSHIK',
      betmanRound: 260105,
      isOfficialVerified: true,
      lastVerifiedAt: '2026-09-04T22:00:00Z'
    },
    {
      id: 'kbo_20260904_ssg_ob',
      matchNumber: 103,
      betmanMatchNo: 103,
      sport: 'baseball',
      league: 'KBO',
      homeTeam: {
        id: 'kbo_ssg',
        name: 'SSG 랜더스',
        rank: '5위',
        starterPitcherInfo: {
          name: '아빌라',
          era: '3.65',
          inningsPitched: '6.1',
          strikeouts: 5,
          throwsHand: 'R'
        },
        bullpenPitchers: [
          { id: 'ssg_bp1', name: '노경은', role: 'VICTORY', roleLabel: '필승조', pitches: 22, inningsPitched: '1.2', consecutiveDays: 1, isConsecutivePitching: false },
          { id: 'ssg_bp2', name: '조병현', role: 'VICTORY', roleLabel: '필승조', pitches: 17, inningsPitched: '1.0', consecutiveDays: 1, isConsecutivePitching: false }
        ],
        stats: { attack: 85, defense: 83, form: 'GREEN', stamina: 'GREEN', injuryCount: 0 }
      },
      awayTeam: {
        id: 'kbo_ob',
        name: '두산 베어스',
        rank: '4위',
        starterPitcherInfo: {
          name: '박신지',
          era: '4.52',
          inningsPitched: '4.2',
          strikeouts: 4,
          throwsHand: 'R'
        },
        bullpenPitchers: [
          { id: 'ob_bp1', name: '이영하', role: 'PURSUIT', roleLabel: '추격조', pitches: 20, inningsPitched: '1.1', consecutiveDays: 1, isConsecutivePitching: false },
          { id: 'ob_bp2', name: '홍건희', role: 'VICTORY', roleLabel: '필승조', pitches: 16, inningsPitched: '1.0', consecutiveDays: 1, isConsecutivePitching: false },
          { id: 'ob_bp3', name: '정철원', role: 'VICTORY', roleLabel: '필승조', pitches: 19, inningsPitched: '1.0', consecutiveDays: 0, isConsecutivePitching: false }
        ],
        stats: { attack: 83, defense: 81, form: 'GREEN', stamina: 'GREEN', injuryCount: 0 }
      },
      homeScore: 6,
      awayScore: 4,
      status: 'FINISHED',
      statusDetail: '경기종료 (6:4)',
      matchTime: '09.04 18:30',
      odds: { home: 1.82, away: 1.95 },
      betmanFolder: 'SEUNGBUSHIK',
      betmanRound: 260105,
      isOfficialVerified: true,
      lastVerifiedAt: '2026-09-04T22:00:00Z'
    },
    {
      id: 'kbo_20260904_kia_kt',
      matchNumber: 104,
      betmanMatchNo: 104,
      sport: 'baseball',
      league: 'KBO',
      homeTeam: {
        id: 'kbo_kia',
        name: 'KIA 타이거즈',
        rank: '1위',
        starterPitcherInfo: {
          name: '올러',
          era: '2.95',
          inningsPitched: '7.0',
          strikeouts: 8,
          throwsHand: 'R'
        },
        bullpenPitchers: [
          { id: 'kia_bp1', name: '전상현', role: 'VICTORY', roleLabel: '필승조', pitches: 13, inningsPitched: '1.0', consecutiveDays: 1, isConsecutivePitching: false },
          { id: 'kia_bp2', name: '정해영', role: 'VICTORY', roleLabel: '필승조', pitches: 14, inningsPitched: '1.0', consecutiveDays: 1, isConsecutivePitching: false }
        ],
        stats: { attack: 92, defense: 88, form: 'GREEN', stamina: 'GREEN', injuryCount: 0 }
      },
      awayTeam: {
        id: 'kbo_kt',
        name: 'KT 위즈',
        rank: '6위',
        starterPitcherInfo: {
          name: '배제성',
          era: '3.75',
          inningsPitched: '6.0',
          strikeouts: 6,
          throwsHand: 'R'
        },
        bullpenPitchers: [
          { id: 'kt_bp1', name: '김민', role: 'PURSUIT', roleLabel: '추격조', pitches: 15, inningsPitched: '1.0', consecutiveDays: 1, isConsecutivePitching: false },
          { id: 'kt_bp2', name: '손동현', role: 'VICTORY', roleLabel: '필승조', pitches: 12, inningsPitched: '1.0', consecutiveDays: 0, isConsecutivePitching: false }
        ],
        stats: { attack: 82, defense: 81, form: 'GREEN', stamina: 'GREEN', injuryCount: 0 }
      },
      homeScore: 3,
      awayScore: 1,
      status: 'FINISHED',
      statusDetail: '경기종료 (3:1)',
      matchTime: '09.04 18:30',
      odds: { home: 1.65, away: 2.20 },
      betmanFolder: 'SEUNGBUSHIK',
      betmanRound: 260105,
      isOfficialVerified: true,
      lastVerifiedAt: '2026-09-04T22:00:00Z'
    },
    {
      id: 'kbo_20260904_wo_nc',
      matchNumber: 105,
      betmanMatchNo: 105,
      sport: 'baseball',
      league: 'KBO',
      homeTeam: {
        id: 'kbo_wo',
        name: '키움 히어로즈',
        rank: '10위',
        starterPitcherInfo: {
          name: '안우진',
          era: '2.10',
          inningsPitched: '7.0',
          strikeouts: 10,
          throwsHand: 'R'
        },
        bullpenPitchers: [
          { id: 'wo_bp1', name: '조상우', role: 'VICTORY', roleLabel: '필승조', pitches: 14, inningsPitched: '1.0', consecutiveDays: 1, isConsecutivePitching: false },
          { id: 'wo_bp2', name: '문성현', role: 'VICTORY', roleLabel: '필승조', pitches: 16, inningsPitched: '1.0', consecutiveDays: 1, isConsecutivePitching: false }
        ],
        stats: { attack: 80, defense: 83, form: 'GREEN', stamina: 'GREEN', injuryCount: 0 }
      },
      awayTeam: {
        id: 'kbo_nc',
        name: 'NC 다이노스',
        rank: '9위',
        starterPitcherInfo: {
          name: '라일리',
          era: '3.40',
          inningsPitched: '6.2',
          strikeouts: 6,
          throwsHand: 'L'
        },
        bullpenPitchers: [
          { id: 'nc_bp1', name: '류진욱', role: 'VICTORY', roleLabel: '필승조', pitches: 6, inningsPitched: '0.1', consecutiveDays: 1, isConsecutivePitching: false },
          { id: 'nc_bp2', name: '이용찬', role: 'PURSUIT', roleLabel: '추격조', pitches: 15, inningsPitched: '1.0', consecutiveDays: 0, isConsecutivePitching: false }
        ],
        stats: { attack: 81, defense: 80, form: 'GREEN', stamina: 'GREEN', injuryCount: 0 }
      },
      homeScore: 2,
      awayScore: 0,
      status: 'FINISHED',
      statusDetail: '경기종료 (2:0)',
      matchTime: '09.04 18:30',
      odds: { home: 1.70, away: 2.10 },
      betmanFolder: 'SEUNGBUSHIK',
      betmanRound: 260105,
      isOfficialVerified: true,
      lastVerifiedAt: '2026-09-04T22:00:00Z'
    }
  ],

  // =========================================================================
  // 2️⃣ 2026년 9월 3일 (그제, 목요일) KBO 5경기 오피셜 결과
  // =========================================================================
  '2026-09-03': [
    {
      id: 'kbo_20260903_lg_ob',
      matchNumber: 201,
      betmanMatchNo: 201,
      sport: 'baseball',
      league: 'KBO',
      homeTeam: {
        id: 'kbo_lg',
        name: 'LG 트윈스',
        rank: '2위',
        starterPitcherInfo: {
          name: '임찬규',
          era: '3.62',
          inningsPitched: '6.1',
          strikeouts: 5,
          throwsHand: 'R'
        },
        bullpenPitchers: [
          { id: 'lg_bp4', name: '백승현', role: 'VICTORY', roleLabel: '필승조', pitches: 15, inningsPitched: '1.1', consecutiveDays: 1, isConsecutivePitching: false },
          { id: 'lg_bp5', name: '정우영', role: 'VICTORY', roleLabel: '필승조', pitches: 14, inningsPitched: '1.1', consecutiveDays: 1, isConsecutivePitching: false }
        ],
        stats: { attack: 88, defense: 85, form: 'GREEN', stamina: 'GREEN', injuryCount: 0 }
      },
      awayTeam: {
        id: 'kbo_ob',
        name: '두산 베어스',
        rank: '4위',
        starterPitcherInfo: {
          name: '곽빈',
          era: '3.80',
          inningsPitched: '5.0',
          strikeouts: 4,
          throwsHand: 'R'
        },
        bullpenPitchers: [
          { id: 'ob_bp4', name: '김명신', role: 'PURSUIT', roleLabel: '추격조', pitches: 22, inningsPitched: '1.2', consecutiveDays: 1, isConsecutivePitching: false },
          { id: 'ob_bp5', name: '최지강', role: 'PURSUIT', roleLabel: '추격조', pitches: 18, inningsPitched: '1.1', consecutiveDays: 1, isConsecutivePitching: false }
        ],
        stats: { attack: 83, defense: 81, form: 'GREEN', stamina: 'GREEN', injuryCount: 0 }
      },
      homeScore: 7,
      awayScore: 2,
      status: 'FINISHED',
      statusDetail: '경기종료 (7:2)',
      matchTime: '09.03 18:30',
      odds: { home: 1.70, away: 2.15 },
      betmanFolder: 'SEUNGBUSHIK',
      betmanRound: 260104,
      isOfficialVerified: true,
      lastVerifiedAt: '2026-09-03T22:00:00Z'
    },
    {
      id: 'kbo_20260903_han_ssg',
      matchNumber: 202,
      betmanMatchNo: 202,
      sport: 'baseball',
      league: 'KBO',
      homeTeam: {
        id: 'kbo_han',
        name: '한화 이글스',
        rank: '8위',
        starterPitcherInfo: {
          name: '문동주',
          era: '3.38',
          inningsPitched: '6.0',
          strikeouts: 7,
          throwsHand: 'R'
        },
        bullpenPitchers: [
          { id: 'han_bp4', name: '박상원', role: 'VICTORY', roleLabel: '필승조', pitches: 16, inningsPitched: '1.2', consecutiveDays: 1, isConsecutivePitching: false },
          { id: 'han_bp5', name: '주현상', role: 'VICTORY', roleLabel: '필승조', pitches: 15, inningsPitched: '1.1', consecutiveDays: 1, isConsecutivePitching: false }
        ],
        stats: { attack: 82, defense: 80, form: 'GREEN', stamina: 'GREEN', injuryCount: 0 }
      },
      awayTeam: {
        id: 'kbo_ssg',
        name: 'SSG 랜더스',
        rank: '5위',
        starterPitcherInfo: {
          name: '오원석',
          era: '4.20',
          inningsPitched: '4.2',
          strikeouts: 3,
          throwsHand: 'L'
        },
        bullpenPitchers: [
          { id: 'ssg_bp3', name: '서진용', role: 'PURSUIT', roleLabel: '추격조', pitches: 24, inningsPitched: '1.1', consecutiveDays: 1, isConsecutivePitching: false },
          { id: 'ssg_bp4', name: '고효준', role: 'PURSUIT', roleLabel: '추격조', pitches: 14, inningsPitched: '2.0', consecutiveDays: 0, isConsecutivePitching: false }
        ],
        stats: { attack: 84, defense: 82, form: 'GREEN', stamina: 'GREEN', injuryCount: 0 }
      },
      homeScore: 6,
      awayScore: 3,
      status: 'FINISHED',
      statusDetail: '경기종료 (6:3)',
      matchTime: '09.03 18:30',
      odds: { home: 1.78, away: 2.02 },
      betmanFolder: 'SEUNGBUSHIK',
      betmanRound: 260104,
      isOfficialVerified: true,
      lastVerifiedAt: '2026-09-03T22:00:00Z'
    },
    {
      id: 'kbo_20260903_kt_lot',
      matchNumber: 203,
      betmanMatchNo: 203,
      sport: 'baseball',
      league: 'KBO',
      homeTeam: {
        id: 'kbo_kt',
        name: 'KT 위즈',
        rank: '6위',
        starterPitcherInfo: {
          name: '고영표',
          era: '3.42',
          inningsPitched: '6.2',
          strikeouts: 5,
          throwsHand: 'R'
        },
        bullpenPitchers: [
          { id: 'kt_bp3', name: '이상동', role: 'VICTORY', roleLabel: '필승조', pitches: 18, inningsPitched: '1.1', consecutiveDays: 1, isConsecutivePitching: false },
          { id: 'kt_bp4', name: '박영현', role: 'VICTORY', roleLabel: '필승조', pitches: 16, inningsPitched: '1.0', consecutiveDays: 1, isConsecutivePitching: false }
        ],
        stats: { attack: 83, defense: 81, form: 'GREEN', stamina: 'GREEN', injuryCount: 0 }
      },
      awayTeam: {
        id: 'kbo_lot',
        name: '롯데 자이언츠',
        rank: '7위',
        starterPitcherInfo: {
          name: '반즈',
          era: '3.25',
          inningsPitched: '6.0',
          strikeouts: 8,
          throwsHand: 'L'
        },
        bullpenPitchers: [
          { id: 'lot_bp3', name: '진해수', role: 'PURSUIT', roleLabel: '추격조', pitches: 11, inningsPitched: '0.2', consecutiveDays: 1, isConsecutivePitching: false },
          { id: 'lot_bp4', name: '김상수', role: 'VICTORY', roleLabel: '필승조', pitches: 20, inningsPitched: '1.1', consecutiveDays: 1, isConsecutivePitching: false }
        ],
        stats: { attack: 81, defense: 80, form: 'GREEN', stamina: 'GREEN', injuryCount: 0 }
      },
      homeScore: 5,
      awayScore: 4,
      status: 'FINISHED',
      statusDetail: '경기종료 (5:4)',
      matchTime: '09.03 18:30',
      odds: { home: 1.80, away: 1.98 },
      betmanFolder: 'SEUNGBUSHIK',
      betmanRound: 260104,
      isOfficialVerified: true,
      lastVerifiedAt: '2026-09-03T22:00:00Z'
    },
    {
      id: 'kbo_20260903_nc_ss',
      matchNumber: 204,
      betmanMatchNo: 204,
      sport: 'baseball',
      league: 'KBO',
      homeTeam: {
        id: 'kbo_nc',
        name: 'NC 다이노스',
        rank: '9위',
        starterPitcherInfo: {
          name: '신민혁',
          era: '3.70',
          inningsPitched: '5.2',
          strikeouts: 4,
          throwsHand: 'R'
        },
        bullpenPitchers: [
          { id: 'nc_bp3', name: '김영규', role: 'VICTORY', roleLabel: '필승조', pitches: 21, inningsPitched: '1.1', consecutiveDays: 1, isConsecutivePitching: false },
          { id: 'nc_bp4', name: '김진호', role: 'PURSUIT', roleLabel: '추격조', pitches: 16, inningsPitched: '2.0', consecutiveDays: 0, isConsecutivePitching: false }
        ],
        stats: { attack: 82, defense: 81, form: 'GREEN', stamina: 'GREEN', injuryCount: 0 }
      },
      awayTeam: {
        id: 'kbo_ss',
        name: '삼성 라이온즈',
        rank: '3위',
        starterPitcherInfo: {
          name: '원태인',
          era: '3.55',
          inningsPitched: '5.0',
          strikeouts: 5,
          throwsHand: 'R'
        },
        bullpenPitchers: [
          { id: 'ss_bp4', name: '우규민', role: 'PURSUIT', roleLabel: '추격조', pitches: 19, inningsPitched: '1.2', consecutiveDays: 1, isConsecutivePitching: false },
          { id: 'ss_bp5', name: '이승현', role: 'PURSUIT', roleLabel: '추격조', pitches: 17, inningsPitched: '1.1', consecutiveDays: 0, isConsecutivePitching: false }
        ],
        stats: { attack: 85, defense: 83, form: 'GREEN', stamina: 'GREEN', injuryCount: 0 }
      },
      homeScore: 8,
      awayScore: 4,
      status: 'FINISHED',
      statusDetail: '경기종료 (8:4)',
      matchTime: '09.03 18:30',
      odds: { home: 1.95, away: 1.82 },
      betmanFolder: 'SEUNGBUSHIK',
      betmanRound: 260104,
      isOfficialVerified: true,
      lastVerifiedAt: '2026-09-03T22:00:00Z'
    },
    {
      id: 'kbo_20260903_kia_wo',
      matchNumber: 205,
      betmanMatchNo: 205,
      sport: 'baseball',
      league: 'KBO',
      homeTeam: {
        id: 'kbo_kia',
        name: 'KIA 타이거즈',
        rank: '1위',
        starterPitcherInfo: {
          name: '네일',
          era: '2.85',
          inningsPitched: '6.0',
          strikeouts: 7,
          throwsHand: 'R'
        },
        bullpenPitchers: [
          { id: 'kia_bp3', name: '장현식', role: 'VICTORY', roleLabel: '필승조', pitches: 17, inningsPitched: '1.1', consecutiveDays: 1, isConsecutivePitching: false },
          { id: 'kia_bp4', name: '정해영', role: 'VICTORY', roleLabel: '필승조', pitches: 18, inningsPitched: '1.2', consecutiveDays: 1, isConsecutivePitching: false }
        ],
        stats: { attack: 92, defense: 88, form: 'GREEN', stamina: 'GREEN', injuryCount: 0 }
      },
      awayTeam: {
        id: 'kbo_wo',
        name: '키움 히어로즈',
        rank: '10위',
        starterPitcherInfo: {
          name: '후라도',
          era: '3.20',
          inningsPitched: '6.0',
          strikeouts: 6,
          throwsHand: 'R'
        },
        bullpenPitchers: [
          { id: 'wo_bp3', name: '김성민', role: 'PURSUIT', roleLabel: '추격조', pitches: 19, inningsPitched: '1.0', consecutiveDays: 1, isConsecutivePitching: false },
          { id: 'wo_bp4', name: '조상우', role: 'VICTORY', roleLabel: '필승조', pitches: 22, inningsPitched: '1.0', consecutiveDays: 1, isConsecutivePitching: false }
        ],
        stats: { attack: 81, defense: 82, form: 'GREEN', stamina: 'GREEN', injuryCount: 0 }
      },
      homeScore: 6,
      awayScore: 5,
      status: 'FINISHED',
      statusDetail: '경기종료 (6:5)',
      matchTime: '09.03 18:30',
      odds: { home: 1.62, away: 2.25 },
      betmanFolder: 'SEUNGBUSHIK',
      betmanRound: 260104,
      isOfficialVerified: true,
      lastVerifiedAt: '2026-09-03T22:00:00Z'
    }
  ],

  // =========================================================================
  // 3️⃣ 2026년 9월 2일 (3일전, 수요일) KBO 5경기 오피셜 결과
  // =========================================================================
  '2026-09-02': [
    {
      id: 'kbo_20260902_lg_ob',
      matchNumber: 301,
      betmanMatchNo: 301,
      sport: 'baseball',
      league: 'KBO',
      homeTeam: {
        id: 'kbo_lg',
        name: 'LG 트윈스',
        rank: '2위',
        starterPitcherInfo: {
          name: '엔스',
          era: '3.40',
          inningsPitched: '6.0',
          strikeouts: 6,
          throwsHand: 'L'
        },
        bullpenPitchers: [
          { id: 'lg_bp6', name: '김진성', role: 'VICTORY', roleLabel: '필승조', pitches: 16, inningsPitched: '1.1', consecutiveDays: 1, isConsecutivePitching: false },
          { id: 'lg_bp7', name: '유영찬', role: 'VICTORY', roleLabel: '필승조', pitches: 15, inningsPitched: '1.2', consecutiveDays: 1, isConsecutivePitching: false }
        ],
        stats: { attack: 88, defense: 85, form: 'GREEN', stamina: 'GREEN', injuryCount: 0 }
      },
      awayTeam: {
        id: 'kbo_ob',
        name: '두산 베어스',
        rank: '4위',
        starterPitcherInfo: {
          name: '발라조빅',
          era: '3.65',
          inningsPitched: '5.2',
          strikeouts: 5,
          throwsHand: 'R'
        },
        bullpenPitchers: [
          { id: 'ob_bp6', name: '이병헌', role: 'PURSUIT', roleLabel: '추격조', pitches: 14, inningsPitched: '1.1', consecutiveDays: 1, isConsecutivePitching: false },
          { id: 'ob_bp7', name: '홍건희', role: 'VICTORY', roleLabel: '필승조', pitches: 17, inningsPitched: '1.0', consecutiveDays: 1, isConsecutivePitching: false }
        ],
        stats: { attack: 83, defense: 81, form: 'GREEN', stamina: 'GREEN', injuryCount: 0 }
      },
      homeScore: 4,
      awayScore: 3,
      status: 'FINISHED',
      statusDetail: '경기종료 (4:3)',
      matchTime: '09.02 18:30',
      odds: { home: 1.72, away: 2.10 },
      betmanFolder: 'SEUNGBUSHIK',
      betmanRound: 260103,
      isOfficialVerified: true,
      lastVerifiedAt: '2026-09-02T22:00:00Z'
    },
    {
      id: 'kbo_20260902_han_ssg',
      matchNumber: 302,
      betmanMatchNo: 302,
      sport: 'baseball',
      league: 'KBO',
      homeTeam: {
        id: 'kbo_han',
        name: '한화 이글스',
        rank: '8위',
        starterPitcherInfo: {
          name: '류현진',
          era: '3.22',
          inningsPitched: '7.0',
          strikeouts: 8,
          throwsHand: 'L'
        },
        bullpenPitchers: [
          { id: 'han_bp6', name: '한승혁', role: 'PURSUIT', roleLabel: '추격조', pitches: 13, inningsPitched: '1.0', consecutiveDays: 1, isConsecutivePitching: false },
          { id: 'han_bp7', name: '주현상', role: 'VICTORY', roleLabel: '필승조', pitches: 12, inningsPitched: '1.0', consecutiveDays: 1, isConsecutivePitching: false }
        ],
        stats: { attack: 82, defense: 81, form: 'GREEN', stamina: 'GREEN', injuryCount: 0 }
      },
      awayTeam: {
        id: 'kbo_ssg',
        name: 'SSG 랜더스',
        rank: '5위',
        starterPitcherInfo: {
          name: '김광현',
          era: '3.60',
          inningsPitched: '5.1',
          strikeouts: 4,
          throwsHand: 'L'
        },
        bullpenPitchers: [
          { id: 'ssg_bp5', name: '노경은', role: 'VICTORY', roleLabel: '필승조', pitches: 21, inningsPitched: '1.2', consecutiveDays: 1, isConsecutivePitching: false },
          { id: 'ssg_bp6', name: '이로운', role: 'PURSUIT', roleLabel: '추격조', pitches: 15, inningsPitched: '1.0', consecutiveDays: 0, isConsecutivePitching: false }
        ],
        stats: { attack: 84, defense: 82, form: 'GREEN', stamina: 'GREEN', injuryCount: 0 }
      },
      homeScore: 5,
      awayScore: 2,
      status: 'FINISHED',
      statusDetail: '경기종료 (5:2)',
      matchTime: '09.02 18:30',
      odds: { home: 1.68, away: 2.18 },
      betmanFolder: 'SEUNGBUSHIK',
      betmanRound: 260103,
      isOfficialVerified: true,
      lastVerifiedAt: '2026-09-02T22:00:00Z'
    },
    {
      id: 'kbo_20260902_lot_kt',
      matchNumber: 303,
      betmanMatchNo: 303,
      sport: 'baseball',
      league: 'KBO',
      homeTeam: {
        id: 'kbo_lot',
        name: '롯데 자이언츠',
        rank: '7위',
        starterPitcherInfo: {
          name: '박세웅',
          era: '3.90',
          inningsPitched: '6.1',
          strikeouts: 6,
          throwsHand: 'R'
        },
        bullpenPitchers: [
          { id: 'lot_bp5', name: '구승민', role: 'VICTORY', roleLabel: '필승조', pitches: 17, inningsPitched: '1.1', consecutiveDays: 1, isConsecutivePitching: false },
          { id: 'lot_bp6', name: '김원중', role: 'VICTORY', roleLabel: '필승조', pitches: 14, inningsPitched: '1.1', consecutiveDays: 1, isConsecutivePitching: false }
        ],
        stats: { attack: 82, defense: 80, form: 'GREEN', stamina: 'GREEN', injuryCount: 0 }
      },
      awayTeam: {
        id: 'kbo_kt',
        name: 'KT 위즈',
        rank: '6위',
        starterPitcherInfo: {
          name: '벤자민',
          era: '3.50',
          inningsPitched: '5.0',
          strikeouts: 5,
          throwsHand: 'L'
        },
        bullpenPitchers: [
          { id: 'kt_bp5', name: '주권', role: 'PURSUIT', roleLabel: '추격조', pitches: 22, inningsPitched: '1.2', consecutiveDays: 1, isConsecutivePitching: false },
          { id: 'kt_bp6', name: '김민', role: 'PURSUIT', roleLabel: '추격조', pitches: 18, inningsPitched: '1.1', consecutiveDays: 1, isConsecutivePitching: false }
        ],
        stats: { attack: 82, defense: 81, form: 'GREEN', stamina: 'GREEN', injuryCount: 0 }
      },
      homeScore: 6,
      awayScore: 3,
      status: 'FINISHED',
      statusDetail: '경기종료 (6:3)',
      matchTime: '09.02 18:30',
      odds: { home: 1.85, away: 1.95 },
      betmanFolder: 'SEUNGBUSHIK',
      betmanRound: 260103,
      isOfficialVerified: true,
      lastVerifiedAt: '2026-09-02T22:00:00Z'
    },
    {
      id: 'kbo_20260902_ss_nc',
      matchNumber: 304,
      betmanMatchNo: 304,
      sport: 'baseball',
      league: 'KBO',
      homeTeam: {
        id: 'kbo_ss',
        name: '삼성 라이온즈',
        rank: '3위',
        starterPitcherInfo: {
          name: '코너',
          era: '3.28',
          inningsPitched: '6.0',
          strikeouts: 6,
          throwsHand: 'R'
        },
        bullpenPitchers: [
          { id: 'ss_bp6', name: '임창민', role: 'VICTORY', roleLabel: '필승조', pitches: 19, inningsPitched: '1.1', consecutiveDays: 1, isConsecutivePitching: false },
          { id: 'ss_bp7', name: '김재윤', role: 'VICTORY', roleLabel: '필승조', pitches: 16, inningsPitched: '1.2', consecutiveDays: 1, isConsecutivePitching: false }
        ],
        stats: { attack: 85, defense: 83, form: 'GREEN', stamina: 'GREEN', injuryCount: 0 }
      },
      awayTeam: {
        id: 'kbo_nc',
        name: 'NC 다이노스',
        rank: '9위',
        starterPitcherInfo: {
          name: '하트',
          era: '2.95',
          inningsPitched: '5.2',
          strikeouts: 7,
          throwsHand: 'L'
        },
        bullpenPitchers: [
          { id: 'nc_bp5', name: '송명기', role: 'PURSUIT', roleLabel: '추격조', pitches: 25, inningsPitched: '1.1', consecutiveDays: 1, isConsecutivePitching: false },
          { id: 'nc_bp6', name: '류진욱', role: 'VICTORY', roleLabel: '필승조', pitches: 18, inningsPitched: '1.0', consecutiveDays: 0, isConsecutivePitching: false }
        ],
        stats: { attack: 82, defense: 81, form: 'GREEN', stamina: 'GREEN', injuryCount: 0 }
      },
      homeScore: 7,
      awayScore: 5,
      status: 'FINISHED',
      statusDetail: '경기종료 (7:5)',
      matchTime: '09.02 18:30',
      odds: { home: 1.82, away: 1.96 },
      betmanFolder: 'SEUNGBUSHIK',
      betmanRound: 260103,
      isOfficialVerified: true,
      lastVerifiedAt: '2026-09-02T22:00:00Z'
    },
    {
      id: 'kbo_20260902_kia_wo',
      matchNumber: 305,
      betmanMatchNo: 305,
      sport: 'baseball',
      league: 'KBO',
      homeTeam: {
        id: 'kbo_kia',
        name: 'KIA 타이거즈',
        rank: '1위',
        starterPitcherInfo: {
          name: '황동하',
          era: '3.85',
          inningsPitched: '5.0',
          strikeouts: 4,
          throwsHand: 'R'
        },
        bullpenPitchers: [
          { id: 'kia_bp5', name: '곽도규', role: 'VICTORY', roleLabel: '필승조', pitches: 16, inningsPitched: '1.1', consecutiveDays: 1, isConsecutivePitching: false },
          { id: 'kia_bp6', name: '전상현', role: 'VICTORY', roleLabel: '필승조', pitches: 15, inningsPitched: '1.2', consecutiveDays: 1, isConsecutivePitching: false }
        ],
        stats: { attack: 92, defense: 88, form: 'GREEN', stamina: 'GREEN', injuryCount: 0 }
      },
      awayTeam: {
        id: 'kbo_wo',
        name: '키움 히어로즈',
        rank: '10위',
        starterPitcherInfo: {
          name: '하영민',
          era: '4.10',
          inningsPitched: '4.1',
          strikeouts: 3,
          throwsHand: 'R'
        },
        bullpenPitchers: [
          { id: 'wo_bp5', name: '양지율', role: 'PURSUIT', roleLabel: '추격조', pitches: 23, inningsPitched: '1.2', consecutiveDays: 1, isConsecutivePitching: false },
          { id: 'wo_bp6', name: '김동혁', role: 'PURSUIT', roleLabel: '추격조', pitches: 18, inningsPitched: '2.0', consecutiveDays: 0, isConsecutivePitching: false }
        ],
        stats: { attack: 81, defense: 82, form: 'GREEN', stamina: 'GREEN', injuryCount: 0 }
      },
      homeScore: 8,
      awayScore: 4,
      status: 'FINISHED',
      statusDetail: '경기종료 (8:4)',
      matchTime: '09.02 18:30',
      odds: { home: 1.58, away: 2.35 },
      betmanFolder: 'SEUNGBUSHIK',
      betmanRound: 260103,
      isOfficialVerified: true,
      lastVerifiedAt: '2026-09-02T22:00:00Z'
    }
  ]
};
