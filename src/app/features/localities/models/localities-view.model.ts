export interface LocalityViewModel {
  id: string;
  name: string;
  city: string;
  pincode: string;
  activeOutlets: number;
  deliveryRadiusKm: number;
  geofenceType: 'POLYGON' | 'RADIUS_CIRCLE';
  status: 'ACTIVE' | 'CONGESTED' | 'MAINTENANCE' | 'INACTIVE';
  boundaryCoordinates?: { lat: number; lng: number }[];
  centerLat?: number;
  centerLng?: number;
  congestionMultiplier?: number;
  createdAt: string;
  updatedAt?: string;
  metadata?: Record<string, unknown>;
}

export interface LocalityFilterCriteria {
  search?: string;
  city?: string;
  status?: string;
  page?: number;
  limit?: number;
}
