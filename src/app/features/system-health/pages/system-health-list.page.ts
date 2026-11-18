import { Component, inject, OnInit, ChangeDetectionStrategy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { SystemHealthStore } from '../state/system-health.store';
import { SystemHealthNodeViewModel } from '../models/system-health-view.model';
import { PageHeaderComponent, BadgeComponent } from '@nukkadnow/admin-ui';
import { DataTableComponent, TableColumn } from '@nukkadnow/admin-data-table';
import { SystemHealthStatusChipComponent } from '../components/system-health-status-chip.component';

@Component({
  selector: 'admin-system-health-list-page',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    PageHeaderComponent,
    BadgeComponent,
    DataTableComponent,
    SystemHealthStatusChipComponent,
  ],
  templateUrl: './system-health-list.page.html',
  styleUrls: ['./system-health-list.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SystemHealthListPageComponent implements OnInit {
  readonly store = inject(SystemHealthStore);
  private readonly router = inject(Router);

  viewMode = signal<'grid' | 'table'>('grid');

  // Flush Cache Modal
  showFlushModal = signal<boolean>(false);
  selectedPartition = 'ALL_PARTITIONS';
  flushReason = 'CACHE_CONSISTENCY_SYNC';
  stepUpCode = '';

  readonly tableColumns: TableColumn<SystemHealthNodeViewModel>[] = [
    { key: 'service', header: 'Microservice / Node', width: '220px', sortable: true },
    { key: 'status', header: 'Health Status', width: '150px', sortable: true },
    { key: 'latencyMs', header: 'P95 Latency', width: '130px', sortable: true },
    { key: 'cpuUsagePct', header: 'CPU Load', width: '130px', sortable: true },
    { key: 'memoryUsageMb', header: 'Memory Util', width: '140px', sortable: true },
    { key: 'port', header: 'Port / Cluster', width: '140px', sortable: true },
  ];

  ngOnInit(): void {
    this.store.loadHealthSummary();
  }

  refresh(): void {
    this.store.loadHealthSummary();
  }

  toggleView(mode: 'grid' | 'table'): void {
    this.viewMode.set(mode);
  }

  onRowClick(row: SystemHealthNodeViewModel): void {
    this.router.navigate(['/system-health', row.id || row.service]);
  }

  openFlushModal(): void {
    this.stepUpCode = '';
    this.showFlushModal.set(true);
  }

  closeFlushModal(): void {
    this.showFlushModal.set(false);
  }

  confirmFlushCache(): void {
    this.store.flushCache(this.selectedPartition, this.flushReason).subscribe(() => {
      this.closeFlushModal();
    });
  }

  exportRecords(): void {
    const nodes = this.store.items();
    if (!nodes.length) return;

    const headers = ['Service', 'Status', 'P95LatencyMs', 'CPULoadPct', 'MemoryMB', 'Port', 'Version'];
    const rows = nodes.map(n => [
      n.service,
      n.status,
      n.latencyMs,
      `${n.cpuUsagePct || 0}%`,
      `${n.memoryUsageMb || 0} MB`,
      n.port || 'N/A',
      n.version || '1.0.0',
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `nukkadnow-system-health-${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}
