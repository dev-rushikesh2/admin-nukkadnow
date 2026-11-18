import { Component, inject, OnInit, signal, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CatalogueModerationStore } from '../state/catalogue-moderation.store';
import { PageHeaderComponent } from '@nukkadnow/admin-ui';
import { CatalogueModerationStatusChipComponent } from '../components/catalogue-moderation-status-chip.component';
import { CatalogItemViewModel } from '../models/catalogue-moderation-view.model';

@Component({
  selector: 'admin-catalogue-moderation-details-page',
  standalone: true,
  imports: [CommonModule, FormsModule, PageHeaderComponent, CatalogueModerationStatusChipComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="details-page-container">
      <admin-page-header
        [title]="'Catalog Moderation: ' + (store.selectedItem()?.name || id)"
        subtitle="Price gouging audit, legal metrology MRP enforcement, and statutory takedown actions"
        breadcrumb="Console / Catalog Governance / Item Inspection">
        <div actions>
          <button type="button" class="admin-btn btn-secondary btn-sm" (click)="goBack()">← Back to Moderation</button>
        </div>
      </admin-page-header>

      @if (store.selectedItem(); as item) {
        <div class="details-layout">
          <!-- Product Specification Card -->
          <div class="details-card">
            <div class="card-head">
              <h3>Product Specification</h3>
              <admin-catalogue-moderation-status-chip [status]="item.status"></admin-catalogue-moderation-status-chip>
            </div>
            <div class="spec-grid">
              <div class="spec-item">
                <span class="label">SKU Reference ID</span>
                <span class="value font-mono">{{ item.id }}</span>
              </div>
              <div class="spec-item">
                <span class="label">Product Title</span>
                <span class="value font-semibold">{{ item.name }}</span>
              </div>
              <div class="spec-item">
                <span class="label">Category Classification</span>
                <span class="value font-semibold">🏷️ {{ item.category }}</span>
              </div>
              <div class="spec-item">
                <span class="label">Listing Merchant</span>
                <span class="value">{{ item.merchantName || 'Local Storefront' }}</span>
              </div>
              <div class="spec-item">
                <span class="label">Listed Selling Price</span>
                <span class="value font-bold text-red">{{ item.priceFormatted }}</span>
              </div>
              <div class="spec-item">
                <span class="label">Statutory Legal MRP</span>
                <span class="value font-semibold">{{ item.mrpFormatted }}</span>
              </div>
              <div class="spec-item full">
                <span class="label">Governance Anomaly Flag</span>
                <span class="value text-warning font-semibold">
                  ⚠️ {{ item.anomalyWarning || 'Selling price exceeds legal maximum ceiling or regulatory cap.' }}
                </span>
              </div>
            </div>
          </div>

          <!-- Moderation Actions & Compliance Card -->
          <div class="details-card tuning-card">
            <div class="card-head">
              <h3>Statutory Moderation Actions</h3>
              <span class="badge badge-warning">Enforcement Desk</span>
            </div>
            <p class="tuning-desc">
              Under the Consumer Protection Act and Legal Metrology Rules, e-commerce platforms must enforce maximum retail prices and remove non-compliant listings immediately.
            </p>

            <div class="tuning-form">
              <div class="form-group">
                <label>Statutory Violation Reason *</label>
                <select [(ngModel)]="violationReason" class="form-control">
                  <option value="MRP_VIOLATION">MRP Exceeded (Selling above package printed MRP)</option>
                  <option value="PRICE_CEILING_BREACH">Platform Emergency Price Ceiling Breached</option>
                  <option value="PROHIBITED_GOODS">Prohibited / Restricted Substance</option>
                  <option value="MISLEADING_CLAIMS">Misleading Organic or Quality Certification</option>
                  <option value="SUBSTANDARD_PACKAGING">Damaged / Non-Compliant Packaging</option>
                </select>
              </div>

              <div class="form-group">
                <label>Operator Audit Notes & Merchant Notice</label>
                <input
                  type="text"
                  [(ngModel)]="operatorNotes"
                  placeholder="e.g. Verified printed MRP on package is ₹40. Listing at ₹85 is prohibited."
                  class="form-control" />
              </div>

              <div class="action-buttons-row">
                <button
                  type="button"
                  class="admin-btn btn-secondary"
                  [disabled]="isActing()"
                  (click)="clearFlag(item.id)">
                  ✓ Approve & Clear Flag
                </button>

                <button
                  type="button"
                  class="admin-btn btn-danger"
                  [disabled]="isActing()"
                  (click)="takedownItem(item.id)">
                  @if (isActing()) { Processing... } @else { ✕ Immediate Takedown & Block }
                </button>
              </div>

              @if (actionSuccess()) {
                <div class="success-notice">
                  ✓ Enforcement decision executed. Product status updated and merchant notified.
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

        &.full { grid-column: 1 / -1; }

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
          &.text-red { color: #dc2626; }
          &.text-warning { color: #d97706; }
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
        }
      }

      .action-buttons-row {
        display: flex;
        gap: 12px;
        margin-top: 6px;
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
  `]
})
export class CatalogueModerationDetailsPageComponent implements OnInit {
  readonly store = inject(CatalogueModerationStore);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  id = '';
  violationReason = 'MRP_VIOLATION';
  operatorNotes = '';
  isActing = signal<boolean>(false);
  actionSuccess = signal<boolean>(false);

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id') || '';
    if (this.id) {
      this.store.loadById(this.id);
    }
  }

  clearFlag(itemId: string): void {
    this.isActing.set(true);
    this.store.takeDownItem(itemId, 'CLEARED', this.operatorNotes || 'Cleared after inspection').subscribe({
      next: () => {
        this.isActing.set(false);
        this.actionSuccess.set(true);
        setTimeout(() => this.actionSuccess.set(false), 4000);
      },
      error: () => {
        this.isActing.set(false);
      }
    });
  }

  takedownItem(itemId: string): void {
    this.isActing.set(true);
    this.store.takeDownItem(itemId, 'TAKEN_DOWN', `${this.violationReason}: ${this.operatorNotes}`).subscribe({
      next: () => {
        this.isActing.set(false);
        this.actionSuccess.set(true);
        setTimeout(() => this.actionSuccess.set(false), 4000);
      },
      error: () => {
        this.isActing.set(false);
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/catalogue-moderation']);
  }
}
