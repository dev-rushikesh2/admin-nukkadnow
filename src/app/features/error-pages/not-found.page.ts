import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { PageHeaderComponent } from '@nukkadnow/admin-ui';

@Component({
  selector: 'admin-not-found-page',
  standalone: true,
  imports: [CommonModule, RouterModule, PageHeaderComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="not-found-container">
      <admin-page-header
        title="404 — Route Not Found"
        subtitle="The requested administrative resource does not exist"
        breadcrumb="Console / Error / 404">
      </admin-page-header>

      <div class="not-found-card">
        <div class="not-found-icon">🧭</div>
        <h2>Endpoint Not Located</h2>
        <p class="not-found-message">
          The console URL or administrative route you requested does not exist, has been deprecated, 
          or requires elevated routing authorization.
        </p>

        <div class="actions-row">
          <button type="button" class="admin-btn btn-primary" (click)="returnToDashboard()">
            ← Return to Dashboard
          </button>
          <button type="button" class="admin-btn btn-secondary" (click)="goBack()">
            Go Back
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .not-found-container {
      display: flex;
      flex-direction: column;
      gap: 20px;
    }
    .not-found-card {
      background: var(--admin-bg-surface);
      border: 1px solid var(--admin-border-subtle);
      border-radius: var(--admin-radius-lg);
      padding: 48px 32px;
      text-align: center;
      max-width: 600px;
      margin: 40px auto;
      box-shadow: var(--admin-shadow-md);
    }
    .not-found-icon {
      font-size: 3.5rem;
      margin-bottom: 16px;
    }
    h2 {
      font-size: 1.5rem;
      font-weight: 700;
      color: var(--admin-text-primary);
      margin: 0 0 12px 0;
    }
    .not-found-message {
      font-size: 0.9375rem;
      color: var(--admin-text-secondary);
      line-height: 1.6;
      margin: 0 0 28px 0;
    }
    .actions-row {
      display: flex;
      justify-content: center;
      gap: 12px;
    }
  `],
})
export class NotFoundPageComponent {
  private readonly router = inject(Router);

  returnToDashboard(): void {
    this.router.navigate(['/overview']);
  }

  goBack(): void {
    window.history.back();
  }
}
