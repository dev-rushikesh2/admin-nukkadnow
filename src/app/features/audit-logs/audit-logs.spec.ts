import { AuditLogsStore } from './state/audit-logs.store';
import { AuditLogsRepository } from './data-access/audit-logs.repository';

describe('AuditLogs Feature', () => {
  it('should be defined', () => {
    expect(AuditLogsStore).toBeDefined();
    expect(AuditLogsRepository).toBeDefined();
  });
});
