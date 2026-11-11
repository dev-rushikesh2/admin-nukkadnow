import { RefundDisputeViewModel } from '../models/refunds-disputes-view.model';

export class RefundsDisputesMapper {
  static toViewModel(dto: any): RefundDisputeViewModel {
    return {
      id: dto.id || '',
      name: dto.name || 'Dispute #' + dto.id,
      title: dto.title || dto.name || '',
      orderId: dto.orderId || 'ord_001',
      merchantId: dto.merchantId || 'm_001',
      merchantName: dto.merchantName || 'Local Merchant',
      customerId: dto.customerId || 'c_001',
      customerName: dto.customerName || 'Customer',
      amountPaise: dto.amountPaise || 0,
      reasonCode: dto.reasonCode || 'QUALITY_ISSUE',
      customerClaim: dto.customerClaim || 'Item was not as described',
      merchantRebuttal: dto.merchantRebuttal,
      evidencePhotoUrls: dto.evidencePhotoUrls || [],
      status: dto.status || 'PENDING_FIRST_APPROVAL',
      firstApprover: dto.firstApprover,
      secondApprover: dto.secondApprover,
      createdAt: dto.createdAt || new Date().toISOString(),
      requiresDualSign: (dto.amountPaise || 0) > 500000
    };
  }
}
