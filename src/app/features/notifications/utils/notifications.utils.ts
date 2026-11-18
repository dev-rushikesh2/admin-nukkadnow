export function formatBroadcastNotificationStatus(status: string): { label: string; variant: 'success' | 'warning' | 'danger' | 'info' | 'neutral' } {
  switch (status?.toUpperCase()) {
    case 'SENT':
    case 'DELIVERED':
    case 'SUCCESS':
      return { label: 'Dispatched', variant: 'success' };
    case 'SCHEDULED':
    case 'PENDING':
    case 'QUEUED':
      return { label: 'Scheduled', variant: 'info' };
    case 'FAILED':
    case 'BOUNCED':
      return { label: 'Delivery Failed', variant: 'danger' };
    default:
      return { label: status || 'Unknown', variant: 'neutral' };
  }
}

export function formatChannelBadge(channel: string): { label: string; icon: string; variant: 'success' | 'info' | 'warning' | 'neutral' } {
  switch (channel?.toUpperCase()) {
    case 'WHATSAPP':
      return { label: 'WhatsApp API', icon: '💬', variant: 'success' };
    case 'SMS':
      return { label: 'Transactional SMS', icon: '📱', variant: 'info' };
    case 'PUSH':
      return { label: 'Push Notification', icon: '🔔', variant: 'warning' };
    case 'IN_APP_BANNER':
      return { label: 'In-App Banner', icon: '📢', variant: 'neutral' };
    default:
      return { label: channel || 'General', icon: '✉️', variant: 'neutral' };
  }
}

export function formatAudienceLabel(audience: string, city: string, locality?: string): string {
  const geo = city === 'GLOBAL' ? 'All Pilot Cities' : `${city} ${locality && locality !== 'ALL' ? '(' + locality + ')' : ''}`;
  switch (audience?.toUpperCase()) {
    case 'ALL_CUSTOMERS':
      return `All Active Consumers (${geo})`;
    case 'ALL_MERCHANTS':
      return `All Registered Merchants (${geo})`;
    case 'CITY_CUSTOMERS':
      return `Local Consumers (${geo})`;
    case 'CITY_MERCHANTS':
      return `Local Merchants (${geo})`;
    case 'LOCALITY_CUSTOMERS':
      return `Micro-Market Shoppers (${geo})`;
    default:
      return `${audience} (${geo})`;
  }
}
