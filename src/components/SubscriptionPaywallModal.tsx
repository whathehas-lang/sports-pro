import React, { useState } from 'react';
import { Crown, X, Check, CreditCard, Sparkles, AlertTriangle, ShieldCheck } from 'lucide-react';
import type { MembershipTier } from '../types/sports';
import { tossPaymentsService } from '../services/payment/tossPaymentsService';

interface SubscriptionPaywallModalProps {
  onClose?: () => void;
  onUpgradeSuccess: (tier: MembershipTier) => void;
  isTrialExpired?: boolean;
}

export const SubscriptionPaywallModal = ({
  onClose,
  onUpgradeSuccess,
  isTrialExpired = false,
}: SubscriptionPaywallModalProps) => {
  const [paymentSuccess, setPaymentSuccess] = useState<boolean>(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);

  const handlePayWithToss = () => {
    setPaymentError(null);
    tossPaymentsService.requestMembershipPayment(
      {
        tier: 'VIP',
        amount: 9900,
        orderName: '토큰 (Tokeon) VIP 30일 무제한 팩트 패스 (9,900원 VAT 포함)',
        customerName: '토큰 VIP 회원'
      },
      (approvedTier) => {
        setPaymentSuccess(true);
        setTimeout(() => {
          onUpgradeSuccess(approvedTier);
        }, 800);
      },
      (errorMsg) => {
        setPaymentError(errorMsg);
      }
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-0 sm:p-4 bg-slate-950/90 backdrop-blur-lg animate-in fade-in">
      <div className="w-full max-w-full sm:max-w-lg h-full sm:h-auto sm:max-h-[94vh] bg-slate-900 border-0 sm:border-2 border-amber-500/70 rounded-none sm:rounded-3xl p-5 sm:p-8 space-y-6 shadow-2xl relative overflow-y-auto">
        
        {/* Ambient Glow Effects */}
        <div className="absolute -right-16 -top-16 w-48 h-48 bg-amber-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -left-16 -bottom-16 w-48 h-48 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none" />

        {/* Close Button */}
        {onClose && !isTrialExpired && (
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 transition-colors z-20 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        )}

        {/* Header Alert */}
        <div className="text-center space-y-2 relative z-10 pt-2 sm:pt-0">
          {isTrialExpired ? (
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-rose-950 border border-rose-500 text-rose-300 font-black text-xs animate-pulse shadow-lg">
              <AlertTriangle className="w-4 h-4 text-rose-400" />
              <span>⏰ 무료 3일 체험 기간이 만료되었습니다</span>
            </div>
          ) : (
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-amber-950 border border-amber-500 text-amber-300 font-black text-xs shadow-lg">
              <Sparkles className="w-4 h-4 text-amber-400 animate-spin" />
              <span>👑 토큰 (Tokeon) VIP 전용 서비스</span>
            </div>
          )}

          <h2 className="text-xl sm:text-2xl font-black text-white leading-snug">
            {isTrialExpired ? (
              <span>무료 3일 체험이 만료되었습니다.<br /><span className="text-amber-400">VIP 유료 멤버십 결제</span> 후 서비스가 해제됩니다.</span>
            ) : (
              <span>100% 오피셜 팩트 분석 <span className="text-amber-400">VIP 멤버십 혜택</span></span>
            )}
          </h2>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            주관적 AI 예측 0%! 오직 100% 오피셜 선발 라인업, 대구 라팍 바람 5.4m/s, NBA 3,850km 비행 과부하 데이터를 제공하는 VIP 단일 유료 서비스입니다.
          </p>
        </div>

        {/* Payment Success Alert */}
        {paymentSuccess && (
          <div className="p-4 bg-emerald-950 text-emerald-200 rounded-2xl border border-emerald-400 text-xs font-black text-center space-y-1 animate-bounce z-20">
            <span className="text-base">🎉 결제 승인 완료!</span>
            <p className="text-emerald-300 font-normal">👑 [VIP 유료 멤버십]이 승인되어 차단이 즉시 해제되었습니다.</p>
          </div>
        )}

        {/* SINGLE VIP MEMBERSHIP CARD (9,900원 부가세 포함) */}
        <div className="p-5 sm:p-6 rounded-3xl bg-gradient-to-b from-amber-950/90 via-slate-900 to-slate-950 border-2 border-amber-400 shadow-2xl relative z-10 space-y-4">
          <div className="flex items-center justify-between">
            <span className="px-3 py-1 rounded-full bg-amber-400 text-slate-950 font-black text-xs shadow">
              👑 VIP 단일 전용 패스
            </span>
            <Crown className="w-6 h-6 text-amber-400" />
          </div>

          <div>
            <h3 className="text-lg font-black text-white flex items-center gap-1.5">
              👑 VIP 100% 오피셜 팩트 패스
            </h3>
            <div className="text-2xl sm:text-3xl font-black text-amber-300 mt-1">
              9,900원 <span className="text-xs text-slate-400 font-normal">/ 월 (부가세 포함)</span>
            </div>
          </div>

          <ul className="space-y-2 text-xs text-slate-200 font-bold border-t border-amber-500/30 pt-3">
            <li className="flex items-center gap-2 text-amber-200">
              <Check className="w-4 h-4 text-amber-400 shrink-0" />
              <span>1~14번 전 경기 100% 오피셜 팩트 무제한 열람</span>
            </li>
            <li className="flex items-center gap-2">
              <Check className="w-4 h-4 text-amber-400 shrink-0" />
              <span>3연전 선발 ERA & 불펜 연투 투구수 피로도 정밀 분석</span>
            </li>
            <li className="flex items-center gap-2">
              <Check className="w-4 h-4 text-amber-400 shrink-0" />
              <span>대구 라팍 구장 바람 5.4m/s & 파크 팩터</span>
            </li>
            <li className="flex items-center gap-2">
              <Check className="w-4 h-4 text-amber-400 shrink-0" />
              <span>👑 VIP 라이브 톡 및 오피셜 라인업 1초 알림</span>
            </li>
          </ul>
        </div>

        {/* Payment Error Alert */}
        {paymentError && (
          <div className="p-3 bg-rose-950 text-rose-200 rounded-xl border border-rose-500/70 text-xs text-center font-bold">
            ⚠️ {paymentError}
          </div>
        )}

        {/* PAYMENT ACTION BUTTON */}
        <div className="space-y-2 relative z-10">
          <button
            onClick={handlePayWithToss}
            className="w-full py-4 bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 hover:from-amber-300 hover:to-yellow-300 text-slate-950 font-black text-sm sm:text-base rounded-2xl shadow-xl transition-all flex items-center justify-center gap-2 cursor-pointer border border-yellow-200 hover:scale-[1.01]"
          >
            <CreditCard className="w-5 h-5 text-slate-950 stroke-[3]" />
            <span>[💳 토스페이먼츠 9,900원 VIP 결제하기]</span>
          </button>
          
          <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-400 pt-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>신용/체크카드, 카카오페이, 토스페이 1초 간편결제 지원 (VAT 포함)</span>
          </div>
        </div>

      </div>
    </div>
  );
};
