import { Component, OnInit, inject, signal, computed, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AdminApiClient, AdminEndpoints, ApiResponse } from '@nukkadnow/admin-api-client';
import { AdminSessionService } from '../../../core/auth/session.service';
import { PageHeaderComponent, BadgeComponent } from '@nukkadnow/admin-ui';

export interface CustomerOverviewMetrics {
  totalCustomers: number;
  activeMonthlyUsers: number;
  repeatOrderRatePct: number;
  averageLtvPaise: number;
  averageLtvRupees: number;
  vipCustomersCount: number;
  restrictedCount: number;
  suspendedCount: number;
  dpdpConsentCompliancePct: number;
  activeTerritory: string;
}

export interface CustomerListItem {
  id: string;
  fullName: string;
  maskedPhone: string;
  maskedEmail: string;
  city: string;
  cityCode: string;
  segment: 'NEW' | 'ACTIVE' | 'REPEAT' | 'VIP' | 'INACTIVE';
  status: 'ACTIVE' | 'RESTRICTED' | 'SUSPENDED';
  totalOrdersCount: number;
  lifetimeSpendPaise: number;
  lifetimeSpendRupees: number;
  primaryLocality: string;
  addressesCount: number;
  registeredAt: string;
  lastActiveAt: string;
}

@Component({
  selector: 'admin-customers-list-page',
  standalone: true,
  imports: [CommonModule, FormsModule, PageHeaderComponent, BadgeComponent],
  templateUrl: './customers-list.page.html',
  styleUrls: ['./customers-list.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CustomersListPageComponent implements OnInit {
  private readonly apiClient = inject(AdminApiClient);
  private readonly router = inject(Router);
  readonly sessionService = inject(AdminSessionService);

  // Filter signals
  selectedCity = signal<string>('ALL');
  selectedSegment = signal<string>('ALL');
  selectedStatus = signal<string>('ALL');
  searchQuery = signal<string>('');

  // Datasets
  overview = signal<CustomerOverviewMetrics | null>(null);
  customers = signal<CustomerListItem[]>([]);
  totalCount = signal<number>(0);
  isLoading = signal<boolean>(false);

  readonly activeCityName = computed(() => {
    const geo = this.sessionService.geoAssignment();
    if (geo?.cityName) return geo.cityName;
    return this.selectedCity() === 'ALL' ? 'Multi-City Network' : this.selectedCity();
  });

  ngOnInit(): void {
    const geo = this.sessionService.geoAssignment();
    if (geo?.cityName) {
      this.selectedCity.set(geo.cityName);
    }
    this.refreshAll();
  }

  setCity(city: string): void {
    this.selectedCity.set(city);
    this.refreshAll();
  }

  setSegmentTab(segment: string): void {
    this.selectedSegment.set(segment);
    this.loadCustomers();
  }

  refreshAll(): void {
    this.loadOverview();
    this.loadCustomers();
  }

  loadOverview(): void {
    const city = this.selectedCity();
    const query = city !== 'ALL' ? `?city=${encodeURIComponent(city)}` : '';
    this.apiClient.get<CustomerOverviewMetrics>(`${AdminEndpoints.CUSTOMERS_OVERVIEW}${query}`).subscribe({
      next: (res: ApiResponse<CustomerOverviewMetrics>) => {
        if (res.data) {
          this.overview.set(res.data);
        }
      },
    });
  }

  loadCustomers(): void {
    this.isLoading.set(true);
    const params: string[] = [];
    if (this.selectedCity() !== 'ALL') params.push(`city=${encodeURIComponent(this.selectedCity())}`);
    if (this.selectedSegment() !== 'ALL') params.push(`segment=${encodeURIComponent(this.selectedSegment())}`);
    if (this.selectedStatus() !== 'ALL') params.push(`status=${encodeURIComponent(this.selectedStatus())}`);
    if (this.searchQuery().trim()) params.push(`query=${encodeURIComponent(this.searchQuery().trim())}`);

    const queryString = params.length > 0 ? `?${params.join('&')}` : '';
    this.apiClient.get<any>(`${AdminEndpoints.CUSTOMERS}${queryString}`).subscribe({
      next: (res: ApiResponse<any>) => {
        this.isLoading.set(false);
        const items = res.data?.items || (Array.isArray(res.data) ? res.data : []);
        this.customers.set(items);
        this.totalCount.set(res.data?.total || items.length);
      },
      error: () => {
        this.isLoading.set(false);
      },
    });
  }

  viewDetails(customerId: string): void {
    this.router.navigate(['/customers', customerId]);
  }

  exportCsv(): void {
    const data = this.customers();
    if (!data.length) return;

    const headers = ['ID', 'Full Name', 'Phone (Masked)', 'Email (Masked)', 'City', 'Locality', 'Segment', 'Status', 'Orders', 'LTV (Rs)', 'Registered'];
    const rows = data.map((c) => [
      c.id,
      `"${c.fullName.replace(/"/g, '""')}"`,
      c.maskedPhone,
      c.maskedEmail,
      c.city,
      `"${c.primaryLocality}"`,
      c.segment,
      c.status,
      c.totalOrdersCount,
      (c.lifetimeSpendPaise / 100).toFixed(2),
      c.registeredAt,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `nukkadnow-customers-${this.selectedCity().toLowerCase()}-${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}
