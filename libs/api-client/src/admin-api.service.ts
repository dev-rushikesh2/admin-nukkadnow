import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResponse, PaginatedResult, PaginationParams, AuditContextHeaders } from './models';

@Injectable({
  providedIn: 'root',
})
export class AdminApiClient {
  private readonly http = inject(HttpClient);

  get<T>(endpoint: string, params?: Record<string, string | number | boolean | undefined>): Observable<ApiResponse<T>> {
    let httpParams = new HttpParams();
    if (params) {
      Object.entries(params).forEach(([key, val]) => {
        if (val !== undefined && val !== null) {
          httpParams = httpParams.set(key, String(val));
        }
      });
    }
    return this.http.get<ApiResponse<T>>(endpoint, { params: httpParams });
  }

  getPaginated<T>(endpoint: string, params?: PaginationParams & Record<string, unknown>): Observable<ApiResponse<PaginatedResult<T>>> {
    let httpParams = new HttpParams();
    if (params) {
      Object.entries(params).forEach(([key, val]) => {
        if (val !== undefined && val !== null) {
          httpParams = httpParams.set(key, String(val));
        }
      });
    }
    return this.http.get<ApiResponse<PaginatedResult<T>>>(endpoint, { params: httpParams });
  }

  post<T>(endpoint: string, body: unknown, audit?: AuditContextHeaders): Observable<ApiResponse<T>> {
    const headers = this.buildAuditHeaders(audit);
    return this.http.post<ApiResponse<T>>(endpoint, body, { headers });
  }

  put<T>(endpoint: string, body: unknown, audit?: AuditContextHeaders): Observable<ApiResponse<T>> {
    const headers = this.buildAuditHeaders(audit);
    return this.http.put<ApiResponse<T>>(endpoint, body, { headers });
  }

  patch<T>(endpoint: string, body: unknown, audit?: AuditContextHeaders): Observable<ApiResponse<T>> {
    const headers = this.buildAuditHeaders(audit);
    return this.http.patch<ApiResponse<T>>(endpoint, body, { headers });
  }

  delete<T>(endpoint: string, audit?: AuditContextHeaders): Observable<ApiResponse<T>> {
    const headers = this.buildAuditHeaders(audit);
    return this.http.delete<ApiResponse<T>>(endpoint, { headers });
  }

  private buildAuditHeaders(audit?: AuditContextHeaders): HttpHeaders {
    let headers = new HttpHeaders();
    if (audit?.reasonCode) {
      headers = headers.set('X-Audit-Reason', audit.reasonCode);
    }
    if (audit?.justification) {
      headers = headers.set('X-Audit-Justification', encodeURIComponent(audit.justification));
    }
    if (audit?.stepUpTicket) {
      headers = headers.set('X-Step-Up-Ticket', audit.stepUpTicket);
    }
    return headers;
  }
}
