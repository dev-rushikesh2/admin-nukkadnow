import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'admin-page-header',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="admin-page-header">
      <div class="header-titles">
        @if (breadcrumb) {
          <div class="breadcrumb-trail">{{ breadcrumb }}</div>
        }
        <h1 class="page-title">{{ title }}</h1>
        @if (subtitle) {
          <p class="page-subtitle">{{ subtitle }}</p>
        }
      </div>
      <div class="header-actions">
        <ng-content select="[actions]"></ng-content>
      </div>
    </div>
  `,
  styles: [`
    .admin-page-header {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      margin-bottom: var(--admin-space-lg);
      gap: var(--admin-space-md);
      flex-wrap: wrap;
    }
    .header-titles {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }
    .breadcrumb-trail {
      font-size: 0.75rem;
      color: var(--admin-text-muted);
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }
    .page-title {
      font-size: 1.5rem;
      font-weight: 700;
      color: var(--admin-text-primary);
      margin: 0;
      letter-spacing: -0.02em;
    }
    .page-subtitle {
      font-size: 0.875rem;
      color: var(--admin-text-secondary);
      margin: 0;
    }
    .header-actions {
      display: flex;
      align-items: center;
      gap: 8px;
    }
  `],
})
export class PageHeaderComponent {
  @Input({ required: true }) title!: string;
  @Input() subtitle?: string;
  @Input() breadcrumb?: string;
}
