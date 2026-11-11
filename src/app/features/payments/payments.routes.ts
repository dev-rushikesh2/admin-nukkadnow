import { Routes } from '@angular/router';
import { PaymentsListPageComponent } from './pages/payments-list.page';
import { PaymentsDetailsPageComponent } from './pages/payments-details.page';

export const paymentsRoutes: Routes = [
  {
    path: '',
    component: PaymentsListPageComponent
  },
  {
    path: ':id',
    component: PaymentsDetailsPageComponent
  }
];
