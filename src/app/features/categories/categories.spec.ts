import { CategoriesStore } from './state/categories.store';
import { CategoriesRepository } from './data-access/categories.repository';

describe('Categories Feature', () => {
  it('should be defined', () => {
    expect(CategoriesStore).toBeDefined();
    expect(CategoriesRepository).toBeDefined();
  });
});
