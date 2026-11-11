import { Injectable, signal, computed, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, tap } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface StepUpTicket {
  ticket: string;
  action: string;
  issuedAt: number;
  expiresAt: number;
}

@Injectable({
  providedIn: 'root',
})
export class StepUpAuthService {
  private readonly http = inject(HttpClient);
  private readonly activeTickets = signal<Map<string, StepUpTicket>>(new Map());

  readonly hasElevatedPrivilege = computed(() => this.activeTickets().size > 0);

  /**
   * Check if a valid, unexpired step-up ticket exists for the given action
   */
  hasValidTicket(action: string): boolean {
    const ticket = this.activeTickets().get(action);
    if (!ticket) return false;
    return Date.now() < ticket.expiresAt;
  }

  getTicket(action: string): string | null {
    const ticket = this.activeTickets().get(action);
    if (!ticket || Date.now() >= ticket.expiresAt) return null;
    return ticket.ticket;
  }

  /**
   * Request step-up challenge initiation from API Gateway
   */
  requestChallenge(action: string): Observable<{ challengeId: string; type: 'TOTP' | 'WEBAUTHN' }> {
    return this.http.post<{ challengeId: string; type: 'TOTP' | 'WEBAUTHN' }>(
      `${environment.apiBaseUrl}/auth/step-up/challenge`,
      { action }
    );
  }

  /**
   * Verify operator TOTP / Biometric code and receive short-lived step-up ticket
   */
  verifyChallenge(challengeId: string, code: string, action: string): Observable<{ stepUpTicket: string; ttlSeconds: number }> {
    return this.http.post<{ stepUpTicket: string; ttlSeconds: number }>(
      `${environment.apiBaseUrl}/auth/step-up/verify`,
      { challengeId, code, action }
    ).pipe(
      tap((res) => {
        const ticket: StepUpTicket = {
          ticket: res.stepUpTicket,
          action,
          issuedAt: Date.now(),
          expiresAt: Date.now() + res.ttlSeconds * 1000,
        };
        const current = new Map(this.activeTickets());
        current.set(action, ticket);
        this.activeTickets.set(current);
      })
    );
  }

  /**
   * Revoke elevated ticket upon completion of sensitive action or manual revocation
   */
  consumeTicket(action: string): void {
    const current = new Map(this.activeTickets());
    current.delete(action);
    this.activeTickets.set(current);
  }
}
