import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { SystemHealthApi } from './system-health.api';
import { SystemHealthMapper } from './system-health.mapper';
import { SystemHealthNodeViewModel, SystemHealthNodeFilterCriteria } from '../models/system-health-view.model';
import { PaginatedResult } from '@nukkadnow/admin-api-client';

@Injectable({
  providedIn: 'root'
})
export class SystemHealthRepository {
  private readonly api = inject(SystemHealthApi);

  fetchItems(filters?: SystemHealthNodeFilterCriteria): Observable<PaginatedResult<SystemHealthNodeViewModel>> {
    return this.api.getItems(filters).pipe(
      map(res => ({
        ...res.data,
        items: res.data.items.map(SystemHealthMapper.toViewModel)
      }))
    );
  }

  fetchById(id: string): Observable<SystemHealthNodeViewModel> {
    return this.api.getById(id).pipe(map(res => SystemHealthMapper.toViewModel(res.data)));
  }

  changeStatus(id: string, status: string, reasonCode?: string): Observable<SystemHealthNodeViewModel> {
    return this.api.updateStatus(id, status, reasonCode).pipe(map(res => SystemHealthMapper.toViewModel(res.data)));
  }
}
