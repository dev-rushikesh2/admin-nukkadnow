export function formatOutletStatus(status: string): { label: string; variant: 'success' | 'warning' | 'danger' | 'info' | 'neutral' } {
  switch (status.toUpperCase()) {
    case 'OPEN':
    case 'ACTIVE':
    case 'HEALTHY':
      return { label: 'Accepting Orders', variant: 'success' };
    case 'BUSY':
    case 'THROTTLED':
      return { label: 'At Peak Capacity', variant: 'warning' };
    case 'PAUSED':
    case 'MAINTENANCE':
      return { label: 'Paused by Store', variant: 'info' };
    case 'CLOSED':
    case 'SUSPENDED':
    case 'INACTIVE':
      return { label: 'Closed / Offline', variant: 'danger' };
    default:
      return { label: status, variant: 'neutral' };
  }
}
