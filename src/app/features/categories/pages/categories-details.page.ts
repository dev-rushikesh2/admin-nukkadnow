import { Component, inject, OnInit, signal, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CategoriesStore } from '../state/categories.store';
import { PageHeaderComponent } from '@nukkadnow/admin-ui';
import { CategoriesStatusChipComponent } from '../components/categories-status-chip.component';
import { CategoryViewModel } from '../models/categories-view.model';

@Component({
  selector: 'admin-categories-details-page',
  standalone: true,
  imports: [CommonModule, FormsModule, PageHeaderComponent, CategoriesStatusChipComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="details-page-container">
      <admin-page-header
        [title]="'Category: ' + (store.selectedItem()?.emoji || '🏷️') + ' ' + (store.selectedItem()?.name || id)"
        subtitle="Catalog classification, take-rate commission slabs, and GST compliance"
        breadcrumb="Console / Taxonomy & Categories / Category Inspection">
        <div actions>
          <button type="button" class="admin-btn btn-secondary btn-sm" (click)="goBack()">← Back to Categories</button>
        </div>
      </admin-page-header>

      @if (store.selectedItem(); as item) {
        <div class="details-layout">
          <!-- Category Specification Card -->
          <div class="details-card">
            <div class="card-head">
              <h3>Classification Specification</h3>
              <admin-categories-status-chip [status]="item.status"></admin-categories-status-chip>
            </div>
            <div class="spec-grid">
              <div class="spec-item">
                <span class="label">Category ID</span>
                <span class="value font-mono">{{ item.id }}</span>
              </div>
              <div class="spec-item">
                <span class="label">Taxonomy Code</span>
                <span class="value font-mono font-semibold">{{ item.code }}</span>
              </div>
              <div class="spec-item">
                <span class="label">Active Catalog SKUs</span>
                <span class="value font-semibold">{{ item.activeItems }} Products</span>
              </div>
              <div class="spec-item">
                <span class="label">Subcategories</span>
                <span class="value">{{ item.subcategories?.length ?? 3 }} Sub-branches</span>
              </div>
              <div class="spec-item">
                <span class="label">Standard Platform Take-Rate</span>
                <span class="value font-semibold text-primary">{{ item.commissionPct }}%</span>
              </div>
              <div class="spec-item">
                <span class="label">Statutory GST Slab</span>
                <span class="value font-semibold">{{ item.gstSlabPct }}%</span>
              </div>
              <div class="spec-item full">
                <span class="label">Recorded At</span>
                <span class="value">{{ item.createdAt | date:'medium' }}</span>
              </div>
            </div>
          </div>

          <!-- Commission & Tax Tuning Card -->
          <div class="details-card tuning-card">
            <div class="card-head">
              <h3>Commission Slab & GST Governance</h3>
              <span class="badge badge-primary">Platform Policy</span>
            </div>
            <p class="tuning-desc">
              Commission adjustments apply across all future order settlements for merchants listing products under this taxonomy.
            </p>

            <div class="tuning-form">
              <div class="form-row">
                <div class="form-group flex-1">
                  <label>Commission Take-Rate (%)</label>
                  <input
                    type="number"
                    step="0.25"
                    min="0"
                    max="30"
                    [(ngModel)]="commissionPct"
                    class="form-control font-semibold" />
                </div>

                <div class="form-group flex-1">
                  <label>GST Slab (%)</label>
                  <select [(ngModel)]="gstSlabPct" class="form-control font-semibold">
                    <option [ngValue]="0">0% (Nil)</option>
                    <option [ngValue]="5">5% (Essential)</option>
                    <option [ngValue]="12">12% (Standard)</option>
                    <option [ngValue]="18">18% (Packaged)</option>
                  </select>
                </div>
              </div>

              <div class="form-group">
                <label>Audit Reason Justification</label>
                <input
                  type="text"
                  [(ngModel)]="auditReason"
                  placeholder="e.g. Festival merchant incentive scheme or GST rate rationalization"
                  class="form-control" />
              </div>

              <button
                type="button"
                class="admin-btn btn-primary"
                [disabled]="isUpdating()"
                (click)="applyCommission(item.id)">
                @if (isUpdating()) { Applying... } @else { Save Commission & Tax Slabs }
              </button>

              @if (updateSuccess()) {
                <div class="success-notice">
                  ✓ Category commission and tax rates updated across settlement engine.
                </div>
              }
            </div>
          </div>

          <!-- Subcategories Tree -->
          <div class="details-card full-span">
            <div class="card-head">
              <h3>Subcategories Tree</h3>
              <span class="sub-lbl">{{ item.subcategories?.length ?? 3 }} Active Sub-branches</span>
            </div>

            <div class="subcat-grid">
              @for (sub of item.subcategories; track sub.id) {
                <div class="subcat-card">
                  <div class="subcat-icon">📁</div>
                  <div class="subcat-info">
                    <span class="subcat-name">{{ sub.name }}</span>
                    <span class="subcat-skus">{{ sub.activeItems }} live merchant SKUs</span>
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

        .sub-lbl {
          font-size: 0.82rem;
          color: var(--admin-text-muted);
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

    .subcat-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
      gap: 12px;

      .subcat-card {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 14px 16px;
        border: 1px solid var(--admin-border-subtle);
        border-radius: var(--admin-radius-md);
        background: var(--admin-bg-base);

        .subcat-icon { font-size: 1.4rem; }
        .subcat-info {
          display: flex;
          flex-direction: column;
          gap: 2px;

          .subcat-name { font-weight: 600; font-size: 0.9rem; color: var(--admin-text-primary); }
          .subcat-skus { font-size: 0.78rem; color: var(--admin-text-muted); }
        }
      }
    }
  `]
})
export class CategoriesDetailsPageComponent implements OnInit {
  readonly store = inject(CategoriesStore);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  id = '';
  commissionPct = 5.0;
  gstSlabPct = 5;
  auditReason = '';
  isUpdating = signal<boolean>(false);
  updateSuccess = signal<boolean>(false);

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id') || '';
    if (this.id) {
      this.store.loadById(this.id);
    }
  }

  applyCommission(categoryId: string): void {
    this.isUpdating.set(true);
    this.updateSuccess.set(false);

    this.store.updateCommission(
      categoryId,
      this.commissionPct,
      this.gstSlabPct,
      this.auditReason || 'Commission and GST slab adjustment'
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
    this.router.navigate(['/categories']);
  }
}
