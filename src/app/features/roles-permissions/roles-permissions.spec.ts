import { RolesPermissionsStore } from './state/roles-permissions.store';
import { RolesPermissionsRepository } from './data-access/roles-permissions.repository';

describe('RolesPermissions Feature', () => {
  it('should be defined', () => {
    expect(RolesPermissionsStore).toBeDefined();
    expect(RolesPermissionsRepository).toBeDefined();
  });
});
