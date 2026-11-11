import { FeatureFlagViewModel } from '../models/feature-flags-view.model';

export class FeatureFlagsSelectors {
  static filterByStatus(items: FeatureFlagViewModel[], status: string): FeatureFlagViewModel[] {
    return items.filter(item => item.status.toLowerCase() === status.toLowerCase());
  }
}
