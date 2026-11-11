import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { formatFeatureFlagStatus } from '../utils/feature-flags.utils';

@Component({
  selector: 'admin-feature-flags-status-chip',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <span class="badge" [ngClass]="'badge-' + statusMeta().variant">
      {{ statusMeta().label }}
    </span>
  `
})
export class FeatureFlagsStatusChipComponent {
  @Input({ required: true }) status!: string;

  statusMeta() {
    return formatFeatureFlagStatus(this.status);
  }
}
