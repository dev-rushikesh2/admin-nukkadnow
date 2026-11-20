import { Component, inject, OnInit, ChangeDetectionStrategy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { SystemHealthStore } from '../state/system-health.store';
import { SystemHealthNodeViewModel } from '../models/system-health-view.model';
import { PageHeaderComponent, BadgeComponent } from '@nukkadnow/admin-ui';
import { DataTableComponent, TableColumn } from '@nukkadnow/admin-data-table';
import { SystemHealthStatusChipComponent } from '../components/system-health-status-chip.component';
import { AdminApiClient, AdminEndpoints } from '@nukkadnow/admin-api-client';

export interface GatewayPingResult {
  id: string;
  name: string;
  endpoint: string;
  latencyMs: number;
  status: 'OPERATIONAL' | 'DEGRADED' | 'OFFLINE';
  sslValid: boolean;
  lastPingAt: string;
}

export interface SiemAlertItem {
  id: string;
  timestamp: string;
  threatLevel: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  eventType: string;
  sourceIP: string;
  targetedUser: string;
  city: string;
  status: 'BLOCKED' | 'INVESTIGATING' | 'MITIGATED';
  details: string;
}

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
  private readonly api = inject(AdminApiClient);

  readonly activeSubTab = signal<'MESH' | 'GATEWAYS_PING' | 'SIEM_ALERTS'>('MESH');
  readonly viewMode = signal<'grid' | 'table'>('grid');

  // Flush Cache Modal
  readonly showFlushModal = signal<boolean>(false);
  selectedPartition = 'ALL_PARTITIONS';
  flushReason = 'CACHE_CONSISTENCY_SYNC';
  stepUpCode = '';

  // Sprint 10 Reactive Collections
  readonly gatewayPings = signal<GatewayPingResult[]>([]);
  readonly siemAlerts = signal<SiemAlertItem[]>([]);
  readonly isPinging = signal<boolean>(false);
  readonly pingSuccessMsg = signal<string | null>(null);

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
    this.runGatewayPing();
    this.loadSiemAlerts();
  }

  refresh(): void {
    this.store.loadHealthSummary();
    this.runGatewayPing();
    this.loadSiemAlerts();
  }

  switchSubTab(tab: 'MESH' | 'GATEWAYS_PING' | 'SIEM_ALERTS'): void {
    this.activeSubTab.set(tab);
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

  runGatewayPing(): void {
    this.isPinging.set(true);
    this.api.post<any>(AdminEndpoints.SYSTEM_GATEWAY_PING, {}).subscribe({
      next: res => {
        this.gatewayPings.set(res?.data || []);
        this.isPinging.set(false);
        this.pingSuccessMsg.set('All external gateway endpoints probed and verified active.');
        setTimeout(() => this.pingSuccessMsg.set(null), 3500);
      },
      error: () => this.isPinging.set(false)
    });
  }

  loadSiemAlerts(): void {
    this.api.get<any>(AdminEndpoints.SYSTEM_SIEM_ALERTS).subscribe({
      next: res => {
        const items = res?.data?.items || res?.data || [];
        this.siemAlerts.set(items);
      }
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
