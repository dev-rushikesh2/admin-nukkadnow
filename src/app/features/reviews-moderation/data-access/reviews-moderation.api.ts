import { Injectable, inject } from '@angular/core';
import { Observable, of } from 'rxjs';
import { AdminApiClient, ApiResponse, PaginatedResult } from '@nukkadnow/admin-api-client';
import { ReviewModerationViewModel, ReviewModerationFilterCriteria } from '../models/reviews-moderation-view.model';

@Injectable({
  providedIn: 'root'
})
export class ReviewsModerationApi {
  private readonly client = inject(AdminApiClient);
  private readonly endpoint = '/reviews-moderation';

  getItems(filters?: ReviewModerationFilterCriteria): Observable<ApiResponse<PaginatedResult<ReviewModerationViewModel>>> {
    return this.client.getPaginated<ReviewModerationViewModel>(this.endpoint, filters as any);
  }

  getById(id: string): Observable<ApiResponse<ReviewModerationViewModel>> {
    return this.client.get<ReviewModerationViewModel>(`${this.endpoint}/${id}`);
  }

  updateStatus(id: string, status: string, reasonCode?: string): Observable<ApiResponse<ReviewModerationViewModel>> {
    return this.client.patch<ReviewModerationViewModel>(`${this.endpoint}/${id}/status`, { status }, { reasonCode });
  }
}
