import { TemplateRef } from '@angular/core';

export interface TableColumn<T = unknown> {
  key: string;
  header: string;
  sortable?: boolean;
  width?: string;
  cellTemplate?: TemplateRef<{ $implicit: T, row: T }>;
  align?: 'left' | 'center' | 'right';
}

export interface SortEvent {
  key: string;
  direction: 'asc' | 'desc';
}

export interface PageChangeEvent {
  page: number;
  limit: number;
}
