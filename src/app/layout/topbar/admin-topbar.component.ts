import { Component, Output, EventEmitter, inject, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AdminSessionService } from '../../core/auth/session.service';
import { StepUpAuthService } from '../../core/auth/step-up-auth.service';
import { AdminThemeService } from '../../core/theme/theme.service';

@Component({
  selector: 'admin-topbar',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <header class="admin-topbar">
      <div class="topbar-left">
        <button type="button" class="sidebar-toggle-btn" (click)="toggleSidebar.emit()" title="Toggle Sidebar">
          ☰
        </button>

        <button type="button" class="command-search-trigger" (click)="openCommandSearch.emit()">
          <span class="search-icon">🔍</span>
          <span class="search-placeholder">Quick search merchants, orders, tickets...</span>
          <kbd class="search-shortcut">Ctrl+K</kbd>
        </button>
      </div>

      <div class="topbar-right">
        <!-- Geographic Scope Pill -->
        @if (sessionService.geoAssignment(); as geo) {
          <div class="geo-scope-pill" [title]="'Restricted to ' + geo.cityName + ' operations'">
            <span class="geo-dot"></span>
            <span>📍 {{ geo.cityName }} ({{ geo.state }})</span>
          </div>
        } @else {
          <div class="global-scope-pill" title="Unrestricted Global Access across all cities">
            <span>🌐 Global Scope</span>
          </div>
        }

        @if (stepUpService.hasElevatedPrivilege()) {
          <div class="security-indicator elevated" title="Elevated privilege active">
            <span class="indicator-dot"></span>
            <span class="indicator-label">Step-Up MFA</span>
          </div>
        }

        <!-- Light / Dark Mode Toggle Button -->
        <button
          type="button"
          class="theme-toggle-btn"
          [attr.aria-label]="themeService.currentTheme() === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'"
          [title]="themeService.currentTheme() === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'"
          (click)="themeService.toggleTheme()">
          @if (themeService.currentTheme() === 'dark') {
            <span class="theme-icon">☀️</span>
            <span class="theme-label">Light Mode</span>
          } @else {
            <span class="theme-icon">🌙</span>
            <span class="theme-label">Dark Mode</span>
          }
        </button>

        <div class="operator-profile">
          <div class="operator-info">
            <div class="operator-name-row">
              <span class="operator-name">{{ sessionService.currentOperator()?.name || 'Administrator' }}</span>
              @if (sessionService.isRootProtected()) {
                <span class="root-crown" title="Protected Root Account">👑</span>
              }
            </div>
            <span class="operator-role">{{ sessionService.currentRole() || 'SUPER_ADMIN' }}</span>
          </div>

          <button
            type="button"
            class="lock-btn"
            title="Lock Console (Inactivity Lock)"
            (click)="lockConsole()">
            🔒
          </button>

          <button
            type="button"
            class="logout-btn"
            title="Sign Out"
            (click)="logout()">
            ⏻
          </button>
        </div>
      </div>
    </header>
  `,
  styles: [`
    .admin-topbar {
      height: var(--admin-topbar-height);
      background-color: var(--admin-bg-surface);
      border-bottom: 1px solid var(--admin-border-subtle);
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 var(--admin-space-lg);
      position: sticky;
      top: 0;
      z-index: var(--z-index-sticky);
      box-shadow: var(--admin-shadow-sm);
      transition: background-color 0.2s ease, border-color 0.2s ease;
    }
    .topbar-left, .topbar-right {
      display: flex;
      align-items: center;
      gap: 12px;
    }
    .sidebar-toggle-btn {
      background: none;
      border: 1px solid var(--admin-border-subtle);
      border-radius: var(--admin-radius-sm);
      color: var(--admin-text-primary);
      cursor: pointer;
      font-size: 1.1rem;
      padding: 6px 10px;
      transition: all 0.15s ease;

      &:hover {
        background-color: var(--admin-bg-hover);
        border-color: var(--admin-color-primary);
      }
    }
    .command-search-trigger {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 7px 14px;
      background-color: var(--admin-bg-canvas);
      border: 1px solid var(--admin-border-subtle);
      border-radius: var(--admin-radius-md);
      color: var(--admin-text-muted);
      cursor: pointer;
      font-size: 0.85rem;
      min-width: 280px;
      transition: all 0.15s ease;

      &:hover {
        border-color: var(--admin-color-primary);
        color: var(--admin-text-primary);
      }
    }
    .search-shortcut {
      margin-left: auto;
      background-color: var(--admin-bg-subtle);
      border: 1px solid var(--admin-border-subtle);
      border-radius: 4px;
      padding: 2px 6px;
      font-size: 0.75rem;
      font-family: inherit;
      color: var(--admin-text-secondary);
    }

    /* Geographic Scope Pills */
    .geo-scope-pill {
      display: flex;
      align-items: center;
      gap: 6px;
      padding: 4px 10px;
      border-radius: 999px;
      font-size: 0.75rem;
      font-weight: 700;
      background-color: rgba(16, 185, 129, 0.12);
      color: #059669;
      border: 1px solid rgba(16, 185, 129, 0.3);
    }
    .geo-dot {
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background-color: #10b981;
    }
    .global-scope-pill {
      display: flex;
      align-items: center;
      gap: 6px;
      padding: 4px 10px;
      border-radius: 999px;
      font-size: 0.75rem;
      font-weight: 700;
      background-color: var(--admin-bg-subtle);
      color: var(--admin-color-primary);
      border: 1px solid var(--admin-border-subtle);
    }

    .security-indicator {
      display: flex;
      align-items: center;
      gap: 6px;
      padding: 4px 10px;
      border-radius: 999px;
      font-size: 0.75rem;
      font-weight: 600;

      &.elevated {
        background-color: rgba(245, 158, 11, 0.15);
        color: #d97706;
        border: 1px solid rgba(245, 158, 11, 0.3);
        .indicator-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background-color: #f59e0b;
        }
      }
    }

    .theme-toggle-btn {
      display: flex;
      align-items: center;
      gap: 6px;
      padding: 6px 12px;
      border-radius: var(--admin-radius-md);
      background-color: var(--admin-bg-canvas);
      border: 1px solid var(--admin-border-subtle);
      color: var(--admin-text-primary);
      font-size: 0.8rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.15s ease;

      &:hover {
        background-color: var(--admin-bg-hover);
        border-color: var(--admin-color-primary);
      }
    }
    .theme-icon {
      font-size: 0.95rem;
      line-height: 1;
    }
    .theme-label {
      line-height: 1;
    }

    .operator-profile {
      display: flex;
      align-items: center;
      gap: 12px;
      padding-left: 8px;
      border-left: 1px solid var(--admin-border-subtle);
    }
    .operator-info {
      display: flex;
      flex-direction: column;
      align-items: flex-end;
    }
    .operator-name-row {
      display: flex;
      align-items: center;
      gap: 4px;
    }
    .operator-name {
      font-size: 0.85rem;
      font-weight: 700;
      color: var(--admin-text-primary);
    }
    .root-crown {
      font-size: 0.85rem;
    }
    .operator-role {
      font-size: 0.72rem;
      color: var(--admin-text-muted);
      font-weight: 600;
    }
    .lock-btn, .logout-btn {
      background: none;
      border: none;
      color: var(--admin-text-secondary);
      cursor: pointer;
      font-size: 1.1rem;
      padding: 6px;
      border-radius: var(--admin-radius-sm);
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.15s ease;

      &:hover {
        background-color: var(--admin-bg-hover);
        color: var(--admin-text-primary);
      }
    }
    .logout-btn:hover {
      color: var(--admin-danger);
    }
  `],
})
export class AdminTopbarComponent {
  readonly sessionService = inject(AdminSessionService);
  readonly stepUpService = inject(StepUpAuthService);
  readonly themeService = inject(AdminThemeService);
  private readonly router = inject(Router);

  @Output() toggleSidebar = new EventEmitter<void>();
  @Output() openCommandSearch = new EventEmitter<void>();

  lockConsole(): void {
    this.sessionService.lockConsole();
    this.router.navigate(['/auth/lock-screen']);
  }

  logout(): void {
    this.sessionService.clearSession();
    this.router.navigate(['/auth/login']);
  }
}
