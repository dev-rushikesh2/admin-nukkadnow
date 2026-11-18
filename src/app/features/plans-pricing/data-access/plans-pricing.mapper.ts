import { PricingPlanViewModel } from '../models/plans-pricing-view.model';

export class PlansPricingMapper {
  static toViewModel(dto: any): PricingPlanViewModel {
    const monthlyPricePaise = typeof dto.monthlyPricePaise === 'number' ? dto.monthlyPricePaise : (dto.price ? Math.round(dto.price * 100) : 99900);
    const annualPricePaise = typeof dto.annualPricePaise === 'number' ? dto.annualPricePaise : (monthlyPricePaise * 10);
    const monthlyPriceFormatted = dto.monthlyPriceFormatted || (monthlyPricePaise === 0 ? '₹0' : `₹${Math.round(monthlyPricePaise / 100)}`);
    const annualPriceFormatted = dto.annualPriceFormatted || (annualPricePaise === 0 ? '₹0' : `₹${Math.round(annualPricePaise / 100)}`);

    return {
      id: dto.id || '',
      title: dto.title || dto.name || 'Plan Tier #' + dto.id,
      name: dto.name || dto.title || 'Plan Tier #' + dto.id,
      monthlyPricePaise,
      monthlyPriceFormatted,
      annualPricePaise,
      annualPriceFormatted,
      isPopular: Boolean(dto.isPopular),
      maxOutlets: typeof dto.maxOutlets === 'number' ? dto.maxOutlets : 1,
      maxCatalogSkus: typeof dto.maxCatalogSkus === 'number' ? dto.maxCatalogSkus : 100,
      commissionDiscountBps: typeof dto.commissionDiscountBps === 'number' ? dto.commissionDiscountBps : 0,
      prioritySupport: Boolean(dto.prioritySupport),
      entitlements: dto.entitlements || [
        'Hyperlocal store listing in 1 micro-market',
        'Standard commission take-rate schedule',
        'Live order soundbox & printer telemetry',
        'Direct UPI & gateway daily settlement'
      ],
      status: dto.status || 'ACTIVE',
      createdAt: dto.createdAt || new Date().toISOString(),
      updatedAt: dto.updatedAt,
      metadata: dto.metadata || {}
    };
  }
}
