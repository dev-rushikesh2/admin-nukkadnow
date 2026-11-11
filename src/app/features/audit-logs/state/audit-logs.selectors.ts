import { AuditLogRecordViewModel } from '../models/audit-logs-view.model';

export class AuditLogsSelectors {
  static filterByStatus(items: AuditLogRecordViewModel[], status: string): AuditLogRecordViewModel[] {
    return items.filter(item => item.status.toLowerCase() === status.toLowerCase());
  }
}
