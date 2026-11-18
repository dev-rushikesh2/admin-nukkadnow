export interface PlatformSettingViewModel {
  id?: string;
  maintenanceMode: boolean;
  maintenanceBanner: string;
  inactivityLockMinutes: number;
  enforceMfa: boolean;
  passwordMinLength: number;
  supportHotline: string;
  complianceEmail: string;
  maxCancellationWindowMins: number;
  autoApproveRefundThresholdPaise: number;
  dualSignRefundThresholdPaise: number;
  name?: string;
  title?: string;
  status: string;
  createdAt?: string;
  updatedAt?: string;
  metadata?: Record<string, unknown>;
}

export interface PlatformSettingFilterCriteria {
  search?: string;
  status?: string;
  page?: number;
  limit?: number;
}
