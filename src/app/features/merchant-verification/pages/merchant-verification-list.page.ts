import { Component, inject, OnInit, ChangeDetectionStrategy, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MerchantVerificationRepository } from '../data-access/merchant-verification.repository';
import { MerchantVerificationViewModel } from '../models/merchant-verification-view.model';
import { PageHeaderComponent, BadgeComponent } from '@nukkadnow/admin-ui';
import { DataTableComponent, TableColumn } from '@nukkadnow/admin-data-table';
import { AdminSessionService } from '../../../core/auth/session.service';

@Component({
  selector: 'admin-merchant-verification-list-page',
  standalone: true,
  imports: [CommonModule, FormsModule, PageHeaderComponent, BadgeComponent, DataTableComponent],
  templateUrl: './merchant-verification-list.page.html',
  styleUrls: ['./merchant-verification-list.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MerchantVerificationListPageComponent implements OnInit {
  private readonly repository = inject(MerchantVerificationRepository);
  private readonly router = inject(Router);
  readonly sessionService = inject(AdminSessionService);

  queue = signal<MerchantVerificationViewModel[]>([]);
  loading = signal<boolean>(false);
  selectedCity = 'ALL';
  selectedMode = '';

  readonly activeCityName = computed(() => {
    const geo = this.sessionService.geoAssignment();
    if (geo?.cityName) return geo.cityName;
    return this.selectedCity === 'ALL' ? 'Multi-City Queue' : this.selectedCity;
  });

  readonly pendingCount = computed(() => this.queue().filter(q => q.status === 'SUBMITTED' || q.status === 'IN_REVIEW').length);
  readonly bankMatchedCount = computed(() => this.queue().filter(q => q.bankPennyDrop?.isMatch).length);

  readonly tableColumns: TableColumn<MerchantVerificationViewModel>[] = [
    { key: 'id', header: 'Application ID', width: '160px', sortable: true },
    { key: 'businessName', header: 'Store / Merchant Name', sortable: true },
    { key: 'locality', header: 'City / Locality', width: '160px', sortable: true },
    { key: 'mode', header: 'Seller Mode', width: '140px' },
    { key: 'status', header: 'Verification State', width: '150px', sortable: true },
    { key: 'submittedAt', header: 'Submitted At', width: '160px', sortable: true },
    { key: 'slaExpiresAt', header: 'Target SLA', width: '160px' },
  ];

  ngOnInit(): void {
    const geo = this.sessionService.geoAssignment();
    if (geo?.cityName) {
      this.selectedCity = geo.cityName;
    }
    this.loadQueue();
  }

  loadQueue(): void {
    this.loading.set(true);
    const filterCity = this.sessionService.geoAssignment()?.cityName || (this.selectedCity !== 'ALL' ? this.selectedCity : undefined);

    this.repository.fetchItems({
      city: filterCity,
      mode: this.selectedMode,
    } as any).subscribe((res) => {
      let items = res.items;
      if (this.selectedMode) {
        items = items.filter(i => i.mode === this.selectedMode);
      }
      this.queue.set(items);
      this.loading.set(false);
    });
  }

  onCityChange(city: string): void {
    this.selectedCity = city;
    this.loadQueue();
  }

  filterMode(mode: string): void {
    this.selectedMode = mode;
    this.loadQueue();
  }

  onRowClick(item: MerchantVerificationViewModel): void {
    this.router.navigate(['/merchant-verification', item.id]);
  }
}
