import { Component, inject, OnInit, signal, computed, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { SupportTicketsStore } from '../state/support-tickets.store';
import { PageHeaderComponent } from '@nukkadnow/admin-ui';
import { DataTableComponent, TableColumn } from '@nukkadnow/admin-data-table';
import { SupportTicketViewModel } from '../models/support-tickets-view.model';
import { SupportTicketsStatusChipComponent } from '../components/support-tickets-status-chip.component';
import { AdminSessionService } from '../../../core/auth/session.service';

@Component({
  selector: 'admin-support-tickets-list-page',
  standalone: true,
  imports: [CommonModule, FormsModule, PageHeaderComponent, DataTableComponent, SupportTicketsStatusChipComponent],
  templateUrl: './support-tickets-list.page.html',
  styleUrls: ['./support-tickets-list.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SupportTicketsListPageComponent implements OnInit {
  readonly store = inject(SupportTicketsStore);
  private readonly router = inject(Router);
  readonly sessionService = inject(AdminSessionService);

  readonly selectedCity = signal<string>('ALL');
  readonly selectedStatus = signal<string>('ALL');
  readonly selectedPriority = signal<string>('ALL');
  readonly searchQuery = signal<string>('');

  readonly filteredTickets = computed(() => {
    let list = this.store.items();
    const city = this.selectedCity();
    const status = this.selectedStatus();
    const priority = this.selectedPriority();
    const query = this.searchQuery().toLowerCase().trim();

    const geo = this.sessionService.geoAssignment();
    if (geo?.cityName) {
      list = list.filter(t => t.city.toLowerCase() === geo.cityName.toLowerCase());
    } else if (city !== 'ALL') {
      list = list.filter(t => t.city.toLowerCase() === city.toLowerCase());
    }

    if (status !== 'ALL') {
      list = list.filter(t => t.status === status);
    }

    if (priority !== 'ALL') {
      list = list.filter(t => t.priority === priority);
    }

    if (query) {
      list = list.filter(t =>
        t.id.toLowerCase().includes(query) ||
        t.ticketNumber.toLowerCase().includes(query) ||
        t.subject.toLowerCase().includes(query) ||
        t.requesterName.toLowerCase().includes(query) ||
        t.requesterPhone.includes(query) ||
        (t.linkedOrderId && t.linkedOrderId.toLowerCase().includes(query))
      );
    }

    return list;
  });

  // Summary Metrics
  readonly openCount = computed(() =>
    this.filteredTickets().filter(t => t.status === 'OPEN' || t.status === 'INVESTIGATING').length
  );

  readonly slaBreachedCount = computed(() =>
    this.filteredTickets().filter(t => t.isSlaBreached).length
  );

  readonly p1UrgentCount = computed(() =>
    this.filteredTickets().filter(t => t.priority === 'URGENT_P1' && t.status !== 'RESOLVED' && t.status !== 'CLOSED').length
  );

  readonly tableColumns: TableColumn<SupportTicketViewModel>[] = [
    { key: 'ticketNumber', header: 'Ticket Ref', width: '150px', sortable: true },
    { key: 'subject', header: 'Subject & Incident', sortable: true },
    { key: 'requesterName', header: 'Requester (Customer / Merchant)', width: '220px', sortable: true },
    { key: 'priority', header: 'Priority Level', width: '140px', align: 'center', sortable: true },
    { key: 'locality', header: 'Territory', width: '150px', sortable: true },
    { key: 'assignedAgentName', header: 'Assigned Staff', width: '180px' },
    { key: 'status', header: 'Resolution State', width: '170px', sortable: true }
  ];

  ngOnInit(): void {
    const geo = this.sessionService.geoAssignment();
    if (geo?.cityName) {
      this.selectedCity.set(geo.cityName);
    }
    this.store.loadItems();
  }

  onCityChange(city: string): void {
    this.selectedCity.set(city);
  }

  onStatusChange(status: string): void {
    this.selectedStatus.set(status);
  }

  onPriorityChange(priority: string): void {
    this.selectedPriority.set(priority);
  }

  onSearchChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.searchQuery.set(input.value);
  }

  refresh(): void {
    this.store.loadItems();
  }

  exportCsv(): void {
    const list = this.filteredTickets();
    if (list.length === 0) return;

    const headers = ['Ticket Number', 'Subject', 'Category', 'Priority', 'Requester', 'Phone', 'City', 'Locality', 'Agent', 'Linked Order', 'Status'];
    const rows = list.map(t => [
      `"${t.ticketNumber}"`,
      `"${t.subject}"`,
      `"${t.category}"`,
      `"${t.priority}"`,
      `"${t.requesterName}"`,
      `"${t.requesterPhone}"`,
      `"${t.city}"`,
      `"${t.locality}"`,
      `"${t.assignedAgentName}"`,
      `"${t.linkedOrderId || 'N/A'}"`,
      `"${t.status}"`
    ]);

    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `nukkadnow-support-tickets-${this.selectedCity().toLowerCase()}-${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(link.href);
  }

  onRowClick(row: SupportTicketViewModel): void {
    this.router.navigate(['/support-tickets', row.id]);
  }
}
