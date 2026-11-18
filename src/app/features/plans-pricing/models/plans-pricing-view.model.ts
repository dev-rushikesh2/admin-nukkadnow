export interface PricingPlanViewModel {
  id: string;
  title: string;
  name?: string;
  monthlyPricePaise: number;
  monthlyPriceFormatted: string;
  annualPricePaise: number;
  annualPriceFormatted: string;
  isPopular: boolean;
  maxOutlets: number;
  maxCatalogSkus: number;
  commissionDiscountBps: number;
  prioritySupport: boolean;
  entitlements: string[];
  status: 'ACTIVE' | 'ARCHIVED';
  createdAt: string;
  updatedAt?: string;
  metadata?: Record<string, unknown>;
}

export interface PricingPlanFilterCriteria {
  search?: string;
  status?: string;
  page?: number;
  limit?: number;
}
