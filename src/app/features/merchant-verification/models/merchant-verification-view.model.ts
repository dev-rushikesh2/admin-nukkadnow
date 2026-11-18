export type KycDocumentType = 'FSSAI_LICENSE' | 'GSTIN_CERTIFICATE' | 'PAN_CARD' | 'BANK_PASSBOOK' | 'STOREFRONT_PHOTO';
export type KycStatus = 'SUBMITTED' | 'IN_REVIEW' | 'VERIFIED' | 'REJECTED';

export interface KycDocumentItem {
  type: KycDocumentType;
  title: string;
  documentNumber?: string;
  fileUrl: string;
  verified: boolean;
  notes?: string;
}

export interface BankPennyDropResult {
  accountNumberMasked: string;
  ifscCode: string;
  bankName: string;
  beneficiaryNameMatch: string;
  registeredBusinessName: string;
  isMatch: boolean;
  verifiedAt: string;
}

export interface MerchantVerificationViewModel {
  id: string;
  name?: string;
  createdAt?: string;
  merchantId: string;
  businessName: string;
  legalEntityName: string;
  locality: string;
  phone: string;
  mode: string;
  submittedAt: string;
  slaExpiresAt: string;
  status: KycStatus;
  documents: KycDocumentItem[];
  bankPennyDrop: BankPennyDropResult;
  rejectionReason?: string;
}

export interface VerificationFilterCriteria {
  search?: string;
  status?: string;
  locality?: string;
  mode?: string;
  page?: number;
  limit?: number;
}

export type MerchantVerificationFilterCriteria = VerificationFilterCriteria;
