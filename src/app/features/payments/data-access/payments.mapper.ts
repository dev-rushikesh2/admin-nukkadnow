import { PaymentTransactionViewModel } from '../models/payments-view.model';

export class PaymentsMapper {
  static toViewModel(dto: any): PaymentTransactionViewModel {
    const amountPaise = typeof dto.amountPaise === 'number' ? dto.amountPaise : (dto.amount ? Math.round(dto.amount * 100) : 64500);
    const amountFormatted = dto.amountFormatted || `₹${(amountPaise / 100).toFixed(2)}`;

    return {
      id: dto.id || '',
      orderId: dto.orderId || 'ORD-NGP-' + dto.id,
      customerName: dto.customerName || 'Customer ' + (dto.id || ''),
      merchantName: dto.merchantName || 'Local Merchant',
      city: dto.city || 'Nagpur',
      locality: dto.locality || 'Sitabuldi',
      amountPaise,
      amountFormatted,
      paymentMethod: dto.paymentMethod || 'UPI',
      gatewayRef: dto.gatewayRef || 'pay_' + (dto.id || 'rzp'),
      status: dto.status || 'CAPTURED',
      escrowStatus: dto.escrowStatus || 'RELEASED',
      escrowReleaseDate: dto.escrowReleaseDate || new Date().toISOString(),
      webhookDelivered: dto.webhookDelivered !== undefined ? dto.webhookDelivered : true,
      webhookPayloadSanitized: dto.webhookPayloadSanitized || {
        event: 'payment.captured',
        entity: 'event',
        contains: ['payment'],
        payload: {
          payment: {
            entity: {
              id: dto.gatewayRef || 'pay_test',
              amount: amountPaise,
              currency: 'INR',
              status: 'captured',
              method: dto.paymentMethod?.toLowerCase() || 'upi',
            }
          }
        }
      },
      name: dto.name || `Payment ${dto.id} (${amountFormatted})`,
      createdAt: dto.createdAt || new Date().toISOString(),
      updatedAt: dto.updatedAt,
      metadata: dto.metadata || {}
    };
  }
}
