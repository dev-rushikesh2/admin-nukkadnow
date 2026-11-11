import { PaymentTransactionViewModel } from '../models/payments-view.model';

export class PaymentsSelectors {
  static filterByStatus(items: PaymentTransactionViewModel[], status: string): PaymentTransactionViewModel[] {
    return items.filter(item => item.status.toLowerCase() === status.toLowerCase());
  }
}
