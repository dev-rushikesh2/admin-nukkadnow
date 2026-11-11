import { PlatformUsersStore } from './state/platform-users.store';
import { PlatformUsersRepository } from './data-access/platform-users.repository';

describe('PlatformUsers Feature', () => {
  it('should be defined', () => {
    expect(PlatformUsersStore).toBeDefined();
    expect(PlatformUsersRepository).toBeDefined();
  });
});
