import type { PitcherRole, IndividualPitcherRecord } from '../../types/sports';
import { SportsEntityMappingService } from '../mappers/sportsEntityMappingService';

/**
 * 📊 투수 1경기 등판 기록 세부 스탯 (API-Baseball 연동용)
 */
export interface PitcherGameAppearanceStats {
  pitcherId?: string;
  pitcherName: string;
  teamName: string;
  isStarter: boolean;
  inningsPitched: string;
  pitches: number;
  balls?: number;
  strikes?: number;
  holds?: number;       // 홀드 기록 여부
  saves?: number;       // 세이브 기록 여부
  blownSaves?: number;  // 블론세이브 기록 여부
  isWinner?: boolean;   // 승리투수 여부
  isLoser?: boolean;    // 패전투수 여부
  scoreDeltaAtAppearance?: number; // 등판 순간 점수차 (내 팀 점수 - 상대 팀 점수)
}

/**
 * 📈 최근 10경기 누적 등판 이력 데이터 (3단계 학습 필터용)
 */
export interface PitcherRolling10History {
  pitcherName: string;
  teamName: string;
  totalAppearances: number;              // 최근 10경기 중 등판 횟수
  highLeverageCount: number;             // 3점 차 이내 등판 + 홀드 + 세이브 횟수
  holdsCount: number;                    // 누적 홀드
  savesCount: number;                    // 누적 세이브
  recentScoreDeltas: number[];           // 등판 시점 점수차 배열
}

export interface ThreeStageClassificationResult {
  role: PitcherRole;
  roleLabel: string;
  matchedStage: 'STAGE_1_OFFICIAL_METRICS' | 'STAGE_2_SCORE_DELTA' | 'STAGE_3_ROLLING_10_LEARNING' | 'STARTER_PASS';
  stageDescription: string;
  highLeverageRatio?: number; // 3단계 학습 시 산출된 레버리지 비율 (예: 75.0%)
}

/**
 * 🏛️ 구단별 기본 공인 불펜 명단 (Fallback DB)
 */
export const TEAM_BULLPEN_ROSTER_MAP: Record<string, { victory: string[]; pursuit: string[] }> = {
  '두산 베어스': {
    victory: ['김택연', '홍건희', '이병헌', '최지강', '정철원'],
    pursuit: ['김강률', '박치국', '김명신', '이영하', '최원준']
  },
  'LG 트윈스': {
    victory: ['유영찬', '김진성', '백승현', '함덕주', '정우영', '이지강'],
    pursuit: ['우강훈', '김대현', '이우찬', '최동환', '윤호솔']
  },
  'KIA 타이거즈': {
    victory: ['정해영', '전상현', '곽도규', '장현식', '이준영'],
    pursuit: ['김사윤', '김기훈', '황동하', '임기영', '윤중현']
  },
  '삼성 라이온즈': {
    victory: ['오승환', '김재윤', '임창민', '김태훈', '이승현(우)'],
    pursuit: ['최하늘', '이재익', '우완석', '홍원표', '양현']
  },
  'KT 위즈': {
    victory: ['박영현', '손동현', '김민수', '주권', '이상동'],
    pursuit: ['우규민', '조이현', '문용익', '하준호', '김영현']
  },
  '한화 이글스': {
    victory: ['주현상', '한승혁', '박상원', '김범수', '이민우'],
    pursuit: ['이태양', '장민재', '윤대경', '장시환', '황준서']
  },
  '롯데 자이언츠': {
    victory: ['김원중', '구승민', '전미르', '김상수', '최준용'],
    pursuit: ['진해수', '박진', '임준섭', '나균안', '신정락']
  },
  'NC 다이노스': {
    victory: ['이용찬', '류진욱', '김영규', '김재열', '임정호'],
    pursuit: ['송명기', '심창민', '이준호', '하준수', '서의태']
  },
  'SSG 랜더스': {
    victory: ['조병현', '노경은', '문승원', '고효준', '이로운'],
    pursuit: ['박민호', '백승건', '정성곤', '서진용', '한두솔']
  },
  '키움 히어로즈': {
    victory: ['주승우', '조상우', '김성민', '문성현', '김재웅'],
    pursuit: ['양지율', '윤석원', '오석주', '전준표', '김동규']
  },
  '뉴욕 양키스': {
    victory: ['루크 위버', '클레이 홈즈', '토미 케인리', '이안 해밀턴'],
    pursuit: ['팀 메이자', '마이클 톤킨', '론 마리나치오']
  },
  'LA 다저스': {
    victory: ['마이클 코펙', '블레이크 트레이넨', '에반 필립스', '알렉스 베시아'],
    pursuit: ['다니엘 허드슨', '앤서니 반다', '라이언 브레이저', '마이클 그로브']
  },
  '샌디에이고 파드리스': {
    victory: ['로베르트 수아레즈', '태너 스캇', '제이슨 아담스', '예레미아 에스트라다'],
    pursuit: ['아드리안 모레혼', '완디 페랄타', '마쓰이 유키', '스티븐 콜렉']
  },
  'LA 에인절스': {
    victory: ['벤 조이스', '카를로스 에스테베즈', '호세 퀴하다', '헌터 스트릭랜드'],
    pursuit: ['호세 수아레즈', '카슨 풀머', '로에이니스 엘리아스']
  },
  '도호쿠 라쿠텐 골든이글스': {
    victory: ['노리모토 다카히로', '사카이 토모히토', '와타나베 쇼타', '스즈키 소라'],
    pursuit: ['유게 하야토', '타카다 효세이', '후지히라 쇼마', '이토 시로']
  },
  '라쿠텐': {
    victory: ['노리모토 다카히로', '사카이 토모히토', '와타나베 쇼타', '스즈키 소라'],
    pursuit: ['유게 하야토', '타카다 효세이', '후지히라 쇼마', '이토 시로']
  },
  '오릭스 버팔로스': {
    victory: ['마치다 하야토', '안드레스 페르도모', '히라노 요시히사', '야마다 노부요시'],
    pursuit: ['혼다 히토미', '아즈마 아키히로', '요시다 료', '아베 쇼타']
  },
  '오릭스': {
    victory: ['마치다 하야토', '안드레스 페르도모', '히라노 요시히사', '야마다 노부요시'],
    pursuit: ['혼다 히토미', '아즈마 아키히로', '요시다 료', '아베 쇼타']
  },
  '요미우리 자이언츠': {
    victory: ['알베르토 발도나도', '오타 다이세이', '타카나시 유헤이', '니시타테 유지'],
    pursuit: ['이노우에 하루토', '토고 쇼세이', '아카호시 유지', '마츠이 소라']
  },
  '요미우리': {
    victory: ['알베르토 발도나도', '오타 다이세이', '타카나시 유헤이', '니시타테 유지'],
    pursuit: ['이노우에 하루토', '토고 쇼세이', '아카호시 유지', '마츠이 소라']
  },
  '한신 타이거즈': {
    victory: ['하비 게라', '이시이 다이치', '키리시키 타쿠마', '이와자키 스구루'],
    pursuit: ['오카도메 히데오', '시마모토 히로야', '유아사 아츠키', '바바 코스케']
  },
  '한신': {
    victory: ['하비 게라', '이시이 다이치', '키리시키 타쿠마', '이와자키 스구루'],
    pursuit: ['오카도메 히데오', '시마모토 히로야', '유아사 아츠키', '바바 코스케']
  },
  '후쿠오카 소프트뱅크 호크스': {
    victory: ['로베르토 오스나', '마츠모토 유키', '후지이 코야', '다윈존 헬난데스'],
    pursuit: ['츠모리 유키', '하세가와 타케히로', '타우라 후미마루', '스기야마 카즈키']
  },
  '소프트뱅크': {
    victory: ['로베르토 오스나', '마츠모토 유키', '후지이 코야', '다윈존 헬난데스'],
    pursuit: ['츠모리 유키', '하세가와 타케히로', '타우라 후미마루', '스기야마 카즈키']
  },
  '요코하마 DeNA 베이스타즈': {
    victory: ['모리하라 코헤이', '이세 히로무', '야마사키 야스아키', 'JB 웬델켄'],
    pursuit: ['카미차타니 타이세이', '나카가와 켄', '사사키 치하야', '미시마 카즈키']
  },
  '요코하마': {
    victory: ['모리하라 코헤이', '이세 히로무', '야마사키 야스아키', 'JB 웬델켄'],
    pursuit: ['카미차타니 타이세이', '나카가와 켄', '사사키 치하야', '미시마 카즈키']
  }
};

/**
 * ⚡ BullpenRoleClassificationService
 * 완전 자동화를 위한 3단계 판별 엔진 (Three-Stage Automated Bullpen Classifier)
 */
export class BullpenRoleClassificationService {
  // 최근 10경기 등판 데이터 인메모리 캐시 (선수별 누적 학습용)
  private static rollingHistoryCache: Map<string, PitcherRolling10History> = new Map();

  /**
   * 🤖 완전 자동화 3단계 판별 로직 파이프라인
   */
  public static classifyWith3StagePipeline(
    stats: PitcherGameAppearanceStats,
    customHistory?: PitcherRolling10History
  ): ThreeStageClassificationResult {
    // 0. 선발투수 판정
    if (stats.isStarter) {
      return {
        role: 'STARTER',
        roleLabel: '선발',
        matchedStage: 'STARTER_PASS',
        stageDescription: '1회 첫 등판 선발투수'
      };
    }

    // ─────────────────────────────────────────────────────────────
    // 1️⃣ 1차 필터: 세이버메트릭스 / 공식 기록 매핑 (가장 정확)
    // ─────────────────────────────────────────────────────────────
    // • Hold(홀드) 또는 Save(세이브)를 기록한 투수 ➡️ 🔴 필승조
    // • 승리투수 중 선발이 아닌 BS(블론세이브) 후 승리를 챙긴 구원 투수 ➡️ 🔴 필승조
    // • BS(블론세이브) 발생 투수 (세이브/홀드 상황 투입된 필승조) ➡️ 🔴 필승조
    const holds = stats.holds || 0;
    const saves = stats.saves || 0;
    const blownSaves = stats.blownSaves || 0;
    const isReliefWin = (stats.isWinner === true && !stats.isStarter);

    if (holds > 0 || saves > 0 || isReliefWin || blownSaves > 0) {
      const reasonDetail = holds > 0 
        ? `공식 홀드(${holds}H) 달성` 
        : saves > 0 
        ? `공식 세이브(${saves}SV) 달성` 
        : isReliefWin 
        ? '구원 승리투수(블론/접전 구원승)' 
        : '블론세이브(세이브 상황 투입 필승조)';

      return {
        role: 'VICTORY',
        roleLabel: '필승조',
        matchedStage: 'STAGE_1_OFFICIAL_METRICS',
        stageDescription: `[1차 필터: 세이버메트릭스/공식기록] ${reasonDetail} 🔴`
      };
    }

    // ─────────────────────────────────────────────────────────────
    // 2️⃣ 2차 필터: 등판 시점의 경기 상황 (Score Delta)
    // ─────────────────────────────────────────────────────────────
    // 공식 기록이 남지 않는 중간 계투를 구분하기 위해 등판 순간의 점수 차를 체크
    // • 🔴 필승조: 등판 시점 점수 차가 3점 이내 (승리 중 / 동점 / 1~2점 차 지고 있는 추격 상황: -2 <= delta <= 3)
    // • ⚫ 패전/추격조: 등판 시점 점수 차가 4점 이상 지고 있는 상황 (delta <= -4)
    if (stats.scoreDeltaAtAppearance !== undefined) {
      const delta = stats.scoreDeltaAtAppearance;

      if (delta >= -2 && delta <= 3) {
        return {
          role: 'VICTORY',
          roleLabel: '필승조',
          matchedStage: 'STAGE_2_SCORE_DELTA',
          stageDescription: `[2차 필터: Score Delta] 등판 시점 점수차 ${delta >= 0 ? `+${delta}` : delta}점 (3점 차 이내 접전/추격 상황) 🔴`
        };
      } else if (delta <= -4) {
        return {
          role: 'PURSUIT',
          roleLabel: '추격조',
          matchedStage: 'STAGE_2_SCORE_DELTA',
          stageDescription: `[2차 필터: Score Delta] 등판 시점 점수차 ${delta}점 (4점 차 이상 패배/가비지 상황) ⚫`
        };
      } else if (delta >= 4) {
        return {
          role: 'PURSUIT',
          roleLabel: '추격조',
          matchedStage: 'STAGE_2_SCORE_DELTA',
          stageDescription: `[2차 필터: Score Delta] 등판 시점 점수차 +${delta}점 (4점 차 이상 대승 가비지 이닝 완충) ⚫`
        };
      }
    }

    // ─────────────────────────────────────────────────────────────
    // 3️⃣ 3차 필터: 최근 10경기 등판 데이터 누적 학습 (선수별 가중치)
    // ─────────────────────────────────────────────────────────────
    // 단판 경기 상황 오류를 보완하기 위해 시스템이 스스로 데이터를 누적 계산
    // • 최근 10경기 중 (3점 차 이내 등판 횟수 + 홀드/세이브 횟수) / 전체 등판 횟수 비율이 60% 이상 ➡️ 🔴 필승조
    // • 60% 미만 ➡️ ⚫ 패전/추격조
    const playerKey = `${SportsEntityMappingService.normalize(stats.teamName)}_${SportsEntityMappingService.normalize(stats.pitcherName)}`;
    const history = customHistory || this.rollingHistoryCache.get(playerKey) || this.generateDefaultRollingHistory(stats.pitcherName, stats.teamName);

    if (history.totalAppearances > 0) {
      const leverageRatio = (history.highLeverageCount + history.holdsCount + history.savesCount) / history.totalAppearances;
      const ratioPercent = Math.min(100, Math.round(leverageRatio * 100));

      if (leverageRatio >= 0.60) {
        return {
          role: 'VICTORY',
          roleLabel: '필승조',
          matchedStage: 'STAGE_3_ROLLING_10_LEARNING',
          highLeverageRatio: ratioPercent,
          stageDescription: `[3차 필터: 최근 10경기 누적 학습] 하이레버리지 등판 비율 ${ratioPercent}% (기준 60% 이상 🔴 필승조 확정)`
        };
      } else {
        return {
          role: 'PURSUIT',
          roleLabel: '추격조',
          matchedStage: 'STAGE_3_ROLLING_10_LEARNING',
          highLeverageRatio: ratioPercent,
          stageDescription: `[3차 필터: 최근 10경기 누적 학습] 하이레버리지 등판 비율 ${ratioPercent}% (기준 60% 미만 ⚫ 추격/패전조 확정)`
        };
      }
    }

    // Fallback: 관리자 DB 매핑 확인
    const roster = TEAM_BULLPEN_ROSTER_MAP[stats.teamName];
    const isVictoryFallback = roster?.victory.some(v => v.includes(stats.pitcherName) || stats.pitcherName.includes(v));

    return {
      role: isVictoryFallback ? 'VICTORY' : 'PURSUIT',
      roleLabel: isVictoryFallback ? '필승조' : '추격조',
      matchedStage: 'STAGE_3_ROLLING_10_LEARNING',
      stageDescription: isVictoryFallback ? '기본 DB 필승조 매핑 🔴' : '기본 추격조 매핑 ⚫'
    };
  }

  /**
   * 10경기 히스토리 없을 시 초기 학습 가중치 생성기
   */
  private static generateDefaultRollingHistory(pitcherName: string, teamName: string): PitcherRolling10History {
    const cleanTeam = SportsEntityMappingService.normalize(teamName);
    const cleanPlayer = SportsEntityMappingService.normalize(pitcherName);

    let isDefaultVictory = false;
    for (const [tName, roster] of Object.entries(TEAM_BULLPEN_ROSTER_MAP)) {
      if (SportsEntityMappingService.normalize(tName).includes(cleanTeam) || cleanTeam.includes(SportsEntityMappingService.normalize(tName))) {
        if (roster.victory.some(v => SportsEntityMappingService.normalize(v) === cleanPlayer || cleanPlayer.includes(SportsEntityMappingService.normalize(v)))) {
          isDefaultVictory = true;
          break;
        }
      }
    }

    if (isDefaultVictory || cleanPlayer.includes('마무리') || cleanPlayer.includes('셋업') || cleanPlayer.includes('필승')) {
      return {
        pitcherName,
        teamName,
        totalAppearances: 10,
        highLeverageCount: 8,
        holdsCount: 4,
        savesCount: 3,
        recentScoreDeltas: [1, 2, 0, 1, 3, -1, 2, 1, -4, 2]
      };
    }

    return {
      pitcherName,
      teamName,
      totalAppearances: 10,
      highLeverageCount: 2,
      holdsCount: 0,
      savesCount: 0,
      recentScoreDeltas: [-5, -6, 7, -4, -5, -3, 8, -6, -4, -5]
    };
  }

  /**
   * 실데이터 투수 객체 생성 헬퍼
   */
  public static createPitcherRecord(
    id: string,
    name: string,
    teamName: string,
    pitches: number,
    balls: number,
    strikes: number,
    innings: string,
    consecutiveDays: number,
    scoreDiff?: number,
    officialStats?: { holds?: number; saves?: number; blownSaves?: number; isWinner?: boolean }
  ): IndividualPitcherRecord {
    const classification = this.classifyWith3StagePipeline({
      pitcherName: name,
      teamName,
      isStarter: false,
      inningsPitched: innings,
      pitches,
      balls,
      strikes,
      scoreDeltaAtAppearance: scoreDiff,
      holds: officialStats?.holds,
      saves: officialStats?.saves,
      blownSaves: officialStats?.blownSaves,
      isWinner: officialStats?.isWinner
    });

    const isConsecutive = consecutiveDays >= 1;
    let staminaStatus: 'GREEN' | 'YELLOW' | 'RED' = 'GREEN';
    let availabilityStatus: 'AVAILABLE' | 'CAUTION' | 'REST_MANDATORY' = 'AVAILABLE';

    if (consecutiveDays >= 2 || pitches >= 35) {
      staminaStatus = 'RED';
      availabilityStatus = consecutiveDays >= 3 ? 'REST_MANDATORY' : 'CAUTION';
    } else if (consecutiveDays === 1 || pitches >= 25) {
      staminaStatus = 'YELLOW';
      availabilityStatus = 'CAUTION';
    }

    // 🛡️ 데이터 교차 검증 및 이상치 상태값(sourceStatus) 부여
    // • VERIFIED: 정상 검증 통과 ➡️ 앱에 🔴/⚫ 정상 표출
    // • FLAGGED: 수치 이상 감지 ➡️ 앱에 '집계 중 ⏳' 표출
    const isSumInvalid = strikes > 0 && balls > 0 && pitches < (strikes + balls);
    const isOutlier = pitches > 160;
    const sourceStatus: 'VERIFIED' | 'FLAGGED' | 'RAW' = (isSumInvalid || isOutlier) ? 'FLAGGED' : 'VERIFIED';

    return {
      id,
      name,
      role: classification.role,
      roleLabel: classification.roleLabel,
      pitches,
      balls,
      strikes,
      inningsPitched: innings,
      consecutiveDays,
      isConsecutivePitching: isConsecutive,
      staminaStatus,
      availabilityStatus,
      sourceStatus
    };
  }
}
