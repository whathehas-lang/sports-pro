import React, { useState, useMemo } from 'react';
import { RotateCcw, Wand2, Info, ChevronDown } from 'lucide-react';
import type { Match } from '../types/sports';

interface Seung1PaeTableViewProps {
  matches: Match[];
  selectedRound: string;
  onSelectRound: (round: string) => void;
  onSelectMatch: (match: Match) => void;
  theme?: 'light' | 'dark';
}

// 📌 2026년 64회차 야구 승1패 오피셜 투표율 팩트 데이터 (사진과 100% 동일)
const OFFICIAL_VOTE_RATES: Record<number, { win: number; draw: number; lose: number }> = {
  1: { win: 32.7, draw: 29.3, lose: 38.0 },
  2: { win: 57.1, draw: 16.0, lose: 26.9 },
  3: { win: 62.0, draw: 16.9, lose: 21.1 },
  4: { win: 28.3, draw: 21.7, lose: 50.1 },
  5: { win: 43.6, draw: 23.4, lose: 33.0 },
  6: { win: 68.7, draw: 15.8, lose: 15.5 },
  7: { win: 38.4, draw: 31.4, lose: 30.1 },
  8: { win: 49.1, draw: 22.9, lose: 28.0 },
  9: { win: 51.0, draw: 24.4, lose: 24.6 },
  10: { win: 43.8, draw: 25.3, lose: 30.8 },
  11: { win: 18.3, draw: 15.8, lose: 65.9 },
  12: { win: 14.7, draw: 15.5, lose: 69.8 },
  13: { win: 35.7, draw: 37.3, lose: 27.0 },
  14: { win: 67.2, draw: 17.7, lose: 15.1 },
};

// 📌 팀 이름 축약 매핑 (사진과 100% 동일한 텍스트)
const SHORT_TEAM_NAMES: Record<string, string> = {
  '두산 베어스': '두산',
  'LG 트윈스': 'LG',
  '삼성 라이온즈': '삼성',
  '롯데 자이언츠': '롯데',
  'KT 위즈': 'KT',
  '한화 이글스': '한화',
  'NC 다이노스': 'NC',
  'KIA 타이거즈': 'KIA',
  '키움 히어로즈': '키움',
  'SSG 랜더스': 'SSG',
  '탬파베이 레이스': '탬파레이',
  '뉴욕 메츠': '뉴욕메츠',
  '피츠버그 파이리츠': '피츠파이',
  '샌프란시스코 자이언츠': '샌프자이',
  '캔자스시티 로열스': '캔자로얄',
  '마이애미 말린스': '마이말린',
  '텍사스 레인저스': '텍사레인',
  '오클랜드 애슬레틱스': '애슬레틱',
  '휴스턴 애스트로스': '휴스애스',
  '시카고 화이트삭스': '시카화이',
  '콜로라도 로키스': '콜로로키',
  '볼티모어 오리올스': '볼티오리',
  'LA 에인절스': 'LA에인절',
  '뉴욕 양키스': '뉴욕양키',
  '애리조나 다이아몬드백스': '애리다이',
  '필라델피아 필리스': '필라필리',
  'LA 다저스': 'LA다저스',
  '세인트루이스 카디널스': '세인카디',
};

export const Seung1PaeTableView: React.FC<Seung1PaeTableViewProps> = ({
  matches,
  selectedRound,
  onSelectRound,
  onSelectMatch,
  theme = 'light'
}) => {
  const isLight = theme === 'light';

  // 1~14번 경기별 승 / 1 / 패 선택 상태
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
    const list = [...matches].filter(m => m.betmanFolder === 'SEUNG1PAE' || m.sport === 'baseball');
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
      const rates = OFFICIAL_VOTE_RATES[i] || { win: 40, draw: 30, lose: 30 };
      const maxRate = Math.max(rates.win, rates.draw, rates.lose);
      next[i] = {
        win: rates.win === maxRate,
        draw: rates.draw === maxRate,
        lose: rates.lose === maxRate
      };
    }
    setPicks(next);
    setCalcNotice('🪄 오피셜 투표율 1위 기준 14경기 단통 자동 선택 완료!');
    setTimeout(() => setCalcNotice(null), 3000);
  };

  // 계산 버튼 클릭
  const handleCalculate = () => {
    if (totalCombinations === 0) {
      setCalcNotice('⚠️ 최소 1개 이상의 마킹을 선택해주세요.');
    } else {
      setCalcNotice(`✅ 총 [${totalCombinations.toLocaleString()}조합] | 결제 예정 금액: [${totalBetAmount.toLocaleString()}원]`);
    }
    setTimeout(() => setCalcNotice(null), 4000);
  };

  const formatShortName = (fullName: string) => {
    return SHORT_TEAM_NAMES[fullName] || fullName.replace(' 베어스', '').replace(' 트윈스', '').replace(' 라이온즈', '').replace(' 자이언츠', '').replace(' 위즈', '').replace(' 이글스', '').replace(' 다이노스', '').replace(' 타이거즈', '').replace(' 히어로즈', '').replace(' 랜더스', '');
  };

  const formatShortTime = (timeStr?: string) => {
    if (!timeStr) return '(화)18:30';
    const m = timeStr.match(/\(([가-힣]+)\)\s*(\d{2}:\d{2})/);
    if (m) return `(${m[1]})${m[2]}`;
    return timeStr.slice(0, 10);
  };

  return (
    <div className={`w-full max-w-2xl mx-auto rounded-lg shadow-sm border overflow-hidden ${
      isLight ? 'bg-white border-slate-300 text-slate-900' : 'bg-slate-900 border-slate-700 text-slate-100'
    }`}>
      {/* 1. 회차 및 발매 정보 헤더 카드 */}
      <div className={`p-3 border-b text-xs space-y-1.5 ${
        isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-800/80 border-slate-700'
      }`}>
        <div className="flex items-center justify-between">
          <span className="font-bold flex items-center gap-1.5 text-sm sm:text-base">
            <span className="text-slate-500">◇</span>
            <span>야구 승1패</span>
          </span>
          <div className="relative">
            <select
              value={selectedRound}
              onChange={(e) => onSelectRound(e.target.value)}
              className={`text-xs font-bold px-3 py-1 rounded border appearance-none pr-7 cursor-pointer ${
                isLight ? 'bg-white border-slate-300 text-slate-800' : 'bg-slate-900 border-slate-600 text-slate-200'
              }`}
            >
              <option value="야구 승1패 260064회차 (betman.co.kr 오피셜 슬립)">2026년 64회차</option>
              <option value="야구 승1패 260065회차 (betman.co.kr 오피셜 슬립)">2026년 65회차</option>
              <option value="야구 승1패 260063회차 (betman.co.kr 오피셜 슬립)">2026년 63회차 (마감)</option>
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
              08.31(월) 08:00 ~ 09.01(화) 18:30
            </span>
          </div>

          <div className="flex items-center">
            <span className="text-slate-500 w-24 shrink-0 flex items-center gap-1">
              <span>◇</span> 총투표수
            </span>
            <span className="font-mono font-bold text-slate-800 dark:text-slate-200">
              65,820
            </span>
          </div>

          <div className="flex items-center">
            <span className="text-slate-500 w-24 shrink-0 flex items-center gap-1">
              <span>◇</span> 1등총금액 [이월금]
            </span>
            <span className="font-mono font-bold text-blue-600 dark:text-blue-400">
              270,946,250원 <span className="text-[10px] text-slate-500 font-normal">[ 254,491,250원 / 3회 ]</span>
            </span>
          </div>
        </div>
      </div>

      {/* 2. 조작 툴바 (금액 선택, 초기화, 자동 선택) */}
      <div className={`p-2 border-b flex items-center justify-end gap-2 text-xs ${
        isLight ? 'bg-slate-100/60 border-slate-200' : 'bg-slate-800 border-slate-700'
      }`}>
        <select
          value={unitAmount}
          onChange={(e) => setUnitAmount(Number(e.target.value))}
          className={`text-xs px-2.5 py-1 rounded border font-medium cursor-pointer ${
            isLight ? 'bg-white border-slate-300 text-slate-800' : 'bg-slate-900 border-slate-600 text-slate-200'
          }`}
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
          className={`p-1.5 border rounded hover:bg-slate-200 dark:hover:bg-slate-700 transition cursor-pointer ${
            isLight ? 'border-slate-300 text-slate-600' : 'border-slate-600 text-slate-300'
          }`}
          title="마킹 초기화"
        >
          <RotateCcw className="w-3.5 h-3.5" />
        </button>

        <button
          onClick={handleAutoPick}
          className={`px-3 py-1 border rounded flex items-center gap-1 font-bold text-xs shadow-xs transition cursor-pointer ${
            isLight ? 'bg-white hover:bg-slate-50 border-slate-300 text-slate-700' : 'bg-slate-900 hover:bg-slate-800 border-slate-600 text-slate-200'
          }`}
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
            <tr className={`border-b text-[11px] font-bold ${
              isLight ? 'bg-slate-100 text-slate-600 border-slate-300' : 'bg-slate-800 text-slate-300 border-slate-700'
            }`}>
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
              <th className="py-2 px-1 w-16 text-center font-bold">1</th>
              <th className="py-2 px-1 w-16 text-center font-bold">패</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 dark:divide-slate-800 text-xs">
            {Array.from({ length: 14 }, (_, idx) => {
              const matchNo = idx + 1;
              const match = sorted14[idx];
              const rates = OFFICIAL_VOTE_RATES[matchNo] || { win: 33.3, draw: 33.3, lose: 33.4 };
              const currentPick = picks[matchNo] || { win: false, draw: false, lose: false };

              const homeName = match ? formatShortName(match.homeTeam.name) : `홈팀${matchNo}`;
              const awayName = match ? formatShortName(match.awayTeam.name) : `원정팀${matchNo}`;
              const timeStr = match ? formatShortTime(match.matchTime) : '(화)18:30';

              return (
                <tr 
                  key={matchNo} 
                  className={`hover:bg-slate-50 dark:hover:bg-slate-800/60 transition ${
                    isLight ? 'text-slate-800' : 'text-slate-200'
                  }`}
                >
                  {/* 경기 번호 */}
                  <td className="py-2.5 px-1 font-mono text-slate-500 font-bold text-[11px]">
                    {matchNo}
                  </td>

                  {/* 홈팀 (클릭 시 상세 모달) */}
                  <td 
                    onClick={() => match && onSelectMatch(match)}
                    className="py-2.5 px-1 font-bold text-slate-900 dark:text-slate-100 cursor-pointer hover:text-amber-600 dark:hover:text-amber-400 hover:underline transition truncate max-w-[80px]"
                    title="클릭 시 선발투수 및 정밀 팩트 상세보기"
                  >
                    {homeName}
                  </td>

                  {/* 경기 일시 (클릭 시 상세 모달) */}
                  <td 
                    onClick={() => match && onSelectMatch(match)}
                    className="py-2.5 px-1 text-[10px] text-slate-500 dark:text-slate-400 font-mono cursor-pointer hover:underline truncate"
                    title="클릭 시 선발투수 및 정밀 팩트 상세보기"
                  >
                    {timeStr}
                  </td>

                  {/* 원정팀 (클릭 시 상세 모달) */}
                  <td 
                    onClick={() => match && onSelectMatch(match)}
                    className="py-2.5 px-1 font-bold text-slate-900 dark:text-slate-100 cursor-pointer hover:text-amber-600 dark:hover:text-amber-400 hover:underline transition truncate max-w-[80px]"
                    title="클릭 시 선발투수 및 정밀 팩트 상세보기"
                  >
                    {awayName}
                  </td>

                  {/* 행 전체 토글 버튼 (+) */}
                  <td className="py-2.5 px-1 text-center">
                    <button
                      type="button"
                      onClick={() => toggleRowAll(matchNo)}
                      className={`w-7 h-6 border rounded font-black text-xs transition cursor-pointer ${
                        currentPick.win && currentPick.draw && currentPick.lose
                          ? 'bg-red-500 border-red-600 text-white'
                          : isLight
                          ? 'bg-slate-100 border-slate-300 text-slate-600 hover:bg-slate-200'
                          : 'bg-slate-800 border-slate-600 text-slate-300 hover:bg-slate-700'
                      }`}
                      title="해당 경기 3개(승/1/패) 전체 선택"
                    >
                      +
                    </button>
                  </td>

                  {/* 승 (투표율 버튼) */}
                  <td className="py-2.5 px-1">
                    <button
                      type="button"
                      onClick={() => togglePick(matchNo, 'win')}
                      className={`w-full py-1 px-1 rounded border text-[11px] font-medium font-mono transition cursor-pointer ${
                        currentPick.win
                          ? 'bg-red-500 border-red-600 text-white font-bold shadow-xs'
                          : isLight
                          ? 'bg-white border-slate-300 text-slate-700 hover:bg-slate-100'
                          : 'bg-slate-900 border-slate-700 text-slate-300 hover:bg-slate-800'
                      }`}
                    >
                      {rates.win}%
                    </button>
                  </td>

                  {/* 1 (투표율 버튼) */}
                  <td className="py-2.5 px-1">
                    <button
                      type="button"
                      onClick={() => togglePick(matchNo, 'draw')}
                      className={`w-full py-1 px-1 rounded border text-[11px] font-medium font-mono transition cursor-pointer ${
                        currentPick.draw
                          ? 'bg-red-500 border-red-600 text-white font-bold shadow-xs'
                          : isLight
                          ? 'bg-white border-slate-300 text-slate-700 hover:bg-slate-100'
                          : 'bg-slate-900 border-slate-700 text-slate-300 hover:bg-slate-800'
                      }`}
                    >
                      {rates.draw}%
                    </button>
                  </td>

                  {/* 패 (투표율 버튼) */}
                  <td className="py-2.5 px-1">
                    <button
                      type="button"
                      onClick={() => togglePick(matchNo, 'lose')}
                      className={`w-full py-1 px-1 rounded border text-[11px] font-medium font-mono transition cursor-pointer ${
                        currentPick.lose
                          ? 'bg-red-500 border-red-600 text-white font-bold shadow-xs'
                          : isLight
                          ? 'bg-white border-slate-300 text-slate-700 hover:bg-slate-100'
                          : 'bg-slate-900 border-slate-700 text-slate-300 hover:bg-slate-800'
                      }`}
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
      <div className={`p-3 border-t flex items-center justify-between text-xs ${
        isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-800/90 border-slate-700'
      }`}>
        <div className="flex items-center gap-3">
          <span className="font-mono font-bold text-teal-600 dark:text-teal-400 text-sm">
            65820
          </span>
          {totalCombinations > 0 && (
            <span className="text-[11px] font-bold text-slate-600 dark:text-slate-300">
              선택: <span className="text-red-500">${totalCombinations.toLocaleString()}</span>조합 (${totalBetAmount.toLocaleString()}원)
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
      <div className={`p-2.5 border-t text-[11px] flex items-center justify-between ${
        isLight ? 'bg-amber-50/50 border-amber-200 text-amber-900' : 'bg-amber-950/20 border-amber-800/40 text-amber-300'
      }`}>
        <div className="flex items-center gap-1.5">
          <Info className="w-3.5 h-3.5 text-amber-600 shrink-0" />
          <span>💡 <strong>홈/원정 팀명</strong>을 터치하시면 선발투수·불펜 과부하·현지 날씨 등 정밀 분석이 열립니다!</span>
        </div>
      </div>
    </div>
  );
};
