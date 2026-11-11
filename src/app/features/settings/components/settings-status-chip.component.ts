import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { formatPlatformSettingStatus } from '../utils/settings.utils';

@Component({
  selector: 'admin-settings-status-chip',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <span class="badge" [ngClass]="'badge-' + statusMeta().variant">
      {{ statusMeta().label }}
    </span>
  `
})
export class SettingsStatusChipComponent {
  @Input({ required: true }) status!: string;

  statusMeta() {
    return formatPlatformSettingStatus(this.status);
  }
}
