import { Component, inject, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { PlatformUsersStore } from '../state/platform-users.store';
import { PageHeaderComponent } from '@nukkadnow/admin-ui';
import { DataTableComponent, TableColumn } from '@nukkadnow/admin-data-table';
import { PlatformUserViewModel } from '../models/platform-users-view.model';

@Component({
  selector: 'admin-platform-users-list-page',
  standalone: true,
  imports: [CommonModule, PageHeaderComponent, DataTableComponent],
  templateUrl: './platform-users-list.page.html',
  styleUrls: ['./platform-users-list.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PlatformUsersListPageComponent implements OnInit {
  readonly store = inject(PlatformUsersStore);
  private readonly router = inject(Router);

  readonly tableColumns: TableColumn<PlatformUserViewModel>[] = [
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

  onRowClick(row: PlatformUserViewModel): void {
    this.router.navigate(['/platform-users', row.id]);
  }
}
