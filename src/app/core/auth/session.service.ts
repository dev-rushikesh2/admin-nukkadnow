import { Injectable, signal, computed } from '@angular/core';
import { AdminRole, AdminPermission, AdminGeoAssignment } from '@nukkadnow/admin-access-control';

export interface AdminOperatorSession {
  operatorId: string;
  name: string;
  email: string;
  role: AdminRole;
  permissions: readonly AdminPermission[];
  geoAssignment?: AdminGeoAssignment;
  token: string;
  expiresAt: number; // Unix timestamp ms
  mfaVerified: boolean;
  avatarUrl?: string;
  isRootProtected?: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class AdminSessionService {
  private readonly sessionState = signal<AdminOperatorSession | null>(this.getInitialSession());
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
  readonly currentGeo = computed(() => this.sessionState()?.geoAssignment ?? null);
  readonly geoAssignment = this.currentGeo;
  readonly isRootProtected = computed(() => this.sessionState()?.isRootProtected ?? (this.sessionState()?.role === AdminRole.ROOT_ADMIN));

  readonly isRoot = computed(() => this.sessionState()?.role === AdminRole.ROOT_ADMIN);
  readonly isSuperAdmin = computed(() => this.sessionState()?.role === AdminRole.SUPER_ADMIN);
  readonly isCityManager = computed(() => this.sessionState()?.role === AdminRole.CITY_OPERATIONS_MANAGER);
  readonly isVerificationStaff = computed(() => this.sessionState()?.role === AdminRole.VERIFICATION_STAFF);
  readonly isSupportStaff = computed(() => this.sessionState()?.role === AdminRole.SUPPORT_STAFF);

  private getInitialSession(): AdminOperatorSession | null {
    if (typeof sessionStorage !== 'undefined') {
      try {
        const stored = sessionStorage.getItem('nukkadnow_admin_session');
        if (stored) {
          const parsed = JSON.parse(stored);
          if (parsed && parsed.role && Date.now() < parsed.expiresAt) {
            return parsed;
          }
        }
      } catch (e) {}
    }
    // Migration: purge any stale session from localStorage to prevent XSS exfiltration
    if (typeof localStorage !== 'undefined') {
      try {
        const stored = localStorage.getItem('nukkadnow_admin_session');
        if (stored) {
          localStorage.removeItem('nukkadnow_admin_session');
          const parsed = JSON.parse(stored);
          if (parsed && parsed.role && Date.now() < parsed.expiresAt) {
            if (typeof sessionStorage !== 'undefined') {
              sessionStorage.setItem('nukkadnow_admin_session', JSON.stringify(parsed));
            }
            return parsed;
          }
        }
      } catch (e) {}
    }
    return null;
  }

  setSession(session: AdminOperatorSession): void {
    this.sessionState.set(session);
    this.isLockedState.set(false);
    if (typeof sessionStorage !== 'undefined') {
      try {
        sessionStorage.setItem('nukkadnow_admin_session', JSON.stringify(session));
      } catch (e) {}
    }
    if (typeof localStorage !== 'undefined') {
      try {
        localStorage.removeItem('nukkadnow_admin_session');
      } catch (e) {}
    }
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
      this.setSession({
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
    if (typeof sessionStorage !== 'undefined') {
      try {
        sessionStorage.removeItem('nukkadnow_admin_session');
      } catch (e) {}
    }
    if (typeof localStorage !== 'undefined') {
      try {
        localStorage.removeItem('nukkadnow_admin_session');
      } catch (e) {}
    }
  }
}

export { AdminSessionService as SessionService };

