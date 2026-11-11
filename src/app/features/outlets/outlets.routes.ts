import { Routes } from '@angular/router';
import { OutletsListPageComponent } from './pages/outlets-list.page';
import { OutletsDetailsPageComponent } from './pages/outlets-details.page';

export const outletsRoutes: Routes = [
  {
    path: '',
    component: OutletsListPageComponent
  },
  {
    path: ':id',
    component: OutletsDetailsPageComponent
  }
];
