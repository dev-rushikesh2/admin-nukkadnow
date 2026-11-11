import { ReviewModerationViewModel } from '../models/reviews-moderation-view.model';

export class ReviewsModerationSelectors {
  static filterByStatus(items: ReviewModerationViewModel[], status: string): ReviewModerationViewModel[] {
    return items.filter(item => item.status.toLowerCase() === status.toLowerCase());
  }
}
