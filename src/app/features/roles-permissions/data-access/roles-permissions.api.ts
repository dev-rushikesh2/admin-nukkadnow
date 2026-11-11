import { Injectable, inject } from '@angular/core';
import { Observable, of } from 'rxjs';
import { AdminApiClient, ApiResponse, PaginatedResult } from '@nukkadnow/admin-api-client';
import { RolePermissionViewModel, RolePermissionFilterCriteria } from '../models/roles-permissions-view.model';

@Injectable({
  providedIn: 'root'
})
export class RolesPermissionsApi {
  private readonly client = inject(AdminApiClient);
  private readonly endpoint = '/roles-permissions';

  getItems(filters?: RolePermissionFilterCriteria): Observable<ApiResponse<PaginatedResult<RolePermissionViewModel>>> {
    return this.client.getPaginated<RolePermissionViewModel>(this.endpoint, filters as any);
  }

  getById(id: string): Observable<ApiResponse<RolePermissionViewModel>> {
    return this.client.get<RolePermissionViewModel>(`${this.endpoint}/${id}`);
  }

  updateStatus(id: string, status: string, reasonCode?: string): Observable<ApiResponse<RolePermissionViewModel>> {
    return this.client.patch<RolePermissionViewModel>(`${this.endpoint}/${id}/status`, { status }, { reasonCode });
  }
}
