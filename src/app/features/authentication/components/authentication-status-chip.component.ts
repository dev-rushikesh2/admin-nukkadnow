import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { formatAuthenticationStatus } from '../utils/authentication.utils';

@Component({
  selector: 'admin-authentication-status-chip',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <span class="badge" [ngClass]="'badge-' + statusMeta().variant">
      {{ statusMeta().label }}
    </span>
  `
})
export class AuthenticationStatusChipComponent {
  @Input({ required: true }) status!: string;

  statusMeta() {
    return formatAuthenticationStatus(this.status);
  }
}
