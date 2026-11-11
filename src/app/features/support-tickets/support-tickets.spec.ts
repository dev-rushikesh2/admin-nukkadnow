import { SupportTicketsStore } from './state/support-tickets.store';
import { SupportTicketsRepository } from './data-access/support-tickets.repository';

describe('SupportTickets Feature', () => {
  it('should be defined', () => {
    expect(SupportTicketsStore).toBeDefined();
    expect(SupportTicketsRepository).toBeDefined();
  });
});
