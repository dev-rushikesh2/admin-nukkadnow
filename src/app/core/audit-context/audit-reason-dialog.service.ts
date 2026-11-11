import { Injectable, signal } from '@angular/core';
import { Subject } from 'rxjs';

export interface AuditPromptConfig {
  actionName: string;
  targetEntityId: string;
  category: 'SUSPENSION' | 'REFUND' | 'PII_UNMASK' | 'CANCELLATION' | 'SECURITY';
  predefinedReasons: { code: string; label: string }[];
}

export interface AuditPromptResult {
  confirmed: boolean;
  reasonCode?: string;
  justification?: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuditReasonDialogService {
  readonly isPromptOpen = signal(false);
  readonly currentConfig = signal<AuditPromptConfig | null>(null);

  private resultSubject = new Subject<AuditPromptResult>();

  promptReason(config: AuditPromptConfig): Promise<AuditPromptResult> {
    this.currentConfig.set(config);
    this.isPromptOpen.set(true);

    return new Promise((resolve) => {
      const sub = this.resultSubject.subscribe((res) => {
        sub.unsubscribe();
        this.isPromptOpen.set(false);
        this.currentConfig.set(null);
        resolve(res);
      });
    });
  }

  submitReason(reasonCode: string, justification: string): void {
    this.resultSubject.next({
      confirmed: true,
      reasonCode,
      justification,
    });
  }

  cancel(): void {
    this.resultSubject.next({
      confirmed: false,
    });
  }
}
