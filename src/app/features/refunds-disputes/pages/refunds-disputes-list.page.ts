import { Component, inject, OnInit, ChangeDetectionStrategy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { RefundsDisputesRepository } from '../data-access/refunds-disputes.repository';
import { RefundDisputeViewModel } from '../models/refunds-disputes-view.model';
import { PageHeaderComponent, BadgeComponent } from '@nukkadnow/admin-ui';
import { DataTableComponent, TableColumn } from '@nukkadnow/admin-data-table';
import { InrCurrencyPipe } from '../../../shared/pipes/inr-currency.pipe';

@Component({
  selector: 'admin-refunds-disputes-list-page',
  standalone: true,
  imports: [CommonModule, PageHeaderComponent, BadgeComponent, DataTableComponent, InrCurrencyPipe],
  template: `
    <div class="refunds-page-container">
      <admin-page-header
        title="Refunds, Customer Disputes & Dual-Sign Approvals"
        subtitle="Manage customer reimbursement authorizations with four-eyes separation of duties for > ₹5,000"
        breadcrumb="Console / Financials / Refunds">
        <div actions>
          <span class="badge badge-danger">Dual-Sign Enforced</span>
          <button class="admin-btn btn-secondary btn-sm" (click)="loadRefunds()">↻ Refresh</button>
        </div>
      </admin-page-header>

      <div class="table-card">
        <admin-data-table
          [columns]="tableColumns"
          [data]="refunds()"
          [totalCount]="refunds().length"
          [loading]="loading()"
          (rowClick)="onRowClick($event)">
        </admin-data-table>
      </div>
    </div>
  `,
  styles: [`
    .refunds-page-container { display: flex; flex-direction: column; gap: 16px; }
    .table-card { background: var(--admin-bg-surface); border: 1px solid var(--admin-border-subtle); border-radius: var(--admin-radius-md); overflow: hidden; }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RefundsDisputesListPageComponent implements OnInit {
  private readonly repository = inject(RefundsDisputesRepository);
  private readonly router = inject(Router);

  refunds = signal<RefundDisputeViewModel[]>([]);
  loading = signal<boolean>(false);

  readonly tableColumns: TableColumn<RefundDisputeViewModel>[] = [
    { key: 'id', header: 'Refund Ref', width: '150px', sortable: true },
    { key: 'orderId', header: 'Order Ref', width: '160px', sortable: true },
    { key: 'merchantName', header: 'Merchant Store', sortable: true },
    { key: 'customerName', header: 'Customer', width: '160px' },
    { key: 'amountPaise', header: 'Amount', width: '130px', align: 'right', sortable: true },
    { key: 'status', header: 'Authorization State', width: '190px', sortable: true },
    { key: 'requiresDualSign', header: 'Tier', width: '120px' },
    { key: 'createdAt', header: 'Requested At', width: '150px', sortable: true },
  ];

  ngOnInit(): void {
    this.loadRefunds();
  }

  loadRefunds(): void {
    this.loading.set(true);
    this.repository.fetchItems().subscribe((res) => {
      this.refunds.set(res.items);
      this.loading.set(false);
    });
  }

  onRowClick(refund: RefundDisputeViewModel): void {
    this.router.navigate(['/refunds-disputes', refund.id]);
  }
}
