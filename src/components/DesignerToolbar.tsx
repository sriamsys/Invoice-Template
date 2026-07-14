/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { 
  Undo2, 
  Redo2, 
  Search, 
  Maximize2, 
  RotateCcw, 
  CheckCircle, 
  Loader2, 
  FileText, 
  SlidersHorizontal,
  PlusCircle,
  Sparkles
} from 'lucide-react';
import { DocumentType, DocumentSchema, PreviewState } from '../types';

interface DesignerToolbarProps {
  document: DocumentSchema;
  preview: PreviewState;
  searchTerm: string;
  canUndo: boolean;
  canRedo: boolean;
  isSaving: boolean;
  lastSaved: Date | null;
  
  loadSchema: (type: DocumentType) => void;
  undo: () => void;
  redo: () => void;
  updatePage: (updates: any) => void;
  updatePreview: (updates: Partial<PreviewState>) => void;
  setSearchTerm: (term: string) => void;
  resetDocumentToDefault: () => void;
  renameDocument: (name: string) => void;
}

export function DesignerToolbar({
  document,
  preview,
  searchTerm,
  canUndo,
  canRedo,
  isSaving,
  lastSaved,
  loadSchema,
  undo,
  redo,
  updatePage,
  updatePreview,
  setSearchTerm,
  resetDocumentToDefault,
  renameDocument,
}: DesignerToolbarProps) {

  const documentTypes: { value: DocumentType; label: string }[] = [
    { value: 'invoice', label: 'Invoice' },
    { value: 'credit_note', label: 'Credit Note' },
    { value: 'purchase_order', label: 'Purchase Order' },
    { value: 'quote', label: 'Quote / Proposal' },
    { value: 'timesheet', label: 'Timesheet' },
    { value: 'expense_report', label: 'Expense Report' },
  ];

  const formatLastSaved = () => {
    if (!lastSaved) return 'All changes saved locally';
    const hours = lastSaved.getHours().toString().padStart(2, '0');
    const minutes = lastSaved.getMinutes().toString().padStart(2, '0');
    const seconds = lastSaved.getSeconds().toString().padStart(2, '0');
    return `Saved at ${hours}:${minutes}:${seconds}`;
  };

  return (
    <div id="designer-toolbar" className="flex flex-col md:flex-row items-stretch md:items-center justify-between border-b border-slate-200 bg-white px-4 py-3 gap-3 z-10 select-none">
      {/* Left side: Selector and Title */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200">
          <FileText className="w-4 h-4 text-slate-500" />
          <select
            id="doc-type-selector"
            className="bg-transparent text-sm font-semibold text-slate-800 focus:outline-none cursor-pointer"
            value={document.type}
            onChange={(e) => loadSchema(e.target.value as DocumentType)}
          >
            {documentTypes.map((t) => (
              <option key={t.value} value={t.value}>
                {t.label} Schema
              </option>
            ))}
          </select>
        </div>

        <div className="h-6 w-[1px] bg-slate-200 hidden sm:block" />

        <input
          id="template-name-input"
          type="text"
          value={document.name}
          onChange={(e) => renameDocument(e.target.value)}
          placeholder="Unnamed Template"
          className="text-base font-semibold text-slate-900 focus:outline-none focus:border-slate-300 border-b border-transparent py-0.5 px-1 max-w-[200px] sm:max-w-xs transition-all"
        />

        {/* Save indicator */}
        <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium">
          {isSaving ? (
            <>
              <Loader2 className="w-3.5 h-3.5 animate-spin text-sky-500" />
              <span>Saving...</span>
            </>
          ) : (
            <>
              <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />
              <span>{formatLastSaved()}</span>
            </>
          )}
        </div>
      </div>

      {/* Middle: Undo / Redo / Search */}
      <div className="flex items-center gap-2 flex-grow md:flex-grow-0 justify-between md:justify-center">
        <div className="flex items-center gap-1 bg-slate-50 p-1 rounded-lg border border-slate-200">
          <button
            id="undo-btn"
            onClick={undo}
            disabled={!canUndo}
            title="Undo (Ctrl+Z)"
            className="p-1.5 rounded-md hover:bg-white text-slate-600 disabled:text-slate-300 disabled:hover:bg-transparent transition-all"
          >
            <Undo2 className="w-4 h-4" />
          </button>
          <button
            id="redo-btn"
            onClick={redo}
            disabled={!canRedo}
            title="Redo (Ctrl+Y)"
            className="p-1.5 rounded-md hover:bg-white text-slate-600 disabled:text-slate-300 disabled:hover:bg-transparent transition-all"
          >
            <Redo2 className="w-4 h-4" />
          </button>
        </div>

        {/* Search */}
        <div className="relative flex-grow md:w-64 max-w-sm ml-2">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            id="search-config-input"
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search sections or columns..."
            className="w-full bg-slate-50 hover:bg-slate-100/70 focus:bg-white text-xs pl-8 pr-3 py-2 rounded-lg border border-slate-200 focus:border-slate-300 focus:ring-1 focus:ring-slate-300/40 focus:outline-none transition-all placeholder:text-slate-400"
          />
        </div>
      </div>

      {/* Right side: Zoom / Fit & Reset */}
      <div className="flex items-center gap-2 justify-end">
        {/* Paper Size selector */}
        <div className="flex items-center gap-1 text-xs bg-slate-50 p-1 rounded-lg border border-slate-200">
          <button
            id="paper-letter-btn"
            onClick={() => updatePage({ paperSize: 'Letter' })}
            className={`px-2.5 py-1 rounded-md text-xs font-semibold transition-all ${
              document.page.paperSize === 'Letter' 
                ? 'bg-white text-slate-900 shadow-xs border border-slate-200' 
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            Letter
          </button>
          <button
            id="paper-a4-btn"
            onClick={() => updatePage({ paperSize: 'A4' })}
            className={`px-2.5 py-1 rounded-md text-xs font-semibold transition-all ${
              document.page.paperSize === 'A4' 
                ? 'bg-white text-slate-900 shadow-xs border border-slate-200' 
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            A4
          </button>
        </div>

        {/* Zoom adjustment */}
        <div className="flex items-center gap-1.5 text-xs bg-slate-50 px-2 py-1.5 rounded-lg border border-slate-200">
          <span className="text-slate-500 font-medium">Zoom</span>
          <select
            id="zoom-selector"
            className="bg-transparent font-semibold text-slate-800 focus:outline-none cursor-pointer"
            value={preview.zoomMode === 'fit' ? 'fit' : preview.zoom}
            onChange={(e) => {
              const val = e.target.value;
              if (val === 'fit') {
                updatePreview({ zoomMode: 'fit' });
              } else {
                updatePreview({ zoom: Number(val), zoomMode: 'custom' });
              }
            }}
          >
            <option value="50">50%</option>
            <option value="75">75%</option>
            <option value="100">100%</option>
            <option value="125">125%</option>
            <option value="150">150%</option>
            <option value="fit">Fit Width</option>
          </select>
        </div>

        {/* Reset button */}
        <button
          id="reset-template-btn"
          onClick={resetDocumentToDefault}
          title="Reset to Template Defaults"
          className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold text-slate-600 bg-white hover:bg-slate-50 border border-slate-200 rounded-lg hover:text-slate-900 transition-all cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Reset</span>
        </button>
      </div>
    </div>
  );
}
