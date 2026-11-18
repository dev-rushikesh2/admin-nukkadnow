import { Component, inject, OnInit, signal, computed, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CategoriesStore } from '../state/categories.store';
import { PageHeaderComponent } from '@nukkadnow/admin-ui';
import { DataTableComponent, TableColumn } from '@nukkadnow/admin-data-table';
import { CategoryViewModel } from '../models/categories-view.model';
import { CategoriesStatusChipComponent } from '../components/categories-status-chip.component';
import { AdminSessionService } from '../../../core/auth/session.service';

@Component({
  selector: 'admin-categories-list-page',
  standalone: true,
  imports: [CommonModule, FormsModule, PageHeaderComponent, DataTableComponent, CategoriesStatusChipComponent],
  templateUrl: './categories-list.page.html',
  styleUrls: ['./categories-list.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CategoriesListPageComponent implements OnInit {
  readonly store = inject(CategoriesStore);
  private readonly router = inject(Router);
  readonly sessionService = inject(AdminSessionService);

  readonly selectedStatus = signal<string>('ALL');
  readonly searchQuery = signal<string>('');
  readonly isAddModalOpen = signal<boolean>(false);
  readonly isSubmitting = signal<boolean>(false);

  // New Category Model
  newCategory = {
    name: '',
    code: '',
    emoji: '🏷️',
    commissionPct: 5.0,
    gstSlabPct: 5,
    status: 'ACTIVE' as 'ACTIVE' | 'ARCHIVED' | 'DRAFT'
  };

  readonly filteredCategories = computed(() => {
    let list = this.store.items();
    const status = this.selectedStatus();
    const query = this.searchQuery().toLowerCase().trim();

    if (status !== 'ALL') {
      list = list.filter(c => c.status === status);
    }

    if (query) {
      list = list.filter(c =>
        c.name.toLowerCase().includes(query) ||
        c.code.toLowerCase().includes(query)
      );
    }

    return list;
  });

  // Summary Metrics
  readonly totalCategoriesCount = computed(() => this.filteredCategories().length);
  readonly avgCommissionRate = computed(() => {
    const list = this.filteredCategories();
    if (list.length === 0) return '0.0';
    const sum = list.reduce((acc, curr) => acc + (curr.commissionPct || 5), 0);
    return (sum / list.length).toFixed(1);
  });
  readonly totalSkuCount = computed(() => {
    const list = this.filteredCategories();
    return list.reduce((acc, curr) => acc + (curr.activeItems || 0), 0);
  });

  readonly tableColumns: TableColumn<CategoryViewModel>[] = [
    { key: 'name', header: 'Taxonomy Category', sortable: true },
    { key: 'code', header: 'Taxonomy Code', width: '220px', sortable: true },
    { key: 'commissionPct', header: 'Commission %', width: '150px', align: 'center', sortable: true },
    { key: 'gstSlabPct', header: 'GST Slab %', width: '130px', align: 'center', sortable: true },
    { key: 'activeItems', header: 'Active SKUs', width: '130px', align: 'center', sortable: true },
    { key: 'status', header: 'Governance State', width: '160px', sortable: true }
  ];

  ngOnInit(): void {
    this.store.loadItems();
  }

  onStatusChange(status: string): void {
    this.selectedStatus.set(status);
  }

  onSearchChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.searchQuery.set(input.value);
  }

  refresh(): void {
    this.store.loadItems();
  }

  openAddModal(): void {
    this.newCategory = {
      name: '',
      code: '',
      emoji: '🏷️',
      commissionPct: 5.0,
      gstSlabPct: 5,
      status: 'ACTIVE'
    };
    this.isAddModalOpen.set(true);
  }

  closeAddModal(): void {
    this.isAddModalOpen.set(false);
  }

  onNameChange(): void {
    if (this.newCategory.name && !this.newCategory.code) {
      this.newCategory.code = 'CAT_' + this.newCategory.name.toUpperCase().replace(/[^A-Z0-9]/g, '_');
    }
  }

  submitNewCategory(): void {
    if (!this.newCategory.name) return;

    this.isSubmitting.set(true);
    const code = this.newCategory.code || ('CAT_' + this.newCategory.name.toUpperCase().replace(/[^A-Z0-9]/g, '_'));

    this.store.createCategory({
      ...this.newCategory,
      code,
      activeItems: 0,
      subcategoriesCount: 0
    }).subscribe({
      next: () => {
        this.isSubmitting.set(false);
        this.closeAddModal();
      },
      error: () => {
        this.isSubmitting.set(false);
      }
    });
  }

  exportCsv(): void {
    const list = this.filteredCategories();
    if (list.length === 0) return;

    const headers = ['Category ID', 'Category Name', 'Code', 'Emoji', 'Commission %', 'GST Slab %', 'Active SKUs', 'Status'];
    const rows = list.map(c => [
      `"${c.id}"`,
      `"${c.name}"`,
      `"${c.code}"`,
      `"${c.emoji}"`,
      c.commissionPct,
      c.gstSlabPct,
      c.activeItems,
      `"${c.status}"`
    ]);

    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `nukkadnow-categories-${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(link.href);
  }

  onRowClick(row: CategoryViewModel): void {
    this.router.navigate(['/categories', row.id]);
  }
}
