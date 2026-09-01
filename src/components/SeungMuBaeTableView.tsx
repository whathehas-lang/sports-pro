import React, { useState, useMemo } from 'react';
import { RotateCcw, Wand2, Info, ChevronDown } from 'lucide-react';
import type { Match } from '../types/sports';

interface SeungMuBaeTableViewProps {
  matches: Match[];
  selectedRound: string;
  onSelectRound: (round: string) => void;
  onSelectMatch: (match: Match) => void;
  theme?: 'light' | 'dark';
}

// 📌 2026년 49회차 축구 승무패 오피셜 투표율 팩트 데이터 (사진과 100% 동일)
const OFFICIAL_FOOTBALL_VOTE_RATES: Record<number, { win: number; draw: number; lose: number }> = {
  1: { win: 50.5, draw: 34.5, lose: 15.0 },
  2: { win: 16.9, draw: 33.1, lose: 50.0 },
  3: { win: 70.6, draw: 18.4, lose: 11.1 },
  4: { win: 67.8, draw: 20.7, lose: 11.5 },
  5: { win: 33.2, draw: 23.9, lose: 42.9 },
  6: { win: 23.0, draw: 32.6, lose: 44.4 },
  7: { win: 17.6, draw: 25.1, lose: 57.3 },
  8: { win: 9.5, draw: 18.0, lose: 72.5 },
  9: { win: 52.9, draw: 32.2, lose: 14.9 },
  10: { win: 13.0, draw: 18.3, lose: 68.7 },
  11: { win: 18.7, draw: 35.8, lose: 45.5 },
  12: { win: 76.7, draw: 12.6, lose: 10.7 },
  13: { win: 45.0, draw: 35.2, lose: 19.8 },
  14: { win: 14.9, draw: 27.5, lose: 57.5 },
};

// 📌 축구 팀 이름 축약 매핑 (사진과 100% 동일한 텍스트)
const FOOTBALL_SHORT_NAMES: Record<string, string> = {
  '포츠머스': '포츠머스',
  '더비카운': '더비카운',
  '더비 카운티': '더비카운',
  '프레스턴': '프레스턴',
  '브리스C': '브리스C',
  '브리스톨 시티': '브리스C',
  '셰필드U': '셰필드U',
  '셰필드 유나이티드': '셰필드U',
  '볼턴W': '볼턴W',
  '볼턴원더': '볼턴W',
  '스완지C': '스완지C',
  '스완지 시티': '스완지C',
  '왓포드': '왓포드',
  '웨스트햄': '웨스트햄',
  '울버햄튼': '울버햄튼',
  '버밍엄C': '버밍엄C',
  '버밍엄': '버밍엄C',
  '사우샘프': '사우샘프',
  '사우샘프턴': '사우샘프',
  '스토크C': '스토크C',
  '스토크 시티': '스토크C',
  '노리치C': '노리치C',
  '노리치 시티': '노리치C',
  '도쿄베르': '도쿄베르',
  '도쿄 베르디': '도쿄베르',
  '비셀고베': '비셀고베',
  '마치다Z': '마치다Z',
  '마치다': '마치다Z',
  '가와사키': '가와사키',
  '시미즈S': '시미즈S',
  '시미즈': '시미즈S',
  'FC도쿄': 'FC도쿄',
  'C오사카': 'C오사카',
  '세레오사': 'C오사카',
  '세레소 오사카': 'C오사카',
  '가시와R': '가시와R',
  '가시와': '가시와R',
  '가시와 레이솔': '가시와R',
  '산프히로': '산프히로',
  '산프레체 히로시마': '산프히로',
  '나고야G': '나고야G',
  '나고야': '나고야G',
  '후쿠오카': '후쿠오카',
  '아비스파 후쿠오카': '후쿠오카',
  '우라와R': '우라와R',
  '우라와 레즈': '우라와R',
  'V바렌나': 'V바렌나',
  'V바렌 나가사키': 'V바렌나',
  'G오사카': 'G오사카',
  '감바 오사카': 'G오사카'
};

export const SeungMuBaeTableView: React.FC<SeungMuBaeTableViewProps> = ({
  matches,
  selectedRound,
  onSelectRound,
  onSelectMatch,
  theme = 'light'
}) => {
  const isLight = theme === 'light';

  // 1~14번 경기별 승 / 무 / 패 선택 상태
  const [picks, setPicks] = useState<Record<number, { win: boolean; draw: boolean; lose: boolean }>>(() => {
    const init: Record<number, { win: boolean; draw: boolean; lose: boolean }> = {};
    for (let i = 1; i <= 14; i++) {
      init[i] = { win: false, draw: false, lose: false };
    }
    return init;
  });

  const [unitAmount, setUnitAmount] = useState<number>(1000);
  const [calcNotice, setCalcNotice] = useState<string | null>(null);

  // 14경기 정렬
  const sorted14 = useMemo(() => {
    const list = [...matches].filter(m => m.betmanFolder === 'SEUNGMUBAE' || m.sport === 'football');
    return list.slice(0, 14).sort((a, b) => (a.betmanMatchNo || 0) - (b.betmanMatchNo || 0));
  }, [matches]);

  // 총 조합 수 계산
  const totalCombinations = useMemo(() => {
    let combs = 1;
    let anySelected = false;
    for (let i = 1; i <= 14; i++) {
      const p = picks[i] || { win: false, draw: false, lose: false };
      let count = 0;
      if (p.win) count++;
      if (p.draw) count++;
      if (p.lose) count++;
      if (count > 0) {
        anySelected = true;
        combs *= count;
      }
    }
    return anySelected ? combs : 0;
  }, [picks]);

  const totalBetAmount = totalCombinations * unitAmount;

  // 개별 마킹 토글
  const togglePick = (matchNo: number, type: 'win' | 'draw' | 'lose') => {
    setPicks(prev => ({
      ...prev,
      [matchNo]: {
        ...prev[matchNo],
        [type]: !prev[matchNo]?.[type]
      }
    }));
  };

  // 행 전체 토글 (+)
  const toggleRowAll = (matchNo: number) => {
    setPicks(prev => {
      const current = prev[matchNo] || { win: false, draw: false, lose: false };
      const allSelected = current.win && current.draw && current.lose;
      return {
        ...prev,
        [matchNo]: {
          win: !allSelected,
          draw: !allSelected,
          lose: !allSelected
        }
      };
    });
  };

  // 전체 경기 올마킹 (+)
  const toggleAllMatches = () => {
    setPicks(prev => {
      const isAllMarked = Object.values(prev).every(p => p.win && p.draw && p.lose);
      const next: Record<number, { win: boolean; draw: boolean; lose: boolean }> = {};
      for (let i = 1; i <= 14; i++) {
        next[i] = { win: !isAllMarked, draw: !isAllMarked, lose: !isAllMarked };
      }
      return next;
    });
  };

  // 전체 리셋
  const handleReset = () => {
    const next: Record<number, { win: boolean; draw: boolean; lose: boolean }> = {};
    for (let i = 1; i <= 14; i++) {
      next[i] = { win: false, draw: false, lose: false };
    }
    setPicks(next);
    setCalcNotice(null);
  };

  // 자동 선택 (투표율 최고 우세 픽 기반 14경기 단통 선택)
  const handleAutoPick = () => {
    const next: Record<number, { win: boolean; draw: boolean; lose: boolean }> = {};
    for (let i = 1; i <= 14; i++) {
      const rates = OFFICIAL_FOOTBALL_VOTE_RATES[i] || { win: 40, draw: 30, lose: 30 };
      const maxRate = Math.max(rates.win, rates.draw, rates.lose);
      next[i] = {
        win: rates.win === maxRate,
        draw: rates.draw === maxRate,
        lose: rates.lose === maxRate
      };
    }
    setPicks(next);
    setCalcNotice('🪄 축구 승무패 오피셜 투표율 1위 기준 14경기 단통 자동 선택 완료!');
    setTimeout(() => setCalcNotice(null), 3000);
  };

  // 계산 버튼 클릭
  const handleCalculate = () => {
    if (totalCombinations === 0) {
      setCalcNotice('⚠️ 최소 1개 이상의 마킹을 선택해주세요.');
    } else {
      setCalcNotice("✅ 총 [" + totalCombinations.toLocaleString() + "조합] | 결제 예정 금액: [" + totalBetAmount.toLocaleString() + "원]");
    }
    setTimeout(() => setCalcNotice(null), 4000);
  };

  const formatShortName = (fullName: string) => {
    return FOOTBALL_SHORT_NAMES[fullName] || fullName;
  };

  const formatShortTime = (timeStr?: string, matchNo?: number) => {
    if (matchNo === 6 || matchNo === 7) return '(수)04:00';
    if (matchNo && matchNo >= 8) return '(수)19:00';
    return '(수)03:45';
  };

  return (
    <div className={"w-full max-w-2xl mx-auto rounded-lg shadow-sm border overflow-hidden " + (
      isLight ? 'bg-white border-slate-300 text-slate-900' : 'bg-slate-900 border-slate-700 text-slate-100'
    )}>
      {/* 1. 회차 및 발매 정보 헤더 카드 */}
      <div className={"p-3 border-b text-xs space-y-1.5 " + (
        isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-800/80 border-slate-700'
      )}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-bold flex items-center gap-1.5 text-sm sm:text-base">
              <span className="text-slate-500">◇</span>
              <span>축구 승무패</span>
            </span>
            <span className="text-[11px] px-2 py-0.5 rounded border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 font-bold text-slate-700 dark:text-slate-300 shadow-2xs">
              예상
            </span>
          </div>

          <div className="relative">
            <select
              value={selectedRound}
              onChange={(e) => onSelectRound(e.target.value)}
              className={"text-xs font-bold px-3 py-1 rounded border appearance-none pr-7 cursor-pointer " + (
                isLight ? 'bg-white border-slate-300 text-slate-800' : 'bg-slate-900 border-slate-600 text-slate-200'
              )}
            >
              <option value="축구 승무패 260049회차 (betman.co.kr 오피셜 슬립)">2026년 49회차</option>
              <option value="축구 승무패 260050회차 (betman.co.kr 오피셜 슬립)">2026년 50회차</option>
              <option value="축구 승무패 260048회차 (betman.co.kr 오피셜 슬립)">2026년 48회차 (마감)</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 absolute right-2 top-2 pointer-events-none text-slate-500" />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-1 text-[11px] pt-1">
          <div className="flex items-center">
            <span className="text-slate-500 w-24 shrink-0 flex items-center gap-1">
              <span>◇</span> 판매기간
            </span>
            <span className="font-medium text-slate-700 dark:text-slate-300">
              08.31(월) 08:00 ~ 09.01(화) 23:00
            </span>
          </div>

          <div className="flex items-center">
            <span className="text-slate-500 w-24 shrink-0 flex items-center gap-1">
              <span>◇</span> 총투표수
            </span>
            <span className="font-mono font-bold text-slate-800 dark:text-slate-200">
              118,992
            </span>
          </div>

          <div className="flex items-center">
            <span className="text-slate-500 w-24 shrink-0 flex items-center gap-1">
              <span>◇</span> 1등총금액
            </span>
            <span className="font-mono font-bold text-blue-600 dark:text-blue-400">
              29,748,000원
            </span>
          </div>
        </div>
      </div>

      {/* 2. 조작 툴바 (금액 선택, 초기화, 자동 선택) */}
      <div className={"p-2 border-b flex items-center justify-end gap-2 text-xs " + (
        isLight ? 'bg-slate-100/60 border-slate-200' : 'bg-slate-800 border-slate-700'
      )}>
        <select
          value={unitAmount}
          onChange={(e) => setUnitAmount(Number(e.target.value))}
          className={"text-xs px-2.5 py-1 rounded border font-medium cursor-pointer " + (
            isLight ? 'bg-white border-slate-300 text-slate-800' : 'bg-slate-900 border-slate-600 text-slate-200'
          )}
        >
          <option value={1000}>1000원</option>
          <option value={500}>500원</option>
          <option value={100}>100원</option>
          <option value={2000}>2000원</option>
          <option value={5000}>5000원</option>
          <option value={10000}>10000원</option>
        </select>

        <button
          onClick={handleReset}
          className={"p-1.5 border rounded hover:bg-slate-200 dark:hover:bg-slate-700 transition cursor-pointer " + (
            isLight ? 'border-slate-300 text-slate-600' : 'border-slate-600 text-slate-300'
          )}
          title="마킹 초기화"
        >
          <RotateCcw className="w-3.5 h-3.5" />
        </button>

        <button
          onClick={handleAutoPick}
          className={"px-3 py-1 border rounded flex items-center gap-1 font-bold text-xs shadow-xs transition cursor-pointer " + (
            isLight ? 'bg-white hover:bg-slate-50 border-slate-300 text-slate-700' : 'bg-slate-900 hover:bg-slate-800 border-slate-600 text-slate-200'
          )}
        >
          <Wand2 className="w-3.5 h-3.5 text-amber-500" />
          <span>자동</span>
        </button>
      </div>

      {/* 3. 안내 알림 바 */}
      {calcNotice && (
        <div className="bg-emerald-600 text-white text-xs font-bold py-1.5 px-3 text-center transition-all animate-fade-in">
          {calcNotice}
        </div>
      )}

      {/* 4. 14경기 슬립 테이블 그리드 */}
      <div className="overflow-x-auto w-full">
        <table className="w-full text-center border-collapse text-xs">
          <thead>
            <tr className={"border-b text-[11px] font-bold " + (
              isLight ? 'bg-slate-100 text-slate-600 border-slate-300' : 'bg-slate-800 text-slate-300 border-slate-700'
            )}>
              <th className="py-2 px-1 w-8 font-normal"></th>
              <th className="py-2 px-1 w-20 text-center font-bold">홈</th>
              <th className="py-2 px-1 w-18 font-normal"></th>
              <th className="py-2 px-1 w-20 text-center font-bold">원정</th>
              <th className="py-2 px-1 w-12 text-center">
                <button
                  onClick={toggleAllMatches}
                  className="w-full py-0.5 border border-red-400 text-red-600 dark:text-red-400 rounded font-black text-xs hover:bg-red-50 dark:hover:bg-red-950/40 cursor-pointer"
                  title="전 경기 전체 선택/해제"
                >
                  +
                </button>
              </th>
              <th className="py-2 px-1 w-16 text-center font-bold">승</th>
              <th className="py-2 px-1 w-16 text-center font-bold">무</th>
              <th className="py-2 px-1 w-16 text-center font-bold">패</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 dark:divide-slate-800 text-xs">
            {Array.from({ length: 14 }, (_, idx) => {
              const matchNo = idx + 1;
              const match = sorted14[idx];
              const rates = OFFICIAL_FOOTBALL_VOTE_RATES[matchNo] || { win: 33.3, draw: 33.3, lose: 33.4 };
              const currentPick = picks[matchNo] || { win: false, draw: false, lose: false };

              const homeName = match ? formatShortName(match.homeTeam.name) : "홈팀" + matchNo;
              const awayName = match ? formatShortName(match.awayTeam.name) : "원정팀" + matchNo;
              const timeStr = formatShortTime(match?.matchTime, matchNo);

              return (
                <tr 
                  key={matchNo} 
                  className={"hover:bg-slate-50 dark:hover:bg-slate-800/60 transition " + (
                    isLight ? 'text-slate-800' : 'text-slate-200'
                  )}
                >
                  {/* 경기 번호 */}
                  <td className="py-2.5 px-1 font-mono text-slate-500 font-bold text-[11px]">
                    {matchNo}
                  </td>

                  {/* 홈팀 (클릭 시 상세 모달) */}
                  <td 
                    onClick={() => match && onSelectMatch(match)}
                    className="py-2.5 px-1 font-bold text-slate-900 dark:text-slate-100 cursor-pointer hover:text-amber-600 dark:hover:text-amber-400 hover:underline transition truncate max-w-[80px]"
                    title="클릭 시 xG 5대 지표 및 정밀 팩트 상세보기"
                  >
                    {homeName}
                  </td>

                  {/* 경기 일시 (클릭 시 상세 모달) */}
                  <td 
                    onClick={() => match && onSelectMatch(match)}
                    className="py-2.5 px-1 text-[10px] text-slate-500 dark:text-slate-400 font-mono cursor-pointer hover:underline truncate"
                    title="클릭 시 xG 5대 지표 및 정밀 팩트 상세보기"
                  >
                    {timeStr}
                  </td>

                  {/* 원정팀 (클릭 시 상세 모달) */}
                  <td 
                    onClick={() => match && onSelectMatch(match)}
                    className="py-2.5 px-1 font-bold text-slate-900 dark:text-slate-100 cursor-pointer hover:text-amber-600 dark:hover:text-amber-400 hover:underline transition truncate max-w-[80px]"
                    title="클릭 시 xG 5대 지표 및 정밀 팩트 상세보기"
                  >
                    {awayName}
                  </td>

                  {/* 행 전체 토글 버튼 (+) */}
                  <td className="py-2.5 px-1 text-center">
                    <button
                      type="button"
                      onClick={() => toggleRowAll(matchNo)}
                      className={"w-7 h-6 border rounded font-black text-xs transition cursor-pointer " + (
                        currentPick.win && currentPick.draw && currentPick.lose
                          ? 'bg-red-500 border-red-600 text-white'
                          : isLight
                          ? 'bg-slate-100 border-slate-300 text-slate-600 hover:bg-slate-200'
                          : 'bg-slate-800 border-slate-600 text-slate-300 hover:bg-slate-700'
                      )}
                      title="해당 경기 3개(승/무/패) 전체 선택"
                    >
                      +
                    </button>
                  </td>

                  {/* 승 (투표율 버튼) */}
                  <td className="py-2.5 px-1">
                    <button
                      type="button"
                      onClick={() => togglePick(matchNo, 'win')}
                      className={"w-full py-1 px-1 rounded border text-[11px] font-medium font-mono transition cursor-pointer " + (
                        currentPick.win
                          ? 'bg-red-500 border-red-600 text-white font-bold shadow-xs'
                          : isLight
                          ? 'bg-white border-slate-300 text-slate-700 hover:bg-slate-100'
                          : 'bg-slate-900 border-slate-700 text-slate-300 hover:bg-slate-800'
                      )}
                    >
                      {rates.win}%
                    </button>
                  </td>

                  {/* 무 (투표율 버튼) */}
                  <td className="py-2.5 px-1">
                    <button
                      type="button"
                      onClick={() => togglePick(matchNo, 'draw')}
                      className={"w-full py-1 px-1 rounded border text-[11px] font-medium font-mono transition cursor-pointer " + (
                        currentPick.draw
                          ? 'bg-red-500 border-red-600 text-white font-bold shadow-xs'
                          : isLight
                          ? 'bg-white border-slate-300 text-slate-700 hover:bg-slate-100'
                          : 'bg-slate-900 border-slate-700 text-slate-300 hover:bg-slate-800'
                      )}
                    >
                      {rates.draw}%
                    </button>
                  </td>

                  {/* 패 (투표율 버튼) */}
                  <td className="py-2.5 px-1">
                    <button
                      type="button"
                      onClick={() => togglePick(matchNo, 'lose')}
                      className={"w-full py-1 px-1 rounded border text-[11px] font-medium font-mono transition cursor-pointer " + (
                        currentPick.lose
                          ? 'bg-red-500 border-red-600 text-white font-bold shadow-xs'
                          : isLight
                          ? 'bg-white border-slate-300 text-slate-700 hover:bg-slate-100'
                          : 'bg-slate-900 border-slate-700 text-slate-300 hover:bg-slate-800'
                      )}
                    >
                      {rates.lose}%
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* 5. 하단 바 (투표수 요약, 계산, 리셋) */}
      <div className={"p-3 border-t flex items-center justify-between text-xs " + (
        isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-800/90 border-slate-700'
      )}>
        <div className="flex items-center gap-3">
          <span className="font-mono font-bold text-teal-600 dark:text-teal-400 text-sm">
            118992
          </span>
          {totalCombinations > 0 && (
            <span className="text-[11px] font-bold text-slate-600 dark:text-slate-300">
              선택: <span className="text-red-500">{totalCombinations.toLocaleString()}</span>조합 ({totalBetAmount.toLocaleString()}원)
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCalculate}
            className="px-4 py-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 border border-slate-300 dark:border-slate-600 text-slate-800 dark:text-slate-200 font-bold rounded text-xs shadow-xs transition cursor-pointer"
          >
            계산
          </button>
          <button
            onClick={handleReset}
            className="px-4 py-1.5 bg-blue-100 hover:bg-blue-200 dark:bg-blue-900/60 dark:hover:bg-blue-900 border border-blue-300 dark:border-blue-700 text-blue-800 dark:text-blue-200 font-bold rounded text-xs shadow-xs transition cursor-pointer"
          >
            리셋
          </button>
        </div>
      </div>

      {/* 6. 모바일 안내 팁 박스 */}
      <div className={"p-2.5 border-t text-[11px] flex items-center justify-between " + (
        isLight ? 'bg-emerald-50/50 border-emerald-200 text-emerald-900' : 'bg-emerald-950/20 border-emerald-800/40 text-emerald-300'
      )}>
        <div className="flex items-center gap-1.5">
          <Info className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
          <span>💡 <strong>홈/원정 팀명</strong>을 터치하시면 xG 5대 승패 지표·오피셜 라인업·H2H 상대전적 정밀 분석이 열립니다!</span>
        </div>
      </div>
    </div>
  );
};
