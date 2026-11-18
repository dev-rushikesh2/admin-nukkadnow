import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { AdminApiClient, ApiResponse, PaginatedResult } from '@nukkadnow/admin-api-client';
import { PlatformSettingViewModel, PlatformSettingFilterCriteria } from '../models/settings-view.model';

@Injectable({
  providedIn: 'root'
})
export class SettingsApi {
  private readonly client = inject(AdminApiClient);
  private readonly endpoint = '/settings';

  getSettings(): Observable<ApiResponse<PlatformSettingViewModel>> {
    return this.client.get<PlatformSettingViewModel>(this.endpoint);
  }

  saveSettings(body: Partial<PlatformSettingViewModel>, reasonCode?: string): Observable<ApiResponse<PlatformSettingViewModel>> {
    return this.client.patch<PlatformSettingViewModel>(this.endpoint, body, { reasonCode: reasonCode || 'SETTINGS_UPDATE' });
  }

  getItems(filters?: PlatformSettingFilterCriteria): Observable<ApiResponse<PaginatedResult<PlatformSettingViewModel>>> {
    return this.client.getPaginated<PlatformSettingViewModel>(this.endpoint, filters as any);
  }

  getById(id: string): Observable<ApiResponse<PlatformSettingViewModel>> {
    return this.client.get<PlatformSettingViewModel>(`${this.endpoint}/${id}`);
  }
}
