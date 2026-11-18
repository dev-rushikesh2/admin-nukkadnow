import { Component, inject, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { SettingsStore } from '../state/settings.store';
import { PageHeaderComponent } from '@nukkadnow/admin-ui';
import { InrCurrencyPipe } from '../../../shared/pipes/inr-currency.pipe';

@Component({
  selector: 'admin-settings-details-page',
  standalone: true,
  imports: [CommonModule, PageHeaderComponent, InrCurrencyPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="details-page-container">
      <admin-page-header
        [title]="'Governance Policy: ' + id"
        subtitle="Active platform parameters, security limits, and statutory policies"
        breadcrumb="Console / Platform Governance / Platform Settings / Inspection">
        <div actions>
          <button class="admin-btn btn-secondary btn-sm" (click)="goBack()">← Back</button>
        </div>
      </admin-page-header>

      @if (store.settings(); as item) {
        <div class="details-grid">
          <div class="details-card">
            <h3>Active Operational Parameters</h3>
            <p><strong>Maintenance Status:</strong> {{ item.maintenanceMode ? 'ACTIVE (SYSTEM LOCKED)' : 'NORMAL (PLATFORM LIVE)' }}</p>
            <p><strong>Inactivity Lockout:</strong> {{ item.inactivityLockMinutes }} minutes</p>
            <p><strong>Enforce Step-Up MFA:</strong> {{ item.enforceMfa ? 'Yes (Mandatory)' : 'Disabled' }}</p>
            <p><strong>Minimum Password Length:</strong> {{ item.passwordMinLength }} characters</p>
            <p><strong>Support Hotline:</strong> {{ item.supportHotline }}</p>
            <p><strong>Compliance Email:</strong> {{ item.complianceEmail }}</p>
            <p><strong>Single-Sign Refund Ceiling:</strong> {{ item.autoApproveRefundThresholdPaise | inrCurrency }}</p>
            <p><strong>Dual-Sign Escalation Ceiling:</strong> {{ item.dualSignRefundThresholdPaise | inrCurrency }}</p>
          </div>
        </div>
      }
    </div>
  `,
  styles: [`
    .details-page-container { display: flex; flex-direction: column; gap: 16px; }
    .details-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 16px; }
    .details-card {
      background: var(--admin-bg-surface);
      border: 1px solid var(--admin-border-subtle);
      border-radius: var(--admin-radius-md);
      padding: 20px;
      display: flex;
      flex-direction: column;
      gap: 10px;

      h3 { margin: 0 0 8px 0; color: var(--admin-text-primary); }
      p { margin: 0; color: var(--admin-text-secondary); font-size: 0.875rem; }
    }
  `]
})
export class SettingsDetailsPageComponent implements OnInit {
  readonly store = inject(SettingsStore);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  id = '';

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id') || 'GLOBAL_SETTINGS';
    this.store.loadSettings();
  }

  goBack(): void {
    this.router.navigate(['/settings']);
  }
}
