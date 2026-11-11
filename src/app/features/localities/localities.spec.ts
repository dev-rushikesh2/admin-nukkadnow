import { LocalitiesStore } from './state/localities.store';
import { LocalitiesRepository } from './data-access/localities.repository';

describe('Localities Feature', () => {
  it('should be defined', () => {
    expect(LocalitiesStore).toBeDefined();
    expect(LocalitiesRepository).toBeDefined();
  });
});
