interface DocumentRequirement {
  type: string;
  required: boolean;
  validityPeriod?: number; // in days
  aiVerificationEnabled: boolean;
  description: string;
  acceptedFormats: string[];
}

interface LoanDocumentRequirements {
  [key: string]: DocumentRequirement[];
}

export const documentRequirements: LoanDocumentRequirements = {
  mortgage: [
    {
      type: 'payslips',
      required: true,
      validityPeriod: 30,
      aiVerificationEnabled: true,
      description: 'Last 3 months of payslips showing YTD income',
      acceptedFormats: ['pdf', 'jpg', 'png']
    },
    {
      type: 'group_certificate',
      required: true,
      validityPeriod: 365,
      aiVerificationEnabled: true,
      description: 'Most recent PAYG payment summary or group certificate',
      acceptedFormats: ['pdf']
    },
    {
      type: 'tax_returns',
      required: true,
      validityPeriod: 365,
      aiVerificationEnabled: true,
      description: 'Last 2 years of personal tax returns and ATO Notice of Assessment',
      acceptedFormats: ['pdf']
    },
    {
      type: 'bank_statements',
      required: true,
      validityPeriod: 30,
      aiVerificationEnabled: true,
      description: 'Last 3 months of bank statements showing salary credits',
      acceptedFormats: ['pdf']
    },
    {
      type: 'savings_history',
      required: true,
      validityPeriod: 90,
      aiVerificationEnabled: true,
      description: '6 months savings history showing genuine savings',
      acceptedFormats: ['pdf']
    },
    {
      type: 'identification',
      required: true,
      validityPeriod: null,
      aiVerificationEnabled: true,
      description: 'Valid ID (Passport, Driver\'s License, Medicare Card)',
      acceptedFormats: ['pdf', 'jpg', 'png']
    },
    {
      type: 'contract_of_sale',
      required: true,
      validityPeriod: 90,
      aiVerificationEnabled: true,
      description: 'Signed Contract of Sale for the property',
      acceptedFormats: ['pdf']
    },
    {
      type: 'first_home_buyer',
      required: false,
      validityPeriod: null,
      aiVerificationEnabled: true,
      description: 'First Home Owner Grant application (if applicable)',
      acceptedFormats: ['pdf']
    },
    {
      type: 'property_insurance',
      required: true,
      validityPeriod: 30,
      aiVerificationEnabled: true,
      description: 'Certificate of Currency for Building Insurance',
      acceptedFormats: ['pdf']
    },
    {
      type: 'rental_income',
      required: false,
      validityPeriod: 30,
      aiVerificationEnabled: true,
      description: 'Rental statements or lease agreements for investment properties',
      acceptedFormats: ['pdf']
    },
    {
      type: 'centrelink_benefits',
      required: false,
      validityPeriod: 30,
      aiVerificationEnabled: true,
      description: 'Centrelink Income Statement (if applicable)',
      acceptedFormats: ['pdf']
    },
    {
      type: 'liabilities_statements',
      required: true,
      validityPeriod: 30,
      aiVerificationEnabled: true,
      description: 'Last 3 months statements for all existing loans and credit cards',
      acceptedFormats: ['pdf']
    },
    {
      type: 'self_employed',
      required: false,
      validityPeriod: 365,
      aiVerificationEnabled: true,
      description: 'Business tax returns, financial statements, and ABN registration (if self-employed)',
      acceptedFormats: ['pdf']
    },
    {
      type: 'trust_deed',
      required: false,
      validityPeriod: null,
      aiVerificationEnabled: true,
      description: 'Trust Deed (if purchasing under a Trust structure)',
      acceptedFormats: ['pdf']
    },
    {
      type: 'gift_letter',
      required: false,
      validityPeriod: 30,
      aiVerificationEnabled: true,
      description: 'Statutory Declaration for gifted funds from family',
      acceptedFormats: ['pdf']
    }
  ]
};
