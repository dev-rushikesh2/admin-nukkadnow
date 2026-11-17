export interface CatalogItemViewModel {
  id: string;
  name?: string;
  title?: string;
  category?: string;
  pricePaise?: number;
  priceFormatted?: string;
  compareAtPricePaise?: number;
  mrpFormatted?: string;
  outletId?: string;
  merchantName?: string;
  status: string; // APPROVED, FLAGGED, BLOCKED, TAKEN_DOWN
  isPriceCapped?: boolean;
  anomalyWarning?: string;
  createdAt: string;
  updatedAt?: string;
  metadata?: Record<string, unknown>;
}

export interface CatalogItemFilterCriteria {
  search?: string;
  status?: string;
  category?: string;
  page?: number;
  limit?: number;
}

export interface PriceCapRuleViewModel {
  id: string;
  scope: 'GLOBAL' | 'CATEGORY' | 'SUB_CATEGORY' | 'LOCALITY' | 'SPECIFIC_PRODUCT';
  targetKey: string;
  maxPricePaise: number;
  maxPriceFormatted: string;
  enforceMrpCap: boolean;
  reason: string;
  isActive: boolean;
  createdBy: string;
  createdAt: string;
}

export interface CreatePriceCapPayload {
  scope: 'GLOBAL' | 'CATEGORY' | 'SUB_CATEGORY' | 'LOCALITY' | 'SPECIFIC_PRODUCT';
  targetKey: string;
  maxPricePaise: number;
  enforceMrpCap?: boolean;
  reason: string;
}
