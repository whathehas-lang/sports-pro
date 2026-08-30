export type FormColorStatus = 'GREEN' | 'YELLOW' | 'RED';
export type BetmanFolderCategory = 'ALL' | 'SEUNG5PAE' | 'SEUNGMUBAE' | 'SEUNGBUSHIK' | 'SEUNGMUPAE' | 'SEUNG1PAE' | 'HANDICAP' | 'UNDER_OVER' | 'GIROKSIK';
export type MembershipTier = 'FREE' | 'VIP' | 'VVIP';
export type ViewMode = 'VERTICAL_LIST' | 'CARD_GRID' | 'APP' | 'PC_WEB';

export interface RecentGameLog {
  dateStr: string;
  opponentName: string;
  homeOrAway: 'HOME' | 'AWAY';
  teamScore: number;
  opponentScore: number;
  resultStr: '승' | '패' | '무';
}

export interface PitcherOpponentGameLog {
  dateStr: string;
  opponentName: string;
  decisionStr: '승' | '패' | '노디시전';
  inningsPitched: string;
  runsAllowed: number;
  earnedRuns: number;
  strikeouts: number;
  pitchesCount: number;
  gameEra: string;
}

export interface StarterPitcherInfo {
  name: string;
  era: string;
  record?: string;
  winLoss?: string;
  strikeouts?: number;
  seasonInningsPitched?: string;
  vsOpponentEra?: string;
  vsOpponentInnings?: string;
  vsOpponentWinLoss?: string;
  comparisonAnalysisText?: string;
  vsOpponentSummary?: string;
  recentFormText?: string;
  vsOpponentLogs?: PitcherOpponentGameLog[];
}

export interface SeriesGamePitchLog {
  gameNumber: number;
  gameDateStr: string;
  homeStarterName: string;
  homeStarterPitches: number;
  homeBullpenTotalPitches: number;
  homeBullpenPitchersText: string;
  awayStarterName: string;
  awayStarterPitches: number;
  awayBullpenTotalPitches: number;
  awayBullpenPitchersText: string;
}

export interface TodaySeriesMatchupInfo {
  gameDateStr: string;
  homeStarterName: string;
  homeStarterSeasonEra: string;
  homeStarterVsOpponentEra: string;
  homeStarterFormBadge: { label: string; isUp: boolean };
  homeBullpenExpectation: string;
  awayStarterName: string;
  awayStarterSeasonEra: string;
  awayStarterVsOpponentEra: string;
  awayStarterFormBadge: { label: string; isUp: boolean };
  awayBullpenExpectation: string;
}

export interface BaseballSeriesPitchTracker {
  seriesName: string;
  currentGameIndex: number;
  totalGamesInSeries: number;
  homeSeriesBullpenPitchesTotal: number;
  awaySeriesBullpenPitchesTotal: number;
  bullpenOverloadSummaryText: string;
  games: SeriesGamePitchLog[];
  todayMatchupInfo?: TodaySeriesMatchupInfo;
}

export interface BaseballParkReport {
  parkName: string;
  league: string;
  parkFactor: number;
  parkType: string;
  stadiumFeaturesDescription: string;
  windDirectionSpeed: string;
  vvipSensitivityAlert: string;
}

export interface BasketballTeamFatigueInfo {
  teamName: string;
  isBackToBack: boolean; // 백투백 (24시간 미만 연속 경기) 여부
  restHours: number; // 휴식 시간 (시간 단위 수치화)
  restDaysLabel: string; // '0일 (20시간 백투백 🔴)' vs '2일 휴식 (68시간 🟢)'
  travelDistanceKm: number; // 최근 7일 비행 이동거리 (km 단위 수치화)
  timeZoneChanges: number; // 시차 변동 (시간 단위 수치화)
  recentScheduleNotice: string; // 최근 일정 (예: '최근 6일간 4경기 강행군 🔴')
  fatigueLevel: FormColorStatus;
  fatigueStatusText: string;
}

export interface BasketballTravelFatigueTracker {
  summaryText: string;
  homeFatigue: BasketballTeamFatigueInfo;
  awayFatigue: BasketballTeamFatigueInfo;
  vvipSensitivityAlert: string;
}

export interface OfficialPlayerInfo {
  id: string;
  name: string;
  number: number;
  position: string;
  marketValue: string;
  marketValueNum: number;
  seasonAvgStat: string;
  recent3FormStat: string;
  formStatus: FormColorStatus;
  stamina: FormColorStatus;
  minutesPlayed14d: number;
  tierCategory?: '1GUN_STARTER' | '2GUN_SUBSTITUTE'; // 1군 주전 vs 2군 대체 선발
  substituteReason?: string; // 2군 대체선발 사유
  yellowCardCount?: number; // 시즌 옐로카드 누적 개수 (예: 4장)
  isCardSuspensionRisk?: boolean; // 🟨 1장 추가 시 다음 경기 출장정지 징계 위험 여부
  isHotForm?: boolean; // 👑🔥 최근 3경기 폼 절정 흐름 최고 활약자 (황금빛 아우라)
  recentMatchGoals?: number; // ⚽ 직전 경기 득점 수 (예: 1골, 2골)
  recentMatchAssists?: number; // 🅰️ 직전 경기 어시스트 수 (예: 1도움)
}

export interface OfficialTeamLineup {
  formation: string;
  starting11Value: string;
  starting11ValueNum: number;
  players: OfficialPlayerInfo[];
}

export interface HeadToHeadMatch {
  dateStr: string;
  homeScore: number;
  awayScore: number;
  winnerName: string;
}

export interface HeadToHeadRecord {
  summaryText: string;
  homeWins: number;
  draws: number;
  awayWins: number;
  last5Matches: HeadToHeadMatch[];
}

export interface Team {
  id: string;
  name: string;
  logo: string;
  countryName: string;
  rank: number;
  homeSeasonRecord: string;
  awaySeasonRecord: string;
  seasonRemainingGames: string;
  recent3Form: FormColorStatus;
  staminaStatus: FormColorStatus;
  minutesPlayed14d: number;
  totalMarketValue: string;
  totalMarketValueNum: number;
  bullpenStatus?: FormColorStatus;
  starterPitcherInfo?: StarterPitcherInfo;
  recentGamesLog?: RecentGameLog[];
  xgStats?: {
    avgXg: number; // ⚽ 순수 정규 리그 평균 기대득점
    avgXga: number; // 🛡️ 순수 정규 리그 평균 기대실점 (수비 위험도)
    xgMargin: number; // 📈 xG 순수 마진 (avgXg - avgXga)
    finishingEfficiency: string; // 💡 골 결정력 효율성 (예: '+18% (결정력 우수)')
  };
}

export interface Match {
  id: string;
  betmanRound: string;
  betmanFolder: string;
  betmanMatchNo: number;
  betmanGameType?: '일반' | '핸디캡' | '언더오버' | '전반전' | '홀짝' | 'SUM';
  handicapValue?: string;
  sport: 'football' | 'baseball' | 'basketball' | 'volleyball';
  league: string;
  countryFlag: string;
  isFavorite: boolean;
  lineupAlertInfo: {
    isPublished: boolean;
    publishedTime: string;
    alertText: string;
    keyAbsenceNotice: string;
  };
  headToHeadRecord?: HeadToHeadRecord;
  homeTeam: Team;
  awayTeam: Team;
  homeScore?: number;
  awayScore?: number;
  status: 'SCHEDULED' | 'LIVE' | 'FINISHED';
  matchTime: string;
  closingTime: string;
  venue: string;
  underOverFact: {
    last10OverRatio: number;
    last10UnderRatio: number;
    avgScoredGoals: number;
    avgConcededGoals: number;
    isFiveBack: boolean;
    tacticDescription: string;
  };
  homeOfficialLineup?: OfficialTeamLineup;
  awayOfficialLineup?: OfficialTeamLineup;
  baseballSeriesPitchTracker?: BaseballSeriesPitchTracker;
  baseballParkReport?: BaseballParkReport;
  basketballTravelFatigueTracker?: BasketballTravelFatigueTracker;
}

export interface CommunityPost {
  id: string;
  category: 'ALL' | 'FOOTBALL' | 'BASEBALL' | 'BASKETBALL';
  title: string;
  content: string;
  authorName: string;
  authorAvatar: string;
  attachedMatchNo?: number;
  isVvipOnly?: boolean;
  createdAt: string;
  views: number;
  likes: number;
  commentsCount: number;
  tags: string[];
  comments: {
    id: string;
    authorName: string;
    authorBadge: string;
    authorAvatar: string;
    content: string;
    createdAt: string;
    likes: number;
  }[];
}
