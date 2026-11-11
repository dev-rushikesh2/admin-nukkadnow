import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { formatAdminOrderStatus } from '../utils/orders.utils';

@Component({
  selector: 'admin-orders-status-chip',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <span class="badge" [ngClass]="'badge-' + statusMeta().variant">
      {{ statusMeta().label }}
    </span>
  `
})
export class OrdersStatusChipComponent {
  @Input({ required: true }) status!: string;

  statusMeta() {
    return formatAdminOrderStatus(this.status);
  }
}
