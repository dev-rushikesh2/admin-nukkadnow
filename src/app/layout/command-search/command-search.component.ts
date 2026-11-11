import { Component, Input, Output, EventEmitter, HostListener, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

interface CommandItem {
  id: string;
  category: 'NAVIGATION' | 'MERCHANT' | 'ORDER' | 'ACTION';
  title: string;
  subtitle: string;
  route: string;
  icon: string;
}

@Component({
  selector: 'admin-command-search',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    @if (isOpen) {
      <div class="command-palette-backdrop" (click)="close.emit()">
        <div class="command-palette-box" (click)="$event.stopPropagation()">
          <div class="search-input-wrapper">
            <span class="search-icon">🔍</span>
            <input
              type="text"
              class="command-input"
              placeholder="Type a command, merchant name, order #, or route..."
              [(ngModel)]="searchQuery"
              (ngModelChange)="onSearchChange($event)"
              autofocus>
            <kbd class="esc-badge" (click)="close.emit()">ESC</kbd>
          </div>

          <div class="search-results-list">
            @for (item of filteredResults(); track item.id) {
              <div class="result-row" (click)="selectItem(item)">
                <span class="result-icon">{{ item.icon }}</span>
                <div class="result-details">
                  <span class="result-title">{{ item.title }}</span>
                  <span class="result-subtitle">{{ item.subtitle }}</span>
                </div>
                <span class="result-category font-mono">{{ item.category }}</span>
              </div>
            } @empty {
              <div class="empty-search">No matching platform records found.</div>
            }
          </div>

          <div class="palette-footer">
            <span>Navigation: ↑ ↓ · Select: Enter · Dismiss: Esc</span>
          </div>
        </div>
      </div>
    }
  `,
  styles: [`
    .command-palette-backdrop {
      position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
      background: rgba(0, 0, 0, 0.75); backdrop-filter: blur(4px);
      display: flex; align-items: flex-start; justify-content: center;
      padding-top: 15vh; z-index: var(--z-index-popover);
    }
    .command-palette-box {
      background: var(--admin-bg-surface); border: 1px solid var(--admin-border-strong);
      border-radius: var(--admin-radius-lg); max-width: 620px; width: 100%;
      box-shadow: var(--admin-shadow-xl); overflow: hidden;
      animation: palette-enter 0.15s ease-out;
    }
    @keyframes palette-enter {
      from { transform: scale(0.97); opacity: 0; }
      to { transform: scale(1); opacity: 1; }
    }
    .search-input-wrapper {
      display: flex; align-items: center; gap: 12px;
      padding: 14px 18px; border-bottom: 1px solid var(--admin-border-subtle);
    }
    .search-icon { font-size: 1.1rem; opacity: 0.6; }
    .command-input {
      flex: 1; background: transparent; border: none; outline: none;
      font-size: 1rem; color: var(--admin-text-primary);
    }
    .esc-badge {
      font-size: 0.7rem; background: var(--admin-bg-subtle);
      border: 1px solid var(--admin-border-default);
      padding: 2px 6px; border-radius: 4px; color: var(--admin-text-muted); cursor: pointer;
    }
    .search-results-list {
      max-height: 340px; overflow-y: auto; padding: 8px;
    }
    .result-row {
      display: flex; align-items: center; gap: 12px;
      padding: 10px 12px; border-radius: var(--admin-radius-sm);
      cursor: pointer; transition: background-color 0.1s ease;
      &:hover { background-color: var(--admin-bg-hover); }
    }
    .result-icon { font-size: 1.2rem; min-width: 24px; text-align: center; }
    .result-details { display: flex; flex-direction: column; flex: 1; }
    .result-title { font-size: 0.875rem; font-weight: 500; color: var(--admin-text-primary); }
    .result-subtitle { font-size: 0.75rem; color: var(--admin-text-muted); }
    .result-category {
      font-size: 0.6875rem; background: var(--admin-bg-subtle);
      padding: 2px 6px; border-radius: 3px; color: var(--admin-text-secondary);
    }
    .empty-search { text-align: center; padding: 24px; color: var(--admin-text-muted); font-size: 0.875rem; }
    .palette-footer {
      padding: 8px 16px; border-top: 1px solid var(--admin-border-subtle);
      background-color: var(--admin-bg-subtle); font-size: 0.7rem; color: var(--admin-text-muted);
    }
  `],
})
export class CommandSearchComponent {
  private readonly router = inject(Router);

  @Input() isOpen = false;
  @Output() close = new EventEmitter<void>();

  searchQuery = '';

  private readonly commands: CommandItem[] = [
    { id: 'c1', category: 'NAVIGATION', title: 'Dashboard Overview', subtitle: 'View real-time GMV and platform KPI metrics', route: '/overview', icon: '📊' },
    { id: 'c2', category: 'NAVIGATION', title: 'Merchant Directory', subtitle: 'List of all registered merchants and stores', route: '/merchants', icon: '🏬' },
    { id: 'c3', category: 'NAVIGATION', title: 'Verification Queue', subtitle: '5 pending KYC & FSSAI merchant verification tasks', route: '/merchant-verification', icon: '🛡️' },
    { id: 'c4', category: 'NAVIGATION', title: 'Outlets & Geofences', subtitle: 'Manage Nagpur operating hours & boundary polygons', route: '/outlets', icon: '📍' },
    { id: 'c5', category: 'NAVIGATION', title: 'Orders Stream', subtitle: 'Global order timeline and live customer purchases', route: '/orders', icon: '🛍️' },
    { id: 'c6', category: 'NAVIGATION', title: 'Refund Requests', subtitle: 'Pending customer refunds & merchant disputes', route: '/refunds-disputes', icon: '↩️' },
    { id: 'c7', category: 'NAVIGATION', title: 'Feature Flags', subtitle: 'Platform kill-switches and canary rollouts', route: '/feature-flags', icon: '🚩' },
    { id: 'c8', category: 'NAVIGATION', title: 'Audit Trail', subtitle: 'Cryptographic immutable operator activity logs', route: '/audit-logs', icon: '📜' },
    { id: 'c9', category: 'NAVIGATION', title: 'System Health', subtitle: 'Database connection pools, Redis cache, RabbitMQ lag', route: '/system-health', icon: '🩺' },
  ];

  filteredResults = signal<CommandItem[]>(this.commands);

  @HostListener('window:keydown', ['$event'])
  handleKeyboard(event: KeyboardEvent): void {
    if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') {
      event.preventDefault();
      this.isOpen ? this.close.emit() : (this.isOpen = true);
    } else if (event.key === 'Escape' && this.isOpen) {
      this.close.emit();
    }
  }

  onSearchChange(query: string): void {
    const q = query.trim().toLowerCase();
    if (!q) {
      this.filteredResults.set(this.commands);
      return;
    }

    const matches = this.commands.filter(
      (c) => c.title.toLowerCase().includes(q) || c.subtitle.toLowerCase().includes(q)
    );
    this.filteredResults.set(matches);
  }

  selectItem(item: CommandItem): void {
    this.close.emit();
    this.router.navigate([item.route]);
    this.searchQuery = '';
    this.filteredResults.set(this.commands);
  }
}
