import { LocalityViewModel } from '../models/localities-view.model';

export class LocalitiesSelectors {
  static filterByStatus(items: LocalityViewModel[], status: string): LocalityViewModel[] {
    return items.filter(item => item.status.toLowerCase() === status.toLowerCase());
  }
}
