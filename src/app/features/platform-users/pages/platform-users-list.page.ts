import { Component, inject, OnInit, signal, computed, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { PlatformUsersApi } from '../data-access/platform-users.api';
import { RolesPermissionsApi } from '../../roles-permissions/data-access/roles-permissions.api';
import { 
  PlatformUserViewModel, 
  CityOption, 
  CreatePlatformUserDto 
} from '../models/platform-users-view.model';
import { RolePermissionViewModel } from '../../roles-permissions/models/roles-permissions-view.model';
import { AdminGeoAssignment } from '@nukkadnow/admin-access-control';
import { AdminSessionService } from '../../../core/auth/session.service';

@Component({
  selector: 'admin-platform-users-list-page',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './platform-users-list.page.html',
  styleUrls: ['./platform-users-list.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PlatformUsersListPageComponent implements OnInit {
  private readonly usersApi = inject(PlatformUsersApi);
  private readonly rolesApi = inject(RolesPermissionsApi);
  readonly sessionService = inject(AdminSessionService);
  private readonly router = inject(Router);

  // Users and Cities signals
  readonly users = signal<PlatformUserViewModel[]>([]);
  readonly cities = signal<CityOption[]>([]);
  readonly availableRoles = signal<RolePermissionViewModel[]>([]);
  readonly isLoading = signal<boolean>(false);

  // Filters
  readonly searchQuery = signal<string>('');
  readonly selectedRoleFilter = signal<string>('ALL');
  readonly selectedCityFilter = signal<string>('ALL');

  // Provision Modal
  readonly isCreateModalOpen = signal<boolean>(false);
  readonly isSubmitting = signal<boolean>(false);
  readonly toastMessage = signal<string | null>(null);

  // Form Model for New User
  readonly newName = signal<string>('');
  readonly newEmail = signal<string>('');
  readonly newPhone = signal<string>('');
  readonly newRoleCode = signal<string>('SUPPORT_STAFF');
  readonly selectedCityId = signal<string>('city-pune');
  readonly selectedLocalities = signal<string[]>([]);

  // Geo Reassignment Modal
  readonly editingUserGeo = signal<PlatformUserViewModel | null>(null);
  readonly editCityId = signal<string>('city-pune');
  readonly editLocalities = signal<string[]>([]);

  // Filtered Users
  readonly filteredUsers = computed(() => {
    const q = this.searchQuery().toLowerCase().trim();
    const role = this.selectedRoleFilter();
    const city = this.selectedCityFilter();
    let list = this.users();

    if (role !== 'ALL') {
      list = list.filter(u => u.roleCode === role);
    }

    if (city !== 'ALL') {
      if (city === 'GLOBAL') {
        list = list.filter(u => !u.geoAssignment || !u.geoAssignment.cityId);
      } else {
        list = list.filter(u => u.geoAssignment?.cityId === city);
      }
    }

    if (q) {
      list = list.filter(u =>
        u.name.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q) ||
        u.phone.includes(q) ||
        u.roleTitle.toLowerCase().includes(q)
      );
    }

    return list;
  });

  // Metrics
  readonly activeCount = computed(() => this.users().filter(u => u.status === 'ACTIVE').length);
  readonly superAdminCount = computed(() => this.users().filter(u => u.roleCode === 'SUPER_ADMIN' || u.roleCode === 'ROOT_ADMIN').length);
  readonly cityManagerCount = computed(() => this.users().filter(u => u.roleCode === 'CITY_OPERATIONS_MANAGER').length);
  readonly staffCount = computed(() => this.users().filter(u => u.roleCode === 'VERIFICATION_STAFF' || u.roleCode === 'SUPPORT_STAFF').length);

  readonly activeSelectedCity = computed(() => this.cities().find(c => c.id === this.selectedCityId()));
  readonly activeEditCity = computed(() => this.cities().find(c => c.id === this.editCityId()));

  ngOnInit(): void {
    this.loadUsers();
    this.loadCities();
    this.loadRoles();
  }

  loadUsers(): void {
    this.isLoading.set(true);
    this.usersApi.getUsers().subscribe({
      next: (res) => {
        this.users.set(res.data.items);
        this.isLoading.set(false);
      },
      error: () => {
        this.isLoading.set(false);
      }
    });
  }

  loadCities(): void {
    this.usersApi.getCities().subscribe({
      next: (res) => {
        this.cities.set(res.data || []);
      },
      error: () => {}
    });
  }

  loadRoles(): void {
    this.rolesApi.getRoles().subscribe({
      next: (res) => {
        // Exclude ROOT_ADMIN from creation choices: Root is strictly protected!
        const nonRoot = (res.data.items || []).filter(r => r.code !== 'ROOT_ADMIN');
        this.availableRoles.set(nonRoot);
      },
      error: () => {}
    });
  }

  openCreateModal(): void {
    this.newName.set('');
    this.newEmail.set('');
    this.newPhone.set('+91 ');
    this.newRoleCode.set('SUPPORT_STAFF');
    this.selectedCityId.set('city-pune');
    const firstCity = this.cities().find(c => c.id === 'city-pune') || this.cities()[0];
    this.selectedLocalities.set(firstCity ? [...firstCity.localities] : []);
    this.isCreateModalOpen.set(true);
  }

  closeCreateModal(): void {
    this.isCreateModalOpen.set(false);
  }

  onCitySelectChange(cityId: string): void {
    this.selectedCityId.set(cityId);
    const city = this.cities().find(c => c.id === cityId);
    if (city) {
      this.selectedLocalities.set([...city.localities]);
    }
  }

  toggleLocality(loc: string): void {
    const current = this.selectedLocalities();
    if (current.includes(loc)) {
      this.selectedLocalities.set(current.filter(l => l !== loc));
    } else {
      this.selectedLocalities.set([...current, loc]);
    }
  }

  submitProvisionUser(): void {
    const name = this.newName().trim();
    const email = this.newEmail().trim();
    const phone = this.newPhone().trim();
    const roleCode = this.newRoleCode();

    if (!name || !email) {
      this.showToast('Name and Email are required');
      return;
    }

    if (roleCode === 'ROOT_ADMIN') {
      this.showToast('Forbidden: Root Administrator cannot be created via admin console.');
      return;
    }

    const isCityScoped = roleCode === 'CITY_OPERATIONS_MANAGER' || roleCode === 'VERIFICATION_STAFF' || roleCode === 'SUPPORT_STAFF';
    let geoAssignment: AdminGeoAssignment | undefined;

    if (isCityScoped) {
      const city = this.cities().find(c => c.id === this.selectedCityId());
      if (city) {
        geoAssignment = {
          state: city.state,
          district: city.district,
          cityId: city.id,
          cityName: city.name,
          localities: this.selectedLocalities()
        };
      }
    }

    this.isSubmitting.set(true);
    const dto: CreatePlatformUserDto = {
      name,
      email,
      phone,
      roleCode,
      geoAssignment
    };

    this.usersApi.createUser(dto).subscribe({
      next: (res) => {
        this.isSubmitting.set(false);
        this.closeCreateModal();
        this.showToast(`Operator "${name}" provisioned successfully!`);
        this.loadUsers();
      },
      error: (err) => {
        this.isSubmitting.set(false);
        this.showToast(err?.error?.message || 'Failed to provision user');
      }
    });
  }

  toggleUserStatus(user: PlatformUserViewModel): void {
    if (user.isRootProtected || user.roleCode === 'ROOT_ADMIN') {
      this.showToast('Protected Account: Root Admin cannot be suspended.');
      return;
    }

    const nextStatus = user.status === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE';
    this.usersApi.updateStatus(user.id, nextStatus, 'OPERATOR_LIFECYCLE_REVIEW').subscribe({
      next: () => {
        this.showToast(`Account of ${user.name} is now ${nextStatus}.`);
        this.loadUsers();
      },
      error: (err) => {
        this.showToast(err?.error?.message || 'Failed to update account status');
      }
    });
  }

  openEditGeoModal(user: PlatformUserViewModel): void {
    this.editingUserGeo.set(user);
    const currentCityId = user.geoAssignment?.cityId || this.cities()[0]?.id || 'city-pune';
    this.editCityId.set(currentCityId);
    this.editLocalities.set(user.geoAssignment?.localities ? [...user.geoAssignment.localities] : []);
  }

  closeEditGeoModal(): void {
    this.editingUserGeo.set(null);
  }

  onEditCityChange(cityId: string): void {
    this.editCityId.set(cityId);
    const city = this.cities().find(c => c.id === cityId);
    if (city) {
      this.editLocalities.set([...city.localities]);
    }
  }

  toggleEditLocality(loc: string): void {
    const cur = this.editLocalities();
    if (cur.includes(loc)) {
      this.editLocalities.set(cur.filter(l => l !== loc));
    } else {
      this.editLocalities.set([...cur, loc]);
    }
  }

  saveGeoAssignment(): void {
    const user = this.editingUserGeo();
    if (!user) return;

    const city = this.cities().find(c => c.id === this.editCityId());
    if (!city) return;

    const geo: AdminGeoAssignment = {
      state: city.state,
      district: city.district,
      cityId: city.id,
      cityName: city.name,
      localities: this.editLocalities()
    };

    this.usersApi.updateGeo(user.id, geo).subscribe({
      next: () => {
        this.closeEditGeoModal();
        this.showToast(`Geographic assignment updated for ${user.name}`);
        this.loadUsers();
      },
      error: (err) => {
        this.showToast(err?.error?.message || 'Failed to update geo assignment');
      }
    });
  }

  getRoleBadgeClass(roleCode: string): string {
    switch (roleCode) {
      case 'ROOT_ADMIN': return 'badge-root';
      case 'SUPER_ADMIN': return 'badge-super';
      case 'CITY_OPERATIONS_MANAGER': return 'badge-city';
      case 'VERIFICATION_STAFF': return 'badge-verification';
      case 'SUPPORT_STAFF': return 'badge-support';
      default: return 'badge-custom';
    }
  }

  private showToast(msg: string): void {
    this.toastMessage.set(msg);
    setTimeout(() => this.toastMessage.set(null), 3500);
  }
}
