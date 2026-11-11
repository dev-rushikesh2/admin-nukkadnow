import { PaymentsStore } from './state/payments.store';
import { PaymentsRepository } from './data-access/payments.repository';

describe('Payments Feature', () => {
  it('should be defined', () => {
    expect(PaymentsStore).toBeDefined();
    expect(PaymentsRepository).toBeDefined();
  });
});
