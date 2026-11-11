import { Component, inject, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthenticationStore } from '../state/authentication.store';
import { PageHeaderComponent } from '@nukkadnow/admin-ui';
import { DataTableComponent, TableColumn } from '@nukkadnow/admin-data-table';
import { AuthenticationViewModel } from '../models/authentication-view.model';

@Component({
  selector: 'admin-authentication-list-page',
  standalone: true,
  imports: [CommonModule, PageHeaderComponent, DataTableComponent],
  templateUrl: './authentication-list.page.html',
  styleUrls: ['./authentication-list.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AuthenticationListPageComponent implements OnInit {
  readonly store = inject(AuthenticationStore);
  private readonly router = inject(Router);

  readonly tableColumns: TableColumn<AuthenticationViewModel>[] = [
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

  onRowClick(row: AuthenticationViewModel): void {
    this.router.navigate(['/authentication', row.id]);
  }
}
