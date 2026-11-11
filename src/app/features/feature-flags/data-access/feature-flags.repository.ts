import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { FeatureFlagsApi } from './feature-flags.api';
import { FeatureFlagsMapper } from './feature-flags.mapper';
import { FeatureFlagViewModel, FeatureFlagFilterCriteria } from '../models/feature-flags-view.model';
import { PaginatedResult } from '@nukkadnow/admin-api-client';

@Injectable({
  providedIn: 'root'
})
export class FeatureFlagsRepository {
  private readonly api = inject(FeatureFlagsApi);

  fetchItems(filters?: FeatureFlagFilterCriteria): Observable<PaginatedResult<FeatureFlagViewModel>> {
    return this.api.getItems(filters).pipe(
      map(res => ({
        ...res.data,
        items: res.data.items.map(FeatureFlagsMapper.toViewModel)
      }))
    );
  }

  fetchById(id: string): Observable<FeatureFlagViewModel> {
    return this.api.getById(id).pipe(map(res => FeatureFlagsMapper.toViewModel(res.data)));
  }

  changeStatus(id: string, status: string, reasonCode?: string): Observable<FeatureFlagViewModel> {
    return this.api.updateStatus(id, status, reasonCode).pipe(map(res => FeatureFlagsMapper.toViewModel(res.data)));
  }
}
