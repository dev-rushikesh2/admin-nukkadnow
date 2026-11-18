import { Component, OnInit, signal, inject, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PageHeaderComponent } from '@nukkadnow/admin-ui';
import { DataTableComponent, TableColumn } from '@nukkadnow/admin-data-table';
import { AdminApiClient, AdminEndpoints } from '@nukkadnow/admin-api-client';

export interface AuditTrailRow {
  id: string;
  action: string;
  targetEntity: string;
  targetId: string;
  operatorId: string;
  operatorName: string;
  reasonCode: string;
  justification: string;
  correlationId?: string;
  timestamp: string;
}

@Component({
  selector: 'admin-audit-logs-list-page',
  standalone: true,
  imports: [CommonModule, FormsModule, PageHeaderComponent, DataTableComponent],
  template: `
    <div class="audit-page-container">
      <admin-page-header
        title="Administrative Audit & Security Trail"
        subtitle="Immutable append-only log of high-privilege interventions and PII access."
        breadcrumb="Console / Governance / Audit Trail">
        <div actions>
          <button class="admin-btn btn-secondary btn-sm" (click)="loadLogs()">↻ Refresh</button>
        </div>
      </admin-page-header>

      <!-- Filter Controls Bar -->
      <div class="audit-filter-bar">
        <div class="search-box">
          <input
            type="text"
            class="admin-input"
            placeholder="Search by action, operator, target ID, or reason code..."
            [(ngModel)]="searchQuery"
            (ngModelChange)="applyFilter()">
        </div>

        <div class="category-pills">
          <button
            type="button"
            class="cat-pill"
            [class.active]="selectedCat === ''"
            (click)="setCategory('')">
            All Events
          </button>
          <button
            type="button"
            class="cat-pill"
            [class.active]="selectedCat === 'PII'"
            (click)="setCategory('PII')">
            PII Unmasks
          </button>
          <button
            type="button"
            class="cat-pill"
            [class.active]="selectedCat === 'FINANCIAL'"
            (click)="setCategory('FINANCIAL')">
            Financial & Refunds
          </button>
          <button
            type="button"
            class="cat-pill"
            [class.active]="selectedCat === 'SUSPENSION'"
            (click)="setCategory('SUSPENSION')">
            Suspensions
          </button>
        </div>
      </div>

      <!-- Audit Records Table -->
      <div class="table-card">
        <admin-data-table
          [columns]="tableColumns"
          [data]="filteredLogs()"
          [totalCount]="filteredLogs().length"
          [loading]="loading()">
        </admin-data-table>
      </div>
    </div>
  `,
  styles: [`
    .audit-page-container { display: flex; flex-direction: column; gap: 16px; }
    .audit-filter-bar {
      display: flex; justify-content: space-between; align-items: center; gap: 16px;
      background: var(--admin-bg-surface); border: 1px solid var(--admin-border-subtle);
      border-radius: var(--admin-radius-md); padding: 12px 16px; flex-wrap: wrap;
      box-shadow: var(--admin-shadow-sm);
    }
    .search-box { display: flex; align-items: center; gap: 8px; flex: 1; min-width: 260px; }
    .category-pills { display: flex; gap: 8px; flex-wrap: wrap; }
    .cat-pill {
      background: var(--admin-bg-subtle); border: 1px solid var(--admin-border-default);
      color: var(--admin-text-secondary); padding: 6px 12px; border-radius: var(--admin-radius-sm);
      font-size: 0.75rem; font-weight: 500; cursor: pointer; transition: all 0.15s ease;
      &:hover { background: var(--admin-bg-hover); color: var(--admin-text-primary); }
      &.active {
        background: var(--admin-primary-light);
        color: var(--admin-primary);
        border-color: var(--admin-primary);
        font-weight: 600;
      }
    }
    .table-card {
      background: var(--admin-bg-surface);
      border: 1px solid var(--admin-border-subtle);
      border-radius: var(--admin-radius-md);
      overflow: hidden;
      box-shadow: var(--admin-shadow-sm);
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuditLogsListPageComponent implements OnInit {
  private readonly api = inject(AdminApiClient);
  private readonly cdr = inject(ChangeDetectorRef);

  private rawLogs: AuditTrailRow[] = [];
  filteredLogs = signal<AuditTrailRow[]>([]);
  loading = signal<boolean>(false);

  searchQuery = '';
  selectedCat = '';

  readonly tableColumns: TableColumn<AuditTrailRow>[] = [
    { key: 'timestamp', header: 'Timestamp', width: '170px', sortable: true },
    { key: 'action', header: 'Security Action', width: '220px', sortable: true },
    { key: 'targetEntity', header: 'Entity', width: '130px' },
    { key: 'targetId', header: 'Target ID', width: '140px', sortable: true },
    { key: 'operatorName', header: 'Operator', width: '180px' },
    { key: 'reasonCode', header: 'Reason Code', width: '180px' },
    { key: 'justification', header: 'Justification / Context' },
  ];

  ngOnInit(): void {
    this.loadLogs();
  }

  loadLogs(): void {
    this.loading.set(true);
    this.api.getPaginated<AuditTrailRow>(AdminEndpoints.AUDIT_LOGS, {
      search: this.searchQuery || undefined,
    }).subscribe({
      next: (res) => {
        this.rawLogs = res.data?.items || [];
        this.applyFilter();
        this.loading.set(false);
        this.cdr.markForCheck();
      },
      error: () => {
        this.loading.set(false);
        this.cdr.markForCheck();
      },
    });
  }

  setCategory(cat: string): void {
    this.selectedCat = cat;
    this.applyFilter();
  }

  applyFilter(): void {
    let result = [...this.rawLogs];

    if (this.selectedCat === 'PII') {
      result = result.filter((l) => l.action.includes('PII'));
    } else if (this.selectedCat === 'FINANCIAL') {
      result = result.filter((l) => l.action.includes('REFUND') || l.action.includes('PAYMENT'));
    } else if (this.selectedCat === 'SUSPENSION') {
      result = result.filter((l) => l.action.includes('SUSPEND'));
    }

    if (this.searchQuery) {
      const q = this.searchQuery.toLowerCase();
      result = result.filter((l) =>
        l.action.toLowerCase().includes(q) ||
        l.operatorName.toLowerCase().includes(q) ||
        l.targetId.toLowerCase().includes(q) ||
        l.reasonCode.toLowerCase().includes(q)
      );
    }

    this.filteredLogs.set(result);
  }
}
