
import { Client, FilingFrequency, ReturnType, RefundStatus, FirmProfile, Notice, NoticeCategory, Invoice } from './types';

export const INITIAL_FIRM_PROFILE: FirmProfile = {
  name: "K S Shah Tax Practitioners",
  legalName: "K S Shah Tax Practitioners",
  address: "Pandumal Chouraha",
  city: "Neemuch",
  state: "Madhya Pradesh",
  pincode: "458441",
  gstin: "23AAACS1234A1Z5",
  pan: "AAACS1234A",
  email: "contact@ksshah.tax",
  phone: "+91 98270 00000",
  website: "https://ksshah.tax",
  authorizedSignatory: "K S Shah",
  bankDetails: {
    bankName: "State Bank of India",
    accountNumber: "300012345678",
    ifscCode: "SBIN0000438",
    branchName: "Neemuch Main Branch"
  },
  logoUrl: "https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=100&h=100&fit=crop&q=80"
};

export const INITIAL_CLIENTS: Client[] = [
  {
    id: '1',
    name: "Acme Tech Solutions",
    pan: "ABCDE1234F",
    gstin: "27ABCDE1234F1Z1",
    constitution: 'Private Limited',
    contactEmail: "admin@acmetech.com",
    whatsapp: "919000000001",
    address: "B-2, Industrial Area, Noida, UP",
    refundStatus: RefundStatus.SENT_TO_BANK,
    dscExpiry: "2025-05-20",
    dscHolderName: "Rajesh Kumar",
    returns: [
      { id: 'r1', type: ReturnType.GSTR_1, period: 'Mar 2024', dueDate: '2024-04-11', status: 'Filed', frequency: FilingFrequency.MONTHLY },
      { id: 'r2', type: ReturnType.GSTR_3B, period: 'Mar 2024', dueDate: '2024-04-20', status: 'Pending', frequency: FilingFrequency.MONTHLY },
      { id: 'r3', type: ReturnType.ITR_4, period: 'FY 2023-24', dueDate: '2024-07-31', status: 'Pending', frequency: FilingFrequency.ANNUAL }
    ]
  },
  {
    id: '2',
    name: "Verma Groceries",
    pan: "VWXYZ9876G",
    gstin: "07VWXYZ9876G1Z2",
    constitution: 'Proprietorship',
    contactEmail: "sunil@vermagroc.com",
    whatsapp: "919000000002",
    address: "Shop 12, Main Market, Delhi",
    refundStatus: RefundStatus.UNDER_PROCESS,
    dscExpiry: "2024-04-15",
    dscHolderName: "Sunil Verma",
    returns: [
      { id: 'r4', type: ReturnType.GSTR_1, period: 'Q1 2024', dueDate: '2024-04-13', status: 'Overdue', frequency: FilingFrequency.QUARTERLY }
    ]
  }
];

export const INITIAL_NOTICES: Notice[] = [
  {
    id: 'n1',
    clientId: '1',
    category: NoticeCategory.GST_ASMT,
    referenceNumber: 'GST-ASMT-10-2024-882',
    section: 'Section 61',
    issueDate: '2024-03-15',
    replyDeadline: '2024-04-15',
    demandAmount: 125000,
    status: 'Open',
    aiSummary: 'Discrepancy in Input Tax Credit (ITC) between GSTR-2A and GSTR-3B for FY 2022-23. The department alleges an excess claim of ₹1.25 Lakhs.'
  },
  {
    id: 'n2',
    clientId: '2',
    category: NoticeCategory.IT_143,
    referenceNumber: 'IT/SCRUTINY/AY24-25/001',
    section: 'Section 143(2)',
    assessmentYear: '2024-25',
    issueDate: '2024-04-01',
    replyDeadline: '2024-04-30',
    demandAmount: 0,
    status: 'Pending Hearing',
    aiSummary: 'Limited scrutiny notice selected for high-value transactions reported in SFT. Verification required for cash deposits exceeding ₹10 Lakhs.'
  }
];

export const INITIAL_INVOICES: Invoice[] = [
  {
    id: 'INV/24-25/001',
    clientId: '1',
    date: '2024-04-05',
    items: [
      { description: 'Professional Fees for GST Audit FY 2022-23', amount: 15000 },
      { description: 'GSTR-9 & 9C Annual Filing Charges', amount: 5000 }
    ],
    taxAmount: 3600,
    totalAmount: 23600,
    status: 'Unpaid'
  },
  {
    id: 'INV/24-25/002',
    clientId: '2',
    date: '2024-04-10',
    items: [
      { description: 'Income Tax Return (ITR-4) Consultation', amount: 3500 }
    ],
    taxAmount: 630,
    totalAmount: 4130,
    status: 'Paid'
  }
];
