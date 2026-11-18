export type OrderStatus =
  | 'PENDING_PAYMENT'
  | 'CONFIRMED'
  | 'IN_PREPARATION'
  | 'READY_FOR_PICKUP'
  | 'HANDED_OVER'
  | 'FORCE_CANCELLED';

export interface OrderItemViewModel {
  productId: string;
  name: string;
  quantity: number;
  unitPricePaise: number;
  totalPaise: number;
  variantTitle?: string;
  cookingInstructions?: string;
}

export interface OrderTimelineEvent {
  status: OrderStatus;
  title: string;
  timestamp: string;
  actor: string;
  notes?: string;
}

export interface AdminOrderViewModel {
  id: string;
  name?: string;
  title?: string;
  createdAt?: string;
  merchantId: string;
  merchantName: string;
  outletId: string;
  locality: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  pickupToken: string;
  pickupSlot: string;
  status: OrderStatus;
  items: OrderItemViewModel[];
  subtotalPaise: number;
  taxPaise: number;
  platformFeePaise: number;
  totalPaise: number;
  paymentMethod: string;
  paymentRef: string;
  placedAt: string;
  timeline: OrderTimelineEvent[];
  cancellationReason?: string;
}

export interface OrderFilterCriteria {
  search?: string;
  status?: string;
  locality?: string;
  page?: number;
  limit?: number;
}

export type AdminOrderFilterCriteria = OrderFilterCriteria;
