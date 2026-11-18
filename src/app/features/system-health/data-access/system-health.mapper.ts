import { SystemHealthNodeViewModel } from '../models/system-health-view.model';

export class SystemHealthMapper {
  static toViewModel(dto: any): SystemHealthNodeViewModel {
    const serviceName = dto.service || dto.name || 'node';
    return {
      id: dto.id || serviceName,
      service: serviceName,
      status: dto.status || 'HEALTHY',
      latencyMs: Number(dto.latencyMs) || 12,
      cpuUsagePct: Number(dto.cpuUsagePct) || 15,
      memoryUsageMb: Number(dto.memoryUsageMb) || 64,
      activePoolConnections: dto.activePoolConnections !== undefined ? Number(dto.activePoolConnections) : undefined,
      port: dto.port ? Number(dto.port) : undefined,
      version: dto.version || '1.0.0',
      uptimeSeconds: dto.uptimeSeconds ? Number(dto.uptimeSeconds) : undefined,
      name: serviceName.toUpperCase().replace(/-/g, ' '),
      title: `${serviceName} Microservice Node`,
      createdAt: dto.createdAt || new Date().toISOString(),
      updatedAt: dto.updatedAt,
      metadata: dto.metadata || {},
    };
  }
}
