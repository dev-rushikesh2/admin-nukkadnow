import { Component, OnInit, inject, signal, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AdminApiClient, AdminEndpoints, ApiResponse } from '@nukkadnow/admin-api-client';
import { PageHeaderComponent, BadgeComponent } from '@nukkadnow/admin-ui';

export interface CustomerAddress {
  id: string;
  label: 'Home' | 'Work' | 'Other';
  addressLine: string;
  locality: string;
  city: string;
  cityCode: string;
  pincode: string;
  latitude: number;
  longitude: number;
  isDefault: boolean;
}

export interface CustomerProfileDetails {
  id: string;
  fullName: string;
  phoneNumber: string;
  email?: string;
  maskedPhone: string;
  maskedEmail: string;
  cityCode: string;
  cityName: string;
  status: 'ACTIVE' | 'RESTRICTED' | 'SUSPENDED';
  segment: 'NEW' | 'ACTIVE' | 'REPEAT' | 'VIP' | 'INACTIVE';
  totalOrdersCount: number;
  lifetimeSpendPaise: number;
  lifetimeSpendRupees: number;
  registeredAt: string;
  lastActiveAt: string;
  addresses: CustomerAddress[];
  isPiiMasked: boolean;
}

export interface CustomerOrderHistoryItem {
  id: string;
  orderNumber: string;
  amount: number;
  status: string;
  merchantName: string;
  fulfilmentType: string;
  createdAt: string;
  pickupToken?: string;
}

@Component({
  selector: 'admin-customer-details-page',
  standalone: true,
  imports: [CommonModule, FormsModule, PageHeaderComponent, BadgeComponent],
  templateUrl: './customer-details.page.html',
  styleUrls: ['./customer-details.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CustomerDetailsPageComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly apiClient = inject(AdminApiClient);

  customerId = signal<string>('');
  customer = signal<CustomerProfileDetails | null>(null);
  orders = signal<CustomerOrderHistoryItem[]>([]);
  isLoading = signal<boolean>(false);
  isSubmitting = signal<boolean>(false);

  // Sub-tabs in details view
  activeTab = signal<'ORDERS' | 'ADDRESSES' | 'GOVERNANCE'>('ORDERS');

  // DPDP PII Unmasking Modal
  isUnmaskModalOpen = signal<boolean>(false);
  unmaskPurpose = signal<string>('ORDER_FULFILLMENT_TRIAGE');
  unmaskJustification = signal<string>('');
  unmaskedData = signal<{ phone: string; email: string; expiresAt: Date } | null>(null);

  // Account Status Governance Modal
  isStatusModalOpen = signal<boolean>(false);
  targetStatus = signal<'ACTIVE' | 'RESTRICTED' | 'SUSPENDED'>('RESTRICTED');
  statusReasonCode = signal<string>('ABUSIVE_CANCELLATION_PATTERN');
  statusJustification = signal<string>('');

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.customerId.set(id);
      this.loadCustomer(id);
      this.loadCustomerOrders(id);
    }
  }

  loadCustomer(id: string): void {
    this.isLoading.set(true);
    this.apiClient.get<CustomerProfileDetails>(AdminEndpoints.CUSTOMER_BY_ID(id)).subscribe({
      next: (res: ApiResponse<CustomerProfileDetails>) => {
        this.isLoading.set(false);
        if (res.data) {
          this.customer.set(res.data);
        }
      },
      error: () => {
        this.isLoading.set(false);
      },
    });
  }

  loadCustomerOrders(id: string): void {
    this.apiClient.get<any>(AdminEndpoints.CUSTOMER_ORDERS(id)).subscribe({
      next: (res: ApiResponse<any>) => {
        const items = res.data?.items || (Array.isArray(res.data) ? res.data : []);
        this.orders.set(items);
      },
    });
  }

  setTab(tab: 'ORDERS' | 'ADDRESSES' | 'GOVERNANCE'): void {
    this.activeTab.set(tab);
  }

  // --- DPDP PII Unmasking Flow ---
  openUnmaskModal(): void {
    this.isUnmaskModalOpen.set(true);
    this.unmaskPurpose.set('ORDER_FULFILLMENT_TRIAGE');
    this.unmaskJustification.set('');
  }

  closeUnmaskModal(): void {
    this.isUnmaskModalOpen.set(false);
  }

  submitPiiUnmask(): void {
    const id = this.customerId();
    if (!id || !this.unmaskJustification().trim()) return;

    this.isSubmitting.set(true);
    this.apiClient
      .post<any>(AdminEndpoints.CUSTOMER_UNMASK_PII(id), {
        purposeCode: this.unmaskPurpose(),
        justification: this.unmaskJustification(),
      })
      .subscribe({
        next: (res: ApiResponse<any>) => {
          this.isSubmitting.set(false);
          this.closeUnmaskModal();
          if (res.data) {
            this.unmaskedData.set({
              phone: res.data.unmaskedPhoneNumber,
              email: res.data.unmaskedEmail,
              expiresAt: new Date(Date.now() + 300000), // 5 minutes
            });
          }
        },
        error: () => {
          this.isSubmitting.set(false);
        },
      });
  }

  // --- Account Governance Flow ---
  openStatusModal(status: 'ACTIVE' | 'RESTRICTED' | 'SUSPENDED'): void {
    this.targetStatus.set(status);
    this.statusReasonCode.set(status === 'SUSPENDED' ? 'SUSPICIOUS_PAYMENT_ACTIVITY' : 'ABUSIVE_CANCELLATION_PATTERN');
    this.statusJustification.set('');
    this.isStatusModalOpen.set(true);
  }

  closeStatusModal(): void {
    this.isStatusModalOpen.set(false);
  }

  submitStatusChange(): void {
    const id = this.customerId();
    if (!id || !this.statusJustification().trim()) return;

    this.isSubmitting.set(true);
    this.apiClient
      .patch<any>(AdminEndpoints.CUSTOMER_UPDATE_STATUS(id), {
        status: this.targetStatus(),
        reasonCode: this.statusReasonCode(),
        justification: this.statusJustification(),
      })
      .subscribe({
        next: () => {
          this.isSubmitting.set(false);
          this.closeStatusModal();
          this.loadCustomer(id);
        },
        error: () => {
          this.isSubmitting.set(false);
        },
      });
  }

  goBack(): void {
    this.router.navigate(['/customers']);
  }
}
