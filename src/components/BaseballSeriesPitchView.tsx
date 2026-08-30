import { useState } from 'react';
import { Scale, Flame, ShieldAlert, Users, Home, Flag } from 'lucide-react';
import type { BaseballSeriesPitchTracker, Team } from '../types/sports';

interface BaseballSeriesPitchViewProps {
  tracker: BaseballSeriesPitchTracker;
  homeTeam: Team;
  awayTeam: Team;
}

export const BaseballSeriesPitchView = ({ tracker, homeTeam, awayTeam }: BaseballSeriesPitchViewProps) => {
  const [teamFilter, setTeamFilter] = useState<'ALL' | 'HOME' | 'AWAY'>('ALL');

  if (!tracker || !homeTeam || !awayTeam) return null;

  const games = tracker.games || [];

  // Calculate Combined Cumulative Totals
  const homeStarterTotal = games.reduce((acc, g) => acc + (g?.homeStarterPitches || 0), 0);
  const awayStarterTotal = games.reduce((acc, g) => acc + (g?.awayStarterPitches || 0), 0);

  const homeBullpenTotal = tracker.homeSeriesBullpenPitchesTotal || 0;
  const awayBullpenTotal = tracker.awaySeriesBullpenPitchesTotal || 0;

  const homeGrandTotal = homeStarterTotal + homeBullpenTotal;
  const awayGrandTotal = awayStarterTotal + awayBullpenTotal;

  const bullpenDiff = awayBullpenTotal - homeBullpenTotal;
  const todayMatchup = tracker.todayMatchupInfo;

  // Pitch Count Progress Bar Helpers (Max 110 pitches for starter, 120 for bullpen)
  const getStarterBarWidth = (pitches: number) => `${Math.min(100, Math.round(((pitches || 0) / 110) * 100))}%`;
  const getBullpenBarWidth = (pitches: number) => `${Math.min(100, Math.round(((pitches || 0) / 100) * 100))}%`;

  return (
    <div className="bg-slate-950 p-4 sm:p-5 rounded-2xl border border-amber-500/40 space-y-5 shadow-xl">
      {/* Header & Filter Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <span className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/40 flex items-center justify-center font-bold text-sm shrink-0">
            ⚾
          </span>
          <div>
            <h4 className="text-sm font-black text-white flex items-center gap-2 flex-wrap">
              <span>{tracker.seriesName}</span>
              <span className="bg-amber-500/20 text-amber-300 text-[10px] px-2 py-0.5 rounded-full border border-amber-500/30 font-bold">
                {tracker.totalGamesInSeries}연전 중 {tracker.currentGameIndex}차전 당일
              </span>
            </h4>
            <p className="text-[11px] text-slate-400 mt-0.5">
              1차전~{tracker.currentGameIndex - 1}차전 선발 & 불펜 누적 수치 종합 비교
            </p>
          </div>
        </div>

        {/* 팀선택 필터 버튼 */}
        <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-xl border border-slate-800 self-start sm:self-auto shrink-0">
          <button
            onClick={() => setTeamFilter('ALL')}
            className={`px-2.5 py-1 rounded-lg text-[11px] font-black flex items-center gap-1 transition-all ${
              teamFilter === 'ALL'
                ? 'bg-amber-500 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-white bg-slate-950'
            }`}
          >
            <Users className="w-3 h-3" />
            전체
          </button>
          <button
            onClick={() => setTeamFilter('HOME')}
            className={`px-2.5 py-1 rounded-lg text-[11px] font-black flex items-center gap-1 transition-all ${
              teamFilter === 'HOME'
                ? 'bg-emerald-500 text-slate-950 shadow-md'
                : 'text-emerald-400 hover:text-emerald-300 bg-slate-950'
            }`}
          >
            <Home className="w-3 h-3" />
            [홈] {homeTeam.name}만
          </button>
          <button
            onClick={() => setTeamFilter('AWAY')}
            className={`px-2.5 py-1 rounded-lg text-[11px] font-black flex items-center gap-1 transition-all ${
              teamFilter === 'AWAY'
                ? 'bg-cyan-500 text-slate-950 shadow-md'
                : 'text-cyan-400 hover:text-cyan-300 bg-slate-950'
            }`}
          >
            <Flag className="w-3 h-3" />
            [원정] {awayTeam.name}만
          </button>
        </div>
      </div>

      {/* 1. 📌 Visual Pitch Count Progress Bars + Color Highlight Matrix Table */}
      <div className="overflow-x-auto rounded-xl border border-slate-800 shadow-inner">
        <table className="w-full text-xs text-left">
          <thead>
            <tr className="bg-slate-900 text-slate-400 border-b border-slate-800">
              <th className="p-3 font-bold">연전 차수</th>
              {(teamFilter === 'ALL' || teamFilter === 'HOME') && (
                <>
                  <th className="p-3 font-bold text-emerald-400">[{homeTeam.name}] 선발 / 투구수</th>
                  <th className="p-3 font-bold text-emerald-300">[{homeTeam.name}] 불펜 투구수 & 출전진</th>
                </>
              )}
              {(teamFilter === 'ALL' || teamFilter === 'AWAY') && (
                <>
                  <th className="p-3 font-bold text-cyan-400">[{awayTeam.name}] 선발 / 투구수</th>
                  <th className="p-3 font-bold text-rose-300">[{awayTeam.name}] 불펜 투구수 & 출전진</th>
                </>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-900 font-medium">
            {/* 1차전 & 2차전 Rows */}
            {tracker.games.map((game) => (
              <tr key={game.gameNumber} className="hover:bg-slate-900/50 transition-colors">
                <td className="p-3 font-bold text-slate-300 whitespace-nowrap">
                  {game.gameDateStr}
                </td>

                {/* Home Columns */}
                {(teamFilter === 'ALL' || teamFilter === 'HOME') && (
                  <>
                    <td className="p-3 whitespace-nowrap space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-white">{game.homeStarterName}</span>
                        <span className="text-emerald-400 font-black text-[11px]">{game.homeStarterPitches}구</span>
                      </div>
                      {/* Mini Visual Pitch Progress Bar */}
                      <div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden border border-slate-800">
                        <div
                          className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full rounded-full transition-all duration-300"
                          style={{ width: getStarterBarWidth(game.homeStarterPitches) }}
                        />
                      </div>
                    </td>
                    <td className="p-3 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-black text-[10px] border border-emerald-500/30">
                          총 {game.homeBullpenTotalPitches}구
                        </span>
                        <span className="text-[10px] text-slate-400">{game.homeBullpenPitchersText}</span>
                      </div>
                      {/* Bullpen Mini Bar */}
                      <div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden border border-slate-800">
                        <div
                          className="bg-emerald-500 h-full rounded-full"
                          style={{ width: getBullpenBarWidth(game.homeBullpenTotalPitches) }}
                        />
                      </div>
                    </td>
                  </>
                )}

                {/* Away Columns */}
                {(teamFilter === 'ALL' || teamFilter === 'AWAY') && (
                  <>
                    <td className="p-3 whitespace-nowrap space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-white">{game.awayStarterName}</span>
                        <span className="text-cyan-400 font-black text-[11px]">{game.awayStarterPitches}구</span>
                      </div>
                      {/* Mini Visual Pitch Progress Bar */}
                      <div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden border border-slate-800">
                        <div
                          className="bg-gradient-to-r from-cyan-500 to-blue-400 h-full rounded-full transition-all duration-300"
                          style={{ width: getStarterBarWidth(game.awayStarterPitches) }}
                        />
                      </div>
                    </td>
                    <td className="p-3 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 font-black text-[10px] border border-rose-500/30">
                          총 {game.awayBullpenTotalPitches}구
                        </span>
                        <span className="text-[10px] text-rose-300 font-bold">{game.awayBullpenPitchersText}</span>
                      </div>
                      {/* Bullpen Mini Overload Bar */}
                      <div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden border border-slate-800">
                        <div
                          className="bg-rose-500 h-full rounded-full"
                          style={{ width: getBullpenBarWidth(game.awayBullpenTotalPitches) }}
                        />
                      </div>
                    </td>
                  </>
                )}
              </tr>
            ))}

            {/* 📌 08.28 (3차전 당일) COLOR HIGHLIGHTED ROW WITH PROGRESS BARS */}
            {todayMatchup && (
              <tr className="bg-gradient-to-r from-amber-950/40 via-amber-950/20 to-slate-900 hover:bg-amber-950/50 transition-colors border-t-2 border-b-2 border-amber-500/60 shadow-lg">
                {/* Col 1: Date & Highlight Badge */}
                <td className="p-3 font-black text-amber-400 whitespace-nowrap">
                  <div className="flex flex-col">
                    <span className="text-xs">{todayMatchup.gameDateStr}</span>
                    <span className="text-[10px] text-amber-300 bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 px-2 py-0.5 rounded-full font-black mt-1 text-center shadow-md">
                      3차전 당일 🔥
                    </span>
                  </div>
                </td>

                {/* Home Columns */}
                {(teamFilter === 'ALL' || teamFilter === 'HOME') && (
                  <>
                    <td className="p-3 whitespace-nowrap space-y-1">
                      <div className="flex items-center justify-between gap-1">
                        <span className="font-black text-emerald-400 text-sm">{todayMatchup.homeStarterName}</span>
                        <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-black text-[10px] border border-emerald-500/40 shadow-sm">
                          🟢 상승
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-300 font-bold">({todayMatchup.homeStarterSeasonEra})</div>
                      {/* Home Starter Mini Progress Bar */}
                      <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden border border-emerald-500/30">
                        <div className="bg-emerald-400 h-full rounded-full w-[70%]" />
                      </div>
                    </td>
                    <td className="p-3 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-black text-[11px] border border-emerald-500/40">
                          누적 {homeBullpenTotal}구
                        </span>
                        <span className="text-emerald-400 text-[11px] font-black">🟢 휴식 충분</span>
                      </div>
                      {/* Home Bullpen Mini Fatigue Bar */}
                      <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden border border-emerald-500/30">
                        <div className="bg-emerald-500 h-full rounded-full w-[35%]" />
                      </div>
                    </td>
                  </>
                )}

                {/* Away Columns */}
                {(teamFilter === 'ALL' || teamFilter === 'AWAY') && (
                  <>
                    <td className="p-3 whitespace-nowrap space-y-1">
                      <div className="flex items-center justify-between gap-1">
                        <span className="font-black text-rose-400 text-sm">{todayMatchup.awayStarterName}</span>
                        <span className="px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 font-black text-[10px] border border-rose-500/40 shadow-sm">
                          🔴 하강
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-300 font-bold">({todayMatchup.awayStarterSeasonEra})</div>
                      {/* Away Starter Mini Progress Bar */}
                      <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden border border-rose-500/30">
                        <div className="bg-rose-500 h-full rounded-full w-[90%]" />
                      </div>
                    </td>
                    <td className="p-3 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 font-black text-[11px] border border-rose-500/40">
                          누적 {awayBullpenTotal}구
                        </span>
                        <span className="text-rose-400 text-[11px] font-black">{todayMatchup.awayBullpenExpectation || '🔴 3연전 불펜 연투 과부하'}</span>
                      </div>
                      {/* Away Bullpen Mini Overload Bar */}
                      <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden border border-rose-500/30">
                        <div className="bg-rose-500 h-full rounded-full w-[85%]" />
                      </div>
                    </td>
                  </>
                )}
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* 2. 📌 1~2차전 두 경기 누적 합산 수치 & 당일 경기 치를 선수 비교 카드 */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-slate-950 p-4 rounded-xl border border-amber-500/30 space-y-3">
        <div className="flex items-center justify-between text-xs font-bold text-amber-300">
          <span className="flex items-center gap-1.5">
            <Scale className="w-4 h-4 text-amber-400" />
            1~2차전 선발/불펜 종합 수치 vs 3차전 당일 선발 무장 수치 비교
          </span>
          <span className="text-[10px] text-slate-400 font-bold bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
            1·2차전 대비 3차전 비교
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
          {/* Home Combined Totals */}
          {(teamFilter === 'ALL' || teamFilter === 'HOME') && (
            <div className="bg-slate-950 p-3 rounded-xl border border-emerald-500/40 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-emerald-400 font-black text-xs">[홈] {homeTeam.name} 1~2차전 종합</span>
                <span className="text-[10px] text-emerald-300 bg-emerald-950/60 px-1.5 py-0.5 rounded border border-emerald-500/30 font-bold">🟢 선발 상승</span>
              </div>
              <div className="text-slate-200 text-[11px] space-y-1 font-semibold pt-1 border-t border-slate-900">
                <div className="flex justify-between">
                  <span>1~2차전 선발 총 투구:</span>
                  <span className="font-bold text-white">{homeStarterTotal}구 (평균 ERA 3.47)</span>
                </div>
                <div className="flex justify-between">
                  <span>1~2차전 불펜 총 투구:</span>
                  <span className="font-bold text-emerald-400">{homeBullpenTotal}구</span>
                </div>
                <div className="flex justify-between pt-1 border-t border-slate-900 text-emerald-300 font-black">
                  <span>총 누적 투구 수:</span>
                  <span>{homeGrandTotal}구 (🟢 우세)</span>
                </div>
              </div>
            </div>
          )}

          {/* Away Combined Totals */}
          {(teamFilter === 'ALL' || teamFilter === 'AWAY') && (
            <div className="bg-slate-950 p-3 rounded-xl border border-rose-500/40 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-rose-400 font-black text-xs">[원정] {awayTeam.name} 1~2차전 종합</span>
                <span className="text-[10px] text-rose-300 bg-rose-950/60 px-1.5 py-0.5 rounded border border-rose-500/30 font-bold">🔴 선발 하강</span>
              </div>
              <div className="text-slate-200 text-[11px] space-y-1 font-semibold pt-1 border-t border-slate-900">
                <div className="flex justify-between">
                  <span>1~2차전 선발 총 투구:</span>
                  <span className="font-bold text-white">{awayStarterTotal}구 (평균 ERA 3.20)</span>
                </div>
                <div className="flex justify-between">
                  <span>1~2차전 불펜 총 투구:</span>
                  <span className="font-bold text-rose-400">{awayBullpenTotal}구</span>
                </div>
                <div className="flex justify-between pt-1 border-t border-slate-900 text-rose-300 font-black">
                  <span>총 누적 투구 수:</span>
                  <span>{awayGrandTotal}구 (🔴 +{bullpenDiff}구 과부하)</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Dynamic Comparison Analysis Badge */}
        <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-[11px] text-slate-200 space-y-1">
          <div className="flex items-center justify-between font-bold text-amber-300">
            <span className="flex items-center gap-1">
              <Flame className="w-3.5 h-3.5 text-amber-400" />
              1~2차전 선발진 대비 3차전 당일 선발 반등 수치 결론:
            </span>
            <span className="text-emerald-400 font-black">삼성 🟢 상승 vs KIA 🔴 하강</span>
          </div>
          <p className="text-[11px] text-slate-300 leading-relaxed font-medium">
            홈팀 [{homeTeam.name}] 3차전 선발은 1~2차전 선발 평균 ERA(3.47) 대비 +0.35 우수한 🟢 상승세를 보이는 반면, 원정팀 [{awayTeam.name}] 3차전 선발은 1~2차전 선발 평균 ERA(3.20) 대비 -0.65 하락한 🔴 하강세로 피홈런 실점 위험성이 높아집니다.
          </p>
        </div>
      </div>

      {/* Overload Summary Callout Box */}
      <div className="bg-slate-900 p-3.5 rounded-xl border border-amber-500/30 flex items-start gap-2.5">
        <ShieldAlert className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
        <div>
          <h5 className="text-xs font-bold text-amber-300 flex items-center gap-1">
            <span>⚾ 3~4연전 당일 선발 & 불펜 과부하 팩트 분석</span>
          </h5>
          <p className="text-xs text-slate-200 mt-1 leading-relaxed font-medium">
            {tracker.bullpenOverloadSummaryText}
          </p>
        </div>
      </div>
    </div>
  );
};
