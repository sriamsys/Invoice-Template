/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { PlusCircle, Sliders, ListFilter, HelpCircle, FilePlus } from 'lucide-react';
import { SectionSchema, DocumentSchema } from '../types';
import { SectionCard } from './SectionCard';

interface SectionListProps {
  document: DocumentSchema;
  searchTerm: string;
  selectedSectionId: string | null;
  selectedColumnId: string | null;
  
  toggleSection: (id: string) => void;
  toggleSectionCollapse: (id: string) => void;
  renameSection: (id: string, name: string) => void;
  duplicateSection: (id: string) => void;
  deleteSection: (id: string) => void;
  reorderSections: (start: number, end: number) => void;
  
  toggleColumn: (sectionId: string, columnId: string) => void;
  renameColumn: (sectionId: string, columnId: string, name: string) => void;
  reorderColumns: (sectionId: string, start: number, end: number) => void;
  addColumnToSection: (sectionId: string, columnData: any) => void;
  deleteColumnFromSection: (sectionId: string, columnId: string) => void;
  setSelectedSectionId: (id: string | null) => void;
  setSelectedColumnId: (id: string | null) => void;

  // Handler to inject a completely custom section to show-off extensible architecture
  addNewCustomSection: (name: string, type: 'header' | 'items' | 'totals' | 'footer' | 'custom') => void;
}

export function SectionList({
  document,
  searchTerm,
  selectedSectionId,
  selectedColumnId,
  toggleSection,
  toggleSectionCollapse,
  renameSection,
  duplicateSection,
  deleteSection,
  reorderSections,
  toggleColumn,
  renameColumn,
  reorderColumns,
  addColumnToSection,
  deleteColumnFromSection,
  setSelectedSectionId,
  setSelectedColumnId,
  addNewCustomSection,
}: SectionListProps) {
  const [draggedSectionIndex, setDraggedSectionIndex] = useState<number | null>(null);
  const [showAddSectionModal, setShowAddSectionModal] = useState(false);
  const [newSectionName, setNewSectionName] = useState('');
  const [newSectionType, setNewSectionType] = useState<'header' | 'items' | 'totals' | 'footer' | 'custom'>('custom');

  // Drag and Drop Section Handlers
  const handleDragStartSection = (e: React.DragEvent, index: number) => {
    setDraggedSectionIndex(index);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOverSection = (e: React.DragEvent, index: number) => {
    e.preventDefault();
  };

  const handleDropSection = (e: React.DragEvent, targetIndex: number) => {
    e.preventDefault();
    if (draggedSectionIndex !== null && draggedSectionIndex !== targetIndex) {
      reorderSections(draggedSectionIndex, targetIndex);
    }
    setDraggedSectionIndex(null);
  };

  const handleCreateSectionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newSectionName.trim()) {
      addNewCustomSection(newSectionName.trim(), newSectionType);
      setNewSectionName('');
      setShowAddSectionModal(false);
    }
  };

  const visibleSectionsCount = document.sections.filter(s => {
    if (!searchTerm) return true;
    const isSectionMatch = s.name.toLowerCase().includes(searchTerm.toLowerCase());
    const isColumnMatch = s.columns.some(col => 
      col.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      col.key.toLowerCase().includes(searchTerm.toLowerCase())
    );
    return isSectionMatch || isColumnMatch;
  }).length;

  return (
    <div id="section-list-container" className="p-4 flex flex-col gap-4 select-none">
      {/* Title block */}
      <div className="flex items-center justify-between pb-2 border-b border-slate-200">
        <div className="flex items-center gap-2">
          <Sliders className="w-4 h-4 text-slate-700" />
          <h2 className="text-sm font-bold text-slate-800">Workspace Outline</h2>
        </div>
        <span className="text-xs font-semibold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
          {visibleSectionsCount} of {document.sections.length} Sections
        </span>
      </div>

      {/* Actual list of sections */}
      <div className="space-y-1">
        {document.sections.map((section, idx) => (
          <SectionCard
            key={section.id}
            section={section}
            index={idx}
            totalSections={document.sections.length}
            searchTerm={searchTerm}
            selectedSectionId={selectedSectionId}
            selectedColumnId={selectedColumnId}
            
            toggleSection={toggleSection}
            toggleSectionCollapse={toggleSectionCollapse}
            renameSection={renameSection}
            duplicateSection={duplicateSection}
            deleteSection={deleteSection}
            reorderSections={reorderSections}
            
            toggleColumn={toggleColumn}
            renameColumn={renameColumn}
            reorderColumns={reorderColumns}
            addColumnToSection={addColumnToSection}
            deleteColumnFromSection={deleteColumnFromSection}
            setSelectedSectionId={setSelectedSectionId}
            setSelectedColumnId={setSelectedColumnId}
            
            onDragStartSection={handleDragStartSection}
            onDragOverSection={handleDragOverSection}
            onDropSection={handleDropSection}
          />
        ))}

        {visibleSectionsCount === 0 && (
          <div className="text-center py-12 text-slate-400 text-xs">
            No sections or columns match your current search criteria. Clear filter or try another keyword.
          </div>
        )}
      </div>

      {/* Button to show modular section generator */}
      <div className="pt-2 border-t border-slate-100">
        {!showAddSectionModal ? (
          <button
            id="open-add-section-modal-btn"
            type="button"
            onClick={() => setShowAddSectionModal(true)}
            className="w-full flex items-center justify-center gap-2 py-3 px-4 border border-dashed border-slate-300 hover:border-indigo-500 hover:bg-indigo-50/20 text-slate-600 hover:text-indigo-700 rounded-xl text-xs font-bold transition-all cursor-pointer"
          >
            <PlusCircle className="w-4 h-4 text-slate-400 group-hover:text-indigo-500" />
            Add Custom Section Block
          </button>
        ) : (
          <form 
            onSubmit={handleCreateSectionSubmit}
            id="add-custom-section-form"
            className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-4 animate-fade-in"
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <h4 className="text-xs font-bold text-slate-700 uppercase flex items-center gap-1.5">
                <FilePlus className="w-4 h-4 text-indigo-500" />
                New Document Block
              </h4>
              <button
                type="button"
                onClick={() => setShowAddSectionModal(false)}
                className="text-[10px] text-slate-400 hover:text-slate-600 font-bold"
              >
                Cancel
              </button>
            </div>

            <div className="space-y-1.5">
              <label htmlFor="new-section-name" className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Section Name
              </label>
              <input
                id="new-section-name"
                type="text"
                required
                value={newSectionName}
                onChange={(e) => setNewSectionName(e.target.value)}
                placeholder="e.g. Terms & Acceptances"
                className="w-full text-xs border border-slate-200 rounded-md p-2 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/20"
              />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="new-section-type" className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Section Category/Type
              </label>
              <select
                id="new-section-type"
                value={newSectionType}
                onChange={(e) => setNewSectionType(e.target.value as any)}
                className="w-full text-xs border border-slate-200 rounded-md p-2 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/20 bg-white"
              >
                <option value="custom">Custom (Fields Block)</option>
                <option value="items">Items Table Block</option>
                <option value="header">Header & Contact Details</option>
                <option value="totals">Totals Summary</option>
                <option value="footer">Footer details</option>
              </select>
            </div>

            <button
              id="submit-create-section-btn"
              type="submit"
              className="w-full py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all text-xs font-semibold shadow-sm cursor-pointer"
            >
              Insert Custom Section
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
