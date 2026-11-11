import { Injectable, signal, inject, OnDestroy } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AdminSessionService } from '../auth/session.service';

export interface AdminRealtimeMessage<T = unknown> {
  topic: string;
  payload: T;
  timestamp: string;
}

@Injectable({
  providedIn: 'root',
})
export class AdminRealtimeService implements OnDestroy {
  private readonly sessionService = inject(AdminSessionService);
  private socket: WebSocket | null = null;
  private reconnectAttempts = 0;
  private reconnectTimer: any = null;

  readonly isConnected = signal(false);
  private messageSubject = new Subject<AdminRealtimeMessage>();

  connect(): void {
    if (this.socket || !this.sessionService.isAuthenticated()) return;

    const token = this.sessionService.getToken();
    const url = `${environment.realtimeWsUrl}?token=${token}`;

    try {
      this.socket = new WebSocket(url);

      this.socket.onopen = () => {
        this.isConnected.set(true);
        this.reconnectAttempts = 0;
      };

      this.socket.onmessage = (event) => {
        try {
          const parsed = JSON.parse(event.data) as AdminRealtimeMessage;
          this.messageSubject.next(parsed);
        } catch (e) {
          console.error('[WS-PARSE-ERROR] Invalid realtime frame:', e);
        }
      };

      this.socket.onclose = () => {
        this.isConnected.set(false);
        this.socket = null;
        this.scheduleReconnect();
      };

      this.socket.onerror = () => {
        this.isConnected.set(false);
      };
    } catch (err) {
      console.error('[WS-CONNECT-ERROR] Could not establish connection:', err);
      this.scheduleReconnect();
    }
  }

  private scheduleReconnect(): void {
    if (this.reconnectTimer) clearTimeout(this.reconnectTimer);
    const delay = Math.min(30000, Math.pow(2, this.reconnectAttempts) * 1000);
    this.reconnectAttempts++;

    this.reconnectTimer = setTimeout(() => {
      this.connect();
    }, delay);
  }

  onTopic<T>(topic: string): Observable<T> {
    const subject = new Subject<T>();
    this.messageSubject.subscribe((msg) => {
      if (msg.topic === topic) {
        subject.next(msg.payload as T);
      }
    });
    return subject.asObservable();
  }

  disconnect(): void {
    if (this.reconnectTimer) clearTimeout(this.reconnectTimer);
    if (this.socket) {
      this.socket.close();
      this.socket = null;
    }
    this.isConnected.set(false);
  }

  ngOnDestroy(): void {
    this.disconnect();
  }
}
