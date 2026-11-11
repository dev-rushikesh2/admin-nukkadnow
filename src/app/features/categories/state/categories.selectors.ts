import { CategoryViewModel } from '../models/categories-view.model';

export class CategoriesSelectors {
  static filterByStatus(items: CategoryViewModel[], status: string): CategoryViewModel[] {
    return items.filter(item => item.status.toLowerCase() === status.toLowerCase());
  }
}
