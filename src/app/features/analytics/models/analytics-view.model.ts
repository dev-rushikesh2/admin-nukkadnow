export interface LocalityBreakdown {
  locality: string;
  gmvPaise: number;
  ordersCount: number;
  sharePercent: number;
}

export interface TopMerchantMetric {
  id: string;
  name: string;
  city: string;
  orders: number;
  gmvPaise: number;
}

export interface PlatformAnalyticsViewModel {
  id: string;
  city: string;
  range: 'TODAY' | '7D' | 'MTD' | 'CUSTOM' | string;
  todayGmvPaise: number;
  commissionEarnedPaise: number;
  merchantPayoutsPaise: number;
  totalOrders: number;
  averageOrderValuePaise: number;
  activeMerchants: number;
  localityBreakdown?: LocalityBreakdown[];
  topMerchants?: TopMerchantMetric[];
  name?: string;
  title?: string;
  status: string;
  createdAt?: string;
  updatedAt?: string;
  metadata?: Record<string, unknown>;
}

export interface PlatformAnalyticsFilterCriteria {
  city?: string;
  range?: string;
  search?: string;
  status?: string;
  page?: number;
  limit?: number;
}
