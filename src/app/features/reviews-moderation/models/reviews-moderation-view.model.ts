export interface ReviewModerationViewModel {
  id: string;
  customerName: string;
  customerPhone?: string;
  merchantId: string;
  merchantName: string;
  city: string;
  locality: string;
  rating: number; // 1 to 5
  comment: string;
  sentiment: 'POSITIVE' | 'NEUTRAL' | 'CRITICAL' | 'SPAM_SUSPECTED' | string;
  status: 'APPROVED' | 'FLAGGED' | 'REMOVED' | string;
  verifiedPurchase?: boolean;
  orderId?: string;
  photos?: string[];
  merchantRebuttal?: string | null;
  auditReason?: string;
  name?: string;
  title?: string;
  createdAt: string;
  updatedAt?: string;
  metadata?: Record<string, unknown>;
}

export interface ReviewModerationFilterCriteria {
  search?: string;
  city?: string;
  rating?: string | number;
  status?: string;
  sentiment?: string;
  page?: number;
  limit?: number;
}
