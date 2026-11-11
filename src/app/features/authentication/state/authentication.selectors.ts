import { AuthenticationViewModel } from '../models/authentication-view.model';

export class AuthenticationSelectors {
  static filterByStatus(items: AuthenticationViewModel[], status: string): AuthenticationViewModel[] {
    return items.filter(item => item.status.toLowerCase() === status.toLowerCase());
  }
}
