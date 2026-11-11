import { Injectable, signal } from '@angular/core';

export interface ActiveAuditReason {
  reasonCode: string;
  category: string;
  justification: string;
  timestamp: number;
}

@Injectable({
  providedIn: 'root',
})
export class AuditContextStore {
  private readonly currentReason = signal<ActiveAuditReason | null>(null);

  readonly activeReason = this.currentReason.asReadonly();

  setReason(reasonCode: string, category: string, justification: string): void {
    this.currentReason.set({
      reasonCode,
      category,
      justification,
      timestamp: Date.now(),
    });
  }

  clearReason(): void {
    this.currentReason.set(null);
  }
}
