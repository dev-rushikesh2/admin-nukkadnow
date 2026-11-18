import { AuditLogRecordViewModel } from '../models/audit-logs-view.model';

export class AuditLogsMapper {
  static toViewModel(dto: any): AuditLogRecordViewModel {
    return {
      id: dto.id || '',
      operatorId: dto.operatorId || 'operator-sa-001',
      operatorName: dto.operatorName || 'System Operator',
      action: dto.action || 'INTERVENTION',
      targetEntity: dto.targetEntity || 'Entity',
      targetId: dto.targetId || '',
      reasonCode: dto.reasonCode || 'OPERATIONAL_AUDIT',
      justification: dto.justification || '',
      timestamp: dto.timestamp || dto.createdAt || new Date().toISOString(),
      tamperProof: dto.tamperProof !== false,
      hashAlgorithm: dto.hashAlgorithm || 'HMAC-SHA256',
      previousHash: dto.previousHash || '0000000000000000000000000000000000000000000000000000000000000000',
      recordHash: dto.recordHash || 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
      deltaDiff: dto.deltaDiff,
      name: `${dto.action} on ${dto.targetEntity}`,
      title: `${dto.action} (${dto.targetId})`,
      status: dto.status || 'VERIFIED',
      createdAt: dto.timestamp || dto.createdAt || new Date().toISOString(),
      updatedAt: dto.updatedAt,
      metadata: dto.metadata || {},
    };
  }
}
