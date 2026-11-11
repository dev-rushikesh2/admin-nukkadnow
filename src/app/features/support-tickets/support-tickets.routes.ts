import { Routes } from '@angular/router';
import { SupportTicketsListPageComponent } from './pages/support-tickets-list.page';
import { SupportTicketsDetailsPageComponent } from './pages/support-tickets-details.page';

export const supportTicketsRoutes: Routes = [
  {
    path: '',
    component: SupportTicketsListPageComponent
  },
  {
    path: ':id',
    component: SupportTicketsDetailsPageComponent
  }
];
