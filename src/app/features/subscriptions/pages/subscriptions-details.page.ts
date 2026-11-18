import { Component, inject, OnInit, signal, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { SubscriptionsStore } from '../state/subscriptions.store';
import { PageHeaderComponent } from '@nukkadnow/admin-ui';
import { SubscriptionsStatusChipComponent } from '../components/subscriptions-status-chip.component';
import { MerchantSubscriptionViewModel } from '../models/subscriptions-view.model';

@Component({
  selector: 'admin-subscriptions-details-page',
  standalone: true,
  imports: [CommonModule, FormsModule, PageHeaderComponent, SubscriptionsStatusChipComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="details-page-container">
      <admin-page-header
        [title]="'Subscription: ' + (store.selectedItem()?.merchantName || id)"
        subtitle="Software tier entitlements, recurring invoices, and retention grace period extensions"
        breadcrumb="Console / Financials & Subscriptions / Subscription Inspection">
        <div actions>
          <button type="button" class="admin-btn btn-secondary btn-sm" (click)="goBack()">← Back to Subscriptions</button>
        </div>
      </admin-page-header>

      @if (store.selectedItem(); as item) {
        <div class="details-layout">
          <!-- Subscription Specification -->
          <div class="details-card">
            <div class="card-head">
              <h3>Plan Entitlement Specification</h3>
              <admin-subscriptions-status-chip [status]="item.status"></admin-subscriptions-status-chip>
            </div>
            <div class="spec-grid">
              <div class="spec-item">
                <span class="label">Subscription ID</span>
                <span class="value font-mono">{{ item.id }}</span>
              </div>
              <div class="spec-item">
                <span class="label">Subscribed Merchant</span>
                <span class="value font-semibold">{{ item.merchantName }}</span>
              </div>
              <div class="spec-item">
                <span class="label">Plan Tier</span>
                <span class="value font-semibold text-primary">{{ item.planName }}</span>
              </div>
              <div class="spec-item">
                <span class="label">Municipal Jurisdiction</span>
                <span class="value">📍 {{ item.locality }}, {{ item.city }}</span>
              </div>
              <div class="spec-item">
                <span class="label">Recurring Fee</span>
                <span class="value font-semibold">{{ item.mrrFormatted }}</span>
              </div>
              <div class="spec-item">
                <span class="label">Billing Cadence</span>
                <span class="value">{{ item.billingCycle }} Renewal</span>
              </div>
              <div class="spec-item">
                <span class="label">Next Invoice Date</span>
                <span class="value">{{ item.nextBillingDate | date:'mediumDate' }}</span>
              </div>
              <div class="spec-item">
                <span class="label">Active Grace Period</span>
                <span class="value font-semibold">{{ item.gracePeriodDays }} Days</span>
              </div>
            </div>
          </div>

          <!-- Grace Period Extension & Retention -->
          <div class="details-card tuning-card">
            <div class="card-head">
              <h3>Grace Period & Retention Management</h3>
              <span class="badge badge-warning">Operator Discretion</span>
            </div>
            <p class="tuning-desc">
              If a merchant encounters temporary banking delays, extend their subscription grace period to keep their storefront open without customer interruption.
            </p>

            <div class="tuning-form">
              <div class="form-group">
                <label>Extend Grace Window (Days): <strong>+{{ extraGraceDays }} Days</strong></label>
                <div class="stepper-row">
                  <button type="button" class="stepper-btn" (click)="adjustGrace(-7)">-7 Days</button>
                  <input
                    type="number"
                    min="1"
                    max="60"
                    [(ngModel)]="extraGraceDays"
                    class="form-control text-center font-semibold" />
                  <button type="button" class="stepper-btn" (click)="adjustGrace(7)">+7 Days</button>
                </div>
              </div>

              <div class="form-group">
                <label>Audit Justification Reason *</label>
                <input
                  type="text"
                  [(ngModel)]="graceReason"
                  placeholder="e.g. Bank mandate renewal pending with proprietor"
                  class="form-control" />
              </div>

              <button
                type="button"
                class="admin-btn btn-primary"
                [disabled]="isExtending()"
                (click)="extendGrace(item.id)">
                @if (isExtending()) { Extending... } @else { Authorize Grace Extension }
              </button>

              @if (extendSuccess()) {
                <div class="success-notice">
                  ✓ Grace period extended. Store checkout availability preserved.
                </div>
              }
            </div>
          </div>

          <!-- Billing Invoices History -->
          <div class="details-card full-span">
            <div class="card-head">
              <h3>Historical SaaS Invoices</h3>
              <span class="sub-lbl">GST-compliant digital tax invoices</span>
            </div>

            <div class="invoices-table">
              @for (inv of item.invoices; track inv.id) {
                <div class="invoice-row">
                  <div class="inv-col id">
                    <span class="inv-ref font-mono">{{ inv.id }}</span>
                    <span class="inv-date">{{ inv.date }}</span>
                  </div>
                  <div class="inv-col">
                    <span class="inv-amt font-semibold">{{ inv.amount }}</span>
                  </div>
                  <div class="inv-col status">
                    <span class="status-pill" [class.paid]="inv.status === 'PAID'">{{ inv.status }}</span>
                  </div>
                </div>
              }
            </div>
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

        .sub-lbl { font-size: 0.82rem; color: var(--admin-text-muted); }
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
          &.text-primary { color: var(--admin-primary); }
        }
      }
    }

    .tuning-desc {
      margin: 0;
      font-size: 0.85rem;
      color: var(--admin-text-secondary);
      line-height: 1.45;
    }

    .tuning-form {
      display: flex;
      flex-direction: column;
      gap: 14px;

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
          &:focus { outline: none; border-color: var(--admin-primary); }
          &.text-center { text-align: center; }
          &.font-semibold { font-weight: 600; }
        }

        .stepper-row {
          display: flex;
          align-items: center;
          gap: 8px;

          .stepper-btn {
            background: var(--admin-bg-surface);
            border: 1px solid var(--admin-border-subtle);
            color: var(--admin-text-primary);
            padding: 8px 16px;
            border-radius: var(--admin-radius-md);
            font-weight: 600;
            cursor: pointer;
            &:hover { background: var(--admin-bg-hover); }
          }
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

    .invoices-table {
      display: flex;
      flex-direction: column;
      gap: 8px;

      .invoice-row {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 12px 16px;
        border: 1px solid var(--admin-border-subtle);
        border-radius: var(--admin-radius-md);
        background: var(--admin-bg-base);

        .inv-col {
          display: flex;
          flex-direction: column;
          gap: 2px;

          &.id {
            .inv-ref { font-weight: 600; font-size: 0.9rem; color: var(--admin-text-primary); }
            .inv-date { font-size: 0.78rem; color: var(--admin-text-muted); }
          }

          .inv-amt { font-size: 0.95rem; color: var(--admin-text-primary); }

          .status-pill {
            padding: 4px 10px;
            border-radius: var(--admin-radius-full);
            font-size: 0.75rem;
            font-weight: 700;

            &.paid {
              background: rgba(22, 163, 74, 0.15);
              color: #16a34a;
            }
          }
        }
      }
    }
  `]
})
export class SubscriptionsDetailsPageComponent implements OnInit {
  readonly store = inject(SubscriptionsStore);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  id = '';
  extraGraceDays = 14;
  graceReason = '';
  isExtending = signal<boolean>(false);
  extendSuccess = signal<boolean>(false);

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id') || '';
    if (this.id) {
      this.store.loadById(this.id);
    }
  }

  adjustGrace(delta: number): void {
    const next = this.extraGraceDays + delta;
    if (next >= 1 && next <= 60) {
      this.extraGraceDays = next;
    }
  }

  extendGrace(subId: string): void {
    this.isExtending.set(true);
    this.extendSuccess.set(false);

    this.store.extendGracePeriod(
      subId,
      this.extraGraceDays,
      this.graceReason || 'Merchant retention grace extension'
    ).subscribe({
      next: () => {
        this.isExtending.set(false);
        this.extendSuccess.set(true);
        setTimeout(() => this.extendSuccess.set(false), 4000);
      },
      error: () => {
        this.isExtending.set(false);
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/subscriptions']);
  }
}
