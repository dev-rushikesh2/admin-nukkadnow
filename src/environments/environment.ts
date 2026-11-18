export const environment = {
  production: false,
  staging: false,
  envName: 'development',
  apiBaseUrl: 'http://localhost:4000/api/v1/admin',
  realtimeWsUrl: 'ws://localhost:4000/api/v1/admin/realtime',
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
