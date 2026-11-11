import { Component, inject, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { PlansPricingStore } from '../state/plans-pricing.store';
import { PageHeaderComponent } from '@nukkadnow/admin-ui';
import { DataTableComponent, TableColumn } from '@nukkadnow/admin-data-table';
import { PricingPlanViewModel } from '../models/plans-pricing-view.model';

@Component({
  selector: 'admin-plans-pricing-list-page',
  standalone: true,
  imports: [CommonModule, PageHeaderComponent, DataTableComponent],
  templateUrl: './plans-pricing-list.page.html',
  styleUrls: ['./plans-pricing-list.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PlansPricingListPageComponent implements OnInit {
  readonly store = inject(PlansPricingStore);
  private readonly router = inject(Router);

  readonly tableColumns: TableColumn<PricingPlanViewModel>[] = [
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

  onRowClick(row: PricingPlanViewModel): void {
    this.router.navigate(['/plans-pricing', row.id]);
  }
}
