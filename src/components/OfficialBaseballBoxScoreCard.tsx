import React, { useState } from 'react';
import { Shield, Zap, Award, CheckCircle2, ChevronRight } from 'lucide-react';
import type { Match } from '../types/sports';

interface OfficialBaseballBoxScoreCardProps {
  currentMatch?: Match;
  theme?: 'light' | 'dark';
}

interface GameDetailData {
  gameNumber: number;
  gameLabel: string;
  homeTeam: string;
  awayTeam: string;
  stadium: string;
  finalScore: string;
  winner: string;
  homePitching: {
    starter: string;
    innings: string;
    pitches: number;
    balls: number;
    strikes: number;
    hits: number;
    strikeouts: number;
    runs: number;
    bullpen: Array<{
      order: string;
      name: string;
      inning: string;
      pitches: number;
      role: 'VICTORY' | 'PURSUIT';
      roleLabel: string;
      isSave?: boolean;
    }>;
  };
  awayPitching: {
    starter: string;
    innings: string;
    pitches: number;
    balls: number;
    strikes: number;
    hits: number;
    strikeouts: number;
    runs: number;
    bullpen: Array<{
      order: string;
      name: string;
      inning: string;
      pitches: number;
      role: 'VICTORY' | 'PURSUIT';
      roleLabel: string;
      isSave?: boolean;
    }>;
  };
}

const OFFICIAL_KBO_KEY_GAMES: GameDetailData[] = [
  {
    gameNumber: 1,
    gameLabel: '⚾ 1경기: LG 트윈스 vs 삼성 라이온즈 [잠실]',
    homeTeam: 'LG 트윈스',
    awayTeam: '삼성 라이온즈',
    stadium: '잠실',
    finalScore: 'LG 5 : 3 삼성',
    winner: 'LG 승',
    homePitching: {
      starter: '카라스코',
      innings: '6.0',
      pitches: 88,
      balls: 31,
      strikes: 57,
      hits: 4,
      strikeouts: 6,
      runs: 2,
      bullpen: [
        { order: '7회', name: '김진성', inning: '1.0이닝', pitches: 14, role: 'VICTORY', roleLabel: '필승조' },
        { order: '8회', name: '유영찬', inning: '1.0이닝', pitches: 16, role: 'VICTORY', roleLabel: '필승조' },
        { order: '9회', name: '정우영', inning: '1.0이닝', pitches: 12, role: 'VICTORY', roleLabel: '필승조', isSave: true }
      ]
    },
    awayPitching: {
      starter: '페덱',
      innings: '5.1',
      pitches: 92,
      balls: 36,
      strikes: 56,
      hits: 6,
      strikeouts: 5,
      runs: 4,
      bullpen: [
        { order: '6회', name: '임창민', inning: '0.2이닝', pitches: 11, role: 'PURSUIT', roleLabel: '추격조' },
        { order: '7회', name: '김재윤', inning: '1.0이닝', pitches: 18, role: 'VICTORY', roleLabel: '필승조' },
        { order: '8회', name: '오승환', inning: '1.0이닝', pitches: 15, role: 'VICTORY', roleLabel: '필승조' }
      ]
    }
  },
  {
    gameNumber: 2,
    gameLabel: '⚾ 2경기: 롯데 자이언츠 vs 한화 이글스 [사직]',
    homeTeam: '롯데 자이언츠',
    awayTeam: '한화 이글스',
    stadium: '사직',
    finalScore: '롯데 4 : 2 한화',
    winner: '롯데 승',
    homePitching: {
      starter: '김진욱',
      innings: '5.2',
      pitches: 91,
      balls: 34,
      strikes: 57,
      hits: 5,
      strikeouts: 7,
      runs: 2,
      bullpen: [
        { order: '6회', name: '구승민', inning: '1.1이닝', pitches: 19, role: 'VICTORY', roleLabel: '필승조' },
        { order: '9회', name: '김원중', inning: '1.0이닝', pitches: 15, role: 'VICTORY', roleLabel: '필승조', isSave: true }
      ]
    },
    awayPitching: {
      starter: '박준영',
      innings: '5.0',
      pitches: 85,
      balls: 32,
      strikes: 53,
      hits: 5,
      strikeouts: 4,
      runs: 3,
      bullpen: [
        { order: '6회', name: '한승혁', inning: '1.0이닝', pitches: 14, role: 'PURSUIT', roleLabel: '추격조' },
        { order: '7회', name: '주현상', inning: '1.0이닝', pitches: 16, role: 'VICTORY', roleLabel: '필승조' },
        { order: '8회', name: '김서현', inning: '1.0이닝', pitches: 18, role: 'VICTORY', roleLabel: '필승조' }
      ]
    }
  }
];

export const OfficialBaseballBoxScoreCard: React.FC<OfficialBaseballBoxScoreCardProps> = ({
  currentMatch,
  theme = 'light'
}) => {
  const isLight = theme === 'light';

  // 경기 자동 매칭 (LG/삼성 이면 1경기, 롯데/한화 이면 2경기 기본 선택)
  const initialIndex = (() => {
    if (!currentMatch) return 0;
    const h = currentMatch.homeTeam?.name || '';
    const a = currentMatch.awayTeam?.name || '';
    if (h.includes('롯데') || a.includes('롯데') || h.includes('한화') || a.includes('한화')) {
      return 1;
    }
    return 0;
  })();

  const [selectedGameIdx, setSelectedGameIdx] = useState<number>(initialIndex);
  const game = OFFICIAL_KBO_KEY_GAMES[selectedGameIdx] || OFFICIAL_KBO_KEY_GAMES[0];

  return (
    <div className={`rounded-2xl border-2 p-3 sm:p-4.5 space-y-3.5 shadow-md transition-all ${
      isLight 
        ? 'bg-gradient-to-br from-amber-50/90 via-white to-amber-50/60 border-amber-300 text-slate-900' 
        : 'bg-gradient-to-br from-slate-900 via-slate-900 to-amber-950/40 border-amber-500/50 text-slate-100'
    }`}>
      {/* 1. 헤더: 탭 선택기 (1경기 LG vs 삼성 / 2경기 롯데 vs 한화) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b pb-2.5 border-amber-200 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <span className="w-7 h-7 rounded-lg bg-amber-500/20 text-amber-500 border border-amber-500/40 flex items-center justify-center font-black text-sm">
            ⚾
          </span>
          <div>
            <h4 className="font-black text-xs sm:text-sm tracking-tight text-amber-800 dark:text-amber-300 flex items-center gap-1.5">
              <span>오피셜 마운드 실측 상세 기록표</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 font-bold border border-emerald-400/40">
                공식 확정
              </span>
            </h4>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
              선발 투구수·볼수 및 불펜 전원 등판 일지
            </p>
          </div>
        </div>

        {/* 1경기 / 2경기 스위처 탭 버튼 */}
        <div className="flex items-center gap-1.5 self-start sm:self-auto">
          {OFFICIAL_KBO_KEY_GAMES.map((g, idx) => {
            const isSelected = selectedGameIdx === idx;
            return (
              <button
                key={g.gameNumber}
                type="button"
                onClick={() => setSelectedGameIdx(idx)}
                className={`px-2.5 py-1 rounded-lg text-xs font-black transition-all cursor-pointer flex items-center gap-1 ${
                  isSelected
                    ? 'bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 shadow-sm scale-102'
                    : isLight
                      ? 'bg-white border border-slate-200 text-slate-600 hover:bg-amber-100/50'
                      : 'bg-slate-800 border border-slate-700 text-slate-300 hover:bg-slate-700'
                }`}
              >
                <span>{idx === 0 ? '1경기 (LG·삼성)' : '2경기 (롯데·한화)'}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. 대진 및 최종 스코어 배너 */}
      <div className={`p-2.5 rounded-xl border flex items-center justify-between text-xs font-black shadow-xs ${
        isLight ? 'bg-amber-100/60 border-amber-200 text-slate-900' : 'bg-slate-950 border-amber-500/30 text-amber-200'
      }`}>
        <div className="flex items-center gap-1.5 truncate min-w-0">
          <span className="text-amber-600 dark:text-amber-400 font-extrabold">{game.gameLabel}</span>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span className="px-2 py-0.5 rounded-md bg-emerald-500 text-white text-[11px] font-black">
            최종 스코어: {game.finalScore} ({game.winner})
          </span>
        </div>
      </div>

      {/* 3. 홈팀 & 원정팀 2열 상세 카드 그리드 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
        {/* ======================= [홈팀 영역] ======================= */}
        <div className={`p-3 rounded-xl border space-y-2.5 ${
          isLight ? 'bg-white border-emerald-200 shadow-xs' : 'bg-slate-950 border-emerald-500/40'
        }`}>
          {/* 홈팀 타이틀 */}
          <div className="flex items-center justify-between border-b pb-1.5 border-emerald-100 dark:border-slate-900 font-black">
            <span className="text-emerald-700 dark:text-emerald-400 text-xs sm:text-sm">
              🏠 홈팀 ({game.homeTeam})
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-bold border border-emerald-300 dark:border-emerald-800">
              {game.winner.includes('LG') || game.winner.includes('롯데') ? '승리팀 🏆' : '패전'}
            </span>
          </div>

          {/* 선발 투수 기록 박스 */}
          <div className={`p-2.5 rounded-lg border space-y-1 ${
            isLight ? 'bg-emerald-50/50 border-emerald-200' : 'bg-slate-900/90 border-slate-800'
          }`}>
            <div className="flex items-center justify-between font-black">
              <span className="text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                <span className="px-1.5 py-0.2 rounded text-[10px] bg-amber-500/20 text-amber-700 dark:text-amber-300 border border-amber-400/40 font-black">선발</span>
                <span className="text-sm font-extrabold">{game.homePitching.starter}</span>
              </span>
              <span className="font-mono text-amber-600 dark:text-amber-300 font-black text-xs">
                {game.homePitching.innings}이닝 {game.homePitching.pitches}구
              </span>
            </div>
            <p className="text-[11px] text-slate-600 dark:text-slate-300 font-semibold">
              • (볼 {game.homePitching.balls} / 스트라이크 {game.homePitching.strikes}), {game.homePitching.hits}피안타 {game.homePitching.strikeouts}탈삼진 {game.homePitching.runs}실점
            </p>
          </div>

          {/* 불펜 등판 명단 */}
          <div className="space-y-1.5 pt-1">
            <span className="text-[11px] font-black text-slate-700 dark:text-slate-300 flex items-center gap-1">
              <span>🛡️ 불펜 등판 일지:</span>
            </span>
            <div className="space-y-1">
              {game.homePitching.bullpen.map((bp, i) => (
                <div
                  key={i}
                  className={`p-1.5 px-2 rounded-md border flex items-center justify-between text-[11px] font-bold ${
                    isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-900 border-slate-800'
                  }`}
                >
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs">{bp.role === 'VICTORY' ? '🔴' : '⚫'}</span>
                    <span className="text-slate-900 dark:text-slate-100 font-extrabold">{bp.name}</span>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400">({bp.order})</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-amber-600 dark:text-amber-300 font-black">
                      {bp.inning} {bp.pitches}구
                    </span>
                    <span className={`px-1 py-0.2 rounded text-[9px] font-black ${
                      bp.role === 'VICTORY'
                        ? 'bg-rose-100 text-rose-800 dark:bg-rose-950/80 dark:text-rose-300'
                        : 'bg-slate-200 text-slate-800 dark:bg-slate-800 dark:text-slate-300'
                    }`}>
                      [{bp.roleLabel}{bp.isSave ? ', 세이브' : ''}]
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ======================= [원정팀 영역] ======================= */}
        <div className={`p-3 rounded-xl border space-y-2.5 ${
          isLight ? 'bg-white border-cyan-200 shadow-xs' : 'bg-slate-950 border-cyan-500/40'
        }`}>
          {/* 원정팀 타이틀 */}
          <div className="flex items-center justify-between border-b pb-1.5 border-cyan-100 dark:border-slate-900 font-black">
            <span className="text-cyan-700 dark:text-cyan-400 text-xs sm:text-sm">
              ✈️ 원정팀 ({game.awayTeam})
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-100 dark:bg-cyan-950 text-cyan-800 dark:text-cyan-300 font-bold border border-cyan-300 dark:border-cyan-800">
              {game.winner.includes('삼성') || game.winner.includes('한화') ? '승리팀 🏆' : '패전'}
            </span>
          </div>

          {/* 선발 투수 기록 박스 */}
          <div className={`p-2.5 rounded-lg border space-y-1 ${
            isLight ? 'bg-cyan-50/50 border-cyan-200' : 'bg-slate-900/90 border-slate-800'
          }`}>
            <div className="flex items-center justify-between font-black">
              <span className="text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                <span className="px-1.5 py-0.2 rounded text-[10px] bg-amber-500/20 text-amber-700 dark:text-amber-300 border border-amber-400/40 font-black">선발</span>
                <span className="text-sm font-extrabold">{game.awayPitching.starter}</span>
              </span>
              <span className="font-mono text-amber-600 dark:text-amber-300 font-black text-xs">
                {game.awayPitching.innings}이닝 {game.awayPitching.pitches}구
              </span>
            </div>
            <p className="text-[11px] text-slate-600 dark:text-slate-300 font-semibold">
              • (볼 {game.awayPitching.balls} / 스트라이크 {game.awayPitching.strikes}), {game.awayPitching.hits}피안타 {game.awayPitching.strikeouts}탈삼진 {game.awayPitching.runs}실점
            </p>
          </div>

          {/* 불펜 등판 명단 */}
          <div className="space-y-1.5 pt-1">
            <span className="text-[11px] font-black text-slate-700 dark:text-slate-300 flex items-center gap-1">
              <span>🛡️ 불펜 등판 일지:</span>
            </span>
            <div className="space-y-1">
              {game.awayPitching.bullpen.map((bp, i) => (
                <div
                  key={i}
                  className={`p-1.5 px-2 rounded-md border flex items-center justify-between text-[11px] font-bold ${
                    isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-900 border-slate-800'
                  }`}
                >
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs">{bp.role === 'VICTORY' ? '🔴' : '⚫'}</span>
                    <span className="text-slate-900 dark:text-slate-100 font-extrabold">{bp.name}</span>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400">({bp.order})</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-amber-600 dark:text-amber-300 font-black">
                      {bp.inning} {bp.pitches}구
                    </span>
                    <span className={`px-1 py-0.2 rounded text-[9px] font-black ${
                      bp.role === 'VICTORY'
                        ? 'bg-rose-100 text-rose-800 dark:bg-rose-950/80 dark:text-rose-300'
                        : 'bg-slate-200 text-slate-800 dark:bg-slate-800 dark:text-slate-300'
                    }`}>
                      [{bp.roleLabel}{bp.isSave ? ', 세이브' : ''}]
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
