import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { PlatformUsersApi } from './platform-users.api';
import { PlatformUsersMapper } from './platform-users.mapper';
import { PlatformUserViewModel, PlatformUserFilterCriteria } from '../models/platform-users-view.model';
import { PaginatedResult } from '@nukkadnow/admin-api-client';

@Injectable({
  providedIn: 'root'
})
export class PlatformUsersRepository {
  private readonly api = inject(PlatformUsersApi);

  fetchItems(filters?: PlatformUserFilterCriteria): Observable<PaginatedResult<PlatformUserViewModel>> {
    return this.api.getItems(filters).pipe(
      map(res => ({
        ...res.data,
        items: res.data.items.map(PlatformUsersMapper.toViewModel)
      }))
    );
  }

  fetchById(id: string): Observable<PlatformUserViewModel> {
    return this.api.getById(id).pipe(map(res => PlatformUsersMapper.toViewModel(res.data)));
  }

  changeStatus(id: string, status: string, reasonCode?: string): Observable<PlatformUserViewModel> {
    return this.api.updateStatus(id, status, reasonCode).pipe(map(res => PlatformUsersMapper.toViewModel(res.data)));
  }
}
