import { SystemHealthNodeViewModel } from '../models/system-health-view.model';

export class SystemHealthSelectors {
  static filterByStatus(items: SystemHealthNodeViewModel[], status: string): SystemHealthNodeViewModel[] {
    return items.filter(item => item.status.toLowerCase() === status.toLowerCase());
  }
}
