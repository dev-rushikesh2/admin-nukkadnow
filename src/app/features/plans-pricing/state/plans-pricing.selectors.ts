import { PricingPlanViewModel } from '../models/plans-pricing-view.model';

export class PlansPricingSelectors {
  static filterByStatus(items: PricingPlanViewModel[], status: string): PricingPlanViewModel[] {
    return items.filter(item => item.status.toLowerCase() === status.toLowerCase());
  }
}
