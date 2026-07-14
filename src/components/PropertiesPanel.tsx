/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  Sliders, 
  Palette, 
  Settings2, 
  Columns, 
  Grid3X3, 
  Info, 
  HelpCircle,
  Eye, 
  EyeOff,
  Trash2,
  Copy,
  Plus,
  Coins,
  ChevronRight
} from 'lucide-react';
import { 
  DocumentSchema, 
  ThemeSettings, 
  PageSettings, 
  SectionSchema, 
  ColumnSchema 
} from '../types';

interface PropertiesPanelProps {
  document: DocumentSchema;
  selectedSectionId: string | null;
  selectedColumnId: string | null;
  
  updateTheme: (theme: Partial<ThemeSettings>) => void;
  updatePage: (page: Partial<PageSettings>) => void;
  updateColumn: (sectionId: string, columnId: string, updates: Partial<ColumnSchema>) => void;
  toggleSection: (id: string) => void;
  renameSection: (id: string, name: string) => void;
  duplicateSection: (id: string) => void;
  deleteSection: (id: string) => void;
  deleteColumnFromSection: (sectionId: string, columnId: string) => void;
  
  setSelectedSectionId: (id: string | null) => void;
  setSelectedColumnId: (id: string | null) => void;
}

export function PropertiesPanel({
  document,
  selectedSectionId,
  selectedColumnId,
  updateTheme,
  updatePage,
  updateColumn,
  toggleSection,
  renameSection,
  duplicateSection,
  deleteSection,
  deleteColumnFromSection,
  setSelectedSectionId,
  setSelectedColumnId,
}: PropertiesPanelProps) {
  // Tabs: 'global' or 'selection'
  const [activeTab, setActiveTab] = useState<'global' | 'selection'>('global');

  // Auto-switch tab to 'selection' if something is selected
  useEffect(() => {
    if (selectedSectionId || selectedColumnId) {
      setActiveTab('selection');
    } else {
      setActiveTab('global');
    }
  }, [selectedSectionId, selectedColumnId]);

  // Find the selected section and column in schema
  let selectedSection: SectionSchema | undefined;
  let selectedColumn: ColumnSchema | undefined;
  let parentSectionOfSelectedColumn: SectionSchema | undefined;

  if (selectedSectionId) {
    selectedSection = document.sections.find(s => s.id === selectedSectionId);
  } else if (selectedColumnId) {
    for (const sec of document.sections) {
      const col = sec.columns.find(c => c.id === selectedColumnId);
      if (col) {
        selectedColumn = col;
        parentSectionOfSelectedColumn = sec;
        break;
      }
    }
  }

  // Pre-configured elegant color palettes for one-click themes
  const colorPalettes = [
    { name: 'Professional Polish', primary: '#4f46e5', secondary: '#818cf8', label: 'Indigo Polish' },
    { name: 'Corporate Blue', primary: '#1e3a8a', secondary: '#2563eb', label: 'Professional Blue' },
    { name: 'Indigo Dream', primary: '#311b92', secondary: '#00e5ff', label: 'Creative Neon' },
    { name: 'Dark Slate', primary: '#0f172a', secondary: '#10b981', label: 'Tech & Green' },
    { name: 'Minimal Charcoal', primary: '#18181b', secondary: '#71717a', label: 'Sleek Zinc' },
  ];

  const fontOptions = [
    { value: 'Inter', label: 'Inter (Sans-serif - Standard)' },
    { value: 'Space Grotesk', label: 'Space Grotesk (Modern display)' },
    { value: 'JetBrains Mono', label: 'JetBrains Mono (Technical code)' },
    { value: 'Playfair Display', label: 'Playfair Display (Elegant Serif)' },
  ];

  return (
    <div id="properties-panel" className="w-full h-full flex flex-col bg-white border-l border-slate-200 select-none">
      {/* Panel Tab Headers */}
      <div className="flex border-b border-slate-200 shrink-0 bg-slate-50/50">
        <button
          id="tab-global-settings"
          type="button"
          onClick={() => setActiveTab('global')}
          className={`flex-1 py-3 text-xs font-bold tracking-wider uppercase border-b-2 text-center transition-all flex items-center justify-center gap-1.5 ${
            activeTab === 'global'
              ? 'border-indigo-600 text-indigo-600 bg-white'
              : 'border-transparent text-slate-400 hover:text-slate-600'
          }`}
        >
          <Palette className="w-3.5 h-3.5" />
          Document Styles
        </button>
        <button
          id="tab-selection-settings"
          type="button"
          onClick={() => {
            if (selectedSectionId || selectedColumnId) {
              setActiveTab('selection');
            }
          }}
          disabled={!selectedSectionId && !selectedColumnId}
          className={`flex-1 py-3 text-xs font-bold tracking-wider uppercase border-b-2 text-center transition-all flex items-center justify-center gap-1.5 ${
            !selectedSectionId && !selectedColumnId ? 'opacity-40 cursor-not-allowed' : ''
          } ${
            activeTab === 'selection'
              ? 'border-indigo-600 text-indigo-600 bg-white'
              : 'border-transparent text-slate-400 hover:text-slate-600'
          }`}
        >
          <Settings2 className="w-3.5 h-3.5" />
          Element Properties
        </button>
      </div>

      {/* Panel Scrollable Content */}
      <div className="flex-grow overflow-y-auto p-4 space-y-6">
        {activeTab === 'global' ? (
          /* ========================================== */
          /* GLOBAL STYLES SECTION                      */
          /* ========================================== */
          <div className="space-y-6 animate-fade-in">
            {/* Quick Themes */}
            <div className="space-y-2">
              <label className="text-[11px] font-bold text-slate-400 tracking-wider uppercase flex items-center gap-1">
                <Palette className="w-3.5 h-3.5" />
                Quick Theme Palettes
              </label>
              <div className="grid grid-cols-2 gap-2">
                {colorPalettes.map((pal) => (
                  <button
                    key={pal.name}
                    id={`palette-${pal.name.replace(/\s+/g, '-').toLowerCase()}`}
                    type="button"
                    onClick={() => {
                      updateTheme({
                        primaryColor: pal.primary,
                        secondaryColor: pal.secondary,
                      });
                    }}
                    className="flex items-center gap-2 p-2 rounded-lg border border-slate-200 hover:bg-slate-50 text-left transition-all"
                  >
                    <div className="flex shrink-0 -space-x-1">
                      <div className="w-3.5 h-3.5 rounded-full border border-white shadow-xs" style={{ backgroundColor: pal.primary }} />
                      <div className="w-3.5 h-3.5 rounded-full border border-white shadow-xs" style={{ backgroundColor: pal.secondary }} />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[11px] font-semibold text-slate-800 truncate leading-none">{pal.name}</p>
                      <p className="text-[9px] text-slate-400 truncate mt-0.5">{pal.label}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Custom Theme Config */}
            <div className="border-t border-slate-100 pt-4 space-y-3">
              <h3 className="text-xs font-semibold text-slate-800">Custom Colors</h3>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label htmlFor="primary-color-picker" className="text-[10px] font-semibold text-slate-500">Primary Branding</label>
                  <div className="flex items-center gap-2">
                    <input
                      id="primary-color-picker"
                      type="color"
                      value={document.theme.primaryColor}
                      onChange={(e) => updateTheme({ primaryColor: e.target.value })}
                      className="w-8 h-8 rounded border border-slate-200 cursor-pointer p-0"
                    />
                    <input
                      type="text"
                      value={document.theme.primaryColor}
                      onChange={(e) => updateTheme({ primaryColor: e.target.value })}
                      className="w-full text-xs font-mono border border-slate-200 rounded-md py-1 px-1.5 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/20"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label htmlFor="secondary-color-picker" className="text-[10px] font-semibold text-slate-500">Accent Highlights</label>
                  <div className="flex items-center gap-2">
                    <input
                      id="secondary-color-picker"
                      type="color"
                      value={document.theme.secondaryColor}
                      onChange={(e) => updateTheme({ secondaryColor: e.target.value })}
                      className="w-8 h-8 rounded border border-slate-200 cursor-pointer p-0"
                    />
                    <input
                      type="text"
                      value={document.theme.secondaryColor}
                      onChange={(e) => updateTheme({ secondaryColor: e.target.value })}
                      className="w-full text-xs font-mono border border-slate-200 rounded-md py-1 px-1.5 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/20"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Typography */}
            <div className="border-t border-slate-100 pt-4 space-y-3">
              <h3 className="text-xs font-semibold text-slate-800">Document Typography</h3>
              <div className="space-y-1.5">
                <label htmlFor="font-family-select" className="text-[10px] font-semibold text-slate-500">Selected Font Family</label>
                <select
                  id="font-family-select"
                  value={document.theme.fontFamily}
                  onChange={(e) => updateTheme({ fontFamily: e.target.value as any })}
                  className="w-full text-xs border border-slate-200 rounded-md p-2 focus:outline-none focus:border-slate-400 bg-white"
                >
                  {fontOptions.map(f => (
                    <option key={f.value} value={f.value}>{f.label}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Table Styling options */}
            <div className="border-t border-slate-100 pt-4 space-y-3">
              <h3 className="text-xs font-semibold text-slate-800">Header & Accent Style</h3>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { value: 'stripe', label: 'Tinted Striped' },
                  { value: 'modern', label: 'Dark Solid' },
                  { value: 'minimal', label: 'Simple Minimal' },
                  { value: 'grid', label: 'Divided Grid' }
                ].map((s) => (
                  <button
                    key={s.value}
                    id={`header-style-${s.value}`}
                    type="button"
                    onClick={() => updateTheme({ headerStyle: s.value as any })}
                    className={`p-2 rounded-lg border text-xs text-center transition-all ${
                      document.theme.headerStyle === s.value
                        ? 'border-indigo-600 bg-indigo-50/30 font-bold text-indigo-700'
                        : 'border-slate-200 text-slate-500 hover:bg-slate-50'
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>

              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between">
                  <label htmlFor="show-borders-toggle" className="text-xs font-semibold text-slate-700 cursor-pointer">Show Table Borders</label>
                  <input
                    id="show-borders-toggle"
                    type="checkbox"
                    checked={document.theme.showBorders}
                    onChange={(e) => updateTheme({ showBorders: e.target.checked })}
                    className="w-4 h-4 text-slate-800 rounded border-slate-300 focus:ring-slate-500"
                  />
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-[11px] font-semibold text-slate-500">
                    <label htmlFor="border-radius-slider">Corner Border Radius</label>
                    <span>{document.theme.borderRadius}px</span>
                  </div>
                  <input
                    id="border-radius-slider"
                    type="range"
                    min="0"
                    max="16"
                    step="2"
                    value={document.theme.borderRadius}
                    onChange={(e) => updateTheme({ borderRadius: Number(e.target.value) })}
                    className="w-full h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                  />
                </div>
              </div>
            </div>

            {/* Layout Settings */}
            <div className="border-t border-slate-100 pt-4 space-y-3">
              <h3 className="text-xs font-semibold text-slate-800">Print Margins & Page Settings</h3>
              
              <div className="space-y-1.5">
                <label htmlFor="margin-select" className="text-[10px] font-semibold text-slate-500">Print Margin Size</label>
                <select
                  id="margin-select"
                  value={document.page.margin}
                  onChange={(e) => updatePage({ margin: Number(e.target.value) })}
                  className="w-full text-xs border border-slate-200 rounded-md p-2 focus:outline-none focus:border-slate-400 bg-white"
                >
                  <option value="0.25">0.25 Inch (Narrow)</option>
                  <option value="0.5">0.50 Inch (Recommended)</option>
                  <option value="0.75">0.75 Inch (Medium)</option>
                  <option value="1">1.00 Inch (Wide)</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label htmlFor="tax-label-input" className="text-[10px] font-semibold text-slate-500">Tax Type Label</label>
                <input
                  id="tax-label-input"
                  type="text"
                  value={document.page.taxLabel}
                  onChange={(e) => updatePage({ taxLabel: e.target.value })}
                  placeholder="VAT (15%), GST, etc."
                  className="w-full text-xs border border-slate-200 rounded-md p-2 focus:outline-none focus:border-slate-400"
                />
              </div>

              <div className="space-y-1.5">
                <label htmlFor="currency-select" className="text-[10px] font-semibold text-slate-500">Currency Code</label>
                <select
                  id="currency-select"
                  value={document.page.currency}
                  onChange={(e) => updatePage({ currency: e.target.value })}
                  className="w-full text-xs border border-slate-200 rounded-md p-2 focus:outline-none focus:border-slate-400 bg-white"
                >
                  <option value="USD">USD ($)</option>
                  <option value="EUR">EUR (€)</option>
                  <option value="GBP">GBP (£)</option>
                  <option value="INR">INR (₹)</option>
                  <option value="CAD">CAD (C$)</option>
                  <option value="AUD">AUD (A$)</option>
                </select>
              </div>

              <div className="flex items-center justify-between pt-1">
                <label htmlFor="show-logo-toggle" className="text-xs font-semibold text-slate-700 cursor-pointer">Display Company Logo</label>
                <input
                  id="show-logo-toggle"
                  type="checkbox"
                  checked={document.page.showLogo}
                  onChange={(e) => updatePage({ showLogo: e.target.checked })}
                  className="w-4 h-4 text-slate-800 rounded border-slate-300 focus:ring-slate-500"
                />
              </div>
            </div>
          </div>
        ) : (
          /* ========================================== */
          /* SELECTION SPECIFIC CONFIGS                 */
          /* ========================================== */
          <div className="space-y-6 animate-fade-in">
            {selectedSection && (
              /* SECTION CHOSEN */
              <div className="space-y-5">
                <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                  <div className="p-1.5 bg-indigo-600 text-white rounded-lg">
                    <Grid3X3 className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Section Settings</h3>
                    <p className="text-sm font-semibold text-slate-800 truncate">{selectedSection.name}</p>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="edit-sec-name-input" className="text-xs font-semibold text-slate-500">Section Display Title</label>
                  <input
                    id="edit-sec-name-input"
                    type="text"
                    value={selectedSection.name}
                    onChange={(e) => renameSection(selectedSection!.id, e.target.value)}
                    className="w-full text-xs border border-slate-200 rounded-md p-2 focus:outline-none focus:border-slate-400"
                  />
                </div>

                <div className="space-y-3 bg-slate-50 p-3 rounded-lg border border-slate-200">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-700">Section Active</span>
                    <button
                      id="toggle-selected-section-btn"
                      type="button"
                      onClick={() => toggleSection(selectedSection!.id)}
                      className={`text-xs font-bold px-2.5 py-1 rounded-md border transition-all ${
                        selectedSection.enabled 
                          ? 'bg-emerald-50 border-emerald-200 text-emerald-700' 
                          : 'bg-red-50 border-red-200 text-red-700'
                      }`}
                    >
                      {selectedSection.enabled ? 'Enabled' : 'Disabled'}
                    </button>
                  </div>
                  <p className="text-[10px] text-slate-500 leading-normal">
                    Disabled sections are visually hidden in the document PDF preview and will not print, but configuration rules are preserved.
                  </p>
                </div>

                <div className="border-t border-slate-100 pt-4 flex gap-2">
                  <button
                    id="dup-selected-section-btn"
                    onClick={() => duplicateSection(selectedSection!.id)}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-semibold border border-slate-200 rounded-lg bg-white text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition-all cursor-pointer"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    Duplicate
                  </button>
                  <button
                    id="del-selected-section-btn"
                    onClick={() => {
                      const id = selectedSection!.id;
                      setSelectedSectionId(null);
                      deleteSection(id);
                    }}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-semibold border border-red-200 rounded-lg bg-red-50 text-red-700 hover:bg-red-100 transition-all cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    Delete Section
                  </button>
                </div>
              </div>
            )}

            {selectedColumn && parentSectionOfSelectedColumn && (
              /* COLUMN CHOSEN */
              <div className="space-y-5">
                <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                  <div className="p-1.5 bg-indigo-600 text-white rounded-lg">
                    <Columns className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Column Settings</h3>
                    <p className="text-sm font-semibold text-slate-800 truncate">{selectedColumn.name}</p>
                  </div>
                </div>

                {/* Display Parent info */}
                <div className="text-[10px] font-medium text-slate-500 bg-slate-50 p-2 rounded border border-slate-200 flex items-center justify-between">
                  <span>Parent Section:</span>
                  <span className="font-bold text-slate-700">{parentSectionOfSelectedColumn.name}</span>
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="edit-col-name-input" className="text-xs font-semibold text-slate-500">Column Label</label>
                  <input
                    id="edit-col-name-input"
                    type="text"
                    value={selectedColumn.name}
                    onChange={(e) => updateColumn(parentSectionOfSelectedColumn!.id, selectedColumn!.id, { name: e.target.value })}
                    className="w-full text-xs border border-slate-200 rounded-md p-2 focus:outline-none focus:border-slate-400"
                  />
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="edit-col-key-input" className="text-xs font-semibold text-slate-500">Data Binding Key</label>
                  <input
                    id="edit-col-key-input"
                    type="text"
                    value={selectedColumn.key}
                    onChange={(e) => updateColumn(parentSectionOfSelectedColumn!.id, selectedColumn!.id, { key: e.target.value })}
                    className="w-full text-xs border border-slate-200 rounded-md p-2 focus:outline-none focus:border-slate-400 font-mono"
                    placeholder="field_key"
                  />
                </div>

                {/* Column Alignment */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-500 block">Text Alignment</label>
                  <div className="grid grid-cols-3 gap-1 bg-slate-50 p-1 rounded-lg border border-slate-200">
                    {(['left', 'center', 'right'] as const).map((align) => (
                      <button
                        key={align}
                        id={`align-btn-${align}`}
                        type="button"
                        onClick={() => updateColumn(parentSectionOfSelectedColumn!.id, selectedColumn!.id, { align })}
                        className={`py-1.5 text-xs font-semibold rounded-md capitalize transition-all ${
                          selectedColumn!.align === align
                            ? 'bg-indigo-600 text-white shadow-sm'
                            : 'text-slate-500 hover:text-slate-700'
                        }`}
                      >
                        {align}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Data Type & Format options */}
                <div className="space-y-1.5">
                  <label htmlFor="edit-col-type-select" className="text-xs font-semibold text-slate-500 block">Data Type</label>
                  <select
                    id="edit-col-type-select"
                    value={selectedColumn.dataType}
                    onChange={(e) => {
                      const dt = e.target.value as any;
                      // Set logical default formats
                      let defaultFormat = '';
                      if (dt === 'currency') defaultFormat = '$0,0.00';
                      if (dt === 'date') defaultFormat = 'YYYY-MM-DD';
                      updateColumn(parentSectionOfSelectedColumn!.id, selectedColumn!.id, { dataType: dt, format: defaultFormat });
                    }}
                    className="w-full text-xs border border-slate-200 rounded-md p-2 focus:outline-none focus:border-slate-400 bg-white"
                  >
                    <option value="string">Text / String</option>
                    <option value="number">Number</option>
                    <option value="currency">Currency</option>
                    <option value="date">Calendar Date</option>
                    <option value="boolean">Boolean Switch</option>
                  </select>
                </div>

                {/* Optional Formatting helper depending on DataType */}
                {selectedColumn.dataType === 'currency' && (
                  <div className="space-y-1.5">
                    <label htmlFor="edit-col-currency-format" className="text-xs font-semibold text-slate-500 block">Currency Display Format</label>
                    <select
                      id="edit-col-currency-format"
                      value={selectedColumn.format || '$0,0.00'}
                      onChange={(e) => updateColumn(parentSectionOfSelectedColumn!.id, selectedColumn!.id, { format: e.target.value })}
                      className="w-full text-xs border border-slate-200 rounded-md p-2 focus:outline-none focus:border-slate-400 bg-white"
                    >
                      <option value="$0,0.00">Standard ($1,234.56)</option>
                      <option value="$0,0">Rounded ($1,235)</option>
                      <option value="code">Currency ISO Code (USD 1,234.56)</option>
                    </select>
                  </div>
                )}

                {selectedColumn.dataType === 'date' && (
                  <div className="space-y-1.5">
                    <label htmlFor="edit-col-date-format" className="text-xs font-semibold text-slate-500 block">Date Display Format</label>
                    <select
                      id="edit-col-date-format"
                      value={selectedColumn.format || 'YYYY-MM-DD'}
                      onChange={(e) => updateColumn(parentSectionOfSelectedColumn!.id, selectedColumn!.id, { format: e.target.value })}
                      className="w-full text-xs border border-slate-200 rounded-md p-2 focus:outline-none focus:border-slate-400 bg-white"
                    >
                      <option value="YYYY-MM-DD">Standard (2026-07-14)</option>
                      <option value="DD/MM/YYYY">UK Style (14/07/2026)</option>
                      <option value="MMMM DD, YYYY">Long Text (July 14, 2026)</option>
                    </select>
                  </div>
                )}

                {/* Sorting and Grouping */}
                <div className="border-t border-slate-100 pt-4 space-y-3">
                  <h4 className="text-xs font-bold text-slate-700">Database & Reporting Config</h4>
                  
                  <div className="flex items-center justify-between">
                    <label htmlFor="col-grouped-toggle" className="text-xs text-slate-600 cursor-pointer">Group By This Column</label>
                    <input
                      id="col-grouped-toggle"
                      type="checkbox"
                      checked={selectedColumn.grouped}
                      onChange={(e) => updateColumn(parentSectionOfSelectedColumn!.id, selectedColumn!.id, { grouped: e.target.checked })}
                      className="w-4 h-4 text-slate-800 rounded border-slate-300 focus:ring-slate-500"
                    />
                  </div>

                  <div className="space-y-1">
                    <label htmlFor="col-sorted-select" className="text-[10px] font-semibold text-slate-500">Sorting Direction</label>
                    <select
                      id="col-sorted-select"
                      value={selectedColumn.sorted}
                      onChange={(e) => updateColumn(parentSectionOfSelectedColumn!.id, selectedColumn!.id, { sorted: e.target.value as any })}
                      className="w-full text-xs border border-slate-200 rounded-md p-1.5 focus:outline-none focus:border-slate-400 bg-white"
                    >
                      <option value="none">No Sorting</option>
                      <option value="asc">Ascending (A-Z, 0-9)</option>
                      <option value="desc">Descending (Z-A, 9-0)</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label htmlFor="col-aggregated-select" className="text-[10px] font-semibold text-slate-500 font-medium">Numeric Aggregation</label>
                    <select
                      id="col-aggregated-select"
                      value={selectedColumn.aggregated}
                      onChange={(e) => updateColumn(parentSectionOfSelectedColumn!.id, selectedColumn!.id, { aggregated: e.target.value as any })}
                      className="w-full text-xs border border-slate-200 rounded-md p-1.5 focus:outline-none focus:border-slate-400 bg-white"
                    >
                      <option value="none">None</option>
                      <option value="sum">Summation (Total sum)</option>
                      <option value="avg">Average (Mean average)</option>
                      <option value="count">Count (Frequency tally)</option>
                    </select>
                  </div>
                </div>

                <div className="border-t border-slate-100 pt-4">
                  <button
                    id="delete-selected-col-btn"
                    onClick={() => {
                      const cid = selectedColumn!.id;
                      const sid = parentSectionOfSelectedColumn!.id;
                      setSelectedColumnId(null);
                      deleteColumnFromSection(sid, cid);
                    }}
                    className="w-full flex items-center justify-center gap-1.5 py-2 text-xs font-semibold border border-red-200 rounded-lg bg-red-50 text-red-700 hover:bg-red-100 transition-all cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    Delete Column
                  </button>
                </div>
              </div>
            )}

            {/* General guidance helper */}
            <div className="bg-sky-50 border border-sky-100 p-3.5 rounded-xl text-xs text-sky-800 leading-relaxed flex gap-2">
              <Info className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold">Pro Tip</p>
                <p className="mt-1">
                  Double-click on any section title or column tag directly in the left workspace panel to trigger inline renaming!
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer selector to clear selections */}
      {(selectedSectionId || selectedColumnId) && (
        <div className="p-3 bg-slate-50 border-t border-slate-200 shrink-0 text-center">
          <button
            id="clear-selection-btn"
            type="button"
            onClick={() => {
              setSelectedSectionId(null);
              setSelectedColumnId(null);
            }}
            className="text-[11px] font-bold text-slate-500 hover:text-slate-800 transition-colors uppercase tracking-wider"
          >
            Clear Selected Highlight
          </button>
        </div>
      )}
    </div>
  );
}
