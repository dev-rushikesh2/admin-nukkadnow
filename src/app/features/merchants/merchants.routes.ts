import { Routes } from '@angular/router';
import { MerchantsListPageComponent } from './pages/merchants-list.page';
import { MerchantsDetailsPageComponent } from './pages/merchants-details.page';

export const merchantsRoutes: Routes = [
  {
    path: '',
    component: MerchantsListPageComponent
  },
  {
    path: ':id',
    component: MerchantsDetailsPageComponent
  }
];
