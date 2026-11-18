import { Component, inject, OnInit, signal, computed, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { SubscriptionsStore } from '../state/subscriptions.store';
import { PageHeaderComponent } from '@nukkadnow/admin-ui';
import { DataTableComponent, TableColumn } from '@nukkadnow/admin-data-table';
import { MerchantSubscriptionViewModel } from '../models/subscriptions-view.model';
import { SubscriptionsStatusChipComponent } from '../components/subscriptions-status-chip.component';
import { AdminSessionService } from '../../../core/auth/session.service';

@Component({
  selector: 'admin-subscriptions-list-page',
  standalone: true,
  imports: [CommonModule, FormsModule, PageHeaderComponent, DataTableComponent, SubscriptionsStatusChipComponent],
  templateUrl: './subscriptions-list.page.html',
  styleUrls: ['./subscriptions-list.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SubscriptionsListPageComponent implements OnInit {
  readonly store = inject(SubscriptionsStore);
  private readonly router = inject(Router);
  readonly sessionService = inject(AdminSessionService);

  readonly selectedCity = signal<string>('ALL');
  readonly selectedStatus = signal<string>('ALL');
  readonly selectedPlan = signal<string>('ALL');
  readonly searchQuery = signal<string>('');

  readonly filteredSubscriptions = computed(() => {
    let list = this.store.items();
    const city = this.selectedCity();
    const status = this.selectedStatus();
    const plan = this.selectedPlan();
    const query = this.searchQuery().toLowerCase().trim();

    const geo = this.sessionService.geoAssignment();
    if (geo?.cityName) {
      list = list.filter(s => s.city.toLowerCase() === geo.cityName.toLowerCase());
    } else if (city !== 'ALL') {
      list = list.filter(s => s.city.toLowerCase() === city.toLowerCase());
    }

    if (status !== 'ALL') {
      list = list.filter(s => s.status === status);
    }

    if (plan !== 'ALL') {
      list = list.filter(s => s.planName.toLowerCase().includes(plan.toLowerCase()));
    }

    if (query) {
      list = list.filter(s =>
        s.id.toLowerCase().includes(query) ||
        s.merchantName.toLowerCase().includes(query) ||
        s.planName.toLowerCase().includes(query) ||
        s.locality.toLowerCase().includes(query)
      );
    }

    return list;
  });

  // Summary Metrics
  readonly mrrFormatted = computed(() => {
    const list = this.filteredSubscriptions().filter(s => s.status === 'ACTIVE');
    const totalPaise = list.reduce((acc, curr) => acc + (curr.mrrPaise || 0), 0);
    return `₹${(totalPaise / 100).toLocaleString('en-IN', { minimumFractionDigits: 2 })}`;
  });

  readonly activeStoresCount = computed(() =>
    this.filteredSubscriptions().filter(s => s.status === 'ACTIVE').length
  );

  readonly pastDueCount = computed(() =>
    this.filteredSubscriptions().filter(s => s.status === 'PAST_DUE').length
  );

  readonly tableColumns: TableColumn<MerchantSubscriptionViewModel>[] = [
    { key: 'id', header: 'Subscription Ref', width: '160px', sortable: true },
    { key: 'merchantName', header: 'Subscribed Merchant', sortable: true },
    { key: 'planName', header: 'Plan Tier', width: '160px', sortable: true },
    { key: 'locality', header: 'Territory', width: '160px', sortable: true },
    { key: 'mrrFormatted', header: 'MRR / Fee', width: '140px', align: 'right', sortable: true },
    { key: 'billingCycle', header: 'Cycle', width: '120px', align: 'center' },
    { key: 'status', header: 'Subscription State', width: '170px', sortable: true }
  ];

  ngOnInit(): void {
    const geo = this.sessionService.geoAssignment();
    if (geo?.cityName) {
      this.selectedCity.set(geo.cityName);
    }
    this.store.loadItems();
  }

  onCityChange(city: string): void {
    this.selectedCity.set(city);
  }

  onStatusChange(status: string): void {
    this.selectedStatus.set(status);
  }

  onPlanChange(plan: string): void {
    this.selectedPlan.set(plan);
  }

  onSearchChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.searchQuery.set(input.value);
  }

  refresh(): void {
    this.store.loadItems();
  }

  exportCsv(): void {
    const list = this.filteredSubscriptions();
    if (list.length === 0) return;

    const headers = ['Subscription ID', 'Merchant Name', 'City', 'Locality', 'Plan ID', 'Plan Name', 'MRR (Paise)', 'MRR', 'Cycle', 'Next Invoice', 'Grace Days', 'Status'];
    const rows = list.map(s => [
      `"${s.id}"`,
      `"${s.merchantName}"`,
      `"${s.city}"`,
      `"${s.locality}"`,
      `"${s.planId}"`,
      `"${s.planName}"`,
      s.mrrPaise,
      `"${s.mrrFormatted}"`,
      `"${s.billingCycle}"`,
      `"${s.nextBillingDate}"`,
      s.gracePeriodDays,
      `"${s.status}"`
    ]);

    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `nukkadnow-subscriptions-${this.selectedCity().toLowerCase()}-${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(link.href);
  }

  onRowClick(row: MerchantSubscriptionViewModel): void {
    this.router.navigate(['/subscriptions', row.id]);
  }
}
