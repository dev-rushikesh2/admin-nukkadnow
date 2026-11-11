import { Routes } from '@angular/router';
import { CategoriesListPageComponent } from './pages/categories-list.page';
import { CategoriesDetailsPageComponent } from './pages/categories-details.page';

export const categoriesRoutes: Routes = [
  {
    path: '',
    component: CategoriesListPageComponent
  },
  {
    path: ':id',
    component: CategoriesDetailsPageComponent
  }
];
