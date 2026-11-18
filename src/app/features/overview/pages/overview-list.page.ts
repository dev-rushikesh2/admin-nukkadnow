import { Component, inject, OnInit, signal, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { PageHeaderComponent, MetricCardComponent } from '@nukkadnow/admin-ui';
import { DataTableComponent, TableColumn } from '@nukkadnow/admin-data-table';
import { AdminApiClient, AdminEndpoints } from '@nukkadnow/admin-api-client';

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
  imports: [CommonModule, PageHeaderComponent, MetricCardComponent, DataTableComponent],
  templateUrl: './overview-list.page.html',
  styleUrls: ['./overview-list.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OverviewListPageComponent implements OnInit {
  private readonly router = inject(Router);
  private readonly api = inject(AdminApiClient);
  private readonly cdr = inject(ChangeDetectorRef);

  readonly metrics = signal<OverviewMetrics | null>(null);
  readonly localityFulfillment = signal<LocalityFulfillmentRow[]>([]);
  readonly actionTriage = signal<ActionTriageRow[]>([]);
  readonly recentOrders = signal<RecentOrderRow[]>([]);
  readonly isLoading = signal<boolean>(false);

  readonly orderTableColumns: TableColumn<RecentOrderRow>[] = [
    { key: 'id', header: 'Order Ref', width: '160px', sortable: true },
    { key: 'merchantName', header: 'Merchant & Outlet', sortable: true },
    { key: 'locality', header: 'Nagpur Locality', width: '150px' },
    { key: 'amount', header: 'Total Value', width: '130px', align: 'right', sortable: true },
    { key: 'status', header: 'Status', width: '140px' },
    { key: 'placedAt', header: 'Placed At', width: '160px' },
  ];

  ngOnInit(): void {
    this.refreshMetrics();
  }

  refreshMetrics(): void {
    this.isLoading.set(true);
    this.api.get<OverviewDashboardPayload>(AdminEndpoints.OVERVIEW).subscribe({
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
