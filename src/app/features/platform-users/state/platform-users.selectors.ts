import { PlatformUserViewModel } from '../models/platform-users-view.model';

export class PlatformUsersSelectors {
  static filterByStatus(items: PlatformUserViewModel[], status: string): PlatformUserViewModel[] {
    return items.filter(item => item.status.toLowerCase() === status.toLowerCase());
  }
}
