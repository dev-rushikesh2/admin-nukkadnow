import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OverviewMetricViewModel } from '../models/overview-view.model';
import { OverviewStatusChipComponent } from './overview-status-chip.component';

@Component({
  selector: 'admin-overview-card',
  standalone: true,
  imports: [CommonModule, OverviewStatusChipComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="feature-card" (click)="cardClick.emit(item)">
      <div class="card-header">
        <h4 class="card-title">{{ item.name || item.id }}</h4>
        <admin-overview-status-chip [status]="item.status"></admin-overview-status-chip>
      </div>
      <div class="card-body">
        <span class="card-id font-mono">ID: {{ item.id }}</span>
        <span class="card-date">{{ item.createdAt | date:'medium' }}</span>
      </div>
    </div>
  `,
  styles: [`
    .feature-card {
      background: var(--admin-bg-surface);
      border: 1px solid var(--admin-border-subtle);
      border-radius: var(--admin-radius-md);
      padding: 16px;
      cursor: pointer;
      transition: all 0.15s ease;
      &:hover { border-color: var(--admin-border-default); transform: translateY(-1px); }
    }
    .card-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px; }
    .card-title { margin: 0; font-size: 0.95rem; font-weight: 600; color: var(--admin-text-primary); }
    .card-body { display: flex; justify-content: space-between; font-size: 0.75rem; color: var(--admin-text-muted); }
  `]
})
export class OverviewCardComponent {
  @Input({ required: true }) item!: OverviewMetricViewModel;
  @Output() cardClick = new EventEmitter<OverviewMetricViewModel>();
}
