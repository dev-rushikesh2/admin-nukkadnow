import { MerchantSubscriptionViewModel } from '../models/subscriptions-view.model';

export class SubscriptionsMapper {
  static toViewModel(dto: any): MerchantSubscriptionViewModel {
    const mrrPaise = typeof dto.mrrPaise === 'number' ? dto.mrrPaise : (dto.amount ? Math.round(dto.amount * 100) : 99900);
    const mrrFormatted = dto.mrrFormatted || `₹${(mrrPaise / 100).toFixed(2)}/mo`;

    return {
      id: dto.id || '',
      merchantId: dto.merchantId || '',
      merchantName: dto.merchantName || 'Partner Merchant',
      city: dto.city || 'Nagpur',
      locality: dto.locality || 'Sitabuldi',
      planId: dto.planId || 'plan-growth',
      planName: dto.planName || 'Growth Tier',
      mrrPaise,
      mrrFormatted,
      billingCycle: dto.billingCycle || 'MONTHLY',
      status: dto.status || 'ACTIVE',
      nextBillingDate: dto.nextBillingDate || '2026-12-01T00:00:00Z',
      gracePeriodDays: typeof dto.gracePeriodDays === 'number' ? dto.gracePeriodDays : 7,
      invoices: dto.invoices || [
        { id: `INV-${dto.id || '01'}-1`, amount: mrrFormatted, date: '2026-11-01', status: 'PAID' },
        { id: `INV-${dto.id || '01'}-2`, amount: mrrFormatted, date: '2026-10-01', status: 'PAID' },
      ],
      name: dto.name || `${dto.merchantName || 'Merchant'} (${dto.planName || 'Growth'})`,
      createdAt: dto.createdAt || new Date().toISOString(),
      updatedAt: dto.updatedAt,
      metadata: dto.metadata || {}
    };
  }
}
