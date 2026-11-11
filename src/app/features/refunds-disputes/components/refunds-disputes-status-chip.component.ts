import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { formatRefundDisputeStatus } from '../utils/refunds-disputes.utils';

@Component({
  selector: 'admin-refunds-disputes-status-chip',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <span class="badge" [ngClass]="'badge-' + statusMeta().variant">
      {{ statusMeta().label }}
    </span>
  `
})
export class RefundsDisputesStatusChipComponent {
  @Input({ required: true }) status!: string;

  statusMeta() {
    return formatRefundDisputeStatus(this.status);
  }
}
