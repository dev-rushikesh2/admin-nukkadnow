import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuditReasonDialogService } from '../../../core/audit-context/audit-reason-dialog.service';

@Component({
  selector: 'admin-audit-reason-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    @if (dialogService.isPromptOpen()) {
      <div class="admin-modal-backdrop">
        <div class="admin-modal-container">
          <div class="admin-modal-header">
            <h3 class="modal-title">Mandatory Audit Justification</h3>
            <button type="button" class="modal-close-btn" (click)="onCancel()">✕</button>
          </div>

          <div class="admin-modal-body">
            <div class="audit-warning-banner">
              ⚠️ <strong>Privileged Action:</strong> {{ dialogService.currentConfig()?.actionName }}
              <br>
              <small>All justifications are cryptographically signed and archived in the immutable platform ledger.</small>
            </div>

            <div class="admin-form-group">
              <label class="required">Reason Code</label>
              <select class="admin-select" [(ngModel)]="selectedCode">
                <option value="" disabled selected>-- Select Official Reason --</option>
                @for (item of dialogService.currentConfig()?.predefinedReasons; track item.code) {
                  <option [value]="item.code">{{ item.label }}</option>
                }
              </select>
            </div>

            <div class="admin-form-group">
              <label class="required">Operational Justification / Ticket Ref</label>
              <textarea
                class="admin-textarea"
                rows="3"
                placeholder="Provide detailed context or reference support ticket #..."
                [(ngModel)]="justificationText">
              </textarea>
            </div>
          </div>

          <div class="admin-modal-footer">
            <button type="button" class="admin-btn btn-secondary" (click)="onCancel()">Cancel</button>
            <button
              type="button"
              class="admin-btn btn-danger"
              [disabled]="!selectedCode || justificationText.length < 5"
              (click)="onSubmit()">
              Authorize & Proceed
            </button>
          </div>
        </div>
      </div>
    }
  `,
  styles: [`
    .admin-modal-backdrop {
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      background: rgba(15, 23, 42, 0.55);
      backdrop-filter: blur(4px);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: var(--z-index-modal);
      padding: 16px;
    }
    .admin-modal-container {
      background: var(--admin-bg-surface);
      border: 1px solid var(--admin-border-strong);
      border-radius: var(--admin-radius-lg);
      max-width: 500px;
      width: 100%;
      box-shadow: var(--admin-shadow-xl);
    }
    .admin-modal-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 16px 20px;
      border-bottom: 1px solid var(--admin-border-subtle);
    }
    .modal-title {
      font-size: 1.1rem;
      font-weight: 600;
      margin: 0;
    }
    .modal-close-btn {
      background: none;
      border: none;
      color: var(--admin-text-muted);
      cursor: pointer;
      font-size: 1.25rem;
    }
    .admin-modal-body {
      padding: 20px;
      display: flex;
      flex-direction: column;
      gap: 16px;
    }
    .audit-warning-banner {
      background-color: var(--admin-warning-subtle);
      border: 1px solid rgba(245, 158, 11, 0.3);
      color: var(--admin-warning);
      padding: 12px;
      border-radius: var(--admin-radius-sm);
      font-size: 0.8125rem;
      line-height: 1.4;
    }
    .admin-modal-footer {
      display: flex;
      align-items: center;
      justify-content: flex-end;
      gap: 12px;
      padding: 16px 20px;
      border-top: 1px solid var(--admin-border-subtle);
      background: var(--admin-bg-subtle);
    }
  `],
})
export class AuditReasonModalComponent {
  readonly dialogService = inject(AuditReasonDialogService);

  selectedCode = '';
  justificationText = '';

  onSubmit(): void {
    if (this.selectedCode && this.justificationText) {
      this.dialogService.submitReason(this.selectedCode, this.justificationText);
      this.selectedCode = '';
      this.justificationText = '';
    }
  }

  onCancel(): void {
    this.dialogService.cancel();
    this.selectedCode = '';
    this.justificationText = '';
  }
}
