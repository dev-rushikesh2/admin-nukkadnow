import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { AdminApiClient, ApiResponse, PaginatedResult } from '@nukkadnow/admin-api-client';
import { BroadcastNotificationViewModel, BroadcastNotificationFilterCriteria } from '../models/notifications-view.model';

@Injectable({
  providedIn: 'root'
})
export class NotificationsApi {
  private readonly client = inject(AdminApiClient);
  private readonly endpoint = '/notifications';

  getItems(filters?: BroadcastNotificationFilterCriteria): Observable<ApiResponse<PaginatedResult<BroadcastNotificationViewModel>>> {
    return this.client.getPaginated<BroadcastNotificationViewModel>(this.endpoint, filters as any);
  }

  getById(id: string): Observable<ApiResponse<BroadcastNotificationViewModel>> {
    return this.client.get<BroadcastNotificationViewModel>(`${this.endpoint}/${id}`);
  }

  create(payload: Partial<BroadcastNotificationViewModel>): Observable<ApiResponse<BroadcastNotificationViewModel>> {
    return this.client.post<BroadcastNotificationViewModel>(this.endpoint, payload);
  }

  updateStatus(id: string, status: string, reasonCode?: string): Observable<ApiResponse<BroadcastNotificationViewModel>> {
    return this.client.patch<BroadcastNotificationViewModel>(`${this.endpoint}/${id}/status`, { status }, { reasonCode });
  }
}
