export function formatPaymentTransactionStatus(status: string): { label: string; variant: 'success' | 'warning' | 'danger' | 'info' | 'neutral' } {
  switch (status.toUpperCase()) {
    case 'SETTLED':
    case 'CAPTURED':
    case 'SUCCESS':
      return { label: status === 'SETTLED' ? 'Settled to Escrow' : 'Payment Captured', variant: 'success' };
    case 'PENDING':
    case 'PROCESSING':
      return { label: 'Awaiting Settlement', variant: 'warning' };
    case 'FAILED':
    case 'CANCELLED':
      return { label: 'Payment Failed', variant: 'danger' };
    default:
      return { label: status, variant: 'neutral' };
  }
}
