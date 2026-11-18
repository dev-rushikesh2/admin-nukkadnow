import { SupportTicketViewModel } from '../models/support-tickets-view.model';

export class SupportTicketsMapper {
  static toViewModel(dto: any): SupportTicketViewModel {
    const defaultMessages = [
      {
        id: 'msg-1',
        sender: dto.requesterName || 'Customer',
        senderRole: 'CUSTOMER' as const,
        text: dto.subject || 'Hello, I need assistance regarding my recent order.',
        timestamp: dto.createdAt || new Date().toISOString(),
      },
      {
        id: 'msg-2',
        sender: 'Support Desk Bot',
        senderRole: 'AGENT' as const,
        text: 'Your ticket has been assigned to support staff. An agent is reviewing the merchant logs.',
        timestamp: dto.createdAt || new Date().toISOString(),
        isInternal: true,
      }
    ];

    return {
      id: dto.id || '',
      ticketNumber: dto.ticketNumber || 'TCK-' + (dto.id || '101'),
      subject: dto.subject || dto.title || 'Support Request #' + dto.id,
      category: dto.category || 'ORDER_DELIVERY',
      priority: dto.priority || 'NORMAL_P3',
      status: dto.status || 'OPEN',
      requesterType: dto.requesterType || 'CUSTOMER',
      requesterName: dto.requesterName || dto.customerName || 'Customer',
      requesterPhone: dto.requesterPhone || '+91 98230 00000',
      city: dto.city || 'Nagpur',
      locality: dto.locality || 'Sitabuldi',
      assignedAgentId: dto.assignedAgentId || 'staff-ngp-001',
      assignedAgentName: dto.assignedAgentName || 'Vikram Support Agent',
      linkedOrderId: dto.linkedOrderId || dto.orderId,
      linkedMerchantId: dto.linkedMerchantId || dto.merchantId,
      linkedMerchantName: dto.linkedMerchantName || dto.merchantName || 'Patil Fresh Sabji Mandi',
      slaDueAt: dto.slaDueAt || new Date(Date.now() + 2 * 3600 * 1000).toISOString(),
      isSlaBreached: Boolean(dto.isSlaBreached),
      messages: dto.messages || defaultMessages,
      name: dto.name || dto.subject || `Ticket ${dto.id}`,
      createdAt: dto.createdAt || new Date().toISOString(),
      updatedAt: dto.updatedAt,
      metadata: dto.metadata || {}
    };
  }
}
