import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { formatSystemHealthNodeStatus } from '../utils/system-health.utils';

@Component({
  selector: 'admin-system-health-status-chip',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <span class="badge" [ngClass]="'badge-' + statusMeta().variant">
      {{ statusMeta().label }}
    </span>
  `
})
export class SystemHealthStatusChipComponent {
  @Input({ required: true }) status!: string;

  statusMeta() {
    return formatSystemHealthNodeStatus(this.status);
  }
}
