import { Component, inject, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { SettingsStore } from '../state/settings.store';
import { PageHeaderComponent } from '@nukkadnow/admin-ui';
import { DataTableComponent, TableColumn } from '@nukkadnow/admin-data-table';
import { PlatformSettingViewModel } from '../models/settings-view.model';

@Component({
  selector: 'admin-settings-list-page',
  standalone: true,
  imports: [CommonModule, PageHeaderComponent, DataTableComponent],
  templateUrl: './settings-list.page.html',
  styleUrls: ['./settings-list.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SettingsListPageComponent implements OnInit {
  readonly store = inject(SettingsStore);
  private readonly router = inject(Router);

  readonly tableColumns: TableColumn<PlatformSettingViewModel>[] = [
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

  onRowClick(row: PlatformSettingViewModel): void {
    this.router.navigate(['/settings', row.id]);
  }
}
