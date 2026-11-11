export type SellerMode = 'RETAIL' | 'FOOD_STALL' | 'HOME_MAKER' | 'SEASONAL' | 'ARTISAN';
export type MerchantLifecycleStatus = 'ONBOARDING' | 'PENDING_VERIFICATION' | 'ACTIVE' | 'SUSPENDED' | 'TERMINATED';

export interface MerchantViewModel {
  id: string;
  name: string;
  title?: string;
  legalEntityName: string;
  phone: string;
  email: string;
  mode: SellerMode;
  status: MerchantLifecycleStatus;
  locality: string;
  address: string;
  fssaiNumber?: string;
  gstin?: string;
  outletsCount: number;
  activeProductsCount: number;
  joinedAt: string;
  createdAt?: string;
  lastActiveAt: string;
  suspensionReason?: string;
}

export interface MerchantFilterCriteria {
  search?: string;
  status?: string;
  mode?: string;
  locality?: string;
  page?: number;
  limit?: number;
}
