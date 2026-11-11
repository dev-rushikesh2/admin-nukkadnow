import { PlatformSettingViewModel } from '../models/settings-view.model';

export function formatPlatformSettingStatus(status: string): { label: string; variant: 'success' | 'warning' | 'danger' | 'info' | 'neutral' } {
  switch (status.toUpperCase()) {
    case 'ACTIVE':
    case 'VERIFIED':
    case 'CONFIRMED':
    case 'SUCCESS':
    case 'HEALTHY':
      return { label: status, variant: 'success' };
    case 'PENDING':
    case 'REVIEW':
    case 'PROCESSING':
    case 'IN_PROGRESS':
      return { label: status, variant: 'warning' };
    case 'SUSPENDED':
    case 'REJECTED':
    case 'FAILED':
    case 'CANCELLED':
    case 'DEGRADED':
      return { label: status, variant: 'danger' };
    default:
      return { label: status, variant: 'neutral' };
  }
}
