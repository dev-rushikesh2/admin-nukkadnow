import { MerchantsStore } from './state/merchants.store';
import { MerchantsRepository } from './data-access/merchants.repository';

describe('Merchants Feature', () => {
  it('should be defined', () => {
    expect(MerchantsStore).toBeDefined();
    expect(MerchantsRepository).toBeDefined();
  });
});
