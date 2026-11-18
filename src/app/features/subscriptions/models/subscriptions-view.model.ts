export interface MerchantSubscriptionViewModel {
  id: string;
  merchantId: string;
  merchantName: string;
  city: string;
  locality: string;
  planId: string;
  planName: string;
  mrrPaise: number;
  mrrFormatted: string;
  billingCycle: 'MONTHLY' | 'ANNUAL';
  status: 'ACTIVE' | 'PAST_DUE' | 'TRIAL' | 'CANCELLED';
  nextBillingDate: string;
  gracePeriodDays: number;
  invoices?: { id: string; amount: string; date: string; status: string }[];
  name?: string;
  createdAt: string;
  updatedAt?: string;
  metadata?: Record<string, unknown>;
}

export interface MerchantSubscriptionFilterCriteria {
  search?: string;
  city?: string;
  status?: string;
  planId?: string;
  page?: number;
  limit?: number;
}
