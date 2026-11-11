import { Component, inject, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AnalyticsStore } from '../state/analytics.store';
import { PageHeaderComponent } from '@nukkadnow/admin-ui';
import { DataTableComponent, TableColumn } from '@nukkadnow/admin-data-table';
import { PlatformAnalyticsViewModel } from '../models/analytics-view.model';

@Component({
  selector: 'admin-analytics-list-page',
  standalone: true,
  imports: [CommonModule, PageHeaderComponent, DataTableComponent],
  templateUrl: './analytics-list.page.html',
  styleUrls: ['./analytics-list.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AnalyticsListPageComponent implements OnInit {
  readonly store = inject(AnalyticsStore);
  private readonly router = inject(Router);

  readonly tableColumns: TableColumn<PlatformAnalyticsViewModel>[] = [
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

  onRowClick(row: PlatformAnalyticsViewModel): void {
    this.router.navigate(['/analytics', row.id]);
  }
}
