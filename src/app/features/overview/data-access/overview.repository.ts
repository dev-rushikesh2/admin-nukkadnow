import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { OverviewApi } from './overview.api';
import { OverviewMapper } from './overview.mapper';
import { OverviewMetricViewModel, OverviewMetricFilterCriteria } from '../models/overview-view.model';
import { PaginatedResult } from '@nukkadnow/admin-api-client';

@Injectable({
  providedIn: 'root'
})
export class OverviewRepository {
  private readonly api = inject(OverviewApi);

  fetchItems(filters?: OverviewMetricFilterCriteria): Observable<PaginatedResult<OverviewMetricViewModel>> {
    return this.api.getItems(filters).pipe(
      map(res => ({
        ...res.data,
        items: res.data.items.map(OverviewMapper.toViewModel)
      }))
    );
  }

  fetchById(id: string): Observable<OverviewMetricViewModel> {
    return this.api.getById(id).pipe(map(res => OverviewMapper.toViewModel(res.data)));
  }

  changeStatus(id: string, status: string, reasonCode?: string): Observable<OverviewMetricViewModel> {
    return this.api.updateStatus(id, status, reasonCode).pipe(map(res => OverviewMapper.toViewModel(res.data)));
  }
}
