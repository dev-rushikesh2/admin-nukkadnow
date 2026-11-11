import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { AuthenticationApi } from './authentication.api';
import { AuthenticationMapper } from './authentication.mapper';
import { AuthenticationViewModel, AuthenticationFilterCriteria } from '../models/authentication-view.model';
import { PaginatedResult } from '@nukkadnow/admin-api-client';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationRepository {
  private readonly api = inject(AuthenticationApi);

  fetchItems(filters?: AuthenticationFilterCriteria): Observable<PaginatedResult<AuthenticationViewModel>> {
    return this.api.getItems(filters).pipe(
      map(res => ({
        ...res.data,
        items: res.data.items.map(AuthenticationMapper.toViewModel)
      }))
    );
  }

  fetchById(id: string): Observable<AuthenticationViewModel> {
    return this.api.getById(id).pipe(map(res => AuthenticationMapper.toViewModel(res.data)));
  }

  changeStatus(id: string, status: string, reasonCode?: string): Observable<AuthenticationViewModel> {
    return this.api.updateStatus(id, status, reasonCode).pipe(map(res => AuthenticationMapper.toViewModel(res.data)));
  }
}
