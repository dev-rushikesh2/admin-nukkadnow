import { Component, inject, OnInit, ChangeDetectionStrategy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { RefundsDisputesRepository } from '../data-access/refunds-disputes.repository';
import { RefundDisputeViewModel } from '../models/refunds-disputes-view.model';
import { PageHeaderComponent, BadgeComponent } from '@nukkadnow/admin-ui';
import { StepUpModalComponent } from '../../../shared/components/step-up-modal/step-up-modal.component';
import { InrCurrencyPipe } from '../../../shared/pipes/inr-currency.pipe';
import { AdminSessionService } from '../../../core/auth/session.service';

@Component({
  selector: 'admin-refunds-disputes-details-page',
  standalone: true,
  imports: [CommonModule, PageHeaderComponent, BadgeComponent, StepUpModalComponent, InrCurrencyPipe],
  template: `
    @if (item(); as r) {
      <div class="refund-details-container">
        <admin-page-header
          [title]="'Refund Dispute: #' + r.id + ' (' + (r.amountPaise | inrCurrency) + ')'"
          [subtitle]="'Order: #' + r.orderId + ' · Merchant: ' + r.merchantName + ' · Customer: ' + r.customerName"
          breadcrumb="Console / Financials / Refunds / Inspection">
          <div actions>
            <button class="admin-btn btn-secondary btn-sm" (click)="goBack()">← Back</button>

            @if (r.status === 'PENDING_FIRST_APPROVAL') {
              <button class="admin-btn btn-primary btn-sm" (click)="authorizeFirstSign()">
                ✓ Authorize 1st Approval
              </button>
            } @else if (r.status === 'PENDING_SECOND_APPROVAL') {
              <button class="admin-btn btn-danger btn-sm" (click)="promptSecondSignStepUp()">
                🔐 Dual-Sign 2nd Approval (MFA Required)
              </button>
            }
          </div>
        </admin-page-header>

        <!-- Four-Eyes Approval Flow Card -->
        <div class="approval-flow-card">
          <h3>👥 Four-Eyes Dual Authorization Status</h3>
          <div class="signers-grid">
            <div class="signer-box" [class.signed]="r.firstApprover">
              <div class="box-header">1st Signer (Support Lead)</div>
              @if (r.firstApprover) {
                <div class="signer-info font-mono">
                  <span class="signed-badge">✓ Authorized</span>
                  <span>{{ r.firstApprover.operatorName }}</span>
                  <span class="sign-time">{{ r.firstApprover.approvedAt | date:'medium' }}</span>
                </div>
              } @else {
                <div class="pending-text">Awaiting initial investigation sign-off</div>
              }
            </div>

            <div class="signer-box" [class.signed]="r.secondApprover" [class.required]="r.requiresDualSign">
              <div class="box-header">2nd Signer (Finance Officer)</div>
              @if (r.secondApprover) {
                <div class="signer-info font-mono">
                  <span class="signed-badge">✓ Dual Authorized</span>
                  <span>{{ r.secondApprover.operatorName }}</span>
                  <span class="sign-time">{{ r.secondApprover.approvedAt | date:'medium' }}</span>
                </div>
              } @else if (r.requiresDualSign) {
                <div class="pending-text warning">Required for transactions &gt; ₹5,000 (Step-Up MFA enforced)</div>
              } @else {
                <div class="pending-text neutral">Exempt (&le; ₹5,000)</div>
              }
            </div>
          </div>
        </div>

        <!-- Dispute Evidence & Rebuttal -->
        <div class="evidence-grid">
          <div class="evidence-box">
            <h4>Customer Claim & Statement</h4>
            <p class="claim-text">{{ r.customerClaim }}</p>
            <div class="evidence-photos">
              <span class="photo-placeholder">📷 Attached Photo Evidence (Customer Camera)</span>
            </div>
          </div>

          <div class="evidence-box">
            <h4>Merchant Defense / Counter-Statement</h4>
            <p class="claim-text">{{ r.merchantRebuttal || 'No counter-statement submitted by store owner.' }}</p>
            <div class="merchant-meta font-mono">
              <span>Order Ref: #{{ r.orderId }}</span>
              <span>Merchant ID: {{ r.merchantId }}</span>
            </div>
          </div>
        </div>

        <!-- Step-Up MFA Challenge Modal for Second Signer -->
        <admin-step-up-modal
          [isOpen]="stepUpOpen()"
          actionName="Authorize High-Value Refund"
          actionKey="admin:refunds:approve_high"
          (close)="stepUpOpen.set(false)"
          (verified)="onSecondSignStepUpVerified($event)">
        </admin-step-up-modal>
      </div>
    }
  `,
  styles: [`
    .refund-details-container { display: flex; flex-direction: column; gap: 16px; }
    .approval-flow-card {
      background: var(--admin-bg-surface); border: 1px solid var(--admin-border-subtle);
      border-radius: var(--admin-radius-md); padding: 20px; display: flex; flex-direction: column; gap: 14px;
      h3 { margin: 0; font-size: 1rem; color: var(--admin-text-primary); }
    }
    .signers-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
    @media (max-width: 768px) { .signers-grid { grid-template-columns: 1fr; } }
    .signer-box {
      background: var(--admin-bg-subtle); border: 1px dashed var(--admin-border-default);
      border-radius: var(--admin-radius-sm); padding: 16px; display: flex; flex-direction: column; gap: 8px;
      &.signed { border-style: solid; border-color: var(--admin-success); background: rgba(16, 185, 129, 0.05); }
      &.required { border-color: var(--admin-warning); }
    }
    .box-header { font-size: 0.75rem; text-transform: uppercase; color: var(--admin-text-muted); font-weight: 600; letter-spacing: 0.05em; }
    .signer-info { display: flex; flex-direction: column; gap: 4px; font-size: 0.8125rem; }
    .signed-badge { color: var(--admin-success); font-weight: bold; }
    .sign-time { font-size: 0.7rem; color: var(--admin-text-muted); }
    .pending-text { font-size: 0.8125rem; color: var(--admin-text-muted); &.warning { color: var(--admin-warning); } }
    .evidence-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
    @media (max-width: 768px) { .evidence-grid { grid-template-columns: 1fr; } }
    .evidence-box {
      background: var(--admin-bg-surface); border: 1px solid var(--admin-border-subtle);
      border-radius: var(--admin-radius-md); padding: 20px; display: flex; flex-direction: column; gap: 10px;
      h4 { margin: 0; font-size: 0.95rem; color: var(--admin-text-primary); }
    }
    .claim-text { font-size: 0.8125rem; color: var(--admin-text-secondary); line-height: 1.5; margin: 0; }
    .evidence-photos { padding: 16px; background: var(--admin-bg-subtle); border-radius: 4px; text-align: center; color: var(--admin-text-muted); font-size: 0.75rem; }
    .merchant-meta { display: flex; justify-content: space-between; font-size: 0.75rem; color: var(--admin-text-muted); border-top: 1px solid var(--admin-border-subtle); padding-top: 8px; }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RefundsDisputesDetailsPageComponent implements OnInit {
  private readonly repository = inject(RefundsDisputesRepository);
  private readonly sessionService = inject(AdminSessionService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  item = signal<RefundDisputeViewModel | null>(null);
  stepUpOpen = signal(false);

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id') || 'REF-NGP-781';
    this.repository.fetchById(id).subscribe((r) => this.item.set(r));
  }

  goBack(): void {
    this.router.navigate(['/refunds-disputes']);
  }

  authorizeFirstSign(): void {
    const r = this.item();
    const op = this.sessionService.currentOperator();
    if (!r || !op) return;

    this.repository.approveFirstSign(
      r.id,
      op.operatorId,
      op.name,
      'EVIDENCE_VERIFIED',
      'Initial customer complaint photo and timeline verified.'
    ).subscribe((updated) => {
      this.item.set(updated);
    });
  }

  promptSecondSignStepUp(): void {
    this.stepUpOpen.set(true);
  }

  onSecondSignStepUpVerified(stepUpTicket: string): void {
    this.stepUpOpen.set(false);
    const r = this.item();
    const op = this.sessionService.currentOperator();
    if (!r || !op) return;

    this.repository.approveSecondSign(
      r.id,
      op.operatorId,
      op.name,
      stepUpTicket,
      'Finance officer dual sign-off completed with Step-Up MFA.'
    ).subscribe((updated) => {
      this.item.set(updated);
    });
  }
}
