export interface OverviewMetricViewModel {
  id: string;
  name?: string;
  title?: string;
  status: string;
  createdAt: string;
  updatedAt?: string;
  metadata?: Record<string, unknown>;
}

export interface OverviewMetricFilterCriteria {
  search?: string;
  status?: string;
  page?: number;
  limit?: number;
}
