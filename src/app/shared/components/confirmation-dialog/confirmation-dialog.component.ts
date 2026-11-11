import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'admin-confirmation-dialog',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    @if (isOpen) {
      <div class="admin-modal-backdrop">
        <div class="admin-modal-container">
          <div class="admin-modal-header">
            <h3 class="modal-title">{{ title }}</h3>
            <button type="button" class="modal-close-btn" (click)="close.emit()">✕</button>
          </div>
          <div class="admin-modal-body">
            <p class="dialog-message">{{ message }}</p>
            @if (requireMatchWord) {
              <div class="match-word-section">
                <label>Type <strong>{{ requireMatchWord }}</strong> to confirm:</label>
                <input
                  type="text"
                  class="admin-input font-mono"
                  [(ngModel)]="enteredWord"
                  [placeholder]="requireMatchWord">
              </div>
            }
          </div>
          <div class="admin-modal-footer">
            <button type="button" class="admin-btn btn-secondary" (click)="close.emit()">Cancel</button>
            <button
              type="button"
              class="admin-btn btn-danger"
              [disabled]="requireMatchWord && enteredWord !== requireMatchWord"
              (click)="onConfirm()">
              {{ confirmButtonText }}
            </button>
          </div>
        </div>
      </div>
    }
  `,
  styles: [`
    .admin-modal-backdrop {
      position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
      background: rgba(0, 0, 0, 0.8); display: flex; align-items: center; justify-content: center;
      z-index: var(--z-index-modal); padding: 16px;
    }
    .admin-modal-container {
      background: var(--admin-bg-surface); border: 1px solid var(--admin-border-strong);
      border-radius: var(--admin-radius-lg); max-width: 460px; width: 100%; box-shadow: var(--admin-shadow-xl);
    }
    .admin-modal-header {
      display: flex; align-items: center; justify-content: space-between; padding: 16px 20px;
      border-bottom: 1px solid var(--admin-border-subtle);
    }
    .modal-title { font-size: 1.05rem; font-weight: 600; margin: 0; }
    .modal-close-btn { background: none; border: none; color: var(--admin-text-muted); cursor: pointer; font-size: 1.25rem; }
    .admin-modal-body { padding: 20px; display: flex; flex-direction: column; gap: 12px; }
    .dialog-message { font-size: 0.875rem; color: var(--admin-text-secondary); margin: 0; line-height: 1.5; }
    .match-word-section { display: flex; flex-direction: column; gap: 6px; margin-top: 8px; font-size: 0.8125rem; }
    .admin-modal-footer {
      display: flex; align-items: center; justify-content: flex-end; gap: 12px; padding: 16px 20px;
      border-top: 1px solid var(--admin-border-subtle); background: var(--admin-bg-subtle);
    }
  `],
})
export class ConfirmationDialogComponent {
  @Input({ required: true }) title!: string;
  @Input({ required: true }) message!: string;
  @Input() isOpen = false;
  @Input() confirmButtonText = 'Confirm Action';
  @Input() requireMatchWord?: string;

  @Output() close = new EventEmitter<void>();
  @Output() confirmed = new EventEmitter<void>();

  enteredWord = '';

  onConfirm(): void {
    if (!this.requireMatchWord || this.enteredWord === this.requireMatchWord) {
      this.confirmed.emit();
      this.enteredWord = '';
    }
  }
}
