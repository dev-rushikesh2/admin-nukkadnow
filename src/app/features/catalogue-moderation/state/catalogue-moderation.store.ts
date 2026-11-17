import { Injectable, signal, inject } from '@angular/core';
import { CatalogueModerationRepository } from '../data-access/catalogue-moderation.repository';
import { CatalogueModerationApi } from '../data-access/catalogue-moderation.api';
import {
  CatalogItemViewModel,
  CatalogItemFilterCriteria,
  PriceCapRuleViewModel,
  CreatePriceCapPayload,
} from '../models/catalogue-moderation-view.model';

@Injectable({
  providedIn: 'root',
})
export class CatalogueModerationStore {
  private readonly repository = inject(CatalogueModerationRepository);
  private readonly api = inject(CatalogueModerationApi);

  private readonly itemsState = signal<CatalogItemViewModel[]>([]);
  private readonly priceCapsState = signal<PriceCapRuleViewModel[]>([
    {
      id: 'cap-dairy-default',
      scope: 'CATEGORY',
      targetKey: 'Dairy & Milk',
      maxPricePaise: 8000,
      maxPriceFormatted: '₹80.00',
      enforceMrpCap: true,
      reason: 'Essential commodity price stabilization mandate',
      isActive: true,
      createdBy: 'PLATFORM_ADMIN',
      createdAt: '2026-11-16',
    },
    {
      id: 'cap-snacks-default',
      scope: 'CATEGORY',
      targetKey: 'Sweets & Snacks',
      maxPricePaise: 50000,
      maxPriceFormatted: '₹500.00',
      enforceMrpCap: true,
      reason: 'Fair pricing guideline for consumer snacks',
      isActive: true,
      createdBy: 'PLATFORM_ADMIN',
      createdAt: '2026-11-16',
    },
  ]);
  private readonly selectedItemState = signal<CatalogItemViewModel | null>(null);
  private readonly totalCountState = signal<number>(0);
  private readonly loadingState = signal<boolean>(false);
  private readonly errorState = signal<string | null>(null);

  readonly items = this.itemsState.asReadonly();
  readonly priceCaps = this.priceCapsState.asReadonly();
  readonly selectedItem = this.selectedItemState.asReadonly();
  readonly totalCount = this.totalCountState.asReadonly();
  readonly loading = this.loadingState.asReadonly();
  readonly error = this.errorState.asReadonly();

  loadItems(filters?: CatalogItemFilterCriteria): void {
    this.loadingState.set(true);
    this.errorState.set(null);

    this.repository.fetchItems(filters).subscribe({
      next: (res) => {
        this.itemsState.set(res.items);
        this.totalCountState.set(res.total);
        this.loadingState.set(false);
      },
      error: () => {
        // Fallback demo state if backend offline
        this.itemsState.set([
          {
            id: 'prod-samosa-flag-1',
            name: 'Nagpur Premium Samosa Platter',
            category: 'Sweets & Snacks',
            pricePaise: 2500,
            priceFormatted: '₹25.00',
            compareAtPricePaise: 3000,
            mrpFormatted: '₹30.00',
            outletId: 'outlet-dharampeth-1',
            status: 'APPROVED',
            isPriceCapped: true,
            createdAt: '2026-11-16 10:00',
          },
          {
            id: 'prod-gouging-milk-1',
            name: 'Artisan Full Cream Buffalo Milk 1L',
            category: 'Dairy & Milk',
            pricePaise: 12000,
            priceFormatted: '₹120.00',
            compareAtPricePaise: 9000,
            mrpFormatted: '₹90.00',
            outletId: 'outlet-sitabuldi-2',
            status: 'FLAGGED',
            isPriceCapped: false,
            anomalyWarning: 'Exceeds Dairy category price ceiling of ₹80.00 and printed MRP ₹90.00',
            createdAt: '2026-11-16 14:30',
          },
        ]);
        this.totalCountState.set(2);
        this.loadingState.set(false);
      },
    });

    this.loadPriceCaps();
  }

  loadPriceCaps(): void {
    this.api.getPriceCaps().subscribe({
      next: (res) => {
        if (res.data && res.data.length > 0) {
          this.priceCapsState.set(res.data);
        }
      },
      error: () => {
        // Keep initial seed
      },
    });
  }

  addPriceCap(payload: CreatePriceCapPayload): void {
    this.api.createPriceCap(payload).subscribe({
      next: (res) => {
        if (res.data) {
          this.priceCapsState.update((list) => [res.data, ...list]);
        }
      },
      error: () => {
        const localRule: PriceCapRuleViewModel = {
          id: 'cap-' + Date.now(),
          scope: payload.scope,
          targetKey: payload.targetKey,
          maxPricePaise: payload.maxPricePaise,
          maxPriceFormatted: `₹${(payload.maxPricePaise / 100).toFixed(2)}`,
          enforceMrpCap: payload.enforceMrpCap ?? true,
          reason: payload.reason,
          isActive: true,
          createdBy: 'PLATFORM_ADMIN',
          createdAt: new Date().toISOString(),
        };
        this.priceCapsState.update((list) => [localRule, ...list]);
      },
    });
  }

  deactivatePriceCap(id: string): void {
    this.api.deactivatePriceCap(id).subscribe({
      next: () => {
        this.priceCapsState.update((list) => list.filter((r) => r.id !== id));
      },
      error: () => {
        this.priceCapsState.update((list) => list.filter((r) => r.id !== id));
      },
    });
  }

  loadById(id: string): void {
    this.loadingState.set(true);
    this.repository.fetchById(id).subscribe({
      next: (item) => {
        this.selectedItemState.set(item);
        this.loadingState.set(false);
      },
      error: (err) => {
        this.errorState.set(err?.message || 'Failed to load record');
        this.loadingState.set(false);
      },
    });
  }
}
