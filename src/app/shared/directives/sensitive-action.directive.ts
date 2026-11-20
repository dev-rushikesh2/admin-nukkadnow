import {
  Directive,
  Input,
  Output,
  EventEmitter,
  HostListener,
  inject,
} from '@angular/core';
import { AdminPermission, PolicyEngine } from '@nukkadnow/admin-access-control';
import { AdminPermissionService } from '../../core/permissions/permission.service';
import { StepUpAuthService } from '../../core/auth/step-up-auth.service';
import { AuditReasonDialogService } from '../../core/audit-context/audit-reason-dialog.service';
import { AuditContextStore } from '../../core/audit-context/audit-context.store';

@Directive({
  selector: '[adminSensitiveAction]',
  standalone: true,
})
export class SensitiveActionDirective {
  private readonly permService = inject(AdminPermissionService);
  private readonly stepUpService = inject(StepUpAuthService);
  private readonly auditDialog = inject(AuditReasonDialogService);
  private readonly auditStore = inject(AuditContextStore);

  @Input('adminSensitiveAction') permission!: AdminPermission;
  @Input() actionTitle = 'Privileged Administrative Action';
  @Input() targetEntityId = '';

  @Output() actionAuthorized = new EventEmitter<{ reasonCode?: string; stepUpTicket?: string }>();
  @Output() stepUpRequired = new EventEmitter<{ permission: AdminPermission; actionTitle: string }>();
  @Output() accessDenied = new EventEmitter<{ permission: AdminPermission; message: string }>();

  @HostListener('click', ['$event'])
  async onClick(event: Event): Promise<void> {
    event.preventDefault();
    event.stopPropagation();

    // 1. Evaluate baseline authorization
    const policy = PolicyEngine.evaluate(this.permService.userPermissions(), this.permission);
    if (!policy.authorized) {
      console.warn(`[SensitiveActionDirective] Access Denied: Missing permission ${this.permission}`);
      this.accessDenied.emit({
        permission: this.permission,
        message: `Access Denied: Missing permission ${this.permission}`,
      });
      return;
    }

    // 2. Step-up MFA check if required
    let stepUpTicket: string | undefined;
    if (policy.requiresStepUp) {
      if (!this.stepUpService.hasValidTicket(this.permission)) {
        console.warn(`[SensitiveActionDirective] Step-up MFA verification required for: ${this.actionTitle}`);
        this.stepUpRequired.emit({
          permission: this.permission,
          actionTitle: this.actionTitle,
        });
        return;
      }
      stepUpTicket = this.stepUpService.getTicket(this.permission) || undefined;
    }

    // 3. Mandatory Audit Reason check
    let reasonCode: string | undefined;
    if (policy.requiresAuditReason) {
      const result = await this.auditDialog.promptReason({
        actionName: this.actionTitle,
        targetEntityId: this.targetEntityId,
        category: 'SECURITY',
        predefinedReasons: [
          { code: 'POLICY_VIOLATION', label: 'Merchant terms / safety violation' },
          { code: 'SUSPECTED_FRAUD', label: 'Suspicious transaction pattern / fraud trigger' },
          { code: 'CUSTOMER_ESCALATION', label: 'Escalated customer dispute resolution' },
          { code: 'ROUTINE_AUDIT', label: 'Scheduled compliance review' },
          { code: 'OPERATIONAL_OVERRIDE', label: 'Store emergency manual override' },
        ],
      });

      if (!result.confirmed || !result.reasonCode) {
        return; // Operator aborted dialog
      }

      reasonCode = result.reasonCode;
      this.auditStore.setReason(result.reasonCode, 'SECURITY', result.justification || '');
    }

    // All safety checks passed
    this.actionAuthorized.emit({
      reasonCode,
      stepUpTicket,
    });
  }
}
