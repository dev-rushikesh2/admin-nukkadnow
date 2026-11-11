import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { LocalitiesApi } from './localities.api';
import { LocalitiesMapper } from './localities.mapper';
import { LocalityViewModel, LocalityFilterCriteria } from '../models/localities-view.model';
import { PaginatedResult } from '@nukkadnow/admin-api-client';

@Injectable({
  providedIn: 'root'
})
export class LocalitiesRepository {
  private readonly api = inject(LocalitiesApi);

  fetchItems(filters?: LocalityFilterCriteria): Observable<PaginatedResult<LocalityViewModel>> {
    return this.api.getItems(filters).pipe(
      map(res => ({
        ...res.data,
        items: res.data.items.map(LocalitiesMapper.toViewModel)
      }))
    );
  }

  fetchById(id: string): Observable<LocalityViewModel> {
    return this.api.getById(id).pipe(map(res => LocalitiesMapper.toViewModel(res.data)));
  }

  changeStatus(id: string, status: string, reasonCode?: string): Observable<LocalityViewModel> {
    return this.api.updateStatus(id, status, reasonCode).pipe(map(res => LocalitiesMapper.toViewModel(res.data)));
  }
}
