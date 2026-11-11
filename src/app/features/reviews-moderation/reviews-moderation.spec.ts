import { ReviewsModerationStore } from './state/reviews-moderation.store';
import { ReviewsModerationRepository } from './data-access/reviews-moderation.repository';

describe('ReviewsModeration Feature', () => {
  it('should be defined', () => {
    expect(ReviewsModerationStore).toBeDefined();
    expect(ReviewsModerationRepository).toBeDefined();
  });
});
