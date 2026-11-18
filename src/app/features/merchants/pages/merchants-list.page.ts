import { Component, inject, OnInit, ChangeDetectionStrategy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MerchantsRepository } from '../data-access/merchants.repository';
import { MerchantViewModel, SellerMode, MerchantLifecycleStatus } from '../models/merchants-view.model';
import { PageHeaderComponent, BadgeComponent } from '@nukkadnow/admin-ui';
import { DataTableComponent, TableColumn } from '@nukkadnow/admin-data-table';
import { PiiMaskPipe } from '../../../shared/pipes/pii-mask.pipe';

@Component({
  selector: 'admin-merchants-list-page',
  standalone: true,
  imports: [CommonModule, FormsModule, PageHeaderComponent, BadgeComponent, DataTableComponent, PiiMaskPipe],
  templateUrl: './merchants-list.page.html',
  styleUrls: ['./merchants-list.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MerchantsListPageComponent implements OnInit {
  private readonly repository = inject(MerchantsRepository);
  private readonly router = inject(Router);

  merchants = signal<MerchantViewModel[]>([]);
  totalCount = signal<number>(0);
  loading = signal<boolean>(false);

  searchQuery = '';
  selectedMode = '';
  selectedStatus = '';
  selectedLocality = '';

  readonly tableColumns: TableColumn<MerchantViewModel>[] = [
    { key: 'id', header: 'Merchant ID', width: '150px', sortable: true },
    { key: 'name', header: 'Business Name', sortable: true },
    { key: 'locality', header: 'City / Locality', width: '150px', sortable: true },
    { key: 'mode', header: 'Seller Mode', width: '140px', sortable: true },
    { key: 'status', header: 'Lifecycle Status', width: '150px', sortable: true },
    { key: 'outletsCount', header: 'Outlets', width: '90px', align: 'center', sortable: true },
    { key: 'activeProductsCount', header: 'Products', width: '100px', align: 'center', sortable: true },
    { key: 'lastActiveAt', header: 'Last Active', width: '150px', sortable: true },
  ];

  ngOnInit(): void {
    this.loadMerchants();
  }

  loadMerchants(): void {
    this.loading.set(true);
    this.repository.fetchItems({
      search: this.searchQuery,
      mode: this.selectedMode,
      status: this.selectedStatus,
      locality: this.selectedLocality,
    }).subscribe((res) => {
      this.merchants.set(res.items);
      this.totalCount.set(res.total);
      this.loading.set(false);
    });
  }

  onFilterChange(): void {
    this.loadMerchants();
  }

  resetFilters(): void {
    this.searchQuery = '';
    this.selectedMode = '';
    this.selectedStatus = '';
    this.selectedLocality = '';
    this.loadMerchants();
  }

  onRowClick(merchant: MerchantViewModel): void {
    this.router.navigate(['/merchants', merchant.id]);
  }

  getModeBadgeVariant(mode: SellerMode): 'info' | 'warning' | 'purple' | 'success' | 'neutral' {
    switch (mode) {
      case 'HOME_MAKER': return 'purple';
      case 'FOOD_STALL': return 'warning';
      case 'RETAIL': return 'info';
      case 'SEASONAL': return 'neutral';
      case 'ARTISAN': return 'success';
      default: return 'neutral';
    }
  }

  getStatusBadgeVariant(status: MerchantLifecycleStatus): 'success' | 'danger' | 'warning' | 'neutral' {
    switch (status) {
      case 'ACTIVE': return 'success';
      case 'SUSPENDED': return 'danger';
      case 'PENDING_VERIFICATION': return 'warning';
      default: return 'neutral';
    }
  }
}
