import { LocalityViewModel } from '../models/localities-view.model';

export class LocalitiesMapper {
  static toViewModel(dto: any): LocalityViewModel {
    return {
      id: dto.id || '',
      name: dto.name || dto.title || 'Micro-Market #' + dto.id,
      city: dto.city || 'Nagpur',
      pincode: dto.pincode || '440001',
      activeOutlets: typeof dto.activeOutlets === 'number' ? dto.activeOutlets : 0,
      deliveryRadiusKm: typeof dto.deliveryRadiusKm === 'number' ? dto.deliveryRadiusKm : 5,
      geofenceType: dto.geofenceType || 'POLYGON',
      status: dto.status || 'ACTIVE',
      boundaryCoordinates: dto.boundaryCoordinates || [],
      centerLat: dto.centerLat,
      centerLng: dto.centerLng,
      congestionMultiplier: dto.congestionMultiplier || 1.0,
      createdAt: dto.createdAt || new Date().toISOString(),
      updatedAt: dto.updatedAt,
      metadata: dto.metadata || {}
    };
  }
}
