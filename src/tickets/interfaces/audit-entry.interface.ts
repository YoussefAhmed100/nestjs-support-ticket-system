export interface AuditEntry {
  handler: string;
  action: 'SKIPPED' | 'HANDLED' | 'ESCALATED';
  reason: string;
  timestamp: Date;
}