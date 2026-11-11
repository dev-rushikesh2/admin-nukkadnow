import { Injectable, inject } from '@angular/core';
import { Observable, of } from 'rxjs';
import { AdminApiClient, ApiResponse, PaginatedResult } from '@nukkadnow/admin-api-client';
import { AuthenticationViewModel, AuthenticationFilterCriteria } from '../models/authentication-view.model';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationApi {
  private readonly client = inject(AdminApiClient);
  private readonly endpoint = '/authentication';

  getItems(filters?: AuthenticationFilterCriteria): Observable<ApiResponse<PaginatedResult<AuthenticationViewModel>>> {
    return this.client.getPaginated<AuthenticationViewModel>(this.endpoint, filters as any);
  }

  getById(id: string): Observable<ApiResponse<AuthenticationViewModel>> {
    return this.client.get<AuthenticationViewModel>(`${this.endpoint}/${id}`);
  }

  updateStatus(id: string, status: string, reasonCode?: string): Observable<ApiResponse<AuthenticationViewModel>> {
    return this.client.patch<AuthenticationViewModel>(`${this.endpoint}/${id}/status`, { status }, { reasonCode });
  }
}
