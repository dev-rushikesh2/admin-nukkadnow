import { Component, inject, OnInit, ChangeDetectionStrategy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MerchantVerificationRepository } from '../data-access/merchant-verification.repository';
import { MerchantVerificationViewModel, KycDocumentItem } from '../models/merchant-verification-view.model';
import { PageHeaderComponent, BadgeComponent, ModalComponent } from '@nukkadnow/admin-ui';
import { AuditReasonDialogService } from '../../../core/audit-context/audit-reason-dialog.service';

@Component({
  selector: 'admin-merchant-verification-details-page',
  standalone: true,
  imports: [CommonModule, FormsModule, PageHeaderComponent, BadgeComponent, ModalComponent],
  template: `
    @if (item(); as kyc) {
      <div class="workbench-container">
        <admin-page-header
          [title]="'KYC Audit: ' + kyc.businessName"
          [subtitle]="'App ID: ' + kyc.id + ' · Legal: ' + kyc.legalEntityName + ' · Locality: ' + kyc.locality"
          breadcrumb="Console / Verification Queue / Audit Workbench">
          <div actions>
            <button class="admin-btn btn-secondary btn-sm" (click)="goBack()">← Back</button>

            @if (kyc.status !== 'VERIFIED' && kyc.status !== 'REJECTED') {
              <button class="admin-btn btn-danger btn-sm" (click)="reject()">
                ✕ Reject Application
              </button>
              <button class="admin-btn btn-primary btn-sm" (click)="approve()">
                ✓ Approve & Activate Seller
              </button>
            }
          </div>
        </admin-page-header>

        <!-- Status Result Alert -->
        @if (kyc.status === 'VERIFIED') {
          <div class="status-banner success">
            ✓ <strong>Merchant Approved:</strong> All statutory credentials verified. Seller account is active on NukkadNow.
          </div>
        } @else if (kyc.status === 'REJECTED') {
          <div class="status-banner danger">
            ✕ <strong>Merchant Application Rejected:</strong> {{ kyc.rejectionReason }}
          </div>
        }

        <!-- 2-Column Split Workbench -->
        <div class="workbench-grid">
          <!-- Column 1: Document Inspection Carousel & Tabs -->
          <div class="doc-panel">
            <h3>📑 Submitted Statutory Proofs</h3>

            <div class="doc-tabs">
              @for (doc of kyc.documents; track doc.type) {
                <button
                  type="button"
                  class="doc-tab-btn"
                  [class.active]="selectedDoc()?.type === doc.type"
                  (click)="selectedDoc.set(doc)">
                  {{ doc.title }}
                </button>
              }
            </div>

            @if (selectedDoc(); as doc) {
              <div class="doc-viewer-box">
                <div class="doc-meta-bar">
                  <span class="doc-name font-semibold">{{ doc.title }}</span>
                  @if (doc.documentNumber) {
                    <span class="doc-num font-mono">Reg #: {{ doc.documentNumber }}</span>
                  }
                </div>

                <div class="doc-preview-area">
                  <div class="mock-cert-box font-mono">
                    <div class="cert-header">GOVERNMENT OF INDIA / STATE OF MAHARASHTRA</div>
                    <div class="cert-title">{{ doc.title.toUpperCase() }}</div>
                    <div class="cert-body">
                      <div>Issued to: {{ kyc.legalEntityName }}</div>
                      <div>Locality: {{ kyc.locality }}, Nagpur</div>
                      <div>Doc Ref: {{ doc.documentNumber || 'PROOF-FILE-VERIFIED' }}</div>
                      <div class="cert-stamp">✓ DIGITAL SIGNATURE VERIFIED</div>
                    </div>
                  </div>
                </div>

                @if (doc.notes) {
                  <div class="doc-note-box">
                    💡 <strong>Operator Guideline:</strong> {{ doc.notes }}
                  </div>
                }
              </div>
            }
          </div>

          <!-- Column 2: Bank Penny-Drop Match & Verification Checks -->
          <div class="audit-panel">
            <h3>🏦 Automated IMPS Penny-Drop Verification</h3>

            <div class="penny-drop-card">
              <div class="match-indicator" [class.match]="kyc.bankPennyDrop.isMatch">
                <span class="indicator-icon">{{ kyc.bankPennyDrop.isMatch ? '✓' : '⚠️' }}</span>
                <span class="indicator-text">
                  {{ kyc.bankPennyDrop.isMatch ? 'Bank Name Match Confirmed (100% Match)' : 'Name Mismatch Alert' }}
                </span>
              </div>

              <div class="bank-details-grid">
                <div class="bank-row">
                  <span class="lbl">Registered Legal Name:</span>
                  <span class="val font-semibold">{{ kyc.bankPennyDrop.registeredBusinessName }}</span>
                </div>
                <div class="bank-row">
                  <span class="lbl">Bank Beneficiary Name:</span>
                  <span class="val font-mono font-semibold">{{ kyc.bankPennyDrop.beneficiaryNameMatch }}</span>
                </div>
                <div class="bank-row">
                  <span class="lbl">Bank & Branch:</span>
                  <span class="val">{{ kyc.bankPennyDrop.bankName }}</span>
                </div>
                <div class="bank-row">
                  <span class="lbl">Account Number:</span>
                  <span class="val font-mono">{{ kyc.bankPennyDrop.accountNumberMasked }}</span>
                </div>
                <div class="bank-row">
                  <span class="lbl">IFSC Code:</span>
                  <span class="val font-mono">{{ kyc.bankPennyDrop.ifscCode }}</span>
                </div>
                <div class="bank-row">
                  <span class="lbl">Reconciliation Time:</span>
                  <span class="val font-mono">{{ kyc.bankPennyDrop.verifiedAt | date:'medium' }}</span>
                </div>
              </div>
            </div>

            <!-- Operator Verification Checklist -->
            <div class="checklist-card">
              <h4>Compliance Sign-Off Checklist</h4>
              <label class="check-item">
                <input type="checkbox" [(ngModel)]="check1">
                <span>FSSAI / Food Safety certificate valid & matches address</span>
              </label>
              <label class="check-item">
                <input type="checkbox" [(ngModel)]="check2">
                <span>GSTIN structure verified against Maharashtra state code (27)</span>
              </label>
              <label class="check-item">
                <input type="checkbox" [(ngModel)]="check3">
                <span>Store GPS coordinates fall within pilot boundary (Nagpur)</span>
              </label>
            </div>
          </div>
        </div>
      </div>
    }
  `,
  styles: [`
    .workbench-container { display: flex; flex-direction: column; gap: 16px; }
    .status-banner {
      padding: 12px 16px; border-radius: var(--admin-radius-md); font-size: 0.875rem;
      &.success { background: var(--admin-success-subtle); color: var(--admin-success); border: 1px solid rgba(16, 185, 129, 0.3); }
      &.danger { background: var(--admin-danger-subtle); color: var(--admin-danger); border: 1px solid rgba(239, 68, 68, 0.3); }
    }
    .workbench-grid { display: grid; grid-template-columns: 1.2fr 0.8fr; gap: 16px; }
    @media (max-width: 1024px) { .workbench-grid { grid-template-columns: 1fr; } }
    .doc-panel, .audit-panel {
      background: var(--admin-bg-surface); border: 1px solid var(--admin-border-subtle);
      border-radius: var(--admin-radius-md); padding: 20px; display: flex; flex-direction: column; gap: 16px;
      h3 { margin: 0; font-size: 1rem; font-weight: 600; color: var(--admin-text-primary); }
    }
    .doc-tabs { display: flex; gap: 8px; flex-wrap: wrap; }
    .doc-tab-btn {
      background: var(--admin-bg-subtle); border: 1px solid var(--admin-border-default);
      color: var(--admin-text-secondary); padding: 6px 12px; border-radius: var(--admin-radius-sm);
      font-size: 0.75rem; cursor: pointer; transition: all 0.15s ease;
      &.active { background: var(--admin-primary-light); color: var(--admin-primary); border-color: var(--admin-primary); font-weight: 600; }
    }
    .doc-viewer-box {
      border: 1px solid var(--admin-border-default); border-radius: var(--admin-radius-sm);
      overflow: hidden; background: var(--admin-bg-canvas);
    }
    .doc-meta-bar {
      display: flex; justify-content: space-between; align-items: center; padding: 10px 14px;
      background: var(--admin-bg-subtle); border-bottom: 1px solid var(--admin-border-subtle); font-size: 0.8125rem;
    }
    .doc-preview-area { padding: 24px; display: flex; justify-content: center; }
    .mock-cert-box {
      background: var(--admin-bg-surface); border: 2px dashed var(--admin-border-strong); border-radius: var(--admin-radius-md);
      padding: 24px; width: 100%; max-width: 480px; text-align: center; box-shadow: var(--admin-shadow-sm);
      .cert-header { font-size: 0.7rem; color: var(--admin-text-muted); letter-spacing: 0.1em; }
      .cert-title { font-size: 1.1rem; font-weight: bold; margin: 12px 0; color: var(--admin-text-primary); }
      .cert-body { font-size: 0.8rem; line-height: 1.8; color: var(--admin-text-secondary); text-align: left; }
      .cert-stamp { text-align: center; margin-top: 16px; color: var(--admin-success); font-weight: bold; }
    }
    .doc-note-box {
      padding: 10px 14px; background: var(--admin-primary-light); border-top: 1px solid var(--admin-border-subtle);
      font-size: 0.75rem; color: var(--admin-primary);
    }
    .penny-drop-card {
      background: var(--admin-bg-subtle); border: 1px solid var(--admin-border-default);
      border-radius: var(--admin-radius-sm); padding: 16px; display: flex; flex-direction: column; gap: 12px;
    }
    .match-indicator {
      display: flex; align-items: center; gap: 8px; font-size: 0.8125rem; font-weight: 600;
      color: var(--admin-warning);
      &.match { color: var(--admin-success); }
    }
    .bank-details-grid { display: flex; flex-direction: column; gap: 8px; font-size: 0.8125rem; }
    .bank-row { display: flex; justify-content: space-between; .lbl { color: var(--admin-text-muted); } }
    .checklist-card {
      background: var(--admin-bg-subtle); border: 1px solid var(--admin-border-default);
      border-radius: var(--admin-radius-sm); padding: 16px; display: flex; flex-direction: column; gap: 10px;
      h4 { margin: 0; font-size: 0.875rem; color: var(--admin-text-primary); }
    }
    .check-item {
      display: flex; align-items: center; gap: 8px; font-size: 0.8125rem; color: var(--admin-text-secondary); cursor: pointer;
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MerchantVerificationDetailsPageComponent implements OnInit {
  private readonly repository = inject(MerchantVerificationRepository);
  private readonly auditDialog = inject(AuditReasonDialogService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  item = signal<MerchantVerificationViewModel | null>(null);
  selectedDoc = signal<KycDocumentItem | null>(null);

  check1 = true;
  check2 = true;
  check3 = true;

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id') || 'KYC-NGP-501';
    this.repository.fetchById(id).subscribe((v) => {
      this.item.set(v);
      if (v.documents.length > 0) {
        this.selectedDoc.set(v.documents[0]);
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/merchant-verification']);
  }

  approve(): void {
    const v = this.item();
    if (!v) return;

    this.repository.approveVerification(v.id, 'All statutory licenses and bank match confirmed.').subscribe((updated) => {
      this.item.set(updated);
    });
  }

  async reject(): Promise<void> {
    const v = this.item();
    if (!v) return;

    const res = await this.auditDialog.promptReason({
      actionName: `Reject KYC for ${v.businessName}`,
      targetEntityId: v.id,
      category: 'SUSPENSION',
      predefinedReasons: [
        { code: 'ILLEGIBLE_DOCUMENT', label: 'Uploaded document is unreadable / blurry' },
        { code: 'EXPIRED_FSSAI', label: 'FSSAI Food License validity has expired' },
        { code: 'NAME_MISMATCH', label: 'Beneficiary bank account name does not match legal entity' },
        { code: 'OUT_OF_BOUNDS_LOCATION', label: 'Store coordinates lie outside Nagpur pilot geofence' },
      ],
    });

    if (res.confirmed && res.reasonCode) {
      this.repository.rejectVerification(v.id, res.reasonCode, res.justification || '').subscribe((updated) => {
        this.item.set(updated);
      });
    }
  }
}
