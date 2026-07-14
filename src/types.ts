/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type DocumentType = 'invoice' | 'credit_note' | 'purchase_order' | 'quote' | 'timesheet' | 'expense_report';

export interface ColumnSchema {
  id: string;
  name: string;
  key: string;
  enabled: boolean;
  width: string; // e.g. 'auto', '10%', '150px'
  align: 'left' | 'center' | 'right';
  dataType: 'string' | 'number' | 'currency' | 'date' | 'boolean';
  format?: string; // e.g., '$0,0.00', 'YYYY-MM-DD', 'uppercase'
  grouped: boolean;
  sorted: 'asc' | 'desc' | 'none';
  aggregated: 'none' | 'sum' | 'avg' | 'count';
  customValue?: string; // custom computed template or override
  placeholder?: string;
}

export interface SectionSchema {
  id: string;
  name: string;
  type: 'header' | 'items' | 'totals' | 'footer' | 'custom';
  enabled: boolean;
  isCollapsed: boolean;
  columns: ColumnSchema[];
}

export interface ThemeSettings {
  primaryColor: string;
  secondaryColor: string;
  textColor: string;
  fontFamily: 'Inter' | 'Space Grotesk' | 'JetBrains Mono' | 'Georgia' | 'Playfair Display';
  headerStyle: 'modern' | 'minimal' | 'stripe' | 'grid';
  showBorders: boolean;
  borderRadius: number; // in pixels
}

export interface PageSettings {
  paperSize: 'A4' | 'Letter';
  orientation: 'portrait' | 'landscape';
  margin: number; // in inches: 0.25, 0.5, 0.75, 1.0
  currency: string; // e.g. 'USD', 'EUR', 'GBP', 'INR'
  showLogo: boolean;
  logoUrl?: string;
  taxLabel: string; // e.g. 'VAT', 'GST', 'Tax'
}

export interface DocumentSchema {
  id: string;
  type: DocumentType;
  name: string;
  theme: ThemeSettings;
  page: PageSettings;
  sections: SectionSchema[];
}

export interface PreviewState {
  zoom: number; // 50 to 150
  zoomMode: 'fit' | 'actual' | 'custom';
  viewMode: 'desktop' | 'tablet' | 'mobile';
  activeTab: 'config' | 'preview'; // For mobile view
}

export interface DesignerState {
  document: DocumentSchema;
  preview: PreviewState;
  searchTerm: string;
  selectedSectionId: string | null;
  selectedColumnId: string | null;
}

// Mock Data structure for rendering previews dynamically
export interface MockDocumentData {
  company: {
    name: string;
    logo: string;
    address: string;
    email: string;
    phone: string;
    website: string;
    taxId: string;
  };
  client: {
    name: string;
    address: string;
    email: string;
    phone: string;
    taxId: string;
  };
  metadata: {
    number: string;
    date: string;
    dueDate: string;
    reference: string;
    project?: string;
    pOnumber?: string;
    paymentTerms: string;
    employeeName?: string;
    employeeRole?: string;
    period?: string;
  };
  items: Array<Record<string, any>>;
  totals: {
    subtotal: number;
    taxRate: number;
    taxAmount: number;
    discountRate: number;
    discountAmount: number;
    adjustment: number;
    total: number;
    amountPaid: number;
    balanceDue: number;
  };
  footer: {
    notes: string;
    terms: string;
    bankName: string;
    bankAccount: string;
    bankRouting: string;
    thankYouMessage: string;
  };
}
