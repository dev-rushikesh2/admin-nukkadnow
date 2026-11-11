import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { formatCatalogItemStatus } from '../utils/catalogue-moderation.utils';

@Component({
  selector: 'admin-catalogue-moderation-status-chip',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <span class="badge" [ngClass]="'badge-' + statusMeta().variant">
      {{ statusMeta().label }}
    </span>
  `
})
export class CatalogueModerationStatusChipComponent {
  @Input({ required: true }) status!: string;

  statusMeta() {
    return formatCatalogItemStatus(this.status);
  }
}
