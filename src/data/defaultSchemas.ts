/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { DocumentSchema, MockDocumentData, DocumentType } from '../types';

export const DEFAULT_THEME_SETTINGS = {
  primaryColor: '#0f172a', // deep slate slate-900
  secondaryColor: '#3b82f6', // blue-500
  textColor: '#1e293b', // slate-800
  fontFamily: 'Inter' as const,
  headerStyle: 'stripe' as const,
  showBorders: true,
  borderRadius: 6,
};

export const DEFAULT_PAGE_SETTINGS = {
  paperSize: 'Letter' as const,
  orientation: 'portrait' as const,
  margin: 0.5,
  currency: 'USD',
  showLogo: true,
  logoUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=120&auto=format&fit=crop&q=80', // elegant abstract geometric logo
  taxLabel: 'VAT (15%)',
};

// Generates unique IDs
const genId = (prefix: string) => `${prefix}_${Math.random().toString(36).substr(2, 9)}`;

export const DEFAULT_SCHEMAS: Record<DocumentType, DocumentSchema> = {
  invoice: {
    id: 'doc_invoice',
    type: 'invoice',
    name: 'Standard Invoice Template',
    theme: { ...DEFAULT_THEME_SETTINGS, primaryColor: '#0f172a', secondaryColor: '#10b981' }, // emerald green accent
    page: { ...DEFAULT_PAGE_SETTINGS, currency: 'USD', taxLabel: 'Sales Tax (10%)' },
    sections: [
      {
        id: 'sec_inv_header',
        name: 'Header & Contact Details',
        type: 'header',
        enabled: true,
        isCollapsed: false,
        columns: [
          { id: 'col_inv_h_logo', name: 'Company Logo', key: 'logo', enabled: true, width: '20%', align: 'left', dataType: 'string', grouped: false, sorted: 'none', aggregated: 'none' },
          { id: 'col_inv_h_comp', name: 'Sender Details', key: 'company_details', enabled: true, width: '40%', align: 'left', dataType: 'string', grouped: false, sorted: 'none', aggregated: 'none' },
          { id: 'col_inv_h_client', name: 'Client Info (Bill To)', key: 'client_details', enabled: true, width: '40%', align: 'right', dataType: 'string', grouped: false, sorted: 'none', aggregated: 'none' },
          { id: 'col_inv_h_meta', name: 'Invoice Metadata', key: 'meta_details', enabled: true, width: '100%', align: 'left', dataType: 'string', grouped: false, sorted: 'none', aggregated: 'none' },
        ],
      },
      {
        id: 'sec_inv_items',
        name: 'Line Items Table',
        type: 'items',
        enabled: true,
        isCollapsed: false,
        columns: [
          { id: 'col_inv_i_desc', name: 'Description', key: 'description', enabled: true, width: '50%', align: 'left', dataType: 'string', grouped: false, sorted: 'none', aggregated: 'none', placeholder: 'Consulting services rendered' },
          { id: 'col_inv_i_qty', name: 'Qty', key: 'quantity', enabled: true, width: '10%', align: 'center', dataType: 'number', grouped: false, sorted: 'none', aggregated: 'sum', placeholder: '1' },
          { id: 'col_inv_i_rate', name: 'Unit Price', key: 'rate', enabled: true, width: '20%', align: 'right', dataType: 'currency', grouped: false, sorted: 'none', aggregated: 'avg', placeholder: '150.00' },
          { id: 'col_inv_i_total', name: 'Amount', key: 'total', enabled: true, width: '20%', align: 'right', dataType: 'currency', grouped: false, sorted: 'none', aggregated: 'sum', placeholder: '150.00' },
        ],
      },
      {
        id: 'sec_inv_totals',
        name: 'Totals & Tax Summary',
        type: 'totals',
        enabled: true,
        isCollapsed: false,
        columns: [
          { id: 'col_inv_t_sub', name: 'Subtotal', key: 'subtotal', enabled: true, width: '50%', align: 'right', dataType: 'currency', grouped: false, sorted: 'none', aggregated: 'none' },
          { id: 'col_inv_t_tax', name: 'Tax Rate & Amount', key: 'tax_summary', enabled: true, width: '50%', align: 'right', dataType: 'currency', grouped: false, sorted: 'none', aggregated: 'none' },
          { id: 'col_inv_t_due', name: 'Total Due', key: 'total_due', enabled: true, width: '50%', align: 'right', dataType: 'currency', grouped: false, sorted: 'none', aggregated: 'none' },
          { id: 'col_inv_t_paid', name: 'Amount Paid', key: 'amount_paid', enabled: true, width: '50%', align: 'right', dataType: 'currency', grouped: false, sorted: 'none', aggregated: 'none' },
        ],
      },
      {
        id: 'sec_inv_footer',
        name: 'Footer & Bank Details',
        type: 'footer',
        enabled: true,
        isCollapsed: false,
        columns: [
          { id: 'col_inv_f_terms', name: 'Terms & Instructions', key: 'payment_instructions', enabled: true, width: '100%', align: 'left', dataType: 'string', grouped: false, sorted: 'none', aggregated: 'none' },
          { id: 'col_inv_f_thanks', name: 'Thank You Message', key: 'thank_you', enabled: true, width: '100%', align: 'center', dataType: 'string', grouped: false, sorted: 'none', aggregated: 'none' },
        ],
      },
    ],
  },

  credit_note: {
    id: 'doc_credit_note',
    type: 'credit_note',
    name: 'Standard Credit Note',
    theme: { ...DEFAULT_THEME_SETTINGS, primaryColor: '#ef4444', secondaryColor: '#f97316' }, // red primary
    page: { ...DEFAULT_PAGE_SETTINGS, currency: 'USD', taxLabel: 'Refund VAT (15%)' },
    sections: [
      {
        id: 'sec_cn_header',
        name: 'Header & Reference Details',
        type: 'header',
        enabled: true,
        isCollapsed: false,
        columns: [
          { id: 'col_cn_logo', name: 'Company Logo', key: 'logo', enabled: true, width: '25%', align: 'left', dataType: 'string', grouped: false, sorted: 'none', aggregated: 'none' },
          { id: 'col_cn_comp', name: 'Sender Details', key: 'company_details', enabled: true, width: '35%', align: 'left', dataType: 'string', grouped: false, sorted: 'none', aggregated: 'none' },
          { id: 'col_cn_client', name: 'Client Info (Credited To)', key: 'client_details', enabled: true, width: '40%', align: 'right', dataType: 'string', grouped: false, sorted: 'none', aggregated: 'none' },
          { id: 'col_cn_meta', name: 'Credit Note Metadata', key: 'meta_details', enabled: true, width: '100%', align: 'left', dataType: 'string', grouped: false, sorted: 'none', aggregated: 'none' },
        ],
      },
      {
        id: 'sec_cn_items',
        name: 'Credited Line Items',
        type: 'items',
        enabled: true,
        isCollapsed: false,
        columns: [
          { id: 'col_cn_i_desc', name: 'Item / Reason for Credit', key: 'description', enabled: true, width: '50%', align: 'left', dataType: 'string', grouped: false, sorted: 'none', aggregated: 'none', placeholder: 'Product Return - Damaged Box' },
          { id: 'col_cn_i_qty', name: 'Qty Credited', key: 'quantity', enabled: true, width: '15%', align: 'center', dataType: 'number', grouped: false, sorted: 'none', aggregated: 'sum' },
          { id: 'col_cn_i_rate', name: 'Credit Rate', key: 'rate', enabled: true, width: '15%', align: 'right', dataType: 'currency', grouped: false, sorted: 'none', aggregated: 'avg' },
          { id: 'col_cn_i_total', name: 'Credit Total', key: 'total', enabled: true, width: '20%', align: 'right', dataType: 'currency', grouped: false, sorted: 'none', aggregated: 'sum' },
        ],
      },
      {
        id: 'sec_cn_totals',
        name: 'Credit Totals',
        type: 'totals',
        enabled: true,
        isCollapsed: false,
        columns: [
          { id: 'col_cn_t_sub', name: 'Credit Subtotal', key: 'subtotal', enabled: true, width: '50%', align: 'right', dataType: 'currency', grouped: false, sorted: 'none', aggregated: 'none' },
          { id: 'col_cn_t_tax', name: 'Tax Refund', key: 'tax_summary', enabled: true, width: '50%', align: 'right', dataType: 'currency', grouped: false, sorted: 'none', aggregated: 'none' },
          { id: 'col_cn_t_net', name: 'Total Refund Value', key: 'total_due', enabled: true, width: '50%', align: 'right', dataType: 'currency', grouped: false, sorted: 'none', aggregated: 'none' },
        ],
      },
      {
        id: 'sec_cn_footer',
        name: 'Refund Method & Terms',
        type: 'footer',
        enabled: true,
        isCollapsed: false,
        columns: [
          { id: 'col_cn_f_terms', name: 'Notes & Policy', key: 'payment_instructions', enabled: true, width: '100%', align: 'left', dataType: 'string', grouped: false, sorted: 'none', aggregated: 'none' },
        ],
      },
    ],
  },

  purchase_order: {
    id: 'doc_po',
    type: 'purchase_order',
    name: 'Enterprise Purchase Order',
    theme: { ...DEFAULT_THEME_SETTINGS, primaryColor: '#2563eb', secondaryColor: '#d97706' }, // blue/amber accent
    page: { ...DEFAULT_PAGE_SETTINGS, currency: 'USD', taxLabel: 'Import Duty/Tax' },
    sections: [
      {
        id: 'sec_po_header',
        name: 'PO Header & Vendor Details',
        type: 'header',
        enabled: true,
        isCollapsed: false,
        columns: [
          { id: 'col_po_logo', name: 'Company Logo', key: 'logo', enabled: true, width: '20%', align: 'left', dataType: 'string', grouped: false, sorted: 'none', aggregated: 'none' },
          { id: 'col_po_comp', name: 'Buyer (Ship/Bill To)', key: 'company_details', enabled: true, width: '40%', align: 'left', dataType: 'string', grouped: false, sorted: 'none', aggregated: 'none' },
          { id: 'col_po_vendor', name: 'Vendor Info', key: 'client_details', enabled: true, width: '40%', align: 'right', dataType: 'string', grouped: false, sorted: 'none', aggregated: 'none' },
          { id: 'col_po_meta', name: 'PO Metadata', key: 'meta_details', enabled: true, width: '100%', align: 'left', dataType: 'string', grouped: false, sorted: 'none', aggregated: 'none' },
        ],
      },
      {
        id: 'sec_po_items',
        name: 'Requested Items List',
        type: 'items',
        enabled: true,
        isCollapsed: false,
        columns: [
          { id: 'col_po_i_sku', name: 'SKU / Model', key: 'sku', enabled: true, width: '20%', align: 'left', dataType: 'string', grouped: true, sorted: 'none', aggregated: 'none', placeholder: 'HW-SYS-09' },
          { id: 'col_po_i_desc', name: 'Description', key: 'description', enabled: true, width: '40%', align: 'left', dataType: 'string', grouped: false, sorted: 'none', aggregated: 'none', placeholder: 'Server Hardware Enclosure v4' },
          { id: 'col_po_i_qty', name: 'Quantity', key: 'quantity', enabled: true, width: '10%', align: 'center', dataType: 'number', grouped: false, sorted: 'none', aggregated: 'sum' },
          { id: 'col_po_i_cost', name: 'Unit Cost', key: 'rate', enabled: true, width: '15%', align: 'right', dataType: 'currency', grouped: false, sorted: 'none', aggregated: 'avg' },
          { id: 'col_po_i_ext', name: 'Total Cost', key: 'total', enabled: true, width: '15%', align: 'right', dataType: 'currency', grouped: false, sorted: 'none', aggregated: 'sum' },
        ],
      },
      {
        id: 'sec_po_totals',
        name: 'PO Summary Totals',
        type: 'totals',
        enabled: true,
        isCollapsed: false,
        columns: [
          { id: 'col_po_t_sub', name: 'Subtotal Cost', key: 'subtotal', enabled: true, width: '50%', align: 'right', dataType: 'currency', grouped: false, sorted: 'none', aggregated: 'none' },
          { id: 'col_po_t_tax', name: 'Estimated Tax', key: 'tax_summary', enabled: true, width: '50%', align: 'right', dataType: 'currency', grouped: false, sorted: 'none', aggregated: 'none' },
          { id: 'col_po_t_total', name: 'Committed Total', key: 'total_due', enabled: true, width: '50%', align: 'right', dataType: 'currency', grouped: false, sorted: 'none', aggregated: 'none' },
        ],
      },
      {
        id: 'sec_po_footer',
        name: 'Terms, Delivery, & Signature',
        type: 'footer',
        enabled: true,
        isCollapsed: false,
        columns: [
          { id: 'col_po_f_terms', name: 'Delivery Instructions', key: 'payment_instructions', enabled: true, width: '100%', align: 'left', dataType: 'string', grouped: false, sorted: 'none', aggregated: 'none' },
          { id: 'col_po_f_sign', name: 'Authorized Signature Area', key: 'thank_you', enabled: true, width: '100%', align: 'right', dataType: 'string', grouped: false, sorted: 'none', aggregated: 'none' },
        ],
      },
    ],
  },

  quote: {
    id: 'doc_quote',
    type: 'quote',
    name: 'Client Proposal Quote',
    theme: { ...DEFAULT_THEME_SETTINGS, primaryColor: '#4f46e5', secondaryColor: '#06b6d4' }, // indigo / cyan
    page: { ...DEFAULT_PAGE_SETTINGS, currency: 'USD', taxLabel: 'Est. VAT' },
    sections: [
      {
        id: 'sec_q_header',
        name: 'Proposal Info & client details',
        type: 'header',
        enabled: true,
        isCollapsed: false,
        columns: [
          { id: 'col_q_logo', name: 'Brand Logo', key: 'logo', enabled: true, width: '20%', align: 'left', dataType: 'string', grouped: false, sorted: 'none', aggregated: 'none' },
          { id: 'col_q_comp', name: 'Company Details', key: 'company_details', enabled: true, width: '40%', align: 'left', dataType: 'string', grouped: false, sorted: 'none', aggregated: 'none' },
          { id: 'col_q_client', name: 'Prepared For', key: 'client_details', enabled: true, width: '40%', align: 'right', dataType: 'string', grouped: false, sorted: 'none', aggregated: 'none' },
          { id: 'col_q_meta', name: 'Quote Expiry Details', key: 'meta_details', enabled: true, width: '100%', align: 'left', dataType: 'string', grouped: false, sorted: 'none', aggregated: 'none' },
        ],
      },
      {
        id: 'sec_q_items',
        name: 'Estimated Scope of Work',
        type: 'items',
        enabled: true,
        isCollapsed: false,
        columns: [
          { id: 'col_q_i_desc', name: 'Work Scope / Deliverable', key: 'description', enabled: true, width: '55%', align: 'left', dataType: 'string', grouped: false, sorted: 'none', aggregated: 'none', placeholder: 'UI/UX Visual Design Sprints' },
          { id: 'col_q_i_qty', name: 'Hours/Qty', key: 'quantity', enabled: true, width: '15%', align: 'center', dataType: 'number', grouped: false, sorted: 'none', aggregated: 'sum' },
          { id: 'col_q_i_rate', name: 'Hourly / Unit Rate', key: 'rate', enabled: true, width: '15%', align: 'right', dataType: 'currency', grouped: false, sorted: 'none', aggregated: 'avg' },
          { id: 'col_q_i_total', name: 'Est. Cost', key: 'total', enabled: true, width: '15%', align: 'right', dataType: 'currency', grouped: false, sorted: 'none', aggregated: 'sum' },
        ],
      },
      {
        id: 'sec_q_totals',
        name: 'Quote Totals',
        type: 'totals',
        enabled: true,
        isCollapsed: false,
        columns: [
          { id: 'col_q_t_sub', name: 'Subtotal Estimate', key: 'subtotal', enabled: true, width: '50%', align: 'right', dataType: 'currency', grouped: false, sorted: 'none', aggregated: 'none' },
          { id: 'col_q_t_tax', name: 'Estimated Tax', key: 'tax_summary', enabled: true, width: '50%', align: 'right', dataType: 'currency', grouped: false, sorted: 'none', aggregated: 'none' },
          { id: 'col_q_t_total', name: 'Grand Total Estimate', key: 'total_due', enabled: true, width: '50%', align: 'right', dataType: 'currency', grouped: false, sorted: 'none', aggregated: 'none' },
        ],
      },
      {
        id: 'sec_q_footer',
        name: 'Proposal Terms & Acceptance',
        type: 'footer',
        enabled: true,
        isCollapsed: false,
        columns: [
          { id: 'col_q_f_terms', name: 'Notes & Expiry Conditions', key: 'payment_instructions', enabled: true, width: '100%', align: 'left', dataType: 'string', grouped: false, sorted: 'none', aggregated: 'none' },
          { id: 'col_q_f_sign', name: 'Sign to Accept Proposal', key: 'thank_you', enabled: true, width: '100%', align: 'center', dataType: 'string', grouped: false, sorted: 'none', aggregated: 'none' },
        ],
      },
    ],
  },

  timesheet: {
    id: 'doc_timesheet',
    type: 'timesheet',
    name: 'Professional Services Timesheet',
    theme: { ...DEFAULT_THEME_SETTINGS, primaryColor: '#475569', secondaryColor: '#0ea5e9' }, // Cool slate & sky blue
    page: { ...DEFAULT_PAGE_SETTINGS, currency: 'USD', taxLabel: 'Agency Fee' },
    sections: [
      {
        id: 'sec_ts_header',
        name: 'Consultant & Project Info',
        type: 'header',
        enabled: true,
        isCollapsed: false,
        columns: [
          { id: 'col_ts_logo', name: 'Agency Logo', key: 'logo', enabled: true, width: '20%', align: 'left', dataType: 'string', grouped: false, sorted: 'none', aggregated: 'none' },
          { id: 'col_ts_comp', name: 'Consultant/Contractor Details', key: 'company_details', enabled: true, width: '40%', align: 'left', dataType: 'string', grouped: false, sorted: 'none', aggregated: 'none' },
          { id: 'col_ts_client', name: 'Billable Client Details', key: 'client_details', enabled: true, width: '40%', align: 'right', dataType: 'string', grouped: false, sorted: 'none', aggregated: 'none' },
          { id: 'col_ts_meta', name: 'Pay Period Ending Info', key: 'meta_details', enabled: true, width: '100%', align: 'left', dataType: 'string', grouped: false, sorted: 'none', aggregated: 'none' },
        ],
      },
      {
        id: 'sec_ts_items',
        name: 'Daily Logged Hours',
        type: 'items',
        enabled: true,
        isCollapsed: false,
        columns: [
          { id: 'col_ts_i_date', name: 'Date', key: 'date', enabled: true, width: '15%', align: 'left', dataType: 'date', grouped: false, sorted: 'asc', aggregated: 'none', placeholder: '2026-07-10' },
          { id: 'col_ts_i_task', name: 'Project / Task Description', key: 'description', enabled: true, width: '45%', align: 'left', dataType: 'string', grouped: false, sorted: 'none', aggregated: 'none', placeholder: 'Frontend architecture audit' },
          { id: 'col_ts_i_hours', name: 'Hours', key: 'quantity', enabled: true, width: '10%', align: 'center', dataType: 'number', grouped: false, sorted: 'none', aggregated: 'sum', placeholder: '8' },
          { id: 'col_ts_i_rate', name: 'Hourly Rate', key: 'rate', enabled: true, width: '15%', align: 'right', dataType: 'currency', grouped: false, sorted: 'none', aggregated: 'avg', placeholder: '120.00' },
          { id: 'col_ts_i_total', name: 'Subtotal', key: 'total', enabled: true, width: '15%', align: 'right', dataType: 'currency', grouped: false, sorted: 'none', aggregated: 'sum', placeholder: '960.00' },
        ],
      },
      {
        id: 'sec_ts_totals',
        name: 'Summary of Earnings',
        type: 'totals',
        enabled: true,
        isCollapsed: false,
        columns: [
          { id: 'col_ts_t_hours', name: 'Total Logged Hours', key: 'subtotal', enabled: true, width: '50%', align: 'right', dataType: 'number', grouped: false, sorted: 'none', aggregated: 'none' },
          { id: 'col_ts_t_rate', name: 'Avg Effective Rate', key: 'tax_summary', enabled: true, width: '50%', align: 'right', dataType: 'currency', grouped: false, sorted: 'none', aggregated: 'none' },
          { id: 'col_ts_t_due', name: 'Total Invoice Due', key: 'total_due', enabled: true, width: '50%', align: 'right', dataType: 'currency', grouped: false, sorted: 'none', aggregated: 'none' },
        ],
      },
      {
        id: 'sec_ts_footer',
        name: 'Approvals & Signatures',
        type: 'footer',
        enabled: true,
        isCollapsed: false,
        columns: [
          { id: 'col_ts_f_terms', name: 'Consulting Notes', key: 'payment_instructions', enabled: true, width: '100%', align: 'left', dataType: 'string', grouped: false, sorted: 'none', aggregated: 'none' },
          { id: 'col_ts_f_sign', name: 'Client Approval Signature', key: 'thank_you', enabled: true, width: '100%', align: 'center', dataType: 'string', grouped: false, sorted: 'none', aggregated: 'none' },
        ],
      },
    ],
  },

  expense_report: {
    id: 'doc_expense',
    type: 'expense_report',
    name: 'Corporate Expense Reimbursement',
    theme: { ...DEFAULT_THEME_SETTINGS, primaryColor: '#dc2626', secondaryColor: '#4f46e5' }, // Red / Indigo
    page: { ...DEFAULT_PAGE_SETTINGS, currency: 'USD', taxLabel: 'Reimbursable GST' },
    sections: [
      {
        id: 'sec_ex_header',
        name: 'Employee & Report Details',
        type: 'header',
        enabled: true,
        isCollapsed: false,
        columns: [
          { id: 'col_ex_logo', name: 'Company Logo', key: 'logo', enabled: true, width: '20%', align: 'left', dataType: 'string', grouped: false, sorted: 'none', aggregated: 'none' },
          { id: 'col_ex_comp', name: 'Company Division', key: 'company_details', enabled: true, width: '40%', align: 'left', dataType: 'string', grouped: false, sorted: 'none', aggregated: 'none' },
          { id: 'col_ex_client', name: 'Employee Details', key: 'client_details', enabled: true, width: '40%', align: 'right', dataType: 'string', grouped: false, sorted: 'none', aggregated: 'none' },
          { id: 'col_ex_meta', name: 'Report Metadata', key: 'meta_details', enabled: true, width: '100%', align: 'left', dataType: 'string', grouped: false, sorted: 'none', aggregated: 'none' },
        ],
      },
      {
        id: 'sec_ex_items',
        name: 'List of Receipts & Expenses',
        type: 'items',
        enabled: true,
        isCollapsed: false,
        columns: [
          { id: 'col_ex_i_date', name: 'Receipt Date', key: 'date', enabled: true, width: '15%', align: 'left', dataType: 'date', grouped: false, sorted: 'asc', aggregated: 'none', placeholder: '2026-07-02' },
          { id: 'col_ex_i_cat', name: 'Expense Category', key: 'category', enabled: true, width: '20%', align: 'left', dataType: 'string', grouped: true, sorted: 'none', aggregated: 'none', placeholder: 'Travel & Lodging' },
          { id: 'col_ex_i_desc', name: 'Merchant & Notes', key: 'description', enabled: true, width: '40%', align: 'left', dataType: 'string', grouped: false, sorted: 'none', aggregated: 'none', placeholder: 'Enterprise Rent-a-Car - Team conference travel' },
          { id: 'col_ex_i_rate', name: 'VAT/GST', key: 'rate', enabled: true, width: '10%', align: 'right', dataType: 'currency', grouped: false, sorted: 'none', aggregated: 'sum', placeholder: '15.00' },
          { id: 'col_ex_i_total', name: 'Receipt Amount', key: 'total', enabled: true, width: '15%', align: 'right', dataType: 'currency', grouped: false, sorted: 'none', aggregated: 'sum', placeholder: '185.50' },
        ],
      },
      {
        id: 'sec_ex_totals',
        name: 'Reimbursement Totals Summary',
        type: 'totals',
        enabled: true,
        isCollapsed: false,
        columns: [
          { id: 'col_ex_t_sub', name: 'Net Spent', key: 'subtotal', enabled: true, width: '50%', align: 'right', dataType: 'currency', grouped: false, sorted: 'none', aggregated: 'none' },
          { id: 'col_ex_t_tax', name: 'Total Reimbursable Tax', key: 'tax_summary', enabled: true, width: '50%', align: 'right', dataType: 'currency', grouped: false, sorted: 'none', aggregated: 'none' },
          { id: 'col_ex_t_total', name: 'Total Reimbursement Due', key: 'total_due', enabled: true, width: '50%', align: 'right', dataType: 'currency', grouped: false, sorted: 'none', aggregated: 'none' },
        ],
      },
      {
        id: 'sec_ex_footer',
        name: 'Corporate Policy & Approvals',
        type: 'footer',
        enabled: true,
        isCollapsed: false,
        columns: [
          { id: 'col_ex_f_terms', name: 'Expense Declaration Policy', key: 'payment_instructions', enabled: true, width: '100%', align: 'left', dataType: 'string', grouped: false, sorted: 'none', aggregated: 'none' },
          { id: 'col_ex_f_sign', name: 'Manager Reimbursement Approval', key: 'thank_you', enabled: true, width: '100%', align: 'right', dataType: 'string', grouped: false, sorted: 'none', aggregated: 'none' },
        ],
      },
    ],
  },
};

export const MOCK_DATASETS: Record<DocumentType, MockDocumentData> = {
  invoice: {
    company: {
      name: 'Acme Laboratories Inc.',
      logo: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=120&auto=format&fit=crop&q=80',
      address: '100 Enterprise Way, Suite 400\nSilicon Valley, CA 94025\nUnited States',
      email: 'billing@acmelabs.com',
      phone: '+1 (555) 019-2831',
      website: 'www.acmelabs.com',
      taxId: 'US-99238122-A',
    },
    client: {
      name: 'Stripe, Inc.',
      address: '354 Oyster Point Blvd\nSouth San Francisco, CA 94080\nUnited States',
      email: 'accounts-payable@stripe.com',
      phone: '+1 (415) 332-9011',
      taxId: 'US-11029312-C',
    },
    metadata: {
      number: 'INV-2026-0428',
      date: '2026-07-14',
      dueDate: '2026-08-14',
      reference: 'PO-982-A',
      paymentTerms: 'Net 30 Days',
    },
    items: [
      { description: 'Cloud Infrastructure Architecture Consulting', quantity: 24, rate: 180.0, total: 4320.0 },
      { description: 'React Frontend Performance Optimizations & Audits', quantity: 12, rate: 150.0, total: 1800.0 },
      { description: 'Continuous Deployment & CI/CD Pipeline Engineering', quantity: 8, rate: 165.0, total: 1320.0 },
    ],
    totals: {
      subtotal: 7440.0,
      taxRate: 0.10,
      taxAmount: 744.0,
      discountRate: 0.05,
      discountAmount: 372.0,
      adjustment: 0.0,
      total: 7812.0,
      amountPaid: 1500.0,
      balanceDue: 6312.0,
    },
    footer: {
      notes: 'Please quote the invoice number on your wire transfer reference. We accept ACH, Wire Transfer, and major Credit Cards.',
      terms: 'Standard terms are Net 30. A late payment fee of 1.5% per month will be appended to accounts overdue beyond the stated period.',
      bankName: 'Silicon Valley Founders Bank',
      bankAccount: '*********4920',
      bankRouting: 'SVB-02110-33',
      thankYouMessage: 'Thank you for your business! We appreciate working together to build a robust architecture.',
    },
  },

  credit_note: {
    company: {
      name: 'Global Supply Chain Corp',
      logo: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=120&auto=format&fit=crop&q=80',
      address: '50 Industrial Parkway\nChicago, IL 60611',
      email: 'billing@globalsupply.com',
      phone: '+1 (312) 555-0144',
      website: 'www.globalsupply.com',
      taxId: 'US-882312-B',
    },
    client: {
      name: 'Retail World Retailers',
      address: '77 Broad Street, Plaza B\nNew York, NY 10004',
      email: 'returns@retailworld.com',
      phone: '+1 (212) 555-8839',
      taxId: 'US-293120-N',
    },
    metadata: {
      number: 'CRN-2026-003',
      date: '2026-07-14',
      dueDate: '2026-07-14',
      reference: 'INV-2026-9023',
      paymentTerms: 'Immediate Store Credit',
    },
    items: [
      { description: 'Defective Power Supplies (Model: PS-300)', quantity: 15, rate: 45.0, total: 675.0 },
      { description: 'Shipping compensation for return delivery', quantity: 1, rate: 75.0, total: 75.0 },
    ],
    totals: {
      subtotal: 750.0,
      taxRate: 0.15,
      taxAmount: 112.5,
      discountRate: 0,
      discountAmount: 0,
      adjustment: 0,
      total: 862.5,
      amountPaid: 862.5,
      balanceDue: 0.0,
    },
    footer: {
      notes: 'This credit has been automatically added to your outstanding balance account. It will be deducted from your next wholesale invoice.',
      terms: 'Refunded goods remain the property of Global Supply Chain Corp and will be recycled.',
      bankName: 'Chase Manhattan',
      bankAccount: '*********2931',
      bankRouting: 'CHAS-021-99',
      thankYouMessage: 'We apologize for any inconvenience caused by this batch anomaly. The product lines have been audited.',
    },
  },

  purchase_order: {
    company: {
      name: 'Tesla Gigafactory Texas',
      logo: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=120&auto=format&fit=crop&q=80',
      address: '1 Tesla Road\nAustin, TX 78725',
      email: 'purchasing@tesla.com',
      phone: '+1 (737) 200-1000',
      website: 'www.tesla.com',
      taxId: 'US-991203-M',
    },
    client: {
      name: 'Lithium Processors Ltd.',
      address: '44 Mining Valley Way\nSparks, NV 89434',
      email: 'sales@lithiumproc.com',
      phone: '+1 (775) 555-9012',
      taxId: 'US-442381-Z',
    },
    metadata: {
      number: 'PO-2026-9482',
      date: '2026-07-14',
      dueDate: '2026-09-01', // Delivery target
      reference: 'CONTRACT-LITH-2026',
      paymentTerms: 'Net 45 Days',
    },
    items: [
      { sku: 'BAT-LITH-02', description: 'Refined Battery-Grade Lithium Carbonate (Tons)', quantity: 20, rate: 12500.0, total: 250000.0 },
      { sku: 'BAT-COB-11', description: 'High-purity Cobalt Sulfate Co-precipitate (Tons)', quantity: 5, rate: 18000.0, total: 90000.0 },
    ],
    totals: {
      subtotal: 340000.0,
      taxRate: 0.08,
      taxAmount: 27200.0,
      discountRate: 0.02,
      discountAmount: 6800.0,
      adjustment: 1200.0, // shipping/handling fee
      total: 361600.0,
      amountPaid: 0.0,
      balanceDue: 361600.0,
    },
    footer: {
      notes: 'All chemical shipments must be accompanied by full MSDS compliance certificates and certificates of chemical origin.',
      terms: 'Delivery is FOB Destination. Delivery hours are Monday-Friday 07:00 to 15:00 CST at Tesla Austin Warehouse Dock 4.',
      bankName: 'Citi National Bank',
      bankAccount: '*********0982',
      bankRouting: 'CITI-3310-91',
      thankYouMessage: 'Authorized and approved under Tesla Procurement Protocol-V4. Thank you for your critical supply support.',
    },
  },

  quote: {
    company: {
      name: 'Northstar Architects & Planners',
      logo: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=120&auto=format&fit=crop&q=80',
      address: '22 Ocean Drive, Suite 90\nMiami, FL 33139',
      email: 'hello@northstararch.com',
      phone: '+1 (305) 555-0100',
      website: 'www.northstararch.com',
      taxId: 'US-443901-X',
    },
    client: {
      name: 'Vanguard Realty Group',
      address: '100 Brickell Avenue\nMiami, FL 33131',
      email: 'development@vanguardrealty.com',
      phone: '+1 (305) 555-8820',
      taxId: 'US-293810-Y',
    },
    metadata: {
      number: 'EST-2026-492',
      date: '2026-07-14',
      dueDate: '2026-08-31', // Valid Until
      reference: 'PROJECT-Vanguard-Plaza',
      paymentTerms: '30% Deposit on signing, balance in architectural milestones',
    },
    items: [
      { description: 'Schematic Architectural Drawing Phase - Brickell Plaza', quantity: 1, rate: 45000.0, total: 45000.0 },
      { description: '3D High-fidelity Photorealistic Renderings & VR Flythrough', quantity: 8, rate: 1200.0, total: 9600.0 },
      { description: 'Zoning & Municipal Code Compliance Filing Assistance', quantity: 1, rate: 7500.0, total: 7500.0 },
    ],
    totals: {
      subtotal: 62100.0,
      taxRate: 0.07,
      taxAmount: 4347.0,
      discountRate: 0.10, // Promotional discount
      discountAmount: 6210.0,
      adjustment: 0.0,
      total: 60237.0,
      amountPaid: 0.0,
      balanceDue: 60237.0,
    },
    footer: {
      notes: 'This quote is an estimate and valid for 45 days from date of issue. Changes in project scope will require an updated addendum.',
      terms: 'Client is responsible for municipal code filing fees, which are excluded from this professional architectural service quote.',
      bankName: 'Miami Founders Alliance Bank',
      bankAccount: '*********8901',
      bankRouting: 'MIA-0912-33',
      thankYouMessage: 'We are thrilled about the possibility of collaborating with Vanguard to design an iconic high-rise statement.',
    },
  },

  timesheet: {
    company: {
      name: 'Helios Tech Advisory',
      logo: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=120&auto=format&fit=crop&q=80',
      address: '220 Sansome St\nSan Francisco, CA 94104',
      email: 'partner-billing@heliostech.com',
      phone: '+1 (415) 555-0902',
      website: 'www.heliostech.com',
      taxId: 'US-290138-F',
    },
    client: {
      name: 'Figma Engineering Inc.',
      address: '760 Market St\nSan Francisco, CA 94102',
      email: 'contractors-ap@figma.com',
      phone: '+1 (415) 555-1212',
      taxId: 'US-102931-E',
    },
    metadata: {
      number: 'TS-2026-WK28',
      date: '2026-07-14',
      dueDate: '2026-07-28',
      reference: 'ENG-ADVISORY-2026',
      paymentTerms: 'Net 14 Days',
    },
    items: [
      { date: '2026-07-06', description: 'Wrote React 19 Upgrade Guide & ran dependency compatibility tests', quantity: 8.5, rate: 175.0, total: 1487.5 },
      { date: '2026-07-07', description: 'Refactored state layer for canvas drag-and-drop system and resolved memory leaks', quantity: 9.0, rate: 175.0, total: 1575.0 },
      { date: '2026-07-08', description: 'Participated in architecture review meetings and conducted technical interviews', quantity: 6.0, rate: 175.0, total: 1050.0 },
      { date: '2026-07-09', description: 'Designed high-performance canvas visual render pipelines for template previewers', quantity: 8.0, rate: 175.0, total: 1400.0 },
      { date: '2026-07-10', description: 'Conducted load testing on SVG rendering engine and completed weekly summaries', quantity: 8.5, rate: 175.0, total: 1487.5 },
    ],
    totals: {
      subtotal: 7000.0, // total hours is 40.0, subtotal shows hours in our template
      taxRate: 0.05, // agency fee rate
      taxAmount: 350.0,
      discountRate: 0,
      discountAmount: 0,
      adjustment: 0,
      total: 7350.0,
      amountPaid: 0.0,
      balanceDue: 7350.0,
    },
    footer: {
      notes: 'Weekly timesheet completed and submitted in accordance with Contractor Engagement Agreement - Ref #FIG-ENG-2026.',
      terms: 'All hours have been logged and approved on Figma internal Jira/TimeTracker logs. Subtotal cost incorporates 40 total hours logged.',
      bankName: 'Fargo Wells Silicon Bank',
      bankAccount: '*********0029',
      bankRouting: 'FW-230-101',
      thankYouMessage: 'Approved by Lead Partner & Principal Consultant. We are excited about supporting Figma engineering sprints.',
    },
  },

  expense_report: {
    company: {
      name: 'Anthropic Technologies Co.',
      logo: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=120&auto=format&fit=crop&q=80',
      address: '530 Shotwell St\nSan Francisco, CA 94110',
      email: 'reimbursements@anthropic.com',
      phone: '+1 (415) 555-0912',
      website: 'www.anthropic.com',
      taxId: 'US-330198-H',
    },
    client: {
      name: 'Sarah Chen-Mayer (AI Research)',
      address: 'Division: Model Alignment & RLHF\nEmployee ID: EMP-2901-A',
      email: 'schen@anthropic.com',
      phone: '+1 (415) 555-8830',
      taxId: 'N/A',
    },
    metadata: {
      number: 'EXP-2026-0702',
      date: '2026-07-14',
      dueDate: '2026-07-24', // Target reimbursement date
      reference: 'TRV-CONF-ICML',
      paymentTerms: 'Direct Deposit on approval',
    },
    items: [
      { date: '2026-07-02', category: 'Travel', description: 'Flight to ICML Conference - SFO to HND (Tokyo)', quantity: 1, rate: 1450.0, total: 1450.0 },
      { date: '2026-07-03', category: 'Lodging', description: 'Grand Hyatt Tokyo - 4 nights accommodation during summit', quantity: 4, rate: 350.0, total: 1400.0 },
      { date: '2026-07-04', category: 'Meals', description: 'Speaker lunch discussion with researchers', quantity: 1, rate: 120.0, total: 120.0 },
      { date: '2026-07-05', category: 'Transport', description: 'Tokyo Metro train fares and taxi transfers', quantity: 1, rate: 45.0, total: 45.0 },
    ],
    totals: {
      subtotal: 3015.0,
      taxRate: 0.10, // Local VAT
      taxAmount: 301.5,
      discountRate: 0,
      discountAmount: 0,
      adjustment: 0,
      total: 3316.5,
      amountPaid: 0.0,
      balanceDue: 3316.5,
    },
    footer: {
      notes: 'All Tokyo receipts have been photographed and uploaded to Expensify. Foreign currency transactions converted at daily market spot rate.',
      terms: 'Reimbursements adhere to corporate travel policies. Meals capping of $150 per day has been maintained.',
      bankName: 'First Republic Chase',
      bankAccount: '*********2910',
      bankRouting: 'FRB-3310-90',
      thankYouMessage: 'Submitted by Sarah Chen-Mayer. Approved by RLHF Research Lead Dr. Marcus Vance.',
    },
  },
};
