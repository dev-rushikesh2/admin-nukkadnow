import { Component, Input, inject, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AdminPermissionService } from '../../core/permissions/permission.service';
import { AdminPermission, AdminPermissions } from '@nukkadnow/admin-access-control';

interface NavSection {
  title: string;
  items: NavItem[];
}

interface NavItem {
  label: string;
  route: string;
  icon: string;
  permission?: AdminPermission;
  badge?: string;
  badgeColor?: 'warning' | 'danger' | 'info';
}

@Component({
  selector: 'admin-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <aside class="admin-sidebar" [class.collapsed]="collapsed">
      <!-- Brand & Security Header -->
      <div class="sidebar-header">
        <div class="brand-logo">
          <span class="logo-icon">🏪</span>
          @if (!collapsed) {
            <div class="logo-text">
              <span class="brand-title">NukkadNow</span>
              <span class="brand-subtitle">Super Admin</span>
            </div>
          }
        </div>
      </div>

      <!-- Navigation Tree -->
      <nav class="sidebar-nav">
        @for (section of navSections; track section.title) {
          @if (!collapsed) {
            <div class="nav-section-title">{{ section.title }}</div>
          }
          <ul class="nav-list">
            @for (item of section.items; track item.route) {
              @if (!item.permission || permService.hasPermission(item.permission)) {
                <li class="nav-item">
                  <a
                    [routerLink]="item.route"
                    routerLinkActive="active"
                    [routerLinkActiveOptions]="{ exact: item.route === '/overview' }"
                    class="nav-link"
                    [title]="collapsed ? item.label : ''">
                    <span class="nav-icon">{{ item.icon }}</span>
                    @if (!collapsed) {
                      <span class="nav-label">{{ item.label }}</span>
                      @if (item.badge) {
                        <span class="nav-badge" [ngClass]="item.badgeColor || 'info'">{{ item.badge }}</span>
                      }
                    }
                  </a>
                </li>
              }
            }
          </ul>
        }
      </nav>

      <!-- Sidebar Footer -->
      <div class="sidebar-footer">
        @if (!collapsed) {
          <div class="footer-security-note">
            <span>TLS 1.3 · Restricted Ingress</span>
            <span class="compliance-badge">Zero Trust</span>
          </div>
        }
      </div>
    </aside>
  `,
  styles: [`
    .admin-sidebar {
      width: var(--admin-sidebar-width);
      height: 100vh;
      background-color: var(--admin-bg-surface);
      border-right: 1px solid var(--admin-border-subtle);
      display: flex;
      flex-direction: column;
      transition: width 0.2s cubic-bezier(0.16, 1, 0.3, 1);
      overflow: hidden;
      user-select: none;

      &.collapsed {
        width: var(--admin-sidebar-collapsed-width);
      }
    }
    .sidebar-header {
      height: var(--admin-topbar-height);
      display: flex;
      align-items: center;
      padding: 0 16px;
      border-bottom: 1px solid var(--admin-border-subtle);
    }
    .brand-logo {
      display: flex;
      align-items: center;
      gap: 10px;
    }
    .logo-icon {
      font-size: 1.5rem;
    }
    .logo-text {
      display: flex;
      flex-direction: column;
    }
    .brand-title {
      font-size: 1.05rem;
      font-weight: 700;
      color: var(--admin-text-primary);
      letter-spacing: -0.02em;
    }
    .brand-subtitle {
      font-size: 0.7rem;
      font-weight: 600;
      color: var(--admin-primary);
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }
    .sidebar-nav {
      flex: 1;
      overflow-y: auto;
      padding: 12px 8px;
    }
    .nav-section-title {
      font-size: 0.6875rem;
      font-weight: 600;
      color: var(--admin-text-muted);
      text-transform: uppercase;
      letter-spacing: 0.08em;
      padding: 12px 12px 4px 12px;
    }
    .nav-list {
      list-style: none;
      padding: 0;
      margin: 0 0 12px 0;
    }
    .nav-item {
      margin-bottom: 2px;
    }
    .nav-link {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 8px 12px;
      color: var(--admin-text-secondary);
      text-decoration: none;
      border-radius: var(--admin-radius-sm);
      font-size: 0.8125rem;
      font-weight: 500;
      transition: all 0.15s ease;

      &:hover {
        background-color: var(--admin-bg-hover);
        color: var(--admin-text-primary);
      }

      &.active {
        background-color: var(--admin-primary-light);
        color: var(--admin-primary);
        font-weight: 600;
      }
    }
    .nav-icon {
      font-size: 1.1rem;
      min-width: 20px;
      text-align: center;
    }
    .nav-label {
      flex: 1;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .nav-badge {
      font-size: 0.7rem;
      font-weight: 700;
      padding: 1px 6px;
      border-radius: var(--admin-radius-full);
      &.warning { background-color: var(--admin-warning-subtle); color: var(--admin-warning); }
      &.danger { background-color: var(--admin-danger-subtle); color: var(--admin-danger); }
      &.info { background-color: var(--admin-info-subtle); color: var(--admin-info); }
    }
    .sidebar-footer {
      padding: 12px 16px;
      border-top: 1px solid var(--admin-border-subtle);
      background-color: var(--admin-bg-subtle);
    }
    .footer-security-note {
      display: flex;
      align-items: center;
      justify-content: space-between;
      font-size: 0.7rem;
      color: var(--admin-text-muted);
    }
    .compliance-badge {
      background-color: rgba(16, 185, 129, 0.12);
      color: var(--admin-success);
      padding: 1px 6px;
      border-radius: 4px;
      font-weight: 600;
    }
  `],
})
export class AdminSidebarComponent {
  readonly permService = inject(AdminPermissionService);

  @Input() collapsed = false;

  readonly navSections: NavSection[] = [
    {
      title: 'Command Center',
      items: [
        { label: 'Overview', route: '/overview', icon: '📊' },
      ],
    },
    {
      title: 'Merchant & Verification',
      items: [
        { label: 'Merchants Directory', route: '/merchants', icon: '🏬', permission: AdminPermissions.MERCHANTS_READ },
        { label: 'Verification Queue', route: '/merchant-verification', icon: '🛡️', permission: AdminPermissions.KYC_READ, badge: '5 Pending', badgeColor: 'warning' },
        { label: 'Outlets & Hours', route: '/outlets', icon: '📍', permission: AdminPermissions.OUTLETS_READ },
        { label: 'Localities & Zones', route: '/localities', icon: '🗺️', permission: AdminPermissions.LOCALITIES_READ },
      ],
    },
    {
      title: 'Commerce & Moderation',
      items: [
        { label: 'Live Orders Stream', route: '/orders', icon: '🛍️', permission: AdminPermissions.ORDERS_READ },
        { label: 'Catalog Moderation', route: '/catalogue-moderation', icon: '📦', permission: AdminPermissions.CATALOG_READ, badge: 'Review', badgeColor: 'info' },
        { label: 'Category Taxonomy', route: '/categories', icon: '🗂️', permission: AdminPermissions.CATEGORIES_MANAGE },
        { label: 'Reviews & Disputes', route: '/reviews-moderation', icon: '⭐', permission: AdminPermissions.REVIEWS_READ },
      ],
    },
    {
      title: 'Finance & Subscriptions',
      items: [
        { label: 'Payments & Ledgers', route: '/payments', icon: '💳', permission: AdminPermissions.PAYMENTS_READ },
        { label: 'Refunds & Approvals', route: '/refunds-disputes', icon: '↩️', permission: AdminPermissions.REFUNDS_READ, badge: '2 Action', badgeColor: 'danger' },
        { label: 'Merchant SaaS Subs', route: '/subscriptions', icon: '🔄', permission: AdminPermissions.SUBSCRIPTIONS_READ },
        { label: 'Plans & Pricing Slabs', route: '/plans-pricing', icon: '🏷️', permission: AdminPermissions.PRICING_MANAGE },
      ],
    },
    {
      title: 'Support & Alerts',
      items: [
        { label: 'Support Tickets', route: '/support-tickets', icon: '🎧', permission: AdminPermissions.SUPPORT_READ },
        { label: 'Broadcasts & Templates', route: '/notifications', icon: '📢', permission: AdminPermissions.NOTIFICATIONS_SEND_BROADCAST },
        { label: 'Analytics & Heatmaps', route: '/analytics', icon: '📈', permission: AdminPermissions.ANALYTICS_READ },
      ],
    },
    {
      title: 'Platform Governance & Security',
      items: [
        { label: 'Platform Users', route: '/platform-users', icon: '👥', permission: AdminPermissions.PLATFORM_USERS_READ },
        { label: 'Roles & RBAC Matrix', route: '/roles-permissions', icon: '🔑', permission: AdminPermissions.PLATFORM_ROLES_MANAGE },
        { label: 'Feature Flags & Kills', route: '/feature-flags', icon: '🚩', permission: AdminPermissions.FEATURE_FLAGS_READ },
        { label: 'System Health & Mesh', route: '/system-health', icon: '🩺', permission: AdminPermissions.SYSTEM_HEALTH_READ },
        { label: 'Immutable Audit Trail', route: '/audit-logs', icon: '📜', permission: AdminPermissions.AUDIT_LOGS_READ },
        { label: 'Platform Settings', route: '/settings', icon: '⚙️', permission: AdminPermissions.SETTINGS_MANAGE },
      ],
    },
  ];
}
