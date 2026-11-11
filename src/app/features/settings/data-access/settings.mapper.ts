import { PlatformSettingViewModel } from '../models/settings-view.model';

export class SettingsMapper {
  static toViewModel(dto: any): PlatformSettingViewModel {
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
