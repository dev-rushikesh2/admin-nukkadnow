import { Component, Input, Output, EventEmitter, HostListener, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AdminApiClient } from '@nukkadnow/admin-api-client';
import { AdminEndpoints } from '@nukkadnow/admin-api-client';

interface CommandItem {
  id: string;
  category: 'NAVIGATION' | 'MERCHANT' | 'ORDER' | 'LOCALITY' | 'SUPPORT_TICKET' | 'ADMIN_USER';
  title: string;
  subtitle: string;
  route: string;
  icon: string;
  badge?: string;
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
              placeholder="Search merchants, orders, customers, tickets, localities (Ctrl+K)..."
              [(ngModel)]="searchQuery"
              (ngModelChange)="onSearchChange($event)"
              autofocus>
            @if (isLoading()) {
              <span class="loading-spinner">⌛</span>
            }
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
                @if (item.badge) {
                  <span class="result-badge">{{ item.badge }}</span>
                }
                <span class="result-category font-mono">{{ item.category }}</span>
              </div>
            } @empty {
              <div class="empty-search">
                @if (isLoading()) {
                  <span>Searching platform databases...</span>
                } @else {
                  <span>No matching platform records found.</span>
                }
              </div>
            }
          </div>

          <div class="palette-footer">
            <span>Navigation: Click or Enter · Dismiss: Esc · Live search across all microservices</span>
          </div>
        </div>
      </div>
    }
  `,
  styles: [`
    .command-palette-backdrop {
      position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
      background: rgba(15, 23, 42, 0.6); backdrop-filter: blur(4px);
      display: flex; align-items: flex-start; justify-content: center;
      padding-top: 15vh; z-index: var(--z-index-popover, 1050);
    }
    .command-palette-box {
      background: var(--admin-bg-surface); border: 1px solid var(--admin-border-strong);
      border-radius: var(--admin-radius-lg); max-width: 640px; width: 100%;
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
    .loading-spinner { font-size: 0.9rem; animation: spin 1s linear infinite; }
    @keyframes spin { 100% { transform: rotate(360deg); } }
    .esc-badge {
      font-size: 0.7rem; background: var(--admin-bg-subtle);
      border: 1px solid var(--admin-border-default);
      padding: 2px 6px; border-radius: 4px; color: var(--admin-text-muted); cursor: pointer;
    }
    .search-results-list {
      max-height: 380px; overflow-y: auto; padding: 8px;
    }
    .result-row {
      display: flex; align-items: center; gap: 12px;
      padding: 10px 12px; border-radius: var(--admin-radius-sm);
      cursor: pointer; transition: background-color 0.1s ease;
      &:hover { background-color: var(--admin-bg-hover); }
    }
    .result-icon { font-size: 1.2rem; min-width: 24px; text-align: center; }
    .result-details { display: flex; flex-direction: column; flex: 1; min-width: 0; }
    .result-title { font-size: 0.875rem; font-weight: 600; color: var(--admin-text-primary); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    .result-subtitle { font-size: 0.75rem; color: var(--admin-text-muted); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    .result-badge {
      font-size: 0.6875rem; font-weight: 600; padding: 2px 6px; border-radius: 4px;
      background: var(--admin-primary-light); color: var(--admin-primary);
    }
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
  private readonly apiClient = inject(AdminApiClient);

  @Input() isOpen = false;
  @Output() close = new EventEmitter<void>();

  searchQuery = '';
  readonly isLoading = signal(false);

  private readonly quickCommands: CommandItem[] = [
    { id: 'c1', category: 'NAVIGATION', title: 'Dashboard Overview', subtitle: 'View real-time GMV and platform KPI metrics', route: '/overview', icon: '📊' },
    { id: 'c2', category: 'NAVIGATION', title: 'Merchant Directory', subtitle: 'List of all registered merchants and stores', route: '/merchants', icon: '🏬' },
    { id: 'c3', category: 'NAVIGATION', title: 'Verification Queue', subtitle: '5 pending KYC & FSSAI merchant verification tasks', route: '/merchant-verification', icon: '🛡️' },
    { id: 'c4', category: 'NAVIGATION', title: 'Outlets & Geofences', subtitle: 'Manage operating hours & delivery boundaries', route: '/outlets', icon: '📍' },
    { id: 'c5', category: 'NAVIGATION', title: 'Localities & Zones', subtitle: 'Territory management across Nagpur, Akola, Amravati, Pune', route: '/localities', icon: '🗺️' },
    { id: 'c6', category: 'NAVIGATION', title: 'Orders Stream', subtitle: 'Global order timeline and live purchases', route: '/orders', icon: '🛍️' },
    { id: 'c7', category: 'NAVIGATION', title: 'Payments & Ledgers', subtitle: 'Gateway settlements and escrow ledgers', route: '/payments', icon: '💳' },
    { id: 'c8', category: 'NAVIGATION', title: 'Support Tickets', subtitle: 'Customer and merchant helpdesk triage', route: '/support-tickets', icon: '🎧' },
    { id: 'c9', category: 'NAVIGATION', title: 'Platform Users', subtitle: 'Admin staff and dynamic role assignments', route: '/platform-users', icon: '👥' },
    { id: 'c10', category: 'NAVIGATION', title: 'Admin Profile & Security', subtitle: 'Personal credentials, TOTP 2FA, and active sessions', route: '/profile', icon: '👤' },
  ];

  filteredResults = signal<CommandItem[]>(this.quickCommands);
  private searchDebounceTimer?: any;

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
    const q = query.trim();
    if (!q) {
      this.filteredResults.set(this.quickCommands);
      return;
    }

    // Debounced live API query to backend BFF
    clearTimeout(this.searchDebounceTimer);
    this.searchDebounceTimer = setTimeout(() => {
      this.executeLiveSearch(q);
    }, 200);
  }

  private executeLiveSearch(query: string): void {
    this.isLoading.set(true);
    this.apiClient.get<any>(`${AdminEndpoints.SEARCH}?query=${encodeURIComponent(query)}`).subscribe({
      next: (res) => {
        this.isLoading.set(false);
        const liveResults: CommandItem[] = [];

        if (res.data?.merchants) {
          for (const m of res.data.merchants) {
            liveResults.push({
              id: `mer-${m.id}`,
              category: 'MERCHANT',
              title: m.title,
              subtitle: m.subtitle,
              route: m.route,
              icon: '🏬',
              badge: m.badge,
            });
          }
        }

        if (res.data?.orders) {
          for (const o of res.data.orders) {
            liveResults.push({
              id: `ord-${o.id}`,
              category: 'ORDER',
              title: o.title,
              subtitle: o.subtitle,
              route: o.route,
              icon: '🛍️',
              badge: o.badge,
            });
          }
        }

        if (res.data?.localities) {
          for (const l of res.data.localities) {
            liveResults.push({
              id: `loc-${l.id}`,
              category: 'LOCALITY',
              title: l.title,
              subtitle: l.subtitle,
              route: l.route,
              icon: '🗺️',
              badge: l.badge,
            });
          }
        }

        if (res.data?.tickets) {
          for (const t of res.data.tickets) {
            liveResults.push({
              id: `tkt-${t.id}`,
              category: 'SUPPORT_TICKET',
              title: t.title,
              subtitle: t.subtitle,
              route: t.route,
              icon: '🎧',
              badge: t.badge,
            });
          }
        }

        if (res.data?.users) {
          for (const u of res.data.users) {
            liveResults.push({
              id: `usr-${u.id}`,
              category: 'ADMIN_USER',
              title: u.title,
              subtitle: u.subtitle,
              route: u.route,
              icon: '👥',
              badge: u.badge,
            });
          }
        }

        // Include matching quick commands
        const matchingCommands = this.quickCommands.filter(
          (c) => c.title.toLowerCase().includes(query.toLowerCase()) || c.subtitle.toLowerCase().includes(query.toLowerCase())
        );

        this.filteredResults.set([...liveResults, ...matchingCommands]);
      },
      error: () => {
        this.isLoading.set(false);
        const fallbackCommands = this.quickCommands.filter(
          (c) => c.title.toLowerCase().includes(query.toLowerCase()) || c.subtitle.toLowerCase().includes(query.toLowerCase())
        );
        this.filteredResults.set(fallbackCommands);
      }
    });
  }

  selectItem(item: CommandItem): void {
    this.close.emit();
    this.router.navigate([item.route]);
    this.searchQuery = '';
    this.filteredResults.set(this.quickCommands);
  }
}
