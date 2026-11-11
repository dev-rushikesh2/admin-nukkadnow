import { Component, inject, signal, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AdminSessionService } from '../../../core/auth/session.service';

@Component({
  selector: 'admin-lock-screen-page',
  standalone: true,
  imports: [CommonModule, FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="lock-page-container">
      <div class="lock-card">
        <div class="lock-avatar-circle">
          🔒
        </div>

        <h2 class="operator-title">{{ sessionService.currentOperator()?.name || 'Operator Session' }}</h2>
        <span class="operator-email">{{ sessionService.currentOperator()?.email || 'operator@nukkadnow.in' }}</span>
        <div class="lock-notice">Console locked due to inactivity. Enter credentials or TOTP to resume.</div>

        <form (ngSubmit)="onUnlock()" class="unlock-form">
          <div class="admin-form-group">
            <input
              type="password"
              class="admin-input password-input"
              [(ngModel)]="unlockSecret"
              name="unlockSecret"
              placeholder="Enter password or TOTP"
              autofocus
              required>
          </div>

          <button
            type="submit"
            class="admin-btn btn-primary unlock-btn"
            [disabled]="loading() || !unlockSecret">
            {{ loading() ? 'Unlocking...' : 'Unlock Console' }}
          </button>
        </form>

        <div class="lock-actions">
          <button type="button" class="sign-out-btn" (click)="signOut()">Switch Operator / Logout</button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .lock-page-container {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: radial-gradient(circle at 50% 30%, #1e293b 0%, #090d16 100%);
      padding: 16px;
    }
    .lock-card {
      background: var(--admin-bg-surface);
      border: 1px solid var(--admin-border-strong);
      border-radius: var(--admin-radius-lg);
      max-width: 380px;
      width: 100%;
      padding: 32px;
      text-align: center;
      box-shadow: var(--admin-shadow-xl);
    }
    .lock-avatar-circle {
      width: 64px;
      height: 64px;
      margin: 0 auto 16px auto;
      border-radius: 50%;
      background: var(--admin-bg-subtle);
      border: 2px solid var(--admin-border-default);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.75rem;
    }
    .operator-title {
      font-size: 1.2rem;
      font-weight: 700;
      margin: 0;
      color: var(--admin-text-primary);
    }
    .operator-email {
      font-size: 0.8125rem;
      color: var(--admin-text-muted);
      display: block;
      margin-top: 2px;
    }
    .lock-notice {
      font-size: 0.75rem;
      color: var(--admin-warning);
      background: var(--admin-warning-subtle);
      border: 1px solid rgba(245, 158, 11, 0.2);
      border-radius: var(--admin-radius-sm);
      padding: 8px;
      margin: 16px 0;
    }
    .unlock-btn {
      width: 100%;
      margin-top: 8px;
    }
    .lock-actions {
      margin-top: 20px;
    }
    .sign-out-btn {
      background: none;
      border: none;
      color: var(--admin-text-muted);
      font-size: 0.75rem;
      cursor: pointer;
      &:hover { color: var(--admin-danger); }
    }
  `],
})
export class LockScreenPageComponent {
  readonly sessionService = inject(AdminSessionService);
  private readonly router = inject(Router);

  unlockSecret = '';
  loading = signal(false);

  onUnlock(): void {
    if (!this.unlockSecret) return;
    this.loading.set(true);

    setTimeout(() => {
      this.sessionService.unlockConsole('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.unlocked-token');
      this.loading.set(false);
      this.router.navigate(['/overview']);
    }, 400);
  }

  signOut(): void {
    this.sessionService.clearSession();
    this.router.navigate(['/auth/login']);
  }
}
