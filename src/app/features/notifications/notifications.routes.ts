import { Routes } from '@angular/router';
import { NotificationsListPageComponent } from './pages/notifications-list.page';
import { NotificationsDetailsPageComponent } from './pages/notifications-details.page';

export const notificationsRoutes: Routes = [
  {
    path: '',
    component: NotificationsListPageComponent
  },
  {
    path: ':id',
    component: NotificationsDetailsPageComponent
  }
];
