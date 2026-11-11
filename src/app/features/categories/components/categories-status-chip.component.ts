import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { formatCategoryStatus } from '../utils/categories.utils';

@Component({
  selector: 'admin-categories-status-chip',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <span class="badge" [ngClass]="'badge-' + statusMeta().variant">
      {{ statusMeta().label }}
    </span>
  `
})
export class CategoriesStatusChipComponent {
  @Input({ required: true }) status!: string;

  statusMeta() {
    return formatCategoryStatus(this.status);
  }
}
