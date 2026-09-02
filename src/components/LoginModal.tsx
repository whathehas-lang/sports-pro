import React, { useState, useEffect } from 'react';
import { X, ShieldCheck, CheckCircle2, Crown, Sparkles, AlertCircle } from 'lucide-react';
import type { MembershipTier } from '../types/sports';
import { authService } from '../services/auth/authService';

interface LoginModalProps {
  onClose: () => void;
  onLoginSuccess: (userData: { name: string; tier: MembershipTier; email: string; avatar?: string }) => void;
}

export const LoginModal = ({ onClose, onLoginSuccess }: LoginModalProps) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [loadingProvider, setLoadingProvider] = useState<'KAKAO' | 'GOOGLE' | null>(null);
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [successMsg, setSuccessMsg] = useState<string>('');

  useEffect(() => {
    authService.initKakaoSdk();
  }, []);

  // 💬 카카오 실제 로그인 핸들러
  const handleKakaoLogin = async () => {
    setIsLoading(true);
    setLoadingProvider('KAKAO');
    setErrorMsg('');
    setSuccessMsg('');

    try {
      const user = await authService.loginWithKakao();
      setSuccessMsg(`🎉 [${user.name}]님 카카오톡 실제 계정으로 로그인 완료!`);
      setTimeout(() => {
        onLoginSuccess({
          name: user.name,
          tier: user.tier,
          email: user.email,
          avatar: user.avatar
        });
      }, 500);
    } catch (err: any) {
      console.warn('Kakao login error:', err);
      setErrorMsg(err?.message || '카카오 로그인을 완료하지 못했습니다.');
      setIsLoading(false);
      setLoadingProvider(null);
    }
  };

  // 🌐 구글 실제 로그인 핸들러
  const handleGoogleLogin = async () => {
    setIsLoading(true);
    setLoadingProvider('GOOGLE');
    setErrorMsg('');
    setSuccessMsg('');

    try {
      const user = await authService.loginWithGoogle();
      setSuccessMsg(`🎉 [${user.name}]님 구글 실제 계정으로 로그인 완료!`);
      setTimeout(() => {
        onLoginSuccess({
          name: user.name,
          tier: user.tier,
          email: user.email,
          avatar: user.avatar
        });
      }, 500);
    } catch (err: any) {
      console.warn('Google login error:', err);
      setErrorMsg(err?.message || '구글 로그인을 완료하지 못했습니다.');
      setIsLoading(false);
      setLoadingProvider(null);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in">
      <div className="w-full max-w-md bg-slate-900 border-2 border-amber-500/60 rounded-3xl p-6 space-y-5 shadow-2xl relative overflow-hidden">
        
        {/* Glow Ambient Effect */}
        <div className="absolute -right-12 -top-12 w-36 h-36 bg-amber-500/20 rounded-full blur-3xl pointer-events-none" />
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3 relative z-10">
          <div className="flex items-center gap-2">
            <Crown className="w-5 h-5 text-amber-400" />
            <h3 className="text-base font-black text-white">
              소셜 간편 로그인 / 회원가입
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Info Banner */}
        <div className="p-3 bg-gradient-to-r from-amber-950/80 via-slate-950 to-amber-950/80 rounded-2xl border border-amber-500/50 space-y-1 text-center">
          <div className="text-amber-300 font-black text-xs flex items-center justify-center gap-1.5">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>1초 카카오 & 구글 공식 실시간 계정 연동</span>
          </div>
          <p className="text-[11px] text-slate-300 font-medium">
            별도의 가입 절차 없이 본인 소셜 계정으로 즉시 VVIP 팩트 분석을 이용하실 수 있습니다.
          </p>
        </div>

        {/* Alert Messages */}
        {errorMsg && (
          <div className="p-3 bg-rose-950/90 text-rose-200 rounded-xl border border-rose-500 text-xs font-bold flex items-center gap-2 animate-in fade-in">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {successMsg && (
          <div className="p-3 bg-emerald-950/90 text-emerald-200 rounded-xl border border-emerald-500 text-xs font-bold flex items-center gap-2 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* OFFICIAL SOCIAL LOGIN BUTTONS */}
        <div className="space-y-3 pt-2 relative z-10">
          
          {/* 1. 카카오톡 공식 1초 로그인 버튼 */}
          <button
            onClick={handleKakaoLogin}
            disabled={isLoading}
            className="w-full py-3.5 px-4 bg-[#FEE500] hover:bg-[#FDD835] active:scale-[0.98] text-[#191919] font-black text-sm rounded-2xl shadow-lg transition-all flex items-center justify-center gap-2.5 cursor-pointer disabled:opacity-50 border border-yellow-400"
          >
            {/* Kakao Icon */}
            <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
              <path d="M12 3c-5.523 0-10 3.582-10 8 0 2.868 1.884 5.385 4.757 6.772l-.994 3.708a.5.5 0 0 0 .668.598l4.498-2.999c.356.046.72.071 1.071.071 5.523 0 10-3.582 10-8s-4.477-8-10-8z"/>
            </svg>
            <span>
              {loadingProvider === 'KAKAO' ? '카카오톡 연결 중... 💬' : '카카오톡으로 1초 로그인 / 시작'}
            </span>
          </button>

          {/* 2. 구글 공식 계정 로그인 버튼 */}
          <button
            onClick={handleGoogleLogin}
            disabled={isLoading}
            className="w-full py-3.5 px-4 bg-white hover:bg-slate-100 active:scale-[0.98] text-slate-900 font-black text-sm rounded-2xl shadow-lg transition-all flex items-center justify-center gap-2.5 cursor-pointer disabled:opacity-50 border border-slate-300"
          >
            {/* Google Colorful Icon */}
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
            </svg>
            <span>
              {loadingProvider === 'GOOGLE' ? 'Google 계정 연결 중... 🌐' : 'Google 계정으로 로그인'}
            </span>
          </button>
        </div>

        {/* Security & Tier Badge */}
        <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800 flex items-center justify-between text-xs font-bold text-slate-400">
          <span className="flex items-center gap-1.5 text-slate-300">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            안전한 OAuth 2.0 공식 보안 인증
          </span>
          <span className="text-[10px] bg-amber-400 text-slate-950 px-2 py-0.5 rounded font-black">
            👑 VVIP 자동 승급
          </span>
        </div>

      </div>
    </div>
  );
};
