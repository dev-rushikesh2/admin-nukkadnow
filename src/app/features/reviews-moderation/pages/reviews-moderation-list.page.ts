import { Component, inject, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ReviewsModerationStore } from '../state/reviews-moderation.store';
import { PageHeaderComponent } from '@nukkadnow/admin-ui';
import { DataTableComponent, TableColumn } from '@nukkadnow/admin-data-table';
import { ReviewModerationViewModel } from '../models/reviews-moderation-view.model';

@Component({
  selector: 'admin-reviews-moderation-list-page',
  standalone: true,
  imports: [CommonModule, PageHeaderComponent, DataTableComponent],
  templateUrl: './reviews-moderation-list.page.html',
  styleUrls: ['./reviews-moderation-list.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ReviewsModerationListPageComponent implements OnInit {
  readonly store = inject(ReviewsModerationStore);
  private readonly router = inject(Router);

  readonly tableColumns: TableColumn<ReviewModerationViewModel>[] = [
    { key: 'id', header: 'Reference ID', width: '220px', sortable: true },
    { key: 'name', header: 'Name / Identifier', sortable: true },
    { key: 'status', header: 'State', width: '140px', sortable: true },
    { key: 'createdAt', header: 'Recorded At', width: '180px', sortable: true }
  ];

  ngOnInit(): void {
    this.store.loadItems();
  }

  refresh(): void {
    this.store.loadItems();
  }

  exportRecords(): void {
    // Export audited CSV
  }

  onRowClick(row: ReviewModerationViewModel): void {
    this.router.navigate(['/reviews-moderation', row.id]);
  }
}
