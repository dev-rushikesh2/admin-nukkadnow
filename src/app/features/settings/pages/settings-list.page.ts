import { Component, inject, OnInit, ChangeDetectionStrategy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SettingsStore } from '../state/settings.store';
import { PageHeaderComponent, BadgeComponent } from '@nukkadnow/admin-ui';
import { InrCurrencyPipe } from '../../../shared/pipes/inr-currency.pipe';
import { AdminSessionService } from '../../../core/auth/session.service';

@Component({
  selector: 'admin-settings-list-page',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    PageHeaderComponent,
    BadgeComponent,
    InrCurrencyPipe,
  ],
  templateUrl: './settings-list.page.html',
  styleUrls: ['./settings-list.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SettingsListPageComponent implements OnInit {
  readonly store = inject(SettingsStore);
  readonly sessionService = inject(AdminSessionService);

  // Form State
  maintenanceMode = false;
  maintenanceBanner = '';
  inactivityLockMinutes = 15;
  enforceMfa = true;
  passwordMinLength = 10;
  supportHotline = '';
  complianceEmail = '';
  maxCancellationWindowMins = 5;
  autoApproveRefundThresholdRupees = 500;
  dualSignRefundThresholdRupees = 5000;

  // Save Confirmation Modal
  showSaveModal = signal<boolean>(false);
  saveAuditReason = 'OPERATIONAL_POLICY_UPDATE';
  saveJustification = '';
  isSavedToast = signal<boolean>(false);

  ngOnInit(): void {
    this.store.loadSettings();
    // Watch for settings changes and populate form
    const current = this.store.settings();
    if (current) {
      this.populateForm(current);
    }
  }

  populateForm(data: any): void {
    this.maintenanceMode = data.maintenanceMode;
    this.maintenanceBanner = data.maintenanceBanner;
    this.inactivityLockMinutes = data.inactivityLockMinutes;
    this.enforceMfa = data.enforceMfa;
    this.passwordMinLength = data.passwordMinLength;
    this.supportHotline = data.supportHotline;
    this.complianceEmail = data.complianceEmail;
    this.maxCancellationWindowMins = data.maxCancellationWindowMins;
    this.autoApproveRefundThresholdRupees = Math.round((data.autoApproveRefundThresholdPaise || 50000) / 100);
    this.dualSignRefundThresholdRupees = Math.round((data.dualSignRefundThresholdPaise || 500000) / 100);
  }

  refresh(): void {
    this.store.loadSettings();
  }

  openSaveDialog(): void {
    this.saveJustification = '';
    this.showSaveModal.set(true);
  }

  closeSaveDialog(): void {
    this.showSaveModal.set(false);
  }

  confirmSave(): void {
    const payload = {
      maintenanceMode: this.maintenanceMode,
      maintenanceBanner: this.maintenanceBanner,
      inactivityLockMinutes: Number(this.inactivityLockMinutes),
      enforceMfa: this.enforceMfa,
      passwordMinLength: Number(this.passwordMinLength),
      supportHotline: this.supportHotline,
      complianceEmail: this.complianceEmail,
      maxCancellationWindowMins: Number(this.maxCancellationWindowMins),
      autoApproveRefundThresholdPaise: this.autoApproveRefundThresholdRupees * 100,
      dualSignRefundThresholdPaise: this.dualSignRefundThresholdRupees * 100,
    };

    this.store.saveSettings(payload, this.saveAuditReason).subscribe(() => {
      this.closeSaveDialog();
      this.isSavedToast.set(true);
      setTimeout(() => this.isSavedToast.set(false), 3000);
    });
  }
}
