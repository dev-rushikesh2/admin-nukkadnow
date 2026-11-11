import { MerchantVerificationViewModel } from '../models/merchant-verification-view.model';

export class MerchantVerificationMapper {
  static toViewModel(dto: any): MerchantVerificationViewModel {
    return {
      id: dto.id || '',
      merchantId: dto.merchantId || dto.id || '',
      businessName: dto.businessName || dto.name || '',
      legalEntityName: dto.legalEntityName || dto.businessName || '',
      locality: dto.locality || 'Dharampeth, Nagpur',
      phone: dto.phone || '+91 98765 43210',
      mode: dto.mode || 'RETAIL',
      submittedAt: dto.submittedAt || dto.createdAt || new Date().toISOString(),
      slaExpiresAt: dto.slaExpiresAt || new Date(Date.now() + 86400000).toISOString(),
      status: dto.status || 'SUBMITTED',
      documents: dto.documents || [],
      bankPennyDrop: dto.bankPennyDrop || {
        accountNumberMasked: '•••• •••• 9012',
        ifscCode: 'HDFC0001234',
        bankName: 'HDFC Bank',
        beneficiaryNameMatch: dto.businessName || 'Merchant',
        registeredBusinessName: dto.legalEntityName || dto.businessName || 'Merchant Entity',
        isMatch: true,
        verifiedAt: new Date().toISOString()
      },
      name: dto.name || dto.businessName || '',
      createdAt: dto.createdAt || dto.submittedAt || new Date().toISOString()
    };
  }
}
