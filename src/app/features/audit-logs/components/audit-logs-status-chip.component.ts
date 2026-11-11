import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { formatAuditLogRecordStatus } from '../utils/audit-logs.utils';

@Component({
  selector: 'admin-audit-logs-status-chip',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <span class="badge" [ngClass]="'badge-' + statusMeta().variant">
      {{ statusMeta().label }}
    </span>
  `
})
export class AuditLogsStatusChipComponent {
  @Input({ required: true }) status!: string;

  statusMeta() {
    return formatAuditLogRecordStatus(this.status);
  }
}
