import { Injectable, signal, computed, inject } from '@angular/core';
import { RolesPermissionsRepository } from '../data-access/roles-permissions.repository';
import { RolePermissionViewModel, RolePermissionFilterCriteria } from '../models/roles-permissions-view.model';

@Injectable({
  providedIn: 'root'
})
export class RolesPermissionsStore {
  private readonly repository = inject(RolesPermissionsRepository);

  private readonly itemsState = signal<RolePermissionViewModel[]>([]);
  private readonly selectedItemState = signal<RolePermissionViewModel | null>(null);
  private readonly totalCountState = signal<number>(0);
  private readonly loadingState = signal<boolean>(false);
  private readonly errorState = signal<string | null>(null);

  readonly items = this.itemsState.asReadonly();
  readonly selectedItem = this.selectedItemState.asReadonly();
  readonly totalCount = this.totalCountState.asReadonly();
  readonly loading = this.loadingState.asReadonly();
  readonly error = this.errorState.asReadonly();

  loadItems(filters?: RolePermissionFilterCriteria): void {
    this.loadingState.set(true);
    this.errorState.set(null);

    this.repository.fetchItems(filters).subscribe({
      next: (res) => {
        this.itemsState.set(res.items);
        this.totalCountState.set(res.total);
        this.loadingState.set(false);
      },
      error: (err) => {
        this.errorState.set(err?.message || 'Failed to load records');
        this.loadingState.set(false);
      }
    });
  }

  loadById(id: string): void {
    this.loadingState.set(true);
    this.repository.fetchById(id).subscribe({
      next: (item) => {
        this.selectedItemState.set(item);
        this.loadingState.set(false);
      },
      error: (err) => {
        this.errorState.set(err?.message || 'Failed to load record');
        this.loadingState.set(false);
      }
    });
  }
}
