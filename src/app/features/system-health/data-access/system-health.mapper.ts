import { SystemHealthNodeViewModel } from '../models/system-health-view.model';

export class SystemHealthMapper {
  static toViewModel(dto: any): SystemHealthNodeViewModel {
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
