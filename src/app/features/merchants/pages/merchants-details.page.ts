import { Component, inject, OnInit, ChangeDetectionStrategy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { MerchantsRepository } from '../data-access/merchants.repository';
import { MerchantViewModel } from '../models/merchants-view.model';
import { PageHeaderComponent, BadgeComponent, PiiMaskComponent } from '@nukkadnow/admin-ui';
import { StepUpModalComponent } from '../../../shared/components/step-up-modal/step-up-modal.component';
import { AuditReasonDialogService } from '../../../core/audit-context/audit-reason-dialog.service';
import { AdminPermission, AdminPermissions } from '@nukkadnow/admin-access-control';

@Component({
  selector: 'admin-merchants-details-page',
  standalone: true,
  imports: [CommonModule, PageHeaderComponent, BadgeComponent, PiiMaskComponent, StepUpModalComponent],
  template: `
    @if (merchant(); as m) {
      <div class="merchant-details-container">
        <admin-page-header
          [title]="m.name + ' (' + m.id + ')'"
          [subtitle]="'Legal Entity: ' + m.legalEntityName + ' · Locality: ' + m.locality"
          breadcrumb="Console / Merchants / Profile">
          <div actions>
            <button class="admin-btn btn-secondary btn-sm" (click)="goBack()">← Back to Directory</button>

            @if (m.status === 'ACTIVE') {
              <button class="admin-btn btn-danger btn-sm" (click)="initiateSuspension()">
                ⚠️ Suspend Merchant
              </button>
            } @else if (m.status === 'SUSPENDED') {
              <button class="admin-btn btn-primary btn-sm" (click)="activate()">
                ✓ Re-Activate Merchant
              </button>
            }
          </div>
        </admin-page-header>

        <!-- Suspension Banner if Suspended -->
        @if (m.status === 'SUSPENDED' && m.suspensionReason) {
          <div class="suspension-alert-banner">
            <span class="alert-icon">🚫</span>
            <div class="alert-text">
              <strong>Merchant is currently SUSPENDED from public discovery.</strong>
              <div>Reason: {{ m.suspensionReason }}</div>
            </div>
          </div>
        }

        <!-- Profile Grid -->
        <div class="profile-grid">
          <!-- Card 1: Business Identity & Mode -->
          <div class="info-card">
            <h3>🏢 Business Identity</h3>
            <div class="field-row">
              <span class="label">Operating Name:</span>
              <span class="val font-semibold">{{ m.name }}</span>
            </div>
            <div class="field-row">
              <span class="label">Legal Entity:</span>
              <span class="val">{{ m.legalEntityName }}</span>
            </div>
            <div class="field-row">
              <span class="label">Seller Mode:</span>
              <span class="val">
                <span class="badge badge-info">{{ m.mode }}</span>
              </span>
            </div>
            <div class="field-row">
              <span class="label">Status:</span>
              <span class="val">
                <span class="badge" [ngClass]="m.status === 'ACTIVE' ? 'badge-success' : 'badge-danger'">
                  {{ m.status }}
                </span>
              </span>
            </div>
            <div class="field-row">
              <span class="label">Joined Date:</span>
              <span class="val font-mono">{{ m.joinedAt | date:'mediumDate' }}</span>
            </div>
          </div>

          <!-- Card 2: Contact & Privacy Shield -->
          <div class="info-card">
            <h3>🔒 Contact & Address Privacy</h3>
            <div class="field-row">
              <span class="label">Owner Phone:</span>
              <span class="val">
                <admin-pii-mask [value]="m.phone" type="phone"></admin-pii-mask>
              </span>
            </div>
            <div class="field-row">
              <span class="label">Notification Email:</span>
              <span class="val font-mono">{{ m.email }}</span>
            </div>
            <div class="field-row">
              <span class="label">Nagpur Locality:</span>
              <span class="val font-semibold">{{ m.locality }}</span>
            </div>
            <div class="field-row">
              <span class="label">Address Shield:</span>
              <span class="val">
                @if (m.mode === 'HOME_MAKER') {
                  <span class="badge badge-security">Home Maker (Address Protected)</span>
                } @else {
                  <span class="badge badge-neutral">Commercial Storefront</span>
                }
              </span>
            </div>
            <div class="field-row">
              <span class="label">Physical Address:</span>
              <span class="val address-text">{{ m.address }}</span>
            </div>
          </div>

          <!-- Card 3: Regulatory Compliance -->
          <div class="info-card">
            <h3>📜 Regulatory & Licenses</h3>
            <div class="field-row">
              <span class="label">FSSAI Food License:</span>
              <span class="val font-mono">
                {{ m.fssaiNumber || 'Exempt / Not Applicable' }}
                @if (m.fssaiNumber) {
                  <span class="verified-tag">✓ Verified</span>
                }
              </span>
            </div>
            <div class="field-row">
              <span class="label">GSTIN:</span>
              <span class="val font-mono">
                {{ m.gstin || 'Composition / Unregistered' }}
              </span>
            </div>
            <div class="field-row">
              <span class="label">Active Outlets:</span>
              <span class="val font-semibold">{{ m.outletsCount }}</span>
            </div>
            <div class="field-row">
              <span class="label">Live Catalog Items:</span>
              <span class="val font-semibold">{{ m.activeProductsCount }}</span>
            </div>
          </div>
        </div>

        <!-- Step-Up MFA Challenge Modal -->
        <admin-step-up-modal
          [isOpen]="stepUpModalOpen()"
          actionName="Suspend Merchant"
          actionKey="admin:merchants:suspend"
          (close)="stepUpModalOpen.set(false)"
          (verified)="onStepUpVerified($event)">
        </admin-step-up-modal>
      </div>
    }
  `,
  styles: [`
    .merchant-details-container {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }
    .suspension-alert-banner {
      background: var(--admin-danger-subtle);
      border: 1px solid rgba(239, 68, 68, 0.4);
      color: var(--admin-danger);
      padding: 14px 18px;
      border-radius: var(--admin-radius-md);
      display: flex;
      align-items: center;
      gap: 12px;
      font-size: 0.875rem;
    }
    .profile-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
      gap: 16px;
    }
    .info-card {
      background: var(--admin-bg-surface);
      border: 1px solid var(--admin-border-subtle);
      border-radius: var(--admin-radius-md);
      padding: 20px;
      display: flex;
      flex-direction: column;
      gap: 12px;

      h3 {
        margin: 0 0 6px 0;
        font-size: 1rem;
        font-weight: 600;
        color: var(--admin-text-primary);
        border-bottom: 1px solid var(--admin-border-subtle);
        padding-bottom: 8px;
      }
    }
    .field-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      font-size: 0.8125rem;
      gap: 8px;

      .label {
        color: var(--admin-text-muted);
      }
      .val {
        color: var(--admin-text-primary);
        text-align: right;
      }
    }
    .verified-tag {
      color: var(--admin-success);
      font-size: 0.75rem;
      margin-left: 4px;
    }
    .address-text {
      max-width: 65%;
      word-break: break-word;
      font-size: 0.75rem;
      color: var(--admin-text-secondary);
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MerchantsDetailsPageComponent implements OnInit {
  private readonly repository = inject(MerchantsRepository);
  private readonly auditDialog = inject(AuditReasonDialogService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  merchant = signal<MerchantViewModel | null>(null);
  stepUpModalOpen = signal(false);

  private pendingSuspensionReason = '';
  private pendingSuspensionJustification = '';

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id') || 'MER-NGP-101';
    this.repository.fetchById(id).subscribe((m) => this.merchant.set(m));
  }

  goBack(): void {
    this.router.navigate(['/merchants']);
  }

  async initiateSuspension(): Promise<void> {
    const m = this.merchant();
    if (!m) return;

    // 1. Mandatory Audit Reason Dialog prompt
    const auditRes = await this.auditDialog.promptReason({
      actionName: `Suspend Merchant: ${m.name}`,
      targetEntityId: m.id,
      category: 'SUSPENSION',
      predefinedReasons: [
        { code: 'POLICY_VIOLATION', label: 'Breach of terms / food safety guidelines' },
        { code: 'SUSPECTED_FRAUD', label: 'Abnormal transaction surge / chargeback spike' },
        { code: 'CUSTOMER_ESCALATION', label: 'Unresolved repeat customer dispute' },
        { code: 'MERCHANT_REQUEST', label: 'Voluntary temporary store shutdown' },
      ],
    });

    if (!auditRes.confirmed || !auditRes.reasonCode) return;

    this.pendingSuspensionReason = auditRes.reasonCode;
    this.pendingSuspensionJustification = auditRes.justification || '';

    // 2. Trigger Step-Up MFA Challenge
    this.stepUpModalOpen.set(true);
  }

  onStepUpVerified(stepUpTicket: string): void {
    this.stepUpModalOpen.set(false);
    const m = this.merchant();
    if (!m) return;

    this.repository.suspendMerchant(
      m.id,
      this.pendingSuspensionReason,
      this.pendingSuspensionJustification,
      stepUpTicket
    ).subscribe((updated) => {
      this.merchant.set(updated);
    });
  }

  activate(): void {
    const m = this.merchant();
    if (!m) return;
    this.repository.activateMerchant(m.id).subscribe((updated) => {
      this.merchant.set(updated);
    });
  }
}
