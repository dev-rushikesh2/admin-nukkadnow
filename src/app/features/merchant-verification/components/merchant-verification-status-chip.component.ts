import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { formatMerchantVerificationStatus } from '../utils/merchant-verification.utils';

@Component({
  selector: 'admin-merchant-verification-status-chip',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <span class="badge" [ngClass]="'badge-' + statusMeta().variant">
      {{ statusMeta().label }}
    </span>
  `
})
export class MerchantVerificationStatusChipComponent {
  @Input({ required: true }) status!: string;

  statusMeta() {
    return formatMerchantVerificationStatus(this.status);
  }
}
