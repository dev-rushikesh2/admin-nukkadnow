import { PlatformAnalyticsViewModel } from '../models/analytics-view.model';

export class AnalyticsMapper {
  static toViewModel(dto: any): PlatformAnalyticsViewModel {
    return {
      id: dto.id || 'ANL-' + (dto.city || 'GLOBAL'),
      city: dto.city || 'GLOBAL',
      range: dto.range || 'MTD',
      todayGmvPaise: Number(dto.todayGmvPaise) || 0,
      commissionEarnedPaise: Number(dto.commissionEarnedPaise) || 0,
      merchantPayoutsPaise: Number(dto.merchantPayoutsPaise) || 0,
      totalOrders: Number(dto.totalOrders) || 0,
      averageOrderValuePaise: Number(dto.averageOrderValuePaise) || 0,
      activeMerchants: Number(dto.activeMerchants) || 0,
      localityBreakdown: Array.isArray(dto.localityBreakdown) ? dto.localityBreakdown : [],
      topMerchants: Array.isArray(dto.topMerchants) ? dto.topMerchants : [],
      name: `${dto.city || 'Global'} Platform Telemetry (${dto.range || 'MTD'})`,
      title: `${dto.city || 'Global'} Financial Telemetry`,
      status: 'VERIFIED',
      createdAt: dto.createdAt || new Date().toISOString(),
      updatedAt: dto.updatedAt,
      metadata: dto.metadata || {},
    };
  }
}
