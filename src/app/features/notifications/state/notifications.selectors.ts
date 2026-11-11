import { BroadcastNotificationViewModel } from '../models/notifications-view.model';

export class NotificationsSelectors {
  static filterByStatus(items: BroadcastNotificationViewModel[], status: string): BroadcastNotificationViewModel[] {
    return items.filter(item => item.status.toLowerCase() === status.toLowerCase());
  }
}
