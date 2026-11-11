export const environment = {
  production: false,
  staging: true,
  envName: 'staging',
  apiBaseUrl: 'https://staging-api.nukkadnow.example/api/v1/admin',
  realtimeWsUrl: 'wss://staging-api.nukkadnow.example/api/v1/admin/realtime',
  sessionIdleTimeoutMinutes: 20,
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
