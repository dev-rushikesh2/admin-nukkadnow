import { Component, inject, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { CategoriesStore } from '../state/categories.store';
import { PageHeaderComponent } from '@nukkadnow/admin-ui';
import { DataTableComponent, TableColumn } from '@nukkadnow/admin-data-table';
import { CategoryViewModel } from '../models/categories-view.model';

@Component({
  selector: 'admin-categories-list-page',
  standalone: true,
  imports: [CommonModule, PageHeaderComponent, DataTableComponent],
  templateUrl: './categories-list.page.html',
  styleUrls: ['./categories-list.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CategoriesListPageComponent implements OnInit {
  readonly store = inject(CategoriesStore);
  private readonly router = inject(Router);

  readonly tableColumns: TableColumn<CategoryViewModel>[] = [
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

  onRowClick(row: CategoryViewModel): void {
    this.router.navigate(['/categories', row.id]);
  }
}
