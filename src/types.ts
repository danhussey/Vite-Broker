import React from 'react';

export interface Call {
  id: string;
  customerName: string;
  timestamp: string;
  duration: string;
  subject: string;
  summary: string;
  status: 'new' | 'reviewed' | 'flagged';
  loanType: 'mortgage';
  loanAmount: number;
  transcript: string;
  creditScore?: number;
  income?: number;
  contact: {
    email: string;
    phone: string;
    address?: string;
  };
  documents: {
    name: string;
    status: 'pending' | 'received' | 'rejected';
    required: boolean;
    url?: string;
  }[];
  nextSteps: string[];
  timeline: {
    date: string;
    title: string;
    description: string;
    status: 'completed' | 'current' | 'upcoming';
    type?: 'call' | 'email' | 'document' | 'system' | 'provider';
  }[];
}

export interface CreditCheck {
  status: 'pending' | 'in_progress' | 'completed' | 'failed';
  provider: string;
  requestDate: string;
  completedDate?: string;
  score?: number;
  report?: {
    summary: string;
    defaultHistory: boolean;
    bankruptcyHistory: boolean;
    creditUtilization: number;
    paymentHistory: {
      onTime: number;
      late: number;
      missed: number;
    };
    inquiries: number;
    accountAges: {
      oldest: number;
      average: number;
    };
  };
  error?: string;
}

export interface Document {
  id: string;
  customerId: string;
  customerName: string;
  loanId: string;
  loanType: 'mortgage';
  documentType: string;
  status: 'pending_upload' | 'uploaded' | 'processing' | 'verified' | 'rejected' | 'expired';
  aiVerificationStatus?: 'pending' | 'success' | 'failed' | 'needs_review';
  uploadDate?: string;
  expiryDate?: string;
  required: boolean;
  notes: string[];
  url?: string;
  verificationDetails?: {
    verifiedBy: 'ai' | 'manual' | null;
    verifiedAt?: string;
    issues?: string[];
    score?: number;
  };
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  address?: string;
  status: 'active' | 'inactive' | 'pending';
  joinDate: string;
  lastContact: string;
  totalLoans: number;
  activeLoans: number;
  creditScore?: number;
  creditCheck?: CreditCheck;
  profileImage?: string;
  tags: string[];
}

export type SortDirection = 'asc' | 'desc';
export type CustomerSortField = 'name' | 'joinDate' | 'lastContact' | 'status' | 'activeLoans';