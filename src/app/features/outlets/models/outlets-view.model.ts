export interface OutletViewModel {
  id: string;
  storeName: string;
  name?: string;
  merchantId: string;
  merchantName: string;
  locality: string;
  city: string;
  address: string;
  phone: string;
  hourlyCapacity: number;
  currentHourlyOrders: number;
  capacityUtilizationPct: number;
  status: 'OPEN' | 'BUSY' | 'PAUSED' | 'CLOSED';
  isThrottled: boolean;
  openingTime: string;
  closingTime: string;
  weeklySchedule?: { day: string; open: string; close: string; isOpen: boolean }[];
  createdAt: string;
  updatedAt?: string;
  metadata?: Record<string, unknown>;
}

export interface OutletFilterCriteria {
  search?: string;
  city?: string;
  locality?: string;
  status?: string;
  page?: number;
  limit?: number;
}
