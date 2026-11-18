import { Component, inject, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { SystemHealthStore } from '../state/system-health.store';
import { PageHeaderComponent } from '@nukkadnow/admin-ui';
import { SystemHealthStatusChipComponent } from '../components/system-health-status-chip.component';

@Component({
  selector: 'admin-system-health-details-page',
  standalone: true,
  imports: [CommonModule, PageHeaderComponent, SystemHealthStatusChipComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="details-page-container">
      <admin-page-header
        [title]="'Node Telemetry: ' + (store.selectedItem()?.name || id)"
        subtitle="Process runtime metrics, container memory ceiling, and pool diagnostics"
        breadcrumb="Console / Platform Governance / System Health / Inspection">
        <div actions>
          <button class="admin-btn btn-secondary btn-sm" (click)="goBack()">← Back</button>
        </div>
      </admin-page-header>

      @if (store.selectedItem(); as node) {
        <div class="details-grid">
          <div class="details-card">
            <h3>Process Runtime Information</h3>
            <p><strong>Service Identifier:</strong> <span class="font-mono text-accent">{{ node.service }}</span></p>
            <p><strong>Node Health:</strong> <admin-system-health-status-chip [status]="node.status"></admin-system-health-status-chip></p>
            <p><strong>P95 Latency:</strong> <span class="font-mono">{{ node.latencyMs }} ms</span></p>
            <p><strong>CPU Load:</strong> {{ node.cpuUsagePct || 0 }}%</p>
            <p><strong>Memory Utilization:</strong> {{ node.memoryUsageMb || 0 }} MB</p>
            @if (node.port) {
              <p><strong>Binding Port:</strong> :{{ node.port }}</p>
            }
            <p><strong>Build Version:</strong> {{ node.version || '1.0.0' }}</p>
          </div>

          <div class="details-card">
            <h3>Diagnostics & Resilience</h3>
            <p><strong>Connection Pool:</strong> {{ node.activePoolConnections !== undefined ? node.activePoolConnections + ' active' : 'Managed Microservice Gateway' }}</p>
            <p><strong>Circuit Breaker:</strong> CLOSED (Normal Traffic Flow)</p>
            <p><strong>Dead Letter Queue:</strong> 0 pending messages</p>
            <p><strong>Last Telemetry Heartbeat:</strong> {{ node.createdAt | date:'medium' }}</p>
          </div>
        </div>
      }
    </div>
  `,
  styles: [`
    .details-page-container { display: flex; flex-direction: column; gap: 16px; }
    .details-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 16px; }
    .details-card {
      background: var(--admin-bg-surface);
      border: 1px solid var(--admin-border-subtle);
      border-radius: var(--admin-radius-md);
      padding: 20px;
      display: flex;
      flex-direction: column;
      gap: 10px;

      h3 { margin: 0 0 8px 0; color: var(--admin-text-primary); font-size: 1.0625rem; }
      p { margin: 0; color: var(--admin-text-secondary); font-size: 0.875rem; }
    }
  `]
})
export class SystemHealthDetailsPageComponent implements OnInit {
  readonly store = inject(SystemHealthStore);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  id = '';

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id') || '';
    if (this.id) {
      this.store.loadById(this.id);
    }
  }

  goBack(): void {
    this.router.navigate(['/system-health']);
  }
}
