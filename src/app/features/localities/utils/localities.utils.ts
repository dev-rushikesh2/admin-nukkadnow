export function formatLocalityStatus(status: string): { label: string; variant: 'success' | 'warning' | 'danger' | 'info' | 'neutral' } {
  switch (status.toUpperCase()) {
    case 'ACTIVE':
    case 'VERIFIED':
    case 'CONFIRMED':
    case 'HEALTHY':
      return { label: 'Active Service', variant: 'success' };
    case 'CONGESTED':
      return { label: 'High Congestion', variant: 'warning' };
    case 'MAINTENANCE':
      return { label: 'Maintenance Mode', variant: 'info' };
    case 'SUSPENDED':
    case 'INACTIVE':
    case 'CLOSED':
      return { label: 'Inactive / Suspended', variant: 'danger' };
    default:
      return { label: status, variant: 'neutral' };
  }
}
