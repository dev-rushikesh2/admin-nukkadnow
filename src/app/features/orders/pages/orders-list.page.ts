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
import { AdminApiClient, AdminEndpoints, ApiResponse } from '@nukkadnow/admin-api-client';

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
  private readonly apiClient = inject(AdminApiClient);
  private readonly router = inject(Router);
  readonly sessionService = inject(AdminSessionService);

  // Sub-tab navigation (Screens #52, #61, #62, #63, #59)
  activeTab = signal<'STREAM' | 'QR_POS' | 'PRE_ORDERS' | 'CAPACITY' | 'DISPUTES'>('STREAM');

  orders = signal<AdminOrderViewModel[]>([]);
  qrOrders = signal<any[]>([]);
  preOrders = signal<any[]>([]);
  capacityData = signal<any>(null);
  disputes = signal<any[]>([]);

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

  setTab(tab: 'STREAM' | 'QR_POS' | 'PRE_ORDERS' | 'CAPACITY' | 'DISPUTES'): void {
    this.activeTab.set(tab);
    if (tab === 'QR_POS' && this.qrOrders().length === 0) {
      this.loadQrOrders();
    } else if (tab === 'PRE_ORDERS' && this.preOrders().length === 0) {
      this.loadPreOrders();
    } else if (tab === 'CAPACITY' && !this.capacityData()) {
      this.loadCapacity();
    } else if (tab === 'DISPUTES' && this.disputes().length === 0) {
      this.loadDisputes();
    }
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

  loadQrOrders(): void {
    const city = this.sessionService.geoAssignment()?.cityName || (this.selectedCity !== 'ALL' ? this.selectedCity : '');
    const query = city ? `?city=${encodeURIComponent(city)}` : '';
    this.apiClient.get<any>(`${AdminEndpoints.ORDERS_QR_MONITORING}${query}`).subscribe({
      next: (res: ApiResponse<any>) => {
        if (res.data?.items) {
          this.qrOrders.set(res.data.items);
        }
      },
    });
  }

  loadPreOrders(): void {
    const city = this.sessionService.geoAssignment()?.cityName || (this.selectedCity !== 'ALL' ? this.selectedCity : '');
    const query = city ? `?city=${encodeURIComponent(city)}` : '';
    this.apiClient.get<any>(`${AdminEndpoints.ORDERS_PRE_ORDERS}${query}`).subscribe({
      next: (res: ApiResponse<any>) => {
        const items = res.data?.items || (Array.isArray(res.data) ? res.data : []);
        this.preOrders.set(items);
      },
    });
  }

  loadCapacity(): void {
    const city = this.sessionService.geoAssignment()?.cityName || (this.selectedCity !== 'ALL' ? this.selectedCity : '');
    const query = city ? `?city=${encodeURIComponent(city)}` : '';
    this.apiClient.get<any>(`${AdminEndpoints.ORDERS_CAPACITY_MONITORING}${query}`).subscribe({
      next: (res: ApiResponse<any>) => {
        if (res.data) {
          this.capacityData.set(res.data);
        }
      },
    });
  }

  toggleThrottle(outletId: string, currentThrottle: boolean): void {
    this.apiClient
      .post<any>(AdminEndpoints.ORDERS_CAPACITY_THROTTLE(outletId), {
        throttle: !currentThrottle,
        reason: !currentThrottle ? 'High counter load saturation' : 'Traffic normalized',
      })
      .subscribe({
        next: () => {
          this.loadCapacity();
        },
      });
  }

  loadDisputes(): void {
    const city = this.sessionService.geoAssignment()?.cityName || (this.selectedCity !== 'ALL' ? this.selectedCity : '');
    const query = city ? `?city=${encodeURIComponent(city)}` : '';
    this.apiClient.get<any>(`${AdminEndpoints.ORDERS_DISPUTES}${query}`).subscribe({
      next: (res: ApiResponse<any>) => {
        const items = res.data?.items || (Array.isArray(res.data) ? res.data : []);
        this.disputes.set(items);
      },
    });
  }

  onCityChange(city: string): void {
    this.selectedCity = city;
    this.loadOrders();
    if (this.activeTab() === 'QR_POS') this.loadQrOrders();
    else if (this.activeTab() === 'PRE_ORDERS') this.loadPreOrders();
    else if (this.activeTab() === 'CAPACITY') this.loadCapacity();
    else if (this.activeTab() === 'DISPUTES') this.loadDisputes();
  }

  filterStatus(status: string): void {
    this.selectedStatus = status;
    this.loadOrders();
  }

  onRowClick(order: AdminOrderViewModel): void {
    this.router.navigate(['/orders', order.id]);
  }
}
