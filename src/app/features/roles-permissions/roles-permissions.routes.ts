import { Routes } from '@angular/router';
import { RolesPermissionsListPageComponent } from './pages/roles-permissions-list.page';
import { RolesPermissionsDetailsPageComponent } from './pages/roles-permissions-details.page';

export const rolesPermissionsRoutes: Routes = [
  {
    path: '',
    component: RolesPermissionsListPageComponent
  },
  {
    path: ':id',
    component: RolesPermissionsDetailsPageComponent
  }
];
