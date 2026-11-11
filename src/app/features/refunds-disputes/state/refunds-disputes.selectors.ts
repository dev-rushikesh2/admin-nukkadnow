import { RefundDisputeViewModel } from '../models/refunds-disputes-view.model';

export class RefundsDisputesSelectors {
  static filterByStatus(items: RefundDisputeViewModel[], status: string): RefundDisputeViewModel[] {
    return items.filter(item => item.status.toLowerCase() === status.toLowerCase());
  }
}
