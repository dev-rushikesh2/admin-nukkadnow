import { Routes } from '@angular/router';
import { FeatureFlagsListPageComponent } from './pages/feature-flags-list.page';
import { FeatureFlagsDetailsPageComponent } from './pages/feature-flags-details.page';

export const featureFlagsRoutes: Routes = [
  {
    path: '',
    component: FeatureFlagsListPageComponent
  },
  {
    path: ':id',
    component: FeatureFlagsDetailsPageComponent
  }
];
