import React, { useState } from 'react';
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
  theme = 'dark'
}) => {
  const isLight = theme === 'light';

  // 경기 자동 매칭
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
    <div className={`rounded-xl border p-3.5 sm:p-5 font-sans transition-all ${
      isLight 
        ? 'bg-white border-slate-300 text-slate-900 shadow-sm' 
        : 'bg-slate-900 border-slate-700 text-slate-100 shadow-sm'
    }`}>
      {/* 1. 상단 심플 헤더: 탭 전환기 */}
      <div className="flex items-center justify-between gap-2 border-b pb-3 border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <span className="text-base font-black text-amber-600 dark:text-amber-400">⚾ 공식 마운드 실측 일지</span>
          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
            공식 확정
          </span>
        </div>

        {/* 탭 버튼 (박스 중첩 없는 플랫 탭) */}
        <div className="flex items-center gap-1.5">
          {OFFICIAL_KBO_KEY_GAMES.map((g, idx) => {
            const isSelected = selectedGameIdx === idx;
            return (
              <button
                key={g.gameNumber}
                type="button"
                onClick={() => setSelectedGameIdx(idx)}
                className={`px-3 py-1 rounded-lg text-xs font-black transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-amber-500 text-slate-950 shadow-xs'
                    : isLight
                      ? 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      : 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white'
                }`}
              >
                {idx === 0 ? '1경기 (LG·삼성)' : '2경기 (롯데·한화)'}
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. 대진 및 최종 스코어 (단일 라인) */}
      <div className="py-2.5 border-b border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-1.5 text-xs sm:text-sm font-black">
        <span className="text-slate-950 dark:text-white">{game.gameLabel}</span>
        <span className="text-emerald-600 dark:text-emerald-400 font-extrabold bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-200 dark:border-emerald-800">
          최종 스코어: {game.finalScore} ({game.winner})
        </span>
      </div>

      {/* 3. 본문 세로 나열 (중첩 박스 완전 제거: 글머리 기호와 가로 구분선으로만 시원하게 정리) */}
      <div className="pt-3 space-y-4 text-xs sm:text-[13px] leading-relaxed">
        
        {/* ================= 🏠 [홈팀 세로 블록] ================= */}
        <div className="space-y-1.5">
          <div className="font-extrabold text-sm text-emerald-700 dark:text-emerald-400 flex items-center gap-2">
            <span>[ 🏠 홈팀: {game.homeTeam} ({game.winner.includes('LG') || game.winner.includes('롯데') ? '승리 🏆' : '패전'}) ]</span>
          </div>

          {/* 선발 투수 기록 */}
          <div className="pl-2 font-medium">
            <span className="font-bold text-slate-900 dark:text-white">• 선발: </span>
            <span className="font-extrabold text-amber-700 dark:text-amber-300">{game.homePitching.starter}</span>
            <span className="font-mono font-bold text-slate-800 dark:text-slate-200"> — {game.homePitching.innings}이닝 {game.homePitching.pitches}구</span>
            <span className="text-slate-600 dark:text-slate-400 font-normal"> (볼 {game.homePitching.balls} / 스트라이크 {game.homePitching.strikes}), {game.homePitching.hits}피안타 {game.homePitching.strikeouts}탈삼진 {game.homePitching.runs}실점</span>
          </div>

          {/* 불펜 등판 일지 */}
          <div className="pl-2 space-y-1 pt-0.5">
            <div className="font-bold text-slate-800 dark:text-slate-200">• 불펜:</div>
            <div className="pl-4 space-y-1 text-slate-700 dark:text-slate-300">
              {game.homePitching.bullpen.map((bp, i) => (
                <div key={i} className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs">{bp.role === 'VICTORY' ? '🔴' : '⚫'}</span>
                  <span className="font-bold text-slate-900 dark:text-white">{bp.name}</span>
                  <span className="text-slate-500 font-medium">({bp.order}):</span>
                  <span className="font-mono font-extrabold text-slate-800 dark:text-slate-200">{bp.inning} {bp.pitches}구</span>
                  <span className={`text-[11px] font-bold ${bp.role === 'VICTORY' ? 'text-rose-600 dark:text-rose-400' : 'text-slate-500'}`}>
                    [{bp.roleLabel}{bp.isSave ? ', 세이브' : ''}]
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 얇고 깔끔한 가로 구분선 하나로 홈과 원정 분리 */}
        <hr className="border-t border-slate-200 dark:border-slate-800 my-3" />

        {/* ================= ✈️ [원정팀 세로 블록] ================= */}
        <div className="space-y-1.5">
          <div className="font-extrabold text-sm text-cyan-700 dark:text-cyan-400 flex items-center gap-2">
            <span>[ ✈️ 원정팀: {game.awayTeam} ({game.winner.includes('삼성') || game.winner.includes('한화') ? '승리 🏆' : '패전'}) ]</span>
          </div>

          {/* 선발 투수 기록 */}
          <div className="pl-2 font-medium">
            <span className="font-bold text-slate-900 dark:text-white">• 선발: </span>
            <span className="font-extrabold text-amber-700 dark:text-amber-300">{game.awayPitching.starter}</span>
            <span className="font-mono font-bold text-slate-800 dark:text-slate-200"> — {game.awayPitching.innings}이닝 {game.awayPitching.pitches}구</span>
            <span className="text-slate-600 dark:text-slate-400 font-normal"> (볼 {game.awayPitching.balls} / 스트라이크 {game.awayPitching.strikes}), {game.awayPitching.hits}피안타 {game.awayPitching.strikeouts}탈삼진 {game.awayPitching.runs}실점</span>
          </div>

          {/* 불펜 등판 일지 */}
          <div className="pl-2 space-y-1 pt-0.5">
            <div className="font-bold text-slate-800 dark:text-slate-200">• 불펜:</div>
            <div className="pl-4 space-y-1 text-slate-700 dark:text-slate-300">
              {game.awayPitching.bullpen.map((bp, i) => (
                <div key={i} className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs">{bp.role === 'VICTORY' ? '🔴' : '⚫'}</span>
                  <span className="font-bold text-slate-900 dark:text-white">{bp.name}</span>
                  <span className="text-slate-500 font-medium">({bp.order}):</span>
                  <span className="font-mono font-extrabold text-slate-800 dark:text-slate-200">{bp.inning} {bp.pitches}구</span>
                  <span className={`text-[11px] font-bold ${bp.role === 'VICTORY' ? 'text-rose-600 dark:text-rose-400' : 'text-slate-500'}`}>
                    [{bp.roleLabel}{bp.isSave ? ', 세이브' : ''}]
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
