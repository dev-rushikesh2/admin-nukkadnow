export interface PaymentTransactionViewModel {
  id: string;
  orderId: string;
  customerName: string;
  merchantName: string;
  city: string;
  locality: string;
  amountPaise: number;
  amountFormatted: string;
  paymentMethod: 'UPI' | 'RAZORPAY_CARDS' | 'COD' | 'NETBANKING';
  gatewayRef: string;
  status: 'CAPTURED' | 'SETTLED' | 'PENDING' | 'FAILED';
  escrowStatus: 'RELEASED' | 'HELD_DISPUTE' | 'PENDING_DELIVERY';
  escrowReleaseDate: string;
  webhookDelivered: boolean;
  webhookPayloadSanitized?: Record<string, unknown>;
  name?: string;
  createdAt: string;
  updatedAt?: string;
  metadata?: Record<string, unknown>;
}

export interface PaymentTransactionFilterCriteria {
  search?: string;
  city?: string;
  status?: string;
  paymentMethod?: string;
  escrowStatus?: string;
  page?: number;
  limit?: number;
}
