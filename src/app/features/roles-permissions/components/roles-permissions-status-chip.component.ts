import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { formatRolePermissionStatus } from '../utils/roles-permissions.utils';

@Component({
  selector: 'admin-roles-permissions-status-chip',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <span class="badge" [ngClass]="'badge-' + statusMeta().variant">
      {{ statusMeta().label }}
    </span>
  `
})
export class RolesPermissionsStatusChipComponent {
  @Input({ required: true }) status!: string;

  statusMeta() {
    return formatRolePermissionStatus(this.status);
  }
}
