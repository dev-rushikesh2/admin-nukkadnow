import { Component, inject, OnInit, ChangeDetectionStrategy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PageHeaderComponent, BadgeComponent } from '@nukkadnow/admin-ui';
import { DataTableComponent, TableColumn } from '@nukkadnow/admin-data-table';

interface AuditTrailRow {
  id: string;
  action: string;
  targetEntity: string;
  targetId: string;
  operatorId: string;
  operatorName: string;
  reasonCode: string;
  justification: string;
  correlationId: string;
  timestamp: string;
}

@Component({
  selector: 'admin-audit-logs-list-page',
  standalone: true,
  imports: [CommonModule, FormsModule, PageHeaderComponent, BadgeComponent, DataTableComponent],
  template: `
    <div class="audit-page-container">
      <admin-page-header
        title="Immutable Platform Audit Trail & PII Access Log"
        subtitle="Append-only cryptographic compliance ledger recording all administrative mutations and PII access events"
        breadcrumb="Console / Governance / Audit Logs">
        <div actions>
          <span class="badge badge-security">Append-Only · 7-Year Retention</span>
          <button class="admin-btn btn-secondary btn-sm" (click)="loadLogs()">↻ Refresh</button>
        </div>
      </admin-page-header>

      <!-- Filter Controls -->
      <div class="audit-filter-bar">
        <div class="search-box">
          <span>🔍</span>
          <input
            type="text"
            class="admin-input"
            placeholder="Search action, operator, entity, or correlation ID..."
            [(ngModel)]="searchQuery"
            (ngModelChange)="applyFilter()">
        </div>

        <div class="category-pills">
          <button type="button" class="cat-pill" [class.active]="selectedCat === ''" (click)="setCategory('')">All Events</button>
          <button type="button" class="cat-pill" [class.active]="selectedCat === 'PII'" (click)="setCategory('PII')">PII Unmask Queries</button>
          <button type="button" class="cat-pill" [class.active]="selectedCat === 'FINANCIAL'" (click)="setCategory('FINANCIAL')">Financial Approvals</button>
          <button type="button" class="cat-pill" [class.active]="selectedCat === 'SUSPENSION'" (click)="setCategory('SUSPENSION')">Suspensions</button>
        </div>
      </div>

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
    }
    .search-box { display: flex; align-items: center; gap: 8px; flex: 1; min-width: 260px; }
    .category-pills { display: flex; gap: 8px; flex-wrap: wrap; }
    .cat-pill {
      background: var(--admin-bg-subtle); border: 1px solid var(--admin-border-default);
      color: var(--admin-text-secondary); padding: 6px 12px; border-radius: var(--admin-radius-sm);
      font-size: 0.75rem; cursor: pointer;
      &.active { background: rgba(244, 63, 94, 0.15); color: #f43f5e; border-color: rgba(244, 63, 94, 0.4); font-weight: 600; }
    }
    .table-card { background: var(--admin-bg-surface); border: 1px solid var(--admin-border-subtle); border-radius: var(--admin-radius-md); overflow: hidden; }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuditLogsListPageComponent implements OnInit {
  private rawLogs: AuditTrailRow[] = [
    {
      id: 'AUD-882190',
      action: 'MERCHANT_SUSPENDED',
      targetEntity: 'Merchant',
      targetId: 'MER-NGP-104',
      operatorId: 'operator-sa-001',
      operatorName: 'Rushi (Platform Architect)',
      reasonCode: 'SUSPECTED_FRAUD',
      justification: 'Inconsistent inventory logs and customer payment chargeback spike in Sitabuldi.',
      correlationId: '00-98f24a1b802a48b99-01',
      timestamp: '2026-11-11T16:35:00Z',
    },
    {
      id: 'AUD-882189',
      action: 'AUDIT_PII_UNMASK',
      targetEntity: 'Customer',
      targetId: 'CUST-8812',
      operatorId: 'operator-supp-04',
      operatorName: 'Ananya Support Lead',
      reasonCode: 'CUSTOMER_ESCALATION',
      justification: 'Customer unreachable at pickup counter; unmasked phone number for order handover.',
      correlationId: '00-33a8bc77121045da8-01',
      timestamp: '2026-11-11T16:22:00Z',
    },
    {
      id: 'AUD-882188',
      action: 'REFUND_SECOND_SIGN_DUAL_APPROVED',
      targetEntity: 'RefundDispute',
      targetId: 'REF-NGP-782',
      operatorId: 'operator-fin-02',
      operatorName: 'Vikram Finance Officer',
      reasonCode: 'HIGH_VALUE_REFUND_APPROVED',
      justification: 'Finance officer dual sign-off completed with Step-Up MFA for ₹7,500.',
      correlationId: '00-bb8299114829fa012-01',
      timestamp: '2026-11-11T15:10:00Z',
    },
    {
      id: 'AUD-882187',
      action: 'KYC_APPROVED',
      targetEntity: 'MerchantVerification',
      targetId: 'KYC-NGP-502',
      operatorId: 'operator-comp-01',
      operatorName: 'Sunita Compliance Lead',
      reasonCode: 'COMPLIANCE_CLEARANCE',
      justification: 'All FSSAI (11521054000888), GSTIN and Bank Penny-Drop documents verified.',
      correlationId: '00-fe7812aa9820bc331-01',
      timestamp: '2026-11-11T14:45:00Z',
    },
    {
      id: 'AUD-882186',
      action: 'FEATURE_FLAG_TOGGLED',
      targetEntity: 'FeatureFlag',
      targetId: 'locality.nagpur.weather_throttle',
      operatorId: 'operator-ops-03',
      operatorName: 'Manish Ops Dispatch',
      reasonCode: 'WEATHER_HAZARD',
      justification: 'Severe monsoon downpour in Dharampeth; slotted pickup times extended by 20m.',
      correlationId: '00-66a9821ef982aa009-01',
      timestamp: '2026-11-11T13:30:00Z',
    },
  ];

  filteredLogs = signal<AuditTrailRow[]>([]);
  loading = signal<boolean>(false);

  searchQuery = '';
  selectedCat = '';

  readonly tableColumns: TableColumn<AuditTrailRow>[] = [
    { key: 'timestamp', header: 'Timestamp (UTC)', width: '160px', sortable: true },
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
    setTimeout(() => {
      this.applyFilter();
      this.loading.set(false);
    }, 100);
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
