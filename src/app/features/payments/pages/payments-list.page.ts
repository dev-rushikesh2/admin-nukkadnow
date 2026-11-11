import { Component, inject, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { PaymentsStore } from '../state/payments.store';
import { PageHeaderComponent } from '@nukkadnow/admin-ui';
import { DataTableComponent, TableColumn } from '@nukkadnow/admin-data-table';
import { PaymentTransactionViewModel } from '../models/payments-view.model';

@Component({
  selector: 'admin-payments-list-page',
  standalone: true,
  imports: [CommonModule, PageHeaderComponent, DataTableComponent],
  templateUrl: './payments-list.page.html',
  styleUrls: ['./payments-list.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PaymentsListPageComponent implements OnInit {
  readonly store = inject(PaymentsStore);
  private readonly router = inject(Router);

  readonly tableColumns: TableColumn<PaymentTransactionViewModel>[] = [
    { key: 'id', header: 'Reference ID', width: '220px', sortable: true },
    { key: 'name', header: 'Name / Identifier', sortable: true },
    { key: 'status', header: 'State', width: '140px', sortable: true },
    { key: 'createdAt', header: 'Recorded At', width: '180px', sortable: true }
  ];

  ngOnInit(): void {
    this.store.loadItems();
  }

  refresh(): void {
    this.store.loadItems();
  }

  exportRecords(): void {
    // Export audited CSV
  }

  onRowClick(row: PaymentTransactionViewModel): void {
    this.router.navigate(['/payments', row.id]);
  }
}
