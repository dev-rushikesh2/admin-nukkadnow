import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { formatPlatformAnalyticsStatus } from '../utils/analytics.utils';

@Component({
  selector: 'admin-analytics-status-chip',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <span class="badge" [ngClass]="'badge-' + statusMeta().variant">
      {{ statusMeta().label }}
    </span>
  `
})
export class AnalyticsStatusChipComponent {
  @Input({ required: true }) status!: string;

  statusMeta() {
    return formatPlatformAnalyticsStatus(this.status);
  }
}
