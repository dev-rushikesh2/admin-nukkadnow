import { AnalyticsStore } from './state/analytics.store';
import { AnalyticsRepository } from './data-access/analytics.repository';

describe('Analytics Feature', () => {
  it('should be defined', () => {
    expect(AnalyticsStore).toBeDefined();
    expect(AnalyticsRepository).toBeDefined();
  });
});
