export const environment = {
  production: true,
  staging: false,
  envName: 'production',
  apiBaseUrl: 'https://api.nukkadnow.example/api/v1/admin',
  realtimeWsUrl: 'wss://api.nukkadnow.example/api/v1/admin/realtime',
  sessionIdleTimeoutMinutes: 15,
  sessionWarningCountdownSeconds: 60,
  stepUpTicketTtlSeconds: 300,
  mfaChallengeTimeoutSeconds: 180,
  defaultLocality: 'Nagpur',
  defaultCoordinates: {
    lat: 21.1458,
    lng: 79.0882,
  },
  piiMaskingEnabled: true,
  strictAuditEnforcement: true,
};
