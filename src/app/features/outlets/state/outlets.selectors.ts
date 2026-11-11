import { OutletViewModel } from '../models/outlets-view.model';

export class OutletsSelectors {
  static filterByStatus(items: OutletViewModel[], status: string): OutletViewModel[] {
    return items.filter(item => item.status.toLowerCase() === status.toLowerCase());
  }
}
