export interface PlatformSettingViewModel {
  id: string;
  name?: string;
  title?: string;
  status: string;
  createdAt: string;
  updatedAt?: string;
  metadata?: Record<string, unknown>;
}

export interface PlatformSettingFilterCriteria {
  search?: string;
  status?: string;
  page?: number;
  limit?: number;
}
