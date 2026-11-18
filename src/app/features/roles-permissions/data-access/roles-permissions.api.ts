import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { AdminApiClient, ApiResponse, PaginatedResult } from '@nukkadnow/admin-api-client';
import { AdminEndpoints } from '@nukkadnow/admin-api-client';
import { 
  RolePermissionViewModel, 
  RolePermissionFilterCriteria, 
  DynamicRoleViewModel, 
  CreateDynamicRoleDto, 
  UpdateDynamicRoleDto,
  AdminPermissionItem 
} from '../models/roles-permissions-view.model';

@Injectable({
  providedIn: 'root'
})
export class RolesPermissionsApi {
  private readonly client = inject(AdminApiClient);

  getRoles(filters?: RolePermissionFilterCriteria): Observable<ApiResponse<PaginatedResult<RolePermissionViewModel>>> {
    return this.client.getPaginated<RolePermissionViewModel>(AdminEndpoints.PLATFORM_ROLES, filters as any);
  }

  getPermissions(): Observable<ApiResponse<Record<string, AdminPermissionItem[]>>> {
    return this.client.get<Record<string, AdminPermissionItem[]>>(AdminEndpoints.PLATFORM_PERMISSIONS);
  }

  createRole(dto: CreateDynamicRoleDto): Observable<ApiResponse<DynamicRoleViewModel>> {
    return this.client.post<DynamicRoleViewModel>(AdminEndpoints.PLATFORM_ROLES, dto);
  }

  updateRole(id: string, dto: UpdateDynamicRoleDto): Observable<ApiResponse<DynamicRoleViewModel>> {
    return this.client.patch<DynamicRoleViewModel>(`${AdminEndpoints.PLATFORM_ROLES}/${id}`, dto);
  }

  deleteRole(id: string): Observable<ApiResponse<{ deleted: boolean }>> {
    return this.client.delete<{ deleted: boolean }>(`${AdminEndpoints.PLATFORM_ROLES}/${id}`);
  }

  updateStatus(id: string, status: string, reasonCode?: string): Observable<ApiResponse<RolePermissionViewModel>> {
    return this.client.patch<RolePermissionViewModel>(`${AdminEndpoints.PLATFORM_ROLES}/${id}`, { status }, { reasonCode });
  }

  getItems(filters?: RolePermissionFilterCriteria): Observable<ApiResponse<PaginatedResult<RolePermissionViewModel>>> {
    return this.getRoles(filters);
  }

  getById(id: string): Observable<ApiResponse<RolePermissionViewModel>> {
    return this.client.get<RolePermissionViewModel>(`${AdminEndpoints.PLATFORM_ROLES}/${id}`);
  }
}
