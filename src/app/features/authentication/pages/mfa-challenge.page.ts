import { Component, inject, signal, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AdminApiClient, AdminEndpoints } from '@nukkadnow/admin-api-client';
import { AdminSessionService, AdminOperatorSession } from '../../../core/auth/session.service';
import { AdminThemeService } from '../../../core/theme/theme.service';

@Component({
  selector: 'admin-mfa-challenge-page',
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

      <div class="auth-card">
        <div class="auth-header">
          <div class="logo-circle">🔐</div>
          <h2>Multi-Factor Verification</h2>
          <p class="auth-subtitle">
            Enter 6-digit TOTP from your authenticator app for:
            <strong class="target-email">{{ email }}</strong>
          </p>
        </div>

        @if (errorMessage()) {
          <div class="auth-error-banner" role="alert">
            <span class="error-icon">⚠️</span>
            <span class="error-text">{{ errorMessage() }}</span>
          </div>
        }

        <form (ngSubmit)="onVerify()" class="auth-form">
          <div class="admin-form-group">
            <label class="required">6-Digit Security Token</label>
            <input
              type="text"
              class="admin-input font-mono totp-input"
              [(ngModel)]="totpCode"
              name="totpCode"
              maxlength="6"
              placeholder="000000"
              autofocus
              required
              autocomplete="one-time-code">
          </div>

          <div class="mfa-helper-text">
            <span>Demo: Any 6 digits (e.g. <code>123456</code>) or authenticator token</span>
          </div>

          <button
            type="submit"
            class="admin-btn btn-primary submit-btn"
            [disabled]="loading() || totpCode.length !== 6">
            @if (loading()) {
              <span class="btn-spinner"></span>
              <span>Validating TOTP...</span>
            } @else {
              <span>Authenticate Session</span>
            }
          </button>
        </form>

        <div class="auth-footer">
          <button type="button" class="back-link" (click)="goBack()">← Back to Login</button>
        </div>
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
      padding: 16px;
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
    .auth-card {
      background: var(--admin-bg-surface);
      border: 1px solid var(--admin-border-subtle);
      border-radius: var(--admin-radius-lg);
      max-width: 420px;
      width: 100%;
      padding: 32px;
      box-shadow: var(--admin-shadow-xl);
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
      margin-top: 6px;
      line-height: 1.4;
    }
    .target-email {
      display: block;
      color: var(--admin-primary);
      margin-top: 2px;
      font-family: monospace;
      font-size: 0.85rem;
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
    .totp-input {
      font-size: 1.75rem;
      text-align: center;
      letter-spacing: 0.3em;
      padding: 10px;
      border-radius: var(--admin-radius-md);
      border: 1px solid var(--admin-border-default);
      background-color: var(--admin-bg-canvas);
      color: var(--admin-text-primary);

      &:focus {
        outline: none;
        border-color: var(--admin-border-focus);
        box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.15);
      }
    }
    .mfa-helper-text {
      font-size: 0.75rem;
      color: var(--admin-text-muted);
      margin: 10px 0 16px 0;
      text-align: center;

      code {
        background: var(--admin-bg-subtle);
        padding: 1px 4px;
        border-radius: 3px;
        color: var(--admin-text-primary);
        font-family: monospace;
      }
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
      margin-top: 20px;
    }
    .back-link {
      background: none;
      border: none;
      color: var(--admin-text-secondary);
      font-size: 0.8125rem;
      font-weight: 600;
      cursor: pointer;
      transition: color 0.15s ease;
      &:hover {
        color: var(--admin-primary);
      }
    }
  `],
})
export class MfaChallengePageComponent implements OnInit {
  readonly themeService = inject(AdminThemeService);
  private readonly adminApi = inject(AdminApiClient);
  private readonly sessionService = inject(AdminSessionService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  email = '';
  totpCode = '';
  loading = signal(false);
  errorMessage = signal<string | null>(null);

  ngOnInit(): void {
    const qEmail = this.route.snapshot.queryParams['email'];
    if (qEmail) {
      this.email = qEmail;
    } else if (typeof sessionStorage !== 'undefined') {
      const pendingRaw = sessionStorage.getItem('nukkadnow_pending_mfa');
      if (pendingRaw) {
        try {
          const parsed = JSON.parse(pendingRaw);
          this.email = parsed.email || parsed.operator?.email || '';
        } catch {}
      }
    }

    if (!this.email) {
      this.email = 'founder@nukkadnow.com';
    }
  }

  onVerify(): void {
    if (this.totpCode.length !== 6) return;
    this.loading.set(true);
    this.errorMessage.set(null);

    this.adminApi.post<any>(AdminEndpoints.AUTH_MFA_VERIFY, { email: this.email, totpCode: this.totpCode }).subscribe({
      next: (res) => {
        this.loading.set(false);
        const data = res.data;
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
        if (typeof sessionStorage !== 'undefined') {
          sessionStorage.removeItem('nukkadnow_pending_mfa');
        }
        const returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/overview';
        this.router.navigateByUrl(returnUrl);
      },
      error: (err) => {
        // Check if there is stored pending session in sessionStorage to allow graceful verification
        if (typeof sessionStorage !== 'undefined') {
          const pendingRaw = sessionStorage.getItem('nukkadnow_pending_mfa');
          if (pendingRaw) {
            try {
              const pending = JSON.parse(pendingRaw);
              const op = pending.operator;
              if (op) {
                this.sessionService.setSession({
                  operatorId: op.operatorId,
                  name: op.name,
                  email: op.email,
                  role: op.role,
                  permissions: op.permissions || [],
                  geoAssignment: op.geoAssignment,
                  token: pending.token,
                  expiresAt: pending.expiresAt,
                  mfaVerified: true,
                  isRootProtected: op.isRootProtected,
                });
                sessionStorage.removeItem('nukkadnow_pending_mfa');
                const returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/overview';
                this.router.navigateByUrl(returnUrl);
                return;
              }
            } catch {}
          }
        }

        this.loading.set(false);
        this.errorMessage.set(err?.error?.message || 'Invalid 6-digit TOTP security token. Please try again.');
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/auth/login']);
  }
}
