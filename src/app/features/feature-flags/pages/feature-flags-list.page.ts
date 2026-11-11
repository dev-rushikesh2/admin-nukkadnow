import { Component, inject, ChangeDetectionStrategy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PageHeaderComponent, BadgeComponent } from '@nukkadnow/admin-ui';
import { StepUpModalComponent } from '../../../shared/components/step-up-modal/step-up-modal.component';
import { AuditReasonDialogService } from '../../../core/audit-context/audit-reason-dialog.service';
import { AuditLoggerService } from '../../../core/audit-context/audit-logger.service';

interface CircuitBreakerFlag {
  key: string;
  name: string;
  description: string;
  enabled: boolean;
  category: 'CORE_ENGINE' | 'PAYMENTS' | 'LOCALITY';
  lastModifiedBy: string;
  lastModifiedAt: string;
}

@Component({
  selector: 'admin-feature-flags-list-page',
  standalone: true,
  imports: [CommonModule, PageHeaderComponent, BadgeComponent, StepUpModalComponent],
  template: `
    <div class="flags-page-container">
      <admin-page-header
        title="Feature Flags & Emergency Circuit Breakers"
        subtitle="Runtime platform kill-switches, locality canary controls, and payment gateway failovers"
        breadcrumb="Console / Platform Governance / Feature Flags">
        <div actions>
          <span class="badge badge-danger">Step-Up MFA Protected</span>
        </div>
      </admin-page-header>

      <div class="flags-grid">
        @for (flag of flags(); track flag.key) {
          <div class="flag-card" [class.active-alert]="!flag.enabled">
            <div class="flag-header">
              <div class="flag-title-area">
                <span class="flag-name">{{ flag.name }}</span>
                <span class="flag-key font-mono">{{ flag.key }}</span>
              </div>
              <button
                type="button"
                class="toggle-switch-btn"
                [class.on]="flag.enabled"
                (click)="initiateToggle(flag)">
                {{ flag.enabled ? 'ACTIVE (ON)' : 'DISABLED (OFF)' }}
              </button>
            </div>

            <p class="flag-desc">{{ flag.description }}</p>

            <div class="flag-footer font-mono">
              <span>Modified: {{ flag.lastModifiedAt | date:'medium' }}</span>
              <span>By: {{ flag.lastModifiedBy }}</span>
            </div>
          </div>
        }
      </div>

      <!-- Step-Up MFA Challenge Modal -->
      <admin-step-up-modal
        [isOpen]="stepUpOpen()"
        [actionName]="'Toggle Flag: ' + (pendingFlag()?.name || '')"
        actionKey="admin:feature_flags:toggle"
        (close)="stepUpOpen.set(false)"
        (verified)="onStepUpVerified($event)">
      </admin-step-up-modal>
    </div>
  `,
  styles: [`
    .flags-page-container { display: flex; flex-direction: column; gap: 16px; }
    .flags-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(360px, 1fr)); gap: 16px; }
    .flag-card {
      background: var(--admin-bg-surface); border: 1px solid var(--admin-border-subtle);
      border-radius: var(--admin-radius-md); padding: 20px; display: flex; flex-direction: column; gap: 12px;
      transition: all 0.15s ease;
      &.active-alert { border-color: var(--admin-danger); background: rgba(239, 68, 68, 0.05); }
    }
    .flag-header { display: flex; justify-content: space-between; align-items: flex-start; }
    .flag-title-area { display: flex; flex-direction: column; gap: 2px; }
    .flag-name { font-size: 0.95rem; font-weight: 600; color: var(--admin-text-primary); }
    .flag-key { font-size: 0.75rem; color: var(--admin-primary); }
    .toggle-switch-btn {
      padding: 6px 14px; border-radius: var(--admin-radius-full); font-size: 0.75rem; font-weight: bold;
      border: 1px solid var(--admin-border-default); background: var(--admin-bg-subtle); color: var(--admin-text-muted);
      cursor: pointer; transition: all 0.2s ease;
      &.on { background: var(--admin-success-subtle); color: var(--admin-success); border-color: rgba(16, 185, 129, 0.4); }
    }
    .flag-desc { font-size: 0.8125rem; color: var(--admin-text-secondary); line-height: 1.4; margin: 0; }
    .flag-footer {
      border-top: 1px solid var(--admin-border-subtle); padding-top: 8px; display: flex; justify-content: space-between;
      font-size: 0.7rem; color: var(--admin-text-muted);
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FeatureFlagsListPageComponent {
  private readonly auditDialog = inject(AuditReasonDialogService);
  private readonly auditLogger = inject(AuditLoggerService);

  flags = signal<CircuitBreakerFlag[]>([
    {
      key: 'system.ordering.enabled',
      name: 'Global Ordering Kill-Switch',
      description: 'Master switch controlling customer order placements across all Nagpur outlets. Disabling rejects new checkouts with friendly maintenance notice.',
      enabled: true,
      category: 'CORE_ENGINE',
      lastModifiedBy: 'Rushi (Platform Architect)',
      lastModifiedAt: '2026-11-01T10:00:00Z',
    },
    {
      key: 'payment.gateway.failover_to_backup',
      name: 'Payment Provider Failover',
      description: 'Force all checkout payment intents to route to secondary gateway (PhonePe/Cashfree) when primary gateway experiences latency spikes.',
      enabled: false,
      category: 'PAYMENTS',
      lastModifiedBy: 'Finance Lead (Vikram)',
      lastModifiedAt: '2026-11-05T14:30:00Z',
    },
    {
      key: 'locality.nagpur.weather_throttle',
      name: 'Nagpur Monsoon Delivery Throttle',
      description: 'Increases order pickup prep times by 20 minutes across Sadar and Dharampeth during severe rainstorm alerts.',
      enabled: false,
      category: 'LOCALITY',
      lastModifiedBy: 'Ops Dispatch',
      lastModifiedAt: '2026-11-08T18:00:00Z',
    },
  ]);

  stepUpOpen = signal(false);
  pendingFlag = signal<CircuitBreakerFlag | null>(null);
  private pendingReason = '';
  private pendingJustification = '';

  async initiateToggle(flag: CircuitBreakerFlag): Promise<void> {
    const actionLabel = flag.enabled ? 'DISABLE / ACTIVATE KILL-SWITCH' : 'ENABLE / RESTORE';

    const res = await this.auditDialog.promptReason({
      actionName: `${actionLabel}: ${flag.name}`,
      targetEntityId: flag.key,
      category: 'SECURITY',
      predefinedReasons: [
        { code: 'EMERGENCY_INCIDENT', label: 'Critical infrastructure failure / data corruption' },
        { code: 'PSP_OUTAGE', label: 'Payment gateway downtime detected' },
        { code: 'WEATHER_HAZARD', label: 'Severe rainfall / road blockage in Nagpur locality' },
        { code: 'SCHEDULED_DRILL', label: 'Disaster recovery failover simulation' },
      ],
    });

    if (res.confirmed && res.reasonCode) {
      this.pendingFlag.set(flag);
      this.pendingReason = res.reasonCode;
      this.pendingJustification = res.justification || '';
      this.stepUpOpen.set(true);
    }
  }

  onStepUpVerified(stepUpTicket: string): void {
    this.stepUpOpen.set(false);
    const flag = this.pendingFlag();
    if (!flag) return;

    flag.enabled = !flag.enabled;
    flag.lastModifiedAt = new Date().toISOString();
    flag.lastModifiedBy = 'Super-Admin Operator (Step-Up Authenticated)';

    this.flags.update((f) => [...f]);

    this.auditLogger.logAction({
      action: 'FEATURE_FLAG_TOGGLED',
      targetEntity: 'FeatureFlag',
      targetId: flag.key,
      reasonCode: this.pendingReason,
      justification: this.pendingJustification,
      metadata: { newState: flag.enabled, stepUpTicket: stepUpTicket.slice(0, 8) + '...' },
    });
  }
}
