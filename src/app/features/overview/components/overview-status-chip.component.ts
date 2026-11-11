import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { formatOverviewMetricStatus } from '../utils/overview.utils';

@Component({
  selector: 'admin-overview-status-chip',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <span class="badge" [ngClass]="'badge-' + statusMeta().variant">
      {{ statusMeta().label }}
    </span>
  `
})
export class OverviewStatusChipComponent {
  @Input({ required: true }) status!: string;

  statusMeta() {
    return formatOverviewMetricStatus(this.status);
  }
}
