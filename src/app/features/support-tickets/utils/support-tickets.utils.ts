export function formatSupportTicketStatus(status: string): { label: string; variant: 'success' | 'warning' | 'danger' | 'info' | 'neutral' } {
  switch (status.toUpperCase()) {
    case 'RESOLVED':
    case 'CLOSED':
    case 'SUCCESS':
      return { label: status === 'CLOSED' ? 'Ticket Closed' : 'Issue Resolved', variant: 'success' };
    case 'OPEN':
    case 'PENDING':
      return { label: 'Open (Needs Response)', variant: 'warning' };
    case 'INVESTIGATING':
    case 'IN_PROGRESS':
      return { label: 'Under Investigation', variant: 'info' };
    case 'ESCALATED':
    case 'CRITICAL':
    case 'URGENT':
      return { label: 'Escalated to Ops', variant: 'danger' };
    default:
      return { label: status, variant: 'neutral' };
  }
}
