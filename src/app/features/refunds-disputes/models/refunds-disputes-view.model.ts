export type RefundStatus =
  | 'PENDING_FIRST_APPROVAL'
  | 'PENDING_SECOND_APPROVAL'
  | 'APPROVED_DISPATCHED'
  | 'REJECTED';

export interface RefundDisputeViewModel {
  id: string;
  name?: string;
  title?: string;
  orderId: string;
  merchantId: string;
  merchantName: string;
  customerId: string;
  customerName: string;
  amountPaise: number;
  reasonCode: string;
  customerClaim: string;
  merchantRebuttal?: string;
  evidencePhotoUrls: string[];
  status: RefundStatus;
  firstApprover?: { operatorId: string; operatorName: string; approvedAt: string };
  secondApprover?: { operatorId: string; operatorName: string; approvedAt: string };
  createdAt: string;
  requiresDualSign: boolean; // true if amountPaise > 500000 (> ₹5,000)
}

export interface RefundFilterCriteria {
  search?: string;
  status?: string;
}

export type RefundDisputeFilterCriteria = RefundFilterCriteria;
