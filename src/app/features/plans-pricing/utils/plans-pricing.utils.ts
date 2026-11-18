export function formatPricingPlanStatus(status: string): { label: string; variant: 'success' | 'warning' | 'danger' | 'info' | 'neutral' } {
  switch (status.toUpperCase()) {
    case 'ACTIVE':
    case 'VERIFIED':
    case 'HEALTHY':
      return { label: 'Active Tier', variant: 'success' };
    case 'ARCHIVED':
    case 'SUSPENDED':
    case 'INACTIVE':
      return { label: 'Grandfathered / Archived', variant: 'neutral' };
    default:
      return { label: status, variant: 'neutral' };
  }
}
