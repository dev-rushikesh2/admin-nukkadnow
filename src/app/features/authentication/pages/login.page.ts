import { Component, inject, signal, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AdminSessionService } from '../../../core/auth/session.service';
import { AdminRoleType } from '@nukkadnow/admin-access-control';

@Component({
  selector: 'admin-login-page',
  standalone: true,
  imports: [CommonModule, FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="auth-page-container">
      <div class="auth-card">
        <div class="auth-header">
          <div class="logo-circle">🏪</div>
          <h2>NukkadNow Super-Admin</h2>
          <p class="auth-subtitle">Restricted Access · Authorized Personnel Only</p>
        </div>

        @if (errorMessage()) {
          <div class="auth-error-banner">
            {{ errorMessage() }}
          </div>
        }

        <form (ngSubmit)="onSubmit()" class="auth-form">
          <div class="admin-form-group">
            <label class="required">Operator Email</label>
            <input
              type="email"
              class="admin-input"
              [(ngModel)]="email"
              name="email"
              placeholder="operator@nukkadnow.in"
              required
              autocomplete="username">
          </div>

          <div class="admin-form-group">
            <label class="required">Security Password</label>
            <input
              type="password"
              class="admin-input"
              [(ngModel)]="password"
              name="password"
              placeholder="••••••••••••"
              required
              autocomplete="current-password">
          </div>

          <div class="security-disclaimer">
            🔒 Protected by mandatory Multi-Factor Authentication (MFA) & hardware security keys.
          </div>

          <button
            type="submit"
            class="admin-btn btn-primary submit-btn"
            [disabled]="loading() || !email || !password">
            {{ loading() ? 'Authenticating...' : 'Sign In & Verify MFA' }}
          </button>
        </form>

        <div class="auth-footer">
          <span>Incident response hotline: security&#64;nukkadnow.in</span>
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
      padding: 10px;
      border-radius: var(--admin-radius-sm);
      font-size: 0.8125rem;
      margin-bottom: 16px;
    }
    .security-disclaimer {
      font-size: 0.75rem;
      color: var(--admin-text-muted);
      margin: 8px 0 16px 0;
      line-height: 1.4;
    }
    .submit-btn {
      width: 100%;
      padding: 10px;
    }
    .auth-footer {
      text-align: center;
      margin-top: 24px;
      font-size: 0.7rem;
      color: var(--admin-text-muted);
    }
  `],
})
export class LoginPageComponent {
  private readonly sessionService = inject(AdminSessionService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  email = 'superadmin@nukkadnow.in';
  password = '••••••••••••';
  loading = signal(false);
  errorMessage = signal<string | null>(null);

  onSubmit(): void {
    this.loading.set(true);
    this.errorMessage.set(null);

    // In pilot mock flow: authenticate and redirect to MFA verification challenge
    setTimeout(() => {
      this.loading.set(false);
      this.router.navigate(['/auth/mfa'], {
        queryParams: { email: this.email, returnUrl: this.route.snapshot.queryParams['returnUrl'] },
      });
    }, 600);
  }
}
