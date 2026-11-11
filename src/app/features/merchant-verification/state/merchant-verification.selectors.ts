import { MerchantVerificationViewModel } from '../models/merchant-verification-view.model';

export class MerchantVerificationSelectors {
  static filterByStatus(items: MerchantVerificationViewModel[], status: string): MerchantVerificationViewModel[] {
    return items.filter(item => item.status.toLowerCase() === status.toLowerCase());
  }
}
