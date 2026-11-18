export interface CategoryViewModel {
  id: string;
  name: string;
  code: string;
  emoji: string;
  commissionPct: number;
  gstSlabPct: number;
  activeItems: number;
  subcategoriesCount: number;
  subcategories?: { id: string; name: string; activeItems: number }[];
  status: 'ACTIVE' | 'ARCHIVED' | 'DRAFT';
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
