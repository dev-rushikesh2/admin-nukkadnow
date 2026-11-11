import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { formatReviewModerationStatus } from '../utils/reviews-moderation.utils';

@Component({
  selector: 'admin-reviews-moderation-status-chip',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <span class="badge" [ngClass]="'badge-' + statusMeta().variant">
      {{ statusMeta().label }}
    </span>
  `
})
export class ReviewsModerationStatusChipComponent {
  @Input({ required: true }) status!: string;

  statusMeta() {
    return formatReviewModerationStatus(this.status);
  }
}
