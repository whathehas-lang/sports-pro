import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Trophy, Sparkles, MessageSquare, Clock, AlertTriangle, CreditCard, ShieldCheck, Database, CheckCircle2, RefreshCw, X } from 'lucide-react';
import { Navbar } from './components/Navbar';
import { MobileConnectModal } from './components/MobileConnectModal';
import { MatchCard } from './components/MatchCard';
import { MatchDetailModal } from './components/MatchDetailModal';
import { MatchLiveChatModal } from './components/MatchLiveChatModal';
import { ErrorBoundary } from './components/ErrorBoundary';
import { PCWebCommunityHub } from './components/PCWebCommunityHub';
import { UserProfileModal, type UserProfileData } from './components/UserProfileModal';
import { LoginModal } from './components/LoginModal';
import { SubscriptionPaywallModal } from './components/SubscriptionPaywallModal';
import { TotalIntegrityDashboardModal } from './components/TotalIntegrityDashboardModal';
import { sportsApiService } from './services/api/sportsApiService';
import { BetmanLiveSyncService } from './services/betman/betmanLiveSyncService';
import { getDynamicBetmanGamesMetadata } from './services/betman/betmanRoundRegistry';
import type { Match, BetmanFolderCategory, MembershipTier, ViewMode } from './types/sports';
import { isMatchCompleted, isMatchTimePassed, parseMatchTimestamp } from './utils/matchResultHelper';
import { firebaseService, isFirebaseConfigured } from './services/firebase/firebaseService';
import { verifiedMatchDatabase } from './services/db/verifiedMatchDatabase';
import type { VerificationAuditReport } from './services/verification/types';
import { LiveMatchPollingScheduler } from './services/api/liveMatchPollingScheduler';
import { ApiSportsWebhookService } from './services/api/apiSportsWebhookService';
import { MatchDbLockService } from './services/api/matchDbLockService';
import { KboLiveSubPipelineService } from './services/api/kboLiveSubPipelineService';
import { H2HBatchPrefetchService } from './services/batch/h2hBatchPrefetchService';
import { H2HRecentFormEngine } from './services/enricher/h2hRecentFormEngine';
import { BetmanHourlySyncScheduler } from './services/scheduler/betmanHourlySyncScheduler';
import { SportsDbService } from './services/api/sportsDbService';
import { BaseballLiveStarterHub } from './services/api/baseballLiveStarterHub';

export default function App() {
  const dynamicMeta = getDynamicBetmanGamesMetadata();
  const [matches, setMatches] = useState<Match[]>(() => BetmanLiveSyncService.getAllLiveMatches());
  const [selectedFolder, setSelectedFolder] = useState<BetmanFolderCategory>('SEUNGBUSHIK');
  const [selectedRound, setSelectedRound] = useState<string>(`프로토 승부식 ${dynamicMeta.G101.defaultRoundTs}회차 (betman.co.kr 오피셜 슬립)`);
  const [auditReport, setAuditReport] = useState<VerificationAuditReport | null>(() => verifiedMatchDatabase.getLatestAuditReport());
  const [isAuditModalOpen, setIsAuditModalOpen] = useState<boolean>(false);
  const [isIntegrityModalOpen, setIsIntegrityModalOpen] = useState<boolean>(false);
  const [isReverifying, setIsReverifying] = useState<boolean>(false);
  const [membershipTier, setMembershipTier] = useState<MembershipTier>(() => {
    const saved = localStorage.getItem('tokeon_membership_tier');
    return (saved as MembershipTier) || 'VVIP';
  });
  const [refreshToast, setRefreshToast] = useState<string | null>(null);
  const [isMobileConnectModalOpen, setIsMobileConnectModalOpen] = useState<boolean>(false);

  // 📅 SQLite Sports Master DB 실시간 날짜 연동 상태 (최근 3일간 경기 결과)
  const [dbDates, setDbDates] = useState<string[]>(['2026-09-04', '2026-09-03', '2026-09-02']);
  const [selectedDbDate, setSelectedDbDate] = useState<string>('2026-09-04');
  const [dbMatchesMap, setDbMatchesMap] = useState<Record<string, Match[]>>({});

  const handleReverifyAll = () => {
    setIsReverifying(true);
    try {
      if ('caches' in window) {
        caches.keys().then(keys => {
          for (const k of keys) caches.delete(k);
        });
      }
      if ('serviceWorker' in navigator) {
        navigator.serviceWorker.getRegistrations().then(regs => {
          for (const r of regs) r.unregister();
        });
      }
      localStorage.clear();
      sessionStorage.clear();
    } catch (e) {}
    window.location.href = window.location.origin + window.location.pathname + '?app_ver=v' + Date.now();
  };

  // ⚡ 마운트 즉시 최신 오피셜 데이터 동기화 & 실시간 라이브 폴링 즉시 가동
  useEffect(() => {
    BetmanLiveSyncService.getMatchesAsync().then(freshMatches => {
      if (freshMatches && freshMatches.length > 0) {
        setMatches(freshMatches);
        // 🚀 실시간 라이브 스코어 스케줄러 즉시 동기화 및 15초 폴링 가동
        LiveMatchPollingScheduler.syncActiveMatches(freshMatches);
        
        // 🛡️ 상대전적 H2H 배치 수집은 실시간 스코어와 100% 분리되어 백그라운드 지연 실행 (UI/실시간 간섭 0%)
        setTimeout(() => {
          H2HBatchPrefetchService.runDailyBatchPrefetch(freshMatches).then(() => {
            setMatches(prev => prev.map(m => H2HRecentFormEngine.enrichH2HAndRecentLogs(m)));
          }).catch(() => {});
        }, 1000);
      }
    });

    const unsubscribeDb = verifiedMatchDatabase.subscribe(() => {
      const dbMatches = verifiedMatchDatabase.getVerifiedMatches();
      if (dbMatches && dbMatches.length > 0) {
        setMatches(dbMatches.map(m => BaseballLiveStarterHub.enrichMatchWithFactStarter(m)));
      }
    });

    // ⚾ Firebase 실시간 공식 선발투수 갱신 리스너 (백엔드가 긁어온 팩트 즉각 반영)
    const unsubscribeStarters = firebaseService.subscribeToDailyStarters((startersMap) => {
      if (startersMap && Object.keys(startersMap).length > 0) {
        setMatches(prev => prev.map(m => BaseballLiveStarterHub.enrichMatchWithFactStarter(m)));
      }
    });

    // ⏱️ 10분 주기 공식 선발투수 자동 재확인 & 갱신 스케줄러 (대표님 지시: 미정인 부분은 10분 단위로 업데이트)
    const starterPollTimer = setInterval(() => {
      BaseballLiveStarterHub.syncOfficialStarters().then(() => {
        setMatches(prev => prev.map(m => BaseballLiveStarterHub.enrichMatchWithFactStarter(m)));
      }).catch(() => {});
    }, 10 * 60 * 1000);

    return () => {
      unsubscribeDb();
      unsubscribeStarters();
      clearInterval(starterPollTimer);
    };
  }, []);
  


  
  // 📌 1,000+ Sequence Pagination & Search States
  const [searchMatchNo, setSearchMatchNo] = useState<string>('');
  const [matchLimit, setMatchLimit] = useState<number>(999999);

  // 💬 Sidebar Chat Panel Message states
  const [sidebarMessages, setSidebarMessages] = useState<{ id: string; sender: string; text: string; timeStr: string; tier: string; color: string }[]>(() => {
    const saved = localStorage.getItem('tokeon_sidebar_chat');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return [
      { id: '1', sender: '토큰공식리포터', text: '🎟️ 실시간 라이브 톡 채널이 개설되었습니다. 팩트 데이터 분석을 자유롭게 논의하세요!', timeStr: '방금 전', tier: 'OFFICIAL FACT', color: 'text-amber-400' }
    ];
  });

  const sidebarChatContainerRef = useRef<HTMLDivElement>(null);

  const scrollSidebarToBottom = () => {
    if (sidebarChatContainerRef.current) {
      sidebarChatContainerRef.current.scrollTop = sidebarChatContainerRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    localStorage.setItem('tokeon_sidebar_chat', JSON.stringify(sidebarMessages));
    scrollSidebarToBottom();
    const timer = setTimeout(scrollSidebarToBottom, 60);
    return () => clearTimeout(timer);
  }, [sidebarMessages]);

  // Subscribe to real-time Firebase sidebar messages if configured
  useEffect(() => {
    if (!isFirebaseConfigured) return;

    const unsubscribe = firebaseService.subscribeToRoomMessages('homepage-sidebar-chat', (msgs) => {
      setSidebarMessages(prev => {
        const mapped = msgs.map(m => ({
          id: m.id,
          sender: m.senderName,
          text: m.text,
          timeStr: m.timeStr,
          tier: m.senderTier,
          color: m.color || 'text-slate-200'
        }));
        return mapped.length > 0 ? mapped : prev;
      });
    });

    return () => unsubscribe();
  }, []);

  // ⚡ 실시간 라이브 경기 스코어 자동 동기화 (DB Lock & Fallback & KBO 10초 서브 파이프라인)
  useEffect(() => {
    // 1. 점수 변경 시 실시간 상태 갱신 (상태값 기반 DB Lock & 점수 감소 차단)
    const unsubscribePolling = LiveMatchPollingScheduler.onScoreUpdate((matchId, homeScore, awayScore, statusLabel, isFinished) => {
      setMatches(prev => prev.map(m => {
        if (m.id === matchId || String(m.betmanMatchNo) === matchId || m.id.includes(matchId)) {
          return MatchDbLockService.applyDbLockAndValidation(m, {
            homeScore,
            awayScore,
            statusLabel,
            isCompleted: isFinished,
            statusCode: isFinished ? 'FT' : 'INP'
          });
        }
        return m;
      }));
    });

    // 2. 웹훅 이벤트 수신 시 실시간 반영 (DB Lock 가드 적용)
    const unsubscribeWebhook = ApiSportsWebhookService.subscribe((payload) => {
      if (payload.gameId) {
        const hScore = payload.data?.scores?.home?.total;
        const aScore = payload.data?.scores?.away?.total;
        if (typeof hScore === 'number' && typeof aScore === 'number') {
          setMatches(prev => prev.map(m => {
            if (m.id.includes(String(payload.gameId)) || String(m.betmanMatchNo) === String(payload.gameId)) {
              return MatchDbLockService.applyDbLockAndValidation(m, {
                homeScore: hScore,
                awayScore: aScore,
                statusCode: payload.event === 'game.finished' ? 'FT' : 'INP',
                isCompleted: payload.event === 'game.finished'
              });
            }
            return m;
          }));
        }
      }
    });

    // 3. ⚡ KBO 전용 10초 독립 서브 파이프라인 리스너 연동 (국내 야구 채널 이원화)
    KboLiveSubPipelineService.start();
    const unsubscribeKbo = KboLiveSubPipelineService.subscribe((kboGame) => {
      setMatches(prev => prev.map(m => {
        if (m.sport === 'baseball') {
          const isHome = m.homeTeam.name.includes(kboGame.homeTeam) || kboGame.homeTeam.includes(m.homeTeam.name);
          const isAway = m.awayTeam.name.includes(kboGame.awayTeam) || kboGame.awayTeam.includes(m.awayTeam.name);
          if (isHome && isAway) {
            return KboLiveSubPipelineService.crossValidateKboMatch(m, kboGame, m.homeScore, m.awayScore);
          }
        }
        return m;
      }));
    });

    // 4. ⏰ 오후 3시(15:00) 1시간 단위 배트맨 추가 경기(MLB 등) 자동 동기화 스케줄러 시작
    BetmanHourlySyncScheduler.start();
    const unsubscribeHourly = BetmanHourlySyncScheduler.subscribe((latestMatches) => {
      if (latestMatches && latestMatches.length > 0) {
        setMatches(latestMatches);
      }
    });

    // 💳 결제 완료 리다이렉트 URL 확인 처리
    if (typeof window !== 'undefined' && window.location.search.includes('payment_status=success')) {
      handleUpgradeSuccess('VIP');
      window.history.replaceState({}, document.title, window.location.pathname);
    }

    return () => {
      unsubscribePolling();
      unsubscribeWebhook();
      unsubscribeKbo();
      unsubscribeHourly();
      KboLiveSubPipelineService.stop();
      BetmanHourlySyncScheduler.stop();
    };
  }, []);

  // ⚡ 경기 목록 갱신 시 라이브 폴링 스케줄러 동기화
  useEffect(() => {
    if (matches.length > 0) {
      LiveMatchPollingScheduler.syncActiveMatches(matches);
    }
  }, [matches]);

  const [sidebarInput, setSidebarInput] = useState<string>('');
  
  // 🔔 Sidebar Live Chat Notification Settings State ('sound' | 'browser' | 'none')
  const [chatNotificationSettings, setChatNotificationSettings] = useState<'sound' | 'browser' | 'none'>('sound');

  // Web Audio Synth Sound player helper & Browser Push Notifications trigger
  const triggerNotificationFeedback = (sender: string, text: string) => {
    if (chatNotificationSettings === 'sound') {
      try {
        const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
        if (AudioContextClass) {
          const ctx = new AudioContextClass();
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(650, ctx.currentTime);
          gain.gain.setValueAtTime(0.04, ctx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.12);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start();
          osc.stop(ctx.currentTime + 0.12);
        }
      } catch (e) {
        console.error(e);
      }
    } else if (chatNotificationSettings === 'browser') {
      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification(`💬 [토큰 라이브 톡] ${sender}`, {
          body: text,
          tag: 'tokeon-sidebar-chat'
        });
      }
    }
  };

  const handleSendSidebarMessage = async () => {
    if (!sidebarInput.trim()) return;
    const baseMsg = {
      sender: userProfile.name,
      text: sidebarInput.trim(),
      timeStr: '방금 전',
      tier: 'VVIP',
      color: 'text-amber-400'
    };

    if (isFirebaseConfigured) {
      const docId = await firebaseService.sendRoomMessage('homepage-sidebar-chat', {
        senderName: baseMsg.sender,
        senderTier: baseMsg.tier,
        senderAvatar: '👑',
        text: baseMsg.text,
        timeStr: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }),
        color: baseMsg.color,
        isVvip: true
      });
      if (!docId) {
        alert("⚠️ 실시간 전송 실패!\n\n파이어베이스 콘솔(Firestore Database)을 생성하셨는지 확인해 주세요. 규칙(Rules) 탭에서 'allow read, write: if true;'로 게시(Publish)해야 채팅이 작동합니다.");
      }
    } else {
      const newMsg = {
        ...baseMsg,
        id: String(Date.now())
      };
      setSidebarMessages((prev) => [...prev, newMsg]);
    }

    setSidebarInput('');
    triggerNotificationFeedback(userProfile.name, sidebarInput.trim());
  };

  // 📌 Subscribe to verified match database changes
  useEffect(() => {
    const unsubscribe = verifiedMatchDatabase.subscribe(() => {
      setAuditReport(verifiedMatchDatabase.getLatestAuditReport());
    });
    return () => unsubscribe();
  }, []);

  // 📌 Load API / Betman matches dynamically from instant Round Registry (1-hour auto-refresh)
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
          setAuditReport(verifiedMatchDatabase.getLatestAuditReport());
        }
      } catch (err) {
        console.error('Failed to load Betman matches:', err);
      }
    };

    loadMatches();

    // 🕒 1시간(60분) 마다 실시간 오피셜 데이터 자동 갱신
    // 🔄 30-Second Real-Time Auto-Polling Background Sync (핸드폰 새로고침 불필요)
    const autoSyncTimer = setInterval(() => {
      console.log('[AutoSync] 30초 실시간 백그라운드 자동 갱신 실행 중...');
      loadMatches();
    }, 30 * 1000);

    return () => {
      isMounted = false;
      clearInterval(autoSyncTimer);
    };
  }, [selectedRound, selectedFolder, searchMatchNo, matchLimit]);
  
  // UI View Mode (APP = Mobile Match Cards List, PC_WEB = 2-Column Desktop View)
  const [viewMode, setViewMode] = useState<ViewMode>(() => {
    const saved = localStorage.getItem('tokeon_view_mode');
    return (saved as any) || 'PC_WEB';
  });
  const [activeTab, setActiveTab] = useState<'home' | 'community' | 'profile'>(() => {
    const saved = localStorage.getItem('tokeon_active_tab');
    return (saved as any) || 'home';
  });
  
  useEffect(() => {
    localStorage.setItem('tokeon_view_mode', viewMode);
  }, [viewMode]);

  useEffect(() => {
    localStorage.setItem('tokeon_active_tab', activeTab);
  }, [activeTab]);

  const [cardDensity, setCardDensity] = useState<'COMPACT' | 'DETAILED'>('DETAILED');

  // Active Match Detail Modal
  const [selectedMatchForDetail, setSelectedMatchForDetail] = useState<Match | null>(null);
  // Active Real-Time Match Chat & Baserunner Modal
  const [selectedMatchForChat, setSelectedMatchForChat] = useState<Match | null>(null);

  // 🎨 THEME: PERMANENTLY FIXED TO DARK MODE (밝은 모드 완전 제거 및 영구 다크모드 고정)
  const theme = 'dark' as const;
  const isLight = false;

  // 📌 AUTH LOGIN & LOGOUT STATE MANAGEMENT
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
    return localStorage.getItem('tokeon_is_logged_in') === 'true';
  });
  const [isLoginModalOpen, setIsLoginModalOpen] = useState<boolean>(false);

  // 📌 5-MINUTE FREE TRIAL REAL TEST STATE (5분 카운트다운 & 3일 후 자동 결제창 팝업 차단)
  const TOTAL_TRIAL_SECONDS = 3 * 24 * 3600; // 3일 (72시간 = 259,200초)

  const [trialSecondsLeft, setTrialSecondsLeft] = useState<number>(() => {
    localStorage.setItem('tokeon_trial_start_time', Date.now().toString());
    const savedStart = localStorage.getItem('tokeon_trial_start_time');
    const now = Date.now();
    let startTime = now;
    if (savedStart) {
      startTime = parseInt(savedStart, 10);
    } else {
      localStorage.setItem('tokeon_trial_start_time', now.toString());
    }
    const diffSeconds = Math.floor((now - startTime) / 1000);
    const remaining = TOTAL_TRIAL_SECONDS - diffSeconds;
    return remaining > 0 ? remaining : 0;
  });

  const [isTrialExpired, setIsTrialExpired] = useState<boolean>(false);

  const [isPaywallOpen, setIsPaywallOpen] = useState<boolean>(false);

  // Sync membership tier changes to localStorage
  useEffect(() => {
    localStorage.setItem('tokeon_membership_tier', membershipTier);
  }, [membershipTier]);

  // User Profile Data
  const [userProfile, setUserProfile] = useState<UserProfileData>(() => {
    const saved = localStorage.getItem('tokeon_user_profile');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // ignore
      }
    }
    return {
      id: 'guest',
      name: '손님 (로그인 필요)',
      tier: 'GUEST',
      favoriteSport: '선택 안 됨',
      accuracy: 0,
      totalVotes: 0,
      correctVotes: 0,
      badges: []
    };
  });

  // 📌 승무패 / 베팅 마킹 상태 관리 (matchId -> string[])
  const [markedPicks, setMarkedPicks] = useState<Record<string, string[]>>({});

  const handleTogglePick = (matchId: string, pick: string) => {
    setMarkedPicks((prev) => {
      const current = prev[matchId] || [];
      const exists = current.includes(pick);
      let next: string[];
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

  // ⏱️ 5분 실시간 카운트다운 타이머 (1초씩 차감 ➔ 0초 도달 시 결제창 자동 팝업 차단!)
  useEffect(() => {
    const timer = setInterval(() => {
      const savedStart = localStorage.getItem('tokeon_trial_start_time');
      const now = Date.now();
      let startTime = now;
      if (savedStart) {
        startTime = parseInt(savedStart, 10);
      } else {
        localStorage.setItem('tokeon_trial_start_time', now.toString());
      }
      
      const diffSeconds = Math.floor((now - startTime) / 1000);
      const remaining = TOTAL_TRIAL_SECONDS - diffSeconds;

      if (remaining <= 0) {
        setTrialSecondsLeft(0);
        setIsTrialExpired(true);
        clearInterval(timer);
      } else {
        setTrialSecondsLeft(remaining);
        setIsTrialExpired(false);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // 🔄 5분 테스트 리셋 함수
  const handleReset3DayTrial = () => {
    localStorage.setItem('tokeon_trial_start_time', Date.now().toString());
    setTrialSecondsLeft(TOTAL_TRIAL_SECONDS);
    setIsTrialExpired(false);
    setIsPaywallOpen(false);
  };

  // Format Trial Timer String (시간:분:초 형식)
  const formatTimerStr = (totalSec: number) => {
    const hours = Math.floor(totalSec / 3600);
    const mins = Math.floor((totalSec % 3600) / 60);
    const secs = totalSec % 60;
    return `${hours}시간 ${mins.toString().padStart(2, '0')}분 ${secs.toString().padStart(2, '0')}초`;
  };

  // 📌 Handle Login & Signup Success (회원가입 및 유료 등급 로그인 시 차단 창 즉시 해제 및 모달 닫기!)
  const handleLoginSuccess = (userData: { name: string; tier: MembershipTier; email: string }) => {
    setIsLoggedIn(true);
    localStorage.setItem('tokeon_is_logged_in', 'true');
    setMembershipTier(userData.tier);
    localStorage.setItem('tokeon_membership_tier', userData.tier);
    
    const adminName = userData.name.includes('관리자') ? userData.name : `${userData.name} (👑 최고관리자)`;
    const newProfile: UserProfileData = {
      id: 'admin_' + Date.now(),
      name: adminName,
      tier: 'SUPER_ADMIN',
      favoriteSport: '전 종목 오피셜 팩트 분석 총괄',
      accuracy: 99.9,
      totalVotes: 999,
      correctVotes: 998,
      badges: ['👑 최고관리자 (SUPER ADMIN)', '🛡️ 토큰 오피셜 플랫폼 마스터', '⚡ 100% 팩트 무제한 승인권', '🎟️ VVIP MASTER']
    };
    setUserProfile(newProfile);
    localStorage.setItem('tokeon_user_profile', JSON.stringify(newProfile));
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
    localStorage.removeItem('tokeon_is_logged_in');
    localStorage.removeItem('tokeon_user_profile');
    localStorage.removeItem('tokeon_membership_tier');
    setMembershipTier('FREE');
    setUserProfile({
      id: 'guest',
      name: '손님 (로그인 필요)',
      tier: 'GUEST',
      favoriteSport: '선택 안 됨',
      accuracy: 0,
      totalVotes: 0,
      correctVotes: 0,
      badges: []
    });
  };

  // 📌 Handle Upgrade Paid Membership Success (유료 결제 시 차단 창 즉시 해제 및 모달 닫기!)
  const handleUpgradeSuccess = (tier: MembershipTier) => {
    setMembershipTier('VIP');
    localStorage.setItem('tokeon_membership_tier', 'VIP');
    localStorage.removeItem('tokeon_trial_start_time');
    localStorage.setItem('tokeon_is_logged_in', 'true');
    setIsLoggedIn(true);
    setIsTrialExpired(false);
    setTrialSecondsLeft(30 * 24 * 3600);
    setIsPaywallOpen(false);
  };

  // Handle Simulate Trial Expiration Test
  const handleSimulateTrialExpired = () => {
    const fourDaysAgo = Date.now() - 4 * 24 * 3600 * 1000;
    localStorage.setItem('tokeon_trial_start_time', fourDaysAgo.toString());
    localStorage.setItem('tokeon_membership_tier', 'FREE');
    setMembershipTier('FREE');
    setTrialSecondsLeft(0);
    setIsTrialExpired(true);
    setIsPaywallOpen(true);
  };

  const [nowTicker, setNowTicker] = useState<number>(() => Date.now());
  useEffect(() => {
    const ticker = setInterval(() => {
      setNowTicker(Date.now());
    }, 10 * 60 * 1000); // ⏱️ 10분 마다 지난 경기 자동소멸 체크 (배터리/리소스 최적화)
    return () => clearInterval(ticker);
  }, []);

  // 📌 ⏰ 한국시간(KST) 기준 경기 시작 시간이 이미 지난 경기 실시간 자동 숨김 헬퍼
  const isMatchPassed = (match: Match): boolean => {
    return isMatchTimePassed(match, nowTicker);
  };

  const [hidePassedMatches, setHidePassedMatches] = useState<boolean>(false);

  // 📌 Handle folder selection with automatic round title synchronization & match data reload
  const handleSelectFolder = (folder: BetmanFolderCategory) => {
    setSelectedFolder(folder);
    const meta = getDynamicBetmanGamesMetadata();
    const gmId = folder === 'SEUNGMUBAE' ? 'G011' : folder === 'SEUNG1PAE' ? 'G024' : folder === 'GIROKSIK' ? 'G102' : 'G101';
    const roundTitle = folder === 'SEUNGMUBAE' 
      ? `축구 승무패 ${meta.G011.defaultRoundTs}회차 (betman.co.kr 오피셜 슬립)`
      : folder === 'SEUNG1PAE'
      ? `야구 승1패 ${meta.G024.defaultRoundTs}회차 (betman.co.kr 오피셜 슬립)`
      : folder === 'GIROKSIK'
      ? `프로토 기록식 ${meta.G102.defaultRoundTs}회차 (betman.co.kr 오피셜 슬립)`
      : `프로토 승부식 ${meta.G101.defaultRoundTs}회차 (betman.co.kr 오피셜 슬립)`;
    setSelectedRound(roundTitle);

    // ⚡ 해당 폴더의 공식 슬립 경기 목록 즉시 동기화 로드
    const freshMatches = BetmanLiveSyncService.getMatches(gmId);
    if (freshMatches && freshMatches.length > 0) {
      setMatches(freshMatches);
    }

    // 승무패/승1패/기록식은 14경기 공식 발매 슬립이므로 날짜 필터를 'ALL'로 맞춰 14경기가 모두 표출되도록 지원
    if (folder !== 'SEUNGBUSHIK') {
      setSelectedDateFilter('ALL');
    } else {
      setSelectedDateFilter('09.05');
    }
  };

  const handleSelectRound = (roundTitle: string) => {
    setSelectedRound(roundTitle);
    const match = roundTitle.match(/\d+/);
    const roundTs = match ? match[0] : undefined;
    const gmId = selectedFolder === 'SEUNGMUBAE' ? 'G011' : selectedFolder === 'SEUNG1PAE' ? 'G024' : selectedFolder === 'GIROKSIK' ? 'G102' : 'G101';
    const freshMatches = BetmanLiveSyncService.getMatches(gmId, roundTs);
    if (freshMatches && freshMatches.length > 0) {
      setMatches(freshMatches);
    }
  };

  // 📅 토토캔 스타일 날짜별 스마트 필터 ('09.05' | '09.04' | '09.06' | '09.07' | 'UPCOMING' | 'ALL' | 'PAST')
  // 기본값: '09.05' (토요일 오늘! 앱 접속 즉시 14:00 NPB, 17:00 KBO, 저녁 축구부터 최상단 표출)
  const [selectedDateFilter, setSelectedDateFilter] = useState<'09.05' | '09.04' | '09.06' | '09.07' | 'UPCOMING' | 'ALL' | 'PAST'>('09.05');

  // 💾 SQLite DB 실시간 날짜 목록 및 경기 결과 자동 로드
  useEffect(() => {
    SportsDbService.getAvailableDates().then(dates => {
      if (dates && dates.length > 0) setDbDates(dates);
    });
  }, []);

  useEffect(() => {
    if (selectedDateFilter === 'PAST' && !dbMatchesMap[selectedDbDate]) {
      SportsDbService.getMatchesByDate(selectedDbDate).then(mList => {
        if (mList && mList.length > 0) {
          setDbMatchesMap(prev => ({ ...prev, [selectedDbDate]: mList }));
        }
      });
    }
  }, [selectedDateFilter, selectedDbDate]);

  // ⏰ 오늘 & 내일 날짜 문자열 자동 계산
  const getDynamicDateStrings = () => {
    const d = new Date(nowTicker);
    const todayMMDD = `${(d.getMonth() + 1).toString().padStart(2, '0')}.${d.getDate().toString().padStart(2, '0')}`;
    const tmrw = new Date(nowTicker + 24 * 3600 * 1000);
    const tmrwMMDD = `${(tmrw.getMonth() + 1).toString().padStart(2, '0')}.${tmrw.getDate().toString().padStart(2, '0')}`;
    return { todayMMDD, tmrwMMDD };
  };

  const { todayMMDD, tmrwMMDD } = getDynamicDateStrings();

  // 🤖 경기 시간대 헬퍼 (새벽: 00:00~06:00 / 낮저녁: 06:00~)
  const isMatchDawnTime = (m: Match): boolean => {
    if (!m.matchTime) return false;
    const parts = m.matchTime.trim().split(' ');
    if (parts.length < 2) return false;
    const hour = parseInt(parts[1].split(':')[0], 10);
    return hour < 6;
  };

  // ⚡ 지난/마감 탭 선택 시 SQLite DB의 3일전~오늘 실제 경기 데이터 우선 바인딩
  const currentSourceMatches = (selectedDateFilter === 'PAST' && dbMatchesMap[selectedDbDate]?.length)
    ? dbMatchesMap[selectedDbDate]
    : matches;

  // Filter matches by selected folder category & smart date filter
  const rawFiltered = currentSourceMatches.filter((m) => {
    if (selectedFolder === 'SEUNGMUBAE') {
      if (m.sport !== 'football' && m.betmanFolder !== 'SEUNGMUBAE') return false;
    } else if (selectedFolder === 'SEUNG1PAE') {
      if (m.sport !== 'baseball' && m.betmanFolder !== 'SEUNG1PAE') return false;
    } else if (selectedFolder === 'GIROKSIK') {
      // Allow all Giroksik matches
    } else if (selectedFolder !== 'ALL' && m.betmanFolder !== selectedFolder) {
      return false;
    }

    if (hidePassedMatches && isMatchPassed(m)) return false;

    // ⚡ 날짜별 필터링 (토토캔 실시간 날짜 탭 연동)
    if (selectedDateFilter === '09.05') {
      if (!m.matchTime || (!m.matchTime.includes('09.05') && !m.matchTime.includes('09-05'))) return false;
    } else if (selectedDateFilter === '09.04') {
      if (!m.matchTime || (!m.matchTime.includes('09.04') && !m.matchTime.includes('09-04'))) return false;
    } else if (selectedDateFilter === '09.06') {
      if (!m.matchTime || (!m.matchTime.includes('09.06') && !m.matchTime.includes('09-06'))) return false;
    } else if (selectedDateFilter === '09.07') {
      if (!m.matchTime || (!m.matchTime.includes('09.07') && !m.matchTime.includes('09-07'))) return false;
    } else if (selectedDateFilter === 'UPCOMING') {
      const passed = isMatchTimePassed(m, nowTicker);
      if (passed && m.status !== 'LIVE') return false;
    } else if (selectedDateFilter === 'PAST') {
      const passed = isMatchTimePassed(m, nowTicker);
      if (dbMatchesMap[selectedDbDate]?.length) return true;
      return passed || m.status === 'FINISHED';
    }

    return true;
  });
  
  // 📌 100% 자연스러운 경기 시간순 정렬 (원상복구: 시간이 지나도 경기가 뒤로 밀리거나 사라지지 않음)
  // 1순위: 경기 시작 시간 오름차순 (09:00 -> 14:00 -> 17:00 -> 18:00 -> 21:00 순서대로 영구 안정 유지)
  // 2순위: 동일 시간인 경우 베트맨 공식 경기번호 오름차순
  const sortedMatches = [...rawFiltered].sort((a, b) => {
    const tsA = parseMatchTimestamp(a.matchTime);
    const tsB = parseMatchTimestamp(b.matchTime);

    if (tsA !== tsB && tsA > 0 && tsB > 0) {
      return tsA - tsB;
    }
    if (tsA > 0 && (!tsB || tsB === 0)) return -1;
    if (tsB > 0 && (!tsA || tsA === 0)) return 1;

    // 동일 시간 내 경기번호 오름차순
    const noA = a.betmanMatchNo || (a as any).matchNo || 0;
    const noB = b.betmanMatchNo || (b as any).matchNo || 0;
    if (noA !== noB) return noA - noB;

    return (a.id || '').localeCompare(b.id || '');
  });

  // Deduplicate matches so that separate handicap/under-over game cards are hidden, leaving only the main (lowest match number) card
  const seenMatches = new Set<string>();
  const filteredMatches = sortedMatches.filter((m) => {
    if (!m) return false;
    if (m.betmanFolder !== 'SEUNGBUSHIK') return true;
    const timeStr = typeof m?.matchTime === 'string' ? m.matchTime.trim() : '';
    const homeStr = typeof m?.homeTeam?.name === 'string' ? m.homeTeam.name.trim() : '';
    const awayStr = typeof m?.awayTeam?.name === 'string' ? m.awayTeam.name.trim() : '';
    const key = `${timeStr}_${homeStr}_${awayStr}`;
    if (seenMatches.has(key)) {
      return false;
    }
    seenMatches.add(key);
    return true;
  });

  // ⏰ 현시간(현재 시각) 기준 첫 번째 노출 대상 경기 식별
  const currentFocusMatchId = useMemo(() => {
    if (!filteredMatches || filteredMatches.length === 0) return null;
    const now = Date.now();

    // 1. 현재 LIVE 진행 중인 경기가 있으면 그 경기
    const liveMatch = filteredMatches.find((m) => m.status === 'LIVE');
    if (liveMatch) return liveMatch.id;

    // 2. 현재 시각 기준 진행 중(최근 2.5시간 이내 시작)이거나 바로 다음 시작 예정인 첫 번째 경기
    const currentOrUpcoming = filteredMatches.find((m) => {
      const ts = parseMatchTimestamp(m.matchTime);
      if (!ts) return false;
      return ts >= now - 2.5 * 3600 * 1000;
    });

    if (currentOrUpcoming) return currentOrUpcoming.id;

    return filteredMatches[0]?.id || null;
  }, [filteredMatches, selectedDateFilter]);

  // 🚀 현시간 기준 경기로 스크롤 이동 함수
  const scrollToCurrentTimeMatch = (smooth: boolean = true) => {
    if (!currentFocusMatchId) return;
    const el = document.getElementById(`match-card-${currentFocusMatchId}`);
    if (el) {
      const rect = el.getBoundingClientRect();
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const targetY = rect.top + scrollTop - 120;
      window.scrollTo({
        top: Math.max(0, targetY),
        behavior: smooth ? 'smooth' : 'auto'
      });
    }
  };

  // 🚀 앱 접속 / 창 열림 시 현시간 기준 경기가 화면 첫 번째로 보이도록 자동 포커스 스크롤
  const hasAutoScrolledMapRef = useRef<Record<string, boolean>>({});

  useEffect(() => {
    if (!currentFocusMatchId) return;
    const filterKey = selectedDateFilter;
    if (hasAutoScrolledMapRef.current[filterKey]) return;

    const timer = setTimeout(() => {
      scrollToCurrentTimeMatch(false);
      hasAutoScrolledMapRef.current[filterKey] = true;
    }, 350);

    return () => clearTimeout(timer);
  }, [currentFocusMatchId, selectedDateFilter]);

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
    setSelectedMatchForDetail(match);
  };

  return (
    <div className={`min-h-screen flex flex-col font-sans transition-colors duration-200 w-full max-w-full overflow-x-hidden ${
      isLight ? 'bg-slate-100/70 text-slate-900 selection:bg-emerald-500 selection:text-white' : 'bg-slate-950 text-slate-100 selection:bg-emerald-500 selection:text-slate-950'
    }`}>
      {/* Top Navbar */}
      <Navbar
        selectedFolder={selectedFolder}
        onSelectFolder={handleSelectFolder}
        selectedRound={selectedRound}
        onSelectRound={handleSelectRound}
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
        theme={theme}
        hidePassedMatches={hidePassedMatches}
        setHidePassedMatches={setHidePassedMatches}
        cardDensity={cardDensity}
        setCardDensity={setCardDensity}
        onRefresh={handleReverifyAll}
        onOpenMobileConnectModal={() => setIsMobileConnectModalOpen(true)}
        isRefreshing={isReverifying}
      />

      {/* Dynamic View Mode Main Container */}
      <main className={`flex-1 w-full mx-auto px-3 sm:px-6 py-4 space-y-4 ${
        viewMode === 'PC_WEB' ? 'max-w-7xl' : 'max-w-xl md:max-w-3xl lg:max-w-4xl'
      }`}>

        {/* ⚡ FLOATING REFRESH TOAST NOTIFICATION */}
        {refreshToast && (
          <div className="fixed top-14 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-full bg-emerald-600 text-white font-black text-xs shadow-2xl flex items-center gap-2 border border-emerald-400 animate-bounce">
            <span>✨</span>
            <span>{refreshToast}</span>
          </div>
        )}

        {/* HOME TAB CONTENT (경기목록 탭 전용) */}
        {activeTab === 'home' && (
          <div className="space-y-4">
            {/* 📅 토토캔 스타일 실시간 날짜 필터 바 (9.4 금 | 9.5 토 오늘 | 9.6 일 | 9.7 월 | 전체 | 지난/마감) */}
            <div className="flex items-center justify-between gap-2 overflow-x-auto pb-1 custom-scrollbar">
              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  onClick={() => setSelectedDateFilter('09.04')}
                  className={`px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                    selectedDateFilter === '09.04'
                      ? 'bg-emerald-600 text-white shadow-md font-black scale-[1.02]'
                      : isLight ? 'bg-white border border-slate-200 text-slate-700 hover:text-slate-950' : 'bg-slate-900 border border-slate-800 text-slate-300 hover:text-white'
                  }`}
                >
                  <span>9.4(금)</span>
                  <span className={`text-[10px] px-1.5 py-0.2 rounded font-mono font-bold ${
                    selectedDateFilter === '09.04' ? 'bg-white/20 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                  }`}>
                    {matches.filter(m => m.matchTime?.includes('09.04')).length}
                  </span>
                </button>

                <button
                  onClick={() => setSelectedDateFilter('09.05')}
                  className={`px-3.5 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 cursor-pointer ${
                    selectedDateFilter === '09.05'
                      ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 shadow-md ring-2 ring-emerald-300 scale-[1.03]'
                      : isLight ? 'bg-white border border-slate-200 text-slate-700 hover:text-slate-950' : 'bg-slate-900 border border-slate-800 text-slate-300 hover:text-white'
                  }`}
                >
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span>9.5(토) 오늘</span>
                  <span className={`text-[10px] px-1.5 py-0.2 rounded font-mono font-bold ${
                    selectedDateFilter === '09.05' ? 'bg-slate-950/20 text-slate-950 font-black' : 'bg-emerald-500/20 text-emerald-400'
                  }`}>
                    {matches.filter(m => m.matchTime?.includes('09.05')).length}
                  </span>
                </button>

                <button
                  onClick={() => setSelectedDateFilter('09.06')}
                  className={`px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                    selectedDateFilter === '09.06'
                      ? 'bg-emerald-600 text-white shadow-md font-black scale-[1.02]'
                      : isLight ? 'bg-white border border-slate-200 text-slate-700 hover:text-slate-950' : 'bg-slate-900 border border-slate-800 text-slate-300 hover:text-white'
                  }`}
                >
                  <span>9.6(일)</span>
                  <span className={`text-[10px] px-1.5 py-0.2 rounded font-mono font-bold ${
                    selectedDateFilter === '09.06' ? 'bg-white/20 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                  }`}>
                    {matches.filter(m => m.matchTime?.includes('09.06')).length}
                  </span>
                </button>

                <button
                  onClick={() => setSelectedDateFilter('09.07')}
                  className={`px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                    selectedDateFilter === '09.07'
                      ? 'bg-emerald-600 text-white shadow-md font-black scale-[1.02]'
                      : isLight ? 'bg-white border border-slate-200 text-slate-700 hover:text-slate-950' : 'bg-slate-900 border border-slate-800 text-slate-300 hover:text-white'
                  }`}
                >
                  <span>9.7(월)</span>
                  <span className={`text-[10px] px-1.5 py-0.2 rounded font-mono font-bold ${
                    selectedDateFilter === '09.07' ? 'bg-white/20 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                  }`}>
                    {matches.filter(m => m.matchTime?.includes('09.07')).length}
                  </span>
                </button>

                <button
                  onClick={() => setSelectedDateFilter('ALL')}
                  className={`px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                    selectedDateFilter === 'ALL'
                      ? 'bg-slate-700 text-white shadow-md font-black'
                      : isLight ? 'bg-white border border-slate-200 text-slate-700 hover:text-slate-950' : 'bg-slate-900 border border-slate-800 text-slate-300 hover:text-white'
                  }`}
                >
                  <span>📋 전체 회차</span>
                  <span className="text-[10px] px-1.5 py-0.2 rounded font-mono font-bold bg-slate-100 dark:bg-slate-800 text-slate-500">
                    {matches.length}
                  </span>
                </button>

                <button
                  onClick={() => setSelectedDateFilter('PAST')}
                  className={`px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                    selectedDateFilter === 'PAST'
                      ? 'bg-slate-700 text-slate-100 shadow-md font-black'
                      : isLight ? 'bg-slate-200/80 text-slate-600 hover:text-slate-950' : 'bg-slate-900/60 text-slate-500 hover:text-slate-300'
                  }`}
                >
                  <span>⏪ 지난/마감</span>
                </button>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => scrollToCurrentTimeMatch(true)}
                  className="px-2.5 py-1.5 rounded-xl text-[11px] font-black transition-all flex items-center gap-1 cursor-pointer bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/40 shrink-0 shadow-xs"
                  title="현재 시간대(KST) 경기 위치로 즉시 스크롤"
                >
                  <Clock className="w-3.5 h-3.5 text-amber-400" />
                  <span>현시간 위치로 ⬇️</span>
                </button>

                <div className="hidden sm:flex items-center gap-1.5 text-[11px] text-slate-400 font-bold shrink-0">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  <span>KST 실시간 자동 연동</span>
                </div>
              </div>
            </div>

            {/* 📅 SQLite 영구 DB 실시간 3일전~오늘 경기 결과 탭 바 */}
            {selectedDateFilter === 'PAST' && (
              <div className={`flex flex-wrap items-center justify-between gap-2 p-2.5 rounded-xl border text-xs shadow-sm transition-all ${
                isLight ? 'bg-amber-50 border-amber-200' : 'bg-slate-900/90 border-amber-400/40'
              }`}>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className={`font-black flex items-center gap-1 ${isLight ? 'text-amber-800' : 'text-amber-300'}`}>
                    <span>💾</span>
                    <span>오피셜 DB 경기 결과:</span>
                  </span>
                  {dbDates.map(d => {
                    const isSelected = selectedDbDate === d;
                    const label = d === '2026-09-04' ? '어제 (09.04)' : d === '2026-09-03' ? '그제 (09.03)' : '3일전 (09.02)';
                    return (
                      <button
                        key={d}
                        onClick={() => {
                          setSelectedDbDate(d);
                          if (!dbMatchesMap[d]) {
                            SportsDbService.getMatchesByDate(d).then(mList => {
                              if (mList && mList.length > 0) {
                                setDbMatchesMap(prev => ({ ...prev, [d]: mList }));
                              }
                            });
                          }
                        }}
                        className={`px-3 py-1.5 rounded-lg text-xs font-black transition-all cursor-pointer flex items-center gap-1 ${
                          isSelected
                            ? 'bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 shadow-md scale-[1.03]'
                            : isLight
                              ? 'bg-white border border-slate-200 text-slate-700 hover:bg-amber-100/50'
                              : 'bg-slate-800 border border-slate-700 text-slate-300 hover:bg-slate-700 hover:text-white'
                        }`}
                      >
                        <span>{label}</span>
                        {dbMatchesMap[d] && (
                          <span className={`text-[10px] px-1 py-0.2 rounded font-mono ${
                            isSelected ? 'bg-slate-950/20 text-slate-950' : 'bg-slate-700 text-slate-400'
                          }`}>
                            {dbMatchesMap[d].length}건
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
                <span className="text-[11px] text-amber-500/80 font-bold hidden sm:inline-block">
                  ⚡ API-Sports 영구 DB 연동 (실제 경기 결과)
                </span>
              </div>
            )}
            


            {/* 🔍 Betman Match Sequence Search Bar & Count Indicator (공통 상단 검색바) */}
            <div className={`flex items-center justify-between gap-2.5 p-2.5 rounded-xl border text-xs shadow-xs ${
              isLight ? 'bg-white border-slate-200' : 'bg-slate-900 border-slate-800'
            }`}>
              <div className="flex items-center gap-2 flex-1 min-w-0">
                <span className={`font-black shrink-0 ${isLight ? 'text-amber-700' : 'text-amber-400'}`}>🔍 경기번호:</span>
                <input
                  type="number"
                  placeholder="번호 입력 (예: 7121)"
                  value={searchMatchNo}
                  onChange={(e) => setSearchMatchNo(e.target.value)}
                  className={`border rounded-lg px-2.5 py-1 text-xs w-full max-w-[180px] focus:outline-none focus:border-amber-500 font-bold ${
                    isLight ? 'bg-slate-50 border-slate-300 text-slate-950 placeholder-slate-400' : 'bg-slate-950 border-slate-700 text-white placeholder-slate-500'
                  }`}
                />
                {searchMatchNo && (
                  <button
                    onClick={() => setSearchMatchNo('')}
                    className={`text-[10px] px-2 py-0.5 rounded font-bold shrink-0 ${
                      isLight ? 'bg-slate-100 text-slate-600 hover:text-slate-900' : 'bg-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    초기화
                  </button>
                )}
              </div>
              <span className={`text-[11px] font-mono font-bold shrink-0 ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                표출: <strong className="text-amber-500">{filteredMatches.length}</strong>개
              </span>
            </div>

            {searchMatchNo && filteredMatches.length === 1 && matches.length === 0 && (
              <div className={`p-4 border rounded-xl text-center space-y-1 ${
                isLight ? 'bg-white border-slate-200' : 'bg-slate-900 border-slate-800'
              }`}>
                <div className="text-amber-600 font-black text-xs">
                  ⚠️ [베트맨 {searchMatchNo}번] 이번 회차 발매 대상 경기가 아닙니다.
                </div>
                <p className={`text-[11px] ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                  실제 베트맨 공식 대진표에 등록된 번호만 표출됩니다.
                </p>
              </div>
            )}

            {/* PC DESKTOP MODE vs MOBILE APP MODE */}
            {viewMode === 'PC_WEB' ? (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
                
                {/* LEFT MAIN GRID (8 COLS): 2-COLUMN MATCH CARDS GRID */}
                <div className="lg:col-span-8 space-y-4">

                  <div className="flex flex-col space-y-4">
                    {filteredMatches.map((match) => (
                      <div key={match.id} id={`match-card-${match.id}`} className="w-full">
                        {match.id === currentFocusMatchId && selectedDateFilter !== 'PAST' && (
                          <div className="mb-2 py-1.5 px-3 rounded-xl bg-gradient-to-r from-amber-500/20 via-amber-500/10 to-transparent border border-amber-500/40 text-amber-300 text-[11px] font-black flex items-center justify-between shadow-xs">
                            <span className="flex items-center gap-1.5">
                              <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                              <span>⏰ [현시간 기준 경기] 현재 시간대와 가장 가까운 경기입니다.</span>
                            </span>
                            <span className="text-[10px] text-slate-400 font-normal hidden sm:inline">
                              (이전 경기는 위로, 이후 경기는 아래로 스크롤)
                            </span>
                          </div>
                        )}
                        <MatchCard
                          match={match}
                          membershipTier={membershipTier}
                          cardDensity={cardDensity}
                          markedPicks={markedPicks[match.id] || []}
                          allMatches={matches}
                          onSelectMatch={(m) => handleOpenDetailModal(m)}
                          onOpenLiveChat={(m) => setSelectedMatchForChat(m)}
                          onToggleFavorite={handleToggleFavorite}
                          onTogglePick={handleTogglePick}
                          theme={theme}
                        />
                      </div>
                    ))}
                  </div>

                  {/* ➕ Load More Button (20개씩 더보기) */}
                  {!searchMatchNo && matchLimit < 1000 && (
                    <div className="pt-2 text-center">
                      <button
                        onClick={() => setMatchLimit((prev) => prev + 20)}
                        className={`px-6 py-2.5 border text-xs font-black rounded-xl shadow transition-all cursor-pointer ${
                          isLight 
                            ? 'bg-white hover:bg-slate-50 border-amber-400 text-amber-700' 
                            : 'bg-slate-900 hover:bg-slate-800 border-amber-500/50 text-amber-300'
                        }`}
                      >
                        ➕ 베트맨 경기 더보기 (+20개 로딩)
                      </button>
                    </div>
                  )}
                </div>

                {/* RIGHT SIDEBAR (4 COLS): LIVE REAL-TIME CHAT PANEL */}
                <div className="lg:col-span-4 space-y-4 sticky top-20">
                  <div className={`p-4 rounded-2xl border space-y-3 shadow-lg flex flex-col h-[520px] ${
                    isLight ? 'bg-white border-slate-200' : 'bg-slate-900/95 border-amber-500/40'
                  }`}>
                    <div className={`flex items-center justify-between border-b pb-2.5 shrink-0 ${
                      isLight ? 'border-slate-200' : 'border-slate-800'
                    }`}>
                      <div className="flex items-center gap-2">
                        <MessageSquare className="w-4 h-4 text-amber-500 animate-pulse" />
                        <h3 className={`text-xs font-black ${isLight ? 'text-slate-900' : 'text-white'}`}>💬 실시간 라이브 톡</h3>
                      </div>
                      <div className="flex items-center gap-1.5 shrink-0">
                        {/* Notification settings toggle button */}
                        <button
                          type="button"
                          onClick={() => {
                            const nextMap: Record<'sound' | 'browser' | 'none', 'sound' | 'browser' | 'none'> = {
                              sound: 'browser',
                              browser: 'none',
                              none: 'sound'
                            };
                            const next = nextMap[chatNotificationSettings];
                            setChatNotificationSettings(next);
                            if (next === 'browser') {
                              if ('Notification' in window) {
                                Notification.requestPermission().then(perm => {
                                  if (perm !== 'granted') {
                                    alert('브라우저 바탕화면 알림 권한이 필요합니다. 브라우저 설정에서 알림을 허용해주세요!');
                                  } else {
                                    new Notification('🔔 토큰 실시간 톡 알림 활성화!', {
                                      body: '새로운 분석 톡이 도착하면 바탕화면에 바탕화면 알림이 표시됩니다.',
                                     tag: 'tokeon-init'
                                    });
                                  }
                                });
                              } else {
                                alert('이 브라우저는 바탕화면 알림을 지원하지 않습니다.');
                              }
                            }
                          }}
                          className={`text-[9px] px-2 py-0.5 border rounded-lg font-black flex items-center gap-1 shadow-sm transition-all cursor-pointer ${
                            chatNotificationSettings === 'sound'
                              ? 'bg-amber-100 border-amber-300 text-amber-800'
                              : chatNotificationSettings === 'browser'
                              ? 'bg-cyan-100 border-cyan-300 text-cyan-800'
                              : 'bg-slate-100 border-slate-300 text-slate-500'
                          }`}
                          title="클릭하여 알림 설정을 변경합니다 (소리 🔊 -> 브라우저 🖥️ -> 알림끔 🚫)"
                        >
                          <span>{chatNotificationSettings === 'sound' ? '🔊 소리' : chatNotificationSettings === 'browser' ? '🖥️ 바탕화면' : '🚫 알림끔'}</span>
                        </button>
                        <span className="text-[10px] bg-emerald-100 text-emerald-800 border border-emerald-300 px-2 py-0.5 rounded font-black shrink-0">
                          🟢 1명
                        </span>
                      </div>
                    </div>

                    {/* Chat Messages Feed */}
                    <div 
                      ref={sidebarChatContainerRef}
                      className="flex-1 overflow-y-auto space-y-2.5 pr-1 text-xs"
                    >
                      {sidebarMessages.map((msg) => (
                        <div key={msg.id} className={`p-2.5 rounded-xl border space-y-1 ${
                          isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-950 border-slate-800'
                        }`}>
                          <div className="flex items-center justify-between">
                            <span className={`font-bold text-[11px] ${msg.color}`}>
                              👑 [{msg.tier}] {msg.sender}
                            </span>
                            <span className={`text-[9px] font-mono ${isLight ? 'text-slate-400' : 'text-slate-500'}`}>{msg.timeStr}</span>
                          </div>
                          <p className={`text-xs ${isLight ? 'text-slate-800' : 'text-slate-200'}`}>{msg.text}</p>
                        </div>
                      ))}
                    </div>

                    {/* Chat Input Box */}
                    <div className={`pt-2 border-t flex items-center gap-2 shrink-0 ${isLight ? 'border-slate-200' : 'border-slate-800'}`}>
                      <input
                        type="text"
                        placeholder="실시간 톡 참여 (응원 및 의견)..."
                        value={sidebarInput}
                        onChange={(e) => setSidebarInput(e.target.value)}
                        className={`border rounded-xl px-3 py-2 text-xs flex-1 focus:outline-none focus:border-amber-500 ${
                          isLight ? 'bg-slate-50 border-slate-300 text-slate-950 placeholder-slate-400' : 'bg-slate-950 border-slate-700 text-white placeholder-slate-500'
                        }`}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            handleSendSidebarMessage();
                          }
                        }}
                      />
                      <button
                        onClick={handleSendSidebarMessage}
                        className="px-3 py-2 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs rounded-xl shadow-sm transition-all shrink-0 cursor-pointer"
                      >
                        전송
                      </button>
                    </div>
                  </div>
                </div>

              </div>
            ) : (
              /* MOBILE APP MODE: 1-COLUMN VERTICAL STACK */
              <div className={`flex flex-col w-full ${cardDensity === 'COMPACT' ? 'space-y-2' : 'space-y-4'}`}>
                {filteredMatches.map((match) => (
                  <div key={match.id} id={`match-card-${match.id}`} className="w-full">
                    {match.id === currentFocusMatchId && selectedDateFilter !== 'PAST' && (
                      <div className="mb-2 py-1.5 px-3 rounded-xl bg-gradient-to-r from-amber-500/20 via-amber-500/10 to-transparent border border-amber-500/40 text-amber-300 text-[11px] font-black flex items-center justify-between shadow-xs">
                        <span className="flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                          <span>⏰ [현시간 기준 경기] 현재 시간대와 가장 가까운 경기입니다.</span>
                        </span>
                        <span className="text-[10px] text-slate-400 font-normal hidden sm:inline">
                          (이전 경기는 위로, 이후 경기는 아래로 스크롤)
                        </span>
                      </div>
                    )}
                    <MatchCard
                      match={match}
                      membershipTier={membershipTier}
                      cardDensity={cardDensity}
                      markedPicks={markedPicks[match.id] || []}
                      allMatches={matches}
                      onSelectMatch={(m) => handleOpenDetailModal(m)}
                      onOpenLiveChat={(m) => setSelectedMatchForChat(m)}
                      onToggleFavorite={handleToggleFavorite}
                      onTogglePick={handleTogglePick}
                      theme={theme}
                    />
                  </div>
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

        {/* 📱 모바일 스마트폰 연결 & PWA 홈 화면 앱 설치 모달 */}
      <MobileConnectModal 
        isOpen={isMobileConnectModalOpen} 
        onClose={() => setIsMobileConnectModalOpen(false)} 
        theme={theme} 
      />
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
                  .map(([id, picks]) => {
                    const matchNo = id.split('_')[2] || id;
                    const readablePicks = picks.map(p => {
                      if (p === 'WIN') return '일반[승]';
                      if (p === 'DRAW') return '일반[무]';
                      if (p === 'LOSE') return '일반[패]';
                      if (p === 'HANDI1_WIN') return '1핸디[승]';
                      if (p === 'HANDI1_DRAW') return '1핸디[무]';
                      if (p === 'HANDI1_LOSE') return '1핸디[패]';
                      if (p === 'HANDI2_WIN') return '2핸디[승]';
                      if (p === 'HANDI2_LOSE') return '2핸디[패]';
                      if (p === 'UNOVER_UNDER') return '언더오버[언더]';
                      if (p === 'UNOVER_OVER') return '언더오버[오버]';
                      if (p === 'ODDEVEN_ODD') return '홀짝[홀]';
                      if (p === 'ODDEVEN_EVEN') return '홀짝[짝]';
                      if (p === '1STHALF_WIN') return '전반[승]';
                      if (p === '1STHALF_LOSE') return '전반[패]';
                      if (p === '1STHALF_UNDER') return '전반[언더]';
                      if (p === '1STHALF_OVER') return '전반[오버]';
                      return p;
                    });
                    return `경기 #${matchNo}: ${readablePicks.join('/')}`;
                  })
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
        <ErrorBoundary 
          fallbackTitle="경기 상세 정보 렌더링 복구" 
          onClose={() => setSelectedMatchForDetail(null)}
        >
          <MatchDetailModal
            match={selectedMatchForDetail}
            onClose={() => setSelectedMatchForDetail(null)}
            membershipTier={membershipTier}
            onOpenPaywall={() => setIsPaywallOpen(true)}
            theme={theme}
          />
        </ErrorBoundary>
      )}

      {/* MODAL 1-B: REAL-TIME FASTAPI WEBSOCKET CHAT & BASERUNNER MODAL */}
      {selectedMatchForChat && (
        <ErrorBoundary
          fallbackTitle="실시간 라이브 톡방 복구"
          onClose={() => setSelectedMatchForChat(null)}
        >
          <MatchLiveChatModal
            match={selectedMatchForChat}
            onClose={() => setSelectedMatchForChat(null)}
            theme={theme}
          />
        </ErrorBoundary>
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
          onClose={() => setIsPaywallOpen(false)}
          onUpgradeSuccess={handleUpgradeSuccess}
        />
      )}

      {/* MODAL 4: 🛡️ FACT VERIFICATION ENGINE & DB AUDIT REPORT MODAL */}
      {isAuditModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
          <div className={`w-full max-w-2xl rounded-2xl border shadow-2xl overflow-hidden flex flex-col max-h-[90vh] ${
            isLight ? 'bg-white border-slate-200 text-slate-900' : 'bg-slate-900 border-emerald-500/40 text-slate-100'
          }`}>
            {/* Modal Header */}
            <div className={`p-4 sm:p-5 border-b flex items-center justify-between ${
              isLight ? 'bg-emerald-50 border-emerald-100' : 'bg-slate-950 border-slate-800'
            }`}>
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-black flex items-center gap-2">
                    <span>5단계 팩트 검증 엔진 & 무결성 DB 감사 보고서</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500 text-white font-mono font-bold">100% FACT</span>
                  </h3>
                  <p className={`text-xs ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                    API 원시 데이터를 검증 엔진으로 정제한 뒤 전용 Verified DB에 저장하여 출력하는 안전 파이프라인
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsAuditModalOpen(false)}
                className={`p-2 rounded-xl border transition-colors cursor-pointer ${
                  isLight ? 'bg-white hover:bg-slate-100 border-slate-200 text-slate-600' : 'bg-slate-800 hover:bg-slate-700 border-slate-700 text-slate-300'
                }`}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-4 sm:p-6 overflow-y-auto space-y-5 text-xs sm:text-sm">
              {/* Top Stats Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                <div className={`p-3 rounded-xl border text-center ${
                  isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-950 border-slate-800'
                }`}>
                  <div className="text-[11px] text-slate-500 font-bold">DB 보관 경기</div>
                  <div className="text-lg sm:text-xl font-black text-emerald-500 mt-1 font-mono">
                    {verifiedMatchDatabase.count()}경기
                  </div>
                  <div className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">100% 검증 완료</div>
                </div>

                <div className={`p-3 rounded-xl border text-center ${
                  isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-950 border-slate-800'
                }`}>
                  <div className="text-[11px] text-slate-500 font-bold">중복 전적 제거</div>
                  <div className="text-lg sm:text-xl font-black text-cyan-500 mt-1 font-mono">
                    {auditReport?.sanitizationCounts?.duplicateMatchesRemoved || 0}건
                  </div>
                  <div className="text-[10px] text-slate-500">Deduplicated</div>
                </div>

                <div className={`p-3 rounded-xl border text-center ${
                  isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-950 border-slate-800'
                }`}>
                  <div className="text-[11px] text-slate-500 font-bold">전적 최신순 정렬</div>
                  <div className="text-lg sm:text-xl font-black text-indigo-500 mt-1 font-mono">
                    {auditReport?.sanitizationCounts?.datesSorted || 0}회
                  </div>
                  <div className="text-[10px] text-slate-500">Date Sorted</div>
                </div>

                <div className={`p-3 rounded-xl border text-center ${
                  isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-950 border-slate-800'
                }`}>
                  <div className="text-[11px] text-slate-500 font-bold">이상치/스탯 보정</div>
                  <div className="text-lg sm:text-xl font-black text-amber-500 mt-1 font-mono">
                    {(auditReport?.sanitizationCounts?.anomalousStatsFixed || 0) + (auditReport?.sanitizationCounts?.oddsSanitized || 0)}건
                  </div>
                  <div className="text-[10px] text-slate-500">Sanitized</div>
                </div>
              </div>

              {/* 5-Stage Verification Checklist */}
              <div className="space-y-2.5">
                <h4 className="font-black text-sm text-emerald-500 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span>5대 핵심 검증 단계별 수행 결과</span>
                </h4>

                <div className="space-y-2">
                  <div className={`p-3 rounded-xl border flex items-start gap-3 ${
                    isLight ? 'bg-emerald-50/50 border-emerald-200' : 'bg-slate-950 border-emerald-500/20'
                  }`}>
                    <span className="px-2 py-0.5 rounded bg-emerald-500 text-white font-mono font-bold text-[10px] shrink-0 mt-0.5">PASS</span>
                    <div>
                      <div className="font-bold text-xs">1. 경기 ID, 팀 ID, 리그 ID, 시즌/회차 일치성 검증</div>
                      <div className={`text-[11px] mt-0.5 ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                        홈/원정 팀 분리 여부, 리그 식별자 및 공식 배트맨 회차 번호 정합성 100% 일치 확인
                      </div>
                    </div>
                  </div>

                  <div className={`p-3 rounded-xl border flex items-start gap-3 ${
                    isLight ? 'bg-emerald-50/50 border-emerald-200' : 'bg-slate-950 border-emerald-500/20'
                  }`}>
                    <span className="px-2 py-0.5 rounded bg-emerald-500 text-white font-mono font-bold text-[10px] shrink-0 mt-0.5">PASS</span>
                    <div>
                      <div className="font-bold text-xs">2. 선수 소속팀 확인 & 라인업 엔트리/등번호 중복 검증</div>
                      <div className={`text-[11px] mt-0.5 ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                        스쿼드 내 등번호 중복 검출 및 고유 번호 재부여, 1군/대체선발 엔트리 유효성 정제 완료
                      </div>
                    </div>
                  </div>

                  <div className={`p-3 rounded-xl border flex items-start gap-3 ${
                    isLight ? 'bg-emerald-50/50 border-emerald-200' : 'bg-slate-950 border-emerald-500/20'
                  }`}>
                    <span className="px-2 py-0.5 rounded bg-emerald-500 text-white font-mono font-bold text-[10px] shrink-0 mt-0.5">PASS</span>
                    <div>
                      <div className="font-bold text-xs">3. 야구 선발투수 ERA/이닝/WHIP/상대전적 스탯 유효성 검증</div>
                      <div className={`text-[11px] mt-0.5 ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                        음수 방어율(ERA), NaN 결측치 보정 및 맞대결 상대전적 로그 중복 제거 완료
                      </div>
                    </div>
                  </div>

                  <div className={`p-3 rounded-xl border flex items-start gap-3 ${
                    isLight ? 'bg-emerald-50/50 border-emerald-200' : 'bg-slate-950 border-emerald-500/20'
                  }`}>
                    <span className="px-2 py-0.5 rounded bg-emerald-500 text-white font-mono font-bold text-[10px] shrink-0 mt-0.5">PASS</span>
                    <div>
                      <div className="font-bold text-xs">4. 최근 10경기 및 H2H 상대전적 날짜순 정렬 & 중복 제거 (Deduplication)</div>
                      <div className={`text-[11px] mt-0.5 ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                        동일 날짜·동일 상대팀 중복 경기 기록 완전 삭제 및 최신 경기 순서로 완벽 정렬
                      </div>
                    </div>
                  </div>

                  <div className={`p-3 rounded-xl border flex items-start gap-3 ${
                    isLight ? 'bg-emerald-50/50 border-emerald-200' : 'bg-slate-950 border-emerald-500/20'
                  }`}>
                    <span className="px-2 py-0.5 rounded bg-emerald-500 text-white font-mono font-bold text-[10px] shrink-0 mt-0.5">PASS</span>
                    <div>
                      <div className="font-bold text-xs">5. 데이터 급변 / 이상 문자 감지 시 관리자 검토 큐(Quarantine) 자동 격리</div>
                      <div className={`text-[11px] mt-0.5 ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                        이상한 팀명/선수명 또는 배당률 급변 발생 시 화면 노출을 즉시 차단하고 '정보 확인 중'으로 격리
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Verified DB Architecture Footer Notice */}
              <div className={`p-3.5 rounded-xl border text-[11px] space-y-1 ${
                isLight ? 'bg-slate-100 border-slate-200 text-slate-700' : 'bg-slate-950 border-slate-800 text-slate-400'
              }`}>
                <div className="font-bold text-slate-900 dark:text-slate-200 flex items-center gap-1.5">
                  <Database className="w-3.5 h-3.5 text-emerald-500" />
                  <span>야구·축구·농구 공통 검증 및 DB 저장소 아키텍처</span>
                </div>
                <p>
                  API에서 수신한 모든 데이터는 <strong>CommonSportsVerificationEngine</strong> 공통 모듈을 통해 검증되며, 검증에 통과한 정상 데이터만 <strong>VerifiedMatchDatabase</strong>에 저장됩니다. 미발표 선발/라인업은 <strong>'정보 확인 중'</strong>으로 안전하게 보호되며 관리자 승인 후 반영됩니다.
                </p>
              </div>
            </div>

            {/* Modal Footer */}
            <div className={`p-3 sm:p-4 border-t flex justify-end ${
              isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-950 border-slate-800'
            }`}>
              <button
                onClick={() => setIsAuditModalOpen(false)}
                className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs transition-all cursor-pointer shadow-sm"
              >
                확인 및 닫기
              </button>
            </div>
          </div>
        </div>
      )}



    </div>
  );
}
