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

  fetchItems(filters?: PlatformSettingFilterCriteria): Observable<PaginatedResult<PlatformSettingViewModel>> {
    return this.api.getItems(filters).pipe(
      map(res => ({
        ...res.data,
        items: res.data.items.map(SettingsMapper.toViewModel)
      }))
    );
  }

  fetchById(id: string): Observable<PlatformSettingViewModel> {
    return this.api.getById(id).pipe(map(res => SettingsMapper.toViewModel(res.data)));
  }

  changeStatus(id: string, status: string, reasonCode?: string): Observable<PlatformSettingViewModel> {
    return this.api.updateStatus(id, status, reasonCode).pipe(map(res => SettingsMapper.toViewModel(res.data)));
  }
}
