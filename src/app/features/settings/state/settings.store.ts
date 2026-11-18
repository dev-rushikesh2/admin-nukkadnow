import { Injectable, signal, computed, inject } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { SettingsRepository } from '../data-access/settings.repository';
import { PlatformSettingViewModel, PlatformSettingFilterCriteria } from '../models/settings-view.model';

@Injectable({
  providedIn: 'root'
})
export class SettingsStore {
  private readonly repository = inject(SettingsRepository);

  private readonly settingsState = signal<PlatformSettingViewModel | null>(null);
  private readonly itemsState = signal<PlatformSettingViewModel[]>([]);
  private readonly selectedItemState = signal<PlatformSettingViewModel | null>(null);
  private readonly totalCountState = signal<number>(0);
  private readonly loadingState = signal<boolean>(false);
  private readonly errorState = signal<string | null>(null);

  readonly settings = this.settingsState.asReadonly();
  readonly items = this.itemsState.asReadonly();
  readonly selectedItem = this.selectedItemState.asReadonly();
  readonly totalCount = this.totalCountState.asReadonly();
  readonly loading = this.loadingState.asReadonly();
  readonly error = this.errorState.asReadonly();

  loadSettings(): void {
    this.loadingState.set(true);
    this.errorState.set(null);

    this.repository.fetchSettings().subscribe({
      next: (data) => {
        this.settingsState.set(data);
        this.itemsState.set([data]);
        this.totalCountState.set(1);
        this.loadingState.set(false);
      },
      error: (err) => {
        this.errorState.set(err?.message || 'Failed to load platform settings');
        this.loadingState.set(false);
      }
    });
  }

  loadItems(filters?: PlatformSettingFilterCriteria): void {
    this.loadSettings();
  }

  loadById(id: string): void {
    this.loadSettings();
  }

  saveSettings(body: Partial<PlatformSettingViewModel>, reasonCode?: string): Observable<PlatformSettingViewModel> {
    this.loadingState.set(true);
    return this.repository.updateSettings(body, reasonCode).pipe(
      tap((updated) => {
        this.settingsState.set(updated);
        this.itemsState.set([updated]);
        this.loadingState.set(false);
      })
    );
  }
}
