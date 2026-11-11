import { Injectable, signal, computed } from '@angular/core';
import { AdminRoleType, AdminPermission } from '@nukkadnow/admin-access-control';

export interface AdminOperatorSession {
  operatorId: string;
  name: string;
  email: string;
  role: AdminRoleType;
  permissions: readonly AdminPermission[];
  token: string;
  expiresAt: number; // Unix timestamp ms
  mfaVerified: boolean;
  avatarUrl?: string;
}

@Injectable({
  providedIn: 'root',
})
export class AdminSessionService {
  // In-memory reactive state (never persist raw bearer tokens to localStorage)
  private readonly sessionState = signal<AdminOperatorSession | null>(null);
  private readonly isLockedState = signal<boolean>(false);

  readonly session = this.sessionState.asReadonly();
  readonly isLocked = this.isLockedState.asReadonly();

  readonly isAuthenticated = computed(() => {
    const s = this.sessionState();
    if (!s) return false;
    return Date.now() < s.expiresAt && !this.isLockedState();
  });

  readonly currentOperator = computed(() => this.sessionState());
  readonly currentRole = computed(() => this.sessionState()?.role ?? null);
  readonly currentPermissions = computed(() => this.sessionState()?.permissions ?? []);

  setSession(session: AdminOperatorSession): void {
    this.sessionState.set(session);
    this.isLockedState.set(false);
  }

  getToken(): string | null {
    const s = this.sessionState();
    if (!s || Date.now() >= s.expiresAt) {
      return null;
    }
    return s.token;
  }

  lockConsole(): void {
    if (this.sessionState()) {
      this.isLockedState.set(true);
    }
  }

  unlockConsole(token: string, newExpiresAt?: number): void {
    const s = this.sessionState();
    if (s) {
      this.sessionState.set({
        ...s,
        token,
        expiresAt: newExpiresAt || Date.now() + 60 * 60 * 1000,
      });
      this.isLockedState.set(false);
    }
  }

  clearSession(): void {
    this.sessionState.set(null);
    this.isLockedState.set(false);
  }
}
