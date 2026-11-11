import { MerchantSubscriptionViewModel } from '../models/subscriptions-view.model';

export class SubscriptionsSelectors {
  static filterByStatus(items: MerchantSubscriptionViewModel[], status: string): MerchantSubscriptionViewModel[] {
    return items.filter(item => item.status.toLowerCase() === status.toLowerCase());
  }
}
