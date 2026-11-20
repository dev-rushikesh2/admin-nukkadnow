import { Component, inject, OnInit, signal, computed, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { PaymentsStore } from '../state/payments.store';
import { PageHeaderComponent, BadgeComponent } from '@nukkadnow/admin-ui';
import { DataTableComponent, TableColumn } from '@nukkadnow/admin-data-table';
import { PaymentTransactionViewModel } from '../models/payments-view.model';
import { PaymentsStatusChipComponent } from '../components/payments-status-chip.component';
import { AdminSessionService } from '../../../core/auth/session.service';
import { AdminApiClient, AdminEndpoints, ApiResponse } from '@nukkadnow/admin-api-client';

export interface MerchantInvoiceItem {
  id: string;
  invoiceNumber: string;
  merchantId: string;
  merchantName: string;
  outletName: string;
  city: string;
  billingPeriod: string;
  invoiceDate: string;
  grossGmvPaise: number;
  grossGmvRupees: number;
  commissionPaise: number;
  commissionRupees: number;
  gstPaise: number;
  gstRupees: number;
  tcsPaise: number;
  tcsRupees: number;
  netPayablePaise: number;
  netPayableRupees: number;
  status: 'ISSUED' | 'PAID' | 'DISPUTED';
  paidAt?: string | null;
  pdfUrl: string;
}

export interface GstReportItem {
  id: string;
  period: string;
  monthName: string;
  state: string;
  stateCode: string;
  city: string;
  platformGstin: string;
  taxableSuppliesPaise: number;
  taxableSuppliesRupees: number;
  cgstPaise: number;
  cgstRupees: number;
  sgstPaise: number;
  sgstRupees: number;
  igstPaise: number;
  igstRupees: number;
  tcsCollectedPaise: number;
  tcsCollectedRupees: number;
  filingStatus: 'FILED' | 'READY_FOR_FILING' | 'PENDING';
  arnNumber?: string | null;
  filedAt?: string | null;
}

export interface GatewayFailureItem {
  id: string;
  orderId: string;
  city: string;
  gateway: string;
  paymentMethod: string;
  errorCode: string;
  errorMessage: string;
  httpStatusCode: number;
  retryCount: number;
  lastRetryAt: string;
  status: 'PENDING_RETRY' | 'RETRY_EXHAUSTED' | 'RESOLVED';
}

export interface FinancialAuditLogItem {
  id: string;
  timestamp: string;
  action: string;
  amountPaise: number;
  amountRupees: number;
  city: string;
  signers: string[];
  escrowReleaseBatchId: string;
  status: string;
  hash: string;
}

@Component({
  selector: 'admin-payments-list-page',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    PageHeaderComponent,
    BadgeComponent,
    DataTableComponent,
    PaymentsStatusChipComponent
  ],
  templateUrl: './payments-list.page.html',
  styleUrls: ['./payments-list.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PaymentsListPageComponent implements OnInit {
  readonly store = inject(PaymentsStore);
  private readonly router = inject(Router);
  readonly sessionService = inject(AdminSessionService);
  private readonly api = inject(AdminApiClient);

  readonly activeSubTab = signal<'LEDGER' | 'INVOICES' | 'GST_REPORTS' | 'GATEWAY_FAILURES' | 'FINANCIAL_AUDIT'>('LEDGER');
  readonly selectedCity = signal<string>('ALL');
  readonly selectedStatus = signal<string>('ALL');
  readonly selectedMethod = signal<string>('ALL');
  readonly searchQuery = signal<string>('');
  readonly isReplaying = signal<boolean>(false);
  readonly replaySuccessMsg = signal<string | null>(null);

  // Sprint 10 Reactive Collections
  readonly invoices = signal<MerchantInvoiceItem[]>([]);
  readonly gstReports = signal<GstReportItem[]>([]);
  readonly gatewayFailures = signal<GatewayFailureItem[]>([]);
  readonly financialAuditLogs = signal<FinancialAuditLogItem[]>([]);
  readonly isLoadingExtras = signal<boolean>(false);

  readonly filteredPayments = computed(() => {
    let list = this.store.items();
    const city = this.selectedCity();
    const status = this.selectedStatus();
    const method = this.selectedMethod();
    const query = this.searchQuery().toLowerCase().trim();

    const geo = this.sessionService.geoAssignment();
    if (geo?.cityName) {
      list = list.filter(p => p.city.toLowerCase() === geo.cityName.toLowerCase());
    } else if (city !== 'ALL') {
      list = list.filter(p => p.city.toLowerCase() === city.toLowerCase());
    }

    if (status !== 'ALL') {
      list = list.filter(p => p.status === status);
    }

    if (method !== 'ALL') {
      list = list.filter(p => p.paymentMethod === method);
    }

    if (query) {
      list = list.filter(p =>
        p.id.toLowerCase().includes(query) ||
        p.orderId.toLowerCase().includes(query) ||
        p.customerName.toLowerCase().includes(query) ||
        p.merchantName.toLowerCase().includes(query) ||
        p.gatewayRef.toLowerCase().includes(query)
      );
    }

    return list;
  });

  // Summary Metrics
  readonly totalVolumeFormatted = computed(() => {
    const list = this.filteredPayments();
    const totalPaise = list.reduce((acc, curr) => acc + (curr.amountPaise || 0), 0);
    return `₹${(totalPaise / 100).toLocaleString('en-IN', { minimumFractionDigits: 2 })}`;
  });

  readonly capturedCount = computed(() =>
    this.filteredPayments().filter(p => p.status === 'CAPTURED' || p.status === 'SETTLED').length
  );

  readonly escrowHoldingFormatted = computed(() => {
    const list = this.filteredPayments().filter(p => p.escrowStatus === 'PENDING_DELIVERY' || p.escrowStatus === 'HELD_DISPUTE');
    const totalPaise = list.reduce((acc, curr) => acc + (curr.amountPaise || 0), 0);
    return `₹${(totalPaise / 100).toLocaleString('en-IN', { minimumFractionDigits: 2 })}`;
  });

  readonly failedWebhooksCount = computed(() =>
    this.filteredPayments().filter(p => !p.webhookDelivered).length
  );

  readonly tableColumns: TableColumn<PaymentTransactionViewModel>[] = [
    { key: 'id', header: 'Transaction Ref', width: '160px', sortable: true },
    { key: 'orderId', header: 'Order ID', width: '150px', sortable: true },
    { key: 'merchantName', header: 'Merchant & Store', sortable: true },
    { key: 'amountFormatted', header: 'Amount', width: '130px', align: 'right', sortable: true },
    { key: 'paymentMethod', header: 'Gateway Method', width: '150px', align: 'center' },
    { key: 'escrowStatus', header: 'Escrow State', width: '150px', align: 'center' },
    { key: 'status', header: 'Payment State', width: '160px', sortable: true }
  ];

  ngOnInit(): void {
    const geo = this.sessionService.geoAssignment();
    if (geo?.cityName) {
      this.selectedCity.set(geo.cityName);
    }
    this.store.loadItems();
    this.loadSprint10Data();
  }

  loadSprint10Data(): void {
    const city = this.selectedCity();
    const params = city !== 'ALL' ? { city } : undefined;
    this.isLoadingExtras.set(true);

    this.api.get<any>(AdminEndpoints.FINANCE_INVOICES, params).subscribe({
      next: res => {
        const items = res?.data?.items || res?.data || [];
        this.invoices.set(items);
        this.isLoadingExtras.set(false);
      },
      error: () => this.isLoadingExtras.set(false)
    });

    this.api.get<any>(AdminEndpoints.FINANCE_GST_REPORTS, params).subscribe({
      next: res => {
        const items = res?.data?.items || res?.data || [];
        this.gstReports.set(items);
      }
    });

    this.api.get<any>(AdminEndpoints.FINANCE_GATEWAY_FAILURES, params).subscribe({
      next: res => {
        const items = res?.data?.items || res?.data || [];
        this.gatewayFailures.set(items);
      }
    });

    this.api.get<any>(AdminEndpoints.FINANCE_AUDIT_LOG, params).subscribe({
      next: res => {
        const items = res?.data?.items || res?.data || [];
        this.financialAuditLogs.set(items);
      }
    });
  }

  onCityChange(city: string): void {
    this.selectedCity.set(city);
    this.loadSprint10Data();
  }

  onStatusChange(status: string): void {
    this.selectedStatus.set(status);
  }

  onMethodChange(method: string): void {
    this.selectedMethod.set(method);
  }

  onSearchChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.searchQuery.set(input.value);
  }

  switchSubTab(tab: 'LEDGER' | 'INVOICES' | 'GST_REPORTS' | 'GATEWAY_FAILURES' | 'FINANCIAL_AUDIT'): void {
    this.activeSubTab.set(tab);
  }

  refresh(): void {
    this.store.loadItems();
    this.loadSprint10Data();
  }

  replayFailedWebhooks(): void {
    const failed = this.filteredPayments().filter(p => !p.webhookDelivered);
    if (failed.length === 0) return;

    this.isReplaying.set(true);
    let completed = 0;
    failed.forEach(f => {
      this.store.replayWebhook(f.id).subscribe({
        next: () => {
          completed++;
          if (completed >= failed.length) {
            this.isReplaying.set(false);
            this.replaySuccessMsg.set(`Replayed ${completed} webhook event(s) successfully.`);
            setTimeout(() => this.replaySuccessMsg.set(null), 4000);
          }
        },
        error: () => {
          this.isReplaying.set(false);
        }
      });
    });
  }

  retryFailure(failure: GatewayFailureItem): void {
    this.api.post<any>(AdminEndpoints.PAYMENT_WEBHOOK_REPLAY(failure.id), {}).subscribe({
      next: () => {
        failure.status = 'RESOLVED';
        this.gatewayFailures.update((list) => [...list]);
        this.replaySuccessMsg.set(`Initiated gateway retry for Order ${failure.orderId}. Replay triggered successfully.`);
        setTimeout(() => this.replaySuccessMsg.set(null), 4000);
      },
      error: (err) => {
        this.replaySuccessMsg.set(err?.error?.message || `Failed to replay webhook for Order ${failure.orderId}.`);
        setTimeout(() => this.replaySuccessMsg.set(null), 4000);
      }
    });
  }

  exportCsv(): void {
    const list = this.filteredPayments();
    if (list.length === 0) return;

    const headers = ['Txn ID', 'Order ID', 'Customer', 'Merchant', 'City', 'Locality', 'Amount (Paise)', 'Amount', 'Method', 'Gateway Ref', 'Escrow State', 'Status'];
    const rows = list.map(p => [
      `"${p.id}"`,
      `"${p.orderId}"`,
      `"${p.customerName}"`,
      `"${p.merchantName}"`,
      `"${p.city}"`,
      `"${p.locality}"`,
      p.amountPaise,
      `"${p.amountFormatted}"`,
      `"${p.paymentMethod}"`,
      `"${p.gatewayRef}"`,
      `"${p.escrowStatus}"`,
      `"${p.status}"`
    ]);

    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `nukkadnow-payments-${this.selectedCity().toLowerCase()}-${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(link.href);
  }

  downloadGstCsv(): void {
    const list = this.gstReports();
    if (list.length === 0) return;

    const headers = ['Report ID', 'Period', 'State', 'City', 'GSTIN', 'Taxable Supplies (Paise)', 'CGST (Paise)', 'SGST (Paise)', 'TCS Sec 52 (Paise)', 'Status', 'ARN'];
    const rows = list.map(r => [
      `"${r.id}"`,
      `"${r.period}"`,
      `"${r.state}"`,
      `"${r.city}"`,
      `"${r.platformGstin}"`,
      r.taxableSuppliesPaise,
      r.cgstPaise,
      r.sgstPaise,
      r.tcsCollectedPaise,
      `"${r.filingStatus}"`,
      `"${r.arnNumber || 'PENDING'}"`
    ]);

    const csvContent = [headers.join(','), ...rows.map(row => row.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `nukkadnow-gst-filings-mh-${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(link.href);
  }

  onRowClick(row: PaymentTransactionViewModel): void {
    this.router.navigate(['/payments', row.id]);
  }
}
