import { Call } from './types';

export const mockCalls: Call[] = [
  {
    id: '1',
    customerName: 'Sarah Johnson',
    timestamp: '2024-03-15T10:30:00',
    duration: '12:45',
    subject: 'Home Mortgage Inquiry',
    summary: 'First-time homebuyer seeking $350k mortgage. Has 20% down payment ready. Stable employment of 5 years at current job.',
    status: 'new',
    loanType: 'mortgage',
    loanAmount: 350000,
    transcript: 'Hi, I\'m Sarah Johnson. I\'m looking to buy my first home and need information about mortgage options. I\'ve saved up 20% for a down payment on a $350,000 home...',
    creditScore: 745,
    income: 85000,
    contact: {
      email: 'sarah.johnson@email.com',
      phone: '(555) 123-4567',
      address: '123 Main St, Anytown, ST 12345'
    },
    documents: [
      { name: 'Pay Stubs (Last 3 months)', status: 'received', required: true, url: 'https://example.com/docs/paystubs.pdf' },
      { name: 'Bank Statements', status: 'pending', required: true },
      { name: 'W-2 Forms', status: 'received', required: true, url: 'https://example.com/docs/w2.pdf' },
      { name: 'Tax Returns', status: 'pending', required: true },
      { name: 'Gift Letter', status: 'pending', required: false }
    ],
    nextSteps: [
      'Submit remaining required documents',
      'Schedule property appraisal',
      'Complete mortgage application',
      'Review and sign initial disclosures'
    ],
    timeline: [
      {
        date: '2024-03-15T10:30:00',
        title: 'Initial Contact',
        description: 'First call received, discussed mortgage options',
        status: 'completed',
        type: 'call'
      },
      {
        date: '2024-03-15T10:45:00',
        title: 'Welcome Email Sent',
        description: 'Automated welcome email with document checklist sent',
        status: 'completed',
        type: 'email'
      },
      {
        date: '2024-03-15T11:00:00',
        title: 'Document Portal Access',
        description: 'Generated and sent secure document portal credentials',
        status: 'completed',
        type: 'system'
      },
      {
        date: '2024-03-15T14:20:00',
        title: 'Documents Uploaded',
        description: 'Pay stubs and W-2 forms received via portal',
        status: 'completed',
        type: 'document'
      },
      {
        date: '2024-03-15T14:25:00',
        title: 'Document Verification',
        description: 'Automated verification of uploaded documents',
        status: 'current',
        type: 'system'
      },
      {
        date: '2024-03-15T15:00:00',
        title: 'Credit Check Initiated',
        description: 'Credit report requested from Equifax',
        status: 'current',
        type: 'provider'
      },
      {
        date: '2024-03-20',
        title: 'Application Review',
        description: 'Scheduled for initial review',
        status: 'upcoming'
      }
    ]
  },
  {
    id: '2',
    customerName: 'James Wilson',
    timestamp: '2024-03-15T14:20:00',
    duration: '15:30',
    subject: 'Refinance Inquiry',
    summary: 'Looking to refinance current mortgage of $400k. Property value estimated at $550k. Seeking better interest rate.',
    status: 'reviewed',
    loanType: 'mortgage',
    loanAmount: 400000,
    transcript: 'Hello, I\'m interested in refinancing my current mortgage. I\'ve been in my home for 5 years and have seen significant appreciation...',
    creditScore: 780,
    income: 110000,
    contact: {
      email: 'james.wilson@email.com',
      phone: '(555) 234-5678',
      address: '456 Oak Ave, Anytown, ST 12345'
    },
    documents: [
      { name: 'Current Mortgage Statement', status: 'received', required: true, url: 'https://example.com/docs/mortgage.pdf' },
      { name: 'Pay Stubs', status: 'received', required: true, url: 'https://example.com/docs/paystubs.pdf' },
      { name: 'Tax Returns', status: 'pending', required: true },
      { name: 'Property Appraisal', status: 'pending', required: true }
    ],
    nextSteps: [
      'Complete property appraisal',
      'Submit remaining documents',
      'Review refinance terms',
      'Schedule closing'
    ],
    timeline: [
      {
        date: '2024-03-15T14:20:00',
        title: 'Refinance Inquiry',
        description: 'Initial refinance consultation call',
        status: 'completed',
        type: 'call'
      },
      {
        date: '2024-03-15T14:35:00',
        title: 'Document Request Sent',
        description: 'Automated email with refinance document checklist',
        status: 'completed',
        type: 'email'
      },
      {
        date: '2024-03-15T15:00:00',
        title: 'Property Valuation',
        description: 'Automated property value assessment initiated',
        status: 'current',
        type: 'provider'
      },
      {
        date: '2024-03-15T16:30:00',
        title: 'Documents Uploaded',
        description: 'Current mortgage statement and pay stubs received',
        status: 'completed',
        type: 'document'
      },
      {
        date: '2024-03-22',
        title: 'Property Appraisal',
        description: 'Schedule on-site property appraisal',
        status: 'upcoming'
      }
    ]
  }
];
