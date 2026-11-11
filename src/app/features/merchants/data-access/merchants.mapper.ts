import { MerchantViewModel } from '../models/merchants-view.model';

export class MerchantsMapper {
  static toViewModel(dto: any): MerchantViewModel {
    return {
      id: dto.id || '',
      name: dto.name || dto.businessName || 'Merchant #' + dto.id,
      title: dto.title || dto.name || '',
      legalEntityName: dto.legalEntityName || dto.businessName || 'Entity ' + dto.id,
      phone: dto.phone || '+91 98765 43210',
      email: dto.email || 'merchant@nukkadnow.in',
      mode: dto.mode || 'RETAIL',
      status: dto.status || 'ACTIVE',
      locality: dto.locality || 'Dharampeth, Nagpur',
      address: dto.address || 'Nagpur, Maharashtra',
      fssaiNumber: dto.fssaiNumber,
      gstin: dto.gstin,
      outletsCount: dto.outletsCount || 1,
      activeProductsCount: dto.activeProductsCount || 0,
      joinedAt: dto.joinedAt || dto.createdAt || new Date().toISOString(),
      createdAt: dto.createdAt || dto.joinedAt || new Date().toISOString(),
      lastActiveAt: dto.lastActiveAt || new Date().toISOString(),
      suspensionReason: dto.suspensionReason
    };
  }
}
