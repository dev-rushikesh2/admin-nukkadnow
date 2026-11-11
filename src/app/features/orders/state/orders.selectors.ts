import { AdminOrderViewModel } from '../models/orders-view.model';

export class OrdersSelectors {
  static filterByStatus(items: AdminOrderViewModel[], status: string): AdminOrderViewModel[] {
    return items.filter(item => item.status.toLowerCase() === status.toLowerCase());
  }
}
