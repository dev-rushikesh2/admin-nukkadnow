import { SettingsStore } from './state/settings.store';
import { SettingsRepository } from './data-access/settings.repository';

describe('Settings Feature', () => {
  it('should be defined', () => {
    expect(SettingsStore).toBeDefined();
    expect(SettingsRepository).toBeDefined();
  });
});
