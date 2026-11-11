import {
  Component,
  Input,
  Output,
  EventEmitter,
  ChangeDetectionStrategy,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableColumn, SortEvent, PageChangeEvent } from './data-table.model';

@Component({
  selector: 'admin-data-table',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="admin-data-table-wrapper">
      <div class="table-scroll-container">
        <table class="admin-table">
          <thead>
            <tr>
              @for (col of columns; track col.key) {
                <th
                  [style.width]="col.width"
                  [style.text-align]="col.align || 'left'"
                  [class.sortable]="col.sortable"
                  (click)="toggleSort(col)">
                  <div class="th-content">
                    <span>{{ col.header }}</span>
                    @if (col.sortable) {
                      <span class="sort-indicator">
                        @if (sortKey() === col.key) {
                          {{ sortDir() === 'asc' ? '▲' : '▼' }}
                        } @else {
                          ⇅
                        }
                      </span>
                    }
                  </div>
                </th>
              }
            </tr>
          </thead>
          <tbody>
            @if (loading) {
              @for (i of [1, 2, 3, 4, 5]; track i) {
                <tr class="skeleton-row">
                  @for (col of columns; track col.key) {
                    <td><div class="skeleton-bar"></div></td>
                  }
                </tr>
              }
            } @else if (data.length === 0) {
              <tr>
                <td [attr.colspan]="columns.length" class="empty-cell">
                  <div class="empty-state-message">
                    <span>No records found.</span>
                  </div>
                </td>
              </tr>
            } @else {
              @for (row of data; track trackByFn(row)) {
                <tr (click)="rowClick.emit(row)">
                  @for (col of columns; track col.key) {
                    <td [style.text-align]="col.align || 'left'">
                      @if (col.cellTemplate) {
                        <ng-container
                          *ngTemplateOutlet="col.cellTemplate; context: { $implicit: row[col.key], row: row }">
                        </ng-container>
                      } @else {
                        {{ row[col.key] }}
                      }
                    </td>
                  }
                </tr>
              }
            }
          </tbody>
        </table>
      </div>

      <!-- Pagination Toolbar -->
      <div class="table-pagination-bar">
        <div class="pagination-info">
          Showing {{ startItem() }} - {{ endItem() }} of {{ totalCount }} records
        </div>
        <div class="pagination-actions">
          <button
            class="admin-btn btn-secondary btn-sm"
            [disabled]="currentPage <= 1 || loading"
            (click)="onPageChange(currentPage - 1)">
            Previous
          </button>
          <span class="page-current">Page {{ currentPage }} of {{ totalPages() }}</span>
          <button
            class="admin-btn btn-secondary btn-sm"
            [disabled]="currentPage >= totalPages() || loading"
            (click)="onPageChange(currentPage + 1)">
            Next
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .admin-data-table-wrapper {
      background: var(--admin-bg-surface);
      border: 1px solid var(--admin-border-subtle);
      border-radius: var(--admin-radius-md);
      overflow: hidden;
    }
    .table-scroll-container {
      overflow-x: auto;
    }
    .th-content {
      display: inline-flex;
      align-items: center;
      gap: 6px;
    }
    .sortable {
      cursor: pointer;
      user-select: none;
      &:hover {
        background-color: var(--admin-bg-hover);
      }
    }
    .sort-indicator {
      font-size: 0.65rem;
      opacity: 0.6;
    }
    .empty-cell {
      text-align: center;
      padding: 48px 16px !important;
      color: var(--admin-text-muted);
    }
    .skeleton-bar {
      height: 16px;
      background: linear-gradient(90deg, var(--admin-bg-subtle) 25%, var(--admin-bg-elevated) 50%, var(--admin-bg-subtle) 75%);
      background-size: 200% 100%;
      animation: skeleton-loading 1.5s infinite;
      border-radius: 4px;
    }
    @keyframes skeleton-loading {
      0% { background-position: 200% 0; }
      100% { background-position: -200% 0; }
    }
    .table-pagination-bar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 12px 16px;
      border-top: 1px solid var(--admin-border-subtle);
      background-color: var(--admin-bg-surface);
      font-size: 0.8125rem;
      color: var(--admin-text-secondary);
    }
    .pagination-actions {
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .page-current {
      font-weight: 500;
      color: var(--admin-text-primary);
    }
  `],
})
export class DataTableComponent<T extends Record<string, any>> {
  @Input({ required: true }) columns: TableColumn<T>[] = [];
  @Input({ required: true }) data: T[] = [];
  @Input() totalCount = 0;
  @Input() currentPage = 1;
  @Input() pageSize = 20;
  @Input() loading = false;
  @Input() rowKey = 'id';

  @Output() sortChange = new EventEmitter<SortEvent>();
  @Output() pageChange = new EventEmitter<PageChangeEvent>();
  @Output() rowClick = new EventEmitter<T>();

  sortKey = signal<string | null>(null);
  sortDir = signal<'asc' | 'desc'>('asc');

  trackByFn(row: T): any {
    return row[this.rowKey] || JSON.stringify(row);
  }

  toggleSort(col: TableColumn<T>): void {
    if (!col.sortable) return;
    if (this.sortKey() === col.key) {
      const nextDir = this.sortDir() === 'asc' ? 'desc' : 'asc';
      this.sortDir.set(nextDir);
    } else {
      this.sortKey.set(col.key);
      this.sortDir.set('asc');
    }
    this.sortChange.emit({ key: col.key, direction: this.sortDir() });
  }

  onPageChange(page: number): void {
    this.pageChange.emit({ page, limit: this.pageSize });
  }

  totalPages(): number {
    return Math.max(1, Math.ceil(this.totalCount / this.pageSize));
  }

  startItem(): number {
    if (this.totalCount === 0) return 0;
    return (this.currentPage - 1) * this.pageSize + 1;
  }

  endItem(): number {
    return Math.min(this.currentPage * this.pageSize, this.totalCount);
  }
}
