import { Component, Output, EventEmitter, inject, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AdminSessionService } from '../../core/auth/session.service';
import { StepUpAuthService } from '../../core/auth/step-up-auth.service';

@Component({
  selector: 'admin-topbar',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <header class="admin-topbar">
      <div class="topbar-left">
        <button type="button" class="sidebar-toggle-btn" (click)="toggleSidebar.emit()">
          ☰
        </button>

        <button type="button" class="command-search-trigger" (click)="openCommandSearch.emit()">
          <span class="search-icon">🔍</span>
          <span class="search-placeholder">Quick search merchants, orders, tickets...</span>
          <kbd class="search-shortcut">Ctrl+K</kbd>
        </button>
      </div>

      <div class="topbar-right">
        @if (stepUpService.hasElevatedPrivilege()) {
          <div class="security-indicator elevated" title="Elevated privilege active">
            <span class="indicator-dot"></span>
            <span class="indicator-label">Step-Up MFA Active</span>
          </div>
        }

        <div class="env-pill">
          <span>NAGPUR PILOT</span>
        </div>

        <div class="operator-profile">
          <div class="operator-info">
            <span class="operator-name">{{ sessionService.currentOperator()?.name || 'Administrator' }}</span>
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
    }
    .topbar-left, .topbar-right {
      display: flex;
      align-items: center;
      gap: 12px;
    }
    .sidebar-toggle-btn {
      background: none;
      border: none;
      color: var(--admin-text-secondary);
      font-size: 1.25rem;
      cursor: pointer;
      padding: 6px;
      &:hover { color: var(--admin-text-primary); }
    }
    .command-search-trigger {
      display: flex;
      align-items: center;
      gap: 10px;
      background-color: var(--admin-bg-subtle);
      border: 1px solid var(--admin-border-default);
      border-radius: var(--admin-radius-sm);
      padding: 6px 14px;
      color: var(--admin-text-muted);
      cursor: pointer;
      font-size: 0.8125rem;
      transition: all 0.15s ease;

      &:hover {
        border-color: var(--admin-border-focus);
        color: var(--admin-text-secondary);
      }
    }
    .search-shortcut {
      background: var(--admin-bg-surface);
      border: 1px solid var(--admin-border-default);
      border-radius: 3px;
      padding: 1px 5px;
      font-size: 0.7rem;
    }
    .security-indicator {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 3px 10px;
      border-radius: var(--admin-radius-full);
      font-size: 0.75rem;
      font-weight: 600;

      &.elevated {
        background-color: rgba(244, 63, 94, 0.15);
        color: #f43f5e;
        border: 1px solid rgba(244, 63, 94, 0.3);
      }
    }
    .indicator-dot {
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background-color: currentColor;
    }
    .env-pill {
      background-color: var(--admin-bg-subtle);
      color: var(--admin-text-secondary);
      border: 1px solid var(--admin-border-default);
      padding: 3px 8px;
      border-radius: var(--admin-radius-sm);
      font-size: 0.7rem;
      font-weight: 600;
      letter-spacing: 0.05em;
    }
    .operator-profile {
      display: flex;
      align-items: center;
      gap: 12px;
      padding-left: 12px;
      border-left: 1px solid var(--admin-border-subtle);
    }
    .operator-info {
      display: flex;
      flex-direction: column;
      text-align: right;
    }
    .operator-name {
      font-size: 0.8125rem;
      font-weight: 600;
      color: var(--admin-text-primary);
    }
    .operator-role {
      font-size: 0.7rem;
      color: var(--admin-text-muted);
    }
    .lock-btn, .logout-btn {
      background: none;
      border: none;
      color: var(--admin-text-muted);
      cursor: pointer;
      font-size: 1.1rem;
      padding: 6px;
      border-radius: var(--admin-radius-sm);
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
