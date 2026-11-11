import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'admin-metric-card',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="metric-card" [class.highlight]="highlight">
      <div class="metric-header">
        <span class="metric-title">{{ title }}</span>
        @if (icon) {
          <span class="metric-icon">{{ icon }}</span>
        }
      </div>
      <div class="metric-value font-mono">{{ value }}</div>
      @if (delta) {
        <div class="metric-footer" [ngClass]="deltaType">
          <span class="delta-arrow">{{ deltaType === 'positive' ? '↑' : '↓' }}</span>
          <span class="delta-text">{{ delta }}</span>
          <span class="delta-period">{{ period }}</span>
        </div>
      }
    </div>
  `,
  styles: [`
    .metric-card {
      background: var(--admin-bg-surface);
      border: 1px solid var(--admin-border-subtle);
      border-radius: var(--admin-radius-md);
      padding: var(--admin-space-md);
      display: flex;
      flex-direction: column;
      gap: 8px;
      transition: transform 0.15s ease, border-color 0.15s ease;

      &:hover {
        border-color: var(--admin-border-default);
      }

      &.highlight {
        border-left: 4px solid var(--admin-primary);
      }
    }
    .metric-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    .metric-title {
      font-size: 0.8125rem;
      font-weight: 500;
      color: var(--admin-text-secondary);
    }
    .metric-icon {
      font-size: 1.1rem;
      opacity: 0.8;
    }
    .metric-value {
      font-size: 1.5rem;
      font-weight: 700;
      color: var(--admin-text-primary);
      letter-spacing: -0.02em;
    }
    .metric-footer {
      display: flex;
      align-items: center;
      gap: 4px;
      font-size: 0.75rem;

      &.positive {
        color: var(--admin-success);
      }
      &.negative {
        color: var(--admin-danger);
      }
      &.neutral {
        color: var(--admin-text-muted);
      }
    }
    .delta-period {
      color: var(--admin-text-muted);
      margin-left: 2px;
    }
  `],
})
export class MetricCardComponent {
  @Input({ required: true }) title!: string;
  @Input({ required: true }) value!: string | number;
  @Input() icon?: string;
  @Input() delta?: string;
  @Input() deltaType: 'positive' | 'negative' | 'neutral' = 'neutral';
  @Input() period = 'vs yesterday';
  @Input() highlight = false;
}
