import { Injectable, inject } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { AdminOrderViewModel, OrderFilterCriteria } from '../models/orders-view.model';
import { PaginatedResult } from '@nukkadnow/admin-api-client';
import { AuditLoggerService } from '../../../core/audit-context/audit-logger.service';

@Injectable({
  providedIn: 'root',
})
export class OrdersRepository {
  private readonly auditLogger = inject(AuditLoggerService);

  private mockOrders: AdminOrderViewModel[] = [
    {
      id: 'ORD-NGP-9821',
      merchantId: 'MER-NGP-101',
      merchantName: 'Nagpur Sweet Mart',
      outletId: 'OUT-DHP-01',
      locality: 'Dharampeth',
      customerId: 'CUST-8812',
      customerName: 'Aarav Deshmukh',
      customerPhone: '+919822998811',
      pickupToken: 'NK-402',
      pickupSlot: '16:30 - 16:45 Today',
      status: 'READY_FOR_PICKUP',
      subtotalPaise: 42000,
      taxPaise: 2100,
      platformFeePaise: 900,
      totalPaise: 45000,
      paymentMethod: 'UPI (Razorpay)',
      paymentRef: 'pay_Nz818274hds',
      placedAt: '2026-11-11T16:05:00Z',
      items: [
        {
          productId: 'PRD-SW-01',
          name: 'Special Nagpur Orange Barfi (500g)',
          quantity: 1,
          unitPricePaise: 35000,
          totalPaise: 35000,
        },
        {
          productId: 'PRD-SN-04',
          name: 'Spicy Tari Poha Snack Box',
          quantity: 2,
          unitPricePaise: 3500,
          totalPaise: 7000,
          cookingInstructions: 'Extra sev & spicy tari on side',
        },
      ],
      timeline: [
        { status: 'CONFIRMED', title: 'Payment Confirmed & Slot Reserved', timestamp: '2026-11-11T16:05:00Z', actor: 'Customer' },
        { status: 'IN_PREPARATION', title: 'Merchant Accepted Order', timestamp: '2026-11-11T16:07:00Z', actor: 'Nagpur Sweet Mart Staff' },
        { status: 'READY_FOR_PICKUP', title: 'Fresh Preparation Complete (Chime Sounded)', timestamp: '2026-11-11T16:20:00Z', actor: 'Kitchen Lead' },
      ],
    },
    {
      id: 'ORD-NGP-9820',
      merchantId: 'MER-NGP-102',
      merchantName: 'Haldiram Foods & Sweets',
      outletId: 'OUT-SDR-02',
      locality: 'Sadar',
      customerId: 'CUST-5519',
      customerName: 'Neha Joshi',
      customerPhone: '+919822998822',
      pickupToken: 'NK-403',
      pickupSlot: '17:00 - 17:15 Today',
      status: 'IN_PREPARATION',
      subtotalPaise: 120000,
      taxPaise: 6000,
      platformFeePaise: 2000,
      totalPaise: 128000,
      paymentMethod: 'UPI (PhonePe)',
      paymentRef: 'pay_Kz992144opq',
      placedAt: '2026-11-11T16:15:00Z',
      items: [
        {
          productId: 'PRD-HL-10',
          name: 'Kaju Katli Gift Tin (1kg)',
          quantity: 1,
          unitPricePaise: 95000,
          totalPaise: 95000,
        },
        {
          productId: 'PRD-HL-12',
          name: 'All-In-One Mixture (400g)',
          quantity: 2,
          unitPricePaise: 12500,
          totalPaise: 25000,
        },
      ],
      timeline: [
        { status: 'CONFIRMED', title: 'Order Created', timestamp: '2026-11-11T16:15:00Z', actor: 'Customer' },
        { status: 'IN_PREPARATION', title: 'Kitchen Packaging Started', timestamp: '2026-11-11T16:18:00Z', actor: 'Sadar Dispatch' },
      ],
    },
    {
      id: 'ORD-NGP-9819',
      merchantId: 'MER-NGP-104',
      merchantName: 'Apna Kirana & Grains',
      outletId: 'OUT-STB-01',
      locality: 'Sitabuldi',
      customerId: 'CUST-3310',
      customerName: 'Sunil Patil',
      customerPhone: '+919822998833',
      pickupToken: 'NK-404',
      pickupSlot: '15:30 - 15:45 Today',
      status: 'FORCE_CANCELLED',
      subtotalPaise: 80000,
      taxPaise: 4000,
      platformFeePaise: 1000,
      totalPaise: 85000,
      paymentMethod: 'NetBanking',
      paymentRef: 'pay_Mh771233ert',
      placedAt: '2026-11-11T15:00:00Z',
      cancellationReason: 'STORE_CLOSED: Merchant unannounced closure. Refund ₹850 initiated.',
      items: [
        {
          productId: 'PRD-AP-01',
          name: 'Sharbati Wheat Flour (10kg)',
          quantity: 2,
          unitPricePaise: 40000,
          totalPaise: 80000,
        },
      ],
      timeline: [
        { status: 'CONFIRMED', title: 'Order Placed', timestamp: '2026-11-11T15:00:00Z', actor: 'Customer' },
        { status: 'FORCE_CANCELLED', title: 'Emergency Cancellation by Super-Admin', timestamp: '2026-11-11T15:35:00Z', actor: 'Platform Operator (Rushi)' },
      ],
    },
  ];

  fetchItems(filters?: OrderFilterCriteria): Observable<PaginatedResult<AdminOrderViewModel>> {
    let items = [...this.mockOrders];
    if (filters?.search) {
      const q = filters.search.toLowerCase();
      items = items.filter((o) =>
        o.id.toLowerCase().includes(q) ||
        o.merchantName.toLowerCase().includes(q) ||
        o.customerName.toLowerCase().includes(q)
      );
    }
    if (filters?.status) {
      items = items.filter((o) => o.status === filters.status);
    }
    return of({
      items,
      total: items.length,
      page: 1,
      limit: 20,
      hasMore: false,
    }).pipe(delay(80));
  }

  fetchById(id: string): Observable<AdminOrderViewModel> {
    const item = this.mockOrders.find((o) => o.id === id) || this.mockOrders[0];
    return of(item).pipe(delay(50));
  }

  forceCancelOrder(id: string, reasonCode: string, justification: string): Observable<AdminOrderViewModel> {
    const item = this.mockOrders.find((o) => o.id === id);
    if (item) {
      item.status = 'FORCE_CANCELLED';
      item.cancellationReason = `${reasonCode}: ${justification}`;
      item.timeline.push({
        status: 'FORCE_CANCELLED',
        title: `Emergency Cancellation (${reasonCode})`,
        timestamp: new Date().toISOString(),
        actor: 'Admin Operator (Audit Action)',
        notes: justification,
      });

      this.auditLogger.logAction({
        action: 'ORDER_FORCE_CANCELLED',
        targetEntity: 'Order',
        targetId: id,
        reasonCode,
        justification,
        metadata: { refundTriggeredPaise: item.totalPaise },
      });
    }
    return of(item!).pipe(delay(200));
  }
}
