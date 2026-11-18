import { Component, inject, OnInit, ChangeDetectionStrategy, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AnalyticsStore } from '../state/analytics.store';
import { PageHeaderComponent, BadgeComponent } from '@nukkadnow/admin-ui';
import { InrCurrencyPipe } from '../../../shared/pipes/inr-currency.pipe';
import { AdminSessionService } from '../../../core/auth/session.service';

@Component({
  selector: 'admin-analytics-list-page',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    PageHeaderComponent,
    BadgeComponent,
    InrCurrencyPipe,
  ],
  templateUrl: './analytics-list.page.html',
  styleUrls: ['./analytics-list.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AnalyticsListPageComponent implements OnInit {
  readonly store = inject(AnalyticsStore);
  readonly sessionService = inject(AdminSessionService);

  selectedCity = 'ALL';
  selectedRange = 'MTD';

  readonly activeCityName = computed(() => {
    const geo = this.sessionService.geoAssignment();
    if (geo?.cityName) return geo.cityName;
    return this.selectedCity === 'ALL' ? 'Multi-City Network' : this.selectedCity;
  });

  ngOnInit(): void {
    this.fetchData();
  }

  fetchData(): void {
    const geo = this.sessionService.geoAssignment();
    const city = geo?.cityName || (this.selectedCity !== 'ALL' ? this.selectedCity : undefined);
    this.store.loadMetrics({
      city,
      range: this.selectedRange,
    });
  }

  onCityFilterChange(city: string): void {
    this.selectedCity = city;
    this.fetchData();
  }

  onRangeChange(range: string): void {
    this.selectedRange = range;
    this.fetchData();
  }

  exportFinancialReport(): void {
    const metrics = this.store.metrics();
    if (!metrics) return;

    const headers = ['Metric', 'Value', 'Territory', 'ReportingPeriod'];
    const rows = [
      ['Gross Merchandise Value (Paise)', metrics.todayGmvPaise, metrics.city, metrics.range],
      ['Platform Commission Earned (Paise)', metrics.commissionEarnedPaise, metrics.city, metrics.range],
      ['Merchant Payouts Released (Paise)', metrics.merchantPayoutsPaise, metrics.city, metrics.range],
      ['Total Completed Orders', metrics.totalOrders, metrics.city, metrics.range],
      ['Average Order Value (Paise)', metrics.averageOrderValuePaise, metrics.city, metrics.range],
      ['Active Commercial Merchants', metrics.activeMerchants, metrics.city, metrics.range],
    ];

    if (metrics.localityBreakdown) {
      metrics.localityBreakdown.forEach(loc => {
        rows.push([`Locality GMV: ${loc.locality}`, loc.gmvPaise, loc.locality, `${loc.sharePercent}% Share`]);
      });
    }

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `nukkadnow-financial-report-${metrics.city.toLowerCase()}-${metrics.range.toLowerCase()}-${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}
