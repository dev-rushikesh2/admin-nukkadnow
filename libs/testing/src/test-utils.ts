export function createMockMerchant(overrides = {}) {
  return {
    id: 'merchant-test-01',
    businessName: 'Nagpur Sweet Mart',
    legalName: 'Nagpur Sweet Mart Pvt Ltd',
    phone: '+919876543210',
    locality: 'Dharampeth',
    kycStatus: 'VERIFIED',
    mode: 'RETAIL',
    createdAt: '2026-11-11T10:00:00Z',
    ...overrides,
  };
}

export function createMockOrder(overrides = {}) {
  return {
    id: 'ord-test-8921',
    merchantId: 'merchant-test-01',
    amountPaise: 45000,
    status: 'CONFIRMED',
    customerPhone: '+919822000000',
    placedAt: '2026-11-11T12:30:00Z',
    ...overrides,
  };
}
