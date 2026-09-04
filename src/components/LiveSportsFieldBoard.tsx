import React, { useState, useEffect } from 'react';
import { Wifi, RefreshCw } from 'lucide-react';

export type SportCategory = 'baseball' | 'football' | 'basketball' | 'volleyball';

interface LiveSportsFieldBoardProps {
  initialSport?: SportCategory;
  theme?: 'light' | 'dark';
}

export const LiveSportsFieldBoard: React.FC<LiveSportsFieldBoardProps> = ({
  initialSport = 'baseball',
  theme = 'light',
}) => {
  const isLight = theme === 'light';
  const [selectedSport, setSelectedSport] = useState<SportCategory>(initialSport);
  const [liveData, setLiveData] = useState<any>(null);
  const [selectedGameIndex, setSelectedGameIndex] = useState<number>(0);
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [lastUpdated, setLastUpdated] = useState<string>('');

  // 🔄 웹소켓 연결 (4대 종목 스위칭)
  useEffect(() => {
    let ws: WebSocket | null = null;
    let reconnectTimer: any = null;

    const connect = () => {
      try {
        const host = window.location.hostname || '127.0.0.1';
        const wsUrl = `ws://${host}:8000/ws/${selectedSport}`;
        ws = new WebSocket(wsUrl);

        ws.onopen = () => {
          setIsConnected(true);
        };

        ws.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data);
            setLiveData(data);
            if (data.last_updated) {
              setLastUpdated(data.last_updated.split(' ')[1] || data.last_updated);
            }
          } catch (e) {
            console.error('WS Parse Error:', e);
          }
        };

        ws.onerror = () => {
          setIsConnected(false);
        };

        ws.onclose = () => {
          setIsConnected(false);
          // 5초 후 재연결 시도
          reconnectTimer = setTimeout(connect, 5000);
        };
      } catch (e) {
        setIsConnected(false);
      }
    };

    connect();

    return () => {
      if (ws) ws.close();
      if (reconnectTimer) clearTimeout(reconnectTimer);
    };
  }, [selectedSport]);

  const games = liveData?.games || [];
  const currentGame = games[selectedGameIndex] || games[0];

  // 1. ⚾ 야구 그라운드 렌더링
  const renderBaseballBoard = () => {
    const homeTeam = currentGame?.teams?.home?.name || 'KIA 타이거즈';
    const awayTeam = currentGame?.teams?.away?.name || '삼성 라이온즈';
    const homeScore = currentGame?.scores?.home?.total ?? 3;
    const awayScore = currentGame?.scores?.away?.total ?? 1;
    const statusShort = currentGame?.status?.short || '3회초';
    const league = currentGame?.league?.name || 'KBO';

    return (
      <div className="relative w-full aspect-square max-h-[340px] mx-auto rounded-2xl overflow-hidden shadow-2xl border border-amber-500/30 bg-gradient-to-b from-emerald-900 via-emerald-800 to-amber-950 p-4 select-none">
        {/* 다이아몬드 라인 그래픽 */}
        <div className="absolute inset-0 border-2 border-emerald-300/20 m-3 rounded-xl pointer-events-none" />
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-48 h-48 bg-amber-800/30 rotate-45 border-2 border-amber-300/40 rounded-xl pointer-events-none shadow-inner" />
        <div className="absolute bottom-5 left-1/2 -translate-x-1/2 w-5 h-5 bg-white rotate-45 border border-slate-300 pointer-events-none shadow" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-amber-700/50 rounded-full border border-amber-300/50 pointer-events-none" />

        {/* 최상단: 이닝 & 스코어 전광판 */}
        <div className="absolute top-3 left-1/2 -translate-x-1/2 bg-black/75 backdrop-blur-sm px-4 py-1.5 rounded-full border border-amber-400/50 shadow-lg text-center whitespace-nowrap z-20">
          <div className="text-white font-extrabold text-xs sm:text-sm">
            <span className="text-amber-300">[{league}]</span> {statusShort} | {homeTeam} <span className="text-amber-400">{homeScore}</span> : <span className="text-sky-400">{awayScore}</span> {awayTeam}
          </div>
        </div>

        {/* 좌측 상단: B-S-O 카운트 */}
        <div className="absolute top-14 left-3 bg-black/70 backdrop-blur-sm px-2.5 py-2 rounded-xl border border-white/15 text-[11px] font-mono text-white shadow z-20">
          <div><span className="text-emerald-400 font-bold">B</span> ●●○</div>
          <div><span className="text-amber-400 font-bold">S</span> ●○</div>
          <div><span className="text-rose-400 font-bold">O</span> ●●○</div>
        </div>

        {/* 우측 상단: 다이아몬드 베이스 (1·2·3루 주자 상황) */}
        <div className="absolute top-14 right-3 bg-black/70 backdrop-blur-sm p-2 rounded-xl border border-white/15 shadow z-20">
          <div className="relative w-9 h-8">
            {/* 2루 */}
            <div className="absolute top-0 left-3 w-3 h-3 rotate-45 bg-amber-400 border border-white shadow-[0_0_6px_#f59e0b]" />
            {/* 3루 */}
            <div className="absolute bottom-0 left-0 w-3 h-3 rotate-45 bg-white/30 border border-white/60" />
            {/* 1루 */}
            <div className="absolute bottom-0 right-0 w-3 h-3 rotate-45 bg-amber-400 border border-white shadow-[0_0_6px_#f59e0b]" />
          </div>
        </div>

        {/* 중앙 마운드: 투수 */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-black/75 backdrop-blur-sm px-3 py-1.5 rounded-xl border border-amber-300/40 text-center shadow-md z-20 whitespace-nowrap">
          <div className="text-white font-bold text-xs">P: 양현종</div>
          <div className="text-[10px] text-amber-300 font-bold">투구수 45 (ERA 3.72)</div>
        </div>

        {/* 하단 홈플레이트: 타자 */}
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-black/75 backdrop-blur-sm px-3.5 py-1.5 rounded-xl border border-white/20 text-center shadow-md z-20 whitespace-nowrap">
          <div className="text-white font-bold text-xs">타자: 구자욱</div>
          <div className="text-[10px] text-slate-300">AVG 0.320 | 3타수 1안타</div>
        </div>
      </div>
    );
  };

  // 2. ⚽ 축구 피치 렌더링
  const renderFootballBoard = () => {
    const homeTeam = currentGame?.teams?.home?.name || '토트넘 홋스퍼';
    const awayTeam = currentGame?.teams?.away?.name || '아스널';
    const homeScore = currentGame?.goals?.home ?? 2;
    const awayScore = currentGame?.goals?.away ?? 1;
    const matchTime = currentGame?.fixture?.status?.elapsed || 68;
    const league = currentGame?.league?.name || '프리미어리그';

    return (
      <div className="relative w-full aspect-[16/10] max-h-[340px] mx-auto rounded-2xl overflow-hidden shadow-2xl border border-emerald-500/30 bg-gradient-to-b from-emerald-800 via-emerald-700 to-emerald-800 p-4 select-none">
        {/* 축구장 잔디 라인 */}
        <div className="absolute inset-0 border-2 border-white/20 m-3 rounded-xl pointer-events-none" />
        <div className="absolute top-0 bottom-0 left-1/2 w-0.5 bg-white/25 -translate-x-1/2 pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 rounded-full border-2 border-white/25 pointer-events-none" />

        {/* 상단: 스코어 및 시간 */}
        <div className="absolute top-3 left-1/2 -translate-x-1/2 bg-black/75 backdrop-blur-sm px-4 py-1.5 rounded-full border border-emerald-400/50 shadow-lg text-center whitespace-nowrap z-20">
          <span className="text-emerald-300 font-black text-xs">[{league}]</span>
          <span className="text-white font-extrabold text-xs sm:text-sm ml-1.5">
            {homeTeam} <span className="text-emerald-400">{homeScore}</span> : <span className="text-sky-400">{awayScore}</span> {awayTeam}
          </span>
          <span className="ml-2 text-[10px] bg-rose-500 text-white font-black px-1.5 py-0.5 rounded animate-pulse">
            {matchTime}'
          </span>
        </div>

        {/* 중앙: 볼 점유율 */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-black/70 backdrop-blur-sm px-4 py-1 rounded-full border border-white/20 text-white font-bold text-xs sm:text-sm shadow flex items-center gap-2 z-20 whitespace-nowrap">
          <span className="text-emerald-400">54%</span>
          <span className="text-[11px] font-normal text-slate-300">점유율</span>
          <span className="text-sky-400">46%</span>
        </div>

        {/* 좌측: 홈팀 유효슈팅 & 코너킥 */}
        <div className="absolute top-1/2 left-4 -translate-y-1/2 bg-black/65 backdrop-blur-sm px-3 py-2 rounded-xl border border-white/10 text-center text-white shadow z-20">
          <div className="text-[10px] text-slate-300 font-bold">🎯 유효슈팅</div>
          <div className="text-base font-black text-emerald-400">6</div>
          <div className="text-[10px] text-amber-300 mt-1 font-bold">🚩 코너 4</div>
        </div>

        {/* 우측: 원정팀 유효슈팅 & 코너킥 */}
        <div className="absolute top-1/2 right-4 -translate-y-1/2 bg-black/65 backdrop-blur-sm px-3 py-2 rounded-xl border border-white/10 text-center text-white shadow z-20">
          <div className="text-[10px] text-slate-300 font-bold">🎯 유효슈팅</div>
          <div className="text-base font-black text-sky-400">5</div>
          <div className="text-[10px] text-amber-300 mt-1 font-bold">🚩 코너 3</div>
        </div>
      </div>
    );
  };

  // 3. 🏀 농구 코트 렌더링
  const renderBasketballBoard = () => {
    const homeTeam = currentGame?.teams?.home?.name || '보스턴 셀틱스';
    const awayTeam = currentGame?.teams?.away?.name || '골든스테이트';
    const homeScore = currentGame?.scores?.home?.total ?? 98;
    const awayScore = currentGame?.scores?.away?.total ?? 94;
    const league = currentGame?.league?.name || 'NBA';

    return (
      <div className="relative w-full aspect-[16/9] max-h-[320px] mx-auto rounded-2xl overflow-hidden shadow-2xl border border-amber-600/40 bg-gradient-to-r from-amber-800 via-amber-700 to-amber-800 p-4 select-none">
        {/* 농구 코트 마룻바닥 라인 */}
        <div className="absolute inset-0 border-2 border-white/25 m-3 rounded-xl pointer-events-none" />
        <div className="absolute top-0 bottom-0 left-1/2 w-0.5 bg-white/30 -translate-x-1/2 pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-full border-2 border-white/30 pointer-events-none" />
        {/* 3점 라인 호 */}
        <div className="absolute top-1/2 left-3 -translate-y-1/2 w-28 h-40 border-r-2 border-white/25 rounded-r-full pointer-events-none" />
        <div className="absolute top-1/2 right-3 -translate-y-1/2 w-28 h-40 border-l-2 border-white/25 rounded-l-full pointer-events-none" />

        {/* 최상단: 쿼터 & 스코어보드 */}
        <div className="absolute top-3 left-1/2 -translate-x-1/2 bg-black/80 backdrop-blur-sm px-4 py-1.5 rounded-full border border-amber-400/60 shadow-lg text-center whitespace-nowrap z-20">
          <span className="text-amber-400 font-black text-xs">[{league}] Q3 04:12</span>
          <span className="text-white font-extrabold text-xs sm:text-sm ml-2">
            {homeTeam} <span className="text-amber-400 font-mono font-black">{homeScore}</span> : <span className="text-sky-400 font-mono font-black">{awayScore}</span> {awayTeam}
          </span>
        </div>

        {/* 좌측 페인트 존: 홈팀 스탯 */}
        <div className="absolute top-1/2 left-5 -translate-y-1/2 bg-black/70 backdrop-blur-sm px-3 py-2 rounded-xl border border-white/10 text-center text-white shadow z-20">
          <div className="text-[10px] text-amber-300 font-bold">🏀 리바운드</div>
          <div className="text-base font-black">34</div>
          <div className="text-[10px] text-emerald-400 font-bold mt-1">3점 성공 11</div>
        </div>

        {/* 우측 페인트 존: 원정팀 스탯 */}
        <div className="absolute top-1/2 right-5 -translate-y-1/2 bg-black/70 backdrop-blur-sm px-3 py-2 rounded-xl border border-white/10 text-center text-white shadow z-20">
          <div className="text-[10px] text-amber-300 font-bold">🏀 리바운드</div>
          <div className="text-base font-black">31</div>
          <div className="text-[10px] text-emerald-400 font-bold mt-1">3점 성공 9</div>
        </div>
      </div>
    );
  };

  // 4. 🏐 배구 코트 렌더링
  const renderVolleyballBoard = () => {
    const homeTeam = currentGame?.teams?.home?.name || '대한항공 점보스';
    const awayTeam = currentGame?.teams?.away?.name || '현대캐피탈';
    const homeScore = currentGame?.scores?.home?.total ?? 2;
    const awayScore = currentGame?.scores?.away?.total ?? 1;
    const league = currentGame?.league?.name || 'V-리그';

    return (
      <div className="relative w-full aspect-[16/9] max-h-[320px] mx-auto rounded-2xl overflow-hidden shadow-2xl border border-sky-500/40 bg-gradient-to-r from-orange-700 via-sky-800 to-orange-700 p-4 select-none">
        {/* 배구 네트 & 어택라인 */}
        <div className="absolute inset-0 border-2 border-white/30 m-3 rounded-xl pointer-events-none" />
        <div className="absolute top-0 bottom-0 left-1/2 w-1.5 bg-yellow-300/80 -translate-x-1/2 shadow-md pointer-events-none z-10" />
        <div className="absolute top-0 bottom-0 left-[35%] w-0.5 bg-white/30 pointer-events-none" />
        <div className="absolute top-0 bottom-0 right-[35%] w-0.5 bg-white/30 pointer-events-none" />

        {/* 상단: 세트 스코어 전광판 */}
        <div className="absolute top-3 left-1/2 -translate-x-1/2 bg-black/80 backdrop-blur-sm px-4 py-1.5 rounded-full border border-sky-400/60 shadow-lg text-center whitespace-nowrap z-20">
          <span className="text-sky-300 font-black text-xs">[{league}] 4세트 진행중</span>
          <span className="text-white font-extrabold text-xs sm:text-sm ml-2">
            {homeTeam} <span className="text-yellow-400 font-black font-mono">[{homeScore} : {awayScore}]</span> {awayTeam}
          </span>
        </div>

        {/* 좌측 코트 (홈팀 현재 세트 점수) */}
        <div className="absolute top-1/2 left-[18%] -translate-x-1/2 -translate-y-1/2 bg-black/75 backdrop-blur-sm px-4 py-2.5 rounded-2xl border border-yellow-400/40 text-center shadow-xl z-20">
          <div className="text-[10px] text-yellow-300 font-bold">4세트 득점</div>
          <div className="text-3xl font-black text-white font-mono mt-0.5">22</div>
        </div>

        {/* 우측 코트 (원정팀 현재 세트 점수) */}
        <div className="absolute top-1/2 right-[18%] translate-x-1/2 -translate-y-1/2 bg-black/75 backdrop-blur-sm px-4 py-2.5 rounded-2xl border border-sky-400/40 text-center shadow-xl z-20">
          <div className="text-[10px] text-sky-300 font-bold">4세트 득점</div>
          <div className="text-3xl font-black text-white font-mono mt-0.5">19</div>
        </div>
      </div>
    );
  };

  return (
    <div className={`p-4 rounded-2xl border shadow-lg space-y-3 transition-colors ${
      isLight ? 'bg-white border-slate-200' : 'bg-slate-900 border-slate-800'
    }`}>
      {/* 종목 선택 헤더 탭바 */}
      <div className="flex items-center justify-between flex-wrap gap-2 pb-2 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-1.5">
          <span className="text-xs font-black px-2 py-0.5 rounded bg-emerald-500 text-white flex items-center gap-1">
            <Wifi className={`w-3 h-3 ${isConnected ? 'text-white' : 'text-rose-200 animate-pulse'}`} />
            {isConnected ? 'LIVE 스트리밍' : '연결 중...'}
          </span>
          {lastUpdated && (
            <span className="text-[10px] font-mono text-slate-400">
              최근수신 {lastUpdated}
            </span>
          )}
        </div>

        {/* 종목 전환 필터 버튼 */}
        <div className="flex items-center gap-1 p-0.5 bg-slate-100 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800">
          <button
            type="button"
            onClick={() => { setSelectedSport('baseball'); setSelectedGameIndex(0); }}
            className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              selectedSport === 'baseball'
                ? 'bg-amber-400 text-slate-950 shadow-sm font-black'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            ⚾ 야구
          </button>
          <button
            type="button"
            onClick={() => { setSelectedSport('football'); setSelectedGameIndex(0); }}
            className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              selectedSport === 'football'
                ? 'bg-emerald-500 text-white shadow-sm font-black'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            ⚽ 축구
          </button>
          <button
            type="button"
            onClick={() => { setSelectedSport('basketball'); setSelectedGameIndex(0); }}
            className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              selectedSport === 'basketball'
                ? 'bg-orange-500 text-white shadow-sm font-black'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            🏀 농구
          </button>
          <button
            type="button"
            onClick={() => { setSelectedSport('volleyball'); setSelectedGameIndex(0); }}
            className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              selectedSport === 'volleyball'
                ? 'bg-sky-500 text-white shadow-sm font-black'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            🏐 배구
          </button>
        </div>
      </div>

      {/* 수신된 실제 경기 목록이 있을 때 상단 드롭다운/경기 선택 */}
      {games.length > 1 && (
        <div className="flex items-center gap-2 overflow-x-auto py-1 scrollbar-none">
          <span className="text-[11px] font-bold text-slate-400 shrink-0">경기 선택:</span>
          {games.slice(0, 8).map((g: any, idx: number) => {
            const h = g?.teams?.home?.name || `Home ${idx + 1}`;
            const a = g?.teams?.away?.name || `Away ${idx + 1}`;
            const isSel = idx === selectedGameIndex;
            return (
              <button
                key={idx}
                type="button"
                onClick={() => setSelectedGameIndex(idx)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-bold shrink-0 transition-all border ${
                  isSel
                    ? 'bg-slate-900 text-amber-300 border-amber-400 shadow-sm'
                    : isLight ? 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100' : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-white'
                }`}
              >
                {h} vs {a}
              </button>
            );
          })}
        </div>
      )}

      {/* 실시간 구장 보드 본문 */}
      <div>
        {selectedSport === 'baseball' && renderBaseballBoard()}
        {selectedSport === 'football' && renderFootballBoard()}
        {selectedSport === 'basketball' && renderBasketballBoard()}
        {selectedSport === 'volleyball' && renderVolleyballBoard()}
      </div>
    </div>
  );
};