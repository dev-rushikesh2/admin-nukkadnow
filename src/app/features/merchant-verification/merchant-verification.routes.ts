import { Routes } from '@angular/router';
import { MerchantVerificationListPageComponent } from './pages/merchant-verification-list.page';
import { MerchantVerificationDetailsPageComponent } from './pages/merchant-verification-details.page';

export const merchantVerificationRoutes: Routes = [
  {
    path: '',
    component: MerchantVerificationListPageComponent
  },
  {
    path: ':id',
    component: MerchantVerificationDetailsPageComponent
  }
];
