export interface CategoryViewModel {
  id: string;
  name?: string;
  title?: string;
  status: string;
  createdAt: string;
  updatedAt?: string;
  metadata?: Record<string, unknown>;
}

export interface CategoryFilterCriteria {
  search?: string;
  status?: string;
  page?: number;
  limit?: number;
}
