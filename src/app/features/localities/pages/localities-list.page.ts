import { Component, inject, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { LocalitiesStore } from '../state/localities.store';
import { PageHeaderComponent } from '@nukkadnow/admin-ui';
import { DataTableComponent, TableColumn } from '@nukkadnow/admin-data-table';
import { LocalityViewModel } from '../models/localities-view.model';

@Component({
  selector: 'admin-localities-list-page',
  standalone: true,
  imports: [CommonModule, PageHeaderComponent, DataTableComponent],
  templateUrl: './localities-list.page.html',
  styleUrls: ['./localities-list.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LocalitiesListPageComponent implements OnInit {
  readonly store = inject(LocalitiesStore);
  private readonly router = inject(Router);

  readonly tableColumns: TableColumn<LocalityViewModel>[] = [
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

  onRowClick(row: LocalityViewModel): void {
    this.router.navigate(['/localities', row.id]);
  }
}
