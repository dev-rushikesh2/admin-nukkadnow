import { Injectable, inject } from '@angular/core';
import { Observable, of } from 'rxjs';
import { AdminApiClient, ApiResponse, PaginatedResult } from '@nukkadnow/admin-api-client';
import { PlatformSettingViewModel, PlatformSettingFilterCriteria } from '../models/settings-view.model';

@Injectable({
  providedIn: 'root'
})
export class SettingsApi {
  private readonly client = inject(AdminApiClient);
  private readonly endpoint = '/settings';

  getItems(filters?: PlatformSettingFilterCriteria): Observable<ApiResponse<PaginatedResult<PlatformSettingViewModel>>> {
    return this.client.getPaginated<PlatformSettingViewModel>(this.endpoint, filters as any);
  }

  getById(id: string): Observable<ApiResponse<PlatformSettingViewModel>> {
    return this.client.get<PlatformSettingViewModel>(`${this.endpoint}/${id}`);
  }

  updateStatus(id: string, status: string, reasonCode?: string): Observable<ApiResponse<PlatformSettingViewModel>> {
    return this.client.patch<PlatformSettingViewModel>(`${this.endpoint}/${id}/status`, { status }, { reasonCode });
  }
}
