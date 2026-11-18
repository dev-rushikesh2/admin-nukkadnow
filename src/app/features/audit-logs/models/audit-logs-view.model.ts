export interface AuditLogRecordViewModel {
  id: string;
  operatorId: string;
  operatorName: string;
  action: string;
  targetEntity: string;
  targetId: string;
  reasonCode: string;
  justification: string;
  timestamp: string;
  tamperProof?: boolean;
  hashAlgorithm?: string;
  previousHash?: string;
  recordHash?: string;
  deltaDiff?: { before?: Record<string, unknown>; after?: Record<string, unknown> };
  name?: string;
  title?: string;
  status: string;
  createdAt: string;
  updatedAt?: string;
  metadata?: Record<string, unknown>;
}

export interface AuditLogRecordFilterCriteria {
  search?: string;
  action?: string;
  operatorId?: string;
  status?: string;
  page?: number;
  limit?: number;
}
