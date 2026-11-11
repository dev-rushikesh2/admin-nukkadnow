import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { PageHeaderComponent, MetricCardComponent } from '@nukkadnow/admin-ui';
import { DataTableComponent, TableColumn } from '@nukkadnow/admin-data-table';

interface RecentOrderRow {
  id: string;
  merchantName: string;
  locality: string;
  amount: string;
  status: string;
  placedAt: string;
}

@Component({
  selector: 'admin-overview-list-page',
  standalone: true,
  imports: [CommonModule, PageHeaderComponent, MetricCardComponent, DataTableComponent],
  templateUrl: './overview-list.page.html',
  styleUrls: ['./overview-list.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OverviewListPageComponent {
  private readonly router = inject(Router);

  readonly orderTableColumns: TableColumn<RecentOrderRow>[] = [
    { key: 'id', header: 'Order Ref', width: '160px', sortable: true },
    { key: 'merchantName', header: 'Merchant & Outlet', sortable: true },
    { key: 'locality', header: 'Nagpur Locality', width: '150px' },
    { key: 'amount', header: 'Total Value', width: '130px', align: 'right', sortable: true },
    { key: 'status', header: 'Status', width: '140px' },
    { key: 'placedAt', header: 'Placed At', width: '140px' },
  ];

  readonly recentOrders: RecentOrderRow[] = [
    { id: 'ORD-9821', merchantName: 'Nagpur Sweet Mart', locality: 'Dharampeth', amount: '₹ 450.00', status: 'READY_FOR_PICKUP', placedAt: '4 mins ago' },
    { id: 'ORD-9820', merchantName: 'Apna Kirana & Grains', locality: 'Sadar', amount: '₹ 1,280.00', status: 'IN_PREPARATION', placedAt: '12 mins ago' },
    { id: 'ORD-9819', merchantName: 'Haldiram Foods', locality: 'Sadar', amount: '₹ 850.00', status: 'REFUND_REQUESTED', placedAt: '25 mins ago' },
    { id: 'ORD-9818', merchantName: 'Shree Ganesh Dairy', locality: 'Ramdaspeth', amount: '₹ 220.00', status: 'CONFIRMED', placedAt: '31 mins ago' },
    { id: 'ORD-9817', merchantName: 'Vidarbha Organic Store', locality: 'Wardha Road', amount: '₹ 1,940.00', status: 'COMPLETED', placedAt: '48 mins ago' },
  ];

  refreshMetrics(): void {
    // In production, triggers telemetry and aggregated projection poll
  }

  navigateTo(route: string): void {
    this.router.navigate([route]);
  }

  onOrderRowClick(order: RecentOrderRow): void {
    this.router.navigate(['/orders', order.id]);
  }
}
