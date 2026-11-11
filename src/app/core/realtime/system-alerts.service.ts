import { Injectable, signal, inject } from '@angular/core';
import { AdminRealtimeService } from './admin-realtime.service';

export interface SystemAlert {
  id: string;
  severity: 'CRITICAL' | 'HIGH' | 'WARNING' | 'INFO';
  service: string;
  message: string;
  timestamp: string;
}

@Injectable({
  providedIn: 'root',
})
export class SystemAlertsService {
  private readonly realtime = inject(AdminRealtimeService);
  private readonly alertsState = signal<SystemAlert[]>([]);

  readonly activeAlerts = this.alertsState.asReadonly();

  initAlertListener(): void {
    this.realtime.onTopic<SystemAlert>('system.alert').subscribe((alert) => {
      this.alertsState.update((current) => [alert, ...current.slice(0, 49)]);
    });
  }

  dismissAlert(id: string): void {
    this.alertsState.update((current) => current.filter((a) => a.id !== id));
  }
}
