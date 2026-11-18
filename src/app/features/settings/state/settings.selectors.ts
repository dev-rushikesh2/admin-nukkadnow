import { PlatformSettingViewModel } from '../models/settings-view.model';

export class SettingsSelectors {
  static filterByStatus(items: PlatformSettingViewModel[], status: string): PlatformSettingViewModel[] {
    return items.filter(item => (item.status || '').toLowerCase() === status.toLowerCase());
  }
}
