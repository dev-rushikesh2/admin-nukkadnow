import { Component, inject, signal, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AdminApiClient, AdminEndpoints } from '@nukkadnow/admin-api-client';
import { AdminSessionService, AdminOperatorSession } from '../../../core/auth/session.service';
import { AdminThemeService } from '../../../core/theme/theme.service';
import { environment } from '../../../../environments/environment';

interface ProvisionedAccount {
  levelTitle: string;
  roleTitle: string;
  name: string;
  email: string;
  password: string;
  badge: string;
  cityScope: string;
}

@Component({
  selector: 'admin-login-page',
  standalone: true,
  imports: [CommonModule, FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="auth-page-container">
      <div class="theme-corner-toggle">
        <button
          type="button"
          class="theme-toggle-btn"
          [attr.aria-label]="themeService.currentTheme() === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'"
          [title]="themeService.currentTheme() === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'"
          (click)="themeService.toggleTheme()">
          @if (themeService.currentTheme() === 'dark') {
            <span>☀️ Light Mode</span>
          } @else {
            <span>🌙 Dark Mode</span>
          }
        </button>
      </div>

      <div class="auth-wrapper">
        <div class="auth-card">
          <div class="auth-header">
            <div class="logo-circle">🏪</div>
            <h2>NukkadNow Admin Portal</h2>
            <p class="auth-subtitle">Enterprise Gateway · Individual Operator Authentication</p>
          </div>

          @if (errorMessage()) {
            <div class="auth-error-banner" role="alert">
              <span class="error-icon">⚠️</span>
              <span class="error-text">{{ errorMessage() }}</span>
            </div>
          }

          <form (ngSubmit)="onSubmit()" class="auth-form">
            <div class="admin-form-group">
              <label class="required">Operator Work Email / Username</label>
              <input
                type="email"
                class="admin-input font-mono"
                [(ngModel)]="email"
                name="email"
                placeholder="e.g. founder@nukkadnow.com"
                required
                autocomplete="username">
            </div>

            <div class="admin-form-group">
              <div class="label-row">
                <label class="required">Security Password</label>
                <button 
                  type="button" 
                  class="btn-toggle-pwd" 
                  (click)="showPassword.set(!showPassword())"
                  tabindex="-1">
                  {{ showPassword() ? 'Hide' : 'Show' }}
                </button>
              </div>
              <input
                [type]="showPassword() ? 'text' : 'password'"
                class="admin-input font-mono"
                [(ngModel)]="password"
                name="password"
                placeholder="••••••••••••"
                required
                autocomplete="current-password">
            </div>

            <div class="security-disclaimer">
              🔒 Multi-tier Role-Based Access Control (RBAC) & strict municipal geographic isolation active.
            </div>

            <button
              type="submit"
              class="admin-btn btn-primary submit-btn"
              [disabled]="loading() || !email || !password">
              @if (loading()) {
                <span class="btn-spinner"></span>
                <span>Authenticating Credentials...</span>
              } @else {
                <span>Sign In to Platform</span>
              }
            </button>
          </form>

          <div class="auth-footer">
            <span>Production Ingress Protected · TLS 1.3 / DPDP Act 2023 Compliant</span>
          </div>
        </div>

        <!-- 4-Level Admin Hierarchy Quick-Fill Test Accounts (Dev/Staging Only) -->
        @if (!isProduction) {
          <div class="demo-accounts-card">
            <div class="demo-accounts-header">
              <strong class="demo-title">📋 4-Level Administrative Hierarchy Accounts</strong>
              <p class="demo-sub">Select an account below to populate verified individual credentials:</p>
            </div>

            <div class="accounts-grid">
              @for (acc of provisionedAccounts; track acc.email) {
                <button 
                  type="button" 
                  class="account-pill-card"
                  [class.selected]="email === acc.email"
                  (click)="fillCredentials(acc)">
                  <div class="acc-row-top">
                    <span class="acc-badge" [ngClass]="acc.badge">{{ acc.levelTitle }}</span>
                    <span class="acc-city">📍 {{ acc.cityScope }}</span>
                  </div>
                  <div class="acc-name">{{ acc.name }}</div>
                  <div class="acc-email font-mono">{{ acc.email }}</div>
                  <div class="acc-pwd-hint">Password: <code>{{ acc.password }}</code></div>
                </button>
              }
            </div>
          </div>
        }
      </div>
    </div>
  `,
  styles: [`
    .auth-page-container {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: var(--admin-bg-canvas);
      padding: 32px 16px;
      position: relative;
    }
    .theme-corner-toggle {
      position: absolute;
      top: 20px;
      right: 20px;
      z-index: 10;
    }
    .theme-toggle-btn {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      background-color: var(--admin-bg-surface);
      border: 1px solid var(--admin-border-default);
      color: var(--admin-text-primary);
      padding: 6px 14px;
      border-radius: var(--admin-radius-full);
      font-size: 0.8125rem;
      font-weight: 600;
      cursor: pointer;
      box-shadow: var(--admin-shadow-sm);
      transition: all 0.15s ease-in-out;

      &:hover {
        background-color: var(--admin-bg-hover);
        border-color: var(--admin-border-focus);
        transform: translateY(-1px);
        box-shadow: var(--admin-shadow-md);
      }
    }

    .auth-wrapper {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 24px;
      max-width: 860px;
      width: 100%;
    }

    .auth-card {
      background: var(--admin-bg-surface);
      border: 1px solid var(--admin-border-subtle);
      border-radius: var(--admin-radius-lg);
      max-width: 440px;
      width: 100%;
      padding: 32px;
      box-shadow: var(--admin-shadow-xl);
      transition: background-color 0.2s ease, border-color 0.2s ease;
    }

    .auth-header {
      text-align: center;
      margin-bottom: 24px;
    }
    .logo-circle {
      font-size: 2.5rem;
      margin-bottom: 8px;
    }
    h2 {
      font-size: 1.35rem;
      font-weight: 700;
      margin: 0;
      color: var(--admin-text-primary);
    }
    .auth-subtitle {
      font-size: 0.8125rem;
      color: var(--admin-text-muted);
      margin-top: 4px;
    }

    .auth-error-banner {
      background: var(--admin-danger-subtle);
      border: 1px solid rgba(239, 68, 68, 0.3);
      color: var(--admin-danger);
      padding: 10px 14px;
      border-radius: var(--admin-radius-md);
      font-size: 0.8125rem;
      margin-bottom: 16px;
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .error-icon {
      font-size: 1.1rem;
    }

    .auth-form {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .admin-form-group {
      display: flex;
      flex-direction: column;
      gap: 6px;

      label {
        font-size: 0.8125rem;
        font-weight: 600;
        color: var(--admin-text-primary);
        &.required::after {
          content: ' *';
          color: var(--admin-danger);
        }
      }
    }

    .label-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .btn-toggle-pwd {
      background: none;
      border: none;
      color: var(--admin-text-muted);
      font-size: 0.75rem;
      font-weight: 600;
      cursor: pointer;
      padding: 0 4px;

      &:hover {
        color: var(--admin-primary);
      }
    }

    .admin-input {
      padding: 10px 12px;
      border-radius: var(--admin-radius-md);
      border: 1px solid var(--admin-border-default);
      background-color: var(--admin-bg-canvas);
      color: var(--admin-text-primary);
      font-size: 0.875rem;
      transition: border-color 0.15s ease;

      &:focus {
        outline: none;
        border-color: var(--admin-border-focus);
        box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.15);
      }
    }

    .security-disclaimer {
      font-size: 0.75rem;
      color: var(--admin-text-muted);
      line-height: 1.4;
      background: var(--admin-bg-subtle);
      padding: 8px 10px;
      border-radius: var(--admin-radius-sm);
      border: 1px solid var(--admin-border-subtle);
    }

    .submit-btn {
      width: 100%;
      padding: 11px;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      font-weight: 700;
      font-size: 0.875rem;
      border-radius: var(--admin-radius-md);
      cursor: pointer;
    }

    .btn-spinner {
      width: 16px;
      height: 16px;
      border: 2px solid rgba(255, 255, 255, 0.3);
      border-top-color: #ffffff;
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }

    .auth-footer {
      text-align: center;
      margin-top: 24px;
      font-size: 0.7rem;
      color: var(--admin-text-muted);
    }

    /* Demo Quick-Fill Accounts Grid */
    .demo-accounts-card {
      background: var(--admin-bg-surface);
      border: 1px solid var(--admin-border-subtle);
      border-radius: var(--admin-radius-lg);
      padding: 20px 24px;
      width: 100%;
      box-shadow: var(--admin-shadow-md);
    }

    .demo-accounts-header {
      margin-bottom: 16px;
      text-align: center;
    }
    .demo-title {
      font-size: 0.9375rem;
      color: var(--admin-text-primary);
      display: block;
    }
    .demo-sub {
      font-size: 0.8125rem;
      color: var(--admin-text-muted);
      margin: 4px 0 0 0;
    }

    .accounts-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(190px, 1fr));
      gap: 12px;
    }

    .account-pill-card {
      background: var(--admin-bg-canvas);
      border: 1px solid var(--admin-border-subtle);
      border-radius: var(--admin-radius-md);
      padding: 10px 12px;
      text-align: left;
      cursor: pointer;
      display: flex;
      flex-direction: column;
      gap: 4px;
      transition: all 0.15s ease;

      &:hover {
        border-color: var(--admin-primary);
        background: var(--admin-bg-hover);
        transform: translateY(-1px);
      }

      &.selected {
        border-color: var(--admin-primary);
        box-shadow: 0 0 0 2px rgba(37, 99, 235, 0.2);
        background: var(--admin-bg-subtle);
      }
    }

    .acc-row-top {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 0.7rem;
    }

    .acc-badge {
      font-weight: 700;
      padding: 2px 6px;
      border-radius: 4px;

      &.root { background: #fef3c7; color: #b45309; }
      &.super { background: #dbeafe; color: #1d4ed8; }
      &.city { background: #dcfce7; color: #15803d; }
      &.staff { background: #f3e8ff; color: #7e22ce; }
    }

    .acc-city {
      color: var(--admin-text-muted);
      font-size: 0.6875rem;
      font-weight: 600;
    }

    .acc-name {
      font-size: 0.8125rem;
      font-weight: 700;
      color: var(--admin-text-primary);
      margin-top: 2px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .acc-email {
      font-size: 0.72rem;
      color: var(--admin-text-secondary);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .acc-pwd-hint {
      font-size: 0.6875rem;
      color: var(--admin-text-muted);
      margin-top: 4px;
      code {
        font-family: inherit;
        background: var(--admin-bg-subtle);
        padding: 1px 4px;
        border-radius: 3px;
        color: var(--admin-text-primary);
      }
    }
  `]
})
export class LoginPageComponent {
  readonly themeService = inject(AdminThemeService);
  readonly isProduction = environment.production;
  private readonly adminApi = inject(AdminApiClient);
  private readonly sessionService = inject(AdminSessionService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  email = environment.production ? '' : 'founder@nukkadnow.com';
  password = environment.production ? '' : 'Root@Nukkad2026!';
  showPassword = signal(false);
  loading = signal(false);
  errorMessage = signal<string | null>(null);

  readonly provisionedAccounts: ProvisionedAccount[] = environment.production ? [] : [
    {
      levelTitle: '👑 Level 1',
      roleTitle: 'Root Admin',
      name: 'Rajesh Nukkad (Founder)',
      email: 'founder@nukkadnow.com',
      password: 'Root@Nukkad2026!',
      badge: 'root',
      cityScope: 'Global'
    },
    {
      levelTitle: '⚡ Level 2',
      roleTitle: 'Super Admin',
      name: 'Rushi Platform Architect',
      email: 'admin@nukkadnow.com',
      password: 'Super@Nukkad2026!',
      badge: 'super',
      cityScope: 'Global'
    },
    {
      levelTitle: '📍 Level 3',
      roleTitle: 'City Manager',
      name: 'Rajesh Sharma (Akola Lead)',
      email: 'akola.ops@nukkadnow.com',
      password: 'Akola@Nukkad2026!',
      badge: 'city',
      cityScope: 'Akola'
    },
    {
      levelTitle: '📍 Level 3',
      roleTitle: 'City Manager',
      name: 'Pooja Deshmukh (Amravati Lead)',
      email: 'amravati.ops@nukkadnow.com',
      password: 'Amravati@Nukkad2026!',
      badge: 'city',
      cityScope: 'Amravati'
    },
    {
      levelTitle: '📍 Level 3',
      roleTitle: 'City Manager',
      name: 'Amit Deshpande (Nagpur Lead)',
      email: 'nagpur.ops@nukkadnow.com',
      password: 'Nagpur@Nukkad2026!',
      badge: 'city',
      cityScope: 'Nagpur'
    },
    {
      levelTitle: '📍 Level 3',
      roleTitle: 'City Manager',
      name: 'Sneha Kulkarni (Pune Lead)',
      email: 'pune.ops@nukkadnow.com',
      password: 'Pune@Nukkad2026!',
      badge: 'city',
      cityScope: 'Pune'
    },
    {
      levelTitle: '📑 Level 4',
      roleTitle: 'Verification Staff',
      name: 'Sunita KYC Compliance',
      email: 'sunita.kyc@nukkadnow.com',
      password: 'Verify@Nukkad2026!',
      badge: 'staff',
      cityScope: 'Nagpur'
    },
    {
      levelTitle: '🎧 Level 4',
      roleTitle: 'Support Staff',
      name: 'Ananya Support Desk',
      email: 'ananya.support@nukkadnow.com',
      password: 'Support@Nukkad2026!',
      badge: 'staff',
      cityScope: 'Global Support'
    }
  ];

  fillCredentials(account: ProvisionedAccount): void {
    this.email = account.email;
    this.password = account.password;
    this.errorMessage.set(null);
  }

  onSubmit(): void {
    const email = this.email.trim();
    const password = this.password;

    if (!email || !password) {
      this.errorMessage.set('Please enter both your work email and password.');
      return;
    }

    this.loading.set(true);
    this.errorMessage.set(null);

    this.adminApi.post<any>(AdminEndpoints.AUTH_LOGIN, { email, password }).subscribe({
      next: (res) => {
        this.loading.set(false);
        const data = res.data;

        if (data?.requiresMfa) {
          // Stash pending session for TOTP challenge
          if (typeof sessionStorage !== 'undefined') {
            sessionStorage.setItem('nukkadnow_pending_mfa', JSON.stringify({
              email,
              token: data.token,
              operator: data.operator,
              expiresAt: data.expiresAt,
            }));
          }
          this.router.navigate(['/auth/mfa'], {
            queryParams: { email, returnUrl: this.route.snapshot.queryParams['returnUrl'] },
          });
        } else {
          // Establish authenticated operator session directly
          const session: AdminOperatorSession = {
            operatorId: data.operator.operatorId,
            name: data.operator.name,
            email: data.operator.email,
            role: data.operator.role,
            permissions: data.operator.permissions || [],
            geoAssignment: data.operator.geoAssignment,
            token: data.token,
            expiresAt: data.expiresAt,
            mfaVerified: true,
            isRootProtected: data.operator.isRootProtected,
          };
          this.sessionService.setSession(session);
          const returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/overview';
          this.router.navigateByUrl(returnUrl);
        }
      },
      error: (err) => {
        this.loading.set(false);
        this.errorMessage.set(
          err?.error?.message || 
          err?.message || 
          'Invalid administrative credentials. Please check your username/email and password.'
        );
      }
    });
  }
}
