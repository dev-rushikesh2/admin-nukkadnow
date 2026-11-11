import { CatalogItemViewModel } from '../models/catalogue-moderation-view.model';

export class CatalogueModerationSelectors {
  static filterByStatus(items: CatalogItemViewModel[], status: string): CatalogItemViewModel[] {
    return items.filter(item => item.status.toLowerCase() === status.toLowerCase());
  }
}
