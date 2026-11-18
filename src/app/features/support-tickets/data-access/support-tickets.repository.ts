import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { SupportTicketsApi } from './support-tickets.api';
import { SupportTicketsMapper } from './support-tickets.mapper';
import { SupportTicketViewModel, SupportTicketFilterCriteria } from '../models/support-tickets-view.model';
import { PaginatedResult } from '@nukkadnow/admin-api-client';
import { AuditLoggerService } from '../../../core/audit-context/audit-logger.service';

@Injectable({
  providedIn: 'root'
})
export class SupportTicketsRepository {
  private readonly api = inject(SupportTicketsApi);
  private readonly auditLogger = inject(AuditLoggerService);

  fetchItems(filters?: SupportTicketFilterCriteria): Observable<PaginatedResult<SupportTicketViewModel>> {
    return this.api.getItems(filters).pipe(
      map(res => ({
        ...res.data,
        items: res.data.items.map(SupportTicketsMapper.toViewModel)
      }))
    );
  }

  fetchById(id: string): Observable<SupportTicketViewModel> {
    return this.api.getById(id).pipe(map(res => SupportTicketsMapper.toViewModel(res.data)));
  }

  addMessage(id: string, text: string, isInternal: boolean): Observable<SupportTicketViewModel> {
    return this.api.addMessage(id, text, isInternal).pipe(
      tap(() => {
        this.auditLogger.logAction({
          action: isInternal ? 'SUPPORT_NOTE_ADDED' : 'SUPPORT_REPLY_SENT',
          targetEntity: 'SupportTicket',
          targetId: id,
          reasonCode: 'CUSTOMER_ASSISTANCE',
          justification: isInternal ? 'Internal operator note logged' : 'Customer response sent',
        });
      }),
      map(res => SupportTicketsMapper.toViewModel(res.data))
    );
  }

  changeStatus(id: string, status: string, reasonCode?: string): Observable<SupportTicketViewModel> {
    return this.api.updateStatus(id, status, reasonCode).pipe(
      tap(() => {
        this.auditLogger.logAction({
          action: 'SUPPORT_TICKET_RESOLVED',
          targetEntity: 'SupportTicket',
          targetId: id,
          reasonCode: reasonCode || 'TICKET_STATUS_UPDATE',
          justification: `Changed support ticket state to ${status}`,
        });
      }),
      map(res => SupportTicketsMapper.toViewModel(res.data))
    );
  }
}
