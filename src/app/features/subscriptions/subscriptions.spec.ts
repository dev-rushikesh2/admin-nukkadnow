import { SubscriptionsStore } from './state/subscriptions.store';
import { SubscriptionsRepository } from './data-access/subscriptions.repository';

describe('Subscriptions Feature', () => {
  it('should be defined', () => {
    expect(SubscriptionsStore).toBeDefined();
    expect(SubscriptionsRepository).toBeDefined();
  });
});
