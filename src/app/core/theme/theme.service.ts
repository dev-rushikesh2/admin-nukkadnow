import { Injectable, signal } from '@angular/core';

export type AdminTheme = 'light' | 'dark';

@Injectable({
  providedIn: 'root',
})
export class AdminThemeService {
  private readonly STORAGE_KEY = 'nukkadnow_admin_theme';

  readonly currentTheme = signal<AdminTheme>(this.getInitialTheme());

  constructor() {
    this.applyTheme(this.currentTheme());

    if (typeof window !== 'undefined' && window.matchMedia) {
      window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
        if (!localStorage.getItem(this.STORAGE_KEY)) {
          this.setTheme(e.matches ? 'dark' : 'light', false);
        }
      });
    }
  }

  toggleTheme(): void {
    const nextTheme: AdminTheme = this.currentTheme() === 'dark' ? 'light' : 'dark';
    this.setTheme(nextTheme, true);
  }

  setTheme(theme: AdminTheme, persist = true): void {
    this.currentTheme.set(theme);
    this.applyTheme(theme);
    if (persist && typeof localStorage !== 'undefined') {
      localStorage.setItem(this.STORAGE_KEY, theme);
    }
  }

  private getInitialTheme(): AdminTheme {
    if (typeof localStorage !== 'undefined') {
      const stored = localStorage.getItem(this.STORAGE_KEY) as AdminTheme | null;
      if (stored === 'light' || stored === 'dark') {
        return stored;
      }
    }
    // Default to 'light' for clean white mode as requested, while fully preserving dark mode
    return 'light';
  }

  private applyTheme(theme: AdminTheme): void {
    if (typeof document === 'undefined') return;

    const root = document.documentElement;
    const body = document.body;

    root.setAttribute('data-theme', theme);

    if (theme === 'light') {
      root.classList.remove('theme-dark', 'admin-theme-dark');
      root.classList.add('theme-light', 'admin-theme-light');
      if (body) {
        body.classList.remove('theme-dark', 'admin-theme-dark');
        body.classList.add('theme-light', 'admin-theme-light');
      }
    } else {
      root.classList.remove('theme-light', 'admin-theme-light');
      root.classList.add('theme-dark', 'admin-theme-dark');
      if (body) {
        body.classList.remove('theme-light', 'admin-theme-light');
        body.classList.add('theme-dark', 'admin-theme-dark');
      }
    }
  }
}
