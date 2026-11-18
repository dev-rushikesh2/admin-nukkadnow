import { CategoryViewModel } from '../models/categories-view.model';

export class CategoriesMapper {
  static toViewModel(dto: any): CategoryViewModel {
    const defaultSubcats = [
      { id: 'sub-1', name: 'Fresh Seasonal', activeItems: 12 },
      { id: 'sub-2', name: 'Organic / Exotic', activeItems: 6 },
      { id: 'sub-3', name: 'Bulk Mandi Packs', activeItems: 6 }
    ];

    return {
      id: dto.id || '',
      name: dto.name || dto.title || 'Category #' + dto.id,
      code: dto.code || (dto.name ? dto.name.toUpperCase().replace(/[^A-Z0-9]/g, '_') : 'CAT_GENERAL'),
      emoji: dto.emoji || '📦',
      commissionPct: typeof dto.commissionPct === 'number' ? dto.commissionPct : (dto.commission || 5.0),
      gstSlabPct: typeof dto.gstSlabPct === 'number' ? dto.gstSlabPct : (dto.gst || 5),
      activeItems: typeof dto.activeItems === 'number' ? dto.activeItems : 24,
      subcategoriesCount: typeof dto.subcategoriesCount === 'number' ? dto.subcategoriesCount : 3,
      subcategories: dto.subcategories || defaultSubcats,
      status: dto.status || 'ACTIVE',
      createdAt: dto.createdAt || new Date().toISOString(),
      updatedAt: dto.updatedAt,
      metadata: dto.metadata || {}
    };
  }
}
