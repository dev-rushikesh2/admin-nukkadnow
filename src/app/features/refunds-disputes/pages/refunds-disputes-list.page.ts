import { Component, inject, OnInit, ChangeDetectionStrategy, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { RefundsDisputesRepository } from '../data-access/refunds-disputes.repository';
import { RefundDisputeViewModel } from '../models/refunds-disputes-view.model';
import { PageHeaderComponent, BadgeComponent } from '@nukkadnow/admin-ui';
import { DataTableComponent, TableColumn } from '@nukkadnow/admin-data-table';
import { InrCurrencyPipe } from '../../../shared/pipes/inr-currency.pipe';
import { AdminSessionService } from '../../../core/auth/session.service';

@Component({
  selector: 'admin-refunds-disputes-list-page',
  standalone: true,
  imports: [CommonModule, FormsModule, PageHeaderComponent, BadgeComponent, DataTableComponent, InrCurrencyPipe],
  templateUrl: './refunds-disputes-list.page.html',
  styleUrls: ['./refunds-disputes-list.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RefundsDisputesListPageComponent implements OnInit {
  private readonly repository = inject(RefundsDisputesRepository);
  private readonly router = inject(Router);
  readonly sessionService = inject(AdminSessionService);

  refunds = signal<RefundDisputeViewModel[]>([]);
  loading = signal<boolean>(false);
  selectedCity = 'ALL';
  selectedStatus = '';

  readonly activeCityName = computed(() => {
    const geo = this.sessionService.geoAssignment();
    if (geo?.cityName) return geo.cityName;
    return this.selectedCity === 'ALL' ? 'Multi-City Network' : this.selectedCity;
  });

  readonly dualSignRequiredCount = computed(() => this.refunds().filter(r => r.requiresDualSign && r.status === 'PENDING_SECOND_APPROVAL').length);
  readonly pendingFirstApprovalCount = computed(() => this.refunds().filter(r => r.status === 'PENDING_FIRST_APPROVAL').length);

  readonly tableColumns: TableColumn<RefundDisputeViewModel>[] = [
    { key: 'id', header: 'Refund Ref', width: '150px', sortable: true },
    { key: 'orderId', header: 'Order Ref', width: '160px', sortable: true },
    { key: 'merchantName', header: 'Merchant Store', sortable: true },
    { key: 'customerName', header: 'Customer', width: '160px' },
    { key: 'amountPaise', header: 'Refund Amount', width: '140px', align: 'right', sortable: true },
    { key: 'status', header: 'Authorization State', width: '200px', sortable: true },
    { key: 'requiresDualSign', header: 'Dual-Sign Policy', width: '140px' },
    { key: 'createdAt', header: 'Requested At', width: '150px', sortable: true },
  ];

  ngOnInit(): void {
    const geo = this.sessionService.geoAssignment();
    if (geo?.cityName) {
      this.selectedCity = geo.cityName;
    }
    this.loadRefunds();
  }

  loadRefunds(): void {
    this.loading.set(true);
    const filterCity = this.sessionService.geoAssignment()?.cityName || (this.selectedCity !== 'ALL' ? this.selectedCity : undefined);

    this.repository.fetchItems({
      city: filterCity,
      status: this.selectedStatus,
    } as any).subscribe((res) => {
      let items = res.items;
      if (this.selectedStatus) {
        items = items.filter(r => r.status === this.selectedStatus);
      }
      this.refunds.set(items);
      this.loading.set(false);
    });
  }

  onCityChange(city: string): void {
    this.selectedCity = city;
    this.loadRefunds();
  }

  filterStatus(status: string): void {
    this.selectedStatus = status;
    this.loadRefunds();
  }

  onRowClick(refund: RefundDisputeViewModel): void {
    this.router.navigate(['/refunds-disputes', refund.id]);
  }
}
