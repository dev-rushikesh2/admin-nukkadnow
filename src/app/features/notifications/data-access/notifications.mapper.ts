import { BroadcastNotificationViewModel } from '../models/notifications-view.model';

export class NotificationsMapper {
  static toViewModel(dto: any): BroadcastNotificationViewModel {
    return {
      id: dto.id || '',
      name: dto.name || dto.title || 'Broadcast Campaign #' + dto.id,
      channel: dto.channel || 'WHATSAPP',
      targetAudience: dto.targetAudience || 'ALL_CUSTOMERS',
      targetCity: dto.targetCity || 'GLOBAL',
      targetLocality: dto.targetLocality || 'ALL',
      recipientCount: Number(dto.recipientCount) || 0,
      deliveryRatePercent: Number(dto.deliveryRatePercent) || 98.5,
      failureCount: Number(dto.failureCount) || 0,
      status: dto.status || 'SENT',
      messageTemplate: dto.messageTemplate || dto.text || '',
      sentAt: dto.sentAt || dto.createdAt,
      sentByOperatorName: dto.sentByOperatorName || 'Platform Operator',
      title: dto.name || dto.title || 'Broadcast Campaign',
      createdAt: dto.createdAt || new Date().toISOString(),
      updatedAt: dto.updatedAt,
      metadata: dto.metadata || {},
    };
  }
}
