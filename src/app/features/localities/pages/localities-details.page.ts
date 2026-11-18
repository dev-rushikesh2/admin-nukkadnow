import { Component, inject, OnInit, signal, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { LocalitiesStore } from '../state/localities.store';
import { PageHeaderComponent } from '@nukkadnow/admin-ui';
import { LocalitiesStatusChipComponent } from '../components/localities-status-chip.component';
import { LocalityViewModel } from '../models/localities-view.model';

@Component({
  selector: 'admin-localities-details-page',
  standalone: true,
  imports: [CommonModule, FormsModule, PageHeaderComponent, LocalitiesStatusChipComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="details-page-container">
      <admin-page-header
        [title]="'Micro-Market: ' + (store.selectedItem()?.name || id)"
        subtitle="Geographic boundary, delivery radius enforcement, and dynamic order congestion tuning"
        breadcrumb="Console / Localities & Delivery Zones / Zone Inspection">
        <div actions>
          <button type="button" class="admin-btn btn-secondary btn-sm" (click)="goBack()">← Back to Localities</button>
        </div>
      </admin-page-header>

      @if (store.selectedItem(); as item) {
        <div class="details-layout">
          <!-- Main Zone Specification Card -->
          <div class="details-card">
            <div class="card-head">
              <h3>Territory Specification</h3>
              <admin-localities-status-chip [status]="item.status"></admin-localities-status-chip>
            </div>
            <div class="spec-grid">
              <div class="spec-item">
                <span class="label">Locality ID</span>
                <span class="value font-mono">{{ item.id }}</span>
              </div>
              <div class="spec-item">
                <span class="label">Municipal City</span>
                <span class="value font-semibold">📍 {{ item.city }}</span>
              </div>
              <div class="spec-item">
                <span class="label">Postal Code (PIN)</span>
                <span class="value font-mono">{{ item.pincode }}</span>
              </div>
              <div class="spec-item">
                <span class="label">Active Fulfillment Outlets</span>
                <span class="value font-semibold">{{ item.activeOutlets }} Stores</span>
              </div>
              <div class="spec-item">
                <span class="label">Delivery Service Radius</span>
                <span class="value">{{ item.deliveryRadiusKm }} km Radial Scope</span>
              </div>
              <div class="spec-item">
                <span class="label">Geofence Boundary Type</span>
                <span class="value">{{ item.geofenceType }}</span>
              </div>
              <div class="spec-item">
                <span class="label">Centroid Coordinates</span>
                <span class="value font-mono">
                  {{ item.centerLat ?? '21.1458' }}° N, {{ item.centerLng ?? '79.0882' }}° E
                </span>
              </div>
              <div class="spec-item">
                <span class="label">Recorded At</span>
                <span class="value">{{ item.createdAt | date:'medium' }}</span>
              </div>
            </div>
          </div>

          <!-- Operational Congestion & Dispatch Control Card -->
          <div class="details-card tuning-card">
            <div class="card-head">
              <h3>Operational Dispatch & Congestion Tuning</h3>
              <span class="badge" [class.badge-warning]="selectedStatus === 'CONGESTED'" [class.badge-success]="selectedStatus === 'ACTIVE'">
                Live Tuning
              </span>
            </div>
            <p class="tuning-desc">
              During inclement weather or sudden merchant batch overloads, adjust the operating state and order congestion multiplier to protect delivery partner SLAs.
            </p>

            <div class="tuning-form">
              <div class="form-group">
                <label>Operating State Override</label>
                <select [(ngModel)]="selectedStatus" class="form-control">
                  <option value="ACTIVE">ACTIVE — Normal Order Dispatch</option>
                  <option value="CONGESTED">CONGESTED — Throttled Order Ingestion</option>
                  <option value="MAINTENANCE">MAINTENANCE — Micro-Market Staged</option>
                  <option value="INACTIVE">INACTIVE — Completely Offline</option>
                </select>
              </div>

              <div class="form-group">
                <label>Congestion Multiplier (ETA & Delivery Surcharge Factor): <strong>{{ congestionMultiplier }}x</strong></label>
                <input
                  type="range"
                  min="1.0"
                  max="2.5"
                  step="0.1"
                  [(ngModel)]="congestionMultiplier"
                  class="range-slider" />
                <div class="slider-ticks">
                  <span>1.0x (Normal)</span>
                  <span>1.5x (Rain/Traffic)</span>
                  <span>2.0x (Severe Flood)</span>
                  <span>2.5x (Max)</span>
                </div>
              </div>

              <div class="form-group">
                <label>Audit Reason Justification</label>
                <input
                  type="text"
                  [(ngModel)]="auditReason"
                  placeholder="e.g. Heavy rainfall near Sitabuldi Flyover, throttling dispatch"
                  class="form-control" />
              </div>

              <button
                type="button"
                class="admin-btn btn-primary"
                [disabled]="isUpdating()"
                (click)="applyTuning(item.id)">
                @if (isUpdating()) { Applying Changes... } @else { Apply Operational Tuning }
              </button>

              @if (updateSuccess()) {
                <div class="success-notice">
                  ✓ Locality dispatch parameters updated and broadcast to routing engine.
                </div>
              }
            </div>
          </div>

          <!-- Associated Outlets Roster -->
          <div class="details-card full-span">
            <div class="card-head">
              <h3>Registered Hyper-Local Outlets in this Zone</h3>
              <span class="outlets-count">{{ item.activeOutlets }} Active Storefronts</span>
            </div>
            <div class="outlets-roster">
              <div class="outlet-row">
                <div class="outlet-col main">
                  <span class="store-name">Patil Fresh Sabji Mandi — Sitabuldi Hub</span>
                  <span class="store-meta">Retail Fruits & Vegetables • Shop #14, Main Mandi Road</span>
                </div>
                <div class="outlet-col">
                  <span class="col-lbl">Hourly Cap</span>
                  <span class="col-val">25 orders/hr</span>
                </div>
                <div class="outlet-col">
                  <span class="col-lbl">Active Batches</span>
                  <span class="col-val font-semibold">6 In-Flight</span>
                </div>
                <div class="outlet-col status">
                  <span class="status-pill open">OPEN</span>
                </div>
              </div>

              <div class="outlet-row">
                <div class="outlet-col main">
                  <span class="store-name">Garguti Masale & Pickles — Zone Counter</span>
                  <span class="store-meta">Traditional Food • Shop #2, Near Metro Station</span>
                </div>
                <div class="outlet-col">
                  <span class="col-lbl">Hourly Cap</span>
                  <span class="col-val">15 orders/hr</span>
                </div>
                <div class="outlet-col">
                  <span class="col-lbl">Active Batches</span>
                  <span class="col-val font-semibold">2 In-Flight</span>
                </div>
                <div class="outlet-col status">
                  <span class="status-pill open">OPEN</span>
                </div>
              </div>

              <div class="outlet-row">
                <div class="outlet-col main">
                  <span class="store-name">Nagpur Daily Milk & Paneer</span>
                  <span class="store-meta">Dairy & Essentials • Plot 8, North Mandi Gate</span>
                </div>
                <div class="outlet-col">
                  <span class="col-lbl">Hourly Cap</span>
                  <span class="col-val">20 orders/hr</span>
                </div>
                <div class="outlet-col">
                  <span class="col-lbl">Active Batches</span>
                  <span class="col-val font-semibold">5 In-Flight</span>
                </div>
                <div class="outlet-col status">
                  <span class="status-pill open">OPEN</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      }
    </div>
  `,
  styles: [`
    .details-page-container {
      display: flex;
      flex-direction: column;
      gap: 20px;
    }

    .details-layout {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 20px;

      @media (max-width: 960px) {
        grid-template-columns: 1fr;
      }
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

      &.full-span {
        grid-column: 1 / -1;
      }

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

        .outlets-count {
          font-size: 0.85rem;
          color: var(--admin-text-muted);
          font-weight: 500;
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

          &:focus {
            outline: none;
            border-color: var(--admin-primary);
          }
        }

        .range-slider {
          width: 100%;
          cursor: pointer;
        }

        .slider-ticks {
          display: flex;
          justify-content: space-between;
          font-size: 0.75rem;
          color: var(--admin-text-muted);
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

    .outlets-roster {
      display: flex;
      flex-direction: column;
      gap: 10px;

      .outlet-row {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 12px 16px;
        border: 1px solid var(--admin-border-subtle);
        border-radius: var(--admin-radius-md);
        background: var(--admin-bg-base);

        .outlet-col {
          display: flex;
          flex-direction: column;
          gap: 2px;

          &.main {
            flex: 2;
            .store-name {
              font-weight: 600;
              font-size: 0.92rem;
              color: var(--admin-text-primary);
            }
            .store-meta {
              font-size: 0.8rem;
              color: var(--admin-text-muted);
            }
          }

          .col-lbl {
            font-size: 0.72rem;
            color: var(--admin-text-muted);
            text-transform: uppercase;
          }

          .col-val {
            font-size: 0.85rem;
            color: var(--admin-text-primary);
          }

          .status-pill {
            padding: 4px 10px;
            border-radius: var(--admin-radius-full);
            font-size: 0.75rem;
            font-weight: 700;
            text-align: center;

            &.open {
              background: rgba(22, 163, 74, 0.15);
              color: #16a34a;
            }
          }
        }
      }
    }
  `]
})
export class LocalitiesDetailsPageComponent implements OnInit {
  readonly store = inject(LocalitiesStore);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  id = '';
  selectedStatus = 'ACTIVE';
  congestionMultiplier = 1.0;
  auditReason = '';
  isUpdating = signal<boolean>(false);
  updateSuccess = signal<boolean>(false);

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id') || '';
    if (this.id) {
      this.store.loadById(this.id);
    }
  }

  applyTuning(localityId: string): void {
    this.isUpdating.set(true);
    this.updateSuccess.set(false);

    this.store.updateStatus(
      localityId,
      this.selectedStatus,
      this.auditReason || 'Operational congestion adjustment',
      this.congestionMultiplier
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
    this.router.navigate(['/localities']);
  }
}
