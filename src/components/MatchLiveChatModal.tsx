import React, { useState, useEffect, useRef } from 'react';
import { X, Send, Users, Zap, Radio, Crown, ShieldAlert, Sparkles, MessageSquare, Flame } from 'lucide-react';
import type { Match } from '../types/sports';
import { 
  MatchChatWebSocketService, 
  type ChatMessageItem, 
  type LiveMatchStatus 
} from '../services/websocket/matchChatWebSocketService';
import { MlbLiveGameSyncService } from '../services/api/mlbLiveGameSyncService';

interface MatchLiveChatModalProps {
  match: Match;
  onClose: () => void;
  theme?: 'light' | 'dark';
}

const RANDOM_NICKNAMES = [
  '불타는홈런왕', '역배사냥꾼', '적중요정', '필승불펜러', '만루홈런짜릿', 
  '골키퍼야신', '토큰VVIP', '다승왕선발', '야구의신', '승부사'
];

export const MatchLiveChatModal: React.FC<MatchLiveChatModalProps> = ({
  match,
  onClose,
  theme = 'dark'
}) => {
  const isLight = theme === 'light';
  const matchId = String(match.id || match.betmanMatchNo);

  const [messages, setMessages] = useState<ChatMessageItem[]>([]);
  const [inputText, setInputText] = useState('');
  const [userCount, setUserCount] = useState<number>(1);
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [myNickname] = useState<string>(() => {
    const r = Math.floor(Math.random() * RANDOM_NICKNAMES.length);
    const n = Math.floor(10 + Math.random() * 90);
    return `${RANDOM_NICKNAMES[r]}${n}`;
  });

  const isFinished = match.status === 'FINISHED';
  const isScheduled = match.status === 'SCHEDULED';
  const isLive = match.status === 'LIVE';

  // 실시간 라이브 경기 상태 & 스코어 초기화 (하드코딩 4:2 제거 및 실제 DB 스코어/상태 연동)
  const [liveState, setLiveState] = useState<LiveMatchStatus>(() => {
    const defaultInning = isFinished
      ? '경기종료'
      : isScheduled
      ? '경기시작전'
      : (match.statusDetail || (match.sport === 'baseball' ? '진행중' : '전반전'));

    const initialHomeScore = typeof match.homeScore === 'number' ? match.homeScore : 0;
    const initialAwayScore = typeof match.awayScore === 'number' ? match.awayScore : 0;

    return {
      match_id: matchId,
      sport: match.sport || 'baseball',
      status: match.status || 'SCHEDULED',
      inning_or_time: defaultInning,
      home_score: initialHomeScore,
      away_score: initialAwayScore,
      outs: 0,
      balls: 0,
      strikes: 0,
      runner_first: false,
      runner_second: false,
      runner_third: false,
      recent_event_text: isFinished
        ? '🏁 경기가 공식 종료되었습니다.'
        : isScheduled
        ? `⏱️ ${match.matchTime || '경기'} 시작 대기 중입니다.`
        : '🔥 실시간 경기가 진행 중입니다.'
    };
  });

  const chatBottomRef = useRef<HTMLDivElement>(null);
  const wsServiceRef = useRef<MatchChatWebSocketService | null>(null);

  useEffect(() => {
    const service = new MatchChatWebSocketService(matchId);
    wsServiceRef.current = service;

    service.connect(
      (newMsg) => {
        setMessages((prev) => {
          if (prev.some((m) => m.id === newMsg.id)) return prev;
          return [...prev, newMsg];
        });
      },
      (newLiveState) => {
        // 종료된 경기는 실시간 웹소켓이 공식 최종 스코어를 덮어쓰지 못하도록 방어
        if (isFinished) return;
        setLiveState(newLiveState);
      },
      (count) => {
        setUserCount(count);
      },
      (status) => {
        setIsConnected(status);
      }
    );

    return () => {
      service.disconnect();
    };
  }, [matchId]);

  // ⚾ MLB 경기인 경우 스마트폰/깃허브 운영 환경에서도 3초마다 공식 Stats API 직접 조회 (MLB 전 구단 지원)
  useEffect(() => {
    if (isFinished || match.sport !== 'baseball') return;

    let isSubscribed = true;
    let pollInterval: any = null;

    const startMlbPolling = async () => {
      // 1. 경기 고유번호(gamePk) 동적 탐색 (다저스/시애틀 즉시 캐시 + 전 구단 실시간 스캔)
      let gamePk: number | null = null;
      if (match.homeTeam.name.includes('다저스') || match.awayTeam.name.includes('다저스')) {
        gamePk = 823907; // 즉시 캐시
      } else if (match.homeTeam.name.includes('시애틀') || match.awayTeam.name.includes('시애틀') || match.homeTeam.name.includes('애슬레틱스') || match.awayTeam.name.includes('애슬레틱스')) {
        gamePk = 823095; // 즉시 캐시
      }

      if (!gamePk) {
        gamePk = await MlbLiveGameSyncService.findGamePkForTeams(match.homeTeam.name, match.awayTeam.name);
      }

      if (!gamePk || !isSubscribed) return;

      const pollMlbLiveDirect = async () => {
        try {
          const res = await fetch(`https://statsapi.mlb.com/api/v1.1/game/${gamePk}/feed/live`);
          if (!res.ok) return;
          const data = await res.json();
          if (!isSubscribed) return;

          const linescore = data?.liveData?.linescore || {};
          const teams = linescore.teams || {};
          const currentPlay = data?.liveData?.plays?.currentPlay || {};
          const inning = linescore.currentInningOrdinal || '1st';
          const inningState = linescore.inningState || '';
          
          const inningKr = inning.replace('1st', '1회').replace('2nd', '2회').replace('3rd', '3회')
                                 .replace('4th', '4회').replace('5th', '5회').replace('6th', '6회')
                                 .replace('7th', '7회').replace('8th', '8회').replace('9th', '9회');
          const inningFull = inningState === 'Top' ? `${inningKr}초` : inningState === 'Bottom' ? `${inningKr}말` : `${inningKr} ${inningState}`;

          const offense = linescore.offense || {};
          const runner1 = !!offense.first;
          const runner2 = !!offense.second;
          const runner3 = !!offense.third;

          setLiveState((prev) => ({
            ...prev,
            match_id: matchId,
            sport: 'baseball',
            status: 'LIVE',
            inning_or_time: inningFull,
            home_score: teams.home?.runs ?? prev.home_score,
            away_score: teams.away?.runs ?? prev.away_score,
            outs: linescore.outs ?? 0,
            balls: linescore.balls ?? 0,
            strikes: linescore.strikes ?? 0,
            runner_first: runner1,
            runner_second: runner2,
            runner_third: runner3,
            pitcher: linescore.defense?.pitcher?.fullName || prev.pitcher,
            batter: offense.batter?.fullName || prev.batter,
            recent_event_text: currentPlay?.result?.description || prev.recent_event_text
          }));
        } catch (err) {
          // ignore
        }
      };

      await pollMlbLiveDirect();
      if (isSubscribed) {
        pollInterval = setInterval(pollMlbLiveDirect, 3000);
      }
    };

    startMlbPolling();

    return () => {
      isSubscribed = false;
      if (pollInterval) clearInterval(pollInterval);
    };
  }, [matchId, match.homeTeam.name, match.awayTeam.name, isFinished, match.sport]);

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = (textToSend?: string) => {
    const text = (textToSend || inputText).trim();
    if (!text || !wsServiceRef.current) return;

    wsServiceRef.current.sendMessage(myNickname, text, true, 'VVIP');
    if (!textToSend) setInputText('');
  };

  const handleToggleRunner = (base: 'first' | 'second' | 'third') => {
    if (!wsServiceRef.current) return;
    const nextFirst = base === 'first' ? !liveState.runner_first : liveState.runner_first;
    const nextSecond = base === 'second' ? !liveState.runner_second : liveState.runner_second;
    const nextThird = base === 'third' ? !liveState.runner_third : liveState.runner_third;

    setLiveState((prev) => ({
      ...prev,
      runner_first: nextFirst,
      runner_second: nextSecond,
      runner_third: nextThird
    }));

    wsServiceRef.current.updateRunners(
      nextFirst, 
      nextSecond, 
      nextThird, 
      liveState.inning_or_time, 
      liveState.home_score, 
      liveState.away_score
    );
  };

  const setAllBases = (loaded: boolean) => {
    if (!wsServiceRef.current) return;
    setLiveState((prev) => ({
      ...prev,
      runner_first: loaded,
      runner_second: loaded,
      runner_third: loaded
    }));
    wsServiceRef.current.updateRunners(loaded, loaded, loaded, liveState.inning_or_time, liveState.home_score, liveState.away_score);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-2 sm:p-4">
      <div className={`w-full max-w-lg h-[92vh] sm:h-[85vh] rounded-3xl border flex flex-col shadow-2xl overflow-hidden transition-all ${
        isLight ? 'bg-white border-slate-200' : 'bg-slate-950 border-emerald-500/40 text-slate-100'
      }`}>
        
        {/* TOP HEADER */}
        <div className={`p-3.5 sm:p-4 border-b flex items-center justify-between gap-2 shrink-0 ${
          isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-900 border-slate-800'
        }`}>
          <div className="flex items-center gap-2 min-w-0">
            <span className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center font-black text-xs shrink-0">
              💬
            </span>
            <div className="min-w-0">
              <h3 className="text-xs sm:text-sm font-black truncate flex items-center gap-1.5">
                <span className="text-amber-400 font-mono">#{match.betmanMatchNo || match.matchNumber || match.id.replace(/^[a-z]+_/, '')}</span>
                <span>[{match.homeTeam.name}] vs [{match.awayTeam.name}]</span>
              </h3>
              <div className="flex items-center gap-2 text-[10px] mt-0.5">
                <span className={`px-1.5 py-0.2 rounded font-black flex items-center gap-1 ${
                  isConnected 
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40' 
                    : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                }`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${isConnected ? 'bg-emerald-400 animate-pulse' : 'bg-rose-500 animate-ping'}`} />
                  {isConnected ? 'FastAPI 초고속 웹소켓' : '⚡ 공식 3초 실시간 LIVE'}
                </span>
                <span className="text-slate-400 flex items-center gap-0.5">
                  <Users className="w-3 h-3" />
                  <span>{userCount}명 톡방 참여중</span>
                </span>
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className={`p-2 rounded-xl transition-all cursor-pointer border ${
              isLight ? 'bg-slate-200 text-slate-700 hover:bg-slate-300' : 'bg-slate-800 text-slate-400 hover:text-white border-slate-700'
            }`}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* ⚾ 1. LIVE SCORE & BASEBALL BASERUNNER DIAMOND */}
        <div className={`p-3 border-b shrink-0 ${
          isLight ? 'bg-slate-100/80 border-slate-200' : 'bg-slate-900/60 border-slate-800/80'
        }`}>
          <div className="flex flex-col sm:flex-row items-center justify-between gap-2.5">
            
            {/* 스코어보드 전광판 */}
            <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-start">
              <div className="flex items-center gap-2 bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800 shadow-sm">
                <span className="text-xs font-black text-emerald-400">{match.homeTeam.name}</span>
                <span className="text-base font-black font-mono text-white">{liveState.home_score}</span>
                <span className="text-slate-500 font-bold">:</span>
                <span className="text-base font-black font-mono text-white">{liveState.away_score}</span>
                <span className="text-xs font-black text-cyan-400">{match.awayTeam.name}</span>
              </div>

              <div className={`flex items-center gap-1.5 text-[11px] font-black px-2.5 py-1 rounded-xl shadow-sm ${
                isFinished 
                  ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40' 
                  : isScheduled
                  ? 'bg-slate-800 text-slate-300 border border-slate-700'
                  : 'bg-amber-500/15 text-amber-300 border border-amber-500/40'
              }`}>
                {isLive ? (
                  <Radio className="w-3 h-3 animate-ping text-emerald-400" />
                ) : isFinished ? (
                  <span>🏁</span>
                ) : (
                  <span>⏱️</span>
                )}
                <span>{liveState.inning_or_time}</span>
                {isLive && match.sport === 'baseball' && liveState.outs !== undefined && (
                  <>
                    <span className="text-slate-400">|</span>
                    <span>{liveState.outs}사</span>
                    {liveState.balls !== undefined && liveState.strikes !== undefined && (
                      <span className="text-amber-300 font-mono text-[10px] ml-1">
                        {liveState.balls}B {liveState.strikes}S
                      </span>
                    )}
                  </>
                )}
              </div>
            </div>

            {/* ⚾ 다이아몬드 주자 점등 그래픽 (야구 경기일 때만 표시) */}
            {match.sport === 'baseball' && (
            <div className="flex items-center gap-3 bg-slate-950/90 px-3 py-1.5 rounded-xl border border-slate-800">
              <div className="text-[10px] font-bold text-slate-400 flex flex-col items-center">
                <span>실시간</span>
                <span className="text-amber-300 font-black">주자현황</span>
              </div>

              {/* 다이아몬드 베이스 SVG 그래픽 */}
              <div className="relative w-11 h-11 flex items-center justify-center">
                {/* 2루 베이스 (상단) */}
                <button
                  onClick={() => handleToggleRunner('second')}
                  title="2루 주자 토글"
                  className={`absolute top-0 left-1/2 -translate-x-1/2 w-3.5 h-3.5 rotate-45 rounded-[2px] transition-all cursor-pointer border ${
                    liveState.runner_second
                      ? 'bg-amber-400 border-yellow-200 shadow-[0_0_10px_#f59e0b] animate-pulse scale-110'
                      : 'bg-slate-800 border-slate-600'
                  }`}
                />

                {/* 3루 베이스 (좌측) */}
                <button
                  onClick={() => handleToggleRunner('third')}
                  title="3루 주자 토글"
                  className={`absolute top-1/2 -translate-y-1/2 left-0 w-3.5 h-3.5 rotate-45 rounded-[2px] transition-all cursor-pointer border ${
                    liveState.runner_third
                      ? 'bg-amber-400 border-yellow-200 shadow-[0_0_10px_#f59e0b] animate-pulse scale-110'
                      : 'bg-slate-800 border-slate-600'
                  }`}
                />

                {/* 1루 베이스 (우측) */}
                <button
                  onClick={() => handleToggleRunner('first')}
                  title="1루 주자 토글"
                  className={`absolute top-1/2 -translate-y-1/2 right-0 w-3.5 h-3.5 rotate-45 rounded-[2px] transition-all cursor-pointer border ${
                    liveState.runner_first
                      ? 'bg-amber-400 border-yellow-200 shadow-[0_0_10px_#f59e0b] animate-pulse scale-110'
                      : 'bg-slate-800 border-slate-600'
                  }`}
                />

                {/* 홈플레이트 (하단) */}
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3 h-3 bg-white/80 rotate-45 rounded-[1px] border border-slate-400 pointer-events-none" />
              </div>

              {/* 주자 상태 라벨 & 원클릭 변경 */}
              <div className="flex flex-col text-[10px]">
                <span className="font-extrabold text-amber-300">
                  {liveState.runner_first && liveState.runner_second && liveState.runner_third
                    ? '🔥 만루 찬스!'
                    : liveState.runner_first && liveState.runner_second
                      ? '🟡 1·2루 주자'
                      : liveState.runner_first && liveState.runner_third
                        ? '🟡 1·3루 주자'
                        : liveState.runner_second && liveState.runner_third
                          ? '🟡 2·3루 주자'
                          : liveState.runner_first
                            ? '🟡 1루 주자'
                            : liveState.runner_second
                              ? '🟡 2루 주자'
                              : liveState.runner_third
                                ? '🟡 3루 주자'
                                : '⚪ 주자 없음'}
                </span>
                <div className="flex items-center gap-1 mt-0.5">
                  <button
                    onClick={() => setAllBases(true)}
                    className="text-[9px] px-1.5 py-0.2 bg-amber-500/20 text-amber-300 hover:bg-amber-500/40 rounded border border-amber-500/40 font-bold"
                  >
                    만루
                  </button>
                  <button
                    onClick={() => setAllBases(false)}
                    className="text-[9px] px-1.5 py-0.2 bg-slate-800 text-slate-400 hover:text-white rounded border border-slate-700 font-bold"
                  >
                    초기화
                  </button>
                </div>
              </div>
            </div>
            )}

          </div>

          {/* ⚾ 실시간 투수 vs 타자 정보 바 */}
          {match.sport === 'baseball' && (liveState.pitcher || liveState.batter) && (
            <div className={`mt-2 px-3 py-1.5 rounded-xl border text-[11px] font-bold flex items-center justify-between ${
              isLight ? 'bg-amber-50 border-amber-200 text-slate-800' : 'bg-slate-950/80 border-slate-800 text-slate-200'
            }`}>
              <div className="flex items-center gap-1.5 truncate">
                <span className="text-emerald-500 font-extrabold">⚾ 투수:</span>
                <span className="text-emerald-400 font-black truncate">{liveState.pitcher || '선발 투수'}</span>
              </div>
              <div className="flex items-center gap-1.5 truncate">
                <span className="text-amber-500 font-extrabold">타석:</span>
                <span className="text-amber-300 font-black truncate">{liveState.batter || '타자'}</span>
              </div>
            </div>
          )}
        </div>

        {/* 💬 2. REAL-TIME CHAT STREAM (초고속 텍스트 스트림 모드) */}
        <div className="flex-1 overflow-y-auto p-2.5 sm:p-3.5 space-y-1.5 custom-scrollbar">
          {messages.map((m) => {
            const isMe = m.sender === myNickname;
            const isSystem = m.sender.includes('시스템');

            if (isSystem) {
              return (
                <div key={m.id} className="flex justify-center my-1.5">
                  <div className="bg-amber-500/10 border border-amber-500/20 text-amber-300 px-3 py-0.5 rounded-full text-[10.5px] font-bold flex items-center gap-1 shadow-sm">
                    <Sparkles className="w-3 h-3 text-amber-400" />
                    <span>{m.text}</span>
                  </div>
                </div>
              );
            }

            return (
              <div 
                key={m.id} 
                className={`py-1 px-2.5 rounded-xl text-xs sm:text-[13px] leading-relaxed transition-colors flex items-baseline gap-1.5 flex-wrap ${
                  isMe 
                    ? isLight ? 'bg-emerald-50/90 text-emerald-950 font-medium' : 'bg-emerald-950/40 text-emerald-100 font-medium'
                    : isLight ? 'hover:bg-slate-50 text-slate-800' : 'hover:bg-slate-900/40 text-slate-200'
                }`}
              >
                {/* Badge (e.g. 👑 VVIP) */}
                <span className="text-[9px] font-black px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-400 border border-amber-500/30 shrink-0 inline-flex items-center gap-0.5">
                  <Crown className="w-2.5 h-2.5 text-amber-400" />
                  {m.badge || 'VVIP'}
                </span>

                {/* Nickname */}
                <span className={`font-bold shrink-0 text-[11px] sm:text-xs ${isMe ? 'text-emerald-500 font-black' : 'text-slate-400'}`}>
                  {m.sender}:
                </span>

                {/* Chat message content */}
                <span className="break-words flex-1 min-w-0">
                  {m.text}
                </span>

                {/* Timestamp */}
                <span className="text-[9.5px] text-slate-500 font-mono shrink-0 ml-auto select-none opacity-60">
                  {m.timestamp}
                </span>
              </div>
            );
          })}
          <div ref={chatBottomRef} />
        </div>

        {/* ⚡ 3. QUICK CHEER BUTTONS & INPUT BAR */}
        <div className={`p-2.5 sm:p-3 border-t space-y-2 shrink-0 ${
          isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-900 border-slate-800'
        }`}>
          {/* Quick Cheering Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 custom-scrollbar text-[11px] font-bold">
            <button
              onClick={() => handleSendMessage('🔥 만루 홈런 가자아아악!!')}
              className="px-2.5 py-1 bg-amber-500/15 text-amber-300 hover:bg-amber-500/30 rounded-xl border border-amber-500/40 shrink-0 cursor-pointer transition-all active:scale-95"
            >
              🔥 홈런 가자!
            </button>
            <button
              onClick={() => handleSendMessage('🛡️ 삼진 잡고 막아내자!')}
              className="px-2.5 py-1 bg-emerald-500/15 text-emerald-300 hover:bg-emerald-500/30 rounded-xl border border-emerald-500/40 shrink-0 cursor-pointer transition-all active:scale-95"
            >
              🛡️ 삼진 잡자!
            </button>
            <button
              onClick={() => handleSendMessage('⚡ 오늘 역배 느낌이 온다 가즈아!')}
              className="px-2.5 py-1 bg-cyan-500/15 text-cyan-300 hover:bg-cyan-500/30 rounded-xl border border-cyan-500/40 shrink-0 cursor-pointer transition-all active:scale-95"
            >
              ⚡ 역배 가즈아!
            </button>
            <button
              onClick={() => handleSendMessage('👏 나이스 플레이 대박!')}
              className="px-2.5 py-1 bg-slate-800 text-slate-300 hover:bg-slate-700 rounded-xl border border-slate-700 shrink-0 cursor-pointer transition-all active:scale-95"
            >
              👏 나이스 플레이!
            </button>
          </div>

          {/* Text Input & Send Button */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-2"
          >
            <div className="relative flex-1">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder={`${myNickname}님, 실시간 톡을 입력하세요...`}
                className={`w-full px-3.5 py-2.5 rounded-2xl text-xs sm:text-sm border transition-all focus:outline-none focus:ring-2 focus:ring-emerald-500/50 ${
                  isLight
                    ? 'bg-white text-slate-900 border-slate-300 placeholder-slate-400'
                    : 'bg-slate-950 text-white border-slate-800 placeholder-slate-500'
                }`}
              />
            </div>

            <button
              type="submit"
              disabled={!inputText.trim()}
              className="px-4 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 disabled:opacity-40 disabled:pointer-events-none text-slate-950 font-black rounded-2xl text-xs sm:text-sm shadow-lg flex items-center gap-1.5 transition-all cursor-pointer shrink-0"
            >
              <span>전송</span>
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>

      </div>
    </div>
  );
};
