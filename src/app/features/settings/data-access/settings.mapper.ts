import { PlatformSettingViewModel } from '../models/settings-view.model';

export class SettingsMapper {
  static toViewModel(dto: any): PlatformSettingViewModel {
    return {
      id: dto.id || 'GLOBAL_SETTINGS',
      maintenanceMode: Boolean(dto.maintenanceMode),
      maintenanceBanner: dto.maintenanceBanner || 'Platform undergoing scheduled maintenance. Store services will resume shortly.',
      inactivityLockMinutes: Number(dto.inactivityLockMinutes) || 15,
      enforceMfa: dto.enforceMfa !== false,
      passwordMinLength: Number(dto.passwordMinLength) || 10,
      supportHotline: dto.supportHotline || '+91 712 298 0000',
      complianceEmail: dto.complianceEmail || 'compliance@nukkadnow.com',
      maxCancellationWindowMins: Number(dto.maxCancellationWindowMins) || 5,
      autoApproveRefundThresholdPaise: Number(dto.autoApproveRefundThresholdPaise) || 50000,
      dualSignRefundThresholdPaise: Number(dto.dualSignRefundThresholdPaise) || 500000,
      name: 'Global Platform Governance Policies',
      title: 'Platform Governance Settings',
      status: dto.maintenanceMode ? 'MAINTENANCE_ACTIVE' : 'OPERATIONAL',
      createdAt: dto.createdAt || new Date().toISOString(),
      updatedAt: dto.updatedAt,
      metadata: dto.metadata || {},
    };
  }
}
