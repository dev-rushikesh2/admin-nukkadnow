import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { formatPricingPlanStatus } from '../utils/plans-pricing.utils';

@Component({
  selector: 'admin-plans-pricing-status-chip',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <span class="badge" [ngClass]="'badge-' + statusMeta().variant">
      {{ statusMeta().label }}
    </span>
  `
})
export class PlansPricingStatusChipComponent {
  @Input({ required: true }) status!: string;

  statusMeta() {
    return formatPricingPlanStatus(this.status);
  }
}
