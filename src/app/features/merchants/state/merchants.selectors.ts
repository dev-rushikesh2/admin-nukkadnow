import { MerchantViewModel } from '../models/merchants-view.model';

export class MerchantsSelectors {
  static filterByStatus(items: MerchantViewModel[], status: string): MerchantViewModel[] {
    return items.filter(item => item.status.toLowerCase() === status.toLowerCase());
  }
}
