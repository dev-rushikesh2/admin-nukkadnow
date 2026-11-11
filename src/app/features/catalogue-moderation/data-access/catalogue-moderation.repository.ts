import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { CatalogueModerationApi } from './catalogue-moderation.api';
import { CatalogueModerationMapper } from './catalogue-moderation.mapper';
import { CatalogItemViewModel, CatalogItemFilterCriteria } from '../models/catalogue-moderation-view.model';
import { PaginatedResult } from '@nukkadnow/admin-api-client';

@Injectable({
  providedIn: 'root'
})
export class CatalogueModerationRepository {
  private readonly api = inject(CatalogueModerationApi);

  fetchItems(filters?: CatalogItemFilterCriteria): Observable<PaginatedResult<CatalogItemViewModel>> {
    return this.api.getItems(filters).pipe(
      map(res => ({
        ...res.data,
        items: res.data.items.map(CatalogueModerationMapper.toViewModel)
      }))
    );
  }

  fetchById(id: string): Observable<CatalogItemViewModel> {
    return this.api.getById(id).pipe(map(res => CatalogueModerationMapper.toViewModel(res.data)));
  }

  changeStatus(id: string, status: string, reasonCode?: string): Observable<CatalogItemViewModel> {
    return this.api.updateStatus(id, status, reasonCode).pipe(map(res => CatalogueModerationMapper.toViewModel(res.data)));
  }
}
