import { useState } from 'react';
import { X, Lock, User, Sparkles, ShieldCheck, ArrowRight, KeyRound, CheckCircle2, Crown } from 'lucide-react';
import type { MembershipTier } from '../types/sports';
import { authService } from '../services/auth/authService';

interface LoginModalProps {
  onClose: () => void;
  onLoginSuccess: (userData: { name: string; tier: MembershipTier; email: string }) => void;
}

export const LoginModal = ({ onClose, onLoginSuccess }: LoginModalProps) => {
  const [activeTab, setActiveTab] = useState<'LOGIN' | 'SIGNUP'>('LOGIN');

  // Form states
  const [emailInput, setEmailInput] = useState<string>('');
  const [passwordInput, setPasswordInput] = useState<string>('');
  const [nicknameInput, setNicknameInput] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [successMsg, setSuccessMsg] = useState<string>('');

  // Handle Form Submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (activeTab === 'LOGIN') {
      if (!emailInput.trim() || !passwordInput.trim()) {
        setErrorMsg('아이디(이메일)와 비밀번호를 모두 입력해 주세요.');
        return;
      }

      const user = await authService.loginWithEmail(emailInput.trim());
      setSuccessMsg('🟢 VVIP 로그인 성공! 오피셜 팩트 데이터 시스템에 접속합니다.');
      setTimeout(() => {
        onLoginSuccess({
          name: user.name,
          tier: user.tier,
          email: user.email,
        });
      }, 500);
    } else {
      if (!nicknameInput.trim() || !emailInput.trim() || !passwordInput.trim()) {
        setErrorMsg('모든 필수 항목을 입력해 주세요.');
        return;
      }

      const user = await authService.loginWithEmail(emailInput.trim(), nicknameInput.trim());
      setSuccessMsg('🎉 VVIP 회원가입 완료! 100% 오피셜 팩트 유료 등급으로 자동 로그인합니다.');
      setTimeout(() => {
        onLoginSuccess({
          name: user.name,
          tier: user.tier,
          email: user.email,
        });
      }, 500);
    }
  };

  // Quick Demo Login Handler
  const handleQuickDemoLogin = async () => {
    const user = await authService.loginWithSocial('Google');
    setSuccessMsg('👑 [VVIP 100% 팩트 유료 계정]으로 1초 빠른 로그인되었습니다!');
    setTimeout(() => {
      onLoginSuccess({
        name: user.name,
        tier: user.tier,
        email: user.email,
      });
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in">
      <div className="w-full max-w-md bg-slate-900 border-2 border-amber-500/60 rounded-3xl p-6 space-y-5 shadow-2xl relative overflow-hidden">
        
        {/* Glow Ambient Effect */}
        <div className="absolute -right-12 -top-12 w-36 h-36 bg-amber-500/20 rounded-full blur-3xl pointer-events-none" />
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3 relative z-10">
          <div className="flex items-center gap-2">
            <KeyRound className="w-5 h-5 text-amber-400" />
            <h3 className="text-base font-black text-white">
              {activeTab === 'LOGIN' ? '🔑 VVIP 유료 회원 로그인' : '📝 VVIP 1초 회원가입'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* LOGIN vs SIGNUP TAB SWITCHER */}
        <div className="grid grid-cols-2 gap-2 bg-slate-950 p-1 rounded-2xl border border-slate-800 relative z-10">
          <button
            onClick={() => {
              setActiveTab('LOGIN');
              setErrorMsg('');
            }}
            className={`py-2 rounded-xl text-xs font-black transition-all ${
              activeTab === 'LOGIN'
                ? 'bg-amber-500 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            🔑 로그인
          </button>
          <button
            onClick={() => {
              setActiveTab('SIGNUP');
              setErrorMsg('');
            }}
            className={`py-2 rounded-xl text-xs font-black transition-all ${
              activeTab === 'SIGNUP'
                ? 'bg-amber-500 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            📝 1초 회원가입
          </button>
        </div>

        {/* Alert Messages */}
        {errorMsg && (
          <div className="p-3 bg-rose-950/90 text-rose-200 rounded-xl border border-rose-500 text-xs font-bold flex items-center gap-2">
            <X className="w-4 h-4 text-rose-400 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {successMsg && (
          <div className="p-3 bg-emerald-950/90 text-emerald-200 rounded-xl border border-emerald-500 text-xs font-bold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* FORM */}
        <form onSubmit={handleSubmit} className="space-y-3.5 text-xs relative z-10">
          
          {/* Signup Nickname Field */}
          {activeTab === 'SIGNUP' && (
            <div className="space-y-1">
              <label className="text-slate-300 font-bold block flex items-center gap-1">
                <User className="w-3.5 h-3.5 text-amber-400" />
                닉네임 (활동명):
              </label>
              <input
                type="text"
                required
                value={nicknameInput}
                onChange={(e) => setNicknameInput(e.target.value)}
                placeholder="예: 대구적중마스터"
                className="w-full bg-slate-950 border border-slate-800 focus:border-amber-400 rounded-xl px-3.5 py-2.5 text-white font-medium outline-none transition-all"
              />
            </div>
          )}

          {/* Email / ID Field */}
          <div className="space-y-1">
            <label className="text-slate-300 font-bold block flex items-center gap-1">
              <User className="w-3.5 h-3.5 text-amber-400" />
              아이디 또는 이메일:
            </label>
            <input
              type="text"
              required
              value={emailInput}
              onChange={(e) => setEmailInput(e.target.value)}
              placeholder="예: vvip@tokeon.co.kr"
              className="w-full bg-slate-950 border border-slate-800 focus:border-amber-400 rounded-xl px-3.5 py-2.5 text-white font-medium outline-none transition-all"
            />
          </div>

          {/* Password Field */}
          <div className="space-y-1">
            <label className="text-slate-300 font-bold block flex items-center gap-1">
              <Lock className="w-3.5 h-3.5 text-amber-400" />
              비밀번호:
            </label>
            <input
              type="password"
              required
              value={passwordInput}
              onChange={(e) => setPasswordInput(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-slate-950 border border-slate-800 focus:border-amber-400 rounded-xl px-3.5 py-2.5 text-white font-medium outline-none transition-all"
            />
          </div>

          {/* Fixed Single Tier: VVIP */}
          <div className="p-2.5 bg-slate-950 rounded-xl border border-amber-500/50 flex items-center justify-between text-xs font-bold">
            <span className="text-slate-300 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-amber-400" /> 회원 등급:
            </span>
            <span className="px-2.5 py-0.5 rounded bg-amber-400 text-slate-950 font-black text-[11px]">
              👑 VVIP 100% 오피셜 전용
            </span>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-3 bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 hover:from-amber-300 hover:to-yellow-300 text-slate-950 font-black text-xs sm:text-sm rounded-2xl shadow-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer border border-yellow-200 mt-2"
          >
            <span>{activeTab === 'LOGIN' ? '🔑 VVIP 로그인하기' : '📝 VVIP 회원가입 및 접속'}</span>
            <ArrowRight className="w-4 h-4 text-slate-950 stroke-[3]" />
          </button>
        </form>

        {/* QUICK DEMO ONE-CLICK LOGIN BOX */}
        <div className="pt-3 border-t border-slate-800 space-y-2 relative z-10">
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block text-center flex items-center justify-center gap-1">
            <Sparkles className="w-3 h-3 text-amber-400" /> 1초 VVIP 원클릭 체험 로그인
          </span>
          <button
            onClick={handleQuickDemoLogin}
            className="w-full py-2.5 bg-gradient-to-r from-amber-950 via-slate-900 to-amber-950 hover:from-amber-900 border border-amber-500/60 rounded-xl text-amber-300 text-xs font-black shadow flex items-center justify-center gap-1.5 cursor-pointer transition-all"
          >
            <Crown className="w-4 h-4 text-amber-400" />
            <span>👑 VVIP 100% 팩트 유료 계정 원클릭 로그인</span>
          </button>
        </div>

      </div>
    </div>
  );
};
