import { PlansPricingStore } from './state/plans-pricing.store';
import { PlansPricingRepository } from './data-access/plans-pricing.repository';

describe('PlansPricing Feature', () => {
  it('should be defined', () => {
    expect(PlansPricingStore).toBeDefined();
    expect(PlansPricingRepository).toBeDefined();
  });
});
