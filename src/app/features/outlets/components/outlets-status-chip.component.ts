import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { formatOutletStatus } from '../utils/outlets.utils';

@Component({
  selector: 'admin-outlets-status-chip',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <span class="badge" [ngClass]="'badge-' + statusMeta().variant">
      {{ statusMeta().label }}
    </span>
  `
})
export class OutletsStatusChipComponent {
  @Input({ required: true }) status!: string;

  statusMeta() {
    return formatOutletStatus(this.status);
  }
}
