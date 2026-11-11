import fs from 'node:fs';
import path from 'node:path';

const features = [
  {
    name: 'authentication',
    title: 'Authentication & Access Control',
    entity: 'Authentication',
    hasListDetails: false,
    custom: true
  },
  {
    name: 'overview',
    title: 'Command Center Overview',
    entity: 'OverviewMetric',
    desc: 'Platform GMV, active sellers, order throughput and real-time operational status'
  },
  {
    name: 'merchants',
    title: 'Merchants Directory',
    entity: 'Merchant',
    desc: 'Registered seller organizations, profiles, operational status and lifecycle management'
  },
  {
    name: 'merchant-verification',
    title: 'Merchant KYC Verification Queue',
    entity: 'MerchantVerification',
    desc: 'Government KYC, FSSAI food licenses, GSTIN, and bank account penny-drop audits'
  },
  {
    name: 'outlets',
    title: 'Outlets & Geofences',
    entity: 'Outlet',
    desc: 'Physical merchant outlets, operating hours, capacity rules and Nagpur locality geofences'
  },
  {
    name: 'localities',
    title: 'Localities & Delivery Zones',
    entity: 'Locality',
    desc: 'Nagpur micro-markets, zones, pincode maps and service boundary polygons'
  },
  {
    name: 'categories',
    title: 'Category Taxonomy',
    entity: 'Category',
    desc: 'Hyperlocal marketplace product taxonomy, commission rates and regulatory classifications'
  },
  {
    name: 'catalogue-moderation',
    title: 'Catalog Moderation Queue',
    entity: 'CatalogItem',
    desc: 'Product audit, price sanity verification, prohibited goods alerts and takedown controls'
  },
  {
    name: 'orders',
    title: 'Live Orders Stream',
    entity: 'AdminOrder',
    desc: 'Global real-time order stream, fulfillment monitoring and emergency override cancellations'
  },
  {
    name: 'payments',
    title: 'Payments & Settlement Ledgers',
    entity: 'PaymentTransaction',
    desc: 'Payment gateway intents, escrow settlements, and failed PSP webhook replay tooling'
  },
  {
    name: 'refunds-disputes',
    title: 'Refunds & Disputes Ledger',
    entity: 'RefundDispute',
    desc: 'Customer refund requests, dual-approval authorization ledger and chargeback investigations'
  },
  {
    name: 'subscriptions',
    title: 'Merchant SaaS Subscriptions',
    entity: 'MerchantSubscription',
    desc: 'Merchant subscription lifecycles, billing schedules, and manual exception waivers'
  },
  {
    name: 'plans-pricing',
    title: 'Plans & Pricing Slabs',
    entity: 'PricingPlan',
    desc: 'SaaS tier definitions, transaction fee matrices, and pilot locality introductory offers'
  },
  {
    name: 'support-tickets',
    title: 'Support & Helpdesk Tickets',
    entity: 'SupportTicket',
    desc: 'Customer and merchant support cases, SLA breach monitoring and ticket assignment'
  },
  {
    name: 'reviews-moderation',
    title: 'Reviews Moderation',
    entity: 'ReviewModeration',
    desc: 'Ratings inspection, spam detection, merchant dispute rebuttals and review visibility'
  },
  {
    name: 'notifications',
    title: 'Broadcasts & Notifications',
    entity: 'BroadcastNotification',
    desc: 'Platform-wide announcements, emergency notices, SMS/WhatsApp delivery logs'
  },
  {
    name: 'analytics',
    title: 'Analytics & Heatmaps',
    entity: 'PlatformAnalytics',
    desc: 'Executive GMV reports, merchant cohort retention and Nagpur locality order density'
  },
  {
    name: 'platform-users',
    title: 'Platform Operators',
    entity: 'PlatformUser',
    desc: 'Administrative staff directory, role assignments, MFA enforcement and session revocation'
  },
  {
    name: 'roles-permissions',
    title: 'Roles & RBAC Matrix',
    entity: 'RolePermission',
    desc: 'Granular administrative permission policies, role definitions and privilege elevation rules'
  },
  {
    name: 'feature-flags',
    title: 'Feature Flags & Circuit Breakers',
    entity: 'FeatureFlag',
    desc: 'Runtime canary flags, locality kill-switches and payment gateway failover toggles'
  },
  {
    name: 'system-health',
    title: 'System Health & Telemetry',
    entity: 'SystemHealthNode',
    desc: 'Microservice mesh status, Redis memory usage, RabbitMQ queue lag and database pools'
  },
  {
    name: 'audit-logs',
    title: 'Immutable Audit Trail',
    entity: 'AuditLogRecord',
    desc: 'Cryptographic immutable operator activity trail, PII unmask queries and security events'
  },
  {
    name: 'settings',
    title: 'Platform Settings & Policies',
    entity: 'PlatformSetting',
    desc: 'Platform maintenance mode, security timeouts, IP whitelisting and compliance defaults'
  }
];

function toPascal(str) {
  return str.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join('');
}

function toCamel(str) {
  const p = toPascal(str);
  return p.charAt(0).toLowerCase() + p.slice(1);
}

const baseDir = path.resolve('src/app/features');

for (const f of features) {
  const featureDir = path.join(baseDir, f.name);
  fs.mkdirSync(path.join(featureDir, 'pages'), { recursive: true });
  fs.mkdirSync(path.join(featureDir, 'components'), { recursive: true });
  fs.mkdirSync(path.join(featureDir, 'data-access'), { recursive: true });
  fs.mkdirSync(path.join(featureDir, 'state'), { recursive: true });
  fs.mkdirSync(path.join(featureDir, 'models'), { recursive: true });
  fs.mkdirSync(path.join(featureDir, 'utils'), { recursive: true });

  const pascal = toPascal(f.name);
  const camel = toCamel(f.name);
  const entity = f.entity;

  // 1. Model
  const modelContent = `export interface ${entity}ViewModel {
  id: string;
  name?: string;
  title?: string;
  status: string;
  createdAt: string;
  updatedAt?: string;
  metadata?: Record<string, unknown>;
}

export interface ${entity}FilterCriteria {
  search?: string;
  status?: string;
  page?: number;
  limit?: number;
}
`;
  fs.writeFileSync(path.join(featureDir, 'models', `${f.name}-view.model.ts`), modelContent);

  // 2. Utils
  const utilsContent = `import { ${entity}ViewModel } from '../models/${f.name}-view.model';

export function format${entity}Status(status: string): { label: string; variant: 'success' | 'warning' | 'danger' | 'info' | 'neutral' } {
  switch (status.toUpperCase()) {
    case 'ACTIVE':
    case 'VERIFIED':
    case 'CONFIRMED':
    case 'SUCCESS':
    case 'HEALTHY':
      return { label: status, variant: 'success' };
    case 'PENDING':
    case 'REVIEW':
    case 'PROCESSING':
    case 'IN_PROGRESS':
      return { label: status, variant: 'warning' };
    case 'SUSPENDED':
    case 'REJECTED':
    case 'FAILED':
    case 'CANCELLED':
    case 'DEGRADED':
      return { label: status, variant: 'danger' };
    default:
      return { label: status, variant: 'neutral' };
  }
}
`;
  fs.writeFileSync(path.join(featureDir, 'utils', `${f.name}.utils.ts`), utilsContent);

  // 3. API
  const apiContent = `import { Injectable, inject } from '@angular/core';
import { Observable, of } from 'rxjs';
import { AdminApiClient, ApiResponse, PaginatedResult } from '@nukkadnow/admin-api-client';
import { ${entity}ViewModel, ${entity}FilterCriteria } from '../models/${f.name}-view.model';

@Injectable({
  providedIn: 'root'
})
export class ${pascal}Api {
  private readonly client = inject(AdminApiClient);
  private readonly endpoint = '/${f.name}';

  getItems(filters?: ${entity}FilterCriteria): Observable<ApiResponse<PaginatedResult<${entity}ViewModel>>> {
    return this.client.getPaginated<${entity}ViewModel>(this.endpoint, filters as any);
  }

  getById(id: string): Observable<ApiResponse<${entity}ViewModel>> {
    return this.client.get<${entity}ViewModel>(\`\${this.endpoint}/\${id}\`);
  }

  updateStatus(id: string, status: string, reasonCode?: string): Observable<ApiResponse<${entity}ViewModel>> {
    return this.client.patch<${entity}ViewModel>(\`\${this.endpoint}/\${id}/status\`, { status }, { reasonCode });
  }
}
`;
  fs.writeFileSync(path.join(featureDir, 'data-access', `${f.name}.api.ts`), apiContent);

  // 4. Mapper
  const mapperContent = `import { ${entity}ViewModel } from '../models/${f.name}-view.model';

export class ${pascal}Mapper {
  static toViewModel(dto: any): ${entity}ViewModel {
    return {
      id: dto.id || '',
      name: dto.name || dto.title || dto.businessName || dto.code || 'Record #' + dto.id,
      title: dto.title || dto.name || '',
      status: dto.status || 'ACTIVE',
      createdAt: dto.createdAt || new Date().toISOString(),
      updatedAt: dto.updatedAt,
      metadata: dto.metadata || {}
    };
  }
}
`;
  fs.writeFileSync(path.join(featureDir, 'data-access', `${f.name}.mapper.ts`), mapperContent);

  // 5. Repository
  const repoContent = `import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { ${pascal}Api } from './${f.name}.api';
import { ${pascal}Mapper } from './${f.name}.mapper';
import { ${entity}ViewModel, ${entity}FilterCriteria } from '../models/${f.name}-view.model';
import { PaginatedResult } from '@nukkadnow/admin-api-client';

@Injectable({
  providedIn: 'root'
})
export class ${pascal}Repository {
  private readonly api = inject(${pascal}Api);

  fetchItems(filters?: ${entity}FilterCriteria): Observable<PaginatedResult<${entity}ViewModel>> {
    return this.api.getItems(filters).pipe(
      map(res => ({
        ...res.data,
        items: res.data.items.map(${pascal}Mapper.toViewModel)
      }))
    );
  }

  fetchById(id: string): Observable<${entity}ViewModel> {
    return this.api.getById(id).pipe(map(res => ${pascal}Mapper.toViewModel(res.data)));
  }

  changeStatus(id: string, status: string, reasonCode?: string): Observable<${entity}ViewModel> {
    return this.api.updateStatus(id, status, reasonCode).pipe(map(res => ${pascal}Mapper.toViewModel(res.data)));
  }
}
`;
  fs.writeFileSync(path.join(featureDir, 'data-access', `${f.name}.repository.ts`), repoContent);

  // 6. Store
  const storeContent = `import { Injectable, signal, computed, inject } from '@angular/core';
import { ${pascal}Repository } from '../data-access/${f.name}.repository';
import { ${entity}ViewModel, ${entity}FilterCriteria } from '../models/${f.name}-view.model';

@Injectable({
  providedIn: 'root'
})
export class ${pascal}Store {
  private readonly repository = inject(${pascal}Repository);

  private readonly itemsState = signal<${entity}ViewModel[]>([]);
  private readonly selectedItemState = signal<${entity}ViewModel | null>(null);
  private readonly totalCountState = signal<number>(0);
  private readonly loadingState = signal<boolean>(false);
  private readonly errorState = signal<string | null>(null);

  readonly items = this.itemsState.asReadonly();
  readonly selectedItem = this.selectedItemState.asReadonly();
  readonly totalCount = this.totalCountState.asReadonly();
  readonly loading = this.loadingState.asReadonly();
  readonly error = this.errorState.asReadonly();

  loadItems(filters?: ${entity}FilterCriteria): void {
    this.loadingState.set(true);
    this.errorState.set(null);

    this.repository.fetchItems(filters).subscribe({
      next: (res) => {
        this.itemsState.set(res.items);
        this.totalCountState.set(res.total);
        this.loadingState.set(false);
      },
      error: (err) => {
        this.errorState.set(err?.message || 'Failed to load records');
        this.loadingState.set(false);
      }
    });
  }

  loadById(id: string): void {
    this.loadingState.set(true);
    this.repository.fetchById(id).subscribe({
      next: (item) => {
        this.selectedItemState.set(item);
        this.loadingState.set(false);
      },
      error: (err) => {
        this.errorState.set(err?.message || 'Failed to load record');
        this.loadingState.set(false);
      }
    });
  }
}
`;
  fs.writeFileSync(path.join(featureDir, 'state', `${f.name}.store.ts`), storeContent);

  // 7. Selectors
  const selectorsContent = `import { ${entity}ViewModel } from '../models/${f.name}-view.model';

export class ${pascal}Selectors {
  static filterByStatus(items: ${entity}ViewModel[], status: string): ${entity}ViewModel[] {
    return items.filter(item => item.status.toLowerCase() === status.toLowerCase());
  }
}
`;
  fs.writeFileSync(path.join(featureDir, 'state', `${f.name}.selectors.ts`), selectorsContent);

  // 8. Components: Card & Status Chip
  const cardContent = `import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ${entity}ViewModel } from '../models/${f.name}-view.model';
import { ${pascal}StatusChipComponent } from './${f.name}-status-chip.component';

@Component({
  selector: 'admin-${f.name}-card',
  standalone: true,
  imports: [CommonModule, ${pascal}StatusChipComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: \`
    <div class="feature-card" (click)="cardClick.emit(item)">
      <div class="card-header">
        <h4 class="card-title">{{ item.name || item.id }}</h4>
        <admin-${f.name}-status-chip [status]="item.status"></admin-${f.name}-status-chip>
      </div>
      <div class="card-body">
        <span class="card-id font-mono">ID: {{ item.id }}</span>
        <span class="card-date">{{ item.createdAt | date:'medium' }}</span>
      </div>
    </div>
  \`,
  styles: [\`
    .feature-card {
      background: var(--admin-bg-surface);
      border: 1px solid var(--admin-border-subtle);
      border-radius: var(--admin-radius-md);
      padding: 16px;
      cursor: pointer;
      transition: all 0.15s ease;
      &:hover { border-color: var(--admin-border-default); transform: translateY(-1px); }
    }
    .card-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px; }
    .card-title { margin: 0; font-size: 0.95rem; font-weight: 600; color: var(--admin-text-primary); }
    .card-body { display: flex; justify-content: space-between; font-size: 0.75rem; color: var(--admin-text-muted); }
  \`]
})
export class ${pascal}CardComponent {
  @Input({ required: true }) item!: ${entity}ViewModel;
  @Output() cardClick = new EventEmitter<${entity}ViewModel>();
}
`;
  fs.writeFileSync(path.join(featureDir, 'components', `${f.name}-card.component.ts`), cardContent);

  const statusChipContent = `import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { format${entity}Status } from '../utils/${f.name}.utils';

@Component({
  selector: 'admin-${f.name}-status-chip',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: \`
    <span class="badge" [ngClass]="'badge-' + statusMeta().variant">
      {{ statusMeta().label }}
    </span>
  \`
})
export class ${pascal}StatusChipComponent {
  @Input({ required: true }) status!: string;

  statusMeta() {
    return format${entity}Status(this.status);
  }
}
`;
  fs.writeFileSync(path.join(featureDir, 'components', `${f.name}-status-chip.component.ts`), statusChipContent);

  // 9. Pages: List & Details
  const listPageHtml = `<div class="${f.name}-page-container">
  <admin-page-header
    title="${f.title}"
    subtitle="${f.desc || 'Manage and monitor platform records'}"
    breadcrumb="Console / ${f.title}">
    <div actions>
      <button class="admin-btn btn-secondary btn-sm" (click)="refresh()">↻ Refresh</button>
      <button class="admin-btn btn-primary btn-sm" (click)="exportRecords()">Export CSV</button>
    </div>
  </admin-page-header>

  <admin-data-table
    [columns]="tableColumns"
    [data]="store.items()"
    [totalCount]="store.totalCount()"
    [loading]="store.loading()"
    (rowClick)="onRowClick($event)">
  </admin-data-table>
</div>
`;
  fs.writeFileSync(path.join(featureDir, 'pages', `${f.name}-list.page.html`), listPageHtml);

  const listPageScss = `.${f.name}-page-container {
  display: flex;
  flex-direction: column;
  gap: var(--admin-space-md);
}
`;
  fs.writeFileSync(path.join(featureDir, 'pages', `${f.name}-list.page.scss`), listPageScss);

  const listPageTs = `import { Component, inject, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ${pascal}Store } from '../state/${f.name}.store';
import { PageHeaderComponent } from '@nukkadnow/admin-ui';
import { DataTableComponent, TableColumn } from '@nukkadnow/admin-data-table';
import { ${entity}ViewModel } from '../models/${f.name}-view.model';

@Component({
  selector: 'admin-${f.name}-list-page',
  standalone: true,
  imports: [CommonModule, PageHeaderComponent, DataTableComponent],
  templateUrl: './${f.name}-list.page.html',
  styleUrls: ['./${f.name}-list.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ${pascal}ListPageComponent implements OnInit {
  readonly store = inject(${pascal}Store);
  private readonly router = inject(Router);

  readonly tableColumns: TableColumn<${entity}ViewModel>[] = [
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

  onRowClick(row: ${entity}ViewModel): void {
    this.router.navigate(['/${f.name}', row.id]);
  }
}
`;
  fs.writeFileSync(path.join(featureDir, 'pages', `${f.name}-list.page.ts`), listPageTs);

  const detailsPageTs = `import { Component, inject, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ${pascal}Store } from '../state/${f.name}.store';
import { PageHeaderComponent } from '@nukkadnow/admin-ui';
import { ${pascal}StatusChipComponent } from '../components/${f.name}-status-chip.component';

@Component({
  selector: 'admin-${f.name}-details-page',
  standalone: true,
  imports: [CommonModule, PageHeaderComponent, ${pascal}StatusChipComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: \`
    <div class="details-page-container">
      <admin-page-header
        [title]="'Details: ' + (store.selectedItem()?.name || id)"
        subtitle="Immutable inspection & operational management"
        breadcrumb="Console / ${f.title} / Inspection">
        <div actions>
          <button class="admin-btn btn-secondary btn-sm" (click)="goBack()">← Back</button>
        </div>
      </admin-page-header>

      @if (store.selectedItem(); as item) {
        <div class="details-grid">
          <div class="details-card">
            <h3>Record Metadata</h3>
            <p><strong>ID:</strong> <span class="font-mono">{{ item.id }}</span></p>
            <p><strong>Status:</strong> <admin-${f.name}-status-chip [status]="item.status"></admin-${f.name}-status-chip></p>
            <p><strong>Timestamp:</strong> {{ item.createdAt | date:'medium' }}</p>
          </div>
        </div>
      }
    </div>
  \`,
  styles: [\`
    .details-page-container { display: flex; flex-direction: column; gap: 16px; }
    .details-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 16px; }
    .details-card {
      background: var(--admin-bg-surface);
      border: 1px solid var(--admin-border-subtle);
      border-radius: var(--admin-radius-md);
      padding: 20px;
    }
  \`]
})
export class ${pascal}DetailsPageComponent implements OnInit {
  readonly store = inject(${pascal}Store);
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
    this.router.navigate(['/${f.name}']);
  }
}
`;
  fs.writeFileSync(path.join(featureDir, 'pages', `${f.name}-details.page.ts`), detailsPageTs);

  // 10. Routes
  const routesContent = `import { Routes } from '@angular/router';
import { ${pascal}ListPageComponent } from './pages/${f.name}-list.page';
import { ${pascal}DetailsPageComponent } from './pages/${f.name}-details.page';

export const ${camel}Routes: Routes = [
  {
    path: '',
    component: ${pascal}ListPageComponent
  },
  {
    path: ':id',
    component: ${pascal}DetailsPageComponent
  }
];
`;
  fs.writeFileSync(path.join(featureDir, `${f.name}.routes.ts`), routesContent);

  // 11. Spec
  const specContent = `import { ${pascal}Store } from './state/${f.name}.store';
import { ${pascal}Repository } from './data-access/${f.name}.repository';

describe('${pascal} Feature', () => {
  it('should be defined', () => {
    expect(${pascal}Store).toBeDefined();
    expect(${pascal}Repository).toBeDefined();
  });
});
`;
  fs.writeFileSync(path.join(featureDir, `${f.name}.spec.ts`), specContent);

  // 12. Barrel index.ts
  const indexContent = `export * from './models/${f.name}-view.model';
export * from './data-access/${f.name}.api';
export * from './data-access/${f.name}.repository';
export * from './state/${f.name}.store';
export * from './components/${f.name}-card.component';
export * from './components/${f.name}-status-chip.component';
export * from './${f.name}.routes';
`;
  fs.writeFileSync(path.join(featureDir, 'index.ts'), indexContent);

  console.log(`✅ Feature scaffolded: ${f.name}`);
}

console.log('🎉 All 23 features scaffolded successfully according to DDD Clean Architecture!');
