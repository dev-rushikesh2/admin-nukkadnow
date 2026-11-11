import { Routes } from '@angular/router';
import { CatalogueModerationListPageComponent } from './pages/catalogue-moderation-list.page';
import { CatalogueModerationDetailsPageComponent } from './pages/catalogue-moderation-details.page';

export const catalogueModerationRoutes: Routes = [
  {
    path: '',
    component: CatalogueModerationListPageComponent
  },
  {
    path: ':id',
    component: CatalogueModerationDetailsPageComponent
  }
];
