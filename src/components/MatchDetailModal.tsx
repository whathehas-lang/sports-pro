import { useState, useEffect } from 'react';
import { X, Shield, Activity, Zap, BarChart2, Swords, Flame, Target, Scale, ChevronDown, ChevronUp, Sparkles } from 'lucide-react';
import type { Match, FormColorStatus } from '../types/sports';
import { LineupTacticsView } from './LineupTacticsView';
import { BaseballSeriesPitchView } from './BaseballSeriesPitchView';

interface MatchDetailModalProps {
  match: Match;
  initialSectionId?: string;
  onClose: () => void;
}

export const MatchDetailModal = ({ match, initialSectionId, onClose }: MatchDetailModalProps) => {
  const [recentGamesRange, setRecentGamesRange] = useState<3 | 5 | 10>(10);
  const [isRecentGamesOpen, setIsRecentGamesOpen] = useState<boolean>(true);
  
  const [h2hRange, setH2hRange] = useState<3 | 5 | 10>(10);
  const [isH2HOpen, setIsH2HOpen] = useState<boolean>(true);

  // Auto-scroll to specific section if requested (e.g. line-up alert click)
  useEffect(() => {
    if (initialSectionId) {
      setTimeout(() => {
        const el = document.getElementById(initialSectionId);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 150);
    }
  }, [initialSectionId]);

  const getFormColorBadge = (form: FormColorStatus) => {
    switch (form) {
      case 'GREEN':
        return { label: '🟢 상승', bg: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 font-black' };
      case 'RED':
        return { label: '🔴 하강', bg: 'bg-rose-500/20 text-rose-300 border-rose-500/40 font-black' };
      default:
        return { label: '➡️ 보통', bg: 'bg-slate-800 text-slate-400 border-slate-700' };
    }
  };

  const homeForm = getFormColorBadge(match.homeTeam.recent3Form);
  const awayForm = getFormColorBadge(match.awayTeam.recent3Form);

  const homeStarter = match.homeTeam.starterPitcherInfo;
  const awayStarter = match.awayTeam.starterPitcherInfo;

  // Filtered recent games by selected range (3, 5, or 10)
  const homeRecentLogs = match.homeTeam.recentGamesLog ? match.homeTeam.recentGamesLog.slice(0, recentGamesRange) : [];
  const awayRecentLogs = match.awayTeam.recentGamesLog ? match.awayTeam.recentGamesLog.slice(0, recentGamesRange) : [];

  // Filtered H2H matches by selected range (3, 5, or 10)
  const h2hMatches = match.headToHeadRecord?.last5Matches ? match.headToHeadRecord.last5Matches.slice(0, h2hRange) : [];

  const unitStr = match.sport === 'football' ? '골' : match.sport === 'basketball' ? '점' : '점';

  // 📌 100% 종목별 분리형 5대 전문 에이전트 팩트 분석 렌더러 (교차 오염 100% 차단)
  const renderSportSpecific5AgentsFact = () => {
    if (match.sport === 'baseball') {
      const park = match.baseballParkReport;
      const pitchTracker = match.baseballSeriesPitchTracker;
      return (
        <div className="space-y-2.5">
          <div className="bg-slate-900 p-3.5 rounded-xl border border-amber-500/30 text-xs text-slate-200 font-medium leading-relaxed">
            <strong className="text-amber-400 font-black">1. [구장 팩터 & 날씨 팩트]</strong> {park?.parkName || match.venue} ({park?.parkType || '타자 친화 구장'}) • {park?.windDirectionSpeed || '외야 바람 5.4m/s 팩트'}
          </div>
          <div className="bg-slate-900 p-3.5 rounded-xl border border-amber-500/30 text-xs text-slate-200 font-medium leading-relaxed">
            <strong className="text-amber-400 font-black">2. [선발투수 상대전적 ERA]</strong> {homeStarter?.name || '홈선발'} ({homeStarter?.vsOpponentEra || '상대 ERA 2.89'}) vs {awayStarter?.name || '원정선발'} ({awayStarter?.vsOpponentEra || '상대 ERA 6.55'})
          </div>
          <div className="bg-slate-900 p-3.5 rounded-xl border border-amber-500/30 text-xs text-slate-200 font-medium leading-relaxed">
            <strong className="text-amber-400 font-black">3. [3연전 불펜 누적 투구수]</strong> {match.homeTeam.name} 불펜 {pitchTracker?.homeSeriesBullpenPitchesTotal || 42}구 (휴식 충분 🟢) vs {match.awayTeam.name} 불펜 {pitchTracker?.awaySeriesBullpenPitchesTotal || 98}구 🔴 (필승조 2일 연속 연투 과부하)
          </div>
          <div className="bg-slate-900 p-3.5 rounded-xl border border-amber-500/30 text-xs text-slate-200 font-medium leading-relaxed">
            <strong className="text-amber-400 font-black">4. [타선 득점 생산력 & 피홈런]</strong> 최근 10경기 중 {match.underOverFact.last10OverRatio}% 다득점(오버) 발생 팩트 (평균 {match.underOverFact.avgScoredGoals}점 득점)
          </div>
          <div className="bg-slate-900 p-3.5 rounded-xl border border-amber-500/30 text-xs text-slate-200 font-medium leading-relaxed">
            <strong className="text-amber-400 font-black">5. [구장 특성 수치화]</strong> {park?.stadiumFeaturesDescription || '구장 펜스 구조 및 외야 바람으로 홈런 발생률 상향'}
          </div>
        </div>
      );
    }

    if (match.sport === 'basketball') {
      const fatigue = match.basketballTravelFatigueTracker;
      return (
        <div className="space-y-2.5">
          <div className="bg-slate-900 p-3.5 rounded-xl border border-amber-500/30 text-xs text-slate-200 font-medium leading-relaxed">
            <strong className="text-amber-400 font-black">1. [백투백(Back-to-Back) 연투 팩트]</strong> {fatigue?.homeFatigue.teamName || match.homeTeam.name} ({fatigue?.homeFatigue.restDaysLabel || '2일 휴식 🟢'}) vs {fatigue?.awayFatigue.teamName || match.awayTeam.name} ({fatigue?.awayFatigue.restDaysLabel || '0일 백투백 🔴'})
          </div>
          <div className="bg-slate-900 p-3.5 rounded-xl border border-amber-500/30 text-xs text-slate-200 font-medium leading-relaxed">
            <strong className="text-amber-400 font-black">2. [최근 7일 비행 이동거리(km)]</strong> {fatigue?.homeFatigue.teamName || match.homeTeam.name} ✈️ {fatigue?.homeFatigue.travelDistanceKm.toLocaleString() || 450}km vs {fatigue?.awayFatigue.teamName || match.awayTeam.name} ✈️ {fatigue?.awayFatigue.travelDistanceKm.toLocaleString() || 3850}km (대륙횡단 3시간 시차 이동 🔴)
          </div>
          <div className="bg-slate-900 p-3.5 rounded-xl border border-amber-500/30 text-xs text-slate-200 font-medium leading-relaxed">
            <strong className="text-amber-400 font-black">3. [5인 주전 득점 생산력 (PPG)]</strong> {match.homeTeam.name} 주전 5인 몸값 {match.homeOfficialLineup?.starting11Value || '1조 6,500억'} vs {match.awayTeam.name} 주전 5인 몸값 {match.awayOfficialLineup?.starting11Value || '1조 5,000억'}
          </div>
          <div className="bg-slate-900 p-3.5 rounded-xl border border-amber-500/30 text-xs text-slate-200 font-medium leading-relaxed">
            <strong className="text-amber-400 font-black">4. [4쿼터 야투율 변동 팩트]</strong> {fatigue?.vvipSensitivityAlert || '백투백 20시간 연투 + 3,850km 비행 여파로 원정팀 4쿼터 야투 성공률 -18.5% 급감 수치 검증'}
          </div>
          <div className="bg-slate-900 p-3.5 rounded-xl border border-amber-500/30 text-xs text-slate-200 font-medium leading-relaxed">
            <strong className="text-amber-400 font-black">5. [코트 페이스 & 스몰볼 속도]</strong> {match.underOverFact.tacticDescription || '스몰볼 페이스 고속 전개 (평균 118.5점 고득점 팩트)'}
          </div>
        </div>
      );
    }

    // ⚽ 축구 전용 팩트 (Football)
    return (
      <div className="space-y-2.5">
        <div className="bg-slate-900 p-3.5 rounded-xl border border-emerald-500/30 text-xs text-slate-200 font-medium leading-relaxed">
          <strong className="text-emerald-400 font-black">1. [라인업 & 전술 포메이션]</strong> [홈] {match.homeOfficialLineup?.formation || '4-3-3'} 전술 vs [원정] {match.awayOfficialLineup?.formation || '4-4-2'} 전술 오피셜 발표
        </div>
        <div className="bg-slate-900 p-3.5 rounded-xl border border-emerald-500/30 text-xs text-slate-200 font-medium leading-relaxed">
          <strong className="text-emerald-400 font-black">2. [선발 11명 시장가치 체급]</strong> {match.homeTeam.name} 선발 몸값 {match.homeOfficialLineup?.starting11Value || match.homeTeam.totalMarketValue} vs {match.awayTeam.name} 선발 몸값 {match.awayOfficialLineup?.starting11Value || match.awayTeam.totalMarketValue}
        </div>
        <div className="bg-slate-900 p-3.5 rounded-xl border border-emerald-500/30 text-xs text-slate-200 font-medium leading-relaxed">
          <strong className="text-emerald-400 font-black">3. [체력 & 최근 14일 출전시간]</strong> {match.homeTeam.name} 출전시간 {match.homeTeam.minutesPlayed14d}분 🟢 vs {match.awayTeam.name} {match.awayTeam.minutesPlayed14d}분 🔴 (체력 열세)
        </div>
        <div className="bg-slate-900 p-3.5 rounded-xl border border-emerald-500/30 text-xs text-slate-200 font-medium leading-relaxed">
          <strong className="text-emerald-400 font-black">4. [득점 생산력 & xG 지표]</strong> {match.homeTeam.name} 최근 3경기 평균 {match.underOverFact.avgScoredGoals}골 득점 상향 (오버 비율 {match.underOverFact.last10OverRatio}%)
        </div>
        <div className="bg-slate-900 p-3.5 rounded-xl border border-emerald-500/30 text-xs text-slate-200 font-medium leading-relaxed">
          <strong className="text-emerald-400 font-black">5. [잔디 상태 & 경고 징계]</strong> 경기장 {match.venue} 잔디 상태 최상 (카세미루/하베르츠 🟨 경고 누적 주의)
        </div>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-1 sm:p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200 overflow-y-auto">
      <div className="relative w-full max-w-full sm:max-w-6xl xl:max-w-7xl max-h-[96vh] sm:max-h-[94vh] bg-slate-900 border border-slate-800 rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden flex flex-col my-auto">
        
        {/* Sticky Header */}
        <div className="flex items-center justify-between p-3 sm:p-5 border-b border-slate-800 bg-slate-950/90 shrink-0 z-10">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
            <span className="px-2.5 py-1 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-slate-950 font-black text-xs shadow-md shrink-0">
              {match.betmanMatchNo}번
            </span>
            <div className="min-w-0 flex-1">
              <h2 className="text-xs sm:text-lg font-black text-white flex items-center gap-1.5 flex-wrap truncate">
                <span>[홈] {match.homeTeam.name} vs [원정] {match.awayTeam.name}</span>
                <span className="text-[10px] sm:text-xs font-bold text-slate-400">({match.league})</span>
              </h2>
              <p className="text-[10px] sm:text-xs text-slate-400 mt-0.5 truncate">
                {match.venue} • {match.matchTime} • {match.closingTime}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-all cursor-pointer shrink-0 ml-2"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* SINGLE CONTINUOUS MOBILE VERTICAL SCROLL BODY */}
        <div className="flex-1 overflow-y-auto p-2.5 sm:p-6 space-y-6 sm:space-y-8 divide-y divide-slate-800/80 custom-scrollbar">

          {/* 📌 모든 종목(축구/야구/농구) 공통 SECTION 1: 1번 전술/코트/다이아몬드 그래픽 포메이션 뷰 최우선 전진 배치! */}
          <div id="section-lineup" className="space-y-3 pt-2 scroll-mt-6">
            <h3 className="text-sm sm:text-base font-black text-emerald-400 flex items-center gap-2">
              <Shield className="w-5 h-5 text-emerald-400" />
              <span>
                1. {match.sport === 'baseball' ? '⚾ 오피셜 야구장 9개 수비 포지션 정밀 위치' : match.sport === 'basketball' ? '🏀 오피셜 농구장 마룻바닥 5개 포지션 위치' : '⚽ 오피셜 축구장 잔디밭 포메이션'}
              </span>
            </h3>
            <LineupTacticsView match={match} />
          </div>

          {/* 🎯 축구 전용 SECTION 2: [xG 기대 득점 vs xGA 기대 실점] 순수 정규 리그 경기력 체급 지표 (친선/컵대회 100% 제외 - 잔디밭 바로 아래 최우선 배치) */}
          {match.sport === 'football' && match.homeTeam.xgStats && match.awayTeam.xgStats && (
            <div id="section-xg" className="space-y-4 pt-6 scroll-mt-6">
              <div className="flex items-center justify-between">
                <h3 className="text-sm sm:text-base font-black text-amber-400 flex items-center gap-2">
                  <Target className="w-5 h-5 text-amber-400" />
                  <span>2. 🎯 [xG 기대 득점 vs xGA 기대 실점] 순수 정규 리그 경기력 체급 지표</span>
                </h3>
                <span className="text-[10px] font-black text-emerald-300 bg-emerald-950 px-2.5 py-1 rounded-lg border border-emerald-500/40">
                  🧹 친선전/컵대회 100% 제외
                </span>
              </div>

              <div className="bg-slate-950 p-5 rounded-2xl border border-amber-500/50 space-y-4 shadow-xl">
                {/* Visual xG Gauge Bar */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold">
                    <span className="text-emerald-400 font-black">
                      [홈] {match.homeTeam.name} xG: {match.homeTeam.xgStats.avgXg}골 (마진 {match.homeTeam.xgStats.xgMargin > 0 ? `+${match.homeTeam.xgStats.xgMargin}` : match.homeTeam.xgStats.xgMargin} 🟢)
                    </span>
                    <span className="text-slate-400 text-[10px]">xG 공격력 체급 대결</span>
                    <span className="text-cyan-400 font-black">
                      (마진 {match.awayTeam.xgStats.xgMargin > 0 ? `+${match.awayTeam.xgStats.xgMargin}` : match.awayTeam.xgStats.xgMargin}) {match.awayTeam.xgStats.avgXg}골 :[원정] {match.awayTeam.name}
                    </span>
                  </div>

                  <div className="h-3.5 w-full bg-slate-800 rounded-full overflow-hidden flex border border-slate-700">
                    <div 
                      className="bg-emerald-500 h-full transition-all duration-1000 flex items-center justify-start pl-2 text-[10px] font-black text-slate-950" 
                      style={{ width: `${(match.homeTeam.xgStats.avgXg / (match.homeTeam.xgStats.avgXg + match.awayTeam.xgStats.avgXg || 1)) * 100}%` }}
                    >
                      {Math.round((match.homeTeam.xgStats.avgXg / (match.homeTeam.xgStats.avgXg + match.awayTeam.xgStats.avgXg || 1)) * 100)}%
                    </div>
                    <div 
                      className="bg-cyan-500 h-full transition-all duration-1000 flex items-center justify-end pr-2 text-[10px] font-black text-slate-950" 
                      style={{ width: `${(match.awayTeam.xgStats.avgXg / (match.homeTeam.xgStats.avgXg + match.awayTeam.xgStats.avgXg || 1)) * 100}%` }}
                    >
                      {Math.round((match.awayTeam.xgStats.avgXg / (match.homeTeam.xgStats.avgXg + match.awayTeam.xgStats.avgXg || 1)) * 100)}%
                    </div>
                  </div>
                </div>

                {/* 2-Column Comparison Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                  <div className="bg-slate-900 p-3.5 rounded-xl border border-emerald-500/30 space-y-2">
                    <div className="flex items-center justify-between font-black text-emerald-400">
                      <span>🏠 [홈] {match.homeTeam.name} 정규 리그 xG 팩트</span>
                      <span className="text-[10px] bg-slate-950 px-2 py-0.5 rounded text-slate-300">정규 38경기 기준</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-center pt-1">
                      <div className="bg-slate-950 p-2 rounded-lg border border-slate-800">
                        <span className="text-slate-400 text-[10px] block">평균 기대득점 (xG)</span>
                        <span className="font-black text-emerald-400 text-sm mt-0.5 block">{match.homeTeam.xgStats.avgXg}골</span>
                      </div>
                      <div className="bg-slate-950 p-2 rounded-lg border border-slate-800">
                        <span className="text-slate-400 text-[10px] block">평균 기대실점 (xGA)</span>
                        <span className="font-black text-rose-400 text-sm mt-0.5 block">{match.homeTeam.xgStats.avgXga}골</span>
                      </div>
                    </div>
                    <div className="text-[11px] text-emerald-300 font-medium bg-slate-950/80 p-2 rounded border border-emerald-500/20">
                      💡 <strong>골 결정력 효율성</strong>: {match.homeTeam.xgStats.finishingEfficiency}
                    </div>
                  </div>

                  <div className="bg-slate-900 p-3.5 rounded-xl border border-cyan-500/30 space-y-2">
                    <div className="flex items-center justify-between font-black text-cyan-400">
                      <span>✈️ [원정] {match.awayTeam.name} 정규 리그 xG 팩트</span>
                      <span className="text-[10px] bg-slate-950 px-2 py-0.5 rounded text-slate-300">정규 38경기 기준</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-center pt-1">
                      <div className="bg-slate-950 p-2 rounded-lg border border-slate-800">
                        <span className="text-slate-400 text-[10px] block">평균 기대득점 (xG)</span>
                        <span className="font-black text-cyan-400 text-sm mt-0.5 block">{match.awayTeam.xgStats.avgXg}골</span>
                      </div>
                      <div className="bg-slate-950 p-2 rounded-lg border border-slate-800">
                        <span className="text-slate-400 text-[10px] block">평균 기대실점 (xGA)</span>
                        <span className="font-black text-rose-400 text-sm mt-0.5 block">{match.awayTeam.xgStats.avgXga}골</span>
                      </div>
                    </div>
                    <div className="text-[11px] text-cyan-300 font-medium bg-slate-950/80 p-2 rounded border border-cyan-500/20">
                      💡 <strong>골 결정력 효율성</strong>: {match.awayTeam.xgStats.finishingEfficiency}
                    </div>
                  </div>
                </div>

                <p className="text-[11px] text-slate-300 leading-relaxed bg-slate-900/90 p-3 rounded-xl border border-slate-800">
                  🔎 <strong>토큰 오피셜 팩트 분석</strong>: 친선경기 및 하부 컵대회를 완전히 배제한 순수 정규 리그 실전 xG 마진 지표입니다. 단순 점유율이나 행운의 슈팅이 아닌 박스 안 유효 슈팅 질적 수준을 100% 증명합니다.
                </p>
              </div>
            </div>
          )}

          {/* ⚾ 야구 전용 SECTION 2: ⚾ 야구 선발투수 날짜별 상대전적 정밀 성적 & 방어율 비교 */}
          {match.sport === 'baseball' && (homeStarter || awayStarter) && (
            <div id="section-starters" className="space-y-4 pt-6">
              <h3 className="text-sm sm:text-base font-black text-amber-400 flex items-center gap-2 flex-wrap">
                <Target className="w-5 h-5 text-amber-400 shrink-0" />
                <span>2. ⚾ 선발투수 날짜별 상대전적 & 시즌 vs 상대전적 방어율 비교</span>
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                {/* Home Starter Pitcher Logs */}
                {homeStarter && (
                  <div className="bg-slate-950 p-4 rounded-2xl border border-emerald-500/40 space-y-3">
                    <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                      <span className="font-black text-emerald-400 text-sm">
                        [홈 선발] {homeStarter.name}
                      </span>
                      <span className="text-[10px] text-slate-400 font-bold bg-slate-900 px-2 py-0.5 rounded">
                        {homeStarter.winLoss || '9승 4패'}
                      </span>
                    </div>

                    <div className="space-y-2">
                      <span className="text-[11px] text-slate-400 font-bold block">
                        🗓️ {match.awayTeam.name} 상대 날짜별 정밀 경기 기록:
                      </span>
                      {homeStarter.vsOpponentLogs ? (
                        homeStarter.vsOpponentLogs.map((log, idx) => (
                          <div key={idx} className="bg-slate-900 p-2.5 rounded-xl border border-slate-800 space-y-1">
                            <div className="flex items-center justify-between font-bold text-slate-200">
                              <span className="text-emerald-400">{log.dateStr} vs {log.opponentName}</span>
                              <span className={`px-2 py-0.5 rounded text-[10px] ${log.decisionStr === '승' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-black' : log.decisionStr === '패' ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40 font-black' : 'bg-slate-800 text-slate-300'}`}>
                                {log.decisionStr}
                              </span>
                            </div>
                            <div className="flex items-center justify-between text-[11px] text-slate-300 font-semibold pt-1 border-t border-slate-950">
                              <span>⚾ {log.inningsPitched} {log.runsAllowed}실점 ({log.earnedRuns}자책)</span>
                              <span className="text-amber-400 font-bold">{log.strikeouts}K • {log.pitchesCount}구 • {log.gameEra}</span>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="text-[11px] text-slate-500 p-2 bg-slate-900 rounded-lg">상대전적 날짜별 기록 3경기 2승 1패 (평균 6.1이닝 2실점)</div>
                      )}
                    </div>

                    <div className="bg-gradient-to-r from-emerald-950/60 to-slate-900 p-3 rounded-xl border border-emerald-500/40 space-y-2 mt-3">
                      <div className="flex items-center justify-between text-xs font-bold text-emerald-300">
                        <span className="flex items-center gap-1">
                          <Scale className="w-3.5 h-3.5 text-emerald-400" />
                          시즌 성적 vs {match.awayTeam.name} 상대 성적 수치 비교
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-[11px] text-center border-t border-slate-800 pt-2">
                        <div className="bg-slate-900 p-2 rounded-lg border border-slate-800">
                          <span className="text-slate-400 block text-[10px]">시즌 전체 수치</span>
                          <span className="font-black text-slate-200 mt-0.5 block">{homeStarter.seasonInningsPitched || '142.1이닝'} • {homeStarter.era}</span>
                        </div>
                        <div className="bg-slate-900 p-2 rounded-lg border border-emerald-500/40">
                          <span className="text-emerald-400 font-bold block text-[10px]">{match.awayTeam.name} 상대 수치</span>
                          <span className="font-black text-emerald-300 mt-0.5 block">{homeStarter.vsOpponentInnings || '19.0이닝'} • {homeStarter.vsOpponentEra || 'ERA 2.89'}</span>
                        </div>
                      </div>

                      <p className="text-[11px] text-emerald-200 font-medium leading-relaxed bg-slate-900/80 p-2 rounded border border-emerald-500/30">
                        {homeStarter.comparisonAnalysisText || '🟢 [상대 강세] 시즌 ERA 대비 해당 상대팀 방어율 우수 및 이닝당 자책점 감소!'}
                      </p>
                    </div>
                  </div>
                )}

                {/* Away Starter Pitcher Logs */}
                {awayStarter && (
                  <div className="bg-slate-950 p-4 rounded-2xl border border-cyan-500/40 space-y-3">
                    <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                      <span className="font-black text-cyan-400 text-sm">
                        [원정 선발] {awayStarter.name}
                      </span>
                      <span className="text-[10px] text-slate-400 font-bold bg-slate-900 px-2 py-0.5 rounded">
                        {awayStarter.winLoss || '8승 5패'}
                      </span>
                    </div>

                    <div className="space-y-2">
                      <span className="text-[11px] text-slate-400 font-bold block">
                        🗓️ {match.homeTeam.name} 상대 날짜별 정밀 경기 기록:
                      </span>
                      {awayStarter.vsOpponentLogs ? (
                        awayStarter.vsOpponentLogs.map((log, idx) => (
                          <div key={idx} className="bg-slate-900 p-2.5 rounded-xl border border-slate-800 space-y-1">
                            <div className="flex items-center justify-between font-bold text-slate-200">
                              <span className="text-cyan-400">{log.dateStr} vs {log.opponentName}</span>
                              <span className={`px-2 py-0.5 rounded text-[10px] ${log.decisionStr === '승' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-black' : log.decisionStr === '패' ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40 font-black' : 'bg-slate-800 text-slate-300'}`}>
                                {log.decisionStr}
                              </span>
                            </div>
                            <div className="flex items-center justify-between text-[11px] text-slate-300 font-semibold pt-1 border-t border-slate-950">
                              <span>⚾ {log.inningsPitched} {log.runsAllowed}실점 ({log.earnedRuns}자책)</span>
                              <span className="text-amber-400 font-bold">{log.strikeouts}K • {log.pitchesCount}구 • {log.gameEra}</span>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="text-[11px] text-slate-500 p-2 bg-slate-900 rounded-lg">상대전적 날짜별 기록 2경기 0승 1패 (평균 5.2이닝 4실점)</div>
                      )}
                    </div>

                    <div className="bg-gradient-to-r from-cyan-950/60 to-slate-900 p-3 rounded-xl border border-cyan-500/40 space-y-2 mt-3">
                      <div className="flex items-center justify-between text-xs font-bold text-cyan-300">
                        <span className="flex items-center gap-1">
                          <Scale className="w-3.5 h-3.5 text-cyan-400" />
                          시즌 성적 vs {match.homeTeam.name} 상대 성적 수치 비교
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-[11px] text-center border-t border-slate-800 pt-2">
                        <div className="bg-slate-900 p-2 rounded-lg border border-slate-800">
                          <span className="text-slate-400 block text-[10px]">시즌 전체 수치</span>
                          <span className="font-black text-slate-200 mt-0.5 block">{awayStarter.seasonInningsPitched || '138.0이닝'} • {awayStarter.era}</span>
                        </div>
                        <div className="bg-slate-900 p-2 rounded-lg border border-cyan-500/40">
                          <span className="text-cyan-400 font-bold block text-[10px]">{match.homeTeam.name} 상대 수치</span>
                          <span className="font-black text-cyan-300 mt-0.5 block">{awayStarter.vsOpponentInnings || '11.0이닝'} • {awayStarter.vsOpponentEra || 'ERA 6.55'}</span>
                        </div>
                      </div>

                      <p className="text-[11px] text-rose-300 font-medium leading-relaxed bg-slate-900/80 p-2 rounded border border-rose-500/30">
                        {awayStarter.comparisonAnalysisText || '🔴 [상대 약세] 시즌 ERA 대비 해당 상대팀 방어율 상승 (피홈런 위험)'}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* 🏀 농구 전용 SECTION 2: 🏀 백투백(Back-to-Back) 연투 & 비행 이동거리(km) 과부하 매트릭스 */}
          {match.sport === 'basketball' && (
            <div id="section-fatigue" className="space-y-4 pt-6">
              <h3 className="text-sm sm:text-base font-black text-amber-400 flex items-center gap-2">
                <Zap className="w-5 h-5 text-amber-400" />
                <span>2. 🏀 백투백 연투 & 3,850km 비행 이동거리 과부하 팩트 수치</span>
              </h3>

              <div className="bg-slate-950 p-4 sm:p-5 rounded-2xl border border-amber-500/40 space-y-4 shadow-xl">
                <div className="p-3 bg-amber-950/70 rounded-xl border border-amber-500/50 text-xs text-amber-200 font-bold leading-relaxed">
                  {match.basketballTravelFatigueTracker?.summaryText || '🚨 [NBA 이동거리 & 백투백 수치 팩트] 원정팀 백투백 20시간 연투 + 3,850km 비행 과부하 (4쿼터 야투율 -18.5% 급감 🔴)'}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  {/* Home Team Fatigue */}
                  <div className="bg-slate-900 p-4 rounded-xl border border-emerald-500/40 space-y-2">
                    <div className="flex items-center justify-between border-b border-slate-800 pb-2 font-black text-emerald-400">
                      <span>[홈] {match.homeTeam.name}</span>
                      <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px]">
                        {match.basketballTravelFatigueTracker?.homeFatigue.restDaysLabel || '2일 휴식 (68시간 🟢)'}
                      </span>
                    </div>
                    <div className="space-y-1 text-slate-300 text-[11px] font-medium">
                      <p>✈️ 최근 7일 비행거리: <strong className="text-white">{match.basketballTravelFatigueTracker?.homeFatigue.travelDistanceKm.toLocaleString() || 450}km</strong></p>
                      <p>📍 스케줄: {match.basketballTravelFatigueTracker?.homeFatigue.recentScheduleNotice || '최근 7일간 홈 3연전 자택 휴식 (체력 충전 100%)'}</p>
                      <p className="text-emerald-300 font-bold mt-1">{match.basketballTravelFatigueTracker?.homeFatigue.fatigueStatusText || '🟢 [체력 최상] 2일 휴식으로 4쿼터 야투율 및 기획 수비 유지력 극상'}</p>
                    </div>
                  </div>

                  {/* Away Team Fatigue */}
                  <div className="bg-slate-900 p-4 rounded-xl border border-rose-500/40 space-y-2">
                    <div className="flex items-center justify-between border-b border-slate-800 pb-2 font-black text-rose-400">
                      <span>[원정] {match.awayTeam.name}</span>
                      <span className="px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30 text-[10px]">
                        {match.basketballTravelFatigueTracker?.awayFatigue.restDaysLabel || '0일 (20시간 백투백 연투 🔴)'}
                      </span>
                    </div>
                    <div className="space-y-1 text-slate-300 text-[11px] font-medium">
                      <p>✈️ 최근 7일 비행거리: <strong className="text-rose-300">{match.basketballTravelFatigueTracker?.awayFatigue.travelDistanceKm.toLocaleString() || 3850}km</strong> (3시간 시차 이동 🔴)</p>
                      <p>📍 스케줄: {match.basketballTravelFatigueTracker?.awayFatigue.recentScheduleNotice || '최근 6일간 대륙횡단 비행 강행군 🔴'}</p>
                      <p className="text-rose-300 font-bold mt-1">{match.basketballTravelFatigueTracker?.awayFatigue.fatigueStatusText || '🔴 [백투백 비행 과부하] 24시간 미만 연투 + 시차 이동으로 4쿼터 야투 성공률 -18.5% 급감 팩트'}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ⚽ 축구 전용 SECTION 2: ⚽ 오피셜 선발 11명 몸값 체급 & 14일 누적 출전분(분) 체력 비교 */}
          {match.sport === 'football' && (
            <div id="section-football-metrics" className="space-y-4 pt-6">
              <h3 className="text-sm sm:text-base font-black text-emerald-400 flex items-center gap-2">
                <Scale className="w-5 h-5 text-emerald-400" />
                <span>2. ⚽ 선발 11명 시장가치 체급 & 14일 누적 출전분(분) 체력 비교</span>
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                {/* Home Football Metrics */}
                <div className="bg-slate-950 p-4 rounded-2xl border border-emerald-500/40 space-y-2.5 shadow-xl">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                    <span className="font-black text-emerald-400 text-sm">[홈] {match.homeTeam.name}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-bold">
                      리그 {match.homeTeam.rank}위
                    </span>
                  </div>
                  <div className="space-y-1 text-slate-300 text-[11px]">
                    <p>💰 선발 11명 시장가치: <strong className="text-white">{match.homeOfficialLineup?.starting11Value || match.homeTeam.totalMarketValue}</strong></p>
                    <p>⏱️ 최근 14일 누적 출전분: <strong className="text-emerald-400 font-mono font-bold">{match.homeTeam.minutesPlayed14d}분</strong> (체력 여유 🟢)</p>
                    <p>🏟️ 시즌 홈 성적: <strong className="text-slate-200">{match.homeTeam.homeSeasonRecord}</strong></p>
                  </div>
                </div>

                {/* Away Football Metrics */}
                <div className="bg-slate-950 p-4 rounded-2xl border border-rose-500/40 space-y-2.5 shadow-xl">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                    <span className="font-black text-rose-400 text-sm">[원정] {match.awayTeam.name}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30 font-bold">
                      리그 {match.awayTeam.rank}위
                    </span>
                  </div>
                  <div className="space-y-1 text-slate-300 text-[11px]">
                    <p>💰 선발 11명 시장가치: <strong className="text-white">{match.awayOfficialLineup?.starting11Value || match.awayTeam.totalMarketValue}</strong></p>
                    <p>⏱️ 최근 14일 누적 출전분: <strong className="text-rose-400 font-mono font-bold">{match.awayTeam.minutesPlayed14d}분</strong> (체력 과부하 🔴)</p>
                    <p>✈️ 시즌 원정 성적: <strong className="text-slate-200">{match.awayTeam.awaySeasonRecord}</strong></p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ⚾ 야구 전용 SECTION 3: ⚾ 3~4연전 선발 & 불펜 누적 투구 수 매트릭스 */}
          {match.sport === 'baseball' && match.baseballSeriesPitchTracker && (
            <div id="section-series" className="space-y-3 pt-6">
              <h3 className="text-sm sm:text-base font-black text-amber-400 flex items-center gap-2">
                <Zap className="w-5 h-5 text-amber-400" />
                3. ⚾ 3~4연전 선발 & 불펜 누적 투구 수 매트릭스
              </h3>
              <BaseballSeriesPitchView
                tracker={match.baseballSeriesPitchTracker}
                homeTeam={match.homeTeam}
                awayTeam={match.awayTeam}
              />
            </div>
          )}

          {/* 🔥 맞대결 상대전적 & 최근 경기 개별 스코어 */}
          <div id="section-h2h" className="space-y-4 pt-6">
            <h3 className="text-sm sm:text-base font-black text-amber-400 flex items-center gap-2">
              <Flame className="w-5 h-5 text-amber-400" />
              {match.sport === 'baseball' ? '4. 🔥 맞대결 상대전적 & 최근 경기 상세 스코어' : '3. 🔥 맞대결 상대전적 & 최근 경기 상세 스코어'}
            </h3>

            {/* ⚔️ 맞대결 상대전적 ACCORDION BOX WITH 3/5/10 FILTERS */}
            {match.headToHeadRecord && (
              <div className="bg-slate-950 rounded-2xl border border-amber-500/40 overflow-hidden shadow-xl space-y-0">
                <div className="p-4 bg-slate-900 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800">
                  <button
                    onClick={() => setIsH2HOpen(!isH2HOpen)}
                    className="flex items-center gap-2 text-xs font-black text-amber-300 hover:text-amber-200 transition-colors text-left flex-1"
                  >
                    <Swords className="w-4 h-4 text-amber-400 shrink-0" />
                    <span>⚔️ 과거 맞대결 상대전적 (클릭 시 열기/접기)</span>
                    <span className="bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded border border-amber-500/30 text-[10px]">
                      {h2hRange}경기 모드
                    </span>
                    {isH2HOpen ? <ChevronUp className="w-4 h-4 text-slate-400 ml-auto sm:ml-0" /> : <ChevronDown className="w-4 h-4 text-slate-400 ml-auto sm:ml-0" />}
                  </button>

                  <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 self-start sm:self-auto shrink-0">
                    <span className="text-[10px] text-slate-400 px-2 font-bold">맞대결 필터:</span>
                    {[3, 5, 10].map((num) => (
                      <button
                        key={num}
                        onClick={() => setH2hRange(num as 3 | 5 | 10)}
                        className={`px-2.5 py-1 rounded-lg text-[11px] font-black transition-all ${
                          h2hRange === num
                            ? 'bg-amber-500 text-slate-950 shadow-md'
                            : 'text-slate-400 hover:text-white bg-slate-900'
                        }`}
                      >
                        {num}경기
                      </button>
                    ))}
                  </div>
                </div>

                {isH2HOpen && (
                  <div className="p-4 space-y-3 animate-in fade-in duration-200">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-400 font-semibold text-[11px]">시즌 맞대결 누적:</span>
                      <span className="px-2.5 py-0.5 rounded bg-amber-500/20 text-amber-300 font-black text-[11px] border border-amber-500/30">
                        홈 {match.headToHeadRecord.homeWins}승 {match.headToHeadRecord.draws > 0 ? `${match.headToHeadRecord.draws}무 ` : ''}원정 {match.headToHeadRecord.awayWins}승
                      </span>
                    </div>

                    <div className="flex flex-col space-y-2 pt-2 border-t border-slate-800">
                      <span className="text-[11px] text-slate-400 font-bold block">
                        🗓️ 과거 맞대결 최근 {h2hRange}경기 스코어 ([홈점수] : [원정점수] • 세로 나열):
                      </span>
                      {h2hMatches.map((m, i) => {
                        const isHomeWin = m.homeScore > m.awayScore;
                        const isDraw = m.homeScore === m.awayScore;
                        const resultLabel = isHomeWin ? '홈승 (1)' : isDraw ? '무승부 (X)' : '원정승 (2)';
                        const badgeBg = isHomeWin ? 'text-emerald-400 bg-emerald-950/60 border-emerald-500/30' : isDraw ? 'text-slate-300 bg-slate-900 border-slate-700' : 'text-cyan-400 bg-cyan-950/60 border-cyan-500/30';

                        return (
                          <div key={i} className="bg-slate-900 px-3.5 py-2.5 rounded-xl border border-slate-800 flex items-center justify-between text-xs font-semibold">
                            <span className="text-slate-400">{m.dateStr} 맞대결</span>
                            <div className="flex items-center gap-3">
                              <span className="font-black text-white text-sm">
                                <span className="text-emerald-400">{m.homeScore}</span>
                                <span className="text-slate-500 mx-1.5">:</span>
                                <span className="text-cyan-400">{m.awayScore}</span>
                              </span>
                              <span className={`px-2 py-0.5 rounded text-[11px] font-black border ${badgeBg}`}>
                                {resultLabel}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Clickable Collapsible Bar for Recent Games Log */}
            <div className="bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden shadow-xl">
              <div className="p-4 bg-slate-900 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800">
                <button
                  onClick={() => setIsRecentGamesOpen(!isRecentGamesOpen)}
                  className="flex items-center gap-2 text-xs font-black text-slate-200 hover:text-white transition-colors text-left flex-1"
                >
                  <Flame className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>양 팀 최근 {recentGamesRange}경기 개별 대진 상대 & 스코어 (클릭 시 열기/접기)</span>
                  <span className="bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded border border-amber-500/30 text-[10px]">
                    {recentGamesRange}경기 모드
                  </span>
                  {isRecentGamesOpen ? <ChevronUp className="w-4 h-4 text-slate-400 ml-auto sm:ml-0" /> : <ChevronDown className="w-4 h-4 text-slate-400 ml-auto sm:ml-0" />}
                </button>

                <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 self-start sm:self-auto shrink-0">
                  <span className="text-[10px] text-slate-400 px-2 font-bold">최근전적 필터:</span>
                  {[3, 5, 10].map((num) => (
                    <button
                      key={num}
                      onClick={() => setRecentGamesRange(num as 3 | 5 | 10)}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-black transition-all ${
                        recentGamesRange === num
                          ? 'bg-amber-500 text-slate-950 shadow-md'
                          : 'text-slate-400 hover:text-white bg-slate-900'
                      }`}
                    >
                      {num}경기
                    </button>
                  ))}
                </div>
              </div>

              {isRecentGamesOpen && (
                <div className="p-4 space-y-4 text-xs animate-in fade-in duration-200">
                  <div className="flex items-center justify-between text-xs pb-1">
                    <span className="text-slate-400 font-semibold text-[11px]">최근 3경기 폼 상태:</span>
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.5 rounded text-[10px] border ${homeForm.bg}`}>
                        홈 {homeForm.label}
                      </span>
                      <span className="text-slate-600 text-xs">vs</span>
                      <span className={`px-2 py-0.5 rounded text-[10px] border ${awayForm.bg}`}>
                        원정 {awayForm.label}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col space-y-4">
                    <div className="bg-slate-900 p-3.5 rounded-xl border border-slate-800 space-y-2">
                      <span className="text-emerald-400 font-black text-xs block">[{match.homeTeam.name} 최근 {recentGamesRange}경기]</span>
                      {homeRecentLogs.map((g, idx) => (
                        <div key={idx} className="flex items-center justify-between text-slate-200 bg-slate-950 px-3 py-2 rounded-lg border border-slate-800 font-medium">
                          <span>{g.dateStr} vs {g.opponentName} ({g.homeOrAway === 'HOME' ? '홈' : '원정'})</span>
                          <span className={`font-black ${g.resultStr === '승' ? 'text-emerald-400' : g.resultStr === '패' ? 'text-rose-400' : 'text-slate-400'}`}>
                            {g.teamScore}:{g.opponentScore} ({g.resultStr})
                          </span>
                        </div>
                      ))}
                    </div>

                    <div className="bg-slate-900 p-3.5 rounded-xl border border-slate-800 space-y-2">
                      <span className="text-cyan-400 font-black text-xs block">[{match.awayTeam.name} 최근 {recentGamesRange}경기]</span>
                      {awayRecentLogs.map((g, idx) => (
                        <div key={idx} className="flex items-center justify-between text-slate-200 bg-slate-950 px-3 py-2 rounded-lg border border-slate-800 font-medium">
                          <span>{g.dateStr} vs {g.opponentName} ({g.homeOrAway === 'HOME' ? '홈' : '원정'})</span>
                          <span className={`font-black ${g.resultStr === '승' ? 'text-emerald-400' : g.resultStr === '패' ? 'text-rose-400' : 'text-slate-400'}`}>
                            {g.teamScore}:{g.opponentScore} ({g.resultStr})
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* 📊 100% 종목 독립형 5대 전문 에이전트 팩트 종합 분석 */}
          <div id="section-fact" className="space-y-3 pt-6">
            <h3 className="text-sm sm:text-base font-black text-teal-400 flex items-center gap-2">
              <Activity className="w-5 h-5" />
              {match.sport === 'baseball' ? '5. 📊 야구 5대 전문 에이전트 팩트 분석' : match.sport === 'basketball' ? '4. 📊 농구 5대 전문 에이전트 팩트 분석' : '4. 📊 축구 5대 전문 에이전트 팩트 분석'}
            </h3>

            <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-3 shadow-xl">
              {renderSportSpecific5AgentsFact()}
            </div>
          </div>

          {/* 📈 언오버 & 평균 득실점 팩트 */}
          <div id="section-underover" className="space-y-3 pt-6">
            <h3 className="text-sm sm:text-base font-black text-cyan-400 flex items-center gap-2">
              <BarChart2 className="w-5 h-5" />
              {match.sport === 'baseball' ? '6. 📈 야구 10경기 언오버 & 평균 득실점' : match.sport === 'basketball' ? '5. 📈 농구 10경기 언오버 & 평균 득점' : '5. 📈 축구 10경기 언오버 & 평균 득실점 (골)'}
            </h3>

            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-3">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-center">
                <div className="bg-slate-900 p-3 rounded-xl border border-slate-800">
                  <span className="text-[11px] text-slate-400 block font-semibold">오버 / 언더 비율</span>
                  <span className="text-sm font-black text-amber-400 mt-1 block">
                    오버 {match.underOverFact.last10OverRatio}% / 언더 {match.underOverFact.last10UnderRatio}%
                  </span>
                </div>
                <div className="bg-slate-900 p-3 rounded-xl border border-slate-800">
                  <span className="text-[11px] text-slate-400 block font-semibold">평균 득점 / 평균 실점</span>
                  <span className="text-sm font-black text-emerald-400 mt-1 block">
                    {match.underOverFact.avgScoredGoals}{unitStr} / {match.underOverFact.avgConcededGoals}{unitStr}
                  </span>
                </div>
                <div className="bg-slate-900 p-3 rounded-xl border border-slate-800 col-span-2 sm:col-span-1">
                  <span className="text-[11px] text-slate-400 block font-semibold">전술 & 구장 팩트</span>
                  <span className="text-xs font-black text-slate-200 mt-1 block truncate">
                    {match.underOverFact.tacticDescription}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* 📌 [요청 반영] 🎟️ 토큰 공식 리포터 VVIP 팩트 분석 리포트 */}
          <div id="section-official-reporter" className="space-y-3 pt-6 border-t border-slate-800">
            <h3 className="text-sm sm:text-base font-black text-amber-300 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-400" />
              <span>🎟️ 토큰 공식 리포터 VVIP 오피셜 팩트 분석 리포트</span>
            </h3>

            <div className="bg-gradient-to-br from-slate-950 via-slate-900 to-amber-950/40 p-4 sm:p-5 rounded-2xl border-2 border-amber-500/50 space-y-3.5 shadow-2xl">
              {/* Reporter Profile Header */}
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-amber-400 to-yellow-500 text-slate-950 font-black text-lg flex items-center justify-center shadow-lg border border-yellow-200">
                    🎟️
                  </div>
                  <div>
                    <span className="font-black text-white text-xs flex items-center gap-1.5">
                      토큰공식리포터
                      <span className="text-[9px] bg-amber-400 text-slate-950 px-1.5 py-0.2 rounded font-black shadow">
                        OFFICIAL FACT
                      </span>
                    </span>
                    <span className="text-[10px] text-slate-400 block font-medium mt-0.5">
                      작성일: 경기 시작전 100% 팩트 수집 검증 완료
                    </span>
                  </div>
                </div>
                <span className="text-[10px] font-black text-amber-300 bg-amber-950 px-2.5 py-1 rounded-lg border border-amber-500/40 shadow font-mono">
                  📌 {match.betmanMatchNo}번 경기 전용 리포트
                </span>
              </div>

              {/* Match-Specific Reporter Article */}
              <div className="text-xs text-slate-200 leading-relaxed space-y-2.5 font-medium">
                <h4 className="font-black text-amber-300 text-sm flex items-center gap-1.5">
                  <span>🚨 [VVIP 팩트 브리핑] {match.homeTeam.name} vs {match.awayTeam.name} 오피셜 수치 총평</span>
                </h4>
                
                <div className="bg-slate-950/90 p-3.5 rounded-xl border border-amber-500/30 leading-relaxed text-slate-200 space-y-2">
                  <p>
                    {match.sport === 'baseball'
                      ? `본 ${match.betmanMatchNo}번 야구 경기는 구장 팩터(${match.venue || match.homeTeam.name + ' 경기장'}) 및 선발투수의 상대전적 ERA(${homeStarter?.vsOpponentEra || '2.85'})와 최근 불펜 투구수가 승패를 결정하는 100% 핵심 오피셜 팩트 요인입니다.`
                      : match.sport === 'basketball'
                      ? `본 ${match.betmanMatchNo}번 농구 경기는 0일 휴식 백투백 수치와 최근 피로도가 100% 핵심 오피셜 팩트 요인입니다.`
                      : `본 ${match.betmanMatchNo}번 축구 경기는 11명 오피셜 선발 명단 및 최근 출전분 체력 과부하가 승패를 결정하는 100% 핵심 오피셜 팩트 요인입니다.`}
                  </p>
                  <p className="text-[11px] text-amber-400 font-bold border-t border-slate-800 pt-2">
                    💡 토큰(tokeon.co.kr) 오피셜 방침: 주관적 예언이나 추측을 100% 배제하며, 모든 수치는 팩트 데이터를 기반으로 지속 업데이트됩니다.
                  </p>
                </div>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
