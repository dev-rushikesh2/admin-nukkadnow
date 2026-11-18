import { Component, inject, OnInit, signal, computed, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { OutletsStore } from '../state/outlets.store';
import { PageHeaderComponent } from '@nukkadnow/admin-ui';
import { DataTableComponent, TableColumn } from '@nukkadnow/admin-data-table';
import { OutletViewModel } from '../models/outlets-view.model';
import { OutletsStatusChipComponent } from '../components/outlets-status-chip.component';
import { AdminSessionService } from '../../../core/auth/session.service';

@Component({
  selector: 'admin-outlets-list-page',
  standalone: true,
  imports: [CommonModule, FormsModule, PageHeaderComponent, DataTableComponent, OutletsStatusChipComponent],
  templateUrl: './outlets-list.page.html',
  styleUrls: ['./outlets-list.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OutletsListPageComponent implements OnInit {
  readonly store = inject(OutletsStore);
  private readonly router = inject(Router);
  readonly sessionService = inject(AdminSessionService);

  readonly selectedCity = signal<string>('ALL');
  readonly selectedStatus = signal<string>('ALL');
  readonly searchQuery = signal<string>('');
  readonly isThrottleModalOpen = signal<boolean>(false);
  readonly activeOutletForThrottle = signal<OutletViewModel | null>(null);
  readonly throttleReason = signal<string>('');
  readonly isSubmitting = signal<boolean>(false);

  readonly filteredOutlets = computed(() => {
    let list = this.store.items();
    const city = this.selectedCity();
    const status = this.selectedStatus();
    const query = this.searchQuery().toLowerCase().trim();

    const geo = this.sessionService.geoAssignment();
    if (geo?.cityName) {
      list = list.filter(o => o.city.toLowerCase() === geo.cityName.toLowerCase());
    } else if (city !== 'ALL') {
      list = list.filter(o => o.city.toLowerCase() === city.toLowerCase());
    }

    if (status !== 'ALL') {
      list = list.filter(o => o.status === status);
    }

    if (query) {
      list = list.filter(o =>
        o.storeName.toLowerCase().includes(query) ||
        o.merchantName.toLowerCase().includes(query) ||
        o.locality.toLowerCase().includes(query) ||
        o.id.toLowerCase().includes(query)
      );
    }

    return list;
  });

  // Dynamic Summary Metrics
  readonly totalOutletsCount = computed(() => this.filteredOutlets().length);
  readonly openOutletsCount = computed(() =>
    this.filteredOutlets().filter(o => o.status === 'OPEN').length
  );
  readonly busyOutletsCount = computed(() =>
    this.filteredOutlets().filter(o => o.status === 'BUSY' || o.isThrottled).length
  );
  readonly avgCapacityUtilization = computed(() => {
    const list = this.filteredOutlets();
    if (list.length === 0) return 0;
    const sum = list.reduce((acc, curr) => acc + (curr.capacityUtilizationPct || 0), 0);
    return Math.round(sum / list.length);
  });

  readonly tableColumns: TableColumn<OutletViewModel>[] = [
    { key: 'storeName', header: 'Storefront & Hub', sortable: true },
    { key: 'merchantName', header: 'Parent Merchant', width: '220px', sortable: true },
    { key: 'locality', header: 'Locality & City', width: '180px', sortable: true },
    { key: 'currentHourlyOrders', header: 'Hourly Load / Cap', width: '170px', align: 'center', sortable: true },
    { key: 'capacityUtilizationPct', header: 'Load %', width: '100px', align: 'center', sortable: true },
    { key: 'status', header: 'Fulfillment State', width: '160px', sortable: true }
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

  onSearchChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.searchQuery.set(input.value);
  }

  refresh(): void {
    this.store.loadItems();
  }

  openThrottleModal(outlet: OutletViewModel, event?: Event): void {
    if (event) event.stopPropagation();
    this.activeOutletForThrottle.set(outlet);
    this.throttleReason.set('High fulfillment queue, temporary throttling');
    this.isThrottleModalOpen.set(true);
  }

  closeThrottleModal(): void {
    this.isThrottleModalOpen.set(false);
    this.activeOutletForThrottle.set(null);
  }

  confirmThrottle(): void {
    const outlet = this.activeOutletForThrottle();
    if (!outlet) return;

    this.isSubmitting.set(true);
    const newStatus = outlet.status === 'BUSY' ? 'OPEN' : 'BUSY';
    const isThrottled = !outlet.isThrottled;

    this.store.overrideCapacity(
      outlet.id,
      outlet.hourlyCapacity,
      isThrottled,
      this.throttleReason()
    ).subscribe({
      next: () => {
        this.isSubmitting.set(false);
        this.closeThrottleModal();
      },
      error: () => {
        this.isSubmitting.set(false);
      }
    });
  }

  exportCsv(): void {
    const list = this.filteredOutlets();
    if (list.length === 0) return;

    const headers = ['Outlet ID', 'Storefront Name', 'Merchant Name', 'Locality', 'City', 'Hourly Cap', 'Current Load', 'Utilization %', 'Status', 'Throttled'];
    const rows = list.map(o => [
      `"${o.id}"`,
      `"${o.storeName}"`,
      `"${o.merchantName}"`,
      `"${o.locality}"`,
      `"${o.city}"`,
      o.hourlyCapacity,
      o.currentHourlyOrders,
      o.capacityUtilizationPct,
      `"${o.status}"`,
      o.isThrottled ? 'YES' : 'NO'
    ]);

    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `nukkadnow-outlets-${this.selectedCity().toLowerCase()}-${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(link.href);
  }

  onRowClick(row: OutletViewModel): void {
    this.router.navigate(['/outlets', row.id]);
  }
}
