import { AdminGeoAssignment } from '@nukkadnow/admin-access-control';

export interface CityOption {
  id: string;
  name: string;
  state: string;
  district: string;
  localities: string[];
}

export interface PlatformUserViewModel {
  id: string;
  name: string;
  email: string;
  phone: string;
  roleCode: string;
  roleTitle: string;
  status: 'ACTIVE' | 'SUSPENDED';
  mfaEnabled: boolean;
  isRootProtected: boolean;
  geoAssignment?: AdminGeoAssignment;
  createdAt: string;
  lastLoginAt?: string;
  supervisedBy?: string;
}

export interface CreatePlatformUserDto {
  name: string;
  email: string;
  phone: string;
  roleCode: string;
  password?: string;
  geoAssignment?: AdminGeoAssignment;
}

export interface PlatformUserFilterCriteria {
  search?: string;
  role?: string;
  cityId?: string;
  status?: string;
  page?: number;
  limit?: number;
}
