import { FeatureFlagsStore } from './state/feature-flags.store';
import { FeatureFlagsRepository } from './data-access/feature-flags.repository';

describe('FeatureFlags Feature', () => {
  it('should be defined', () => {
    expect(FeatureFlagsStore).toBeDefined();
    expect(FeatureFlagsRepository).toBeDefined();
  });
});
