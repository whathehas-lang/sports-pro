import { Trophy, Smartphone, MessageSquare, LogIn, LogOut, User, Crown } from 'lucide-react';
import type { BetmanFolderCategory, MembershipTier, ViewMode } from '../types/sports';

interface NavbarProps {
  selectedFolder: BetmanFolderCategory;
  onSelectFolder: (folder: BetmanFolderCategory) => void;
  selectedRound: string;
  onSelectRound: (round: string) => void;
  membershipTier: MembershipTier;
  onChangeMembershipTier: (tier: MembershipTier) => void;
  viewMode: ViewMode;
  onToggleViewMode: (mode: ViewMode) => void;
  activeTab: 'home' | 'community' | 'profile';
  setActiveTab: (tab: 'home' | 'community' | 'profile') => void;
  isLoggedIn: boolean;
  userName?: string;
  onOpenLoginModal: () => void;
  onLogout: () => void;
}

export const Navbar = ({
  selectedFolder,
  onSelectFolder,
  onToggleViewMode,
  activeTab,
  setActiveTab,
  isLoggedIn,
  userName = '토큰VVIP회원',
  onOpenLoginModal,
  onLogout,
}: NavbarProps) => {

  return (
    <header className="sticky top-0 z-40 bg-slate-950/95 backdrop-blur-xl border-b border-slate-900/90 shadow-2xl w-full">
      {/* PRIMARY TOP HEADER BAR (📌 요청 반영: 중간 중복 회차 드롭다운 삭제하여 극도의 청량감 제공) */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 py-2 flex items-center justify-between gap-3">
        
        {/* LOGO & BRAND NAME */}
        <div className="flex items-center gap-2.5 shrink-0">
          <div
            onClick={() => setActiveTab('home')}
            className="flex items-center gap-2.5 cursor-pointer group"
          >
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-emerald-400 via-amber-300 to-amber-500 p-0.5 shadow-lg group-hover:scale-105 transition-transform">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <Trophy className="w-4 h-4 text-emerald-400 group-hover:text-amber-300 transition-colors" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-black text-sm sm:text-base tracking-tight text-white group-hover:text-emerald-400 transition-colors">
                  토큰 <span className="text-amber-400 text-xs font-bold">(Tokeon)</span>
                </span>
                <span className="text-[9px] bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 px-1.5 py-0.2 rounded font-mono font-black shadow-sm">
                  100% FACT
                </span>
              </div>
              <span className="text-[9.5px] text-slate-400 font-medium block leading-none mt-0.5">
                tokeon.co.kr • 주관적 예측 0% 오피셜 데이터
              </span>
            </div>
          </div>
        </div>

        {/* RIGHT ULTRA-CLEAN ACTION BAR */}
        <div className="flex items-center gap-2 shrink-0">
          
          {/* TAB MODE SWITCHER BUTTONS */}
          <div className="flex items-center gap-1 bg-slate-900/90 p-1 rounded-xl border border-slate-800 shadow-inner">
            <button
              onClick={() => {
                onToggleViewMode('APP');
                setActiveTab('home');
              }}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-black transition-all flex items-center gap-1 cursor-pointer ${
                activeTab === 'home'
                  ? 'bg-emerald-500 text-slate-950 shadow-md scale-[1.02]'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>📱 경기목록</span>
            </button>
            <button
              onClick={() => {
                onToggleViewMode('PC_WEB');
                setActiveTab('community');
              }}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-black transition-all flex items-center gap-1 cursor-pointer ${
                activeTab === 'community'
                  ? 'bg-gradient-to-r from-amber-400 to-yellow-400 text-slate-950 shadow-md scale-[1.02] ring-2 ring-amber-300/40'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <MessageSquare className="w-3.5 h-3.5 text-slate-950" />
              <span>💬 채팅방</span>
            </button>
          </div>

          {/* VVIP 유료 전용 뱃지 */}
          <div className="hidden lg:flex items-center gap-1 px-2.5 py-1 bg-gradient-to-r from-amber-400 to-yellow-400 text-slate-950 rounded-xl font-black text-[11px] shadow border border-yellow-200">
            <Crown className="w-3.5 h-3.5 text-slate-950" />
            <span>VVIP 팩트 회원</span>
          </div>

          {/* AUTH LOGIN & LOGOUT AREA */}
          {isLoggedIn ? (
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setActiveTab('profile')}
                className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 bg-slate-900 hover:bg-slate-800 border border-slate-700/80 rounded-xl text-xs font-bold text-amber-300 transition-all cursor-pointer shadow-sm"
              >
                <User className="w-3.5 h-3.5 text-amber-400" />
                <span className="truncate max-w-[85px]">{userName}</span>
              </button>
              
              <button
                onClick={onLogout}
                className="px-2.5 py-1 bg-rose-950/70 hover:bg-rose-900 border border-rose-500/40 text-rose-300 hover:text-white rounded-xl text-[11px] font-black transition-all flex items-center gap-1 cursor-pointer shadow-sm hover:scale-105 active:scale-95"
              >
                <LogOut className="w-3.5 h-3.5 text-rose-400" />
                <span>로그아웃</span>
              </button>
            </div>
          ) : (
            <button
              onClick={onOpenLoginModal}
              className="px-3 py-1.5 bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-300 hover:to-yellow-400 text-slate-950 rounded-xl text-xs font-black transition-all flex items-center gap-1 cursor-pointer shadow-md border border-yellow-200 hover:scale-105 active:scale-95"
            >
              <LogIn className="w-3.5 h-3.5 text-slate-950 stroke-[3]" />
              <span>로그인</span>
            </button>
          )}

        </div>

      </div>

      {/* SECONDARY FOLDER CATEGORY PILLS BAR (경기목록 탭에서만 깔끔히 노출) */}
      {activeTab === 'home' && (
        <div className="max-w-7xl mx-auto px-2.5 sm:px-6 py-1.5 flex items-center justify-between gap-2 overflow-x-auto no-scrollbar border-t border-slate-900">
          <div className="flex items-center gap-1.5 shrink-0 overflow-x-auto no-scrollbar">
            {/* 🎟️ G101 프로토 승부식 */}
            <button
              onClick={() => onSelectFolder('SEUNGBUSHIK')}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-black transition-all cursor-pointer ${
                selectedFolder === 'SEUNGBUSHIK' || selectedFolder === 'ALL'
                  ? 'bg-yellow-400 text-slate-950 shadow'
                  : 'text-slate-400 hover:text-white bg-slate-900/60'
              }`}
            >
              🎟️ 프로토 승부식 (G101)
            </button>

            {/* ⚽ G011 축구 승무패 */}
            <button
              onClick={() => onSelectFolder('SEUNGMUBAE')}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-black transition-all cursor-pointer ${
                selectedFolder === 'SEUNGMUBAE'
                  ? 'bg-emerald-400 text-slate-950 shadow'
                  : 'text-slate-400 hover:text-white bg-slate-900/60'
              }`}
            >
              ⚽ 축구 승무패 (G011)
            </button>

            {/* ⚾ G024 야구 승1패 */}
            <button
              onClick={() => onSelectFolder('SEUNG1PAE')}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-black transition-all cursor-pointer ${
                selectedFolder === 'SEUNG1PAE'
                  ? 'bg-orange-400 text-slate-950 shadow'
                  : 'text-slate-400 hover:text-white bg-slate-900/60'
              }`}
            >
              ⚾ 야구 승1패 (G024)
            </button>

            {/* 🎯 G102 프로토 기록식 */}
            <button
              onClick={() => onSelectFolder('GIROKSIK')}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-black transition-all cursor-pointer ${
                selectedFolder === 'GIROKSIK'
                  ? 'bg-purple-400 text-slate-950 shadow'
                  : 'text-slate-400 hover:text-white bg-slate-900/60'
              }`}
            >
              🎯 프로토 기록식 (G102)
            </button>

            {/* 🏀 승5패 (준비중) */}
            <button
              onClick={() => onSelectFolder('SEUNG5PAE')}
              className={`px-2 py-1 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${
                selectedFolder === 'SEUNG5PAE'
                  ? 'bg-slate-700 text-amber-300 border border-amber-500/50 shadow'
                  : 'text-slate-500 hover:text-slate-300 bg-slate-900/40'
              }`}
              title="현재 발매 시즌이 아닙니다 (다음 시즌 개장 예정)"
            >
              🏀 농구 승5패 (시즌 준비중)
            </button>
          </div>

          <div className="text-[10px] text-emerald-400/90 font-mono font-bold shrink-0 hidden lg:block">
            ● BETMAN REAL-TIME REGISTRY CONNECTED
          </div>
        </div>
      )}

    </header>
  );
};
