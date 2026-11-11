import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { formatMerchantSubscriptionStatus } from '../utils/subscriptions.utils';

@Component({
  selector: 'admin-subscriptions-status-chip',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <span class="badge" [ngClass]="'badge-' + statusMeta().variant">
      {{ statusMeta().label }}
    </span>
  `
})
export class SubscriptionsStatusChipComponent {
  @Input({ required: true }) status!: string;

  statusMeta() {
    return formatMerchantSubscriptionStatus(this.status);
  }
}
