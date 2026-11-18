import { Component, inject, OnInit, signal, computed, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { PageHeaderComponent, MetricCardComponent } from '@nukkadnow/admin-ui';
import { DataTableComponent, TableColumn } from '@nukkadnow/admin-data-table';
import { AdminApiClient, AdminEndpoints } from '@nukkadnow/admin-api-client';
import { AdminSessionService } from '../../../core/auth/session.service';

export interface RecentOrderRow {
  id: string;
  merchantName: string;
  locality: string;
  amount: string;
  status: string;
  placedAt: string;
}

export interface OverviewMetrics {
  todayGmv: string;
  todayGmvDelta: string;
  activeMerchants: number;
  activeMerchantsDelta: string;
  inFlightOrders: number;
  inFlightOrdersAdherence: string;
  kycVerificationQueue: number;
  kycQueueSla: string;
  pendingRefunds: number;
  pendingRefundsAmount: string;
  meshLatency: string;
  meshLatencyHealth: string;
}

export interface LocalityFulfillmentRow {
  name: string;
  outlets: number;
  activeBatches: number;
  pressure: number;
  status: string;
}

export interface ActionTriageRow {
  id: string;
  type: string;
  title: string;
  meta: string;
  route: string;
  severity: string;
}

export interface OverviewDashboardPayload {
  metrics: OverviewMetrics;
  localityFulfillment: LocalityFulfillmentRow[];
  actionTriage: ActionTriageRow[];
  recentOrders: RecentOrderRow[];
}

@Component({
  selector: 'admin-overview-list-page',
  standalone: true,
  imports: [CommonModule, FormsModule, PageHeaderComponent, MetricCardComponent, DataTableComponent],
  templateUrl: './overview-list.page.html',
  styleUrls: ['./overview-list.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OverviewListPageComponent implements OnInit {
  private readonly router = inject(Router);
  private readonly api = inject(AdminApiClient);
  private readonly cdr = inject(ChangeDetectorRef);
  readonly sessionService = inject(AdminSessionService);

  readonly metrics = signal<OverviewMetrics | null>(null);
  readonly localityFulfillment = signal<LocalityFulfillmentRow[]>([]);
  readonly actionTriage = signal<ActionTriageRow[]>([]);
  readonly recentOrders = signal<RecentOrderRow[]>([]);
  readonly isLoading = signal<boolean>(false);
  readonly selectedCityFilter = signal<string>('ALL');

  readonly activeCityScopeName = computed(() => {
    const geo = this.sessionService.geoAssignment();
    if (geo?.cityName) {
      return geo.cityName;
    }
    const filter = this.selectedCityFilter();
    return filter === 'ALL' ? 'Global Command' : filter;
  });

  readonly orderTableColumns: TableColumn<RecentOrderRow>[] = [
    { key: 'id', header: 'Order Ref', width: '160px', sortable: true },
    { key: 'merchantName', header: 'Merchant & Store', sortable: true },
    { key: 'locality', header: 'Locality & Zone', width: '160px' },
    { key: 'amount', header: 'Order Value', width: '130px', align: 'right', sortable: true },
    { key: 'status', header: 'Fulfillment State', width: '150px' },
    { key: 'placedAt', header: 'Placed At', width: '160px' },
  ];

  ngOnInit(): void {
    const geo = this.sessionService.geoAssignment();
    if (geo?.cityName) {
      this.selectedCityFilter.set(geo.cityName);
    }
    this.refreshMetrics();
  }

  setCityFilter(city: string): void {
    this.selectedCityFilter.set(city);
    this.refreshMetrics();
  }

  refreshMetrics(): void {
    this.isLoading.set(true);
    const params: Record<string, string> = {};
    const geo = this.sessionService.geoAssignment();
    
    if (geo?.cityName) {
      params['city'] = geo.cityName;
    } else if (this.selectedCityFilter() !== 'ALL') {
      params['city'] = this.selectedCityFilter();
    }

    this.api.get<OverviewDashboardPayload>(AdminEndpoints.OVERVIEW, params).subscribe({
      next: (res) => {
        if (res.data) {
          this.metrics.set(res.data.metrics);
          this.localityFulfillment.set(res.data.localityFulfillment || []);
          this.actionTriage.set(res.data.actionTriage || []);
          this.recentOrders.set(res.data.recentOrders || []);
        }
        this.isLoading.set(false);
        this.cdr.markForCheck();
      },
      error: () => {
        this.isLoading.set(false);
        this.cdr.markForCheck();
      },
    });
  }

  navigateTo(route: string): void {
    this.router.navigate([route]);
  }

  onOrderRowClick(order: RecentOrderRow): void {
    this.router.navigate(['/orders', order.id]);
  }
}
