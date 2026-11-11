import { Injectable, inject } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { RefundDisputeViewModel, RefundFilterCriteria } from '../models/refunds-disputes-view.model';
import { PaginatedResult } from '@nukkadnow/admin-api-client';
import { AuditLoggerService } from '../../../core/audit-context/audit-logger.service';

@Injectable({
  providedIn: 'root',
})
export class RefundsDisputesRepository {
  private readonly auditLogger = inject(AuditLoggerService);

  private mockRefunds: RefundDisputeViewModel[] = [
    {
      id: 'REF-NGP-781',
      orderId: 'ORD-NGP-9819',
      merchantId: 'MER-NGP-104',
      merchantName: 'Apna Kirana & Grains',
      customerId: 'CUST-3310',
      customerName: 'Sunil Patil',
      amountPaise: 85000, // ₹ 850 (Low-tier: 1 sign-off)
      reasonCode: 'STORE_CLOSED',
      customerClaim: 'Arrived at pickup counter at 15:35; store shutters down and locked.',
      merchantRebuttal: 'Power outage in Sitabuldi market forced early shutdown.',
      evidencePhotoUrls: ['/assets/mock/closed-shutter.jpg'],
      status: 'PENDING_FIRST_APPROVAL',
      createdAt: '2026-11-11T15:40:00Z',
      requiresDualSign: false,
    },
    {
      id: 'REF-NGP-782',
      orderId: 'ORD-NGP-9700',
      merchantId: 'MER-NGP-102',
      merchantName: 'Haldiram Foods & Sweets',
      customerId: 'CUST-1044',
      customerName: 'Vikramaditya Rao',
      amountPaise: 750000, // ₹ 7,500 (> ₹5,000: strictly requires Four-Eyes Dual Approval)
      reasonCode: 'DAMAGED_LARGE_ORDER',
      customerClaim: '10 kg bulk wedding sweet boxes contaminated/crushed during packing.',
      merchantRebuttal: 'Boxes were intact upon handover; customer dropped package.',
      evidencePhotoUrls: ['/assets/mock/damaged-boxes.jpg'],
      status: 'PENDING_SECOND_APPROVAL',
      firstApprover: {
        operatorId: 'operator-supp-04',
        operatorName: 'Ananya Support Lead',
        approvedAt: '2026-11-11T13:10:00Z',
      },
      createdAt: '2026-11-11T12:00:00Z',
      requiresDualSign: true,
    },
  ];

  fetchItems(filters?: RefundFilterCriteria): Observable<PaginatedResult<RefundDisputeViewModel>> {
    let items = [...this.mockRefunds];
    if (filters?.search) {
      const q = filters.search.toLowerCase();
      items = items.filter((r) =>
        r.id.toLowerCase().includes(q) ||
        r.orderId.toLowerCase().includes(q) ||
        r.merchantName.toLowerCase().includes(q)
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

  fetchById(id: string): Observable<RefundDisputeViewModel> {
    const item = this.mockRefunds.find((r) => r.id === id) || this.mockRefunds[0];
    return of(item).pipe(delay(50));
  }

  approveFirstSign(id: string, operatorId: string, operatorName: string, reasonCode: string, justification: string): Observable<RefundDisputeViewModel> {
    const item = this.mockRefunds.find((r) => r.id === id);
    if (item) {
      if (item.requiresDualSign) {
        item.status = 'PENDING_SECOND_APPROVAL';
        item.firstApprover = { operatorId, operatorName, approvedAt: new Date().toISOString() };
      } else {
        item.status = 'APPROVED_DISPATCHED';
      }

      this.auditLogger.logAction({
        action: 'REFUND_FIRST_SIGN_APPROVED',
        targetEntity: 'RefundDispute',
        targetId: id,
        reasonCode,
        justification,
        metadata: { amountPaise: item.amountPaise },
      });
    }
    return of(item!).pipe(delay(150));
  }

  approveSecondSign(id: string, operatorId: string, operatorName: string, stepUpTicket: string, justification: string): Observable<RefundDisputeViewModel> {
    const item = this.mockRefunds.find((r) => r.id === id);
    if (item) {
      item.status = 'APPROVED_DISPATCHED';
      item.secondApprover = { operatorId, operatorName, approvedAt: new Date().toISOString() };

      this.auditLogger.logAction({
        action: 'REFUND_SECOND_SIGN_DUAL_APPROVED',
        targetEntity: 'RefundDispute',
        targetId: id,
        reasonCode: 'HIGH_VALUE_REFUND_APPROVED',
        justification,
        metadata: {
          amountPaise: item.amountPaise,
          stepUpTicket: stepUpTicket.slice(0, 8) + '...',
        },
      });
    }
    return of(item!).pipe(delay(200));
  }
}
