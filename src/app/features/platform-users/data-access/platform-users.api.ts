import { Injectable, inject } from '@angular/core';
import { Observable, of } from 'rxjs';
import { AdminApiClient, ApiResponse, PaginatedResult } from '@nukkadnow/admin-api-client';
import { PlatformUserViewModel, PlatformUserFilterCriteria } from '../models/platform-users-view.model';

@Injectable({
  providedIn: 'root'
})
export class PlatformUsersApi {
  private readonly client = inject(AdminApiClient);
  private readonly endpoint = '/platform-users';

  getItems(filters?: PlatformUserFilterCriteria): Observable<ApiResponse<PaginatedResult<PlatformUserViewModel>>> {
    return this.client.getPaginated<PlatformUserViewModel>(this.endpoint, filters as any);
  }

  getById(id: string): Observable<ApiResponse<PlatformUserViewModel>> {
    return this.client.get<PlatformUserViewModel>(`${this.endpoint}/${id}`);
  }

  updateStatus(id: string, status: string, reasonCode?: string): Observable<ApiResponse<PlatformUserViewModel>> {
    return this.client.patch<PlatformUserViewModel>(`${this.endpoint}/${id}/status`, { status }, { reasonCode });
  }
}
