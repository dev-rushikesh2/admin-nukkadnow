import { Injectable, inject } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { MerchantVerificationViewModel, VerificationFilterCriteria } from '../models/merchant-verification-view.model';
import { PaginatedResult } from '@nukkadnow/admin-api-client';
import { AuditLoggerService } from '../../../core/audit-context/audit-logger.service';

@Injectable({
  providedIn: 'root',
})
export class MerchantVerificationRepository {
  private readonly auditLogger = inject(AuditLoggerService);

  private mockVerifications: MerchantVerificationViewModel[] = [
    {
      id: 'KYC-NGP-501',
      merchantId: 'MER-NGP-106',
      businessName: 'Diwali Lanterns & Diyas Pop-up',
      legalEntityName: 'Sharma Artisan Guild',
      locality: 'Mahal',
      phone: '+919822100006',
      mode: 'SEASONAL',
      submittedAt: '2026-11-10T14:00:00Z',
      slaExpiresAt: '2026-11-11T18:00:00Z',
      status: 'SUBMITTED',
      documents: [
        {
          type: 'PAN_CARD',
          title: 'Proprietor PAN Card',
          documentNumber: 'AAAPS4321K',
          fileUrl: '/assets/mock/pan-card.png',
          verified: true,
        },
        {
          type: 'BANK_PASSBOOK',
          title: 'Bank Statement / Cancelled Cheque',
          documentNumber: 'SBIN0001234',
          fileUrl: '/assets/mock/bank-cheque.png',
          verified: true,
        },
        {
          type: 'STOREFRONT_PHOTO',
          title: 'Storefront GPS Verification',
          fileUrl: '/assets/mock/storefront.png',
          verified: false,
          notes: 'Ensure GPS geo-tag matches Mahal locality polygon.',
        },
      ],
      bankPennyDrop: {
        accountNumberMasked: '*******4482',
        ifscCode: 'SBIN0001234',
        bankName: 'State Bank of India (Mahal Branch)',
        beneficiaryNameMatch: 'SHARMA ARTISAN GUILD',
        registeredBusinessName: 'Sharma Artisan Guild',
        isMatch: true,
        verifiedAt: '2026-11-10T14:05:00Z',
      },
    },
    {
      id: 'KYC-NGP-502',
      merchantId: 'MER-NGP-108',
      businessName: 'Shree Krishna Sweets & Farsan',
      legalEntityName: 'Shree Krishna Foods LLP',
      locality: 'Sadar',
      phone: '+919822100008',
      mode: 'FOOD_STALL',
      submittedAt: '2026-11-11T09:30:00Z',
      slaExpiresAt: '2026-11-11T19:30:00Z',
      status: 'IN_REVIEW',
      documents: [
        {
          type: 'FSSAI_LICENSE',
          title: 'FSSAI 14-Digit Food Safety License',
          documentNumber: '11521054000888',
          fileUrl: '/assets/mock/fssai-license.png',
          verified: true,
        },
        {
          type: 'GSTIN_CERTIFICATE',
          title: 'GST Registration Certificate',
          documentNumber: '27AABCS9912A1Z1',
          fileUrl: '/assets/mock/gstin-cert.png',
          verified: true,
        },
        {
          type: 'PAN_CARD',
          title: 'Business PAN Card',
          documentNumber: 'AABCS9912A',
          fileUrl: '/assets/mock/pan-card.png',
          verified: true,
        },
      ],
      bankPennyDrop: {
        accountNumberMasked: '*******9012',
        ifscCode: 'HDFC0000128',
        bankName: 'HDFC Bank (Sadar Branch)',
        beneficiaryNameMatch: 'SHREE KRISHNA FOODS LLP',
        registeredBusinessName: 'Shree Krishna Foods LLP',
        isMatch: true,
        verifiedAt: '2026-11-11T09:32:00Z',
      },
    },
  ];

  fetchItems(filters?: VerificationFilterCriteria): Observable<PaginatedResult<MerchantVerificationViewModel>> {
    let items = [...this.mockVerifications];
    if (filters?.search) {
      const q = filters.search.toLowerCase();
      items = items.filter((v) =>
        v.businessName.toLowerCase().includes(q) ||
        v.id.toLowerCase().includes(q)
      );
    }
    return of({
      items,
      total: items.length,
      page: 1,
      limit: 20,
      hasMore: false,
    }).pipe(delay(80));
  }

  fetchById(id: string): Observable<MerchantVerificationViewModel> {
    const item = this.mockVerifications.find((v) => v.id === id) || this.mockVerifications[0];
    return of(item).pipe(delay(50));
  }

  approveVerification(id: string, operatorNotes: string): Observable<MerchantVerificationViewModel> {
    const item = this.mockVerifications.find((v) => v.id === id);
    if (item) {
      item.status = 'VERIFIED';
      this.auditLogger.logAction({
        action: 'KYC_APPROVED',
        targetEntity: 'MerchantVerification',
        targetId: id,
        reasonCode: 'COMPLIANCE_CLEARANCE',
        justification: operatorNotes || 'All FSSAI, GSTIN and Bank Penny-Drop documents verified.',
      });
    }
    return of(item!).pipe(delay(150));
  }

  rejectVerification(id: string, reasonCode: string, justification: string): Observable<MerchantVerificationViewModel> {
    const item = this.mockVerifications.find((v) => v.id === id);
    if (item) {
      item.status = 'REJECTED';
      item.rejectionReason = `${reasonCode}: ${justification}`;
      this.auditLogger.logAction({
        action: 'KYC_REJECTED',
        targetEntity: 'MerchantVerification',
        targetId: id,
        reasonCode,
        justification,
      });
    }
    return of(item!).pipe(delay(150));
  }
}
