import { Component, inject, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { OverviewStore } from '../state/overview.store';
import { PageHeaderComponent } from '@nukkadnow/admin-ui';
import { OverviewStatusChipComponent } from '../components/overview-status-chip.component';

@Component({
  selector: 'admin-overview-details-page',
  standalone: true,
  imports: [CommonModule, PageHeaderComponent, OverviewStatusChipComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="details-page-container">
      <admin-page-header
        [title]="'Details: ' + (store.selectedItem()?.name || id)"
        subtitle="Immutable inspection & operational management"
        breadcrumb="Console / Command Center Overview / Inspection">
        <div actions>
          <button class="admin-btn btn-secondary btn-sm" (click)="goBack()">← Back</button>
        </div>
      </admin-page-header>

      @if (store.selectedItem(); as item) {
        <div class="details-grid">
          <div class="details-card">
            <h3>Record Metadata</h3>
            <p><strong>ID:</strong> <span class="font-mono">{{ item.id }}</span></p>
            <p><strong>Status:</strong> <admin-overview-status-chip [status]="item.status"></admin-overview-status-chip></p>
            <p><strong>Timestamp:</strong> {{ item.createdAt | date:'medium' }}</p>
          </div>
        </div>
      }
    </div>
  `,
  styles: [`
    .details-page-container { display: flex; flex-direction: column; gap: 16px; }
    .details-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 16px; }
    .details-card {
      background: var(--admin-bg-surface);
      border: 1px solid var(--admin-border-subtle);
      border-radius: var(--admin-radius-md);
      padding: 20px;
    }
  `]
})
export class OverviewDetailsPageComponent implements OnInit {
  readonly store = inject(OverviewStore);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  id = '';

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id') || '';
    if (this.id) {
      this.store.loadById(this.id);
    }
  }

  goBack(): void {
    this.router.navigate(['/overview']);
  }
}
