import { Component, inject, OnInit, signal, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { OutletsStore } from '../state/outlets.store';
import { PageHeaderComponent } from '@nukkadnow/admin-ui';
import { OutletsStatusChipComponent } from '../components/outlets-status-chip.component';
import { OutletViewModel } from '../models/outlets-view.model';

@Component({
  selector: 'admin-outlets-details-page',
  standalone: true,
  imports: [CommonModule, FormsModule, PageHeaderComponent, OutletsStatusChipComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="details-page-container">
      <admin-page-header
        [title]="'Outlet: ' + (store.selectedItem()?.storeName || id)"
        subtitle="Capacity threshold management, weekly operating hours, and order intake routing"
        breadcrumb="Console / Storefront Outlets / Storefront Inspection">
        <div actions>
          <button type="button" class="admin-btn btn-secondary btn-sm" (click)="goBack()">← Back to Outlets</button>
        </div>
      </admin-page-header>

      @if (store.selectedItem(); as item) {
        <div class="details-layout">
          <!-- Outlet Specification Card -->
          <div class="details-card">
            <div class="card-head">
              <h3>Storefront Specification</h3>
              <admin-outlets-status-chip [status]="item.status"></admin-outlets-status-chip>
            </div>
            <div class="spec-grid">
              <div class="spec-item">
                <span class="label">Outlet ID</span>
                <span class="value font-mono">{{ item.id }}</span>
              </div>
              <div class="spec-item">
                <span class="label">Parent Merchant</span>
                <span class="value font-semibold">{{ item.merchantName }}</span>
              </div>
              <div class="spec-item">
                <span class="label">Municipal City</span>
                <span class="value">📍 {{ item.city }}</span>
              </div>
              <div class="spec-item">
                <span class="label">Micro-Market Locality</span>
                <span class="value">{{ item.locality }}</span>
              </div>
              <div class="spec-item">
                <span class="label">Storefront Phone</span>
                <span class="value font-mono">{{ item.phone }}</span>
              </div>
              <div class="spec-item">
                <span class="label">Operating Hours</span>
                <span class="value">{{ item.openingTime }} – {{ item.closingTime }}</span>
              </div>
              <div class="spec-item full">
                <span class="label">Physical Counter Address</span>
                <span class="value">{{ item.address }}</span>
              </div>
            </div>
          </div>

          <!-- Capacity Tuning Card -->
          <div class="details-card tuning-card">
            <div class="card-head">
              <h3>Hourly Order Capacity & Throttle</h3>
              <span class="load-badge">
                Current Load: {{ item.currentHourlyOrders }} / {{ hourlyCapacity }} orders/hr
              </span>
            </div>
            <p class="tuning-desc">
              Prevent storefront bottlenecks by tuning maximum hourly order fulfillment limits. When throttled, order routing pauses checkout availability.
            </p>

            <div class="tuning-form">
              <div class="form-group">
                <label>Hourly Capacity Limit: <strong>{{ hourlyCapacity }} orders / hour</strong></label>
                <div class="stepper-row">
                  <button type="button" class="stepper-btn" (click)="adjustCapacity(-5)">-5</button>
                  <input
                    type="number"
                    min="5"
                    max="150"
                    [(ngModel)]="hourlyCapacity"
                    class="form-control text-center" />
                  <button type="button" class="stepper-btn" (click)="adjustCapacity(5)">+5</button>
                </div>
              </div>

              <div class="form-group">
                <label>Emergency Intake Throttle</label>
                <div class="toggle-row">
                  <label class="toggle-switch">
                    <input type="checkbox" [(ngModel)]="isThrottled" />
                    <span class="slider"></span>
                  </label>
                  <span class="toggle-lbl">
                    @if (isThrottled) {
                      🚨 Active Throttle Engaged (New customer checkouts diverted)
                    } @else {
                      Normal Ingestion (Accepting all checkout requests)
                    }
                  </span>
                </div>
              </div>

              <div class="form-group">
                <label>Audit Reason Justification</label>
                <input
                  type="text"
                  [(ngModel)]="auditReason"
                  placeholder="e.g. Festival volume peak or unexpected power outage"
                  class="form-control" />
              </div>

              <button
                type="button"
                class="admin-btn btn-primary"
                [disabled]="isUpdating()"
                (click)="applyCapacity(item.id)">
                @if (isUpdating()) { Applying... } @else { Save Capacity Parameters }
              </button>

              @if (updateSuccess()) {
                <div class="success-notice">
                  ✓ Storefront capacity updated and synchronized with dispatcher.
                </div>
              }
            </div>
          </div>

          <!-- Weekly Operating Schedule -->
          <div class="details-card full-span">
            <div class="card-head">
              <h3>Weekly Operating Schedule</h3>
              <span class="schedule-sub">Configured store hours for checkout fulfillment</span>
            </div>

            <div class="schedule-table">
              @for (day of item.weeklySchedule; track day.day) {
                <div class="schedule-row">
                  <span class="day-name font-semibold">{{ day.day }}</span>
                  <div class="hours-col">
                    <span class="hours-val">{{ day.open }} – {{ day.close }}</span>
                  </div>
                  <div class="open-status">
                    @if (day.isOpen) {
                      <span class="badge-dot green">Active Day</span>
                    } @else {
                      <span class="badge-dot red">Day Off</span>
                    }
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

        .load-badge {
          font-size: 0.82rem;
          font-weight: 600;
          padding: 4px 10px;
          border-radius: var(--admin-radius-full);
          background: rgba(37, 99, 235, 0.1);
          color: #2563eb;
        }

        .schedule-sub {
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

        .toggle-row {
          display: flex;
          align-items: center;
          gap: 12px;

          .toggle-lbl {
            font-size: 0.88rem;
            color: var(--admin-text-primary);
            font-weight: 500;
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

    .schedule-table {
      display: flex;
      flex-direction: column;
      gap: 8px;

      .schedule-row {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 10px 16px;
        border: 1px solid var(--admin-border-subtle);
        border-radius: var(--admin-radius-md);
        background: var(--admin-bg-base);

        .day-name { width: 140px; color: var(--admin-text-primary); font-size: 0.9rem; }
        .hours-col { flex: 1; color: var(--admin-text-secondary); font-size: 0.88rem; }
        .open-status {
          .badge-dot {
            font-size: 0.78rem;
            font-weight: 600;
            padding: 3px 8px;
            border-radius: var(--admin-radius-full);
            &.green { background: rgba(22, 163, 74, 0.15); color: #16a34a; }
            &.red { background: rgba(220, 38, 38, 0.15); color: #dc2626; }
          }
        }
      }
    }
  `]
})
export class OutletsDetailsPageComponent implements OnInit {
  readonly store = inject(OutletsStore);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  id = '';
  hourlyCapacity = 25;
  isThrottled = false;
  auditReason = '';
  isUpdating = signal<boolean>(false);
  updateSuccess = signal<boolean>(false);

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id') || '';
    if (this.id) {
      this.store.loadById(this.id);
    }
  }

  adjustCapacity(delta: number): void {
    const next = this.hourlyCapacity + delta;
    if (next >= 5 && next <= 150) {
      this.hourlyCapacity = next;
    }
  }

  applyCapacity(outletId: string): void {
    this.isUpdating.set(true);
    this.updateSuccess.set(false);

    this.store.overrideCapacity(
      outletId,
      this.hourlyCapacity,
      this.isThrottled,
      this.auditReason || 'Manual capacity adjustment'
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
    this.router.navigate(['/outlets']);
  }
}
