export function formatMerchantSubscriptionStatus(status: string): { label: string; variant: 'success' | 'warning' | 'danger' | 'info' | 'neutral' } {
  switch (status.toUpperCase()) {
    case 'ACTIVE':
    case 'VERIFIED':
    case 'HEALTHY':
      return { label: 'Active Plan', variant: 'success' };
    case 'TRIAL':
    case 'PENDING':
      return { label: 'Free Pilot Trial', variant: 'info' };
    case 'PAST_DUE':
    case 'REVIEW':
      return { label: 'Past Due (In Grace)', variant: 'warning' };
    case 'CANCELLED':
    case 'SUSPENDED':
    case 'INACTIVE':
      return { label: 'Cancelled / Lapsed', variant: 'danger' };
    default:
      return { label: status, variant: 'neutral' };
  }
}
