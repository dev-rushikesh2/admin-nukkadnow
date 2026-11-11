import { Component, inject, OnInit, ChangeDetectionStrategy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MerchantVerificationRepository } from '../data-access/merchant-verification.repository';
import { MerchantVerificationViewModel } from '../models/merchant-verification-view.model';
import { PageHeaderComponent, BadgeComponent } from '@nukkadnow/admin-ui';
import { DataTableComponent, TableColumn } from '@nukkadnow/admin-data-table';

@Component({
  selector: 'admin-merchant-verification-list-page',
  standalone: true,
  imports: [CommonModule, PageHeaderComponent, BadgeComponent, DataTableComponent],
  template: `
    <div class="kyc-page-container">
      <admin-page-header
        title="Merchant KYC & Regulatory Verification Queue"
        subtitle="Review government licenses, FSSAI certificates, and automated IMPS penny-drop bank matches"
        breadcrumb="Console / Verification Queue">
        <div actions>
          <span class="badge badge-warning">SLA: Under 4 Hours</span>
          <button class="admin-btn btn-secondary btn-sm" (click)="loadQueue()">↻ Refresh</button>
        </div>
      </admin-page-header>

      <div class="table-card">
        <admin-data-table
          [columns]="tableColumns"
          [data]="queue()"
          [totalCount]="queue().length"
          [loading]="loading()"
          (rowClick)="onRowClick($event)">
        </admin-data-table>
      </div>
    </div>
  `,
  styles: [`
    .kyc-page-container { display: flex; flex-direction: column; gap: 16px; }
    .table-card { background: var(--admin-bg-surface); border: 1px solid var(--admin-border-subtle); border-radius: var(--admin-radius-md); overflow: hidden; }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MerchantVerificationListPageComponent implements OnInit {
  private readonly repository = inject(MerchantVerificationRepository);
  private readonly router = inject(Router);

  queue = signal<MerchantVerificationViewModel[]>([]);
  loading = signal<boolean>(false);

  readonly tableColumns: TableColumn<MerchantVerificationViewModel>[] = [
    { key: 'id', header: 'Application ID', width: '160px', sortable: true },
    { key: 'businessName', header: 'Store / Merchant Name', sortable: true },
    { key: 'locality', header: 'Nagpur Locality', width: '150px', sortable: true },
    { key: 'mode', header: 'Seller Mode', width: '130px' },
    { key: 'status', header: 'Status', width: '140px', sortable: true },
    { key: 'submittedAt', header: 'Submission Time', width: '160px', sortable: true },
    { key: 'slaExpiresAt', header: 'Target SLA', width: '160px' },
  ];

  ngOnInit(): void {
    this.loadQueue();
  }

  loadQueue(): void {
    this.loading.set(true);
    this.repository.fetchItems().subscribe((res) => {
      this.queue.set(res.items);
      this.loading.set(false);
    });
  }

  onRowClick(item: MerchantVerificationViewModel): void {
    this.router.navigate(['/merchant-verification', item.id]);
  }
}
