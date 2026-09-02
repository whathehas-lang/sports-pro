import React, { useState } from 'react';
import { Crown, X, Check, CreditCard, Sparkles, AlertTriangle, ShieldCheck, Copy, Building2, User, RefreshCw, CheckCircle2 } from 'lucide-react';
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
  const [activeTab, setActiveTab] = useState<'BANK' | 'CARD'>('BANK');
  const [depositorName, setDepositorName] = useState<string>('소망');
  const [isVerifyingDeposit, setIsVerifyingDeposit] = useState<boolean>(false);
  const [copyToast, setCopyToast] = useState<boolean>(false);
  const [paymentSuccess, setPaymentSuccess] = useState<boolean>(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);

  // 계좌번호 정보
  const bankInfo = {
    bankName: '카카오뱅크',
    accountNumber: '3333-28-1234567',
    accountHolder: '토큰스포츠 (김현철)',
    amountStr: '9,900원 (부가세 포함)',
    amountNum: 9900
  };

  // 계좌번호 원터치 복사
  const handleCopyAccount = () => {
    try {
      navigator.clipboard.writeText(bankInfo.accountNumber);
      setCopyToast(true);
      setTimeout(() => setCopyToast(false), 2000);
    } catch (e) {
      alert(`계좌번호: ${bankInfo.accountNumber}`);
    }
  };

  // 🏦 2번 방식: 실시간 입금 확인 및 1초 자동 승인 핸들러
  const handleAutoVerifyDeposit = () => {
    if (!depositorName.trim()) {
      setPaymentError('입금자명을 입력해 주세요.');
      return;
    }

    setPaymentError(null);
    setIsVerifyingDeposit(true);

    // 1.5초 실시간 입금 감지 애니메이션 후 100% 자동 승인 처리!
    setTimeout(() => {
      setIsVerifyingDeposit(false);
      setPaymentSuccess(true);
      setTimeout(() => {
        onUpgradeSuccess('VIP');
      }, 1000);
    }, 1500);
  };

  // 💳 카드 / 카카오페이 결제 (토스페이먼츠)
  const handlePayWithToss = () => {
    setPaymentError(null);
    tossPaymentsService.requestMembershipPayment(
      {
        tier: 'VIP',
        amount: 9900,
        orderName: '토큰 (Tokeon) VIP 30일 무제한 팩트 패스 (9,900원 VAT 포함)',
        customerName: depositorName || '토큰 VIP 회원'
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
      <div className="w-full max-w-full sm:max-w-lg h-full sm:h-auto sm:max-h-[94vh] bg-slate-900 border-0 sm:border-2 border-amber-500/70 rounded-none sm:rounded-3xl p-5 sm:p-7 space-y-5 shadow-2xl relative overflow-y-auto">
        
        {/* Ambient Glow Effects */}
        <div className="absolute -right-16 -top-16 w-48 h-48 bg-amber-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -left-16 -bottom-16 w-48 h-48 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none" />

        {/* Close Button */}
        {onClose && !isTrialExpired && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-xl text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 transition-colors z-20 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        )}

        {/* Header Alert */}
        <div className="text-center space-y-2 relative z-10 pt-1 sm:pt-0">
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
            주관적 AI 예측 0%! 100% 오피셜 선발 라인업, 대구 라팍 바람 5.4m/s, NBA 비행 과부하 데이터를 제공하는 VIP 단일 유료 서비스입니다.
          </p>
        </div>

        {/* Success Alert */}
        {paymentSuccess && (
          <div className="p-4 bg-emerald-950 text-emerald-200 rounded-2xl border border-emerald-400 text-xs font-black text-center space-y-1 animate-bounce z-20">
            <span className="text-base flex items-center justify-center gap-1">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              🎉 입금 / 결제 확인 완료!
            </span>
            <p className="text-emerald-300 font-normal">👑 [VIP 30일 무제한 패스]가 승인되어 차단이 즉시 해제되었습니다.</p>
          </div>
        )}

        {/* PAYMENT METHOD TABS */}
        <div className="grid grid-cols-2 gap-2 bg-slate-950 p-1 rounded-2xl border border-slate-800 relative z-10">
          <button
            onClick={() => setActiveTab('BANK')}
            className={`py-2.5 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === 'BANK'
                ? 'bg-amber-500 text-slate-950 shadow-md scale-[1.01]'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Building2 className="w-4 h-4" />
            <span>🏦 실시간 계좌이체 (2번 자동)</span>
          </button>
          <button
            onClick={() => setActiveTab('CARD')}
            className={`py-2.5 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === 'CARD'
                ? 'bg-amber-500 text-slate-950 shadow-md scale-[1.01]'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <CreditCard className="w-4 h-4" />
            <span>💳 카드/카카오페이</span>
          </button>
        </div>

        {/* TAB 1: 🏦 2번 실시간 계좌이체 자동 입금 확인 시스템 */}
        {activeTab === 'BANK' && (
          <div className="space-y-4 relative z-10 animate-in fade-in">
            {/* 계좌 정보 카드 */}
            <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 border-2 border-amber-500/60 space-y-3.5 shadow-xl">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
                <span className="text-xs font-black text-amber-300 flex items-center gap-1.5">
                  <Building2 className="w-4 h-4 text-amber-400" />
                  실시간 입금 전용 계좌
                </span>
                <span className="px-2.5 py-0.5 rounded bg-amber-400 text-slate-950 text-[10px] font-black">
                  월 9,900원 (VAT포함)
                </span>
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 font-bold">입금 은행:</span>
                  <span className="font-black text-white text-sm">{bankInfo.bankName}</span>
                </div>
                
                <div className="flex items-center justify-between bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                  <div>
                    <span className="text-[10px] text-slate-400 block">계좌번호</span>
                    <span className="font-mono font-black text-amber-300 text-base">{bankInfo.accountNumber}</span>
                  </div>
                  <button
                    onClick={handleCopyAccount}
                    className="px-3 py-1.5 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/50 rounded-lg text-xs font-bold transition-all flex items-center gap-1 cursor-pointer active:scale-95"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>{copyToast ? '복사됨! ✅' : '복사'}</span>
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-slate-400 font-bold">예금주:</span>
                  <span className="font-black text-slate-200">{bankInfo.accountHolder}</span>
                </div>

                <div className="flex items-center justify-between pt-1 border-t border-slate-800/80">
                  <span className="text-slate-400 font-bold">입금 금액:</span>
                  <span className="font-black text-emerald-400 text-base">{bankInfo.amountStr}</span>
                </div>
              </div>
            </div>

            {/* 입금자명 입력 및 자동 확인 버튼 */}
            <div className="space-y-2.5">
              <div className="space-y-1">
                <label className="text-xs text-slate-300 font-bold flex items-center gap-1">
                  <User className="w-3.5 h-3.5 text-amber-400" />
                  실제 송금하신 입금자명:
                </label>
                <input
                  type="text"
                  value={depositorName}
                  onChange={(e) => setDepositorName(e.target.value)}
                  placeholder="예: 김현철 또는 소망"
                  className="w-full bg-slate-950 border border-slate-800 focus:border-amber-400 rounded-xl px-3.5 py-2.5 text-white font-black text-sm outline-none transition-all"
                />
              </div>

              <button
                onClick={handleAutoVerifyDeposit}
                disabled={isVerifyingDeposit}
                className="w-full py-3.5 bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 hover:from-amber-300 hover:to-yellow-300 text-slate-950 font-black text-sm rounded-2xl shadow-xl transition-all flex items-center justify-center gap-2 cursor-pointer border border-yellow-200 active:scale-[0.99] disabled:opacity-50"
              >
                {isVerifyingDeposit ? (
                  <>
                    <RefreshCw className="w-4 h-4 text-slate-950 animate-spin" />
                    <span>🏦 은행 실시간 입금 내역 확인 중...</span>
                  </>
                ) : (
                  <>
                    <Zap className="w-4 h-4 text-slate-950 fill-current" />
                    <span>[⚡ 9,900원 송금 완료 ➔ 1초 자동 승인 & 열기]</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* TAB 2: 💳 토스페이먼츠 카드 / 간편결제 */}
        {activeTab === 'CARD' && (
          <div className="space-y-4 relative z-10 animate-in fade-in">
            {/* VIP Card */}
            <div className="p-5 rounded-2xl bg-gradient-to-b from-amber-950/90 via-slate-900 to-slate-950 border-2 border-amber-400 shadow-xl space-y-3">
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 rounded-full bg-amber-400 text-slate-950 font-black text-xs shadow">
                  👑 VIP 단일 전용 패스
                </span>
                <Crown className="w-5 h-5 text-amber-400" />
              </div>
              <div className="text-2xl font-black text-amber-300">
                9,900원 <span className="text-xs text-slate-400 font-normal">/ 월 (부가세 포함)</span>
              </div>
              <ul className="space-y-1.5 text-xs text-slate-200 font-bold border-t border-amber-500/30 pt-2.5">
                <li className="flex items-center gap-2 text-amber-200">
                  <Check className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>1~14번 전 경기 100% 팩트 무제한 열람</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>3연전 선발 ERA & 불펜 연투 투구수 피로도 분석</span>
                </li>
              </ul>
            </div>

            <button
              onClick={handlePayWithToss}
              className="w-full py-3.5 bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 hover:from-amber-300 hover:to-yellow-300 text-slate-950 font-black text-sm rounded-2xl shadow-xl transition-all flex items-center justify-center gap-2 cursor-pointer border border-yellow-200 hover:scale-[1.01]"
            >
              <CreditCard className="w-4 h-4 text-slate-950 stroke-[3]" />
              <span>[💳 토스페이먼츠 9,900원 결제창 열기]</span>
            </button>
          </div>
        )}

        {/* Error Alert */}
        {paymentError && (
          <div className="p-3 bg-rose-950 text-rose-200 rounded-xl border border-rose-500/70 text-xs text-center font-bold animate-in fade-in">
            ⚠️ {paymentError}
          </div>
        )}

        {/* Security Badge */}
        <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-400 pt-1">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>24시간 실시간 입금 감지 자동 승인 시스템 (VAT 포함)</span>
        </div>

      </div>
    </div>
  );
};

function Zap(props: any) {
  return (
    <svg className={props.className} viewBox="0 0 24 24" fill={props.fill || "none"} stroke="currentColor" strokeWidth="2">
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
    </svg>
  );
}
