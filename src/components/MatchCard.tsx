import { ChevronRight, Star } from 'lucide-react';
import type { Match, MembershipTier } from '../types/sports';

interface MatchCardProps {
  match: Match;
  membershipTier: MembershipTier;
  cardDensity?: 'COMPACT' | 'DETAILED';
  markedPicks?: ('WIN' | 'DRAW' | 'LOSE')[];
  onSelectMatch: (match: Match) => void;
  onToggleFavorite?: (matchId: string) => void;
  onTogglePick?: (matchId: string, pick: 'WIN' | 'DRAW' | 'LOSE') => void;
}

export const MatchCard = ({ match, membershipTier: _membershipTier, cardDensity = 'DETAILED', markedPicks = [], onSelectMatch, onToggleFavorite, onTogglePick }: MatchCardProps) => {
  
  const getSportIcon = (sportStr: string) => {
    if (sportStr === 'baseball') return '⚾';
    if (sportStr === 'basketball') return '🏀';
    if (sportStr === 'volleyball') return '🏐';
    return '⚽';
  };

  const sportIcon = getSportIcon(match.sport);

  // 📌 1. 📱 [한눈 콤팩트 카드 모드]
  if (cardDensity === 'COMPACT') {
    return (
      <div 
        className={`bg-slate-900/95 hover:bg-slate-850 border ${match.isFavorite ? 'border-amber-500/80 glow-emerald' : 'border-slate-800'} hover:border-emerald-500/50 rounded-xl p-2.5 sm:p-3 transition-all shadow-md cursor-pointer group flex flex-col space-y-2 relative w-full`}
        onClick={() => onSelectMatch(match)}
      >
        {/* Header line: Match No, League, Time & [관심 알림] 바로 옆 미니 [상세보기] */}
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-1.5 min-w-0">
            <span className="px-2 py-0.5 rounded-md bg-gradient-to-r from-emerald-500 to-teal-600 text-slate-950 font-black text-[11px] shrink-0">
              {match.betmanMatchNo}번
            </span>
            <span className="font-bold text-slate-300 bg-slate-950 px-2 py-0.5 rounded border border-slate-800 text-[10px] truncate">
              {match.countryFlag || '🇰🇷'} {match.league}
            </span>
            <span className="text-slate-400 font-semibold text-[10px] shrink-0">{match.matchTime}</span>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                if (onToggleFavorite) onToggleFavorite(match.id);
              }}
              className={`px-2 py-0.5 rounded-lg border text-[10px] font-bold transition-all shrink-0 ${
                match.isFavorite ? 'bg-amber-500/20 text-amber-300 border-amber-500/40' : 'bg-slate-950 text-slate-400 border-slate-800'
              }`}
            >
              <Star className={`w-3 h-3 inline mr-0.5 ${match.isFavorite ? 'fill-amber-400 text-amber-400' : ''}`} />
              {match.isFavorite ? '알림ON' : '관심'}
            </button>

            <span className="px-2 py-0.5 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-black text-[10px] flex items-center gap-0.5 group-hover:bg-emerald-500 group-hover:text-slate-950 transition-colors">
              상세보기 <ChevronRight className="w-3 h-3" />
            </span>
          </div>
        </div>

        {/* Compact Teams vs Starter Line */}
        <div className="flex items-center justify-between gap-2 bg-slate-950 px-3 py-2 rounded-lg border border-slate-800 text-xs">
          <div className="flex items-center gap-2 min-w-0 flex-1">
            <span className="font-black text-emerald-400 truncate">{sportIcon} [홈] {match.homeTeam.name}</span>
            <span className="text-slate-500 font-bold text-[10px]">vs</span>
            <span className="font-black text-cyan-400 truncate">[원정] {match.awayTeam.name} {sportIcon}</span>
          </div>

          {match.sport === 'baseball' && match.homeTeam.starterPitcherInfo && match.awayTeam.starterPitcherInfo ? (
            <span className="text-[10px] font-bold text-amber-300 shrink-0 bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
              {match.homeTeam.starterPitcherInfo.name} vs {match.awayTeam.starterPitcherInfo.name}
            </span>
          ) : match.sport === 'basketball' ? (
            <span className="text-[10px] font-bold text-amber-300 shrink-0 bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
              {match.homeTeam.name} vs {match.awayTeam.name}
            </span>
          ) : null}
        </div>
      </div>
    );
  }

  // 📌 2. 📊 [정밀 상세 카드 모드] - 100% 팩트 원칙: 공식 예고 선발투수 실명 또는 '미정 (예고 대기)'
  const homeStarterStr = match.homeTeam.starterPitcherInfo ? `${match.homeTeam.starterPitcherInfo.name} (${match.homeTeam.starterPitcherInfo.era})` : '선발: 미정 (공식 예고 대기)';
  const awayStarterStr = match.awayTeam.starterPitcherInfo ? `${match.awayTeam.starterPitcherInfo.name} (${match.awayTeam.starterPitcherInfo.era})` : '선발: 미정 (공식 예고 대기)';

  return (
    <div 
      className={`bg-slate-900/95 hover:bg-slate-850 border ${match.isFavorite ? 'border-amber-500/80 glow-emerald' : 'border-slate-800'} hover:border-emerald-500/50 rounded-2xl p-3.5 sm:p-4 transition-all shadow-xl hover:shadow-emerald-500/10 cursor-pointer group flex flex-col space-y-2.5 relative w-full`}
      onClick={() => onSelectMatch(match)}
    >
      {/* 1. Top Header: Match No, Country Flag, League, Favorite & [알림 옆 미니 상세보기] */}
      <div className="flex items-center justify-between text-xs">
        <div className="flex items-center gap-1.5">
          <span className="font-bold text-slate-200 bg-slate-800 px-2 py-0.5 rounded-lg border border-slate-700 flex items-center gap-1 text-[11px]">
            <span>{match.countryFlag || '🇰🇷'}</span>
            <span>{match.league}</span>
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          {/* 관심 등록 알림 버튼 */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              if (onToggleFavorite) onToggleFavorite(match.id);
            }}
            className={`p-1.5 rounded-xl border transition-all flex items-center gap-1 ${
              match.isFavorite 
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 font-bold' 
                : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-white'
            }`}
            title="관심 경기 알림 등록"
          >
            <Star className={`w-3.5 h-3.5 ${match.isFavorite ? 'fill-amber-400 text-amber-400' : ''}`} />
            <span className="text-[10px] font-bold">
              {match.isFavorite ? '알림ON' : '관심'}
            </span>
          </button>

          {/* 📌 [미니 상세보기 버튼] 상단 알림 바로 옆 */}
          <span className="px-2.5 py-1 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-black text-[10px] sm:text-[11px] flex items-center gap-0.5 group-hover:bg-emerald-500 group-hover:text-slate-950 transition-all shadow-sm">
            상세보기 <ChevronRight className="w-3.5 h-3.5" />
          </span>

          {match.status === 'FINISHED' ? (
            <span className="px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 text-[10px] font-bold border border-slate-700">
              종료
            </span>
          ) : (
            <span className="text-slate-400 font-semibold text-[11px]">{match.matchTime}</span>
          )}
        </div>
      </div>

      {/* 2. 📌 [팀명 & 스포츠 공 아이콘(⚽ 축구, ⚾ 야구, 🏀 농구) 적용] */}
      <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800/90 space-y-2">
        <div className="flex items-center justify-between">
          {/* LEFT = HOME TEAM (홈) */}
          <div className="flex items-center gap-2 w-5/12 min-w-0">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-slate-900 flex items-center justify-center text-lg sm:text-xl border border-slate-800 shrink-0">
              {sportIcon}
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1">
                <span className="text-[9px] font-black bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-1 rounded shrink-0">홈</span>
                <h4 className="font-black text-white text-sm sm:text-base truncate">{match.homeTeam.name}</h4>
              </div>
            </div>
          </div>

          {/* VS CENTER */}
          <div className="flex flex-col items-center justify-center w-2/12 shrink-0">
            {match.status === 'FINISHED' ? (
              <div className="flex flex-col items-center">
                <div className="text-base font-black text-emerald-400 tracking-wider">
                  {match.homeScore} : {match.awayScore}
                </div>
                <span className="px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[8px] font-black mt-0.5">
                  {match.sport === 'baseball' ? (
                    Math.abs((match.homeScore || 0) - (match.awayScore || 0)) <= 1
                      ? '1점차 승부 (1)'
                      : (match.homeScore || 0) > (match.awayScore || 0) ? '홈승 (승)' : '원정승 (패)'
                  ) : (
                    match.homeScore! > match.awayScore! ? '홈승 (1)' : match.homeScore === match.awayScore ? '무 (X)' : '원정승 (2)'
                  )}
                </span>
              </div>
            ) : (
              <span className="px-2.5 py-1 rounded-lg bg-slate-900 text-slate-300 text-xs font-black border border-slate-800 shadow">
                VS
              </span>
            )}
          </div>

          {/* RIGHT = AWAY TEAM (원정) */}
          <div className="flex items-center justify-end gap-2 w-5/12 text-right min-w-0">
            <div className="min-w-0">
              <div className="flex items-center justify-end gap-1">
                <h4 className="font-black text-white text-sm sm:text-base truncate">{match.awayTeam.name}</h4>
                <span className="text-[9px] font-black bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 px-1 rounded shrink-0">원정</span>
              </div>
            </div>
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-slate-900 flex items-center justify-center text-lg sm:text-xl border border-slate-800 shrink-0">
              {sportIcon}
            </div>
          </div>
        </div>

        {/* 📌 [야구 선발투수 정보 바] */}
        {match.sport === 'baseball' && (
          <div className="bg-slate-900 px-2.5 py-1.5 rounded-lg border border-amber-500/30 flex items-center justify-between text-[10px] sm:text-[11px] font-bold">
            <div className="text-emerald-400 truncate flex items-center gap-1">
              <span>⚾ [홈]</span>
              <span className="text-white font-black">{homeStarterStr}</span>
            </div>
            <span className="text-amber-400 font-bold mx-1 shrink-0">VS</span>
            <div className="text-cyan-400 text-right truncate flex items-center gap-1 justify-end">
              <span className="text-white font-black">{awayStarterStr}</span>
              <span>[원정] ⚾</span>
            </div>
          </div>
        )}

        {/* 📌 [농구 주전 에이스 정보 바] */}
        {match.sport === 'basketball' && (
          <div className="bg-slate-900 px-2.5 py-1.5 rounded-lg border border-amber-500/30 flex items-center justify-between text-[10px] sm:text-[11px] font-bold">
            <div className="text-emerald-400 truncate flex items-center gap-1">
              <span>🏀 [홈]</span>
              <span className="text-white font-black">{match.homeTeam.name} 주전 팩트 👑</span>
            </div>
            <span className="text-amber-400 font-bold mx-1 shrink-0">VS</span>
            <div className="text-cyan-400 text-right truncate flex items-center gap-1 justify-end">
              <span className="text-white font-black">{match.awayTeam.name} 주전 팩트 👑</span>
              <span>[원정] 🏀</span>
            </div>
          </div>
        )}

        {/* 📌 3. 👑 [VVIP 오피셜 라인업 팩트 알림 바] */}
        {match.lineupAlertInfo && (
          <div className="bg-emerald-950/80 border border-emerald-500/50 p-2 rounded-xl text-emerald-300 text-xs flex items-center justify-between font-bold shadow-sm">
            <span className="truncate flex items-center gap-1">
              <span>👑</span>
              <span>{match.lineupAlertInfo.keyAbsenceNotice}</span>
            </span>
            <span className="text-[10px] text-emerald-400 font-black shrink-0 bg-emerald-900/80 px-1.5 py-0.5 rounded border border-emerald-500/40 ml-1">
              오피셜 팩트
            </span>
          </div>
        )}

        {/* 📌 4. ⚔️ [상대전적 요약 & 📊 언오버 팩트 바] */}
        <div className="grid grid-cols-2 gap-2 text-[10px] font-bold">
          {match.headToHeadRecord && (
            <div className="bg-slate-900 p-1.5 rounded-lg border border-slate-800 text-slate-300 flex items-center justify-between truncate">
              <span className="text-amber-400 truncate">⚔️ {match.headToHeadRecord.summaryText}</span>
            </div>
          )}

          {match.underOverFact && (
            <div className="bg-slate-900 p-1.5 rounded-lg border border-slate-800 text-slate-300 flex items-center justify-between truncate">
              <span className="text-cyan-400 truncate">📊 오버 {match.underOverFact.last10OverRatio}% • 경기당 {match.underOverFact.avgScoredGoals}골</span>
            </div>
          )}
        </div>

        {/* 📌 5. 🖊️ [원클릭 승/무/패 마킹 바 (Interactive Betting Bar)] */}
        <div className="pt-2 border-t border-slate-800/80">
          <div className="grid grid-cols-3 gap-2">
            {/* [승] 버튼 */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                if (onTogglePick) onTogglePick(match.id, 'WIN');
              }}
              className={`py-2 px-1 rounded-xl text-xs font-black transition-all flex flex-col items-center justify-center cursor-pointer shadow-md ${
                markedPicks.includes('WIN')
                  ? 'bg-emerald-500 text-slate-950 border-2 border-emerald-200 shadow-[0_0_16px_#10b981] scale-[1.02]'
                  : 'bg-slate-900/90 hover:bg-slate-800 text-slate-200 border border-slate-800 hover:border-emerald-500/50'
              }`}
            >
              <div className="flex items-center gap-1">
                <span>⚽</span>
                <span>[홈승]</span>
              </div>
              <span className={`text-[10px] mt-0.5 ${markedPicks.includes('WIN') ? 'text-slate-950 font-black' : 'text-emerald-400 font-bold'}`}>
                {match.sport === 'football' ? '승 44.6%' : '승 62.5%'}
              </span>
            </button>

            {/* [무] 버튼 */}
            <button
              type="button"
              disabled={match.sport === 'baseball' || match.sport === 'basketball'}
              onClick={(e) => {
                e.stopPropagation();
                if (onTogglePick) onTogglePick(match.id, 'DRAW');
              }}
              className={`py-2 px-1 rounded-xl text-xs font-black transition-all flex flex-col items-center justify-center shadow-md ${
                match.sport === 'baseball' || match.sport === 'basketball'
                  ? 'bg-slate-950/40 text-slate-600 border border-slate-900 cursor-not-allowed opacity-40'
                  : markedPicks.includes('DRAW')
                    ? 'bg-amber-400 text-slate-950 border-2 border-yellow-100 shadow-[0_0_16px_#f59e0b] scale-[1.02] cursor-pointer'
                    : 'bg-slate-900/90 hover:bg-slate-800 text-slate-200 border border-slate-800 hover:border-amber-500/50 cursor-pointer'
              }`}
            >
              <div className="flex items-center gap-1">
                <span>🤝</span>
                <span>[무승부]</span>
              </div>
              <span className={`text-[10px] mt-0.5 ${markedPicks.includes('DRAW') ? 'text-slate-950 font-black' : 'text-amber-400 font-bold'}`}>
                {match.sport === 'football' ? '무 29.4%' : '무 (X)'}
              </span>
            </button>

            {/* [패] 버튼 */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                if (onTogglePick) onTogglePick(match.id, 'LOSE');
              }}
              className={`py-2 px-1 rounded-xl text-xs font-black transition-all flex flex-col items-center justify-center cursor-pointer shadow-md ${
                markedPicks.includes('LOSE')
                  ? 'bg-cyan-500 text-slate-950 border-2 border-cyan-200 shadow-[0_0_16px_#06b6d4] scale-[1.02]'
                  : 'bg-slate-900/90 hover:bg-slate-800 text-slate-200 border border-slate-800 hover:border-cyan-500/50'
              }`}
            >
              <div className="flex items-center gap-1">
                <span>✈️</span>
                <span>[원정승]</span>
              </div>
              <span className={`text-[10px] mt-0.5 ${markedPicks.includes('LOSE') ? 'text-slate-950 font-black' : 'text-cyan-400 font-bold'}`}>
                {match.sport === 'football' ? '패 26.0%' : '패 37.5%'}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
