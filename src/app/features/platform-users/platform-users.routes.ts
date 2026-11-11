import { Routes } from '@angular/router';
import { PlatformUsersListPageComponent } from './pages/platform-users-list.page';
import { PlatformUsersDetailsPageComponent } from './pages/platform-users-details.page';

export const platformUsersRoutes: Routes = [
  {
    path: '',
    component: PlatformUsersListPageComponent
  },
  {
    path: ':id',
    component: PlatformUsersDetailsPageComponent
  }
];
