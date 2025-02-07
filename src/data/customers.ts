import { Customer } from '../types';

export const mockCustomers: Customer[] = [
  {
    id: '1',
    name: 'Sarah Johnson',
    email: 'sarah.johnson@email.com',
    phone: '(555) 123-4567',
    address: '42 Wallaby Way, Sydney NSW 2000',
    status: 'active',
    joinDate: '2023-09-15',
    lastContact: '2024-03-15',
    totalLoans: 2,
    activeLoans: 1,
    creditScore: 745,
    profileImage: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330',
    tags: ['mortgage', 'reliable-payer'],
    creditCheck: {
      status: 'completed',
      provider: 'Equifax',
      requestDate: '2024-03-15T10:30:00',
      completedDate: '2024-03-15T10:32:00',
      score: 745,
      report: {
        summary: 'Excellent credit history with consistent payment record',
        defaultHistory: false,
        bankruptcyHistory: false,
        creditUtilization: 15,
        paymentHistory: {
          onTime: 98,
          late: 2,
          missed: 0
        },
        inquiries: 2,
        accountAges: {
          oldest: 8,
          average: 4.5
        }
      }
    }
  },
  {
    id: '2',
    name: 'Michael Chen',
    email: 'michael.chen@email.com',
    phone: '(555) 987-6543',
    address: '15 Market Street, Melbourne VIC 3000',
    status: 'active',
    joinDate: '2023-11-20',
    lastContact: '2024-03-15',
    totalLoans: 1,
    activeLoans: 1,
    creditScore: null,
    profileImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d',
    tags: ['new-customer'],
    creditCheck: {
      status: 'in_progress',
      provider: 'Experian',
      requestDate: '2024-03-15T14:30:00'
    }
  },
  {
    id: '3',
    name: 'Emily Rodriguez',
    email: 'emily.r@email.com',
    phone: '(555) 456-7890',
    address: '78 Adelaide Street, Brisbane QLD 4000',
    status: 'pending',
    joinDate: '2024-03-14',
    lastContact: '2024-03-14',
    totalLoans: 0,
    activeLoans: 0,
    creditScore: null,
    profileImage: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80',
    tags: ['pending-approval']
  },
  {
    id: '4',
    name: 'David Thompson',
    email: 'david.t@email.com',
    phone: '(555) 789-0123',
    address: '23 Hay Street, Perth WA 6000',
    status: 'active',
    joinDate: '2024-02-01',
    lastContact: '2024-03-15',
    totalLoans: 0,
    activeLoans: 0,
    creditScore: null,
    profileImage: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e',
    tags: ['first-home-buyer'],
    creditCheck: {
      status: 'failed',
      provider: 'Equifax',
      requestDate: '2024-03-15T09:15:00',
      error: 'Unable to verify identity. Additional documentation required.'
    }
  },
  {
    id: '5',
    name: 'Jessica Lee',
    email: 'jessica.lee@email.com',
    phone: '(555) 234-5678',
    address: '91 Rundle Mall, Adelaide SA 5000',
    status: 'active',
    joinDate: '2024-01-15',
    lastContact: '2024-02-15',
    totalLoans: 1,
    activeLoans: 1,
    creditScore: 680,
    profileImage: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f',
    tags: ['mortgage'],
    creditCheck: {
      status: 'completed',
      provider: 'Experian',
      requestDate: '2024-02-15T11:20:00',
      completedDate: '2024-02-15T11:22:00',
      score: 680,
      report: {
        summary: 'Good credit history with recent improvement',
        defaultHistory: false,
        bankruptcyHistory: false,
        creditUtilization: 28,
        paymentHistory: {
          onTime: 92,
          late: 6,
          missed: 2
        },
        inquiries: 4,
        accountAges: {
          oldest: 5,
          average: 3.2
        }
      }
    }
  }
];
