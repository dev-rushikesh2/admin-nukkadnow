import { Component, inject, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { OutletsStore } from '../state/outlets.store';
import { PageHeaderComponent } from '@nukkadnow/admin-ui';
import { DataTableComponent, TableColumn } from '@nukkadnow/admin-data-table';
import { OutletViewModel } from '../models/outlets-view.model';

@Component({
  selector: 'admin-outlets-list-page',
  standalone: true,
  imports: [CommonModule, PageHeaderComponent, DataTableComponent],
  templateUrl: './outlets-list.page.html',
  styleUrls: ['./outlets-list.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OutletsListPageComponent implements OnInit {
  readonly store = inject(OutletsStore);
  private readonly router = inject(Router);

  readonly tableColumns: TableColumn<OutletViewModel>[] = [
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

  onRowClick(row: OutletViewModel): void {
    this.router.navigate(['/outlets', row.id]);
  }
}
