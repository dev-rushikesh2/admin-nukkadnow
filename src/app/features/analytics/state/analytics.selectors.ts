import { PlatformAnalyticsViewModel } from '../models/analytics-view.model';

export class AnalyticsSelectors {
  static filterByStatus(items: PlatformAnalyticsViewModel[], status: string): PlatformAnalyticsViewModel[] {
    return items.filter(item => item.status.toLowerCase() === status.toLowerCase());
  }
}
