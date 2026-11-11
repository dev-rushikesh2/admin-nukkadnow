import { Component, Input, Output, EventEmitter, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { StepUpAuthService } from '../../../core/auth/step-up-auth.service';

@Component({
  selector: 'admin-step-up-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    @if (isOpen) {
      <div class="admin-modal-backdrop">
        <div class="admin-modal-container">
          <div class="admin-modal-header">
            <h3 class="modal-title">🔐 Elevated Step-Up Authentication</h3>
            <button type="button" class="modal-close-btn" (click)="close.emit()">✕</button>
          </div>

          <div class="admin-modal-body">
            <div class="security-alert-box">
              This high-risk action (<strong>{{ actionName }}</strong>) requires secondary verification.
              Please enter your 6-digit Authenticator TOTP or Security Key code.
            </div>

            <div class="admin-form-group">
              <label class="required">6-Digit Security Code</label>
              <input
                type="text"
                class="admin-input font-mono totp-input"
                maxlength="6"
                placeholder="000 000"
                [(ngModel)]="totpCode"
                (keyup.enter)="verify()">
            </div>

            @if (errorMessage()) {
              <div class="error-text">{{ errorMessage() }}</div>
            }
          </div>

          <div class="admin-modal-footer">
            <button type="button" class="admin-btn btn-secondary" (click)="close.emit()">Cancel</button>
            <button
              type="button"
              class="admin-btn btn-primary"
              [disabled]="totpCode.length !== 6 || isVerifying()"
              (click)="verify()">
              {{ isVerifying() ? 'Verifying...' : 'Authenticate Action' }}
            </button>
          </div>
        </div>
      </div>
    }
  `,
  styles: [`
    .admin-modal-backdrop {
      position: fixed;
      top: 0; left: 0; width: 100vw; height: 100vh;
      background: rgba(0, 0, 0, 0.85);
      backdrop-filter: blur(5px);
      display: flex; align-items: center; justify-content: center;
      z-index: var(--z-index-modal);
      padding: 16px;
    }
    .admin-modal-container {
      background: var(--admin-bg-surface);
      border: 1px solid var(--admin-danger);
      border-radius: var(--admin-radius-lg);
      max-width: 440px; width: 100%;
      box-shadow: 0 0 25px rgba(239, 68, 68, 0.2);
    }
    .admin-modal-header {
      display: flex; align-items: center; justify-content: space-between;
      padding: 16px 20px;
      border-bottom: 1px solid var(--admin-border-subtle);
    }
    .modal-title { font-size: 1.05rem; font-weight: 600; margin: 0; color: #f43f5e; }
    .modal-close-btn { background: none; border: none; color: var(--admin-text-muted); cursor: pointer; font-size: 1.25rem; }
    .admin-modal-body { padding: 20px; display: flex; flex-direction: column; gap: 16px; }
    .security-alert-box {
      background-color: var(--admin-danger-subtle);
      border: 1px solid rgba(239, 68, 68, 0.3);
      color: #fca5a5;
      padding: 12px;
      border-radius: var(--admin-radius-sm);
      font-size: 0.8125rem;
      line-height: 1.4;
    }
    .totp-input {
      font-size: 1.5rem;
      text-align: center;
      letter-spacing: 0.3em;
    }
    .error-text { color: var(--admin-danger); font-size: 0.8125rem; }
    .admin-modal-footer {
      display: flex; align-items: center; justify-content: flex-end; gap: 12px;
      padding: 16px 20px;
      border-top: 1px solid var(--admin-border-subtle);
      background: var(--admin-bg-subtle);
    }
  `],
})
export class StepUpModalComponent {
  private readonly stepUpService = inject(StepUpAuthService);

  @Input() isOpen = false;
  @Input({ required: true }) actionName!: string;
  @Input({ required: true }) actionKey!: string;

  @Output() close = new EventEmitter<void>();
  @Output() verified = new EventEmitter<string>();

  totpCode = '';
  isVerifying = signal(false);
  errorMessage = signal<string | null>(null);

  verify(): void {
    if (this.totpCode.length !== 6) return;
    this.isVerifying.set(true);
    this.errorMessage.set(null);

    this.stepUpService.verifyChallenge('step-up-challenge', this.totpCode, this.actionKey).subscribe({
      next: (res) => {
        this.isVerifying.set(false);
        this.verified.emit(res.stepUpTicket);
        this.totpCode = '';
      },
      error: () => {
        this.isVerifying.set(false);
        this.errorMessage.set('Invalid or expired authentication code. Please try again.');
      },
    });
  }
}
