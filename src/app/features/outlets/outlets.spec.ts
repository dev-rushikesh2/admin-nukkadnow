import { OutletsStore } from './state/outlets.store';
import { OutletsRepository } from './data-access/outlets.repository';

describe('Outlets Feature', () => {
  it('should be defined', () => {
    expect(OutletsStore).toBeDefined();
    expect(OutletsRepository).toBeDefined();
  });
});
