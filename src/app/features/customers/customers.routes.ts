import { Routes } from '@angular/router';
import { CustomersListPageComponent } from './pages/customers-list.page';
import { CustomerDetailsPageComponent } from './pages/customer-details.page';

export const customersRoutes: Routes = [
  {
    path: '',
    component: CustomersListPageComponent,
  },
  {
    path: ':id',
    component: CustomerDetailsPageComponent,
  },
];
