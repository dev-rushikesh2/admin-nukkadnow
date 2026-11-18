export interface SystemHealthNodeViewModel {
  id: string;
  service: string;
  status: 'HEALTHY' | 'DEGRADED' | 'DOWN' | string;
  latencyMs: number;
  cpuUsagePct?: number;
  memoryUsageMb?: number;
  activePoolConnections?: number;
  port?: number;
  version?: string;
  uptimeSeconds?: number;
  name?: string;
  title?: string;
  createdAt: string;
  updatedAt?: string;
  metadata?: Record<string, unknown>;
}

export interface SystemHealthSummary {
  overallStatus: 'HEALTHY' | 'DEGRADED' | 'DOWN' | string;
  uptimeSeconds: number;
  p95LatencyMs: number;
  nodes: SystemHealthNodeViewModel[];
}

export interface SystemHealthNodeFilterCriteria {
  search?: string;
  status?: string;
  page?: number;
  limit?: number;
}
