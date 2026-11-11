import { Component, inject, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { RolesPermissionsStore } from '../state/roles-permissions.store';
import { PageHeaderComponent } from '@nukkadnow/admin-ui';
import { DataTableComponent, TableColumn } from '@nukkadnow/admin-data-table';
import { RolePermissionViewModel } from '../models/roles-permissions-view.model';

@Component({
  selector: 'admin-roles-permissions-list-page',
  standalone: true,
  imports: [CommonModule, PageHeaderComponent, DataTableComponent],
  templateUrl: './roles-permissions-list.page.html',
  styleUrls: ['./roles-permissions-list.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RolesPermissionsListPageComponent implements OnInit {
  readonly store = inject(RolesPermissionsStore);
  private readonly router = inject(Router);

  readonly tableColumns: TableColumn<RolePermissionViewModel>[] = [
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

  onRowClick(row: RolePermissionViewModel): void {
    this.router.navigate(['/roles-permissions', row.id]);
  }
}
