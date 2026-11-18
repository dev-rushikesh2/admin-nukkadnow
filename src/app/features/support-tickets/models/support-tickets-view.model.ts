export interface SupportTicketMessage {
  id: string;
  sender: string;
  senderRole: 'CUSTOMER' | 'AGENT' | 'MERCHANT';
  text: string;
  timestamp: string;
  isInternal?: boolean;
}

export interface SupportTicketViewModel {
  id: string;
  ticketNumber: string;
  subject: string;
  category: 'ORDER_DELIVERY' | 'PAYMENT_REFUND' | 'MERCHANT_COMPLAINT' | 'APP_ISSUE';
  priority: 'URGENT_P1' | 'HIGH_P2' | 'NORMAL_P3' | 'LOW_P4';
  status: 'OPEN' | 'INVESTIGATING' | 'ESCALATED' | 'RESOLVED' | 'CLOSED';
  requesterType: 'CUSTOMER' | 'MERCHANT';
  requesterName: string;
  requesterPhone: string;
  city: string;
  locality: string;
  assignedAgentId: string;
  assignedAgentName: string;
  linkedOrderId?: string;
  linkedMerchantId?: string;
  linkedMerchantName?: string;
  slaDueAt: string;
  isSlaBreached: boolean;
  messages?: SupportTicketMessage[];
  name?: string;
  createdAt: string;
  updatedAt?: string;
  metadata?: Record<string, unknown>;
}

export interface SupportTicketFilterCriteria {
  search?: string;
  city?: string;
  status?: string;
  priority?: string;
  category?: string;
  page?: number;
  limit?: number;
}
