import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { SystemHealthApi } from './system-health.api';
import { SystemHealthMapper } from './system-health.mapper';
import { SystemHealthNodeViewModel, SystemHealthSummary, SystemHealthNodeFilterCriteria } from '../models/system-health-view.model';
import { PaginatedResult } from '@nukkadnow/admin-api-client';

@Injectable({
  providedIn: 'root'
})
export class SystemHealthRepository {
  private readonly api = inject(SystemHealthApi);

  fetchHealthSummary(): Observable<SystemHealthSummary> {
    return this.api.getHealth().pipe(
      map(res => {
        const raw = res.data;
        const nodes = Array.isArray(raw?.nodes) ? raw.nodes.map(SystemHealthMapper.toViewModel) : [];
        return {
          overallStatus: raw?.overallStatus || 'HEALTHY',
          uptimeSeconds: Number(raw?.uptimeSeconds) || 3600,
          p95LatencyMs: Number(raw?.p95LatencyMs) || 42,
          nodes,
        };
      })
    );
  }

  flushCache(partition?: string, reasonCode?: string): Observable<any> {
    return this.api.flushCache(partition, reasonCode).pipe(map(res => res.data));
  }

  fetchItems(filters?: SystemHealthNodeFilterCriteria): Observable<PaginatedResult<SystemHealthNodeViewModel>> {
    return this.fetchHealthSummary().pipe(
      map(summary => ({
        items: summary.nodes,
        total: summary.nodes.length,
        page: 1,
        limit: 50,
        totalPages: 1,
        hasMore: false,
      }))
    );
  }

  fetchById(id: string): Observable<SystemHealthNodeViewModel> {
    return this.fetchHealthSummary().pipe(
      map(summary => {
        const found = summary.nodes.find(n => n.id === id || n.service === id);
        return found || SystemHealthMapper.toViewModel({ service: id, status: 'HEALTHY' });
      })
    );
  }
}
