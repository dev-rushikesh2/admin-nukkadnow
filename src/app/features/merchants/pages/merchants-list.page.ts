import { Component, inject, OnInit, ChangeDetectionStrategy, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MerchantsRepository } from '../data-access/merchants.repository';
import { MerchantViewModel, SellerMode, MerchantLifecycleStatus } from '../models/merchants-view.model';
import { PageHeaderComponent, BadgeComponent } from '@nukkadnow/admin-ui';
import { DataTableComponent, TableColumn } from '@nukkadnow/admin-data-table';
import { PiiMaskPipe } from '../../../shared/pipes/pii-mask.pipe';
import { AdminSessionService } from '../../../core/auth/session.service';
import { AdminApiClient, AdminEndpoints, ApiResponse } from '@nukkadnow/admin-api-client';
import { AdminPermissions } from '@nukkadnow/admin-access-control';

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
  private readonly apiClient = inject(AdminApiClient);
  private readonly router = inject(Router);
  readonly sessionService = inject(AdminSessionService);
  private readonly piiPipe = new PiiMaskPipe();

  // Sub-tabs (Screens #30, #40, #41)
  activeSubTab = signal<'MERCHANTS' | 'COMPLAINTS' | 'SUSPENSIONS'>('MERCHANTS');

  merchants = signal<MerchantViewModel[]>([]);
  complaints = signal<any[]>([]);
  suspensions = signal<any[]>([]);

  totalCount = signal<number>(0);
  loading = signal<boolean>(false);

  searchQuery = '';
  selectedCity = 'ALL';
  selectedMode = '';
  selectedStatus = '';
  selectedLocality = '';

  readonly activeCityName = computed(() => {
    const geo = this.sessionService.geoAssignment();
    if (geo?.cityName) return geo.cityName;
    return this.selectedCity === 'ALL' ? 'Multi-City Network' : this.selectedCity;
  });

  readonly availableLocalities = computed(() => {
    const city = this.sessionService.geoAssignment()?.cityName || this.selectedCity;
    if (city === 'Akola') {
      return ['Gandhi Chowk', 'Tilak Road', 'Civil Lines', 'Ratanlal Plot', 'Jatharpeth', 'Toshniwal Layout'];
    }
    if (city === 'Amravati') {
      return ['Rajkamal Chowk', 'Badnera Road', 'Gadge Nagar', 'Camp', 'Rukmini Nagar', 'Panchavati'];
    }
    if (city === 'Pune') {
      return ['Kothrud', 'Viman Nagar', 'Baner', 'Shivajinagar', 'Hinjewadi', 'Aundh'];
    }
    // Default Nagpur or Global
    return ['Sitabuldi', 'Dharampeth', 'Sadar', 'Ramdaspeth', 'Mahal', 'Wardha Road'];
  });

  readonly tableColumns: TableColumn<MerchantViewModel>[] = [
    { key: 'id', header: 'Merchant ID', width: '150px', sortable: true },
    { key: 'name', header: 'Storefront Name', sortable: true },
    { key: 'locality', header: 'City / Locality', width: '160px', sortable: true },
    { key: 'mode', header: 'Seller Mode', width: '150px', sortable: true },
    { key: 'status', header: 'Status', width: '140px', sortable: true },
    { key: 'outletsCount', header: 'Outlets', width: '90px', align: 'center', sortable: true },
    { key: 'activeProductsCount', header: 'Products', width: '100px', align: 'center', sortable: true },
    { key: 'lastActiveAt', header: 'Last Active', width: '150px', sortable: true },
  ];

  ngOnInit(): void {
    const geo = this.sessionService.geoAssignment();
    if (geo?.cityName) {
      this.selectedCity = geo.cityName;
    }
    this.loadMerchants();
  }

  loadMerchants(): void {
    this.loading.set(true);
    const filterCity = this.sessionService.geoAssignment()?.cityName || (this.selectedCity !== 'ALL' ? this.selectedCity : undefined);

    this.repository.fetchItems({
      search: this.searchQuery,
      mode: this.selectedMode,
      status: this.selectedStatus,
      locality: this.selectedLocality,
      city: filterCity,
    } as any).subscribe((res) => {
      this.merchants.set(res.items);
      this.totalCount.set(res.total);
      this.loading.set(false);
    });
  }

  setSubTab(tab: 'MERCHANTS' | 'COMPLAINTS' | 'SUSPENSIONS'): void {
    this.activeSubTab.set(tab);
    if (tab === 'COMPLAINTS' && this.complaints().length === 0) {
      this.loadComplaints();
    } else if (tab === 'SUSPENSIONS' && this.suspensions().length === 0) {
      this.loadSuspensions();
    }
  }

  loadComplaints(): void {
    const city = this.sessionService.geoAssignment()?.cityName || (this.selectedCity !== 'ALL' ? this.selectedCity : '');
    const query = city ? `?city=${encodeURIComponent(city)}` : '';
    this.apiClient.get<any>(`${AdminEndpoints.MERCHANT_COMPLAINTS}${query}`).subscribe({
      next: (res: ApiResponse<any>) => {
        const items = res.data?.items || (Array.isArray(res.data) ? res.data : []);
        this.complaints.set(items);
      },
    });
  }

  loadSuspensions(): void {
    const city = this.sessionService.geoAssignment()?.cityName || (this.selectedCity !== 'ALL' ? this.selectedCity : '');
    const query = city ? `?city=${encodeURIComponent(city)}` : '';
    this.apiClient.get<any>(`${AdminEndpoints.MERCHANT_SUSPENSIONS}${query}`).subscribe({
      next: (res: ApiResponse<any>) => {
        const items = res.data?.items || (Array.isArray(res.data) ? res.data : []);
        this.suspensions.set(items);
      },
    });
  }

  resolveComplaint(complaint: any, action: string): void {
    this.apiClient
      .post<any>(AdminEndpoints.MERCHANT_COMPLAINT_RESOLVE(complaint.merchantId, complaint.id), {
        resolutionAction: action,
        notes: `Complaint ${complaint.id} adjudicated with action: ${action}`,
      })
      .subscribe({
        next: () => {
          this.loadComplaints();
        },
      });
  }

  onFilterChange(): void {
    this.loadMerchants();
  }

  onCityChange(city: string): void {
    this.selectedCity = city;
    this.selectedLocality = '';
    this.loadMerchants();
  }

  setStatusTab(status: string): void {
    this.selectedStatus = status;
    this.loadMerchants();
  }

  resetFilters(): void {
    this.searchQuery = '';
    if (!this.sessionService.isCityManager()) {
      this.selectedCity = 'ALL';
    }
    this.selectedMode = '';
    this.selectedStatus = '';
    this.selectedLocality = '';
    this.loadMerchants();
  }

  exportCsv(): void {
    const data = this.merchants();
    if (data.length === 0) return;

    const canUnmask = this.sessionService.currentPermissions().includes(AdminPermissions.AUDIT_PII_UNMASK);

    const headers = ['ID', 'Name', 'Legal Entity', 'Locality', 'Mode', 'Status', 'Phone', 'Email'];
    const rows = data.map(m => [
      m.id,
      `"${(m.name || '').replace(/"/g, '""')}"`,
      `"${(m.legalEntityName || '').replace(/"/g, '""')}"`,
      `"${m.locality}"`,
      m.mode,
      m.status,
      canUnmask ? m.phone : this.piiPipe.transform(m.phone, 'phone'),
      canUnmask ? m.email : this.piiPipe.transform(m.email, 'email')
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `nukkadnow-merchants-${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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
