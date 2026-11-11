import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { SupportTicketsApi } from './support-tickets.api';
import { SupportTicketsMapper } from './support-tickets.mapper';
import { SupportTicketViewModel, SupportTicketFilterCriteria } from '../models/support-tickets-view.model';
import { PaginatedResult } from '@nukkadnow/admin-api-client';

@Injectable({
  providedIn: 'root'
})
export class SupportTicketsRepository {
  private readonly api = inject(SupportTicketsApi);

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

  changeStatus(id: string, status: string, reasonCode?: string): Observable<SupportTicketViewModel> {
    return this.api.updateStatus(id, status, reasonCode).pipe(map(res => SupportTicketsMapper.toViewModel(res.data)));
  }
}
