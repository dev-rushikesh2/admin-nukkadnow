import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { ReviewsModerationApi } from './reviews-moderation.api';
import { ReviewsModerationMapper } from './reviews-moderation.mapper';
import { ReviewModerationViewModel, ReviewModerationFilterCriteria } from '../models/reviews-moderation-view.model';
import { PaginatedResult } from '@nukkadnow/admin-api-client';

@Injectable({
  providedIn: 'root'
})
export class ReviewsModerationRepository {
  private readonly api = inject(ReviewsModerationApi);

  fetchItems(filters?: ReviewModerationFilterCriteria): Observable<PaginatedResult<ReviewModerationViewModel>> {
    return this.api.getItems(filters).pipe(
      map(res => ({
        ...res.data,
        items: res.data.items.map(ReviewsModerationMapper.toViewModel)
      }))
    );
  }

  fetchById(id: string): Observable<ReviewModerationViewModel> {
    return this.api.getById(id).pipe(map(res => ReviewsModerationMapper.toViewModel(res.data)));
  }

  changeStatus(id: string, status: string, reasonCode?: string): Observable<ReviewModerationViewModel> {
    return this.api.updateStatus(id, status, reasonCode).pipe(map(res => ReviewsModerationMapper.toViewModel(res.data)));
  }
}
