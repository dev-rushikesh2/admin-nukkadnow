import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'admin-pii-mask',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <span class="pii-container font-mono">
      @if (revealed()) {
        <span class="pii-value unmasked">{{ value }}</span>
        <button
          type="button"
          class="mask-toggle-btn"
          title="Re-mask sensitive data"
          (click)="toggleMask()">
          🔒
        </button>
      } @else {
        <span class="pii-value masked">{{ maskedValue() }}</span>
        <button
          type="button"
          class="mask-toggle-btn"
          title="Audit-tracked unmask"
          (click)="requestUnmask()">
          👁️
        </button>
      }
    </span>
  `,
  styles: [`
    .pii-container {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      background-color: var(--admin-bg-subtle);
      padding: 2px 8px;
      border-radius: var(--admin-radius-sm);
      border: 1px dashed var(--admin-border-default);
      font-size: 0.8125rem;
    }
    .pii-value.masked {
      letter-spacing: 0.1em;
      color: var(--admin-text-secondary);
    }
    .pii-value.unmasked {
      color: var(--admin-warning);
    }
    .mask-toggle-btn {
      background: transparent;
      border: none;
      cursor: pointer;
      font-size: 0.85rem;
      padding: 0;
      opacity: 0.7;
      transition: opacity 0.15s ease;

      &:hover {
        opacity: 1;
      }
    }
  `],
})
export class PiiMaskComponent {
  @Input({ required: true }) value!: string;
  @Input() type: 'phone' | 'email' | 'pan' | 'aadhaar' | 'bank_account' = 'phone';

  @Output() unmaskRequested = new EventEmitter<string>();

  revealed = signal(false);

  maskedValue(): string {
    if (!this.value) return '—';
    const val = this.value.trim();

    switch (this.type) {
      case 'phone':
        // Show last 4 digits only: +91 ******1234
        return val.length > 4 ? `+91 ******${val.slice(-4)}` : '******';

      case 'email': {
        const parts = val.split('@');
        if (parts.length < 2) return '*****@***';
        const name = parts[0];
        const domain = parts[1];
        return `${name.slice(0, 2)}***@${domain}`;
      }

      case 'pan':
        // PAN: ABCDE1234F -> AB*****4F
        return val.length === 10 ? `${val.slice(0, 2)}*****${val.slice(-2)}` : '**********';

      case 'aadhaar':
        // Aadhaar: XXXX-XXXX-1234
        return val.length > 4 ? `XXXX-XXXX-${val.slice(-4)}` : 'XXXXXXXXXXXX';

      case 'bank_account':
        // Bank A/c: *******1234
        return val.length > 4 ? `*******${val.slice(-4)}` : '********';

      default:
        return '********';
    }
  }

  requestUnmask(): void {
    this.unmaskRequested.emit(this.value);
    // Component triggers event so parent or core audit-service can verify step-up ticket before setting revealed to true
  }

  toggleMask(): void {
    this.revealed.set(!this.revealed());
  }

  setRevealed(isRevealed: boolean): void {
    this.revealed.set(isRevealed);
  }
}
