import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { SettingsApi } from './settings.api';
import { SettingsMapper } from './settings.mapper';
import { PlatformSettingViewModel, PlatformSettingFilterCriteria } from '../models/settings-view.model';
import { PaginatedResult } from '@nukkadnow/admin-api-client';

@Injectable({
  providedIn: 'root'
})
export class SettingsRepository {
  private readonly api = inject(SettingsApi);

  fetchSettings(): Observable<PlatformSettingViewModel> {
    return this.api.getSettings().pipe(map(res => SettingsMapper.toViewModel(res.data)));
  }

  updateSettings(body: Partial<PlatformSettingViewModel>, reasonCode?: string): Observable<PlatformSettingViewModel> {
    return this.api.saveSettings(body, reasonCode).pipe(map(res => SettingsMapper.toViewModel(res.data)));
  }

  fetchItems(filters?: PlatformSettingFilterCriteria): Observable<PaginatedResult<PlatformSettingViewModel>> {
    return this.fetchSettings().pipe(
      map(s => ({
        items: [s],
        total: 1,
        page: 1,
        limit: 10,
        totalPages: 1,
        hasMore: false,
      }))
    );
  }

  fetchById(id: string): Observable<PlatformSettingViewModel> {
    return this.fetchSettings();
  }
}
