import { ReviewModerationViewModel } from '../models/reviews-moderation-view.model';

export class ReviewsModerationMapper {
  static toViewModel(dto: any): ReviewModerationViewModel {
    return {
      id: dto.id || '',
      customerName: dto.customerName || 'Anonymous Customer',
      customerPhone: dto.customerPhone,
      merchantId: dto.merchantId || '',
      merchantName: dto.merchantName || 'Local Store',
      city: dto.city || 'Nagpur',
      locality: dto.locality || 'General',
      rating: Number(dto.rating) || 5,
      comment: dto.comment || '',
      sentiment: dto.sentiment || 'POSITIVE',
      status: dto.status || 'APPROVED',
      verifiedPurchase: dto.verifiedPurchase !== false,
      orderId: dto.orderId,
      photos: Array.isArray(dto.photos) ? dto.photos : [],
      merchantRebuttal: dto.merchantRebuttal || null,
      auditReason: dto.auditReason,
      name: `${dto.customerName || 'Customer'} on ${dto.merchantName || 'Store'}`,
      title: `${dto.rating || 5}★ Review for ${dto.merchantName || 'Store'}`,
      createdAt: dto.createdAt || new Date().toISOString(),
      updatedAt: dto.updatedAt,
      metadata: dto.metadata || {},
    };
  }
}
