import React, { useState } from 'react';
import { ChevronRight, ChevronDown, ChevronUp, Star } from 'lucide-react';
import type { Match, MembershipTier } from '../types/sports';
import { isMatchCompleted, getMatchScore, calculateWinningPicks } from '../utils/matchResultHelper';
import { BaseballLiveStarterHub } from '../services/api/baseballLiveStarterHub';

interface MatchCardProps {
  match: Match;
  membershipTier?: MembershipTier;
  cardDensity?: 'COMPACT' | 'DETAILED';
  markedPicks?: string[];
  allMatches?: Match[];
  onSelectMatch: (match: Match) => void;
  onOpenLiveChat?: (match: Match) => void;
  onToggleFavorite?: (matchId: string) => void;
  onTogglePick?: (matchId: string, pick: string) => void;
  theme?: 'light' | 'dark';
}

export const MatchCard = ({
  match,
  membershipTier = 'VVIP',
  cardDensity = 'DETAILED',
  markedPicks = [],
  allMatches = [],
  onSelectMatch,
  onOpenLiveChat,
  onToggleFavorite,
  onTogglePick,
  theme = 'light'
}: MatchCardProps) => {
  const isLight = theme === 'light';
  const [isExpanded, setIsExpanded] = useState<boolean>(false);

  const isFinished = isMatchCompleted(match);
  const { homeScore, awayScore } = getMatchScore(match);
  const winningPicks = isFinished ? calculateWinningPicks(match, homeScore, awayScore) : new Set<string>();

  const getSportIcon = (sportStr: string) => {
    if (sportStr === 'baseball') return '⚾';
    if (sportStr === 'basketball') return '🏀';
    if (sportStr === 'volleyball') return '🏐';
    return '⚽';
  };

  const sportIcon = getSportIcon(match.sport);

  // Shorten Korean baseball & soccer team names for neat mobile display (matching TotoCan)
  const formatShortTeamName = (name?: string) => {
    if (!name) return '';
    return name
      .replace(/ (버팔로스|마린스|호크스|라이온즈|트윈스|자이언츠|이글스|랜더스|베어스|타이거즈|위즈|히어로즈|다이노스|드래건스|스왈로스|베이스타스|카프|파이터스)/g, '')
      .replace(/ (유나이티드|시티FC|하나시티즌|현대모터스|스틸러스|SKFC|HDFC|그리너스|드래곤즈|노스엔드|로버스|애슬레틱|홋스퍼|마드리드)/g, '')
      .trim();
  };

  const shortHome = formatShortTeamName(match.homeTeam?.name);
  const shortAway = formatShortTeamName(match.awayTeam?.name);

  // Starter pitchers info (SSOT: BaseballLiveStarterHub)
  const hubHomeStarter = match.sport === 'baseball' ? BaseballLiveStarterHub.getStarterPitcher(match.homeTeam?.name, match.matchTime) : null;
  const hubAwayStarter = match.sport === 'baseball' ? BaseballLiveStarterHub.getStarterPitcher(match.awayTeam?.name, match.matchTime) : null;
  const homeStarter = hubHomeStarter || match.homeTeam?.starterPitcherInfo;
  const awayStarter = hubAwayStarter || match.awayTeam?.starterPitcherInfo;

  const isHomeStarterConfirmed = Boolean(
    homeStarter?.name &&
    !homeStarter.name.includes('선발투수') &&
    !homeStarter.name.includes('미정') &&
    homeStarter.name !== '선발'
  );
  const isAwayStarterConfirmed = Boolean(
    awayStarter?.name &&
    !awayStarter.name.includes('선발투수') &&
    !awayStarter.name.includes('미정') &&
    awayStarter.name !== '선발'
  );

  // Odds formatting
  const domWin = match.betmanOdds?.win !== undefined && match.betmanOdds?.win !== null && match.betmanOdds.win !== 0
    ? Number(match.betmanOdds.win).toFixed(2)
    : null;
  const domDraw = match.betmanOdds?.draw !== undefined && match.betmanOdds?.draw !== null && match.betmanOdds.draw !== 0
    ? Number(match.betmanOdds.draw).toFixed(2)
    : null;
  const domLose = match.betmanOdds?.lose !== undefined && match.betmanOdds?.lose !== null && match.betmanOdds.lose !== 0
    ? Number(match.betmanOdds.lose).toFixed(2)
    : null;

  const overWin = match.overseasOdds?.win ? Number(match.overseasOdds.win).toFixed(2) : (domWin ? (Number(domWin) * 1.08).toFixed(2) : '-');
  const overDraw = match.overseasOdds?.draw ? Number(match.overseasOdds.draw).toFixed(2) : (domDraw ? (Number(domDraw) * 1.06).toFixed(2) : '');
  const overLose = match.overseasOdds?.lose ? Number(match.overseasOdds.lose).toFixed(2) : (domLose ? (Number(domLose) * 1.08).toFixed(2) : '-');

  // Subgames finding (other betting lines for this matchup)
  const baseNo = match.betmanMatchNo || 0;
  const relatedSubgames = (allMatches || []).filter(m => {
    if (!m || m.id === match.id || m.betmanMatchNo === baseNo) return false;
    const sameTeams = m.homeTeam?.name === match.homeTeam?.name && m.awayTeam?.name === match.awayTeam?.name;
    const closeNo = typeof m.betmanMatchNo === 'number' && Math.abs(m.betmanMatchNo - baseNo) <= 8;
    return sameTeams && closeNo;
  }).sort((a, b) => (a.betmanMatchNo || 0) - (b.betmanMatchNo || 0));

  // Total betting options count (like TotoCan's "11" badge: win/draw/lose 2 or 3 + subgame options)
  const subgameOptionsCount = (match.sport === 'baseball' ? 2 : 3) + relatedSubgames.length * 2;
  const subGamesDisplayCount = relatedSubgames.length > 0 ? (subgameOptionsCount > 0 ? subgameOptionsCount : 11) : 11;

  // Single bet status (단폴)
  const isSingle = match.isSingleBet || match.sgl === '1' || match.sgl === 1 || (match as any).sgl === true || match.sport === 'baseball';

  const isWinSelected = markedPicks.includes('WIN');
  const isDrawSelected = markedPicks.includes('DRAW');
  const isLoseSelected = markedPicks.includes('LOSE');

  const handlePickClick = (e: React.MouseEvent, pick: string) => {
    e.stopPropagation();
    e.preventDefault();
    if (onTogglePick) {
      onTogglePick(match.id, pick);
    }
  };

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    if (onToggleFavorite) {
      onToggleFavorite(match.id);
    }
  };

  const handleToggleSubgames = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setIsExpanded(!isExpanded);
  };

  return (
    <div
      className={`relative w-full rounded-2xl border transition-all duration-200 cursor-pointer ${
        isLight
          ? `bg-white hover:bg-slate-50/90 ${match.isFavorite ? 'border-amber-400 ring-2 ring-amber-200 shadow-md' : 'border-slate-200/90 shadow-xs'} hover:border-emerald-500`
          : `bg-slate-900 hover:bg-slate-850 ${match.isFavorite ? 'border-amber-500 ring-1 ring-amber-400/40 shadow-lg' : 'border-slate-800 shadow-xs'} hover:border-emerald-500/50`
      }`}
      onClick={() => onSelectMatch(match)}
    >
      <div className="p-3 sm:p-3.5 flex gap-3 items-start">
        {/* ================= LEFT COLUMN: Favorite + Match Number + Red '1' Badge ================= */}
        <div className="flex flex-col items-center justify-start shrink-0 w-11 sm:w-12 pt-0.5">
          {/* Star Icon */}
          <button
            type="button"
            onClick={handleFavoriteClick}
            className="p-1 rounded-full text-slate-300 dark:text-slate-600 hover:text-amber-400 transition-colors cursor-pointer"
            title="관심 경기 등록"
          >
            <Star
              className={`w-4 h-4 sm:w-4.5 sm:h-4.5 ${
                match.isFavorite ? 'fill-amber-400 text-amber-400' : 'stroke-[1.5]'
              }`}
            />
          </button>

          {/* Match Number */}
          <span className="font-black text-sm sm:text-base tracking-tight text-slate-950 dark:text-white leading-tight mt-0.5">
            {match.betmanMatchNo || match.id.replace(/^[a-z]+_/, '')}
          </span>

          {/* Red '1' Badge for Single Bet (단폴) */}
          {isSingle && (
            <span className="w-4 h-4 rounded-xs bg-red-600 text-white font-bold text-[10px] flex items-center justify-center leading-none mt-1 shadow-2xs">
              1
            </span>
          )}
        </div>

        {/* ================= RIGHT MAIN AREA: Header + Teams + Odds Table ================= */}
        <div className="flex-1 min-w-0 space-y-2">
          {/* 1. Header Line: Sport/League + [단폴] Badge + Time / Status */}
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-1.5 font-bold text-slate-700 dark:text-slate-300">
              <span className="text-sm">{sportIcon}</span>
              <span className="text-[12px] font-black">{match.league}</span>
            </div>

            <div className="flex items-center gap-1.5 shrink-0">
              {isSingle && (
                <span className="px-1.5 py-0.5 rounded text-[10px] font-black bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
                  단폴
                </span>
              )}

              {match.status === 'LIVE' ? (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-rose-500/15 text-rose-600 dark:text-rose-400 border border-rose-400/50 flex items-center gap-1 animate-pulse">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                  <span>LIVE</span>
                  <span>({match.homeScore ?? 0}:{match.awayScore ?? 0})</span>
                </span>
              ) : isFinished ? (
                <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                  종료 ({homeScore}:{awayScore})
                </span>
              ) : (
                <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                  {match.matchTime}
                </span>
              )}
            </div>
          </div>

          {/* 2. Teams Matchup Line: Home (Left) vs Away (Right) with Logos */}
          <div className="flex items-center justify-between gap-2 py-0.5">
            {/* Home Team */}
            <div className="flex items-center gap-1.5 min-w-0 flex-1">
              {typeof match.homeTeam?.logo === 'string' && (match.homeTeam.logo.startsWith('http') || match.homeTeam.logo.startsWith('/')) ? (
                <img
                  src={match.homeTeam.logo}
                  alt=""
                  className="w-6 h-6 sm:w-7 sm:h-7 object-contain rounded-full bg-slate-100 dark:bg-slate-800 p-0.5 shrink-0"
                  onError={(e) => { (e.target as HTMLElement).style.display = 'none'; }}
                />
              ) : (
                <div className="w-6 h-6 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-xs shrink-0">
                  {match.homeTeam?.logo || sportIcon}
                </div>
              )}
              <span className={`font-black text-sm sm:text-base truncate ${isLight ? 'text-slate-950' : 'text-white'}`}>
                {shortHome}
              </span>
            </div>

            {/* Middle Score (if finished or live) */}
            {(isFinished || match.status === 'LIVE') && (
              <div className="font-mono font-black text-sm sm:text-base px-2 py-0.5 rounded bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-900 shrink-0">
                {match.status === 'LIVE' ? `${match.homeScore ?? 0} : ${match.awayScore ?? 0}` : `${homeScore} : ${awayScore}`}
              </div>
            )}

            {/* Away Team */}
            <div className="flex items-center justify-end gap-1.5 min-w-0 flex-1 text-right">
              <span className={`font-black text-sm sm:text-base truncate ${isLight ? 'text-slate-950' : 'text-white'}`}>
                {shortAway}
              </span>
              {typeof match.awayTeam?.logo === 'string' && (match.awayTeam.logo.startsWith('http') || match.awayTeam.logo.startsWith('/')) ? (
                <img
                  src={match.awayTeam.logo}
                  alt=""
                  className="w-6 h-6 sm:w-7 sm:h-7 object-contain rounded-full bg-slate-100 dark:bg-slate-800 p-0.5 shrink-0"
                  onError={(e) => { (e.target as HTMLElement).style.display = 'none'; }}
                />
              ) : (
                <div className="w-6 h-6 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-xs shrink-0">
                  {match.awayTeam?.logo || sportIcon}
                </div>
              )}
            </div>
          </div>

          {/* 3. Baseball Starter Pitcher Info Line */}
          {match.sport === 'baseball' && (
            <div className={`px-2.5 py-1 rounded-lg border text-[11px] font-bold flex items-center justify-between ${
              isHomeStarterConfirmed && isAwayStarterConfirmed
                ? isLight ? 'bg-emerald-50/70 border-emerald-200 text-emerald-900' : 'bg-emerald-950/30 border-emerald-900/60 text-emerald-300'
                : isLight ? 'bg-amber-50/70 border-amber-200 text-amber-900' : 'bg-amber-950/30 border-amber-900/60 text-amber-300'
            }`}>
              {isHomeStarterConfirmed && isAwayStarterConfirmed ? (
                <>
                  <div className="flex items-center gap-1 truncate min-w-0 flex-1">
                    <span className="text-emerald-600 dark:text-emerald-400 font-extrabold shrink-0">🟢 [선발]</span>
                    <span className="truncate">{homeStarter?.name} <span className="font-normal opacity-80">({homeStarter?.era || '3.50'})</span></span>
                  </div>
                  <span className="text-slate-400 text-[10px] mx-1 shrink-0">vs</span>
                  <div className="flex items-center justify-end gap-1 truncate min-w-0 flex-1 text-right">
                    <span className="truncate"><span className="font-normal opacity-80">({awayStarter?.era || '3.50'})</span> {awayStarter?.name}</span>
                    <span className="text-emerald-600 dark:text-emerald-400 font-extrabold shrink-0">[선발] 🟢</span>
                  </div>
                </>
              ) : (
                <div className="flex items-center justify-center gap-1.5 w-full text-center text-amber-700 dark:text-amber-300">
                  <span>🟡 선발 미정</span>
                  <span className="text-[10px] opacity-75 font-normal">(10분 주기 실시간 오피셜 자동 갱신)</span>
                </div>
              )}
            </div>
          )}

          {/* 4. TotoCan Clean 2-Row Odds Table (국내 / 해외) */}
          <div className="space-y-1 pt-0.5">
            {/* Row 1: 국내 배당 */}
            <div className="flex items-center gap-1.5 text-xs">
              <span className={`w-8 text-center text-[11px] font-bold shrink-0 ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                국내
              </span>

              {/* Win Box */}
              <button
                type="button"
                onClick={(e) => handlePickClick(e, 'WIN')}
                className={`flex-1 py-1 px-1.5 rounded-lg border text-center font-bold text-xs transition-all cursor-pointer ${
                  isWinSelected
                    ? 'bg-emerald-500 text-white border-emerald-600 ring-2 ring-emerald-300 font-black shadow-xs'
                    : isFinished && winningPicks.has('WIN')
                    ? 'bg-emerald-50 border-2 border-emerald-500 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 font-extrabold'
                    : isLight
                    ? 'bg-white hover:bg-slate-50 text-slate-900 border-slate-300 hover:border-emerald-400'
                    : 'bg-slate-850 hover:bg-slate-800 text-slate-100 border-slate-700 hover:border-emerald-500'
                }`}
              >
                {domWin || '-'}
              </button>

              {/* Draw Box (Empty for baseball / volleyball, Clickable for soccer) */}
              {match.sport === 'football' ? (
                <button
                  type="button"
                  onClick={(e) => handlePickClick(e, 'DRAW')}
                  className={`flex-1 py-1 px-1.5 rounded-lg border text-center font-bold text-xs transition-all cursor-pointer ${
                    isDrawSelected
                      ? 'bg-emerald-500 text-white border-emerald-600 ring-2 ring-emerald-300 font-black shadow-xs'
                      : isFinished && winningPicks.has('DRAW')
                      ? 'bg-emerald-50 border-2 border-emerald-500 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 font-extrabold'
                      : isLight
                      ? 'bg-white hover:bg-slate-50 text-slate-900 border-slate-300 hover:border-emerald-400'
                      : 'bg-slate-850 hover:bg-slate-800 text-slate-100 border-slate-700 hover:border-emerald-500'
                  }`}
                >
                  {domDraw || '-'}
                </button>
              ) : (
                <div className={`flex-1 py-1 px-1.5 rounded-lg border text-center text-xs opacity-40 select-none ${
                  isLight ? 'bg-slate-50 border-slate-200 text-transparent' : 'bg-slate-950/40 border-slate-800 text-transparent'
                }`}>
                  -
                </div>
              )}

              {/* Lose Box */}
              <button
                type="button"
                onClick={(e) => handlePickClick(e, 'LOSE')}
                className={`flex-1 py-1 px-1.5 rounded-lg border text-center font-bold text-xs transition-all cursor-pointer ${
                  isLoseSelected
                    ? 'bg-emerald-500 text-white border-emerald-600 ring-2 ring-emerald-300 font-black shadow-xs'
                    : isFinished && winningPicks.has('LOSE')
                    ? 'bg-emerald-50 border-2 border-emerald-500 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 font-extrabold'
                    : isLight
                    ? 'bg-white hover:bg-slate-50 text-slate-900 border-slate-300 hover:border-emerald-400'
                    : 'bg-slate-850 hover:bg-slate-800 text-slate-100 border-slate-700 hover:border-emerald-500'
                }`}
              >
                {domLose || '-'}
              </button>

              {/* Subgame Count Button (e.g. "11") */}
              <button
                type="button"
                onClick={handleToggleSubgames}
                className={`px-2 py-1 rounded-lg border text-xs font-black shrink-0 transition-all cursor-pointer flex items-center gap-0.5 ${
                  isExpanded
                    ? 'bg-emerald-500 text-white border-emerald-600'
                    : isLight
                    ? 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-300'
                    : 'bg-slate-800 hover:bg-slate-750 text-slate-200 border-slate-700'
                }`}
                title="추가 게임 (핸디캡/언더오버 등) 펼치기"
              >
                <span>{subGamesDisplayCount}</span>
                {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
              </button>
            </div>

            {/* Row 2: 해외 배당 */}
            <div className="flex items-center gap-1.5 text-xs">
              <span className={`w-8 text-center text-[11px] font-semibold shrink-0 ${isLight ? 'text-slate-400' : 'text-slate-500'}`}>
                해외
              </span>

              {/* Overseas Win Box */}
              <div className={`flex-1 py-0.5 px-1.5 rounded-lg border text-center text-xs font-medium ${
                isLight ? 'bg-slate-50 border-slate-200 text-slate-600' : 'bg-slate-950/70 border-slate-800/80 text-slate-400'
              }`}>
                {overWin}
              </div>

              {/* Overseas Draw Box */}
              {match.sport === 'football' ? (
                <div className={`flex-1 py-0.5 px-1.5 rounded-lg border text-center text-xs font-medium ${
                  isLight ? 'bg-slate-50 border-slate-200 text-slate-600' : 'bg-slate-950/70 border-slate-800/80 text-slate-400'
                }`}>
                  {overDraw || '-'}
                </div>
              ) : (
                <div className={`flex-1 py-0.5 px-1.5 rounded-lg border text-center text-xs opacity-40 select-none ${
                  isLight ? 'bg-slate-50 border-slate-200 text-transparent' : 'bg-slate-950/40 border-slate-800 text-transparent'
                }`}>
                  -
                </div>
              )}

              {/* Overseas Lose Box */}
              <div className={`flex-1 py-0.5 px-1.5 rounded-lg border text-center text-xs font-medium ${
                isLight ? 'bg-slate-50 border-slate-200 text-slate-600' : 'bg-slate-950/70 border-slate-800/80 text-slate-400'
              }`}>
                {overLose}
              </div>

              {/* Alignment Spacer matching subgame button */}
              <div className="w-[34px] shrink-0" />
            </div>
          </div>

          {/* 5. Expandable Subgames Accordion (핸디캡, 언더오버, 홀짝 등) */}
          {isExpanded && relatedSubgames.length > 0 && (
            <div
              className={`mt-2 pt-2 border-t space-y-1.5 animate-fadeIn ${
                isLight ? 'border-slate-200 bg-slate-50/50' : 'border-slate-800 bg-slate-950/50'
              } p-2 rounded-xl`}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="text-[11px] font-black text-slate-500 dark:text-slate-400 mb-1 flex items-center justify-between">
                <span>📋 베트맨 공식 추가 게임 ({relatedSubgames.length}개)</span>
                <span className="text-[10px] opacity-75">클릭 시 자동 마킹</span>
              </div>

              {relatedSubgames.map((sub) => {
                const subWin = sub.betmanOdds?.win ? Number(sub.betmanOdds.win).toFixed(2) : '-';
                const subDraw = sub.betmanOdds?.draw ? Number(sub.betmanOdds.draw).toFixed(2) : '-';
                const subLose = sub.betmanOdds?.lose ? Number(sub.betmanOdds.lose).toFixed(2) : '-';
                const hasDraw = sub.betmanGameType === '승N패' || sub.sport === 'football';

                const subPickKeyWin = `${sub.id}_WIN`;
                const subPickKeyDraw = `${sub.id}_DRAW`;
                const subPickKeyLose = `${sub.id}_LOSE`;

                const isSubWinSelected = markedPicks.includes(subPickKeyWin);
                const isSubDrawSelected = markedPicks.includes(subPickKeyDraw);
                const isSubLoseSelected = markedPicks.includes(subPickKeyLose);

                return (
                  <div
                    key={sub.id}
                    className={`flex items-center gap-1.5 p-1.5 rounded-lg border text-xs ${
                      isLight ? 'bg-white border-slate-200' : 'bg-slate-900 border-slate-800'
                    }`}
                  >
                    {/* Subgame Match No & Type */}
                    <div className="w-24 shrink-0 flex items-center gap-1">
                      <span className="font-mono font-bold text-[10px] px-1 py-0.2 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                        #{sub.betmanMatchNo}
                      </span>
                      <span className="font-extrabold text-[11px] truncate text-slate-800 dark:text-slate-200">
                        {sub.betmanGameType}
                        {sub.handicapValue ? ` (${sub.handicapValue})` : ''}
                      </span>
                    </div>

                    {/* Subgame Win Button */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        e.preventDefault();
                        onTogglePick && onTogglePick(sub.id, subPickKeyWin);
                      }}
                      className={`flex-1 py-1 px-1 rounded text-center text-xs font-bold border transition-all ${
                        isSubWinSelected
                          ? 'bg-emerald-500 text-white border-emerald-600'
                          : isLight
                          ? 'bg-slate-50 hover:bg-slate-100 text-slate-900 border-slate-200'
                          : 'bg-slate-850 hover:bg-slate-800 text-slate-200 border-slate-700'
                      }`}
                    >
                      <span className="text-[10px] text-slate-400 mr-1">
                        {sub.betmanGameType === '언더오버' ? '언더' : sub.betmanGameType === '홀짝' ? '홀' : '홈'}
                      </span>
                      {subWin}
                    </button>

                    {/* Subgame Draw Button (if applicable) */}
                    {hasDraw && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          e.preventDefault();
                          onTogglePick && onTogglePick(sub.id, subPickKeyDraw);
                        }}
                        className={`flex-1 py-1 px-1 rounded text-center text-xs font-bold border transition-all ${
                          isSubDrawSelected
                            ? 'bg-emerald-500 text-white border-emerald-600'
                            : isLight
                            ? 'bg-slate-50 hover:bg-slate-100 text-slate-900 border-slate-200'
                            : 'bg-slate-850 hover:bg-slate-800 text-slate-200 border-slate-700'
                        }`}
                      >
                        <span className="text-[10px] text-slate-400 mr-1">
                          {sub.betmanGameType === '승N패' ? 'N' : '무'}
                        </span>
                        {subDraw}
                      </button>
                    )}

                    {/* Subgame Lose Button */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        e.preventDefault();
                        onTogglePick && onTogglePick(sub.id, subPickKeyLose);
                      }}
                      className={`flex-1 py-1 px-1 rounded text-center text-xs font-bold border transition-all ${
                        isSubLoseSelected
                          ? 'bg-emerald-500 text-white border-emerald-600'
                          : isLight
                          ? 'bg-slate-50 hover:bg-slate-100 text-slate-900 border-slate-200'
                          : 'bg-slate-850 hover:bg-slate-800 text-slate-200 border-slate-700'
                      }`}
                    >
                      <span className="text-[10px] text-slate-400 mr-1">
                        {sub.betmanGameType === '언더오버' ? '오버' : sub.betmanGameType === '홀짝' ? '짝' : '원정'}
                      </span>
                      {subLose}
                    </button>
                  </div>
                );
              })}
            </div>
          )}

          {/* 6. Quick Action Strip: Analysis button */}
          <div className="flex items-center justify-between pt-1 text-xs">
            <span className="text-[11px] text-slate-400 font-medium truncate">
              {match.venue ? `🏟️ ${match.venue}` : '🏟️ 공식 경기장'}
            </span>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onSelectMatch(match);
              }}
              className="px-2.5 py-0.5 rounded-lg bg-emerald-500 text-white font-black text-[11px] flex items-center gap-0.5 hover:bg-emerald-600 transition-colors cursor-pointer shadow-xs active:scale-95"
            >
              <span>분석</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
