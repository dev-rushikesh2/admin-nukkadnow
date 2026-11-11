import { Routes } from '@angular/router';
import { OrdersListPageComponent } from './pages/orders-list.page';
import { OrdersDetailsPageComponent } from './pages/orders-details.page';

export const ordersRoutes: Routes = [
  {
    path: '',
    component: OrdersListPageComponent
  },
  {
    path: ':id',
    component: OrdersDetailsPageComponent
  }
];
