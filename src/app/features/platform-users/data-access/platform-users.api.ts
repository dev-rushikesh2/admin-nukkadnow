import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { AdminApiClient, ApiResponse, PaginatedResult } from '@nukkadnow/admin-api-client';
import { AdminEndpoints } from '@nukkadnow/admin-api-client';
import { 
  PlatformUserViewModel, 
  PlatformUserFilterCriteria, 
  CreatePlatformUserDto,
  CityOption 
} from '../models/platform-users-view.model';
import { AdminGeoAssignment } from '@nukkadnow/admin-access-control';

@Injectable({
  providedIn: 'root'
})
export class PlatformUsersApi {
  private readonly client = inject(AdminApiClient);

  getUsers(filters?: PlatformUserFilterCriteria): Observable<ApiResponse<PaginatedResult<PlatformUserViewModel>>> {
    return this.client.getPaginated<PlatformUserViewModel>(AdminEndpoints.PLATFORM_USERS, filters as any);
  }

  getCities(): Observable<ApiResponse<CityOption[]>> {
    return this.client.get<CityOption[]>(AdminEndpoints.PLATFORM_CITIES);
  }

  createUser(dto: CreatePlatformUserDto): Observable<ApiResponse<PlatformUserViewModel>> {
    return this.client.post<PlatformUserViewModel>(AdminEndpoints.PLATFORM_USERS, dto);
  }

  updateStatus(id: string, status: string, reasonCode?: string): Observable<ApiResponse<PlatformUserViewModel>> {
    return this.client.patch<PlatformUserViewModel>(`${AdminEndpoints.PLATFORM_USERS}/${id}/status`, { status, reasonCode });
  }

  updateRole(id: string, roleCode: string): Observable<ApiResponse<PlatformUserViewModel>> {
    return this.client.patch<PlatformUserViewModel>(`${AdminEndpoints.PLATFORM_USERS}/${id}/role`, { roleCode });
  }

  updateGeo(id: string, geoAssignment?: AdminGeoAssignment): Observable<ApiResponse<PlatformUserViewModel>> {
    return this.client.patch<PlatformUserViewModel>(`${AdminEndpoints.PLATFORM_USERS}/${id}/geo`, { geoAssignment });
  }

  getItems(filters?: PlatformUserFilterCriteria): Observable<ApiResponse<PaginatedResult<PlatformUserViewModel>>> {
    return this.getUsers(filters);
  }

  getById(id: string): Observable<ApiResponse<PlatformUserViewModel>> {
    return this.client.get<PlatformUserViewModel>(`${AdminEndpoints.PLATFORM_USERS}/${id}`);
  }
}
