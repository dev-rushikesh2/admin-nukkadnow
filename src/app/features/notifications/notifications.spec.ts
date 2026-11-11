import { NotificationsStore } from './state/notifications.store';
import { NotificationsRepository } from './data-access/notifications.repository';

describe('Notifications Feature', () => {
  it('should be defined', () => {
    expect(NotificationsStore).toBeDefined();
    expect(NotificationsRepository).toBeDefined();
  });
});
