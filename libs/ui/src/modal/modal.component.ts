import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'admin-modal',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (isOpen) {
      <div class="admin-modal-backdrop" (click)="onBackdropClick($event)">
        <div class="admin-modal-container" [style.max-width]="maxWidth">
          <div class="admin-modal-header">
            <h3 class="modal-title">{{ title }}</h3>
            <button type="button" class="modal-close-btn" (click)="close.emit()">✕</button>
          </div>
          <div class="admin-modal-body">
            <ng-content></ng-content>
          </div>
          <div class="admin-modal-footer">
            <ng-content select="[footer]"></ng-content>
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
      background: rgba(0, 0, 0, 0.75);
      backdrop-filter: blur(4px);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: var(--z-index-modal);
      padding: var(--admin-space-md);
    }
    .admin-modal-container {
      background: var(--admin-bg-surface);
      border: 1px solid var(--admin-border-strong);
      border-radius: var(--admin-radius-lg);
      width: 100%;
      box-shadow: var(--admin-shadow-xl);
      overflow: hidden;
      display: flex;
      flex-direction: column;
      animation: modal-slide-in 0.2s cubic-bezier(0.16, 1, 0.3, 1);
    }
    @keyframes modal-slide-in {
      from { transform: translateY(-10px) scale(0.98); opacity: 0; }
      to { transform: translateY(0) scale(1); opacity: 1; }
    }
    .admin-modal-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 16px 20px;
      border-bottom: 1px solid var(--admin-border-subtle);
    }
    .modal-title {
      margin: 0;
      font-size: 1.125rem;
      font-weight: 600;
      color: var(--admin-text-primary);
    }
    .modal-close-btn {
      background: transparent;
      border: none;
      color: var(--admin-text-muted);
      font-size: 1.25rem;
      cursor: pointer;
      &:hover { color: var(--admin-text-primary); }
    }
    .admin-modal-body {
      padding: 20px;
      overflow-y: auto;
      max-height: 70vh;
    }
    .admin-modal-footer {
      display: flex;
      align-items: center;
      justify-content: flex-end;
      gap: 12px;
      padding: 16px 20px;
      border-top: 1px solid var(--admin-border-subtle);
      background-color: var(--admin-bg-subtle);
    }
  `],
})
export class ModalComponent {
  @Input({ required: true }) title!: string;
  @Input() isOpen = false;
  @Input() maxWidth = '540px';
  @Input() closeOnBackdrop = true;

  @Output() close = new EventEmitter<void>();

  onBackdropClick(event: MouseEvent): void {
    if (this.closeOnBackdrop && event.target === event.currentTarget) {
      this.close.emit();
    }
  }
}
