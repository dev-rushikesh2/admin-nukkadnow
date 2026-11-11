import { CategoryViewModel } from '../models/categories-view.model';

export class CategoriesMapper {
  static toViewModel(dto: any): CategoryViewModel {
    return {
      id: dto.id || '',
      name: dto.name || dto.title || dto.businessName || dto.code || 'Record #' + dto.id,
      title: dto.title || dto.name || '',
      status: dto.status || 'ACTIVE',
      createdAt: dto.createdAt || new Date().toISOString(),
      updatedAt: dto.updatedAt,
      metadata: dto.metadata || {}
    };
  }
}
