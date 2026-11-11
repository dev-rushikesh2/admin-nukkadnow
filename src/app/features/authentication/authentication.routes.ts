import { Routes } from '@angular/router';
import { LoginPageComponent } from './pages/login.page';
import { MfaChallengePageComponent } from './pages/mfa-challenge.page';
import { LockScreenPageComponent } from './pages/lock-screen.page';

export const authenticationRoutes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: 'login',
    component: LoginPageComponent,
  },
  {
    path: 'mfa',
    component: MfaChallengePageComponent,
  },
  {
    path: 'lock-screen',
    component: LockScreenPageComponent,
  },
];
