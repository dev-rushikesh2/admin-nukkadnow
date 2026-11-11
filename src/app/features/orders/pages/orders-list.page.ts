import { Component, inject, OnInit, ChangeDetectionStrategy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { OrdersRepository } from '../data-access/orders.repository';
import { AdminOrderViewModel } from '../models/orders-view.model';
import { PageHeaderComponent, BadgeComponent } from '@nukkadnow/admin-ui';
import { DataTableComponent, TableColumn } from '@nukkadnow/admin-data-table';
import { InrCurrencyPipe } from '../../../shared/pipes/inr-currency.pipe';

@Component({
  selector: 'admin-orders-list-page',
  standalone: true,
  imports: [CommonModule, FormsModule, PageHeaderComponent, BadgeComponent, DataTableComponent, InrCurrencyPipe],
  template: `
    <div class="orders-page-container">
      <admin-page-header
        title="Live Orders Stream & Global Fulfillment"
        subtitle="Real-time order lifecycle tracking, pickup capacity slots, and emergency intervention"
        breadcrumb="Console / Orders">
        <div actions>
          <div class="stream-pill">
            <span class="live-pulse"></span>
            <span>Live Stream</span>
          </div>
          <button class="admin-btn btn-secondary btn-sm" (click)="loadOrders()">↻ Refresh</button>
        </div>
      </admin-page-header>

      <!-- Search & Status Filter Toolbar -->
      <div class="orders-filter-bar">
        <div class="search-box">
          <span>🔍</span>
          <input
            type="text"
            class="admin-input"
            placeholder="Search order ID, merchant, customer, or token..."
            [(ngModel)]="searchQuery"
            (ngModelChange)="loadOrders()">
        </div>

        <div class="status-tabs">
          <button type="button" class="tab-btn" [class.active]="selectedStatus === ''" (click)="filterStatus('')">All Orders</button>
          <button type="button" class="tab-btn" [class.active]="selectedStatus === 'IN_PREPARATION'" (click)="filterStatus('IN_PREPARATION')">In Prep</button>
          <button type="button" class="tab-btn" [class.active]="selectedStatus === 'READY_FOR_PICKUP'" (click)="filterStatus('READY_FOR_PICKUP')">Ready for Pickup</button>
          <button type="button" class="tab-btn" [class.active]="selectedStatus === 'FORCE_CANCELLED'" (click)="filterStatus('FORCE_CANCELLED')">Cancelled / Intervened</button>
        </div>
      </div>

      <!-- Table Card -->
      <div class="table-card">
        <admin-data-table
          [columns]="tableColumns"
          [data]="orders()"
          [totalCount]="totalCount()"
          [loading]="loading()"
          (rowClick)="onRowClick($event)">
        </admin-data-table>
      </div>
    </div>
  `,
  styles: [`
    .orders-page-container { display: flex; flex-direction: column; gap: 16px; }
    .stream-pill {
      display: inline-flex; align-items: center; gap: 6px; padding: 4px 10px;
      border-radius: var(--admin-radius-full); font-size: 0.75rem; font-weight: 600;
      background: var(--admin-bg-surface); border: 1px solid var(--admin-border-default); color: var(--admin-success);
    }
    .live-pulse {
      width: 6px; height: 6px; border-radius: 50%; background: var(--admin-success);
      box-shadow: 0 0 6px var(--admin-success);
    }
    .orders-filter-bar {
      display: flex; justify-content: space-between; align-items: center; gap: 16px;
      background: var(--admin-bg-surface); border: 1px solid var(--admin-border-subtle);
      border-radius: var(--admin-radius-md); padding: 12px 16px; flex-wrap: wrap;
    }
    .search-box {
      display: flex; align-items: center; gap: 8px; flex: 1; min-width: 260px;
    }
    .status-tabs { display: flex; gap: 8px; flex-wrap: wrap; }
    .tab-btn {
      background: var(--admin-bg-subtle); border: 1px solid var(--admin-border-default);
      color: var(--admin-text-secondary); padding: 6px 12px; border-radius: var(--admin-radius-sm);
      font-size: 0.75rem; cursor: pointer;
      &.active { background: var(--admin-primary-light); color: var(--admin-primary); border-color: var(--admin-primary); font-weight: 600; }
    }
    .table-card {
      background: var(--admin-bg-surface); border: 1px solid var(--admin-border-subtle);
      border-radius: var(--admin-radius-md); overflow: hidden;
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrdersListPageComponent implements OnInit {
  private readonly repository = inject(OrdersRepository);
  private readonly router = inject(Router);

  orders = signal<AdminOrderViewModel[]>([]);
  totalCount = signal<number>(0);
  loading = signal<boolean>(false);

  searchQuery = '';
  selectedStatus = '';

  readonly tableColumns: TableColumn<AdminOrderViewModel>[] = [
    { key: 'id', header: 'Order Ref', width: '160px', sortable: true },
    { key: 'pickupToken', header: 'Token', width: '100px', sortable: true },
    { key: 'merchantName', header: 'Store & Locality', sortable: true },
    { key: 'customerName', header: 'Customer', width: '150px' },
    { key: 'totalPaise', header: 'Amount', width: '130px', align: 'right', sortable: true },
    { key: 'status', header: 'Fulfillment State', width: '160px', sortable: true },
    { key: 'pickupSlot', header: 'Pickup Window', width: '160px' },
    { key: 'placedAt', header: 'Placed Time', width: '150px', sortable: true },
  ];

  ngOnInit(): void {
    this.loadOrders();
  }

  loadOrders(): void {
    this.loading.set(true);
    this.repository.fetchItems({
      search: this.searchQuery,
      status: this.selectedStatus,
    }).subscribe((res) => {
      this.orders.set(res.items);
      this.totalCount.set(res.total);
      this.loading.set(false);
    });
  }

  filterStatus(status: string): void {
    this.selectedStatus = status;
    this.loadOrders();
  }

  onRowClick(order: AdminOrderViewModel): void {
    this.router.navigate(['/orders', order.id]);
  }
}
