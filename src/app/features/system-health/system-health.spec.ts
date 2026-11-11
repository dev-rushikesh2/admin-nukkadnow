import { SystemHealthStore } from './state/system-health.store';
import { SystemHealthRepository } from './data-access/system-health.repository';

describe('SystemHealth Feature', () => {
  it('should be defined', () => {
    expect(SystemHealthStore).toBeDefined();
    expect(SystemHealthRepository).toBeDefined();
  });
});
