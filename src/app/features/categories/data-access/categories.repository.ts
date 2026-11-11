import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { CategoriesApi } from './categories.api';
import { CategoriesMapper } from './categories.mapper';
import { CategoryViewModel, CategoryFilterCriteria } from '../models/categories-view.model';
import { PaginatedResult } from '@nukkadnow/admin-api-client';

@Injectable({
  providedIn: 'root'
})
export class CategoriesRepository {
  private readonly api = inject(CategoriesApi);

  fetchItems(filters?: CategoryFilterCriteria): Observable<PaginatedResult<CategoryViewModel>> {
    return this.api.getItems(filters).pipe(
      map(res => ({
        ...res.data,
        items: res.data.items.map(CategoriesMapper.toViewModel)
      }))
    );
  }

  fetchById(id: string): Observable<CategoryViewModel> {
    return this.api.getById(id).pipe(map(res => CategoriesMapper.toViewModel(res.data)));
  }

  changeStatus(id: string, status: string, reasonCode?: string): Observable<CategoryViewModel> {
    return this.api.updateStatus(id, status, reasonCode).pipe(map(res => CategoriesMapper.toViewModel(res.data)));
  }
}
