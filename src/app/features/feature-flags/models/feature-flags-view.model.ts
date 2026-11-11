export interface FeatureFlagViewModel {
  id: string;
  name?: string;
  title?: string;
  status: string;
  createdAt: string;
  updatedAt?: string;
  metadata?: Record<string, unknown>;
}

export interface FeatureFlagFilterCriteria {
  search?: string;
  status?: string;
  page?: number;
  limit?: number;
}
