import React, { useState, useEffect, useRef } from 'react';
import { X, Send, Users, Zap, Radio, Crown, ShieldAlert, Sparkles, MessageSquare, Flame } from 'lucide-react';
import type { Match } from '../types/sports';
import { 
  MatchChatWebSocketService, 
  type ChatMessageItem, 
  type LiveMatchStatus 
} from '../services/websocket/matchChatWebSocketService';

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
  const matchId = String(match.betmanMatchNo || match.id);

  const [messages, setMessages] = useState<ChatMessageItem[]>([]);
  const [inputText, setInputText] = useState('');
  const [userCount, setUserCount] = useState<number>(1);
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [myNickname] = useState<string>(() => {
    const r = Math.floor(Math.random() * RANDOM_NICKNAMES.length);
    const n = Math.floor(10 + Math.random() * 90);
    return `${RANDOM_NICKNAMES[r]}${n}`;
  });

  // 실시간 라이브 경기 상태 & 야구 다이아몬드 주자 점등 상태
  const [liveState, setLiveState] = useState<LiveMatchStatus>({
    match_id: matchId,
    sport: match.sport || 'baseball',
    status: match.status || 'LIVE',
    inning_or_time: match.sport === 'baseball' ? '7회초' : '후반 78분',
    home_score: 4,
    away_score: 2,
    outs: 1,
    balls: 2,
    strikes: 1,
    runner_first: true,
    runner_second: false,
    runner_third: true,
    recent_event_text: '🔥 7회초 1사 1·3루 득점권 찬스 전개중'
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
                <span className="text-amber-400 font-mono">#{match.betmanMatchNo}</span>
                <span>[{match.homeTeam.name}] vs [{match.awayTeam.name}]</span>
              </h3>
              <div className="flex items-center gap-2 text-[10px] mt-0.5">
                <span className={`px-1.5 py-0.2 rounded font-black flex items-center gap-1 ${
                  isConnected 
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40' 
                    : 'bg-amber-500/20 text-amber-400 border border-amber-500/40 animate-pulse'
                }`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${isConnected ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
                  {isConnected ? 'FastAPI 웹소켓 렉 제로 0.01s' : '로컬 모의 스트림'}
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

              <div className="flex items-center gap-1.5 text-[11px] font-black bg-amber-500/15 text-amber-300 border border-amber-500/40 px-2.5 py-1 rounded-xl shadow-sm">
                <Radio className="w-3 h-3 animate-ping text-rose-400" />
                <span>{liveState.inning_or_time}</span>
                <span className="text-slate-400">|</span>
                <span>{liveState.outs}사</span>
              </div>
            </div>

            {/* ⚾ 다이아몬드 주자 점등 그래픽 (1루·2루·3루) */}
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

          </div>
        </div>

        {/* 💬 2. REAL-TIME CHAT STREAM */}
        <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-3 custom-scrollbar">
          {messages.map((m) => {
            const isMe = m.sender === myNickname;
            const isSystem = m.sender.includes('시스템');

            if (isSystem) {
              return (
                <div key={m.id} className="flex justify-center my-2">
                  <div className="bg-amber-500/15 border border-amber-500/30 text-amber-300 px-3 py-1 rounded-full text-[11px] font-bold flex items-center gap-1 shadow-sm">
                    <Sparkles className="w-3 h-3 text-amber-400" />
                    <span>{m.text}</span>
                  </div>
                </div>
              );
            }

            return (
              <div key={m.id} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                <div className="flex items-center gap-1.5 mb-1 text-[11px]">
                  <span className={`font-black ${isMe ? 'text-emerald-400' : 'text-slate-300'}`}>
                    {m.sender}
                  </span>
                  {m.badge && (
                    <span className="text-[9px] font-black px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                      {m.badge}
                    </span>
                  )}
                  <span className="text-[9px] text-slate-500 font-mono">{m.timestamp}</span>
                </div>

                <div className={`px-3.5 py-2 rounded-2xl max-w-[82%] text-xs sm:text-sm font-medium leading-relaxed break-words shadow-md ${
                  isMe
                    ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-tr-none'
                    : isLight
                      ? 'bg-slate-100 text-slate-800 border border-slate-200 rounded-tl-none'
                      : 'bg-slate-900 text-slate-100 border border-slate-800 rounded-tl-none'
                }`}>
                  {m.text}
                </div>
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
