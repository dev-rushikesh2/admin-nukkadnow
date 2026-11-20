import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { PageHeaderComponent } from '@nukkadnow/admin-ui';
import { AdminSessionService } from '../../core/auth/session.service';

@Component({
  selector: 'admin-access-denied-page',
  standalone: true,
  imports: [CommonModule, RouterModule, PageHeaderComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="access-denied-container">
      <admin-page-header
        title="403 — Privileged Access Restricted"
        subtitle="Zero-Trust Access Control: Insufficient Administrative Permissions"
        breadcrumb="Console / Security / Access Denied">
      </admin-page-header>

      <div class="denied-card">
        <div class="denied-icon">🛡️</div>
        <h2>Restricted Operational Boundary</h2>
        <p class="denied-message">
          Your operator account (<strong>{{ sessionService.currentOperator()?.email || 'Authenticated User' }}</strong>) 
          with role <span class="role-badge">{{ sessionService.currentRole() || 'OPERATOR' }}</span> 
          does not possess the requisite administrative permissions to access this feature route.
        </p>

        @if (requiredPermission) {
          <div class="permission-alert">
            <span class="perm-label">Required Permission:</span>
            <code class="perm-code">{{ requiredPermission }}</code>
          </div>
        }

        <div class="denied-actions">
          <button type="button" class="admin-btn btn-primary" (click)="returnToDashboard()">
            ← Return to Dashboard
          </button>
          <button type="button" class="admin-btn btn-secondary" (click)="goBack()">
            Go Back
          </button>
        </div>

        <div class="security-note">
          <span>🔒 All unauthorized access attempts are logged in the immutable security audit trail.</span>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .access-denied-container {
      display: flex;
      flex-direction: column;
      gap: 20px;
    }
    .denied-card {
      background: var(--admin-bg-surface);
      border: 1px solid var(--admin-border-subtle);
      border-radius: var(--admin-radius-lg);
      padding: 48px 32px;
      text-align: center;
      max-width: 640px;
      margin: 40px auto;
      box-shadow: var(--admin-shadow-md);
    }
    .denied-icon {
      font-size: 3.5rem;
      margin-bottom: 16px;
    }
    h2 {
      font-size: 1.5rem;
      font-weight: 700;
      color: var(--admin-text-primary);
      margin: 0 0 12px 0;
    }
    .denied-message {
      font-size: 0.9375rem;
      color: var(--admin-text-secondary);
      line-height: 1.6;
      margin: 0 0 20px 0;
    }
    .role-badge {
      display: inline-block;
      background: var(--admin-primary-subtle);
      color: var(--admin-primary);
      padding: 2px 8px;
      border-radius: var(--admin-radius-full);
      font-size: 0.75rem;
      font-weight: 700;
    }
    .permission-alert {
      background: var(--admin-danger-subtle);
      border: 1px solid rgba(239, 68, 68, 0.2);
      border-radius: var(--admin-radius-md);
      padding: 12px 16px;
      display: inline-flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 28px;
      font-size: 0.8125rem;
    }
    .perm-label {
      color: var(--admin-danger);
      font-weight: 600;
    }
    .perm-code {
      background: rgba(0, 0, 0, 0.05);
      padding: 2px 6px;
      border-radius: 4px;
      font-family: monospace;
      font-weight: 700;
      color: var(--admin-text-primary);
    }
    .denied-actions {
      display: flex;
      justify-content: center;
      gap: 12px;
      margin-bottom: 24px;
    }
    .security-note {
      font-size: 0.75rem;
      color: var(--admin-text-muted);
      border-top: 1px solid var(--admin-border-subtle);
      padding-top: 16px;
    }
  `],
})
export class AccessDeniedPageComponent {
  readonly sessionService = inject(AdminSessionService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  readonly requiredPermission = this.route.snapshot.queryParams['requiredPermission'] || null;

  returnToDashboard(): void {
    this.router.navigate(['/overview']);
  }

  goBack(): void {
    window.history.back();
  }
}
