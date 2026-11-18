import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { CategoriesApi } from './categories.api';
import { CategoriesMapper } from './categories.mapper';
import { CategoryViewModel, CategoryFilterCriteria } from '../models/categories-view.model';
import { PaginatedResult } from '@nukkadnow/admin-api-client';
import { AuditLoggerService } from '../../../core/audit-context/audit-logger.service';

@Injectable({
  providedIn: 'root'
})
export class CategoriesRepository {
  private readonly api = inject(CategoriesApi);
  private readonly auditLogger = inject(AuditLoggerService);

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

  createCategory(payload: Partial<CategoryViewModel>): Observable<CategoryViewModel> {
    return this.api.createCategory(payload).pipe(
      tap((res) => {
        this.auditLogger.logAction({
          action: 'CATEGORY_CREATED',
          targetEntity: 'Category',
          targetId: res.data.id,
          reasonCode: 'TAXONOMY_EXPANSION',
          justification: `Created category ${payload.name} (${payload.emoji}) with ${payload.commissionPct}% commission`,
        });
      }),
      map(res => CategoriesMapper.toViewModel(res.data))
    );
  }

  updateCommission(id: string, commissionPct: number, gstSlabPct: number, reasonCode?: string): Observable<CategoryViewModel> {
    return this.api.updateCommission(id, commissionPct, gstSlabPct, reasonCode).pipe(
      tap(() => {
        this.auditLogger.logAction({
          action: 'CATEGORY_COMMISSION_ADJUSTED',
          targetEntity: 'Category',
          targetId: id,
          reasonCode: reasonCode || 'COMMISSION_SLAB_TUNING',
          justification: `Adjusted category commission to ${commissionPct}% and GST to ${gstSlabPct}%`,
        });
      }),
      map(res => CategoriesMapper.toViewModel(res.data))
    );
  }

  changeStatus(id: string, status: string, reasonCode?: string): Observable<CategoryViewModel> {
    return this.api.updateStatus(id, status, reasonCode).pipe(
      tap(() => {
        this.auditLogger.logAction({
          action: 'CATEGORY_STATUS_CHANGED',
          targetEntity: 'Category',
          targetId: id,
          reasonCode: reasonCode || 'OPERATIONAL_ADJUSTMENT',
          justification: `Changed category status to ${status}`,
        });
      }),
      map(res => CategoriesMapper.toViewModel(res.data))
    );
  }
}
