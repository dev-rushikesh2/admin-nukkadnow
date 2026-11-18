import { Component, inject, OnInit, signal, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { SupportTicketsStore } from '../state/support-tickets.store';
import { PageHeaderComponent } from '@nukkadnow/admin-ui';
import { SupportTicketsStatusChipComponent } from '../components/support-tickets-status-chip.component';
import { SupportTicketViewModel } from '../models/support-tickets-view.model';

@Component({
  selector: 'admin-support-tickets-details-page',
  standalone: true,
  imports: [CommonModule, FormsModule, PageHeaderComponent, SupportTicketsStatusChipComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="details-page-container">
      <admin-page-header
        [title]="'Ticket ' + (store.selectedItem()?.ticketNumber || id) + ': ' + (store.selectedItem()?.subject || '')"
        subtitle="Customer & merchant dispute mediation, live messaging thread, and resolution audit"
        breadcrumb="Console / Customer Support / Ticket Resolution">
        <div actions>
          <button type="button" class="admin-btn btn-secondary btn-sm" (click)="goBack()">← Back to Helpdesk</button>
        </div>
      </admin-page-header>

      @if (store.selectedItem(); as item) {
        <div class="details-layout">
          <!-- Left: Incident Specification & Order Context -->
          <div class="details-card">
            <div class="card-head">
              <h3>Incident Context</h3>
              <admin-support-tickets-status-chip [status]="item.status"></admin-support-tickets-status-chip>
            </div>
            <div class="spec-grid">
              <div class="spec-item">
                <span class="label">Ticket Ref</span>
                <span class="value font-mono">{{ item.ticketNumber }}</span>
              </div>
              <div class="spec-item">
                <span class="label">Priority Rating</span>
                <span class="value font-semibold" [class.text-red]="item.priority === 'URGENT_P1'">
                  🚨 {{ item.priority }}
                </span>
              </div>
              <div class="spec-item">
                <span class="label">Requester Details</span>
                <span class="value font-semibold">{{ item.requesterName }} ({{ item.requesterType }})</span>
              </div>
              <div class="spec-item">
                <span class="label">Direct Contact</span>
                <span class="value font-mono">{{ item.requesterPhone }}</span>
              </div>
              <div class="spec-item">
                <span class="label">Municipal Territory</span>
                <span class="value">📍 {{ item.locality }}, {{ item.city }}</span>
              </div>
              <div class="spec-item">
                <span class="label">Assigned Staff</span>
                <span class="value">{{ item.assignedAgentName }}</span>
              </div>
              @if (item.linkedOrderId) {
                <div class="spec-item">
                  <span class="label">Linked Order ID</span>
                  <span class="value font-mono text-primary">{{ item.linkedOrderId }}</span>
                </div>
              }
              @if (item.linkedMerchantName) {
                <div class="spec-item">
                  <span class="label">Involved Merchant</span>
                  <span class="value font-semibold">{{ item.linkedMerchantName }}</span>
                </div>
              }
            </div>

            <!-- Resolution Controls -->
            <div class="resolution-box">
              <div class="card-head">
                <h3>Resolution Decision</h3>
              </div>
              <div class="form-group">
                <label>Update Resolution State</label>
                <select [(ngModel)]="newStatus" class="form-control">
                  <option value="OPEN">OPEN — Needs Attention</option>
                  <option value="INVESTIGATING">INVESTIGATING — Merchant Inquired</option>
                  <option value="ESCALATED">ESCALATED — High Priority Escalation</option>
                  <option value="RESOLVED">RESOLVED — Customer Satisfied</option>
                  <option value="CLOSED">CLOSED — Concluded</option>
                </select>
              </div>

              <div class="form-group">
                <label>Resolution Summary Notes *</label>
                <input
                  type="text"
                  [(ngModel)]="resolutionNotes"
                  placeholder="e.g. Coordinated with merchant, fresh batch dispatched"
                  class="form-control" />
              </div>

              <button
                type="button"
                class="admin-btn btn-primary btn-block"
                [disabled]="isUpdatingStatus()"
                (click)="applyStatusUpdate(item.id)">
                @if (isUpdatingStatus()) { Updating... } @else { Save Ticket State }
              </button>

              @if (statusUpdateSuccess()) {
                <div class="success-notice">
                  ✓ Support ticket state updated and logged to audit trail.
                </div>
              }
            </div>
          </div>

          <!-- Right: Interactive Messaging Thread -->
          <div class="details-card messaging-card">
            <div class="card-head">
              <h3>Live Support Conversation Thread</h3>
              <span class="sla-timer" [class.breached]="item.isSlaBreached">
                SLA: {{ item.isSlaBreached ? '⚠️ Breached' : 'Active (< 2 hrs)' }}
              </span>
            </div>

            <div class="messages-container">
              @for (msg of item.messages; track msg.id) {
                <div class="chat-bubble" [class.agent]="msg.senderRole === 'AGENT'" [class.internal]="msg.isInternal">
                  <div class="bubble-header">
                    <span class="sender-name">{{ msg.sender }}</span>
                    @if (msg.isInternal) {
                      <span class="internal-tag">Internal Operator Note</span>
                    }
                    <span class="msg-time">{{ msg.timestamp | date:'shortTime' }}</span>
                  </div>
                  <div class="bubble-body">
                    {{ msg.text }}
                  </div>
                </div>
              }
            </div>

            <!-- Reply Box -->
            <div class="reply-composer">
              <div class="reply-options">
                <label class="internal-check">
                  <input type="checkbox" [(ngModel)]="isInternalNote" />
                  <span>Log as Internal Staff Note (Invisible to Customer)</span>
                </label>
              </div>

              <div class="composer-row">
                <textarea
                  [(ngModel)]="replyMessage"
                  placeholder="Type your response to the customer or internal note..."
                  rows="2"
                  class="composer-input"></textarea>

                <button
                  type="button"
                  class="admin-btn"
                  [class.btn-primary]="!isInternalNote"
                  [class.btn-warning]="isInternalNote"
                  [disabled]="isSendingReply() || !replyMessage.trim()"
                  (click)="sendReply(item.id)">
                  @if (isSendingReply()) { Sending... } @else { Send }
                </button>
              </div>
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
      grid-template-columns: 1fr 1.25fr;
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

        .sla-timer {
          font-size: 0.8rem;
          font-weight: 600;
          padding: 3px 8px;
          border-radius: var(--admin-radius-full);
          background: rgba(22, 163, 74, 0.1);
          color: #16a34a;

          &.breached {
            background: rgba(220, 38, 38, 0.1);
            color: #dc2626;
          }
        }
      }
    }

    .spec-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 14px;

      .spec-item {
        display: flex;
        flex-direction: column;
        gap: 3px;

        .label {
          font-size: 0.75rem;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: var(--admin-text-muted);
          font-weight: 600;
        }

        .value {
          font-size: 0.9rem;
          color: var(--admin-text-primary);
          &.font-mono { font-family: monospace; }
          &.font-semibold { font-weight: 600; }
          &.text-primary { color: var(--admin-primary); }
          &.text-red { color: #dc2626; }
        }
      }
    }

    .resolution-box {
      margin-top: 10px;
      padding-top: 14px;
      border-top: 1px solid var(--admin-border-subtle);
      display: flex;
      flex-direction: column;
      gap: 12px;

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

      .btn-block { width: 100%; text-align: center; }

      .success-notice {
        padding: 8px 12px;
        background: rgba(22, 163, 74, 0.1);
        border: 1px solid rgba(22, 163, 74, 0.3);
        border-radius: var(--admin-radius-md);
        color: #16a34a;
        font-size: 0.82rem;
        font-weight: 500;
      }
    }

    .messaging-card {
      height: 600px;
      display: flex;
      flex-direction: column;

      .messages-container {
        flex: 1;
        overflow-y: auto;
        padding: 10px;
        background: var(--admin-bg-base);
        border: 1px solid var(--admin-border-subtle);
        border-radius: var(--admin-radius-md);
        display: flex;
        flex-direction: column;
        gap: 12px;

        .chat-bubble {
          max-width: 80%;
          padding: 10px 14px;
          border-radius: var(--admin-radius-md);
          background: var(--admin-bg-surface);
          border: 1px solid var(--admin-border-subtle);
          align-self: flex-start;

          &.agent {
            align-self: flex-end;
            background: rgba(37, 99, 235, 0.08);
            border-color: rgba(37, 99, 235, 0.25);
          }

          &.internal {
            align-self: center;
            max-width: 90%;
            background: rgba(217, 119, 6, 0.08);
            border-color: rgba(217, 119, 6, 0.25);
          }

          .bubble-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            gap: 8px;
            margin-bottom: 4px;

            .sender-name { font-size: 0.75rem; font-weight: 700; color: var(--admin-text-primary); }
            .internal-tag {
              font-size: 0.7rem;
              font-weight: 700;
              color: #d97706;
              text-transform: uppercase;
            }
            .msg-time { font-size: 0.7rem; color: var(--admin-text-muted); }
          }

          .bubble-body {
            font-size: 0.85rem;
            color: var(--admin-text-primary);
            line-height: 1.4;
          }
        }
      }

      .reply-composer {
        display: flex;
        flex-direction: column;
        gap: 8px;
        padding-top: 10px;

        .reply-options {
          .internal-check {
            display: flex;
            align-items: center;
            gap: 6px;
            font-size: 0.8rem;
            color: var(--admin-text-secondary);
            cursor: pointer;
          }
        }

        .composer-row {
          display: flex;
          gap: 10px;

          .composer-input {
            flex: 1;
            padding: 8px 12px;
            border: 1px solid var(--admin-border-subtle);
            border-radius: var(--admin-radius-md);
            background: var(--admin-bg-base);
            color: var(--admin-text-primary);
            font-size: 0.85rem;
            resize: none;
            &:focus { outline: none; border-color: var(--admin-primary); }
          }
        }
      }
    }
  `]
})
export class SupportTicketsDetailsPageComponent implements OnInit {
  readonly store = inject(SupportTicketsStore);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  id = '';
  newStatus = 'INVESTIGATING';
  resolutionNotes = '';
  replyMessage = '';
  isInternalNote = false;
  isUpdatingStatus = signal<boolean>(false);
  statusUpdateSuccess = signal<boolean>(false);
  isSendingReply = signal<boolean>(false);

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id') || '';
    if (this.id) {
      this.store.loadById(this.id);
    }
  }

  applyStatusUpdate(ticketId: string): void {
    this.isUpdatingStatus.set(true);
    this.statusUpdateSuccess.set(false);

    this.store.updateStatus(ticketId, this.newStatus, this.resolutionNotes || 'Operational resolution').subscribe({
      next: () => {
        this.isUpdatingStatus.set(false);
        this.statusUpdateSuccess.set(true);
        setTimeout(() => this.statusUpdateSuccess.set(false), 4000);
      },
      error: () => {
        this.isUpdatingStatus.set(false);
      }
    });
  }

  sendReply(ticketId: string): void {
    if (!this.replyMessage.trim()) return;

    this.isSendingReply.set(true);
    this.store.addMessage(ticketId, this.replyMessage.trim(), this.isInternalNote).subscribe({
      next: () => {
        this.isSendingReply.set(false);
        this.replyMessage = '';
      },
      error: () => {
        this.isSendingReply.set(false);
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/support-tickets']);
  }
}
