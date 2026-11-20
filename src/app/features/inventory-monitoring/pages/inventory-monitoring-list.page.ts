import { Component, OnInit, inject, signal, computed, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminApiClient, AdminEndpoints, ApiResponse } from '@nukkadnow/admin-api-client';
import { AdminSessionService } from '../../../core/auth/session.service';
import { PageHeaderComponent, BadgeComponent } from '@nukkadnow/admin-ui';

export interface InventoryOverviewMetrics {
  totalSkus: number;
  lowStockCount: number;
  outOfStockCount: number;
  healthyStockCount: number;
  nearExpiryCount: number;
  totalInventoryValuationPaise: number;
  totalInventoryValuationRupees: number;
  turnoverRatePct: number;
  pendingDiscrepanciesCount: number;
  activeTerritory: string;
}

export interface InventoryStockItem {
  id: string;
  productId: string;
  productName: string;
  category: string;
  subCategory: string;
  unit: string;
  sku: string;
  barcode: string;
  hsnCode: string;
  merchantId: string;
  merchantName: string;
  outletId: string;
  outletName: string;
  city: string;
  locality: string;
  pricePaise: number;
  mrpPaise: number;
  onHandStock: number;
  reservedStock: number;
  availableStock: number;
  safetyStock: number;
  status: 'HEALTHY' | 'LOW_STOCK' | 'OUT_OF_STOCK';
  daysOfSupply: number;
  isNearExpiry: boolean;
  expiryDate: string;
  lastRestockedAt: string;
  lastRestockedDaysAgo: number;
}

export interface StockMovementEvent {
  id: string;
  productId: string;
  productName: string;
  merchantId: string;
  merchantName: string;
  outletName: string;
  city: string;
  type: string;
  delta: number;
  balanceBefore: number;
  balanceAfter: number;
  referenceId: string;
  recordedBy: string;
  timestamp: string;
  notes: string;
}

export interface InventoryReconciliationItem {
  id: string;
  merchantId: string;
  merchantName: string;
  outletName: string;
  city: string;
  productId: string;
  productName: string;
  sku: string;
  systemStock: number;
  physicalStock: number;
  discrepancyDelta: number;
  reasonCode: string;
  status: 'PENDING_REVIEW' | 'RESOLVED' | 'REJECTED';
  reportedAt: string;
  resolvedAt: string | null;
  resolvedBy: string | null;
  resolutionNotes: string | null;
}

export interface StockDataQualityReport {
  staleSkusCount: number;
  staleSkus: InventoryStockItem[];
  missingBarcodesCount: number;
  missingBarcodes: InventoryStockItem[];
  priceAnomaliesCount: number;
  priceAnomalies: InventoryStockItem[];
  negativeStockCount: number;
  overallQualityScorePct: number;
}

@Component({
  selector: 'admin-inventory-monitoring-list-page',
  standalone: true,
  imports: [CommonModule, FormsModule, PageHeaderComponent, BadgeComponent],
  templateUrl: './inventory-monitoring-list.page.html',
  styleUrls: ['./inventory-monitoring-list.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InventoryMonitoringListPageComponent implements OnInit {
  private readonly apiClient = inject(AdminApiClient);
  readonly sessionService = inject(AdminSessionService);

  // Active view tab (Screens #73 to #78)
  activeTab = signal<'INSIGHTS' | 'LOW_STOCK' | 'MOVEMENTS' | 'RECONCILIATION' | 'DATA_QUALITY'>('INSIGHTS');

  // Loading signals
  isLoading = signal<boolean>(false);
  isSubmitting = signal<boolean>(false);

  // Territorial filtering
  selectedCity = signal<string>('ALL');
  searchQuery = signal<string>('');
  selectedCategory = signal<string>('ALL');
  selectedStatus = signal<string>('ALL');

  // Datasets
  overview = signal<InventoryOverviewMetrics | null>(null);
  stocks = signal<InventoryStockItem[]>([]);
  movements = signal<StockMovementEvent[]>([]);
  reconciliations = signal<InventoryReconciliationItem[]>([]);
  dataQuality = signal<StockDataQualityReport | null>(null);

  // Selected Reconciliation for Resolution Dialog
  activeReconciliation = signal<InventoryReconciliationItem | null>(null);
  reconciliationAction = signal<'APPROVE_ADJUSTMENT' | 'REJECT_DISCREPANCY'>('APPROVE_ADJUSTMENT');
  reconciliationNotes = signal<string>('');

  readonly activeCityName = computed(() => {
    const geo = this.sessionService.geoAssignment();
    if (geo?.cityName) return geo.cityName;
    return this.selectedCity() === 'ALL' ? 'Multi-City Network' : this.selectedCity();
  });

  ngOnInit(): void {
    // Lock city if operator is municipal-scoped
    const geo = this.sessionService.geoAssignment();
    if (geo?.cityName) {
      this.selectedCity.set(geo.cityName);
    }
    this.refreshAll();
  }

  setTab(tab: 'INSIGHTS' | 'LOW_STOCK' | 'MOVEMENTS' | 'RECONCILIATION' | 'DATA_QUALITY'): void {
    this.activeTab.set(tab);
    if (tab === 'MOVEMENTS' && this.movements().length === 0) {
      this.loadMovements();
    } else if (tab === 'RECONCILIATION' && this.reconciliations().length === 0) {
      this.loadReconciliations();
    } else if (tab === 'DATA_QUALITY' && !this.dataQuality()) {
      this.loadDataQuality();
    }
  }

  setCity(city: string): void {
    this.selectedCity.set(city);
    this.refreshAll();
  }

  refreshAll(): void {
    this.loadOverview();
    this.loadStocks();
    this.loadMovements();
    this.loadReconciliations();
    this.loadDataQuality();
  }

  loadOverview(): void {
    const city = this.selectedCity();
    const query = city !== 'ALL' ? `?city=${encodeURIComponent(city)}` : '';
    this.apiClient.get<InventoryOverviewMetrics>(`${AdminEndpoints.INVENTORY_OVERVIEW}${query}`).subscribe({
      next: (res: ApiResponse<InventoryOverviewMetrics>) => {
        if (res.data) {
          this.overview.set(res.data);
        }
      },
      error: () => {
        // Fallback calculation from local data if needed
      },
    });
  }

  loadStocks(): void {
    this.isLoading.set(true);
    const params: string[] = [];
    if (this.selectedCity() !== 'ALL') params.push(`city=${encodeURIComponent(this.selectedCity())}`);
    if (this.searchQuery().trim()) params.push(`query=${encodeURIComponent(this.searchQuery().trim())}`);
    if (this.selectedCategory() !== 'ALL') params.push(`category=${encodeURIComponent(this.selectedCategory())}`);
    if (this.selectedStatus() !== 'ALL') params.push(`status=${encodeURIComponent(this.selectedStatus())}`);

    const queryString = params.length > 0 ? `?${params.join('&')}` : '';
    this.apiClient.get<any>(`${AdminEndpoints.INVENTORY_STOCKS}${queryString}`).subscribe({
      next: (res: ApiResponse<any>) => {
        this.isLoading.set(false);
        const items = res.data?.items || (Array.isArray(res.data) ? res.data : []);
        this.stocks.set(items);
      },
      error: () => {
        this.isLoading.set(false);
      },
    });
  }

  loadMovements(): void {
    const city = this.selectedCity();
    const query = city !== 'ALL' ? `?city=${encodeURIComponent(city)}` : '';
    this.apiClient.get<any>(`${AdminEndpoints.INVENTORY_MOVEMENTS}${query}`).subscribe({
      next: (res: ApiResponse<any>) => {
        const items = res.data?.items || (Array.isArray(res.data) ? res.data : []);
        this.movements.set(items);
      },
    });
  }

  loadReconciliations(): void {
    const city = this.selectedCity();
    const query = city !== 'ALL' ? `?city=${encodeURIComponent(city)}` : '';
    this.apiClient.get<any>(`${AdminEndpoints.INVENTORY_RECONCILIATIONS}${query}`).subscribe({
      next: (res: ApiResponse<any>) => {
        const items = res.data?.items || (Array.isArray(res.data) ? res.data : []);
        this.reconciliations.set(items);
      },
    });
  }

  loadDataQuality(): void {
    const city = this.selectedCity();
    const query = city !== 'ALL' ? `?city=${encodeURIComponent(city)}` : '';
    this.apiClient.get<StockDataQualityReport>(`${AdminEndpoints.INVENTORY_DATA_QUALITY}${query}`).subscribe({
      next: (res: ApiResponse<StockDataQualityReport>) => {
        if (res.data) {
          this.dataQuality.set(res.data);
        }
      },
    });
  }

  openResolveDialog(rec: InventoryReconciliationItem): void {
    this.activeReconciliation.set(rec);
    this.reconciliationAction.set('APPROVE_ADJUSTMENT');
    this.reconciliationNotes.set('');
  }

  closeResolveDialog(): void {
    this.activeReconciliation.set(null);
  }

  submitReconciliationResolution(): void {
    const rec = this.activeReconciliation();
    if (!rec) return;

    this.isSubmitting.set(true);
    this.apiClient
      .post<any>(AdminEndpoints.INVENTORY_RECONCILIATION_RESOLVE(rec.id), {
        resolution: this.reconciliationAction(),
        notes: this.reconciliationNotes() || `Discrepancy resolved via administrative review.`,
      })
      .subscribe({
        next: () => {
          this.isSubmitting.set(false);
          this.closeResolveDialog();
          this.loadReconciliations();
          this.loadOverview();
        },
        error: () => {
          this.isSubmitting.set(false);
          this.closeResolveDialog();
        },
      });
  }

  exportCsv(): void {
    const data = this.stocks();
    if (!data.length) return;

    const headers = ['SKU', 'Product Name', 'Category', 'Merchant', 'Outlet', 'City', 'Locality', 'On-Hand', 'Reserved', 'Available', 'Safety Stock', 'Status', 'Price (Rs)', 'MRP (Rs)'];
    const rows = data.map((s) => [
      s.sku,
      `"${s.productName.replace(/"/g, '""')}"`,
      `"${s.category}"`,
      `"${s.merchantName.replace(/"/g, '""')}"`,
      `"${s.outletName.replace(/"/g, '""')}"`,
      s.city,
      `"${s.locality}"`,
      s.onHandStock,
      s.reservedStock,
      s.availableStock,
      s.safetyStock,
      s.status,
      (s.pricePaise / 100).toFixed(2),
      (s.mrpPaise / 100).toFixed(2),
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `nukkadnow-inventory-${this.selectedCity().toLowerCase()}-${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}
