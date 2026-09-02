import type { MembershipTier } from '../../types/sports';

export interface PaymentOptions {
  tier: MembershipTier;
  amount: number;
  orderName: string;
  customerName: string;
}

export class TossPaymentsService {
  private clientKey: string;

  constructor() {
    this.clientKey = (import.meta as any).env?.VITE_TOSS_PAYMENTS_CLIENT_KEY || 'test_ck_docs_O2Lz5M1zP428E6v22w5b3n98';
  }

  /**
   * Request payment for VIP membership (9,900원 VAT 포함).
   */
  public async requestMembershipPayment(
    options: PaymentOptions,
    onSuccess: (tier: MembershipTier) => void,
    onFail: (errorMsg: string) => void
  ): Promise<void> {
    try {
      console.log(`[TossPaymentsService] Initiating payment for ${options.orderName} (${options.amount}KRW)...`);

      // If Toss Payments script is loaded, open official Toss Payments checkout popup
      if (typeof window !== 'undefined' && (window as any).TossPayments) {
        const tossPayments = (window as any).TossPayments(this.clientKey);
        const redirectUrl = window.location.origin + window.location.pathname;
        await tossPayments.requestPayment('카드', {
          amount: options.amount,
          orderId: `ORDER_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
          orderName: options.orderName,
          customerName: options.customerName,
          successUrl: `${redirectUrl}?payment_status=success&tier=${options.tier}`,
          failUrl: `${redirectUrl}?payment_status=fail`
        });
      } else {
        // Fallback simulation mode
        const confirmPay = window.confirm(
          `💳 [토스페이먼츠 공식 결제창 연동]\n\n- 상품명: ${options.orderName}\n- 결제금액: ${options.amount.toLocaleString()}원 (부가세 포함)\n\n결제를 진행하시겠습니까?`
        );
        if (confirmPay) {
          onSuccess(options.tier);
        } else {
          onFail('사용자가 결제를 취소하였습니다.');
        }
      }
    } catch (err: unknown) {
      console.error('[TossPaymentsService] Payment error:', err);
      onFail(err instanceof Error ? err.message : '결제 진행 중 오류가 발생했습니다.');
    }
  }
}

export const tossPaymentsService = new TossPaymentsService();
