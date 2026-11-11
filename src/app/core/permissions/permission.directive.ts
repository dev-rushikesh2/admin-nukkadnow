import {
  Directive,
  Input,
  TemplateRef,
  ViewContainerRef,
  inject,
  effect,
} from '@angular/core';
import { AdminPermissionService } from './permission.service';
import { AdminPermission } from '@nukkadnow/admin-access-control';

@Directive({
  selector: '[adminHasPermission]',
  standalone: true,
})
export class AdminHasPermissionDirective {
  private readonly permService = inject(AdminPermissionService);
  private readonly templateRef = inject(TemplateRef<unknown>);
  private readonly viewContainer = inject(ViewContainerRef);

  private requiredPermission: AdminPermission | null = null;
  private hasView = false;

  constructor() {
    effect(() => {
      // Re-evaluate whenever active permissions signal changes
      this.updateView();
    });
  }

  @Input('adminHasPermission')
  set permission(val: AdminPermission) {
    this.requiredPermission = val;
    this.updateView();
  }

  private updateView(): void {
    if (!this.requiredPermission) {
      this.showView();
      return;
    }

    const permitted = this.permService.hasPermission(this.requiredPermission);
    if (permitted && !this.hasView) {
      this.showView();
    } else if (!permitted && this.hasView) {
      this.clearView();
    }
  }

  private showView(): void {
    this.viewContainer.createEmbeddedView(this.templateRef);
    this.hasView = true;
  }

  private clearView(): void {
    this.viewContainer.clear();
    this.hasView = false;
  }
}
