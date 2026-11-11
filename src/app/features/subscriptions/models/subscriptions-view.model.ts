export interface MerchantSubscriptionViewModel {
  id: string;
  name?: string;
  title?: string;
  status: string;
  createdAt: string;
  updatedAt?: string;
  metadata?: Record<string, unknown>;
}

export interface MerchantSubscriptionFilterCriteria {
  search?: string;
  status?: string;
  page?: number;
  limit?: number;
}
