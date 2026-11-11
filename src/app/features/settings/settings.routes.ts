import { Routes } from '@angular/router';
import { SettingsListPageComponent } from './pages/settings-list.page';
import { SettingsDetailsPageComponent } from './pages/settings-details.page';

export const settingsRoutes: Routes = [
  {
    path: '',
    component: SettingsListPageComponent
  },
  {
    path: ':id',
    component: SettingsDetailsPageComponent
  }
];
