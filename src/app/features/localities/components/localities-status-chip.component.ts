import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { formatLocalityStatus } from '../utils/localities.utils';

@Component({
  selector: 'admin-localities-status-chip',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <span class="badge" [ngClass]="'badge-' + statusMeta().variant">
      {{ statusMeta().label }}
    </span>
  `
})
export class LocalitiesStatusChipComponent {
  @Input({ required: true }) status!: string;

  statusMeta() {
    return formatLocalityStatus(this.status);
  }
}
