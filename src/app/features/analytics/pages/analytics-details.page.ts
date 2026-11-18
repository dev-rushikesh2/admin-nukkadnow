import { Component, inject, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { AnalyticsStore } from '../state/analytics.store';
import { PageHeaderComponent } from '@nukkadnow/admin-ui';
import { AnalyticsStatusChipComponent } from '../components/analytics-status-chip.component';
import { InrCurrencyPipe } from '../../../shared/pipes/inr-currency.pipe';

@Component({
  selector: 'admin-analytics-details-page',
  standalone: true,
  imports: [CommonModule, PageHeaderComponent, AnalyticsStatusChipComponent, InrCurrencyPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="details-page-container">
      <admin-page-header
        [title]="'Analytics Ledger: ' + (store.selectedItem()?.name || id)"
        subtitle="Audited financial snapshots and settlement breakdown"
        breadcrumb="Console / Governance / Business Analytics / Inspection">
        <div actions>
          <button class="admin-btn btn-secondary btn-sm" (click)="goBack()">← Back</button>
        </div>
      </admin-page-header>

      @if (store.selectedItem(); as item) {
        <div class="details-grid">
          <div class="details-card">
            <h3>Financial Summary</h3>
            <p><strong>Reporting Scope:</strong> 📍 {{ item.city }} ({{ item.range }})</p>
            <p><strong>Gross GMV:</strong> <span class="font-bold text-accent">{{ item.todayGmvPaise | inrCurrency }}</span></p>
            <p><strong>Commission Earned:</strong> {{ item.commissionEarnedPaise | inrCurrency }}</p>
            <p><strong>Merchant Payouts:</strong> {{ item.merchantPayoutsPaise | inrCurrency }}</p>
            <p><strong>Total Orders:</strong> {{ item.totalOrders }}</p>
            <p><strong>Average Order Value:</strong> {{ item.averageOrderValuePaise | inrCurrency }}</p>
            <p><strong>Recorded At:</strong> {{ item.createdAt | date:'medium' }}</p>
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
      display: flex;
      flex-direction: column;
      gap: 10px;

      h3 { margin: 0 0 8px 0; color: var(--admin-text-primary); }
      p { margin: 0; color: var(--admin-text-secondary); font-size: 0.875rem; }
      .font-bold { font-weight: 700; }
    }
  `]
})
export class AnalyticsDetailsPageComponent implements OnInit {
  readonly store = inject(AnalyticsStore);
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
    this.router.navigate(['/analytics']);
  }
}
