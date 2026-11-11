import { Component, inject, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { SystemHealthStore } from '../state/system-health.store';
import { PageHeaderComponent } from '@nukkadnow/admin-ui';
import { DataTableComponent, TableColumn } from '@nukkadnow/admin-data-table';
import { SystemHealthNodeViewModel } from '../models/system-health-view.model';

@Component({
  selector: 'admin-system-health-list-page',
  standalone: true,
  imports: [CommonModule, PageHeaderComponent, DataTableComponent],
  templateUrl: './system-health-list.page.html',
  styleUrls: ['./system-health-list.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SystemHealthListPageComponent implements OnInit {
  readonly store = inject(SystemHealthStore);
  private readonly router = inject(Router);

  readonly tableColumns: TableColumn<SystemHealthNodeViewModel>[] = [
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

  onRowClick(row: SystemHealthNodeViewModel): void {
    this.router.navigate(['/system-health', row.id]);
  }
}
