/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import dayjs from 'dayjs';
import { 
  DocumentSchema, 
  MockDocumentData, 
  ColumnSchema, 
  SectionSchema 
} from '../types';
import { MOCK_DATASETS } from '../data/defaultSchemas';

interface PreviewRendererProps {
  document: DocumentSchema;
}

export function PreviewRenderer({ document }: PreviewRendererProps) {
  // Retrieve the appropriate mock data matching this document type
  const mockData: MockDocumentData = MOCK_DATASETS[document.type] || MOCK_DATASETS.invoice;

  // Formatting helper for currency and numbers
  const formatValue = (val: any, col: ColumnSchema) => {
    if (val === undefined || val === null) return col.placeholder || '';

    if (col.dataType === 'currency') {
      const num = Number(val);
      if (isNaN(num)) return val;
      
      const symbolMap: Record<string, string> = {
        USD: '$',
        EUR: '€',
        GBP: '£',
        INR: '₹',
        CAD: 'C$',
        AUD: 'A$',
      };
      const symbol = symbolMap[document.page.currency] || '$';
      
      if (col.format === 'code') {
        return `${document.page.currency} ${num.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
      }
      if (col.format === '$0,0') {
        return `${symbol}${num.toLocaleString(undefined, { maximumFractionDigits: 0 })}`;
      }
      return `${symbol}${num.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    }

    if (col.dataType === 'number') {
      const num = Number(val);
      if (isNaN(num)) return val;
      return num.toLocaleString();
    }

    if (col.dataType === 'date' && val) {
      try {
        const d = dayjs(val);
        if (d.isValid()) {
          const fmt = col.format || 'YYYY-MM-DD';
          if (fmt === 'DD/MM/YYYY') return d.format('DD/MM/YYYY');
          if (fmt === 'MMMM DD, YYYY') return d.format('MMMM DD, YYYY');
          return d.format('YYYY-MM-DD');
        }
      } catch {
        return val;
      }
    }

    if (col.dataType === 'boolean') {
      return val ? 'Yes' : 'No';
    }

    return String(val);
  };

  // Aggregation helper
  const calculateAggregate = (items: Array<Record<string, any>>, col: ColumnSchema) => {
    if (col.aggregated === 'none') return null;
    
    const validNums = items
      .map(item => Number(item[col.key]))
      .filter(num => !isNaN(num));

    if (col.aggregated === 'count') {
      return items.length;
    }

    if (validNums.length === 0) return '-';

    if (col.aggregated === 'sum') {
      const sum = validNums.reduce((acc, curr) => acc + curr, 0);
      return formatValue(sum, { ...col, format: undefined }); // bypass standard format to preserve raw total if needed
    }

    if (col.aggregated === 'avg') {
      const sum = validNums.reduce((acc, curr) => acc + curr, 0);
      return formatValue(sum / validNums.length, col);
    }

    return null;
  };

  // Get font class
  const getFontFamilyStyle = () => {
    switch (document.theme.fontFamily) {
      case 'Space Grotesk':
        return { fontFamily: 'var(--font-display), sans-serif' };
      case 'JetBrains Mono':
        return { fontFamily: 'var(--font-mono), monospace', fontSize: '12px' };
      case 'Playfair Display':
        return { fontFamily: 'var(--font-serif), Georgia, serif' };
      default:
        return { fontFamily: 'var(--font-sans), sans-serif' };
    }
  };

  // Render specific Header Section
  const renderHeader = (section: SectionSchema) => {
    const colLogo = section.columns.find(c => c.key === 'logo');
    const colComp = section.columns.find(c => c.key === 'company_details');
    const colClient = section.columns.find(c => c.key === 'client_details');
    const colMeta = section.columns.find(c => c.key === 'meta_details');

    const showLogo = document.page.showLogo && colLogo?.enabled;

    return (
      <div className="space-y-6 pb-6 border-b border-slate-100">
        {/* Top bar: Logo + Sender & Client */}
        <div className="flex justify-between items-start gap-4">
          {/* Logo & Sender */}
          <div className="space-y-4 max-w-[50%]">
            {showLogo && mockData.company.logo && (
              <img
                src={mockData.company.logo}
                alt="Brand Logo"
                referrerPolicy="no-referrer"
                className="max-h-12 max-w-[150px] object-contain rounded-md"
              />
            )}
            {colComp?.enabled && (
              <div>
                <h2 className="text-sm font-bold text-slate-800" style={{ color: document.theme.primaryColor }}>
                  {mockData.company.name}
                </h2>
                <p className="text-[11px] text-slate-500 whitespace-pre-line mt-1 font-medium leading-relaxed">
                  {mockData.company.address}
                </p>
                <div className="text-[10px] text-slate-400 font-medium mt-1">
                  {mockData.company.email} • {mockData.company.phone}
                  {mockData.company.taxId && <p className="mt-0.5">Tax ID: {mockData.company.taxId}</p>}
                </div>
              </div>
            )}
          </div>

          {/* Client Bill To */}
          {colClient?.enabled && (
            <div className="text-right max-w-[45%]">
              <span className="text-[10px] font-bold tracking-wider uppercase text-slate-400">
                {document.type === 'purchase_order' ? 'Vendor Information' : 'Bill To'}
              </span>
              <h3 className="text-sm font-bold text-slate-800 mt-1">{mockData.client.name}</h3>
              <p className="text-[11px] text-slate-500 whitespace-pre-line mt-1 font-medium leading-relaxed">
                {mockData.client.address}
              </p>
              <div className="text-[10px] text-slate-400 font-medium mt-1">
                {mockData.client.email} • {mockData.client.phone}
                {mockData.client.taxId && mockData.client.taxId !== 'N/A' && (
                  <p className="mt-0.5">Tax ID: {mockData.client.taxId}</p>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Metadata Details Row (Invoice Number, Dates, PO Number, etc) */}
        {colMeta?.enabled && (
          <div 
            className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-3.5 rounded-lg border"
            style={{ 
              borderColor: document.theme.showBorders ? '#f1f5f9' : 'transparent',
              borderRadius: `${document.theme.borderRadius}px`,
              backgroundColor: document.theme.headerStyle === 'stripe' ? `${document.theme.primaryColor}06` : '#fafafa'
            }}
          >
            <div>
              <span className="text-[9px] font-bold tracking-wider uppercase text-slate-400">
                {document.type.replace('_', ' ')} Number
              </span>
              <p className="text-xs font-bold text-slate-800 mt-0.5">{mockData.metadata.number}</p>
            </div>
            <div>
              <span className="text-[9px] font-bold tracking-wider uppercase text-slate-400">Date Issued</span>
              <p className="text-xs font-bold text-slate-800 mt-0.5">
                {dayjs(mockData.metadata.date).format('MMMM DD, YYYY')}
              </p>
            </div>
            <div>
              <span className="text-[9px] font-bold tracking-wider uppercase text-slate-400">
                {document.type === 'quote' ? 'Valid Until' : document.type === 'purchase_order' ? 'Expected Delivery' : 'Due Date'}
              </span>
              <p className="text-xs font-bold text-slate-800 mt-0.5">
                {dayjs(mockData.metadata.dueDate).format('MMMM DD, YYYY')}
              </p>
            </div>
            <div>
              <span className="text-[9px] font-bold tracking-wider uppercase text-slate-400">Payment Terms</span>
              <p className="text-xs font-bold text-slate-800 mt-0.5">{mockData.metadata.paymentTerms}</p>
            </div>
          </div>
        )}
      </div>
    );
  };

  // Render Table Items Section
  const renderItems = (section: SectionSchema) => {
    const activeCols = section.columns.filter(c => c.enabled);
    if (activeCols.length === 0) return null;

    // Apply sorting if configured in schema
    let items = [...mockData.items];
    const sortCol = activeCols.find(c => c.sorted !== 'none');
    if (sortCol) {
      items.sort((a, b) => {
        const valA = a[sortCol.key];
        const valB = b[sortCol.key];
        
        if (typeof valA === 'number' && typeof valB === 'number') {
          return sortCol.sorted === 'asc' ? valA - valB : valB - valA;
        }
        const strA = String(valA || '').toLowerCase();
        const strB = String(valB || '').toLowerCase();
        return sortCol.sorted === 'asc' 
          ? strA.localeCompare(strB)
          : strB.localeCompare(strA);
      });
    }

    // Determine visual style
    const headerStyle = document.theme.headerStyle;
    let headerBg = 'transparent';
    let headerText = 'var(--color-brand-800)';
    let headerBorderColor = '#e2e8f0';

    if (headerStyle === 'modern') {
      headerBg = document.theme.primaryColor;
      headerText = '#ffffff';
      headerBorderColor = document.theme.primaryColor;
    } else if (headerStyle === 'stripe') {
      headerBg = `${document.theme.primaryColor}10`; // 6% transparency tint
      headerText = document.theme.primaryColor;
      headerBorderColor = `${document.theme.primaryColor}15`;
    }

    return (
      <div className="py-2">
        <table 
          className="w-full text-left border-collapse"
          style={{ 
            borderRadius: `${document.theme.borderRadius}px`,
            overflow: 'hidden' 
          }}
        >
          {/* Table Header */}
          <thead>
            <tr style={{ backgroundColor: headerBg }}>
              {activeCols.map((col) => (
                <th
                  key={col.id}
                  className="p-2.5 text-[10px] font-bold uppercase tracking-wider border-b"
                  style={{
                    textAlign: col.align,
                    color: headerText,
                    borderColor: headerBorderColor,
                    width: col.width === 'auto' ? undefined : col.width,
                  }}
                >
                  {col.name}
                </th>
              ))}
            </tr>
          </thead>

          {/* Table Body */}
          <tbody className="divide-y divide-slate-100">
            {items.map((item, idx) => (
              <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                {activeCols.map((col) => (
                  <td
                    key={col.id}
                    className="p-2.5 text-xs text-slate-700 leading-relaxed font-medium"
                    style={{
                      textAlign: col.align,
                    }}
                  >
                    {formatValue(item[col.key], col)}
                  </td>
                ))}
              </tr>
            ))}

            {/* Summation / Aggregate Row if requested */}
            {activeCols.some(c => c.aggregated !== 'none') && (
              <tr 
                className="bg-slate-50/50 font-bold border-t"
                style={{ 
                  borderColor: document.theme.showBorders ? '#e2e8f0' : 'transparent' 
                }}
              >
                {activeCols.map((col, cIdx) => {
                  const aggregateVal = calculateAggregate(items, col);
                  return (
                    <td
                      key={col.id}
                      className="p-2.5 text-xs text-slate-800"
                      style={{
                        textAlign: col.align,
                      }}
                    >
                      {aggregateVal !== null ? (
                        <div className="flex flex-col">
                          <span className="text-[8px] font-bold uppercase text-slate-400 tracking-wider">
                            {col.aggregated}
                          </span>
                          <span className="text-slate-800 font-bold">{aggregateVal}</span>
                        </div>
                      ) : (
                        cIdx === 0 ? <span className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">Totals</span> : ''
                      )}
                    </td>
                  );
                })}
              </tr>
            )}
          </tbody>
        </table>
      </div>
    );
  };

  // Render Totals Section
  const renderTotals = (section: SectionSchema) => {
    const colSub = section.columns.find(c => c.key === 'subtotal');
    const colTax = section.columns.find(c => c.key === 'tax_summary');
    const colDue = section.columns.find(c => c.key === 'total_due');
    const colPaid = section.columns.find(c => c.key === 'amount_paid');

    const symbolMap: Record<string, string> = {
      USD: '$', EUR: '€', GBP: '£', INR: '₹', CAD: 'C$', AUD: 'A$'
    };
    const sym = symbolMap[document.page.currency] || '$';

    const fmt = (num: number) => {
      return `${sym}${num.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    };

    return (
      <div className="flex justify-end pt-4 pb-4">
        <div className="w-full sm:w-80 space-y-2 text-xs">
          {colSub?.enabled && (
            <div className="flex justify-between text-slate-500 font-medium px-1">
              <span>Subtotal</span>
              <span className="font-bold text-slate-800">{fmt(mockData.totals.subtotal)}</span>
            </div>
          )}
          
          {colTax?.enabled && (
            <div className="flex justify-between text-slate-500 font-medium px-1">
              <span>{document.page.taxLabel || 'VAT'}</span>
              <span className="font-bold text-slate-800">{fmt(mockData.totals.taxAmount)}</span>
            </div>
          )}

          {mockData.totals.discountAmount > 0 && (
            <div className="flex justify-between text-slate-500 font-medium px-1">
              <span>Discount ({mockData.totals.discountRate * 100}%)</span>
              <span className="font-bold text-red-500">-{fmt(mockData.totals.discountAmount)}</span>
            </div>
          )}

          {mockData.totals.adjustment !== 0 && (
            <div className="flex justify-between text-slate-500 font-medium px-1">
              <span>Adjustment/Handling</span>
              <span className="font-bold text-slate-800">{fmt(mockData.totals.adjustment)}</span>
            </div>
          )}

          {colDue?.enabled && (
            <div 
              className="flex justify-between p-2 rounded-lg text-sm font-bold"
              style={{
                backgroundColor: `${document.theme.primaryColor}06`,
                color: document.theme.primaryColor,
                border: `1px solid ${document.theme.primaryColor}15`
              }}
            >
              <span>Grand Total</span>
              <span>{fmt(mockData.totals.total)}</span>
            </div>
          )}

          {colPaid?.enabled && mockData.totals.amountPaid > 0 && (
            <>
              <div className="flex justify-between text-slate-500 font-medium px-1 pt-1">
                <span>Amount Paid</span>
                <span className="font-bold text-slate-700">{fmt(mockData.totals.amountPaid)}</span>
              </div>
              <div className="flex justify-between text-slate-800 font-bold border-t border-slate-200 pt-1 px-1">
                <span>Balance Due</span>
                <span className="font-bold text-emerald-600">{fmt(mockData.totals.balanceDue)}</span>
              </div>
            </>
          )}
        </div>
      </div>
    );
  };

  // Render Footer Section (Payment bank info + T&C)
  const renderFooter = (section: SectionSchema) => {
    const colTerms = section.columns.find(c => c.key === 'payment_instructions');
    const colThanks = section.columns.find(c => c.key === 'thank_you');

    return (
      <div className="border-t border-slate-100 pt-6 mt-6 space-y-6">
        {colTerms?.enabled && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-[10px] text-slate-500 leading-relaxed font-medium">
            <div className="space-y-2">
              <span className="text-[9px] font-bold tracking-wider uppercase text-slate-400 block">Terms & Conditions</span>
              <p className="bg-slate-50 p-2.5 rounded-lg border border-slate-100">{mockData.footer.terms}</p>
            </div>
            
            <div className="space-y-2">
              <span className="text-[9px] font-bold tracking-wider uppercase text-slate-400 block">Payment Details</span>
              <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100 space-y-1">
                <p><span className="text-slate-400">Bank Name:</span> {mockData.footer.bankName}</p>
                <p><span className="text-slate-400">Account No:</span> {mockData.footer.bankAccount}</p>
                <p><span className="text-slate-400">Routing Code:</span> {mockData.footer.bankRouting}</p>
              </div>
            </div>
          </div>
        )}

        {colThanks?.enabled && (
          <div className="text-center py-2">
            <p className="text-[11px] italic font-semibold text-slate-500" style={{ color: document.theme.secondaryColor }}>
              "{mockData.footer.thankYouMessage}"
            </p>
          </div>
        )}
      </div>
    );
  };

  return (
    <div 
      id="invoice-rendered-canvas" 
      style={getFontFamilyStyle()}
      className="text-slate-800 w-full h-full flex flex-col justify-between"
    >
      <div className="space-y-6">
        {document.sections.map((section) => {
          if (!section.enabled) return null;

          switch (section.type) {
            case 'header':
              return <div key={section.id} id={`rendered-sec-${section.id}`}>{renderHeader(section)}</div>;
            case 'items':
              return <div key={section.id} id={`rendered-sec-${section.id}`}>{renderItems(section)}</div>;
            case 'totals':
              return <div key={section.id} id={`rendered-sec-${section.id}`}>{renderTotals(section)}</div>;
            case 'footer':
              return <div key={section.id} id={`rendered-sec-${section.id}`}>{renderFooter(section)}</div>;
            default:
              return null;
          }
        })}
      </div>
    </div>
  );
}
