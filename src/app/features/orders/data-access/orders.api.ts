import { Injectable, inject } from '@angular/core';
import { Observable, of } from 'rxjs';
import { AdminApiClient, ApiResponse, PaginatedResult } from '@nukkadnow/admin-api-client';
import { AdminOrderViewModel, AdminOrderFilterCriteria } from '../models/orders-view.model';

@Injectable({
  providedIn: 'root'
})
export class OrdersApi {
  private readonly client = inject(AdminApiClient);
  private readonly endpoint = '/orders';

  getItems(filters?: AdminOrderFilterCriteria): Observable<ApiResponse<PaginatedResult<AdminOrderViewModel>>> {
    return this.client.getPaginated<AdminOrderViewModel>(this.endpoint, filters as any);
  }

  getById(id: string): Observable<ApiResponse<AdminOrderViewModel>> {
    return this.client.get<AdminOrderViewModel>(`${this.endpoint}/${id}`);
  }

  updateStatus(id: string, status: string, reasonCode?: string): Observable<ApiResponse<AdminOrderViewModel>> {
    return this.client.patch<AdminOrderViewModel>(`${this.endpoint}/${id}/status`, { status }, { reasonCode });
  }
}
