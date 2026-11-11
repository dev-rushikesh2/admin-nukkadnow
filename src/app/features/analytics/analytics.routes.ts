import { Routes } from '@angular/router';
import { AnalyticsListPageComponent } from './pages/analytics-list.page';
import { AnalyticsDetailsPageComponent } from './pages/analytics-details.page';

export const analyticsRoutes: Routes = [
  {
    path: '',
    component: AnalyticsListPageComponent
  },
  {
    path: ':id',
    component: AnalyticsDetailsPageComponent
  }
];
