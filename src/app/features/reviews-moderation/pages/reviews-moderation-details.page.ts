import { Component, inject, OnInit, ChangeDetectionStrategy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ReviewsModerationStore } from '../state/reviews-moderation.store';
import { PageHeaderComponent, BadgeComponent } from '@nukkadnow/admin-ui';
import { ReviewsModerationStatusChipComponent } from '../components/reviews-moderation-status-chip.component';
import { formatSentimentBadge } from '../utils/reviews-moderation.utils';
import { PiiMaskPipe } from '../../../shared/pipes/pii-mask.pipe';

@Component({
  selector: 'admin-reviews-moderation-details-page',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    PageHeaderComponent,
    BadgeComponent,
    ReviewsModerationStatusChipComponent,
    PiiMaskPipe,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="details-page-container">
      <admin-page-header
        [title]="'Review Moderation: #' + id"
        subtitle="Full audit trail, evidence inspection, and seller rebuttal evaluation"
        breadcrumb="Console / Customer Helpdesk / Reviews Moderation / Inspection">
        <div actions class="header-actions">
          <button class="admin-btn btn-secondary btn-sm" (click)="goBack()">← Back to List</button>
          @if (store.selectedItem()?.status !== 'APPROVED') {
            <button class="admin-btn btn-primary btn-sm" (click)="updateStatus('APPROVED')">
              ✓ Approve Review
            </button>
          }
          @if (store.selectedItem()?.status !== 'REMOVED') {
            <button class="admin-btn btn-danger btn-sm" (click)="openTakedownDialog()">
              ✕ Takedown / Hide Review
            </button>
          }
        </div>
      </admin-page-header>

      @if (store.selectedItem(); as review) {
        <div class="details-layout">
          <!-- Main Review Card -->
          <div class="card-column main-card">
            <div class="review-meta-banner">
              <div class="stars-score">
                <span class="stars-val">{{ review.rating }} ★</span>
                <span class="stars-label">out of 5.0</span>
              </div>
              <div class="sentiment-area">
                <span class="badge" [ngClass]="'badge-' + getSentiment(review.sentiment).variant">
                  {{ getSentiment(review.sentiment).label }}
                </span>
                <admin-reviews-moderation-status-chip [status]="review.status"></admin-reviews-moderation-status-chip>
              </div>
            </div>

            <div class="section-block">
              <h3 class="section-title">Customer Feedback Verbatim</h3>
              <div class="review-quote-box">
                <p class="quote-text">"{{ review.comment }}"</p>
                <div class="quote-footer">
                  <span>Author: <strong>{{ review.customerName }}</strong></span>
                  @if (review.customerPhone) {
                    <span class="phone-tag font-mono">
                      📞 {{ review.customerPhone | piiMask:'phone' }}
                    </span>
                  }
                  <span class="date-tag">{{ review.createdAt | date:'medium' }}</span>
                </div>
              </div>
            </div>

            <!-- Photos Gallery -->
            <div class="section-block">
              <h3 class="section-title">Attached Photo Evidence</h3>
              @if (review.photos && review.photos.length > 0) {
                <div class="photos-grid">
                  @for (photo of review.photos; track photo) {
                    <div class="photo-item">
                      <div class="photo-placeholder">
                        <span class="photo-icon">📷</span>
                        <span class="photo-name">{{ photo }}</span>
                      </div>
                    </div>
                  }
                </div>
              } @else {
                <p class="empty-note">No photos attached by customer for this review.</p>
              }
            </div>

            <!-- Merchant Counter-Rebuttal -->
            <div class="section-block">
              <h3 class="section-title">Merchant Counter-Response & Rebuttal</h3>
              @if (review.merchantRebuttal) {
                <div class="rebuttal-box">
                  <div class="rebuttal-header">
                    <span class="store-icon">🏪</span>
                    <strong>{{ review.merchantName }} (Store Manager Response):</strong>
                  </div>
                  <p class="rebuttal-body">"{{ review.merchantRebuttal }}"</p>
                </div>
              } @else {
                <div class="empty-rebuttal-box">
                  <p>Store has not filed an official counter-response or dispute.</p>
                </div>
              }
            </div>

            <!-- Takedown Reason if applicable -->
            @if (review.auditReason) {
              <div class="section-block audit-notice">
                <h3 class="section-title text-danger">Recorded Moderation Enforcement Reason</h3>
                <p class="audit-reason-text"><strong>Reason:</strong> {{ review.auditReason }}</p>
              </div>
            }
          </div>

          <!-- Sidebar Metadata Card -->
          <div class="card-column sidebar-card">
            <div class="meta-section">
              <h3 class="section-title">Target Storefront</h3>
              <p><strong>Merchant:</strong> {{ review.merchantName }}</p>
              <p><strong>Merchant ID:</strong> <span class="font-mono text-accent">{{ review.merchantId }}</span></p>
              <p><strong>City:</strong> 📍 {{ review.city }}</p>
              <p><strong>Locality:</strong> {{ review.locality }}</p>
            </div>

            <div class="meta-section">
              <h3 class="section-title">Transaction Snapshot</h3>
              <p><strong>Verified Purchase:</strong> {{ review.verifiedPurchase ? 'Yes (Verified Order)' : 'No (Public Walk-In)' }}</p>
              @if (review.orderId) {
                <p><strong>Linked Order:</strong> <span class="font-mono text-primary">{{ review.orderId }}</span></p>
              }
            </div>

            <div class="meta-section">
              <h3 class="section-title">Moderation Compliance</h3>
              <p class="policy-help">
                All customer reviews are protected under consumer rights legislation unless they involve
                verified profanity, commercial spam, false defamation, or competitor manipulation.
              </p>
            </div>
          </div>
        </div>
      }

      <!-- Takedown Modal -->
      @if (showTakedownModal()) {
        <div class="modal-backdrop" (click)="closeTakedownModal()">
          <div class="modal-dialog" (click)="$event.stopPropagation()">
            <div class="modal-header">
              <h3>Hide Review from Public Listing</h3>
              <button class="close-x" (click)="closeTakedownModal()">✕</button>
            </div>
            <div class="modal-body">
              <p>
                Please specify the compliance justification for hiding this review.
              </p>
              <div class="form-group">
                <label class="form-label">Violation Category:</label>
                <select class="admin-input" [(ngModel)]="takedownReason">
                  <option value="COMMUNITY_POLICY_VIOLATION">Community Standards Violation</option>
                  <option value="PROFANITY_OR_ABUSE">Profanity or Abusive Language</option>
                  <option value="SPAM_OR_BOT_CAMPAIGN">Spam / External URLs</option>
                  <option value="MISLEADING_NON_VERIFIED">False Review / Fake Account</option>
                  <option value="RESOLVED_WITH_REFUND">Dispute Amicably Settled</option>
                </select>
              </div>
              <div class="form-group">
                <label class="form-label">Mandatory Audit Justification:</label>
                <textarea
                  class="admin-input"
                  rows="3"
                  placeholder="Explain why this review violates platform terms..."
                  [(ngModel)]="takedownJustification">
                </textarea>
              </div>
            </div>
            <div class="modal-footer">
              <button class="admin-btn btn-secondary btn-sm" (click)="closeTakedownModal()">Cancel</button>
              <button
                class="admin-btn btn-danger btn-sm"
                [disabled]="!takedownJustification.trim()"
                (click)="confirmTakedown()">
                Confirm Takedown
              </button>
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

    .header-actions {
      display: flex;
      gap: 10px;
      align-items: center;
    }

    .details-layout {
      display: grid;
      grid-template-columns: 2fr 1fr;
      gap: 20px;

      @media (max-width: 900px) {
        grid-template-columns: 1fr;
      }
    }

    .card-column {
      background: var(--admin-bg-surface);
      border: 1px solid var(--admin-border-subtle);
      border-radius: var(--admin-radius-md);
      padding: 24px;
      display: flex;
      flex-direction: column;
      gap: 20px;
    }

    .review-meta-banner {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding-bottom: 16px;
      border-bottom: 1px solid var(--admin-border-subtle);

      .stars-score {
        display: flex;
        align-items: baseline;
        gap: 8px;

        .stars-val {
          font-size: 2rem;
          font-weight: 800;
          color: #f59e0b;
        }

        .stars-label {
          font-size: 0.875rem;
          color: var(--admin-text-tertiary);
        }
      }

      .sentiment-area {
        display: flex;
        align-items: center;
        gap: 8px;
      }
    }

    .section-block {
      display: flex;
      flex-direction: column;
      gap: 10px;

      .section-title {
        margin: 0;
        font-size: 0.9375rem;
        font-weight: 600;
        color: var(--admin-text-primary);
        text-transform: uppercase;
        letter-spacing: 0.04em;
      }

      &.audit-notice {
        background: rgba(239, 68, 68, 0.08);
        border: 1px solid rgba(239, 68, 68, 0.2);
        padding: 14px 18px;
        border-radius: var(--admin-radius-md);

        .audit-reason-text {
          margin: 0;
          color: var(--admin-danger);
          font-size: 0.875rem;
        }
      }
    }

    .review-quote-box {
      background: var(--admin-bg-canvas);
      border-left: 4px solid var(--admin-primary);
      padding: 16px 20px;
      border-radius: var(--admin-radius-sm);

      .quote-text {
        font-size: 1.0625rem;
        line-height: 1.5;
        font-style: italic;
        color: var(--admin-text-primary);
        margin: 0 0 12px 0;
      }

      .quote-footer {
        display: flex;
        flex-wrap: wrap;
        gap: 16px;
        font-size: 0.8125rem;
        color: var(--admin-text-secondary);

        .phone-tag {
          color: var(--admin-text-tertiary);
        }

        .date-tag {
          margin-left: auto;
          color: var(--admin-text-tertiary);
        }
      }
    }

    .photos-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
      gap: 12px;

      .photo-placeholder {
        background: var(--admin-bg-canvas);
        border: 1px dashed var(--admin-border-subtle);
        border-radius: var(--admin-radius-sm);
        padding: 20px;
        text-align: center;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 6px;

        .photo-icon {
          font-size: 1.5rem;
        }

        .photo-name {
          font-size: 0.75rem;
          color: var(--admin-text-tertiary);
          word-break: break-all;
        }
      }
    }

    .empty-note {
      font-size: 0.8125rem;
      color: var(--admin-text-tertiary);
      font-style: italic;
      margin: 0;
    }

    .rebuttal-box {
      background: var(--admin-bg-canvas);
      border: 1px solid var(--admin-border-subtle);
      border-radius: var(--admin-radius-sm);
      padding: 16px;

      .rebuttal-header {
        display: flex;
        align-items: center;
        gap: 8px;
        margin-bottom: 8px;
        color: var(--admin-text-primary);
        font-size: 0.875rem;
      }

      .rebuttal-body {
        margin: 0;
        font-size: 0.875rem;
        line-height: 1.5;
        color: var(--admin-text-secondary);
      }
    }

    .empty-rebuttal-box {
      background: var(--admin-bg-canvas);
      padding: 14px;
      border-radius: var(--admin-radius-sm);
      color: var(--admin-text-tertiary);
      font-size: 0.8125rem;

      p {
        margin: 0;
      }
    }

    .sidebar-card {
      .meta-section {
        display: flex;
        flex-direction: column;
        gap: 8px;
        padding-bottom: 16px;
        border-bottom: 1px solid var(--admin-border-subtle);

        &:last-child {
          border-bottom: none;
        }

        p {
          margin: 0;
          font-size: 0.875rem;
          color: var(--admin-text-secondary);
        }

        .policy-help {
          font-size: 0.8125rem;
          color: var(--admin-text-tertiary);
          line-height: 1.4;
        }
      }
    }

    .modal-backdrop {
      position: fixed;
      inset: 0;
      background: rgba(0, 0, 0, 0.55);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 999;

      .modal-dialog {
        background: var(--admin-bg-surface);
        border: 1px solid var(--admin-border-subtle);
        border-radius: var(--admin-radius-md);
        width: 90%;
        max-width: 500px;
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);

        .modal-header {
          padding: 16px 20px;
          border-bottom: 1px solid var(--admin-border-subtle);
          display: flex;
          align-items: center;
          justify-content: space-between;

          h3 {
            margin: 0;
            font-size: 1.0625rem;
            color: var(--admin-text-primary);
          }

          .close-x {
            background: none;
            border: none;
            font-size: 1.125rem;
            cursor: pointer;
            color: var(--admin-text-tertiary);
          }
        }

        .modal-body {
          padding: 20px;
          display: flex;
          flex-direction: column;
          gap: 16px;

          .form-group {
            display: flex;
            flex-direction: column;
            gap: 6px;

            .form-label {
              font-size: 0.8125rem;
              font-weight: 600;
              color: var(--admin-text-primary);
            }
          }
        }

        .modal-footer {
          padding: 14px 20px;
          border-top: 1px solid var(--admin-border-subtle);
          display: flex;
          justify-content: flex-end;
          gap: 10px;
          background: var(--admin-bg-canvas);
        }
      }
    }
  `]
})
export class ReviewsModerationDetailsPageComponent implements OnInit {
  readonly store = inject(ReviewsModerationStore);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  id = '';
  showTakedownModal = signal<boolean>(false);
  takedownReason = 'COMMUNITY_POLICY_VIOLATION';
  takedownJustification = '';

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id') || '';
    if (this.id) {
      this.store.loadById(this.id);
    }
  }

  getSentiment(sentiment: string) {
    return formatSentimentBadge(sentiment);
  }

  goBack(): void {
    this.router.navigate(['/reviews-moderation']);
  }

  updateStatus(status: string): void {
    this.store.updateStatus(this.id, status, 'OPERATOR_REVIEW_ACTION').subscribe();
  }

  openTakedownDialog(): void {
    this.takedownJustification = '';
    this.showTakedownModal.set(true);
  }

  closeTakedownModal(): void {
    this.showTakedownModal.set(false);
  }

  confirmTakedown(): void {
    this.store.updateStatus(this.id, 'REMOVED', `${this.takedownReason}: ${this.takedownJustification}`).subscribe(() => {
      this.closeTakedownModal();
    });
  }
}
