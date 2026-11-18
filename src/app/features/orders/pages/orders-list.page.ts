import { Component, inject, OnInit, ChangeDetectionStrategy, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { OrdersRepository } from '../data-access/orders.repository';
import { AdminOrderViewModel } from '../models/orders-view.model';
import { PageHeaderComponent, BadgeComponent } from '@nukkadnow/admin-ui';
import { DataTableComponent, TableColumn } from '@nukkadnow/admin-data-table';
import { InrCurrencyPipe } from '../../../shared/pipes/inr-currency.pipe';
import { AdminSessionService } from '../../../core/auth/session.service';

@Component({
  selector: 'admin-orders-list-page',
  standalone: true,
  imports: [CommonModule, FormsModule, PageHeaderComponent, BadgeComponent, DataTableComponent, InrCurrencyPipe],
  templateUrl: './orders-list.page.html',
  styleUrls: ['./orders-list.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrdersListPageComponent implements OnInit {
  private readonly repository = inject(OrdersRepository);
  private readonly router = inject(Router);
  readonly sessionService = inject(AdminSessionService);

  orders = signal<AdminOrderViewModel[]>([]);
  totalCount = signal<number>(0);
  loading = signal<boolean>(false);

  searchQuery = '';
  selectedStatus = '';
  selectedCity = 'ALL';

  readonly activeCityName = computed(() => {
    const geo = this.sessionService.geoAssignment();
    if (geo?.cityName) return geo.cityName;
    return this.selectedCity === 'ALL' ? 'Multi-City Network' : this.selectedCity;
  });

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
    const geo = this.sessionService.geoAssignment();
    if (geo?.cityName) {
      this.selectedCity = geo.cityName;
    }
    this.loadOrders();
  }

  loadOrders(): void {
    this.loading.set(true);
    const filterCity = this.sessionService.geoAssignment()?.cityName || (this.selectedCity !== 'ALL' ? this.selectedCity : undefined);

    this.repository.fetchItems({
      search: this.searchQuery,
      status: this.selectedStatus,
      city: filterCity,
    } as any).subscribe((res) => {
      this.orders.set(res.items);
      this.totalCount.set(res.total);
      this.loading.set(false);
    });
  }

  onCityChange(city: string): void {
    this.selectedCity = city;
    this.loadOrders();
  }

  filterStatus(status: string): void {
    this.selectedStatus = status;
    this.loadOrders();
  }

  onRowClick(order: AdminOrderViewModel): void {
    this.router.navigate(['/orders', order.id]);
  }
}
