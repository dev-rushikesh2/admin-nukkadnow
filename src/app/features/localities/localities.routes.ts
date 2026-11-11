import { Routes } from '@angular/router';
import { LocalitiesListPageComponent } from './pages/localities-list.page';
import { LocalitiesDetailsPageComponent } from './pages/localities-details.page';

export const localitiesRoutes: Routes = [
  {
    path: '',
    component: LocalitiesListPageComponent
  },
  {
    path: ':id',
    component: LocalitiesDetailsPageComponent
  }
];
