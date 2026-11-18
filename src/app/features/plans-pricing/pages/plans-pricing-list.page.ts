import { Component, inject, OnInit, signal, computed, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { PlansPricingStore } from '../state/plans-pricing.store';
import { PageHeaderComponent } from '@nukkadnow/admin-ui';
import { PricingPlanViewModel } from '../models/plans-pricing-view.model';
import { PlansPricingStatusChipComponent } from '../components/plans-pricing-status-chip.component';
import { AdminSessionService } from '../../../core/auth/session.service';

@Component({
  selector: 'admin-plans-pricing-list-page',
  standalone: true,
  imports: [CommonModule, FormsModule, PageHeaderComponent, PlansPricingStatusChipComponent],
  templateUrl: './plans-pricing-list.page.html',
  styleUrls: ['./plans-pricing-list.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PlansPricingListPageComponent implements OnInit {
  readonly store = inject(PlansPricingStore);
  private readonly router = inject(Router);
  readonly sessionService = inject(AdminSessionService);

  readonly isAddModalOpen = signal<boolean>(false);
  readonly isSubmitting = signal<boolean>(false);

  // New Plan Model
  newPlan = {
    title: '',
    monthlyPriceRupees: 499,
    maxOutlets: 2,
    maxCatalogSkus: 500,
    commissionDiscountBps: 50,
    prioritySupport: false,
    isPopular: false,
    entitlements: [
      'Multi-outlet inventory synchronization',
      'Priority delivery dispatch routing',
      'Dedicated local account manager'
    ]
  };

  readonly plans = computed(() => this.store.items());

  ngOnInit(): void {
    this.store.loadItems();
  }

  refresh(): void {
    this.store.loadItems();
  }

  openAddModal(): void {
    this.newPlan = {
      title: '',
      monthlyPriceRupees: 499,
      maxOutlets: 2,
      maxCatalogSkus: 500,
      commissionDiscountBps: 50,
      prioritySupport: false,
      isPopular: false,
      entitlements: [
        'Multi-outlet inventory synchronization',
        'Priority delivery dispatch routing',
        'Dedicated local account manager'
      ]
    };
    this.isAddModalOpen.set(true);
  }

  closeAddModal(): void {
    this.isAddModalOpen.set(false);
  }

  submitNewPlan(): void {
    if (!this.newPlan.title) return;

    this.isSubmitting.set(true);
    const monthlyPricePaise = this.newPlan.monthlyPriceRupees * 100;
    const annualPricePaise = monthlyPricePaise * 10; // 2 months free

    this.store.createPlan({
      title: this.newPlan.title,
      name: this.newPlan.title,
      monthlyPricePaise,
      monthlyPriceFormatted: monthlyPricePaise === 0 ? '₹0' : `₹${this.newPlan.monthlyPriceRupees}`,
      annualPricePaise,
      annualPriceFormatted: annualPricePaise === 0 ? '₹0' : `₹${this.newPlan.monthlyPriceRupees * 10}`,
      maxOutlets: this.newPlan.maxOutlets,
      maxCatalogSkus: this.newPlan.maxCatalogSkus,
      commissionDiscountBps: this.newPlan.commissionDiscountBps,
      prioritySupport: this.newPlan.prioritySupport,
      isPopular: this.newPlan.isPopular,
      entitlements: this.newPlan.entitlements,
      status: 'ACTIVE'
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

  onPlanClick(plan: PricingPlanViewModel): void {
    this.router.navigate(['/plans-pricing', plan.id]);
  }
}
