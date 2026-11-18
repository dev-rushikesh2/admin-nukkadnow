import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { AdminApiClient, ApiResponse, PaginatedResult } from '@nukkadnow/admin-api-client';
import { SupportTicketViewModel, SupportTicketFilterCriteria } from '../models/support-tickets-view.model';

@Injectable({
  providedIn: 'root'
})
export class SupportTicketsApi {
  private readonly client = inject(AdminApiClient);
  private readonly endpoint = '/support/tickets';

  getItems(filters?: SupportTicketFilterCriteria): Observable<ApiResponse<PaginatedResult<SupportTicketViewModel>>> {
    return this.client.getPaginated<SupportTicketViewModel>(this.endpoint, filters as any);
  }

  getById(id: string): Observable<ApiResponse<SupportTicketViewModel>> {
    return this.client.get<SupportTicketViewModel>(`${this.endpoint}/${id}`);
  }

  addMessage(id: string, text: string, isInternal: boolean): Observable<ApiResponse<SupportTicketViewModel>> {
    return this.client.post<SupportTicketViewModel>(`${this.endpoint}/${id}/messages`, { text, isInternal });
  }

  updateStatus(id: string, status: string, reasonCode?: string): Observable<ApiResponse<SupportTicketViewModel>> {
    return this.client.patch<SupportTicketViewModel>(
      `${this.endpoint}/${id}/status`,
      { status },
      { reasonCode: reasonCode || 'TICKET_STATUS_UPDATE' }
    );
  }
}
