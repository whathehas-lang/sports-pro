import { useState, useEffect } from 'react';
import { ShieldCheck, Trophy, Sparkles, MessageSquare, Globe, ArrowRight, Cpu, LayoutGrid, Clock, AlertTriangle, CreditCard } from 'lucide-react';
import { Navbar } from './components/Navbar';
import { MatchCard } from './components/MatchCard';
import { MatchDetailModal } from './components/MatchDetailModal';
import { PCWebCommunityHub } from './components/PCWebCommunityHub';
import { UserProfileModal, type UserProfileData } from './components/UserProfileModal';
import { LoginModal } from './components/LoginModal';
import { SubscriptionPaywallModal } from './components/SubscriptionPaywallModal';
import { sportsApiService } from './services/api/sportsApiService';
import { REAL_BETMAN_OFFICIAL_MATCHES } from './mock/realBetmanOfficialSchedule';
import type { Match, BetmanFolderCategory, MembershipTier, ViewMode } from './types/sports';

export default function App() {
  const [matches, setMatches] = useState<Match[]>(REAL_BETMAN_OFFICIAL_MATCHES);
  const [selectedFolder, setSelectedFolder] = useState<BetmanFolderCategory>('SEUNGBUSHIK');
  const [selectedRound, setSelectedRound] = useState<string>('프로토 승부식 260102회차 (betman.co.kr 오피셜 슬립)');
  const [membershipTier, setMembershipTier] = useState<MembershipTier>('VVIP');
  
  // 📌 1,000+ Sequence Pagination & Search States
  const [searchMatchNo, setSearchMatchNo] = useState<string>('');
  const [matchLimit, setMatchLimit] = useState<number>(999999);

  // 📌 Load API / Betman matches dynamically from instant Round Registry
  useEffect(() => {
    let isMounted = true;
    const loadMatches = async () => {
      try {
        const numSearch = searchMatchNo ? parseInt(searchMatchNo.trim(), 10) : undefined;
        const fetchedMatches = await sportsApiService.fetchBetmanMatchesByRound(
          selectedRound,
          selectedFolder,
          isNaN(numSearch as number) ? undefined : numSearch,
          matchLimit
        );
        if (isMounted && fetchedMatches && fetchedMatches.length > 0) {
          setMatches(fetchedMatches);
        }
      } catch (err) {
        console.error('Failed to load Betman matches:', err);
      }
    };

    loadMatches();
    return () => { isMounted = false; };
  }, [selectedRound, selectedFolder, searchMatchNo, matchLimit]);
  
  // UI View Mode (APP = Mobile Match Cards List, PC_WEB = 2-Column Desktop View)
  const [viewMode, setViewMode] = useState<ViewMode>('PC_WEB');
  const [activeTab, setActiveTab] = useState<'home' | 'community' | 'profile'>('home');
  const [cardDensity, setCardDensity] = useState<'COMPACT' | 'DETAILED'>('DETAILED');

  // Active Match Detail Modal
  const [selectedMatchForDetail, setSelectedMatchForDetail] = useState<Match | null>(null);

  // 📌 AUTH LOGIN & LOGOUT STATE MANAGEMENT
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(true);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState<boolean>(false);

  // 📌 3-DAY FREE TRIAL & PAID SUBSCRIPTION STATE MANAGEMENT (무료 3일 체험 72시간 카운트다운 & 유료 전환)
  const [trialSecondsLeft, setTrialSecondsLeft] = useState<number>(71 * 3600 + 58 * 60 + 42); // 71시간 58분 42초 남음
  const [isTrialExpired, setIsTrialExpired] = useState<boolean>(false);
  const [isPaywallOpen, setIsPaywallOpen] = useState<boolean>(false);

  // User Profile Data
  const [userProfile, setUserProfile] = useState<UserProfileData>({
    id: 'u1',
    name: '토큰VVIP회원',
    tier: 'PRO_ANALYST',
    favoriteSport: '야구/농구 (KBO & NBA 팩트)',
    accuracy: 94.8,
    totalVotes: 120,
    correctVotes: 114,
    badges: ['👑 VVIP 팩트 마스터', '🎟️ 토큰 오피셜분석가']
  });

  // 📌 승무패 / 베팅 마킹 상태 관리 (matchId -> ['WIN', 'DRAW', 'LOSE'])
  const [markedPicks, setMarkedPicks] = useState<Record<string, ('WIN' | 'DRAW' | 'LOSE')[]>>({});

  const handleTogglePick = (matchId: string, pick: 'WIN' | 'DRAW' | 'LOSE') => {
    setMarkedPicks((prev) => {
      const current = prev[matchId] || [];
      const exists = current.includes(pick);
      let next: ('WIN' | 'DRAW' | 'LOSE')[];
      if (exists) {
        next = current.filter((p) => p !== pick);
      } else {
        next = [...current, pick];
      }
      if (next.length === 0) {
        const copy = { ...prev };
        delete copy[matchId];
        return copy;
      }
      return { ...prev, [matchId]: next };
    });
  };

  const handleClearAllPicks = () => {
    setMarkedPicks({});
  };

  const markedMatchCount = Object.keys(markedPicks).length;
  const totalCombinations = Object.values(markedPicks).reduce((acc, picks) => acc * Math.max(1, picks.length), 1);
  const totalCost = (markedMatchCount > 0 ? totalCombinations : 0) * 1000;

  // Countdown timer effect
  useEffect(() => {
    if (isTrialExpired) return;
    const timer = setInterval(() => {
      setTrialSecondsLeft((prev) => {
        if (prev <= 1) {
          setIsTrialExpired(true);
          setIsPaywallOpen(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [isTrialExpired]);

  // Format Trial Timer String
  const formatTimerStr = (totalSec: number) => {
    const hours = Math.floor(totalSec / 3600);
    const mins = Math.floor((totalSec % 3600) / 60);
    const secs = totalSec % 60;
    return `${hours}시간 ${mins.toString().padStart(2, '0')}분 ${secs.toString().padStart(2, '0')}초`;
  };

  // 📌 Handle Login & Signup Success (회원가입 및 유료 등급 로그인 시 차단 창 즉시 해제 및 모달 닫기!)
  const handleLoginSuccess = (userData: { name: string; tier: MembershipTier; email: string }) => {
    setIsLoggedIn(true);
    setMembershipTier(userData.tier);
    setUserProfile(prev => ({
      ...prev,
      name: userData.name,
      badges: [`👑 ${userData.tier} 팩트 회원`, '🎟️ 토큰 공식 수치 멤버']
    }));
    setIsLoginModalOpen(false);

    // VVIP/VIP 유료 회원가입 및 로그인 시 즉시 결제 차단 창(Paywall) 닫기!
    if (userData.tier === 'VVIP' || userData.tier === 'VIP') {
      setIsTrialExpired(false);
      setTrialSecondsLeft(30 * 24 * 3600); // 30일 유료 구독 적용
      setIsPaywallOpen(false); // 차단 창 즉시 해제 & 지우기!
    }
  };

  // Handle Logout
  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserProfile(prev => ({
      ...prev,
      name: '손님 (로그인 필요)',
      accuracy: 0
    }));
  };

  // 📌 Handle Upgrade Paid Membership Success (유료 결제 시 차단 창 즉시 해제 및 모달 닫기!)
  const handleUpgradeSuccess = (tier: MembershipTier) => {
    setMembershipTier(tier);
    setIsTrialExpired(false);
    setTrialSecondsLeft(30 * 24 * 3600); // 30일 유료 멤버십 결제 적용
    setIsPaywallOpen(false); // 차단 창 즉시 해제 & 지우기!
  };

  // Handle Simulate Trial Expiration Test
  const handleSimulateTrialExpired = () => {
    setTrialSecondsLeft(0);
    setIsTrialExpired(true);
    setIsPaywallOpen(true);
  };

  // 📌 ⏰ 한국시간(KST) 기준 종료/지난 경기 판단 헬퍼
  const isMatchPassed = (matchTimeStr: string): boolean => {
    if (!matchTimeStr) return false;
    // Format: "08.29(토) 08:34 (한국시간)" or "08.29(금) 14:00 (한국시간)"
    const matched = matchTimeStr.match(/(\d{2})\.(\d{2})\([^)]+\)\s*(\d{2}):(\d{2})/);
    if (!matched) return false;

    const month = parseInt(matched[1], 10) - 1;
    const day = parseInt(matched[2], 10);
    const hour = parseInt(matched[3], 10);
    const minute = parseInt(matched[4], 10);

    const now = new Date();
    const year = now.getFullYear();

    const matchDate = new Date(year, month, day, hour, minute);
    return matchDate.getTime() < now.getTime();
  };

  const [hidePassedMatches, setHidePassedMatches] = useState<boolean>(false);

  // 📌 Handle folder selection with automatic round title synchronization
  const handleSelectFolder = (folder: BetmanFolderCategory) => {
    setSelectedFolder(folder);
    const roundTitle = folder === 'SEUNGMUBAE' 
      ? '축구 승무패 260048회차 (betman.co.kr 오피셜 슬립)'
      : folder === 'SEUNG1PAE'
      ? '야구 승1패 260063회차 (betman.co.kr 오피셜 슬립)'
      : folder === 'GIROKSIK'
      ? '프로토 기록식 89회차 (betman.co.kr 오피셜 슬립)'
      : '프로토 승부식 260102회차 (betman.co.kr 오피셜 슬립)';
    setSelectedRound(roundTitle);
  };

  // Filter matches by selected folder category & KST past match status
  const rawFiltered = matches.filter((m) => {
    if (selectedFolder !== 'ALL' && m.betmanFolder !== selectedFolder) return false;
    if (hidePassedMatches && isMatchPassed(m.matchTime)) return false;
    return true;
  });
  const filteredMatches = rawFiltered;

  // Handle favorite toggle
  const handleToggleFavorite = (matchId: string) => {
    setMatches((prev) =>
      prev.map((m) => {
        if (m.id === matchId) {
          return { ...m, isFavorite: !m.isFavorite };
        }
        return m;
      })
    );
  };

  // Handle opening match detail modal
  const handleOpenDetailModal = (match: Match) => {
    if (isTrialExpired) {
      setIsPaywallOpen(true);
      return;
    }
    setSelectedMatchForDetail(match);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-emerald-500 selection:text-slate-950 w-full max-w-full overflow-x-hidden">
      {/* Top Navbar */}
      <Navbar
        selectedFolder={selectedFolder}
        onSelectFolder={handleSelectFolder}
        selectedRound={selectedRound}
        onSelectRound={setSelectedRound}
        membershipTier={membershipTier}
        onChangeMembershipTier={setMembershipTier}
        viewMode={viewMode}
        onToggleViewMode={setViewMode}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isLoggedIn={isLoggedIn}
        userName={userProfile.name}
        onOpenLoginModal={() => setIsLoginModalOpen(true)}
        onLogout={handleLogout}
      />

      {/* Dynamic View Mode Main Container */}
      <main className={`flex-1 w-full mx-auto px-3 sm:px-6 py-4 space-y-4 ${
        viewMode === 'PC_WEB' ? 'max-w-7xl' : 'max-w-xl md:max-w-3xl lg:max-w-4xl'
      }`}>

        {/* 📌 API STATUS & DATA SOURCE BANNER */}
        <div className="flex items-center justify-between text-xs px-3 py-1.5 bg-slate-900/80 border border-slate-800 rounded-xl text-slate-400">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_#10b981]" />
            <span className="font-semibold text-slate-200 flex items-center gap-1">
              <span>⚡ betman.co.kr 오피셜 저장소 100% 팩트 대진표 연동 완료</span>
              <span className="text-emerald-400 font-bold text-[10px] bg-emerald-950 px-1.5 py-0.2 rounded border border-emerald-500/40">(0.01초 즉시 로딩)</span>
            </span>
          </div>
          <span className="text-[10px] font-mono text-slate-500 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
            API v3 Engine
          </span>
        </div>

        {/* 📌 3-DAY FREE TRIAL COUNTDOWN NEON BANNER (무료 3일 체험 타이머 & 유료 전환 안내) */}
        <div className={`p-3 rounded-2xl border flex flex-col sm:flex-row items-center justify-between gap-3 shadow-xl transition-all ${
          isTrialExpired
            ? 'bg-gradient-to-r from-rose-950 via-slate-900 to-rose-950 border-rose-500/70 text-rose-200'
            : 'bg-gradient-to-r from-amber-950 via-slate-900 to-amber-950 border-amber-500/70 text-amber-200'
        }`}>
          <div className="flex items-center gap-2.5 min-w-0">
            {isTrialExpired ? (
              <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0 animate-bounce" />
            ) : (
              <Clock className="w-5 h-5 text-amber-400 shrink-0 animate-pulse" />
            )}
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-black text-xs sm:text-sm text-white">
                  {isTrialExpired ? '⛔ 무료 3일 체험이 만료되었습니다!' : '⏳ [무료 3일 체험 진행중]'}
                </span>
                <span className={`text-[10px] px-2 py-0.5 rounded font-mono font-black ${
                  isTrialExpired ? 'bg-rose-500 text-slate-950' : 'bg-amber-400 text-slate-950'
                }`}>
                  {isTrialExpired ? 'EXPIRED' : '3-DAY TRIAL'}
                </span>
              </div>
              <p className="text-[11px] text-slate-300 font-medium truncate mt-0.5">
                {isTrialExpired
                  ? '서비스 연결이 제한되었습니다. 오피셜 팩트 데이터 이용을 위해 유료 멤버십으로 전환해 주세요.'
                  : `무료 체험 남은 시간: ${formatTimerStr(trialSecondsLeft)} (만료 시 유료 전용 전환)`}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {isTrialExpired ? (
              <button
                onClick={() => setIsPaywallOpen(true)}
                className="px-4 py-2 bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-300 hover:to-yellow-400 text-slate-950 font-black text-xs rounded-xl shadow-lg transition-all flex items-center gap-1.5 cursor-pointer border border-yellow-200"
              >
                <CreditCard className="w-4 h-4 text-slate-950" />
                <span>유료 멤버십 구독하기 💳</span>
              </button>
            ) : (
              <>
                <button
                  onClick={() => setIsPaywallOpen(true)}
                  className="px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-[11px] rounded-xl shadow transition-all flex items-center gap-1 cursor-pointer"
                >
                  <span>유료 전환 👑</span>
                </button>
                
                {/* 🧪 테스트용 3일 만료 즉시 시뮬레이션 버튼 */}
                <button
                  onClick={handleSimulateTrialExpired}
                  className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-rose-300 text-[10px] font-bold rounded-xl border border-rose-500/30 transition-all cursor-pointer"
                  title="3일 만료 차단 테스트"
                >
                  <span>⏰ 3일 만료 테스트</span>
                </button>
              </>
            )}
          </div>
        </div>

        {/* HOME TAB CONTENT (경기목록 탭 전용) */}
        {activeTab === 'home' && (
          <div className="space-y-4">
            
            {/* View Mode & Density Switcher Ribbon */}
            <div className="flex items-center justify-between bg-slate-900/80 p-2.5 rounded-xl border border-slate-800 text-xs shadow-md">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span className="font-bold text-white">
                  {selectedRound} 오피셜 라인업 팩트
                </span>
                <span className="text-[10px] text-slate-400 hidden sm:inline">
                  (주관적 예측 0% • 100% 팩트 데이터)
                </span>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setHidePassedMatches(!hidePassedMatches)}
                  className={`px-2.5 py-1 rounded-lg font-bold text-[10px] transition-all flex items-center gap-1 cursor-pointer border ${
                    hidePassedMatches
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 font-black'
                      : 'bg-slate-800 text-slate-400 border-slate-700'
                  }`}
                  title="한국시간(KST) 기준 지난 경기 숨김 토글"
                >
                  <Clock className="w-3 h-3" />
                  <span>{hidePassedMatches ? '⏰ 진행 예정만 (지난 경기 숨김)' : '🌐 전체 경기 포함'}</span>
                </button>

                <button
                  onClick={() => setCardDensity(cardDensity === 'COMPACT' ? 'DETAILED' : 'COMPACT')}
                  className={`px-2.5 py-1 rounded-lg font-bold text-[10px] transition-all flex items-center gap-1 cursor-pointer border ${
                    cardDensity === 'COMPACT'
                      ? 'bg-emerald-500 text-slate-950 border-emerald-400'
                      : 'bg-slate-800 text-slate-300 border-slate-700 hover:text-white'
                  }`}
                >
                  <LayoutGrid className="w-3 h-3" />
                  <span>{cardDensity === 'COMPACT' ? '⚡ 간편보기' : '📊 정밀상세'}</span>
                </button>
              </div>
            </div>

            {/* PC DESKTOP MODE vs MOBILE APP MODE */}
            {viewMode === 'PC_WEB' ? (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
                
                {/* LEFT MAIN GRID (8 COLS): 2-COLUMN MATCH CARDS GRID */}
                <div className="lg:col-span-8 space-y-4">
                  
                  {/* 🔍 Betman Match Sequence Search Bar & Count Indicator */}
                  <div className="flex items-center justify-between gap-3 bg-slate-900 p-2.5 rounded-xl border border-amber-500/40 text-xs shadow-md">
                    <div className="flex items-center gap-2 flex-1">
                      <span className="font-black text-amber-400 shrink-0">🔍 경기번호 검색:</span>
                      <input
                        type="number"
                        placeholder="예: 7121 (1~9,999번 가능)"
                        value={searchMatchNo}
                        onChange={(e) => setSearchMatchNo(e.target.value)}
                        className="bg-slate-950 border border-slate-700 rounded-lg px-3 py-1 text-white placeholder-slate-500 w-full max-w-[200px] focus:outline-none focus:border-amber-400"
                      />
                      {searchMatchNo && (
                        <button
                          onClick={() => setSearchMatchNo('')}
                          className="text-[10px] text-slate-400 hover:text-white bg-slate-800 px-2 py-0.5 rounded"
                        >
                          초기화
                        </button>
                      )}
                    </div>
                    <span className="text-[10px] text-slate-400 font-mono shrink-0">
                      표출중: {filteredMatches.length}개 / 전체 9,999개
                    </span>
                  </div>

                  {searchMatchNo && filteredMatches.length === 1 && matches.length === 0 && (
                    <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl text-center space-y-2">
                      <div className="text-amber-400 font-black text-sm">
                        ⚠️ [베트맨 {searchMatchNo}번] 해당 번호는 이번 회차 발매 대상 경기가 아닙니다.
                      </div>
                      <p className="text-xs text-slate-400">
                        실제 베트맨 공식 대진표와 동일하게 이번 회차에 배정된 번호만 표출됩니다. (미발매 / 결번 처리)
                      </p>
                    </div>
                  )}

                  <div className="flex flex-col space-y-4">
                    {filteredMatches.map((match) => (
                      <MatchCard
                        key={match.id}
                        match={match}
                        membershipTier={membershipTier}
                        cardDensity={cardDensity}
                        markedPicks={markedPicks[match.id] || []}
                        onSelectMatch={(m) => handleOpenDetailModal(m)}
                        onToggleFavorite={handleToggleFavorite}
                        onTogglePick={handleTogglePick}
                      />
                    ))}
                  </div>

                  {/* ➕ Load More Button (20개씩 더보기) */}
                  {!searchMatchNo && matchLimit < 1000 && (
                    <div className="pt-2 text-center">
                      <button
                        onClick={() => setMatchLimit((prev) => prev + 20)}
                        className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 border border-amber-500/50 hover:border-amber-400 text-amber-300 hover:text-amber-200 text-xs font-black rounded-xl shadow-lg transition-all cursor-pointer"
                      >
                        ➕ 베트맨 경기 더보기 (+20개 로딩)
                      </button>
                    </div>
                  )}
                </div>

                {/* RIGHT SIDEBAR (4 COLS): PC DESKTOP EXCLUSIVE CHAT ROOM DIRECT ENTRY PANEL */}
                <div className="lg:col-span-4 space-y-4 sticky top-20">
                  
                  {/* 실시간 대화방 바로 입장 리스트 */}
                  <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-amber-950/40 p-4 rounded-2xl border-2 border-amber-500/50 space-y-3 shadow-2xl">
                    <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
                      <div className="flex items-center gap-2">
                        <MessageSquare className="w-4 h-4 text-amber-400 animate-pulse" />
                        <h3 className="text-xs font-black text-white">🔥 실시간 톡방 목록 (바로 입장)</h3>
                      </div>
                      <span className="text-[9px] bg-emerald-500 text-slate-950 px-2 py-0.5 rounded font-black">
                        LIVE 1,420명
                      </span>
                    </div>

                    <div className="space-y-2 text-xs">
                      {/* 1. 📢 전체 톡방 바로 입장 */}
                      <div className="bg-slate-950 p-3 rounded-xl border border-amber-500/60 hover:border-amber-400 flex items-center justify-between gap-2 transition-all group">
                        <div className="min-w-0">
                          <span className="text-[11px] font-black text-amber-300 flex items-center gap-1 truncate">
                            <Globe className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                            📢 [토큰 메인 로비 전체 톡방]
                          </span>
                          <span className="text-[10px] text-slate-400 font-medium block">
                            전체 회원 1,420명 실시간 대화중
                          </span>
                        </div>
                        <button
                          onClick={() => {
                            if (isTrialExpired) {
                              setIsPaywallOpen(true);
                            } else {
                              setActiveTab('community');
                            }
                          }}
                          className="px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-lg font-black text-[11px] shadow transition-all flex items-center gap-1 shrink-0 cursor-pointer"
                        >
                          <span>입장</span>
                          <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* VVIP Live Fact Agent Status Monitor */}
                  <div className="bg-slate-900 p-4 rounded-2xl border border-emerald-500/40 space-y-3.5 shadow-2xl">
                    <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
                      <div className="flex items-center gap-2">
                        <Cpu className="w-4 h-4 text-emerald-400 animate-pulse" />
                        <h3 className="text-xs font-black text-white">5대 전문 에이전트 가동 상태</h3>
                      </div>
                      <span className="text-[9px] bg-emerald-500 text-slate-950 px-2 py-0.5 rounded font-black">
                        LIVE READY
                      </span>
                    </div>

                    <div className="space-y-2 text-[11px]">
                      <div className="flex items-center justify-between bg-slate-950 p-2 rounded-lg border border-slate-800">
                        <span className="text-slate-300 font-bold">1. 라인업/2군대체 에이전트</span>
                        <span className="text-emerald-400 font-mono font-bold">🟢 정상 가동 (0.1s)</span>
                      </div>
                      <div className="flex items-center justify-between bg-slate-950 p-2 rounded-lg border border-slate-800">
                        <span className="text-slate-300 font-bold">2. 핫폼(👑🔥)/방어율 에이전트</span>
                        <span className="text-emerald-400 font-mono font-bold">🟢 정상 가동</span>
                      </div>
                      <div className="flex items-center justify-between bg-slate-950 p-2 rounded-lg border border-slate-800">
                        <span className="text-slate-300 font-bold">3. 불펜/비행거리(km) 에이전트</span>
                        <span className="text-amber-400 font-mono font-bold">🟡 수치 갱신중</span>
                      </div>
                      <div className="flex items-center justify-between bg-slate-950 p-2 rounded-lg border border-slate-800">
                        <span className="text-slate-300 font-bold">4. 구장팩터/백투백 에이전트</span>
                        <span className="text-emerald-400 font-mono font-bold">🟢 정상 가동</span>
                      </div>
                      <div className="flex items-center justify-between bg-slate-950 p-2 rounded-lg border border-slate-800">
                        <span className="text-slate-300 font-bold">5. VVIP 토큰 공식 리포터</span>
                        <span className="text-emerald-400 font-mono font-bold">🟢 100% FACT</span>
                      </div>
                    </div>
                  </div>

                </div>

              </div>
            ) : (
              /* MOBILE APP MODE: 1-COLUMN VERTICAL STACK */
              <div className={`flex flex-col w-full ${cardDensity === 'COMPACT' ? 'space-y-2' : 'space-y-4'}`}>
                {filteredMatches.map((match) => (
                  <MatchCard
                    key={match.id}
                    match={match}
                    membershipTier={membershipTier}
                    cardDensity={cardDensity}
                    markedPicks={markedPicks[match.id] || []}
                    onSelectMatch={(m) => handleOpenDetailModal(m)}
                    onToggleFavorite={handleToggleFavorite}
                    onTogglePick={handleTogglePick}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* 💻 PC WEB EXCLUSIVE CHAT ROOM TAB */}
        {activeTab === 'community' && (
          <div className="space-y-4 relative">
            
            {/* 1. PC Web Community Hub Live Chat Room */}
            <PCWebCommunityHub
              matches={matches}
              userProfile={userProfile}
              membershipTier={membershipTier}
              onOpenMatchDetail={(m) => handleOpenDetailModal(m)}
            />

            {/* 2. [배너 입점 문의 📲] 바 */}
            <div className="flex items-center justify-between bg-gradient-to-r from-slate-900 via-amber-950/60 to-slate-900 px-4 py-3.5 rounded-2xl border-2 border-amber-500/50 shadow-xl">
              <div className="flex items-center gap-2 min-w-0">
                <Sparkles className="w-4 h-4 text-yellow-400 animate-spin shrink-0" />
                <span className="text-xs sm:text-sm font-black text-amber-300 truncate">
                  📢 [토큰 (Tokeon) 공식 프리미엄 배너 광고 입점 문의 구역]
                </span>
              </div>
              <button className="px-4 py-2 bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-300 hover:to-yellow-400 text-slate-950 font-black text-xs rounded-xl shadow-lg transition-all flex items-center gap-1.5 shrink-0 cursor-pointer border border-yellow-200">
                <span>배너 입점 문의 📲</span>
              </button>
            </div>

          </div>
        )}

        {/* PROFILE TAB */}
        {activeTab === 'profile' && (
          <UserProfileModal
            userProfile={userProfile}
            onLogout={handleLogout}
          />
        )}

      </main>

      {/* 🎟️ 플로팅 실시간 승무패 마킹 슬립 집계 바 (Floating Slip Cart) */}
      {markedMatchCount > 0 && (
        <div className="fixed bottom-5 left-1/2 -translate-x-1/2 z-40 w-11/12 max-w-3xl bg-slate-950/95 border-2 border-amber-500 rounded-2xl p-3.5 sm:p-4 shadow-[0_0_35px_rgba(245,158,11,0.4)] backdrop-blur-lg flex flex-wrap items-center justify-between gap-3 animate-in slide-in-from-bottom-5">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-amber-400 to-yellow-600 text-slate-950 flex items-center justify-center font-black text-xl shadow-md shrink-0">
              🎟️
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-black text-white text-xs sm:text-sm">
                  {selectedFolder === 'SEUNGMUPAE' || selectedFolder === 'SEUNGMUBAE' ? '⚽ 축구 승무패 마킹 완료' : '🎯 베트맨 승무패 마킹 슬립'}
                </span>
                <span className="bg-emerald-500 text-slate-950 px-2 py-0.5 rounded-full font-black text-[11px]">
                  {markedMatchCount}경기 선택
                </span>
              </div>
              <span className="text-[11px] text-slate-300 font-bold block mt-0.5">
                총 <strong className="text-amber-400 font-black">{totalCombinations.toLocaleString()}개 조합</strong> • 예상 구매금액 <strong className="text-emerald-400 font-black">{totalCost.toLocaleString()}원</strong>
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleClearAllPicks}
              className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-rose-400 hover:text-rose-300 text-xs font-bold rounded-xl border border-rose-500/40 transition-all cursor-pointer shadow"
            >
              초기화 🗑️
            </button>
            <button
              onClick={() => {
                const text = Object.entries(markedPicks)
                  .map(([id, picks]) => `경기 [${id}]: ${picks.map(p => p === 'WIN' ? '승' : p === 'DRAW' ? '무' : '패').join('/')}`)
                  .join('\n');
                navigator.clipboard.writeText(`[토큰(Tokeon) 오피셜 마킹 내역]\n${text}\n총 ${totalCombinations}개 조합 (${totalCost.toLocaleString()}원)`);
                alert('마킹 조합이 클립보드에 복사되었습니다! 📋');
              }}
              className="px-4 py-2 bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-300 hover:to-yellow-400 text-slate-950 font-black text-xs rounded-xl shadow-lg transition-all cursor-pointer flex items-center gap-1 border border-yellow-200"
            >
              <span>조합 복사 📋</span>
            </button>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 py-6 text-center text-xs text-slate-500 space-y-1.5 w-full pb-20">
        <div className="flex justify-center items-center gap-2">
          <Trophy className="w-4 h-4 text-emerald-400" />
          <span className="font-bold text-slate-400">토큰 (Tokeon) • tokeon.co.kr</span>
        </div>
        <p className="text-[11px]">100% Official Fact Data Service - No Subjective AI Predictions</p>
        <p className="text-[10px] text-slate-600">© 2026 Tokeon Analytics Platform. All rights reserved.</p>
      </footer>

      {/* MODAL 1: MATCH FACT DETAIL MODAL */}
      {selectedMatchForDetail && (
        <MatchDetailModal
          match={selectedMatchForDetail}
          onClose={() => setSelectedMatchForDetail(null)}
        />
      )}

      {/* MODAL 2: LOGIN & SIGNUP MODAL */}
      {isLoginModalOpen && (
        <LoginModal
          onClose={() => setIsLoginModalOpen(false)}
          onLoginSuccess={handleLoginSuccess}
        />
      )}

      {/* MODAL 3: 3-DAY TRIAL EXPIRED & SUBSCRIPTION PAYWALL MODAL */}
      {isPaywallOpen && (
        <SubscriptionPaywallModal
          isTrialExpired={isTrialExpired}
          onClose={isTrialExpired ? undefined : () => setIsPaywallOpen(false)}
          onUpgradeSuccess={handleUpgradeSuccess}
        />
      )}

    </div>
  );
}
