export interface BroadcastNotificationViewModel {
  id: string;
  name: string;
  channel: 'WHATSAPP' | 'SMS' | 'PUSH' | 'IN_APP_BANNER' | string;
  targetAudience: 'ALL_CUSTOMERS' | 'ALL_MERCHANTS' | 'CITY_CUSTOMERS' | 'CITY_MERCHANTS' | 'LOCALITY_CUSTOMERS' | string;
  targetCity: string;
  targetLocality: string;
  recipientCount: number;
  deliveryRatePercent: number;
  failureCount: number;
  status: 'SENT' | 'SCHEDULED' | 'FAILED' | string;
  messageTemplate: string;
  sentAt?: string;
  sentByOperatorName?: string;
  title?: string;
  createdAt: string;
  updatedAt?: string;
  metadata?: Record<string, unknown>;
}

export interface BroadcastNotificationFilterCriteria {
  search?: string;
  city?: string;
  channel?: string;
  status?: string;
  page?: number;
  limit?: number;
}
