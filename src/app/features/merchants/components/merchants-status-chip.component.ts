import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { formatMerchantStatus } from '../utils/merchants.utils';

@Component({
  selector: 'admin-merchants-status-chip',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <span class="badge" [ngClass]="'badge-' + statusMeta().variant">
      {{ statusMeta().label }}
    </span>
  `
})
export class MerchantsStatusChipComponent {
  @Input({ required: true }) status!: string;

  statusMeta() {
    return formatMerchantStatus(this.status);
  }
}
