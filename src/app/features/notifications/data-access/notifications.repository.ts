import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { NotificationsApi } from './notifications.api';
import { NotificationsMapper } from './notifications.mapper';
import { BroadcastNotificationViewModel, BroadcastNotificationFilterCriteria } from '../models/notifications-view.model';
import { PaginatedResult } from '@nukkadnow/admin-api-client';

@Injectable({
  providedIn: 'root'
})
export class NotificationsRepository {
  private readonly api = inject(NotificationsApi);

  fetchItems(filters?: BroadcastNotificationFilterCriteria): Observable<PaginatedResult<BroadcastNotificationViewModel>> {
    return this.api.getItems(filters).pipe(
      map(res => ({
        ...res.data,
        items: res.data.items.map(NotificationsMapper.toViewModel)
      }))
    );
  }

  fetchById(id: string): Observable<BroadcastNotificationViewModel> {
    return this.api.getById(id).pipe(map(res => NotificationsMapper.toViewModel(res.data)));
  }

  changeStatus(id: string, status: string, reasonCode?: string): Observable<BroadcastNotificationViewModel> {
    return this.api.updateStatus(id, status, reasonCode).pipe(map(res => NotificationsMapper.toViewModel(res.data)));
  }
}
