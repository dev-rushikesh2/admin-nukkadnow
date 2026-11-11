import { Component, inject, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { CatalogueModerationStore } from '../state/catalogue-moderation.store';
import { PageHeaderComponent } from '@nukkadnow/admin-ui';
import { DataTableComponent, TableColumn } from '@nukkadnow/admin-data-table';
import { CatalogItemViewModel } from '../models/catalogue-moderation-view.model';

@Component({
  selector: 'admin-catalogue-moderation-list-page',
  standalone: true,
  imports: [CommonModule, PageHeaderComponent, DataTableComponent],
  templateUrl: './catalogue-moderation-list.page.html',
  styleUrls: ['./catalogue-moderation-list.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CatalogueModerationListPageComponent implements OnInit {
  readonly store = inject(CatalogueModerationStore);
  private readonly router = inject(Router);

  readonly tableColumns: TableColumn<CatalogItemViewModel>[] = [
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

  onRowClick(row: CatalogItemViewModel): void {
    this.router.navigate(['/catalogue-moderation', row.id]);
  }
}
