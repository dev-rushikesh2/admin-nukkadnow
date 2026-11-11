import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { formatSupportTicketStatus } from '../utils/support-tickets.utils';

@Component({
  selector: 'admin-support-tickets-status-chip',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <span class="badge" [ngClass]="'badge-' + statusMeta().variant">
      {{ statusMeta().label }}
    </span>
  `
})
export class SupportTicketsStatusChipComponent {
  @Input({ required: true }) status!: string;

  statusMeta() {
    return formatSupportTicketStatus(this.status);
  }
}
