import { OverviewStore } from './state/overview.store';
import { OverviewRepository } from './data-access/overview.repository';

describe('Overview Feature', () => {
  it('should be defined', () => {
    expect(OverviewStore).toBeDefined();
    expect(OverviewRepository).toBeDefined();
  });
});
