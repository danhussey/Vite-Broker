export interface Provider {
  id: string;
  name: string;
  logo: string;
  description: string;
  featured: boolean;
  rating: number;
  rates: {
    starting: number;
    comparison: number;
  };
  approvalTime: string;
  features: string[];
  requirements: {
    minIncome: number;
    minDeposit: number;
    creditScore: number;
  };
  loanTypes: {
    type: string;
    description: string;
    maxLoanAmount: number;
    maxLoanTerm: number;
  }[];
  contact: {
    phone: string;
    email: string;
    website: string;
  };
}

export const mockProviders: Provider[] = [
  {
    id: '1',
    name: 'Commonwealth Bank',
    logo: 'https://images.unsplash.com/photo-1535320903710-d993d3d77d29?w=48&h=48&fit=crop',
    description: 'Australia\'s largest bank offering competitive mortgage rates and comprehensive home loan solutions.',
    featured: true,
    rating: 4.5,
    rates: {
      starting: 5.89,
      comparison: 6.31
    },
    approvalTime: '24-48 hours',
    features: [
      'Online application tracking',
      'Flexible repayment options',
      'Free property reports',
      'Branch support Australia-wide'
    ],
    requirements: {
      minIncome: 50000,
      minDeposit: 5,
      creditScore: 650
    },
    loanTypes: [
      {
        type: 'Fixed Rate',
        description: '1-5 year fixed terms available',
        maxLoanAmount: 1000000,
        maxLoanTerm: 30
      },
      {
        type: 'Variable Rate',
        description: 'Flexible features and competitive rates',
        maxLoanAmount: 1000000,
        maxLoanTerm: 30
      }
    ],
    contact: {
      phone: '13 2224',
      email: 'homeloanenquiries@cba.com.au',
      website: 'https://www.commbank.com.au'
    }
  },
  {
    id: '2',
    name: 'Westpac',
    logo: 'https://images.unsplash.com/photo-1535320903710-d993d3d77d29?w=48&h=48&fit=crop',
    description: 'One of Australia\'s oldest banks with innovative digital mortgage solutions.',
    featured: true,
    rating: 4.3,
    rates: {
      starting: 5.94,
      comparison: 6.35
    },
    approvalTime: '2-3 business days',
    features: [
      'First home buyer specialists',
      'Offset account available',
      'Mobile lending service',
      'Property research tools'
    ],
    requirements: {
      minIncome: 45000,
      minDeposit: 10,
      creditScore: 640
    },
    loanTypes: [
      {
        type: 'Fixed Rate',
        description: 'Lock in your rate for peace of mind',
        maxLoanAmount: 850000,
        maxLoanTerm: 30
      },
      {
        type: 'Variable Rate',
        description: 'Flexibility to make extra repayments',
        maxLoanAmount: 900000,
        maxLoanTerm: 30
      }
    ],
    contact: {
      phone: '13 2558',
      email: 'mortgages@westpac.com.au',
      website: 'https://www.westpac.com.au'
    }
  },
  {
    id: '3',
    name: 'Athena',
    logo: 'https://images.unsplash.com/photo-1535320903710-d993d3d77d29?w=48&h=48&fit=crop',
    description: 'Digital-first lender offering competitive rates and fast online approval.',
    featured: false,
    rating: 4.7,
    rates: {
      starting: 5.45,
      comparison: 5.85
    },
    approvalTime: 'Same day conditional',
    features: [
      'No application fees',
      'No ongoing fees',
      'Free extra repayments',
      'Online-only experience'
    ],
    requirements: {
      minIncome: 50000,
      minDeposit: 20,
      creditScore: 680
    },
    loanTypes: [
      {
        type: 'Variable Rate',
        description: 'Low-rate variable loans with no fees',
        maxLoanAmount: 1000000,
        maxLoanTerm: 30
      }
    ],
    contact: {
      phone: '13 3020',
      email: 'help@athena.com.au',
      website: 'https://www.athena.com.au'
    }
  }
];
