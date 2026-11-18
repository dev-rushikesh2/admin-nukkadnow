import { Injectable, signal, computed } from '@angular/core';
import { AdminRole, AdminPermission, AdminGeoAssignment, ADMIN_ROLE_MATRIX } from '@nukkadnow/admin-access-control';

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
  // Initial default operator session (Root Admin for ultimate platform control)
  private readonly defaultSession: AdminOperatorSession = {
    operatorId: 'usr-root-001',
    name: 'Rajesh Nukkad (Platform Founder)',
    email: 'founder@nukkadnow.com',
    role: AdminRole.ROOT_ADMIN,
    permissions: ADMIN_ROLE_MATRIX[AdminRole.ROOT_ADMIN].permissions,
    token: 'jwt-root-admin-simulated-bearer-token',
    expiresAt: Date.now() + 24 * 60 * 60 * 1000,
    mfaVerified: true,
    isRootProtected: true,
  };

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
  readonly currentRole = computed(() => this.sessionState()?.role ?? AdminRole.ROOT_ADMIN);
  readonly currentPermissions = computed(() => this.sessionState()?.permissions ?? []);
  readonly currentGeo = computed(() => this.sessionState()?.geoAssignment ?? null);
  readonly geoAssignment = this.currentGeo;
  readonly isRootProtected = computed(() => this.sessionState()?.isRootProtected ?? (this.sessionState()?.role === AdminRole.ROOT_ADMIN));

  readonly isRoot = computed(() => this.sessionState()?.role === AdminRole.ROOT_ADMIN);
  readonly isSuperAdmin = computed(() => this.sessionState()?.role === AdminRole.SUPER_ADMIN);
  readonly isCityManager = computed(() => this.sessionState()?.role === AdminRole.CITY_OPERATIONS_MANAGER);
  readonly isVerificationStaff = computed(() => this.sessionState()?.role === AdminRole.VERIFICATION_STAFF);
  readonly isSupportStaff = computed(() => this.sessionState()?.role === AdminRole.SUPPORT_STAFF);

  private getInitialSession(): AdminOperatorSession {
    if (typeof localStorage !== 'undefined') {
      try {
        const stored = localStorage.getItem('nukkadnow_admin_session');
        if (stored) {
          const parsed = JSON.parse(stored);
          if (parsed && parsed.role && Date.now() < parsed.expiresAt) {
            return parsed;
          }
        }
      } catch (e) {}
    }
    return this.defaultSession;
  }

  setSession(session: AdminOperatorSession): void {
    this.sessionState.set(session);
    this.isLockedState.set(false);
    if (typeof localStorage !== 'undefined') {
      try {
        localStorage.setItem('nukkadnow_admin_session', JSON.stringify(session));
      } catch (e) {}
    }
  }

  switchRole(role: AdminRole, geoAssignment?: AdminGeoAssignment): void {
    const roleDef = ADMIN_ROLE_MATRIX[role];
    let name = 'Platform Administrator';
    let email = 'admin@nukkadnow.com';
    let isRootProtected = false;

    if (role === AdminRole.ROOT_ADMIN) {
      name = 'Rajesh Nukkad (Platform Founder)';
      email = 'founder@nukkadnow.com';
      isRootProtected = true;
    } else if (role === AdminRole.SUPER_ADMIN) {
      name = 'Rushi Platform Architect';
      email = 'admin@nukkadnow.com';
    } else if (role === AdminRole.CITY_OPERATIONS_MANAGER) {
      if (geoAssignment?.cityName === 'Pune') {
        name = 'Sneha Kulkarni (Pune Lead)';
        email = 'pune.ops@nukkadnow.com';
      } else if (geoAssignment?.cityName === 'Akola') {
        name = 'Rajesh Sharma (Akola Lead)';
        email = 'akola.ops@nukkadnow.com';
      } else if (geoAssignment?.cityName === 'Amravati') {
        name = 'Pooja Deshmukh (Amravati Lead)';
        email = 'amravati.ops@nukkadnow.com';
      } else {
        name = 'Amit Deshpande (Nagpur Lead)';
        email = 'nagpur.ops@nukkadnow.com';
      }
    } else if (role === AdminRole.VERIFICATION_STAFF) {
      name = 'Sunita Compliance Officer';
      email = 'sunita.kyc@nukkadnow.com';
    } else if (role === AdminRole.SUPPORT_STAFF) {
      name = 'Ananya Support Specialist';
      email = 'ananya.support@nukkadnow.com';
    }

    const newSession: AdminOperatorSession = {
      operatorId: `usr-${role.toLowerCase().slice(0, 4)}-001`,
      name,
      email,
      role,
      permissions: roleDef.permissions,
      geoAssignment: geoAssignment || (role === AdminRole.CITY_OPERATIONS_MANAGER ? {
        state: 'Maharashtra',
        district: 'Nagpur',
        cityId: 'city-ngp-01',
        cityName: 'Nagpur',
        localities: ['Sitabuldi', 'Dharampeth', 'Sadar', 'Ramdaspeth', 'Mahal', 'Wardha Road'],
      } : undefined),
      token: `jwt-${role.toLowerCase()}-simulated-bearer-token`,
      expiresAt: Date.now() + 24 * 60 * 60 * 1000,
      mfaVerified: roleDef.requiresMfa,
      isRootProtected,
    };

    this.setSession(newSession);
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
    if (typeof localStorage !== 'undefined') {
      try {
        localStorage.removeItem('nukkadnow_admin_session');
      } catch (e) {}
    }
  }
}

export { AdminSessionService as SessionService };

