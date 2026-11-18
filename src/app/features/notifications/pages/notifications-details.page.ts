import { Component, inject, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { NotificationsStore } from '../state/notifications.store';
import { PageHeaderComponent, BadgeComponent } from '@nukkadnow/admin-ui';
import { NotificationsStatusChipComponent } from '../components/notifications-status-chip.component';
import { BroadcastNotificationViewModel } from '../models/notifications-view.model';
import { formatChannelBadge, formatAudienceLabel } from '../utils/notifications.utils';

@Component({
  selector: 'admin-notifications-details-page',
  standalone: true,
  imports: [
    CommonModule,
    PageHeaderComponent,
    BadgeComponent,
    NotificationsStatusChipComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="details-page-container">
      <admin-page-header
        [title]="'Campaign: ' + (store.selectedItem()?.name || id)"
        subtitle="Omnichannel delivery telemetry, delivery funnel breakdown, and payload audit"
        breadcrumb="Console / Customer Helpdesk / Broadcasts / Campaign Inspection">
        <div actions class="header-actions">
          <button class="admin-btn btn-secondary btn-sm" (click)="goBack()">← Back to Broadcasts</button>
        </div>
      </admin-page-header>

      @if (store.selectedItem(); as campaign) {
        <div class="details-layout">
          <!-- Left Column: Message Content & Simulated Device Preview -->
          <div class="card-column preview-card">
            <div class="channel-banner">
              <div class="chan-badge-group">
                <span class="chan-icon">{{ getChannel(campaign.channel).icon }}</span>
                <span class="badge" [ngClass]="'badge-' + getChannel(campaign.channel).variant">
                  {{ getChannel(campaign.channel).label }}
                </span>
                <admin-notifications-status-chip [status]="campaign.status"></admin-notifications-status-chip>
              </div>
              <span class="timestamp-text">{{ campaign.createdAt | date:'medium' }}</span>
            </div>

            <!-- Device Mockup Container -->
            <div class="device-preview-box">
              <div class="device-header">
                <span class="carrier">NukkadNow Broadcast Engine</span>
                <span class="signal-icons">●●● 5G</span>
              </div>
              <div class="message-bubble" [ngClass]="'bubble-' + campaign.channel.toLowerCase()">
                <div class="bubble-title">
                  <strong>NukkadNow Hyperlocal</strong>
                </div>
                <p class="bubble-text">{{ campaign.messageTemplate }}</p>
                <div class="bubble-time font-mono">
                  {{ campaign.sentAt || campaign.createdAt | date:'shortTime' }} ✓✓
                </div>
              </div>
            </div>

            <!-- Template Variables Reference -->
            <div class="template-tags-info">
              <h4>Resolved Dynamic Tags</h4>
              <div class="tags-list">
                <span class="tag-chip"><code>{{ '{' }}merchant_name{{ '}' }}</code> : Storefront Display Name</span>
                <span class="tag-chip"><code>{{ '{' }}customer_name{{ '}' }}</code> : Verified Consumer Name</span>
                <span class="tag-chip"><code>{{ '{' }}order_id{{ '}' }}</code> : Linked Pickup Order ID</span>
              </div>
            </div>
          </div>

          <!-- Right Column: Delivery Telemetry Funnel -->
          <div class="card-column metrics-card">
            <h3 class="section-title">Delivery Telemetry Funnel</h3>

            <div class="funnel-metrics">
              <div class="funnel-row">
                <span class="label">Total Target Endpoints:</span>
                <span class="value font-mono">{{ campaign.recipientCount | number }}</span>
              </div>
              <div class="funnel-row">
                <span class="label">Successfully Delivered:</span>
                <span class="value font-mono text-accent">
                  {{ (campaign.recipientCount - campaign.failureCount) | number }} ({{ campaign.deliveryRatePercent }}%)
                </span>
              </div>
              <div class="funnel-row">
                <span class="label">Bounced / Undelivered:</span>
                <span class="value font-mono text-danger">{{ campaign.failureCount | number }}</span>
              </div>
            </div>

            <div class="funnel-progress">
              <div class="bar-delivered" [style.width.%]="campaign.deliveryRatePercent"></div>
              <div class="bar-failed" [style.width.%]="100 - campaign.deliveryRatePercent"></div>
            </div>

            <div class="meta-section">
              <h3 class="section-title">Audience & Territory Targeting</h3>
              <p><strong>Audience Group:</strong> {{ campaign.targetAudience }}</p>
              <p><strong>Target Territory:</strong> 📍 {{ campaign.targetCity }} ({{ campaign.targetLocality }})</p>
              <p><strong>Resolved Rule:</strong> {{ getAudience(campaign) }}</p>
            </div>

            <div class="meta-section">
              <h3 class="section-title">Governance & Operator Attribution</h3>
              <p><strong>Dispatched By:</strong> {{ campaign.sentByOperatorName }}</p>
              <p><strong>Author Role:</strong> Platform Administrative Session</p>
              <p><strong>Audit Trail Status:</strong> <span class="badge badge-success">✓ Cryptographically Logged</span></p>
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
    }

    .details-layout {
      display: grid;
      grid-template-columns: 3fr 2fr;
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

    .channel-banner {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding-bottom: 16px;
      border-bottom: 1px solid var(--admin-border-subtle);

      .chan-badge-group {
        display: flex;
        align-items: center;
        gap: 8px;

        .chan-icon {
          font-size: 1.25rem;
        }
      }

      .timestamp-text {
        font-size: 0.8125rem;
        color: var(--admin-text-tertiary);
      }
    }

    .device-preview-box {
      background: var(--admin-bg-canvas);
      border: 2px solid var(--admin-border-subtle);
      border-radius: 20px;
      padding: 20px;
      max-width: 440px;
      margin: 0 auto;
      width: 100%;
      box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.05);

      .device-header {
        display: flex;
        justify-content: space-between;
        font-size: 0.6875rem;
        color: var(--admin-text-tertiary);
        margin-bottom: 16px;
        padding-bottom: 8px;
        border-bottom: 1px dashed var(--admin-border-subtle);
      }

      .message-bubble {
        background: var(--admin-bg-surface);
        border: 1px solid var(--admin-border-subtle);
        border-radius: 12px;
        padding: 14px 16px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);

        &.bubble-whatsapp {
          border-left: 4px solid #25d366;
        }

        &.bubble-sms {
          border-left: 4px solid var(--admin-info);
        }

        &.bubble-push {
          border-left: 4px solid var(--admin-warning);
        }

        .bubble-title {
          font-size: 0.8125rem;
          color: var(--admin-primary);
          margin-bottom: 6px;
        }

        .bubble-text {
          margin: 0 0 10px 0;
          font-size: 0.875rem;
          line-height: 1.5;
          color: var(--admin-text-primary);
        }

        .bubble-time {
          font-size: 0.6875rem;
          color: var(--admin-text-tertiary);
          text-align: right;
        }
      }
    }

    .template-tags-info {
      background: var(--admin-bg-canvas);
      border: 1px solid var(--admin-border-subtle);
      border-radius: var(--admin-radius-sm);
      padding: 14px 18px;

      h4 {
        margin: 0 0 8px 0;
        font-size: 0.8125rem;
        font-weight: 600;
        text-transform: uppercase;
        color: var(--admin-text-secondary);
      }

      .tags-list {
        display: flex;
        flex-direction: column;
        gap: 6px;

        .tag-chip {
          font-size: 0.8125rem;
          color: var(--admin-text-secondary);

          code {
            background: var(--admin-bg-surface);
            padding: 2px 6px;
            border-radius: 4px;
            color: var(--admin-primary);
          }
        }
      }
    }

    .metrics-card {
      .section-title {
        margin: 0;
        font-size: 0.9375rem;
        font-weight: 600;
        color: var(--admin-text-primary);
        text-transform: uppercase;
        letter-spacing: 0.04em;
      }

      .funnel-metrics {
        display: flex;
        flex-direction: column;
        gap: 10px;

        .funnel-row {
          display: flex;
          justify-content: space-between;
          font-size: 0.875rem;

          .label {
            color: var(--admin-text-secondary);
          }

          .value {
            font-weight: 600;
          }
        }
      }

      .funnel-progress {
        height: 10px;
        background: var(--admin-bg-canvas);
        border-radius: 9999px;
        overflow: hidden;
        display: flex;

        .bar-delivered {
          background: var(--admin-success);
          height: 100%;
        }

        .bar-failed {
          background: var(--admin-danger);
          height: 100%;
        }
      }

      .meta-section {
        display: flex;
        flex-direction: column;
        gap: 8px;
        padding-top: 16px;
        border-top: 1px solid var(--admin-border-subtle);

        p {
          margin: 0;
          font-size: 0.875rem;
          color: var(--admin-text-secondary);
        }
      }
    }
  `]
})
export class NotificationsDetailsPageComponent implements OnInit {
  readonly store = inject(NotificationsStore);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  id = '';

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id') || '';
    if (this.id) {
      this.store.loadById(this.id);
    }
  }

  getChannel(channel: string) {
    return formatChannelBadge(channel);
  }

  getAudience(item: BroadcastNotificationViewModel) {
    return formatAudienceLabel(item.targetAudience, item.targetCity, item.targetLocality);
  }

  goBack(): void {
    this.router.navigate(['/notifications']);
  }
}
