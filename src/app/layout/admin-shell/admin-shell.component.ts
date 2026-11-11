import { Component, signal, inject, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AdminTopbarComponent } from '../topbar/admin-topbar.component';
import { AdminSidebarComponent } from '../sidebar/admin-sidebar.component';
import { CommandSearchComponent } from '../command-search/command-search.component';
import { AuditReasonModalComponent } from '../../shared/components/audit-reason-modal/audit-reason-modal.component';
import { IdleTimeoutService } from '../../core/auth/idle-timeout.service';
import { AdminRealtimeService } from '../../core/realtime/admin-realtime.service';
import { SystemAlertsService } from '../../core/realtime/system-alerts.service';

@Component({
  selector: 'admin-shell',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    AdminTopbarComponent,
    AdminSidebarComponent,
    CommandSearchComponent,
    AuditReasonModalComponent,
  ],
  templateUrl: './admin-shell.component.html',
  styleUrls: ['./admin-shell.component.scss'],
})
export class AdminShellComponent implements OnInit, OnDestroy {
  readonly idleService = inject(IdleTimeoutService);
  private readonly realtime = inject(AdminRealtimeService);
  private readonly alertsService = inject(SystemAlertsService);

  sidebarCollapsed = signal(false);
  commandSearchOpen = signal(false);

  ngOnInit(): void {
    this.idleService.startMonitoring();
    this.realtime.connect();
    this.alertsService.initAlertListener();
  }

  ngOnDestroy(): void {
    this.idleService.stopMonitoring();
    this.realtime.disconnect();
  }

  toggleSidebar(): void {
    this.sidebarCollapsed.set(!this.sidebarCollapsed());
  }

  openCommandSearch(): void {
    this.commandSearchOpen.set(true);
  }

  closeCommandSearch(): void {
    this.commandSearchOpen.set(false);
  }
}
