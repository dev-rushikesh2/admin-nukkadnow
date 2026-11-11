import { Component, inject, OnInit, ChangeDetectionStrategy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { OrdersRepository } from '../data-access/orders.repository';
import { AdminOrderViewModel } from '../models/orders-view.model';
import { PageHeaderComponent, BadgeComponent, PiiMaskComponent } from '@nukkadnow/admin-ui';
import { InrCurrencyPipe } from '../../../shared/pipes/inr-currency.pipe';
import { AuditReasonDialogService } from '../../../core/audit-context/audit-reason-dialog.service';

@Component({
  selector: 'admin-orders-details-page',
  standalone: true,
  imports: [CommonModule, PageHeaderComponent, BadgeComponent, PiiMaskComponent, InrCurrencyPipe],
  template: `
    @if (order(); as o) {
      <div class="order-details-container">
        <admin-page-header
          [title]="'Order #' + o.id + ' · Token ' + o.pickupToken"
          [subtitle]="'Merchant: ' + o.merchantName + ' · Locality: ' + o.locality + ' · Slot: ' + o.pickupSlot"
          breadcrumb="Console / Orders / Inspection">
          <div actions>
            <button class="admin-btn btn-secondary btn-sm" (click)="goBack()">← Back to Stream</button>

            @if (o.status !== 'FORCE_CANCELLED' && o.status !== 'HANDED_OVER') {
              <button class="admin-btn btn-danger btn-sm" (click)="forceCancel()">
                ⚠️ Emergency Cancel Order
              </button>
            }
          </div>
        </admin-page-header>

        @if (o.status === 'FORCE_CANCELLED') {
          <div class="cancellation-alert font-mono">
            🚫 <strong>ORDER INTERVENED & CANCELLED:</strong> {{ o.cancellationReason }}
          </div>
        }

        <!-- 3-Column Split: Customer / Items / Timeline -->
        <div class="order-grid">
          <!-- Col 1: Customer & Payment Details -->
          <div class="detail-card">
            <h3>👤 Customer & Payment</h3>
            <div class="info-row">
              <span class="lbl">Customer Name:</span>
              <span class="val font-semibold">{{ o.customerName }}</span>
            </div>
            <div class="info-row">
              <span class="lbl">Contact Phone:</span>
              <span class="val">
                <admin-pii-mask [value]="o.customerPhone" type="phone"></admin-pii-mask>
              </span>
            </div>
            <div class="info-row">
              <span class="lbl">Digital Pickup Token:</span>
              <span class="val font-mono font-semibold token-badge">{{ o.pickupToken }}</span>
            </div>
            <div class="info-row">
              <span class="lbl">Pickup Window:</span>
              <span class="val">{{ o.pickupSlot }}</span>
            </div>
            <div class="info-row">
              <span class="lbl">Payment Provider:</span>
              <span class="val">{{ o.paymentMethod }}</span>
            </div>
            <div class="info-row">
              <span class="lbl">Payment Reference:</span>
              <span class="val font-mono">{{ o.paymentRef }}</span>
            </div>
          </div>

          <!-- Col 2: Itemized Invoice -->
          <div class="detail-card">
            <h3>🛍️ Itemized Basket</h3>
            <div class="items-list">
              @for (item of o.items; track item.productId) {
                <div class="order-item-row">
                  <div class="item-meta">
                    <span class="item-title">{{ item.name }}</span>
                    @if (item.cookingInstructions) {
                      <span class="item-notes">📝 Note: {{ item.cookingInstructions }}</span>
                    }
                  </div>
                  <div class="item-qty font-mono">× {{ item.quantity }}</div>
                  <div class="item-price font-mono font-semibold">{{ item.totalPaise | inrCurrency }}</div>
                </div>
              }
            </div>

            <div class="invoice-summary font-mono">
              <div class="summary-line">
                <span>Subtotal:</span>
                <span>{{ o.subtotalPaise | inrCurrency }}</span>
              </div>
              <div class="summary-line">
                <span>GST (Tax):</span>
                <span>{{ o.taxPaise | inrCurrency }}</span>
              </div>
              <div class="summary-line">
                <span>Platform Convenience Fee:</span>
                <span>{{ o.platformFeePaise | inrCurrency }}</span>
              </div>
              <div class="summary-line total font-bold">
                <span>Grand Total:</span>
                <span>{{ o.totalPaise | inrCurrency }}</span>
              </div>
            </div>
          </div>

          <!-- Col 3: Fulfillment Milestone Timeline -->
          <div class="detail-card">
            <h3>⏱️ Fulfillment Milestones</h3>
            <div class="timeline-container font-mono">
              @for (step of o.timeline; track step.timestamp) {
                <div class="timeline-step">
                  <div class="step-dot" [class.cancelled]="step.status === 'FORCE_CANCELLED'"></div>
                  <div class="step-content">
                    <span class="step-title font-semibold">{{ step.title }}</span>
                    <span class="step-time">{{ step.timestamp | date:'mediumTime' }} · {{ step.actor }}</span>
                    @if (step.notes) {
                      <span class="step-notes">{{ step.notes }}</span>
                    }
                  </div>
                </div>
              }
            </div>
          </div>
        </div>
      </div>
    }
  `,
  styles: [`
    .order-details-container { display: flex; flex-direction: column; gap: 16px; }
    .cancellation-alert {
      background: var(--admin-danger-subtle); color: var(--admin-danger);
      border: 1px solid rgba(239, 68, 68, 0.3); padding: 12px 16px; border-radius: var(--admin-radius-md); font-size: 0.8125rem;
    }
    .order-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 16px; }
    .detail-card {
      background: var(--admin-bg-surface); border: 1px solid var(--admin-border-subtle);
      border-radius: var(--admin-radius-md); padding: 20px; display: flex; flex-direction: column; gap: 14px;
      h3 { margin: 0 0 6px 0; font-size: 1rem; color: var(--admin-text-primary); border-bottom: 1px solid var(--admin-border-subtle); padding-bottom: 8px; }
    }
    .info-row { display: flex; justify-content: space-between; align-items: center; font-size: 0.8125rem; .lbl { color: var(--admin-text-muted); } }
    .token-badge { background: var(--admin-bg-subtle); border: 1px solid var(--admin-border-default); padding: 2px 8px; border-radius: 4px; color: var(--admin-primary); }
    .items-list { display: flex; flex-direction: column; gap: 10px; }
    .order-item-row { display: flex; align-items: center; justify-content: space-between; padding: 6px 0; border-bottom: 1px dashed var(--admin-border-subtle); font-size: 0.8125rem; }
    .item-meta { display: flex; flex-direction: column; flex: 1; }
    .item-notes { font-size: 0.75rem; color: var(--admin-warning); }
    .invoice-summary { border-top: 1px solid var(--admin-border-default); padding-top: 10px; display: flex; flex-direction: column; gap: 6px; font-size: 0.8125rem; }
    .summary-line { display: flex; justify-content: space-between; &.total { font-size: 0.95rem; color: var(--admin-success); margin-top: 4px; } }
    .timeline-container { display: flex; flex-direction: column; gap: 16px; padding-left: 8px; border-left: 2px solid var(--admin-border-subtle); margin-left: 8px; }
    .timeline-step { position: relative; display: flex; flex-direction: column; padding-left: 12px; }
    .step-dot { position: absolute; left: -18px; top: 2px; width: 10px; height: 10px; border-radius: 50%; background: var(--admin-primary); &.cancelled { background: var(--admin-danger); } }
    .step-title { font-size: 0.8125rem; color: var(--admin-text-primary); }
    .step-time { font-size: 0.7rem; color: var(--admin-text-muted); }
    .step-notes { font-size: 0.75rem; color: var(--admin-danger); }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrdersDetailsPageComponent implements OnInit {
  private readonly repository = inject(OrdersRepository);
  private readonly auditDialog = inject(AuditReasonDialogService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  order = signal<AdminOrderViewModel | null>(null);

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id') || 'ORD-NGP-9821';
    this.repository.fetchById(id).subscribe((o) => this.order.set(o));
  }

  goBack(): void {
    this.router.navigate(['/orders']);
  }

  async forceCancel(): Promise<void> {
    const o = this.order();
    if (!o) return;

    const res = await this.auditDialog.promptReason({
      actionName: `Emergency Cancel Order #${o.id}`,
      targetEntityId: o.id,
      category: 'CANCELLATION',
      predefinedReasons: [
        { code: 'STORE_CLOSED', label: 'Store unannounced emergency closure' },
        { code: 'INVENTORY_STOCKOUT', label: 'Item out of stock; merchant unreachable' },
        { code: 'CUSTOMER_EMERGENCY', label: 'Customer unable to reach pickup slot' },
        { code: 'SUSPECTED_FRAUD', label: 'Compromised payment / card testing' },
      ],
    });

    if (res.confirmed && res.reasonCode) {
      this.repository.forceCancelOrder(o.id, res.reasonCode, res.justification || '').subscribe((updated) => {
        this.order.set(updated);
      });
    }
  }
}
