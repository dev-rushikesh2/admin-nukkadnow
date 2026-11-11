import { Injectable, inject } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map, delay } from 'rxjs/operators';
import { MerchantViewModel, MerchantFilterCriteria } from '../models/merchants-view.model';
import { PaginatedResult } from '@nukkadnow/admin-api-client';
import { AuditLoggerService } from '../../../core/audit-context/audit-logger.service';

@Injectable({
  providedIn: 'root',
})
export class MerchantsRepository {
  private readonly auditLogger = inject(AuditLoggerService);

  private mockMerchants: MerchantViewModel[] = [
    {
      id: 'MER-NGP-101',
      name: 'Nagpur Sweet Mart',
      legalEntityName: 'Nagpur Sweet Mart LLP',
      phone: '+919822100001',
      email: 'owner@nagpursweets.in',
      mode: 'FOOD_STALL',
      status: 'ACTIVE',
      locality: 'Dharampeth',
      address: 'Plot 42, West High Court Road, Dharampeth, Nagpur - 440010',
      fssaiNumber: '11521054000101',
      gstin: '27AABCN1234F1Z5',
      outletsCount: 2,
      activeProductsCount: 38,
      joinedAt: '2026-09-01T10:00:00Z',
      lastActiveAt: '2026-11-11T14:30:00Z',
    },
    {
      id: 'MER-NGP-102',
      name: 'Haldiram Foods & Sweets',
      legalEntityName: 'Haldiram Snacks Pvt Ltd',
      phone: '+919822100002',
      email: 'ops@haldiramnagpur.in',
      mode: 'RETAIL',
      status: 'ACTIVE',
      locality: 'Sadar',
      address: 'Shop 12-14, Residency Road, Sadar, Nagpur - 440001',
      fssaiNumber: '11521054000102',
      gstin: '27AAACH8821B1Z9',
      outletsCount: 4,
      activeProductsCount: 112,
      joinedAt: '2026-08-15T09:00:00Z',
      lastActiveAt: '2026-11-11T15:45:00Z',
    },
    {
      id: 'MER-NGP-103',
      name: 'Aaji’s Homemade Modak & Pickles',
      legalEntityName: 'Priya Kulkarni Enterprise',
      phone: '+919822100003',
      email: 'priya.modak@gmail.com',
      mode: 'HOME_MAKER',
      status: 'ACTIVE',
      locality: 'Ramdaspeth',
      address: 'Flat 302, Shanti Vihar, Canal Road, Ramdaspeth [RESTRICTED_PII]',
      fssaiNumber: '21524054000889',
      outletsCount: 1,
      activeProductsCount: 8,
      joinedAt: '2026-10-05T11:00:00Z',
      lastActiveAt: '2026-11-11T12:00:00Z',
    },
    {
      id: 'MER-NGP-104',
      name: 'Apna Kirana & Grains',
      legalEntityName: 'Patel Trading Co.',
      phone: '+919822100004',
      email: 'patel.kirana@gmail.com',
      mode: 'RETAIL',
      status: 'SUSPENDED',
      locality: 'Sitabuldi',
      address: 'Main Market, Sitabuldi, Nagpur - 440012',
      fssaiNumber: '11521054000456',
      gstin: '27AAPPP4321A1Z2',
      outletsCount: 1,
      activeProductsCount: 0,
      joinedAt: '2026-09-12T08:00:00Z',
      lastActiveAt: '2026-11-08T18:00:00Z',
      suspensionReason: 'SUSPECTED_FRAUD: Inconsistent inventory logs and customer payment chargeback spike.',
    },
    {
      id: 'MER-NGP-105',
      name: 'Vidarbha Organic Farm Fresh',
      legalEntityName: 'Vidarbha Agri Producer Co.',
      phone: '+919822100005',
      email: 'contact@vidarbhaorganic.in',
      mode: 'ARTISAN',
      status: 'ACTIVE',
      locality: 'Wardha Road',
      address: 'Somalwada Square, Wardha Road, Nagpur - 440025',
      outletsCount: 1,
      activeProductsCount: 24,
      joinedAt: '2026-10-18T10:30:00Z',
      lastActiveAt: '2026-11-11T16:10:00Z',
    },
    {
      id: 'MER-NGP-106',
      name: 'Diwali Lanterns & Diyas Pop-up',
      legalEntityName: 'Sharma Artisan Guild',
      phone: '+919822100006',
      email: 'diwali.pop@gmail.com',
      mode: 'SEASONAL',
      status: 'PENDING_VERIFICATION',
      locality: 'Mahal',
      address: 'Near Gandhi Gate, Mahal, Nagpur - 440032',
      outletsCount: 1,
      activeProductsCount: 15,
      joinedAt: '2026-11-09T14:00:00Z',
      lastActiveAt: '2026-11-10T11:20:00Z',
    },
  ];

  fetchItems(filters?: MerchantFilterCriteria): Observable<PaginatedResult<MerchantViewModel>> {
    let items = [...this.mockMerchants];

    if (filters?.search) {
      const q = filters.search.toLowerCase();
      items = items.filter((m) =>
        m.name.toLowerCase().includes(q) ||
        m.id.toLowerCase().includes(q) ||
        m.locality.toLowerCase().includes(q)
      );
    }

    if (filters?.status) {
      items = items.filter((m) => m.status === filters.status);
    }

    if (filters?.mode) {
      items = items.filter((m) => m.mode === filters.mode);
    }

    const total = items.length;
    const page = filters?.page || 1;
    const limit = filters?.limit || 20;

    return of({
      items,
      total,
      page,
      limit,
      hasMore: false,
    }).pipe(delay(100));
  }

  fetchById(id: string): Observable<MerchantViewModel> {
    const item = this.mockMerchants.find((m) => m.id === id) || this.mockMerchants[0];
    return of(item).pipe(delay(50));
  }

  suspendMerchant(id: string, reasonCode: string, justification: string, stepUpTicket: string): Observable<MerchantViewModel> {
    const item = this.mockMerchants.find((m) => m.id === id);
    if (item) {
      item.status = 'SUSPENDED';
      item.suspensionReason = `${reasonCode}: ${justification}`;

      this.auditLogger.logAction({
        action: 'MERCHANT_SUSPENDED',
        targetEntity: 'Merchant',
        targetId: id,
        reasonCode,
        justification,
        metadata: { stepUpTicket: stepUpTicket.slice(0, 10) + '...' },
      });
    }
    return of(item!).pipe(delay(200));
  }

  activateMerchant(id: string): Observable<MerchantViewModel> {
    const item = this.mockMerchants.find((m) => m.id === id);
    if (item) {
      item.status = 'ACTIVE';
      item.suspensionReason = undefined;

      this.auditLogger.logAction({
        action: 'MERCHANT_ACTIVATED',
        targetEntity: 'Merchant',
        targetId: id,
        reasonCode: 'ROUTINE_AUDIT',
        justification: 'Compliance clearance completed by operator',
      });
    }
    return of(item!).pipe(delay(200));
  }
}
