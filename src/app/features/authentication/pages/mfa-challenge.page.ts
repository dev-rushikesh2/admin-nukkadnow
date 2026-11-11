import { Component, inject, signal, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AdminSessionService } from '../../../core/auth/session.service';
import { AdminRoleType, ADMIN_ROLE_MATRIX } from '@nukkadnow/admin-access-control';

@Component({
  selector: 'admin-mfa-challenge-page',
  standalone: true,
  imports: [CommonModule, FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="auth-page-container">
      <div class="auth-card">
        <div class="auth-header">
          <div class="logo-circle">🔐</div>
          <h2>Multi-Factor Verification</h2>
          <p class="auth-subtitle">Enter the 6-digit TOTP from your Authenticator app</p>
        </div>

        @if (errorMessage()) {
          <div class="auth-error-banner">
            {{ errorMessage() }}
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
              placeholder="000 000"
              autofocus
              required
              autocomplete="one-time-code">
          </div>

          <div class="mfa-helper-text">
            For hardware security key (YubiKey / WebAuthn), tap your key now.
          </div>

          <button
            type="submit"
            class="admin-btn btn-primary submit-btn"
            [disabled]="loading() || totpCode.length !== 6">
            {{ loading() ? 'Verifying...' : 'Authenticate Session' }}
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
      background: radial-gradient(circle at 50% 20%, #1e293b 0%, #090d16 100%);
      padding: 16px;
    }
    .auth-card {
      background: var(--admin-bg-surface);
      border: 1px solid var(--admin-border-strong);
      border-radius: var(--admin-radius-lg);
      max-width: 420px;
      width: 100%;
      padding: 32px;
      box-shadow: var(--admin-shadow-xl);
    }
    .auth-header { text-align: center; margin-bottom: 24px; }
    .logo-circle { font-size: 2.5rem; margin-bottom: 8px; }
    h2 { font-size: 1.35rem; font-weight: 700; margin: 0; color: var(--admin-text-primary); }
    .auth-subtitle { font-size: 0.8125rem; color: var(--admin-text-muted); margin-top: 4px; }
    .auth-error-banner {
      background: var(--admin-danger-subtle);
      border: 1px solid rgba(239, 68, 68, 0.3);
      color: var(--admin-danger);
      padding: 10px;
      border-radius: var(--admin-radius-sm);
      font-size: 0.8125rem;
      margin-bottom: 16px;
    }
    .totp-input {
      font-size: 1.75rem;
      text-align: center;
      letter-spacing: 0.25em;
    }
    .mfa-helper-text {
      font-size: 0.75rem;
      color: var(--admin-text-muted);
      margin: 8px 0 16px 0;
      text-align: center;
    }
    .submit-btn { width: 100%; padding: 10px; }
    .auth-footer { text-align: center; margin-top: 20px; }
    .back-link {
      background: none; border: none; color: var(--admin-text-secondary);
      font-size: 0.8125rem; cursor: pointer;
      &:hover { color: var(--admin-text-primary); }
    }
  `],
})
export class MfaChallengePageComponent {
  private readonly sessionService = inject(AdminSessionService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  totpCode = '';
  loading = signal(false);
  errorMessage = signal<string | null>(null);

  onVerify(): void {
    if (this.totpCode.length !== 6) return;
    this.loading.set(true);

    setTimeout(() => {
      // Setup authenticated operator session with full SuperAdmin permissions
      this.sessionService.setSession({
        operatorId: 'operator-sa-001',
        name: 'Rushi Platform Architect',
        email: 'rushi@nukkadnow.in',
        role: AdminRoleType.SUPER_ADMIN,
        permissions: ADMIN_ROLE_MATRIX[AdminRoleType.SUPER_ADMIN].permissions,
        token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.admin-super-token',
        expiresAt: Date.now() + 8 * 60 * 60 * 1000,
        mfaVerified: true,
      });

      this.loading.set(false);
      const returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/overview';
      this.router.navigateByUrl(returnUrl);
    }, 500);
  }

  goBack(): void {
    this.router.navigate(['/auth/login']);
  }
}
