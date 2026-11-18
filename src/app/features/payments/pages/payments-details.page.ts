import { Component, inject, OnInit, signal, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { PaymentsStore } from '../state/payments.store';
import { PageHeaderComponent } from '@nukkadnow/admin-ui';
import { PaymentsStatusChipComponent } from '../components/payments-status-chip.component';
import { PaymentTransactionViewModel } from '../models/payments-view.model';

@Component({
  selector: 'admin-payments-details-page',
  standalone: true,
  imports: [CommonModule, FormsModule, PageHeaderComponent, PaymentsStatusChipComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="details-page-container">
      <admin-page-header
        [title]="'Transaction: ' + (store.selectedItem()?.id || id)"
        subtitle="Gateway reconciliation, escrow custody status, and sanitized webhook inspection"
        breadcrumb="Console / Financials & Payments / Transaction Inspection">
        <div actions>
          <button type="button" class="admin-btn btn-secondary btn-sm" (click)="goBack()">← Back to Ledger</button>
        </div>
      </admin-page-header>

      @if (store.selectedItem(); as item) {
        <div class="details-layout">
          <!-- Transaction Metadata -->
          <div class="details-card">
            <div class="card-head">
              <h3>Gateway Transaction Record</h3>
              <admin-payments-status-chip [status]="item.status"></admin-payments-status-chip>
            </div>
            <div class="spec-grid">
              <div class="spec-item">
                <span class="label">Transaction Ref ID</span>
                <span class="value font-mono">{{ item.id }}</span>
              </div>
              <div class="spec-item">
                <span class="label">Order Reference</span>
                <span class="value font-mono font-semibold">{{ item.orderId }}</span>
              </div>
              <div class="spec-item">
                <span class="label">Payer (Customer)</span>
                <span class="value">{{ item.customerName }}</span>
              </div>
              <div class="spec-item">
                <span class="label">Payee (Merchant)</span>
                <span class="value font-semibold">{{ item.merchantName }}</span>
              </div>
              <div class="spec-item">
                <span class="label">Municipal Jurisdiction</span>
                <span class="value">📍 {{ item.locality }}, {{ item.city }}</span>
              </div>
              <div class="spec-item">
                <span class="label">Gateway Method</span>
                <span class="value font-semibold">{{ item.paymentMethod }}</span>
              </div>
              <div class="spec-item">
                <span class="label">Gateway External Ref</span>
                <span class="value font-mono">{{ item.gatewayRef }}</span>
              </div>
              <div class="spec-item">
                <span class="label">Timestamp</span>
                <span class="value">{{ item.createdAt | date:'medium' }}</span>
              </div>
            </div>
          </div>

          <!-- Escrow Custody & Settlement -->
          <div class="details-card tuning-card">
            <div class="card-head">
              <h3>Escrow Custody & Merchant Payout</h3>
              <span class="badge" [class.badge-success]="item.escrowStatus === 'RELEASED'" [class.badge-warning]="item.escrowStatus === 'HELD_DISPUTE'">
                {{ item.escrowStatus }}
              </span>
            </div>

            <div class="financial-breakdown">
              <div class="fin-row">
                <span class="fin-lbl">Gross Order Inflow</span>
                <span class="fin-val font-semibold">{{ item.amountFormatted }}</span>
              </div>
              <div class="fin-row fee">
                <span class="fin-lbl">Platform Take-Rate Fee (5.0%)</span>
                <span class="fin-val font-mono">- ₹{{ ((item.amountPaise * 0.05) / 100).toFixed(2) }}</span>
              </div>
              <div class="fin-row fee">
                <span class="fin-lbl">Razorpay / UPI Gateway Fee (1.8% + GST)</span>
                <span class="fin-val font-mono">- ₹{{ ((item.amountPaise * 0.0212) / 100).toFixed(2) }}</span>
              </div>
              <div class="fin-row total">
                <span class="fin-lbl">Net Merchant Settled to Node Bank</span>
                <span class="fin-val font-bold">₹{{ ((item.amountPaise * 0.9288) / 100).toFixed(2) }}</span>
              </div>
            </div>

            <div class="escrow-actions">
              <div class="escrow-meta">
                <span>Release SLA: <strong>{{ item.escrowReleaseDate | date:'mediumDate' }}</strong></span>
                <span>Webhook Delivery: <strong>{{ item.webhookDelivered ? 'Delivered (HTTP 200)' : 'Failed / Pending Replay' }}</strong></span>
              </div>

              @if (item.escrowStatus !== 'RELEASED') {
                <div class="form-group">
                  <label>Audited Escrow Release Justification</label>
                  <input
                    type="text"
                    [(ngModel)]="escrowReason"
                    placeholder="e.g. Order delivered and customer dispute period cleared"
                    class="form-control" />
                </div>

                <button
                  type="button"
                  class="admin-btn btn-primary"
                  [disabled]="isReleasing()"
                  (click)="releaseEscrow(item.id)">
                  @if (isReleasing()) { Authorizing Release... } @else { Authorize Manual Escrow Release }
                </button>
              }

              @if (releaseSuccess()) {
                <div class="success-notice">
                  ✓ Escrow custody released. Settlement instructions dispatched to bank node.
                </div>
              }
            </div>
          </div>

          <!-- Sanitized Webhook Payload Inspector -->
          <div class="details-card full-span">
            <div class="card-head">
              <h3>Gateway Webhook Payload (Audit Trail)</h3>
              <button
                type="button"
                class="admin-btn btn-secondary btn-sm"
                [disabled]="isReplayingWebhook()"
                (click)="replayWebhook(item.id)">
                @if (isReplayingWebhook()) { Replaying... } @else { ↻ Re-Dispatch Gateway Webhook }
              </button>
            </div>

            <pre class="payload-box">{{ item.webhookPayloadSanitized | json }}</pre>
          </div>
        </div>
      }
    </div>
  `,
  styles: [`
    .details-page-container { display: flex; flex-direction: column; gap: 20px; }
    .details-layout {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 20px;

      @media (max-width: 960px) { grid-template-columns: 1fr; }
    }

    .details-card {
      background: var(--admin-bg-surface);
      border: 1px solid var(--admin-border-subtle);
      border-radius: var(--admin-radius-lg);
      padding: 22px;
      box-shadow: var(--admin-shadow-sm);
      display: flex;
      flex-direction: column;
      gap: 16px;

      &.full-span { grid-column: 1 / -1; }

      .card-head {
        display: flex;
        justify-content: space-between;
        align-items: center;

        h3 {
          margin: 0;
          font-size: 1.15rem;
          font-weight: 700;
          color: var(--admin-text-primary);
        }
      }
    }

    .spec-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;

      .spec-item {
        display: flex;
        flex-direction: column;
        gap: 4px;

        .label {
          font-size: 0.78rem;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: var(--admin-text-muted);
          font-weight: 600;
        }

        .value {
          font-size: 0.95rem;
          color: var(--admin-text-primary);
          &.font-mono { font-family: monospace; }
          &.font-semibold { font-weight: 600; }
        }
      }
    }

    .financial-breakdown {
      display: flex;
      flex-direction: column;
      gap: 8px;
      padding: 14px 18px;
      border: 1px solid var(--admin-border-subtle);
      border-radius: var(--admin-radius-md);
      background: var(--admin-bg-base);

      .fin-row {
        display: flex;
        justify-content: space-between;
        font-size: 0.88rem;
        color: var(--admin-text-secondary);

        &.fee { color: var(--admin-text-muted); font-size: 0.82rem; }
        &.total {
          padding-top: 8px;
          margin-top: 4px;
          border-top: 1px dashed var(--admin-border-subtle);
          font-size: 0.98rem;
          color: var(--admin-text-primary);
        }

        .font-mono { font-family: monospace; }
        .font-bold { font-weight: 700; color: #16a34a; }
      }
    }

    .escrow-actions {
      display: flex;
      flex-direction: column;
      gap: 14px;

      .escrow-meta {
        display: flex;
        justify-content: space-between;
        font-size: 0.82rem;
        color: var(--admin-text-muted);
      }

      .form-group {
        display: flex;
        flex-direction: column;
        gap: 6px;

        label {
          font-size: 0.82rem;
          font-weight: 600;
          color: var(--admin-text-secondary);
        }

        .form-control {
          padding: 8px 12px;
          border: 1px solid var(--admin-border-subtle);
          border-radius: var(--admin-radius-md);
          background: var(--admin-bg-base);
          color: var(--admin-text-primary);
          font-size: 0.88rem;
        }
      }

      .success-notice {
        padding: 10px 14px;
        background: rgba(22, 163, 74, 0.1);
        border: 1px solid rgba(22, 163, 74, 0.3);
        border-radius: var(--admin-radius-md);
        color: #16a34a;
        font-size: 0.85rem;
        font-weight: 500;
      }
    }

    .payload-box {
      margin: 0;
      padding: 16px;
      background: var(--admin-bg-base);
      border: 1px solid var(--admin-border-subtle);
      border-radius: var(--admin-radius-md);
      font-family: monospace;
      font-size: 0.82rem;
      color: var(--admin-text-primary);
      overflow-x: auto;
      max-height: 240px;
    }
  `]
})
export class PaymentsDetailsPageComponent implements OnInit {
  readonly store = inject(PaymentsStore);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  id = '';
  escrowReason = '';
  isReleasing = signal<boolean>(false);
  releaseSuccess = signal<boolean>(false);
  isReplayingWebhook = signal<boolean>(false);

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id') || '';
    if (this.id) {
      this.store.loadById(this.id);
    }
  }

  releaseEscrow(id: string): void {
    this.isReleasing.set(true);
    this.releaseSuccess.set(false);

    this.store.releaseEscrow(id, this.escrowReason || 'Compliance audit release').subscribe({
      next: () => {
        this.isReleasing.set(false);
        this.releaseSuccess.set(true);
        setTimeout(() => this.releaseSuccess.set(false), 4000);
      },
      error: () => {
        this.isReleasing.set(false);
      }
    });
  }

  replayWebhook(id: string): void {
    this.isReplayingWebhook.set(true);
    this.store.replayWebhook(id).subscribe({
      next: () => {
        this.isReplayingWebhook.set(false);
      },
      error: () => {
        this.isReplayingWebhook.set(false);
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/payments']);
  }
}
