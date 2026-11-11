import { Routes } from '@angular/router';
import { SubscriptionsListPageComponent } from './pages/subscriptions-list.page';
import { SubscriptionsDetailsPageComponent } from './pages/subscriptions-details.page';

export const subscriptionsRoutes: Routes = [
  {
    path: '',
    component: SubscriptionsListPageComponent
  },
  {
    path: ':id',
    component: SubscriptionsDetailsPageComponent
  }
];
