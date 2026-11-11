import { Component, inject, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { SupportTicketsStore } from '../state/support-tickets.store';
import { PageHeaderComponent } from '@nukkadnow/admin-ui';
import { DataTableComponent, TableColumn } from '@nukkadnow/admin-data-table';
import { SupportTicketViewModel } from '../models/support-tickets-view.model';

@Component({
  selector: 'admin-support-tickets-list-page',
  standalone: true,
  imports: [CommonModule, PageHeaderComponent, DataTableComponent],
  templateUrl: './support-tickets-list.page.html',
  styleUrls: ['./support-tickets-list.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SupportTicketsListPageComponent implements OnInit {
  readonly store = inject(SupportTicketsStore);
  private readonly router = inject(Router);

  readonly tableColumns: TableColumn<SupportTicketViewModel>[] = [
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

  onRowClick(row: SupportTicketViewModel): void {
    this.router.navigate(['/support-tickets', row.id]);
  }
}
