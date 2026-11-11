import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { RolesPermissionsApi } from './roles-permissions.api';
import { RolesPermissionsMapper } from './roles-permissions.mapper';
import { RolePermissionViewModel, RolePermissionFilterCriteria } from '../models/roles-permissions-view.model';
import { PaginatedResult } from '@nukkadnow/admin-api-client';

@Injectable({
  providedIn: 'root'
})
export class RolesPermissionsRepository {
  private readonly api = inject(RolesPermissionsApi);

  fetchItems(filters?: RolePermissionFilterCriteria): Observable<PaginatedResult<RolePermissionViewModel>> {
    return this.api.getItems(filters).pipe(
      map(res => ({
        ...res.data,
        items: res.data.items.map(RolesPermissionsMapper.toViewModel)
      }))
    );
  }

  fetchById(id: string): Observable<RolePermissionViewModel> {
    return this.api.getById(id).pipe(map(res => RolesPermissionsMapper.toViewModel(res.data)));
  }

  changeStatus(id: string, status: string, reasonCode?: string): Observable<RolePermissionViewModel> {
    return this.api.updateStatus(id, status, reasonCode).pipe(map(res => RolesPermissionsMapper.toViewModel(res.data)));
  }
}
