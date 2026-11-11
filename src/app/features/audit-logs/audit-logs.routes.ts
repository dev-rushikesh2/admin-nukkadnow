import { Routes } from '@angular/router';
import { AuditLogsListPageComponent } from './pages/audit-logs-list.page';
import { AuditLogsDetailsPageComponent } from './pages/audit-logs-details.page';

export const auditLogsRoutes: Routes = [
  {
    path: '',
    component: AuditLogsListPageComponent
  },
  {
    path: ':id',
    component: AuditLogsDetailsPageComponent
  }
];
