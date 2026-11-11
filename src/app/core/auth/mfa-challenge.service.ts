import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface MfaChallengeResponse {
  challengeId: string;
  methods: ('TOTP' | 'WEBAUTHN' | 'SMS_BACKUP')[];
  expiresInSeconds: number;
}

export interface MfaVerificationResult {
  token: string;
  expiresAt: number;
}

@Injectable({
  providedIn: 'root',
})
export class MfaChallengeService {
  private readonly http = inject(HttpClient);

  initiateMfa(loginTicket: string): Observable<MfaChallengeResponse> {
    return this.http.post<MfaChallengeResponse>(`${environment.apiBaseUrl}/auth/mfa/challenge`, {
      loginTicket,
    });
  }

  verifyMfa(challengeId: string, code: string): Observable<MfaVerificationResult> {
    return this.http.post<MfaVerificationResult>(`${environment.apiBaseUrl}/auth/mfa/verify`, {
      challengeId,
      code,
    });
  }
}
