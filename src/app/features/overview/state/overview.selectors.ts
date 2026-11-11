import { OverviewMetricViewModel } from '../models/overview-view.model';

export class OverviewSelectors {
  static filterByStatus(items: OverviewMetricViewModel[], status: string): OverviewMetricViewModel[] {
    return items.filter(item => item.status.toLowerCase() === status.toLowerCase());
  }
}
