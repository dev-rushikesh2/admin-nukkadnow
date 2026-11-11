import { MerchantVerificationStore } from './state/merchant-verification.store';
import { MerchantVerificationRepository } from './data-access/merchant-verification.repository';

describe('MerchantVerification Feature', () => {
  it('should be defined', () => {
    expect(MerchantVerificationStore).toBeDefined();
    expect(MerchantVerificationRepository).toBeDefined();
  });
});
