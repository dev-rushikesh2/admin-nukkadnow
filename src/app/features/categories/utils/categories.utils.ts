export function formatCategoryStatus(status: string): { label: string; variant: 'success' | 'warning' | 'danger' | 'info' | 'neutral' } {
  switch (status.toUpperCase()) {
    case 'ACTIVE':
    case 'VERIFIED':
    case 'HEALTHY':
      return { label: 'Active Category', variant: 'success' };
    case 'DRAFT':
    case 'REVIEW':
    case 'PENDING':
      return { label: 'Draft / Staging', variant: 'warning' };
    case 'ARCHIVED':
    case 'SUSPENDED':
    case 'INACTIVE':
      return { label: 'Archived', variant: 'neutral' };
    default:
      return { label: status, variant: 'neutral' };
  }
}
