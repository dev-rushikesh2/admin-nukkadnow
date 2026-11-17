import { Component, inject, OnInit, signal, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CatalogueModerationStore } from '../state/catalogue-moderation.store';
import { PageHeaderComponent } from '@nukkadnow/admin-ui';
import { DataTableComponent, TableColumn } from '@nukkadnow/admin-data-table';
import { CatalogItemViewModel } from '../models/catalogue-moderation-view.model';

@Component({
  selector: 'admin-catalogue-moderation-list-page',
  standalone: true,
  imports: [CommonModule, FormsModule, PageHeaderComponent, DataTableComponent],
  templateUrl: './catalogue-moderation-list.page.html',
  styleUrls: ['./catalogue-moderation-list.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CatalogueModerationListPageComponent implements OnInit {
  readonly store = inject(CatalogueModerationStore);
  private readonly router = inject(Router);

  // Price Cap Form state
  readonly showAddCapForm = signal<boolean>(false);
  newScope: 'CATEGORY' | 'GLOBAL' | 'LOCALITY' = 'CATEGORY';
  newTargetKey = '';
  newMaxPriceRupees = 50;
  newReason = '';
  newEnforceMrp = true;

  readonly tableColumns: TableColumn<CatalogItemViewModel>[] = [
    { key: 'id', header: 'Reference ID', width: '180px', sortable: true },
    { key: 'name', header: 'Product Name', sortable: true },
    { key: 'category', header: 'Category', width: '150px', sortable: true },
    { key: 'priceFormatted', header: 'Selling Price', width: '120px', sortable: true },
    { key: 'mrpFormatted', header: 'MRP', width: '120px', sortable: true },
    { key: 'status', header: 'State', width: '120px', sortable: true },
    { key: 'anomalyWarning', header: 'Governance / Anomaly', sortable: false },
  ];

  ngOnInit(): void {
    this.store.loadItems();
  }

  refresh(): void {
    this.store.loadItems();
  }

  toggleAddCap(): void {
    this.showAddCapForm.update((v) => !v);
  }

  submitNewPriceCap(): void {
    if (!this.newTargetKey.trim() || this.newMaxPriceRupees <= 0) {
      alert('Please provide a target category/key and a positive maximum price.');
      return;
    }

    this.store.addPriceCap({
      scope: this.newScope,
      targetKey: this.newTargetKey.trim(),
      maxPricePaise: Math.round(this.newMaxPriceRupees * 100),
      enforceMrpCap: this.newEnforceMrp,
      reason: this.newReason.trim() || 'Platform Admin Regulatory Ceiling',
    });

    this.newTargetKey = '';
    this.newReason = '';
    this.showAddCapForm.set(false);
  }

  deactivateCap(id: string): void {
    if (confirm('Are you sure you want to deactivate this price cap rule?')) {
      this.store.deactivatePriceCap(id);
    }
  }

  onRowClick(row: CatalogItemViewModel): void {
    this.router.navigate(['/catalogue-moderation', row.id]);
  }
}
