import { Routes } from '@angular/router';
import { PlansPricingListPageComponent } from './pages/plans-pricing-list.page';
import { PlansPricingDetailsPageComponent } from './pages/plans-pricing-details.page';

export const plansPricingRoutes: Routes = [
  {
    path: '',
    component: PlansPricingListPageComponent
  },
  {
    path: ':id',
    component: PlansPricingDetailsPageComponent
  }
];
