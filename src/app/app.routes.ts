import { Routes } from '@angular/router';
import { adminAuthGuard } from './core/auth/admin-auth.guard';
import { adminPermissionGuard } from './core/permissions/permission.guard';
import { AdminShellComponent } from './layout/admin-shell/admin-shell.component';
import { AdminPermissions } from '@nukkadnow/admin-access-control';

export const routes: Routes = [
  // 1. Unauthenticated Security Boundary (Login, MFA Challenge, Screen Lock)
  {
    path: 'auth',
    loadChildren: () =>
      import('./features/authentication/authentication.routes').then(
        (m) => m.authenticationRoutes
      ),
  },

  // 2. Authenticated Admin Shell Protected by Strict Authentication & Session Guard
  {
    path: '',
    component: AdminShellComponent,
    canActivate: [adminAuthGuard],
    children: [
      {
        path: '',
        redirectTo: 'overview',
        pathMatch: 'full',
      },
      {
        path: 'overview',
        loadChildren: () =>
          import('./features/overview/overview.routes').then((m) => m.overviewRoutes),
      },
      {
        path: 'merchants',
        canActivate: [adminPermissionGuard],
        data: { requiredPermissions: [AdminPermissions.MERCHANTS_READ] },
        loadChildren: () =>
          import('./features/merchants/merchants.routes').then((m) => m.merchantsRoutes),
      },
      {
        path: 'customers',
        canActivate: [adminPermissionGuard],
        data: { requiredPermissions: [AdminPermissions.SUPPORT_READ] },
        loadChildren: () =>
          import('./features/customers/customers.routes').then((m) => m.customersRoutes),
      },
      {
        path: 'merchant-verification',
        canActivate: [adminPermissionGuard],
        data: { requiredPermissions: [AdminPermissions.KYC_READ] },
        loadChildren: () =>
          import('./features/merchant-verification/merchant-verification.routes').then(
            (m) => m.merchantVerificationRoutes
          ),
      },
      {
        path: 'outlets',
        canActivate: [adminPermissionGuard],
        data: { requiredPermissions: [AdminPermissions.OUTLETS_READ] },
        loadChildren: () =>
          import('./features/outlets/outlets.routes').then((m) => m.outletsRoutes),
      },
      {
        path: 'localities',
        canActivate: [adminPermissionGuard],
        data: { requiredPermissions: [AdminPermissions.LOCALITIES_READ] },
        loadChildren: () =>
          import('./features/localities/localities.routes').then((m) => m.localitiesRoutes),
      },
      {
        path: 'categories',
        canActivate: [adminPermissionGuard],
        data: { requiredPermissions: [AdminPermissions.CATEGORIES_MANAGE] },
        loadChildren: () =>
          import('./features/categories/categories.routes').then((m) => m.categoriesRoutes),
      },
      {
        path: 'catalogue-moderation',
        canActivate: [adminPermissionGuard],
        data: { requiredPermissions: [AdminPermissions.CATALOG_READ] },
        loadChildren: () =>
          import('./features/catalogue-moderation/catalogue-moderation.routes').then(
            (m) => m.catalogueModerationRoutes
          ),
      },
      {
        path: 'inventory-monitoring',
        canActivate: [adminPermissionGuard],
        data: { requiredPermissions: [AdminPermissions.CATALOG_READ] },
        loadChildren: () =>
          import('./features/inventory-monitoring/inventory-monitoring.routes').then(
            (m) => m.inventoryMonitoringRoutes
          ),
      },
      {
        path: 'orders',
        canActivate: [adminPermissionGuard],
        data: { requiredPermissions: [AdminPermissions.ORDERS_READ] },
        loadChildren: () =>
          import('./features/orders/orders.routes').then((m) => m.ordersRoutes),
      },
      {
        path: 'payments',
        canActivate: [adminPermissionGuard],
        data: { requiredPermissions: [AdminPermissions.PAYMENTS_READ] },
        loadChildren: () =>
          import('./features/payments/payments.routes').then((m) => m.paymentsRoutes),
      },
      {
        path: 'refunds-disputes',
        canActivate: [adminPermissionGuard],
        data: { requiredPermissions: [AdminPermissions.REFUNDS_READ] },
        loadChildren: () =>
          import('./features/refunds-disputes/refunds-disputes.routes').then(
            (m) => m.refundsDisputesRoutes
          ),
      },
      {
        path: 'subscriptions',
        canActivate: [adminPermissionGuard],
        data: { requiredPermissions: [AdminPermissions.SUBSCRIPTIONS_READ] },
        loadChildren: () =>
          import('./features/subscriptions/subscriptions.routes').then(
            (m) => m.subscriptionsRoutes
          ),
      },
      {
        path: 'plans-pricing',
        canActivate: [adminPermissionGuard],
        data: { requiredPermissions: [AdminPermissions.PRICING_MANAGE] },
        loadChildren: () =>
          import('./features/plans-pricing/plans-pricing.routes').then(
            (m) => m.plansPricingRoutes
          ),
      },
      {
        path: 'support-tickets',
        canActivate: [adminPermissionGuard],
        data: { requiredPermissions: [AdminPermissions.SUPPORT_READ] },
        loadChildren: () =>
          import('./features/support-tickets/support-tickets.routes').then(
            (m) => m.supportTicketsRoutes
          ),
      },
      {
        path: 'reviews-moderation',
        canActivate: [adminPermissionGuard],
        data: { requiredPermissions: [AdminPermissions.REVIEWS_READ] },
        loadChildren: () =>
          import('./features/reviews-moderation/reviews-moderation.routes').then(
            (m) => m.reviewsModerationRoutes
          ),
      },
      {
        path: 'notifications',
        canActivate: [adminPermissionGuard],
        data: { requiredPermissions: [AdminPermissions.NOTIFICATIONS_SEND_BROADCAST] },
        loadChildren: () =>
          import('./features/notifications/notifications.routes').then(
            (m) => m.notificationsRoutes
          ),
      },
      {
        path: 'analytics',
        canActivate: [adminPermissionGuard],
        data: { requiredPermissions: [AdminPermissions.ANALYTICS_READ] },
        loadChildren: () =>
          import('./features/analytics/analytics.routes').then((m) => m.analyticsRoutes),
      },
      {
        path: 'platform-users',
        canActivate: [adminPermissionGuard],
        data: { requiredPermissions: [AdminPermissions.PLATFORM_USERS_READ] },
        loadChildren: () =>
          import('./features/platform-users/platform-users.routes').then(
            (m) => m.platformUsersRoutes
          ),
      },
      {
        path: 'roles-permissions',
        canActivate: [adminPermissionGuard],
        data: { requiredPermissions: [AdminPermissions.PLATFORM_ROLES_MANAGE] },
        loadChildren: () =>
          import('./features/roles-permissions/roles-permissions.routes').then(
            (m) => m.rolesPermissionsRoutes
          ),
      },
      {
        path: 'feature-flags',
        canActivate: [adminPermissionGuard],
        data: { requiredPermissions: [AdminPermissions.FEATURE_FLAGS_READ] },
        loadChildren: () =>
          import('./features/feature-flags/feature-flags.routes').then(
            (m) => m.featureFlagsRoutes
          ),
      },
      {
        path: 'system-health',
        canActivate: [adminPermissionGuard],
        data: { requiredPermissions: [AdminPermissions.SYSTEM_HEALTH_READ] },
        loadChildren: () =>
          import('./features/system-health/system-health.routes').then(
            (m) => m.systemHealthRoutes
          ),
      },
      {
        path: 'audit-logs',
        canActivate: [adminPermissionGuard],
        data: { requiredPermissions: [AdminPermissions.AUDIT_LOGS_READ] },
        loadChildren: () =>
          import('./features/audit-logs/audit-logs.routes').then((m) => m.auditLogsRoutes),
      },
      {
        path: 'settings',
        canActivate: [adminPermissionGuard],
        data: { requiredPermissions: [AdminPermissions.SETTINGS_MANAGE] },
        loadChildren: () =>
          import('./features/settings/settings.routes').then((m) => m.settingsRoutes),
      },
      {
        path: 'profile',
        loadChildren: () =>
          import('./features/profile/profile.routes').then((m) => m.profileRoutes),
      },
    ],
  },

  // 3. Fallback Route
  {
    path: '**',
    redirectTo: 'overview',
  },
];
