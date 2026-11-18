export function formatReviewModerationStatus(status: string): { label: string; variant: 'success' | 'warning' | 'danger' | 'info' | 'neutral' } {
  switch (status.toUpperCase()) {
    case 'APPROVED':
    case 'ACTIVE':
    case 'VERIFIED':
      return { label: 'Approved', variant: 'success' };
    case 'FLAGGED':
    case 'IN_REVIEW':
    case 'PENDING':
      return { label: 'Flagged / Review', variant: 'warning' };
    case 'REMOVED':
    case 'HIDDEN':
    case 'REJECTED':
      return { label: 'Removed / Hidden', variant: 'danger' };
    default:
      return { label: status, variant: 'neutral' };
  }
}

export function formatSentimentBadge(sentiment: string): { label: string; variant: 'success' | 'warning' | 'danger' | 'info' | 'neutral' } {
  switch (sentiment?.toUpperCase()) {
    case 'POSITIVE':
      return { label: 'Positive', variant: 'success' };
    case 'NEUTRAL':
      return { label: 'Neutral', variant: 'info' };
    case 'CRITICAL':
      return { label: 'Critical Issue', variant: 'warning' };
    case 'SPAM_SUSPECTED':
      return { label: 'Spam Suspected', variant: 'danger' };
    default:
      return { label: sentiment || 'Unknown', variant: 'neutral' };
  }
}
