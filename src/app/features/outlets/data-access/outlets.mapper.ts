import { OutletViewModel } from '../models/outlets-view.model';

export class OutletsMapper {
  static toViewModel(dto: any): OutletViewModel {
    const hourlyCapacity = typeof dto.hourlyCapacity === 'number' ? dto.hourlyCapacity : (dto.capacity || 20);
    const currentHourlyOrders = typeof dto.currentHourlyOrders === 'number' ? dto.currentHourlyOrders : (dto.activeOrders || 0);
    const capacityUtilizationPct = hourlyCapacity > 0 ? Math.round((currentHourlyOrders / hourlyCapacity) * 100) : 0;

    return {
      id: dto.id || '',
      storeName: dto.storeName || dto.name || 'Storefront #' + dto.id,
      name: dto.name || dto.storeName || 'Storefront #' + dto.id,
      merchantId: dto.merchantId || '',
      merchantName: dto.merchantName || 'Partner Merchant',
      locality: dto.locality || 'Sitabuldi',
      city: dto.city || 'Nagpur',
      address: dto.address || 'Hyperlocal Counter',
      phone: dto.phone || '+91 98000 00000',
      hourlyCapacity,
      currentHourlyOrders,
      capacityUtilizationPct,
      status: dto.status || 'OPEN',
      isThrottled: Boolean(dto.isThrottled),
      openingTime: dto.openingTime || '07:00 AM',
      closingTime: dto.closingTime || '10:00 PM',
      weeklySchedule: dto.weeklySchedule || [
        { day: 'Monday', open: '07:00 AM', close: '10:00 PM', isOpen: true },
        { day: 'Tuesday', open: '07:00 AM', close: '10:00 PM', isOpen: true },
        { day: 'Wednesday', open: '07:00 AM', close: '10:00 PM', isOpen: true },
        { day: 'Thursday', open: '07:00 AM', close: '10:00 PM', isOpen: true },
        { day: 'Friday', open: '07:00 AM', close: '10:00 PM', isOpen: true },
        { day: 'Saturday', open: '07:00 AM', close: '10:30 PM', isOpen: true },
        { day: 'Sunday', open: '07:00 AM', close: '10:30 PM', isOpen: true },
      ],
      createdAt: dto.createdAt || new Date().toISOString(),
      updatedAt: dto.updatedAt,
      metadata: dto.metadata || {}
    };
  }
}
