import { Routes } from '@angular/router';
import { OverviewListPageComponent } from './pages/overview-list.page';
import { OverviewDetailsPageComponent } from './pages/overview-details.page';

export const overviewRoutes: Routes = [
  {
    path: '',
    component: OverviewListPageComponent
  },
  {
    path: ':id',
    component: OverviewDetailsPageComponent
  }
];
