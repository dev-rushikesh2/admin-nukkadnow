import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { MerchantVerificationViewModel, VerificationFilterCriteria } from '../models/merchant-verification-view.model';
import { AdminApiClient, AdminEndpoints, PaginatedResult } from '@nukkadnow/admin-api-client';
import { AuditLoggerService } from '../../../core/audit-context/audit-logger.service';

@Injectable({
  providedIn: 'root',
})
export class MerchantVerificationRepository {
  private readonly api = inject(AdminApiClient);
  private readonly auditLogger = inject(AuditLoggerService);

  fetchItems(filters?: VerificationFilterCriteria): Observable<PaginatedResult<MerchantVerificationViewModel>> {
    return this.api.getPaginated<MerchantVerificationViewModel>(AdminEndpoints.MERCHANT_VERIFICATION, {
      search: filters?.search,
      mode: filters?.mode,
      status: filters?.status,
      locality: filters?.locality,
      page: filters?.page,
      limit: filters?.limit,
    }).pipe(
      map((res) => res.data)
    );
  }

  fetchById(id: string): Observable<MerchantVerificationViewModel> {
    return this.api.get<MerchantVerificationViewModel>(AdminEndpoints.MERCHANT_VERIFICATION_BY_ID(id)).pipe(
      map((res) => res.data)
    );
  }

  approveVerification(id: string, operatorNotes: string): Observable<MerchantVerificationViewModel> {
    const reasonCode = 'COMPLIANCE_CLEARANCE';
    const justification = operatorNotes || 'All FSSAI, GSTIN and Bank Penny-Drop documents verified.';

    return this.api.patch<MerchantVerificationViewModel>(
      AdminEndpoints.MERCHANT_VERIFICATION_APPROVE(id),
      { notes: operatorNotes },
      { reasonCode, justification }
    ).pipe(
      tap(() => {
        this.auditLogger.logAction({
          action: 'KYC_APPROVED',
          targetEntity: 'MerchantVerification',
          targetId: id,
          reasonCode,
          justification,
        });
      }),
      map((res) => res.data)
    );
  }

  rejectVerification(id: string, reasonCode: string, justification: string): Observable<MerchantVerificationViewModel> {
    return this.api.patch<MerchantVerificationViewModel>(
      AdminEndpoints.MERCHANT_VERIFICATION_REJECT(id),
      { reasonCode, justification },
      { reasonCode, justification }
    ).pipe(
      tap(() => {
        this.auditLogger.logAction({
          action: 'KYC_REJECTED',
          targetEntity: 'MerchantVerification',
          targetId: id,
          reasonCode,
          justification,
        });
      }),
      map((res) => res.data)
    );
  }
}
