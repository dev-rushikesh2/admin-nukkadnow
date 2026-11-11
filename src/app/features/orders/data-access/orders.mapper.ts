import { AdminOrderViewModel } from '../models/orders-view.model';

export class OrdersMapper {
  static toViewModel(dto: any): AdminOrderViewModel {
    return {
      id: dto.id || '',
      name: dto.name || 'Order #' + dto.id,
      title: dto.title || dto.name || '',
      createdAt: dto.createdAt || dto.placedAt || new Date().toISOString(),
      merchantId: dto.merchantId || '',
      merchantName: dto.merchantName || 'Local Merchant',
      outletId: dto.outletId || '',
      locality: dto.locality || 'Dharampeth, Nagpur',
      customerId: dto.customerId || '',
      customerName: dto.customerName || 'Customer',
      customerPhone: dto.customerPhone || '+91 98765 00000',
      pickupToken: dto.pickupToken || '#NK-001',
      pickupSlot: dto.pickupSlot || '10:00 AM - 10:30 AM',
      status: dto.status || 'CONFIRMED',
      items: dto.items || [],
      subtotalPaise: dto.subtotalPaise || 0,
      taxPaise: dto.taxPaise || 0,
      platformFeePaise: dto.platformFeePaise || 0,
      totalPaise: dto.totalPaise || 0,
      paymentMethod: dto.paymentMethod || 'UPI',
      paymentRef: dto.paymentRef || 'pay_demo_123',
      placedAt: dto.placedAt || dto.createdAt || new Date().toISOString(),
      timeline: dto.timeline || [],
      cancellationReason: dto.cancellationReason
    };
  }
}
