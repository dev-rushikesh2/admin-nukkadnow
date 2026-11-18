import { Component, inject, OnInit, signal, computed, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { RolesPermissionsApi } from '../data-access/roles-permissions.api';
import { 
  RolePermissionViewModel, 
  AdminPermissionItem, 
  CreateDynamicRoleDto,
  MODULE_RESPONSIBILITIES_MATRIX,
  ModuleResponsibilityRow
} from '../models/roles-permissions-view.model';
import { AdminSessionService } from '../../../core/auth/session.service';

@Component({
  selector: 'admin-roles-permissions-list-page',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './roles-permissions-list.page.html',
  styleUrls: ['./roles-permissions-list.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RolesPermissionsListPageComponent implements OnInit {
  private readonly api = inject(RolesPermissionsApi);
  readonly sessionService = inject(AdminSessionService);
  private readonly router = inject(Router);

  // Dynamic roles loaded from backend database
  readonly roles = signal<RolePermissionViewModel[]>([]);
  readonly isLoading = signal<boolean>(false);
  readonly searchQuery = signal<string>('');

  // Available granular permissions grouped by module
  readonly permissionsCatalog = signal<Record<string, AdminPermissionItem[]>>({});

  // Responsibilities comparison matrix
  readonly responsibilitiesMatrix: ModuleResponsibilityRow[] = MODULE_RESPONSIBILITIES_MATRIX;

  // Create Role Modal
  readonly isCreateModalOpen = signal<boolean>(false);
  readonly isSubmitting = signal<boolean>(false);
  readonly toastMessage = signal<string | null>(null);

  // Form Model for New Role
  readonly newRoleCode = signal<string>('');
  readonly newRoleTitle = signal<string>('');
  readonly newHierarchyLevel = signal<number>(4);
  readonly newRoleDescription = signal<string>('');
  readonly newRequiresMfa = signal<boolean>(true);
  readonly selectedPermissions = signal<string[]>([]);

  // Selected Role Details Modal
  readonly inspectingRole = signal<RolePermissionViewModel | null>(null);

  // Filtered Roles
  readonly filteredRoles = computed(() => {
    const q = this.searchQuery().toLowerCase().trim();
    const list = this.roles();
    if (!q) return list;
    return list.filter(r => 
      r.title.toLowerCase().includes(q) || 
      r.code.toLowerCase().includes(q) || 
      r.description.toLowerCase().includes(q)
    );
  });

  ngOnInit(): void {
    this.loadRoles();
    this.loadPermissionsCatalog();
  }

  loadRoles(): void {
    this.isLoading.set(true);
    this.api.getRoles({ search: this.searchQuery() }).subscribe({
      next: (res) => {
        this.roles.set(res.data.items);
        this.isLoading.set(false);
      },
      error: () => {
        this.isLoading.set(false);
      }
    });
  }

  loadPermissionsCatalog(): void {
    this.api.getPermissions().subscribe({
      next: (res) => {
        this.permissionsCatalog.set(res.data || {});
      },
      error: () => {}
    });
  }

  openCreateModal(): void {
    this.newRoleCode.set('');
    this.newRoleTitle.set('');
    this.newHierarchyLevel.set(4);
    this.newRoleDescription.set('');
    this.newRequiresMfa.set(true);
    this.selectedPermissions.set([
      'orders.read',
      'merchants.read'
    ]);
    this.isCreateModalOpen.set(true);
  }

  closeCreateModal(): void {
    this.isCreateModalOpen.set(false);
  }

  togglePermission(permCode: string): void {
    const current = this.selectedPermissions();
    if (current.includes(permCode)) {
      this.selectedPermissions.set(current.filter(p => p !== permCode));
    } else {
      this.selectedPermissions.set([...current, permCode]);
    }
  }

  isPermissionSelected(permCode: string): boolean {
    return this.selectedPermissions().includes(permCode);
  }

  submitCreateRole(): void {
    const code = this.newRoleCode().trim().toUpperCase().replace(/\s+/g, '_');
    const title = this.newRoleTitle().trim();
    if (!code || !title) {
      this.showToast('Please specify Role Code and Title');
      return;
    }

    if (code === 'ROOT_ADMIN') {
      this.showToast('Root Admin role is protected and cannot be created.');
      return;
    }

    this.isSubmitting.set(true);
    const dto: CreateDynamicRoleDto = {
      code,
      title,
      hierarchyLevel: Number(this.newHierarchyLevel()),
      description: this.newRoleDescription().trim(),
      requiresMfa: this.newRequiresMfa(),
      permissions: this.selectedPermissions()
    };

    this.api.createRole(dto).subscribe({
      next: (res) => {
        this.isSubmitting.set(false);
        this.closeCreateModal();
        this.showToast(`Dynamic role "${title}" created successfully!`);
        this.loadRoles();
      },
      error: (err) => {
        this.isSubmitting.set(false);
        this.showToast(err?.error?.message || 'Failed to create dynamic role');
      }
    });
  }

  inspectRole(role: RolePermissionViewModel): void {
    this.inspectingRole.set(role);
  }

  closeInspectModal(): void {
    this.inspectingRole.set(null);
  }

  deleteRole(role: RolePermissionViewModel): void {
    if (role.isSystem || role.code === 'ROOT_ADMIN') {
      this.showToast('System core roles are protected and cannot be deleted.');
      return;
    }

    if (!confirm(`Are you sure you want to delete custom role "${role.title}"?`)) {
      return;
    }

    this.api.deleteRole(role.id).subscribe({
      next: () => {
        this.showToast(`Role "${role.title}" removed.`);
        this.loadRoles();
      },
      error: (err) => {
        this.showToast(err?.error?.message || 'Failed to delete role');
      }
    });
  }

  getHierarchyBadge(level: number): { label: string; class: string } {
    switch (level) {
      case 1: return { label: 'Level 1: Root Authority', class: 'badge-root' };
      case 2: return { label: 'Level 2: Super Admin', class: 'badge-super' };
      case 3: return { label: 'Level 3: City Operations', class: 'badge-city' };
      case 4: return { label: 'Level 4: Staff Member', class: 'badge-staff' };
      default: return { label: `Level ${level}: Custom Specialist`, class: 'badge-custom' };
    }
  }

  getModuleCategories(): string[] {
    return Object.keys(this.permissionsCatalog());
  }

  private showToast(msg: string): void {
    this.toastMessage.set(msg);
    setTimeout(() => this.toastMessage.set(null), 3500);
  }
}
