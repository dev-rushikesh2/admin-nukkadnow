import { Component, inject, OnInit, ChangeDetectionStrategy, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ReviewsModerationStore } from '../state/reviews-moderation.store';
import { ReviewModerationViewModel } from '../models/reviews-moderation-view.model';
import { PageHeaderComponent, BadgeComponent } from '@nukkadnow/admin-ui';
import { DataTableComponent, TableColumn } from '@nukkadnow/admin-data-table';
import { ReviewsModerationStatusChipComponent } from '../components/reviews-moderation-status-chip.component';
import { AdminSessionService } from '../../../core/auth/session.service';
import { formatSentimentBadge } from '../utils/reviews-moderation.utils';

@Component({
  selector: 'admin-reviews-moderation-list-page',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    PageHeaderComponent,
    BadgeComponent,
    DataTableComponent,
    ReviewsModerationStatusChipComponent,
  ],
  templateUrl: './reviews-moderation-list.page.html',
  styleUrls: ['./reviews-moderation-list.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReviewsModerationListPageComponent implements OnInit {
  readonly store = inject(ReviewsModerationStore);
  readonly sessionService = inject(AdminSessionService);
  private readonly router = inject(Router);

  searchQuery = '';
  selectedCity = 'ALL';
  selectedRating = 'ALL';
  selectedStatus = 'ALL';

  readonly activeCityName = computed(() => {
    const geo = this.sessionService.geoAssignment();
    if (geo?.cityName) return geo.cityName;
    return this.selectedCity === 'ALL' ? 'Multi-City Network' : this.selectedCity;
  });

  // Action modal state
  showTakedownModal = signal<boolean>(false);
  activeReviewForTakedown = signal<ReviewModerationViewModel | null>(null);
  takedownReason = 'COMMUNITY_POLICY_VIOLATION';
  takedownJustification = '';

  readonly tableColumns: TableColumn<ReviewModerationViewModel>[] = [
    { key: 'id', header: 'Review ID', width: '130px', sortable: true },
    { key: 'rating', header: 'Rating', width: '110px', sortable: true },
    { key: 'merchantName', header: 'Target Storefront', width: '220px', sortable: true },
    { key: 'city', header: 'City & Locality', width: '170px', sortable: true },
    { key: 'comment', header: 'Review Feedback Snippet', sortable: false },
    { key: 'status', header: 'Status', width: '140px', sortable: true },
    { key: 'createdAt', header: 'Submitted', width: '150px', sortable: true },
  ];

  ngOnInit(): void {
    this.fetchData();
  }

  fetchData(): void {
    const geo = this.sessionService.geoAssignment();
    const city = geo?.cityName || (this.selectedCity !== 'ALL' ? this.selectedCity : undefined);
    this.store.loadItems({
      search: this.searchQuery || undefined,
      city,
      rating: this.selectedRating !== 'ALL' ? this.selectedRating : undefined,
      status: this.selectedStatus !== 'ALL' ? this.selectedStatus : undefined,
    });
  }

  onCityFilterChange(city: string): void {
    this.selectedCity = city;
    this.fetchData();
  }

  onRatingFilter(rating: string): void {
    this.selectedRating = rating;
    this.fetchData();
  }

  onStatusFilter(status: string): void {
    this.selectedStatus = status;
    this.fetchData();
  }

  applySearch(): void {
    this.fetchData();
  }

  clearSearch(): void {
    this.searchQuery = '';
    this.fetchData();
  }

  getSentimentBadge(sentiment: string) {
    return formatSentimentBadge(sentiment);
  }

  onRowClick(row: ReviewModerationViewModel): void {
    this.router.navigate(['/reviews-moderation', row.id]);
  }

  quickApprove(review: ReviewModerationViewModel, event: Event): void {
    event.stopPropagation();
    this.store.updateStatus(review.id, 'APPROVED', 'POLICY_COMPLIANT_CLEARANCE').subscribe();
  }

  openTakedownModal(review: ReviewModerationViewModel, event: Event): void {
    event.stopPropagation();
    this.activeReviewForTakedown.set(review);
    this.takedownJustification = '';
    this.showTakedownModal.set(true);
  }

  closeTakedownModal(): void {
    this.showTakedownModal.set(false);
    this.activeReviewForTakedown.set(null);
  }

  confirmTakedown(): void {
    const review = this.activeReviewForTakedown();
    if (!review) return;

    this.store.updateStatus(review.id, 'REMOVED', this.takedownReason).subscribe(() => {
      this.closeTakedownModal();
    });
  }

  exportRecords(): void {
    const items = this.store.items();
    if (!items.length) return;

    const headers = ['ReviewID', 'Rating', 'Merchant', 'City', 'Locality', 'Customer', 'Status', 'Sentiment', 'CreatedAt'];
    const rows = items.map(r => [
      r.id,
      r.rating,
      `"${r.merchantName.replace(/"/g, '""')}"`,
      r.city,
      r.locality,
      `"${r.customerName.replace(/"/g, '""')}"`,
      r.status,
      r.sentiment,
      r.createdAt,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `nukkadnow-reviews-audit-${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}
