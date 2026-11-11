import { OrdersStore } from './state/orders.store';
import { OrdersRepository } from './data-access/orders.repository';

describe('Orders Feature', () => {
  it('should be defined', () => {
    expect(OrdersStore).toBeDefined();
    expect(OrdersRepository).toBeDefined();
  });
});
