import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { formatBroadcastNotificationStatus } from '../utils/notifications.utils';

@Component({
  selector: 'admin-notifications-status-chip',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <span class="badge" [ngClass]="'badge-' + statusMeta().variant">
      {{ statusMeta().label }}
    </span>
  `
})
export class NotificationsStatusChipComponent {
  @Input({ required: true }) status!: string;

  statusMeta() {
    return formatBroadcastNotificationStatus(this.status);
  }
}
