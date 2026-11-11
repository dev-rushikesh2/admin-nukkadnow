import { AuthenticationStore } from './state/authentication.store';
import { AuthenticationRepository } from './data-access/authentication.repository';

describe('Authentication Feature', () => {
  it('should be defined', () => {
    expect(AuthenticationStore).toBeDefined();
    expect(AuthenticationRepository).toBeDefined();
  });
});
