import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MerchantVerificationViewModel } from '../models/merchant-verification-view.model';
import { MerchantVerificationStatusChipComponent } from './merchant-verification-status-chip.component';

@Component({
  selector: 'admin-merchant-verification-card',
  standalone: true,
  imports: [CommonModule, MerchantVerificationStatusChipComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="feature-card" (click)="cardClick.emit(item)">
      <div class="card-header">
        <h4 class="card-title">{{ item.name || item.id }}</h4>
        <admin-merchant-verification-status-chip [status]="item.status"></admin-merchant-verification-status-chip>
      </div>
      <div class="card-body">
        <span class="card-id font-mono">ID: {{ item.id }}</span>
        <span class="card-date">{{ item.createdAt | date:'medium' }}</span>
      </div>
    </div>
  `,
  styles: [`
    .feature-card {
      background: var(--admin-bg-surface);
      border: 1px solid var(--admin-border-subtle);
      border-radius: var(--admin-radius-md);
      padding: 16px;
      cursor: pointer;
      transition: all 0.15s ease;
      &:hover { border-color: var(--admin-border-default); transform: translateY(-1px); }
    }
    .card-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px; }
    .card-title { margin: 0; font-size: 0.95rem; font-weight: 600; color: var(--admin-text-primary); }
    .card-body { display: flex; justify-content: space-between; font-size: 0.75rem; color: var(--admin-text-muted); }
  `]
})
export class MerchantVerificationCardComponent {
  @Input({ required: true }) item!: MerchantVerificationViewModel;
  @Output() cardClick = new EventEmitter<MerchantVerificationViewModel>();
}
