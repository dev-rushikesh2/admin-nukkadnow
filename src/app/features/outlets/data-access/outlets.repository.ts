import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { OutletsApi } from './outlets.api';
import { OutletsMapper } from './outlets.mapper';
import { OutletViewModel, OutletFilterCriteria } from '../models/outlets-view.model';
import { PaginatedResult } from '@nukkadnow/admin-api-client';

@Injectable({
  providedIn: 'root'
})
export class OutletsRepository {
  private readonly api = inject(OutletsApi);

  fetchItems(filters?: OutletFilterCriteria): Observable<PaginatedResult<OutletViewModel>> {
    return this.api.getItems(filters).pipe(
      map(res => ({
        ...res.data,
        items: res.data.items.map(OutletsMapper.toViewModel)
      }))
    );
  }

  fetchById(id: string): Observable<OutletViewModel> {
    return this.api.getById(id).pipe(map(res => OutletsMapper.toViewModel(res.data)));
  }

  changeStatus(id: string, status: string, reasonCode?: string): Observable<OutletViewModel> {
    return this.api.updateStatus(id, status, reasonCode).pipe(map(res => OutletsMapper.toViewModel(res.data)));
  }
}
