
export enum FilingFrequency {
  MONTHLY = 'Monthly',
  QUARTERLY = 'Quarterly',
  ANNUAL = 'Annual'
}

export enum ReturnType {
  GSTR_1 = 'GSTR-1',
  GSTR_3B = 'GSTR-3B',
  GSTR_9 = 'GSTR-9',
  ITR_1 = 'ITR-1',
  ITR_2 = 'ITR-2',
  ITR_3 = 'ITR-3',
  ITR_4 = 'ITR-4'
}

export enum RefundStatus {
  NOT_FILED = 'Not Filed',
  UNDER_PROCESS = 'Under Process',
  SENT_TO_BANK = 'Sent to Bank',
  ADJUSTED = 'Adjusted',
  REFUNDED = 'RefundED'
}

export enum NoticeCategory {
  GST_SCN = 'GST Show Cause Notice',
  GST_ASMT = 'GST Assessment Notice',
  IT_143 = 'ITR Scrutiny (143/2)',
  IT_144 = 'ITR Best Judgement (144)',
  IT_148 = 'Income Escaping Assessment (148)',
  GENERIC = 'General Query'
}

export type NoticeStatus = 'Open' | 'Replied' | 'Resolved' | 'Pending Hearing' | 'Overdue';

export interface Notice {
  id: string;
  clientId: string;
  category: NoticeCategory;
  referenceNumber: string;
  section: string;
  assessmentYear?: string; // Specific for IT notices
  issueDate: string;
  replyDeadline: string;
  demandAmount: number;
  status: NoticeStatus;
  aiSummary?: string;
}

export interface Client {
  id: string;
  name: string;
  pan: string;
  gstin?: string;
  tan?: string;
  msmeRegNo?: string;
  constitution: 'Proprietorship' | 'Partnership' | 'LLP' | 'Private Limited' | 'Public Limited' | 'Trust' | 'HUF' | 'Individual';
  natureOfBusiness?: string;
  contactEmail: string;
  whatsapp: string;
  mobile?: string;
  address: string;
  returns: ComplianceReturn[];
  dscExpiry?: string;
  dscHolderName?: string;
  refundStatus: RefundStatus;
}

export interface ComplianceReturn {
  id: string;
  type: ReturnType;
  period: string;
  dueDate: string;
  status: 'Pending' | 'Filed' | 'Overdue';
  frequency: FilingFrequency;
}

export interface FirmProfile {
  name: string;
  legalName: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  gstin: string;
  pan: string;
  logoUrl?: string;
  email: string;
  phone: string;
  website?: string;
  authorizedSignatory: string;
  bankDetails: {
    bankName: string;
    accountNumber: string;
    ifscCode: string;
    branchName: string;
  };
}

export interface Invoice {
  id: string;
  clientId: string;
  date: string;
  items: { description: string; amount: number }[];
  taxAmount: number;
  totalAmount: number;
  status: 'Paid' | 'Unpaid';
}
