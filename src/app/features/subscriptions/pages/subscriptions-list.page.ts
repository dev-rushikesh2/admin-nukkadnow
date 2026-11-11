import { Component, inject, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { SubscriptionsStore } from '../state/subscriptions.store';
import { PageHeaderComponent } from '@nukkadnow/admin-ui';
import { DataTableComponent, TableColumn } from '@nukkadnow/admin-data-table';
import { MerchantSubscriptionViewModel } from '../models/subscriptions-view.model';

@Component({
  selector: 'admin-subscriptions-list-page',
  standalone: true,
  imports: [CommonModule, PageHeaderComponent, DataTableComponent],
  templateUrl: './subscriptions-list.page.html',
  styleUrls: ['./subscriptions-list.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SubscriptionsListPageComponent implements OnInit {
  readonly store = inject(SubscriptionsStore);
  private readonly router = inject(Router);

  readonly tableColumns: TableColumn<MerchantSubscriptionViewModel>[] = [
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

  onRowClick(row: MerchantSubscriptionViewModel): void {
    this.router.navigate(['/subscriptions', row.id]);
  }
}
