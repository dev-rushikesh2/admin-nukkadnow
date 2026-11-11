import { Injectable, signal, inject, NgZone, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { AdminSessionService } from './session.service';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class IdleTimeoutService implements OnDestroy {
  private readonly sessionService = inject(AdminSessionService);
  private readonly router = inject(Router);
  private readonly ngZone = inject(NgZone);

  private idleTimer: any = null;
  private warningTimer: any = null;
  private lastActivityTimestamp = Date.now();

  readonly isWarningVisible = signal(false);
  readonly secondsRemaining = signal(60);

  private readonly timeoutMs = environment.sessionIdleTimeoutMinutes * 60 * 1000;
  private readonly warningDurationMs = environment.sessionWarningCountdownSeconds * 1000;

  private readonly boundReset = () => this.recordActivity();

  startMonitoring(): void {
    this.stopMonitoring();
    this.recordActivity();

    this.ngZone.runOutsideAngular(() => {
      window.addEventListener('mousemove', this.boundReset, { passive: true });
      window.addEventListener('keydown', this.boundReset, { passive: true });
      window.addEventListener('click', this.boundReset, { passive: true });
      window.addEventListener('scroll', this.boundReset, { passive: true });
    });
  }

  stopMonitoring(): void {
    if (this.idleTimer) clearTimeout(this.idleTimer);
    if (this.warningTimer) clearInterval(this.warningTimer);

    window.removeEventListener('mousemove', this.boundReset);
    window.removeEventListener('keydown', this.boundReset);
    window.removeEventListener('click', this.boundReset);
    window.removeEventListener('scroll', this.boundReset);
  }

  recordActivity(): void {
    this.lastActivityTimestamp = Date.now();
    if (this.isWarningVisible()) {
      this.dismissWarning();
    }
    this.scheduleTimers();
  }

  private scheduleTimers(): void {
    if (this.idleTimer) clearTimeout(this.idleTimer);
    if (this.warningTimer) clearInterval(this.warningTimer);

    const timeUntilWarning = Math.max(0, this.timeoutMs - this.warningDurationMs);

    this.idleTimer = setTimeout(() => {
      this.ngZone.run(() => {
        this.triggerWarning();
      });
    }, timeUntilWarning);
  }

  private triggerWarning(): void {
    if (!this.sessionService.isAuthenticated()) return;

    this.isWarningVisible.set(true);
    this.secondsRemaining.set(environment.sessionWarningCountdownSeconds);

    this.warningTimer = setInterval(() => {
      this.ngZone.run(() => {
        const remaining = this.secondsRemaining() - 1;
        this.secondsRemaining.set(remaining);

        if (remaining <= 0) {
          clearInterval(this.warningTimer);
          this.lockSessionDueToInactivity();
        }
      });
    }, 1000);
  }

  dismissWarning(): void {
    this.isWarningVisible.set(false);
    if (this.warningTimer) clearInterval(this.warningTimer);
  }

  private lockSessionDueToInactivity(): void {
    this.isWarningVisible.set(false);
    this.sessionService.lockConsole();
    this.router.navigate(['/auth/lock-screen']);
  }

  ngOnDestroy(): void {
    this.stopMonitoring();
  }
}
