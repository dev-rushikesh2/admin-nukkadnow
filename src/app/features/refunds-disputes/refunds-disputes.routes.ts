import { Routes } from '@angular/router';
import { RefundsDisputesListPageComponent } from './pages/refunds-disputes-list.page';
import { RefundsDisputesDetailsPageComponent } from './pages/refunds-disputes-details.page';

export const refundsDisputesRoutes: Routes = [
  {
    path: '',
    component: RefundsDisputesListPageComponent
  },
  {
    path: ':id',
    component: RefundsDisputesDetailsPageComponent
  }
];
