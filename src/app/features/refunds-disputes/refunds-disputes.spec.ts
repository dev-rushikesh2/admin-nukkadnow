import { RefundsDisputesStore } from './state/refunds-disputes.store';
import { RefundsDisputesRepository } from './data-access/refunds-disputes.repository';

describe('RefundsDisputes Feature', () => {
  it('should be defined', () => {
    expect(RefundsDisputesStore).toBeDefined();
    expect(RefundsDisputesRepository).toBeDefined();
  });
});
