import { Routes } from '@angular/router';
import { ReviewsModerationListPageComponent } from './pages/reviews-moderation-list.page';
import { ReviewsModerationDetailsPageComponent } from './pages/reviews-moderation-details.page';

export const reviewsModerationRoutes: Routes = [
  {
    path: '',
    component: ReviewsModerationListPageComponent
  },
  {
    path: ':id',
    component: ReviewsModerationDetailsPageComponent
  }
];
