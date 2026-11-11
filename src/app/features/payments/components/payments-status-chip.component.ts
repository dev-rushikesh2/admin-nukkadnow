import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { formatPaymentTransactionStatus } from '../utils/payments.utils';

@Component({
  selector: 'admin-payments-status-chip',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <span class="badge" [ngClass]="'badge-' + statusMeta().variant">
      {{ statusMeta().label }}
    </span>
  `
})
export class PaymentsStatusChipComponent {
  @Input({ required: true }) status!: string;

  statusMeta() {
    return formatPaymentTransactionStatus(this.status);
  }
}
