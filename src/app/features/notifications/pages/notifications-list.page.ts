import { Component, inject, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { NotificationsStore } from '../state/notifications.store';
import { PageHeaderComponent } from '@nukkadnow/admin-ui';
import { DataTableComponent, TableColumn } from '@nukkadnow/admin-data-table';
import { BroadcastNotificationViewModel } from '../models/notifications-view.model';

@Component({
  selector: 'admin-notifications-list-page',
  standalone: true,
  imports: [CommonModule, PageHeaderComponent, DataTableComponent],
  templateUrl: './notifications-list.page.html',
  styleUrls: ['./notifications-list.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NotificationsListPageComponent implements OnInit {
  readonly store = inject(NotificationsStore);
  private readonly router = inject(Router);

  readonly tableColumns: TableColumn<BroadcastNotificationViewModel>[] = [
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

  onRowClick(row: BroadcastNotificationViewModel): void {
    this.router.navigate(['/notifications', row.id]);
  }
}
