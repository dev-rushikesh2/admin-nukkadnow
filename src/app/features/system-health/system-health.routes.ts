import { Routes } from '@angular/router';
import { SystemHealthListPageComponent } from './pages/system-health-list.page';
import { SystemHealthDetailsPageComponent } from './pages/system-health-details.page';

export const systemHealthRoutes: Routes = [
  {
    path: '',
    component: SystemHealthListPageComponent
  },
  {
    path: ':id',
    component: SystemHealthDetailsPageComponent
  }
];
