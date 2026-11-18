import { Component, inject, OnInit, signal, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { PlansPricingStore } from '../state/plans-pricing.store';
import { PageHeaderComponent } from '@nukkadnow/admin-ui';
import { PlansPricingStatusChipComponent } from '../components/plans-pricing-status-chip.component';
import { PricingPlanViewModel } from '../models/plans-pricing-view.model';

@Component({
  selector: 'admin-plans-pricing-details-page',
  standalone: true,
  imports: [CommonModule, FormsModule, PageHeaderComponent, PlansPricingStatusChipComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="details-page-container">
      <admin-page-header
        [title]="'Plan Tier: ' + (store.selectedItem()?.title || id)"
        subtitle="Software subscription pricing rules, feature entitlements, and merchant limits"
        breadcrumb="Console / Financials & Pricing / Plan Inspection">
        <div actions>
          <button type="button" class="admin-btn btn-secondary btn-sm" (click)="goBack()">← Back to Plans</button>
        </div>
      </admin-page-header>

      @if (store.selectedItem(); as item) {
        <div class="details-layout">
          <!-- Plan Specification Card -->
          <div class="details-card">
            <div class="card-head">
              <h3>Tier Specification</h3>
              <admin-plans-pricing-status-chip [status]="item.status"></admin-plans-pricing-status-chip>
            </div>
            <div class="spec-grid">
              <div class="spec-item">
                <span class="label">Plan ID</span>
                <span class="value font-mono">{{ item.id }}</span>
              </div>
              <div class="spec-item">
                <span class="label">Tier Display Title</span>
                <span class="value font-semibold">{{ item.title }}</span>
              </div>
              <div class="spec-item">
                <span class="label">Monthly Rate</span>
                <span class="value font-bold text-primary">{{ item.monthlyPriceFormatted }}/month</span>
              </div>
              <div class="spec-item">
                <span class="label">Annual Rate (Discounted)</span>
                <span class="value font-semibold">{{ item.annualPriceFormatted }}/year</span>
              </div>
              <div class="spec-item">
                <span class="label">Storefront Capacity</span>
                <span class="value">{{ item.maxOutlets === 999 ? 'Unlimited' : item.maxOutlets + ' Outlets' }}</span>
              </div>
              <div class="spec-item">
                <span class="label">Catalog SKU Allowance</span>
                <span class="value">{{ item.maxCatalogSkus === 99999 ? 'Unlimited' : item.maxCatalogSkus + ' SKUs' }}</span>
              </div>
              <div class="spec-item">
                <span class="label">Commission Take-Rate Discount</span>
                <span class="value font-semibold text-green">{{ (item.commissionDiscountBps / 100).toFixed(1) }}% OFF</span>
              </div>
              <div class="spec-item">
                <span class="label">Support SLA</span>
                <span class="value">{{ item.prioritySupport ? '24/7 Dedicated Manager' : 'Standard In-App Helpdesk' }}</span>
              </div>
            </div>
          </div>

          <!-- Plan Tuning Form -->
          <div class="details-card tuning-card">
            <div class="card-head">
              <h3>Pricing & Software Entitlements Tuning</h3>
              <span class="badge badge-primary">Platform Governance</span>
            </div>
            <p class="tuning-desc">
              Modifying software tier parameters will take effect for new subscriptions and renew existing merchants on their next billing cycle.
            </p>

            <div class="tuning-form">
              <div class="form-row">
                <div class="form-group flex-1">
                  <label>Monthly Price (₹)</label>
                  <input
                    type="number"
                    min="0"
                    step="50"
                    [(ngModel)]="monthlyPriceRupees"
                    class="form-control font-semibold" />
                </div>

                <div class="form-group flex-1">
                  <label>Take-Rate Discount (bps)</label>
                  <input
                    type="number"
                    min="0"
                    max="500"
                    step="25"
                    [(ngModel)]="commissionDiscountBps"
                    class="form-control" />
                </div>
              </div>

              <div class="form-row">
                <div class="form-group flex-1">
                  <label>Max Storefront Outlets</label>
                  <input
                    type="number"
                    min="1"
                    max="50"
                    [(ngModel)]="maxOutlets"
                    class="form-control" />
                </div>

                <div class="form-group flex-1">
                  <label>Max Catalog Products</label>
                  <input
                    type="number"
                    min="50"
                    max="10000"
                    step="100"
                    [(ngModel)]="maxCatalogSkus"
                    class="form-control" />
                </div>
              </div>

              <div class="form-group">
                <label>Audit Justification Reason *</label>
                <input
                  type="text"
                  [(ngModel)]="auditReason"
                  placeholder="e.g. Festival tier incentive or SKU limit expansion"
                  class="form-control" />
              </div>

              <button
                type="button"
                class="admin-btn btn-primary"
                [disabled]="isUpdating()"
                (click)="applyPlanTuning(item.id)">
                @if (isUpdating()) { Saving Changes... } @else { Save Plan Tier Parameters }
              </button>

              @if (updateSuccess()) {
                <div class="success-notice">
                  ✓ Plan tier pricing and software limits updated across billing engine.
                </div>
              }
            </div>
          </div>

          <!-- Included Entitlements Checklist -->
          <div class="details-card full-span">
            <div class="card-head">
              <h3>Included Software Entitlements</h3>
              <span class="sub-lbl">{{ item.entitlements.length }} Platform Features</span>
            </div>

            <div class="entitlements-grid">
              @for (ent of item.entitlements; track ent) {
                <div class="entitlement-item">
                  <span class="icon">✓</span>
                  <span class="text">{{ ent }}</span>
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
          &.font-bold { font-weight: 700; }
          &.text-primary { color: var(--admin-primary); }
          &.text-green { color: #16a34a; }
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

      .form-row {
        display: flex;
        gap: 14px;
        .flex-1 { flex: 1; }
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
          &:focus { outline: none; border-color: var(--admin-primary); }
          &.font-semibold { font-weight: 600; }
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

    .entitlements-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
      gap: 12px;

      .entitlement-item {
        display: flex;
        align-items: center;
        gap: 10px;
        padding: 12px 16px;
        border: 1px solid var(--admin-border-subtle);
        border-radius: var(--admin-radius-md);
        background: var(--admin-bg-base);

        .icon {
          color: #16a34a;
          font-weight: 700;
          font-size: 1.1rem;
        }

        .text {
          font-size: 0.88rem;
          color: var(--admin-text-primary);
        }
      }
    }
  `]
})
export class PlansPricingDetailsPageComponent implements OnInit {
  readonly store = inject(PlansPricingStore);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  id = '';
  monthlyPriceRupees = 999;
  maxOutlets = 3;
  maxCatalogSkus = 1000;
  commissionDiscountBps = 100;
  auditReason = '';
  isUpdating = signal<boolean>(false);
  updateSuccess = signal<boolean>(false);

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id') || '';
    if (this.id) {
      this.store.loadById(this.id);
    }
  }

  applyPlanTuning(planId: string): void {
    this.isUpdating.set(true);
    this.updateSuccess.set(false);

    const monthlyPricePaise = this.monthlyPriceRupees * 100;
    const annualPricePaise = monthlyPricePaise * 10;

    this.store.updatePlan(
      planId,
      {
        monthlyPricePaise,
        monthlyPriceFormatted: monthlyPricePaise === 0 ? '₹0' : `₹${this.monthlyPriceRupees}`,
        annualPricePaise,
        annualPriceFormatted: annualPricePaise === 0 ? '₹0' : `₹${this.monthlyPriceRupees * 10}`,
        maxOutlets: this.maxOutlets,
        maxCatalogSkus: this.maxCatalogSkus,
        commissionDiscountBps: this.commissionDiscountBps
      },
      this.auditReason || 'SaaS plan parameter tuning'
    ).subscribe({
      next: () => {
        this.isUpdating.set(false);
        this.updateSuccess.set(true);
        setTimeout(() => this.updateSuccess.set(false), 4000);
      },
      error: () => {
        this.isUpdating.set(false);
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/plans-pricing']);
  }
}
