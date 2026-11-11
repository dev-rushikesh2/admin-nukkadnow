import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { formatPlatformUserStatus } from '../utils/platform-users.utils';

@Component({
  selector: 'admin-platform-users-status-chip',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <span class="badge" [ngClass]="'badge-' + statusMeta().variant">
      {{ statusMeta().label }}
    </span>
  `
})
export class PlatformUsersStatusChipComponent {
  @Input({ required: true }) status!: string;

  statusMeta() {
    return formatPlatformUserStatus(this.status);
  }
}
