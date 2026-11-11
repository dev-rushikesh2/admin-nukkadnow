import { SupportTicketViewModel } from '../models/support-tickets-view.model';

export class SupportTicketsSelectors {
  static filterByStatus(items: SupportTicketViewModel[], status: string): SupportTicketViewModel[] {
    return items.filter(item => item.status.toLowerCase() === status.toLowerCase());
  }
}
