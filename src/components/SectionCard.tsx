/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Eye, 
  EyeOff, 
  ChevronDown, 
  ChevronUp, 
  Copy, 
  Trash2, 
  GripVertical, 
  ArrowUp, 
  ArrowDown, 
  Plus, 
  Settings,
  HelpCircle,
  FileSpreadsheet
} from 'lucide-react';
import { SectionSchema, ColumnSchema } from '../types';
import { ColumnCard } from './ColumnCard';

interface SectionCardProps {
  section: SectionSchema;
  index: number;
  totalSections: number;
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

  // Drag and drop event handlers
  onDragStartSection: (e: React.DragEvent, index: number) => void;
  onDragOverSection: (e: React.DragEvent, index: number) => void;
  onDropSection: (e: React.DragEvent, index: number) => void;
}

export function SectionCard({
  section,
  index,
  totalSections,
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
  onDragStartSection,
  onDragOverSection,
  onDropSection,
}: SectionCardProps) {
  const [isEditingName, setIsEditingName] = useState(false);
  const [tempName, setTempName] = useState(section.name);

  // Check if search matches section or its columns
  const isSectionMatch = section.name.toLowerCase().includes(searchTerm.toLowerCase());
  const matchingColumns = section.columns.filter(col => 
    col.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    col.key.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const hasMatchingColumns = matchingColumns.length > 0;
  
  // If search is active and nothing matches, don't render this card
  if (searchTerm && !isSectionMatch && !hasMatchingColumns) {
    return null;
  }

  const handleRenameSubmit = () => {
    if (tempName.trim()) {
      renameSection(section.id, tempName.trim());
    } else {
      setTempName(section.name);
    }
    setIsEditingName(false);
  };

  const handleAddNewColumn = () => {
    // Generate a reasonable default column depending on section type
    const defaultColumn: Omit<ColumnSchema, 'id'> = {
      name: 'Custom Column',
      key: `custom_field_${Math.random().toString(36).substr(2, 5)}`,
      enabled: true,
      width: 'auto',
      align: 'left',
      dataType: 'string',
      grouped: false,
      sorted: 'none',
      aggregated: 'none',
      placeholder: 'Enter detail'
    };
    addColumnToSection(section.id, defaultColumn);
  };

  const isSelected = selectedSectionId === section.id;

  return (
    <div
      id={`section-card-${section.id}`}
      draggable
      onDragStart={(e) => onDragStartSection(e, index)}
      onDragOver={(e) => onDragOverSection(e, index)}
      onDrop={(e) => onDropSection(e, index)}
      onClick={(e) => {
        // Select section when clicking card (if not already selecting a column)
        e.stopPropagation();
        setSelectedSectionId(section.id);
      }}
      className={`group/section border rounded-xl bg-white mb-4 transition-all duration-200 overflow-hidden ${
        isSelected 
          ? 'border-2 border-indigo-500 shadow-md ring-1 ring-indigo-500/15' 
          : 'border-slate-200 shadow-sm hover:border-slate-300'
      } ${!section.enabled ? 'opacity-60 bg-slate-50/50' : ''}`}
    >
      {/* Section Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 bg-slate-50/30">
        <div className="flex items-center gap-2.5 flex-grow min-w-0">
          {/* Drag Handle */}
          <div 
            className="cursor-grab active:cursor-grabbing p-1 hover:bg-slate-100 rounded text-slate-400 group-hover/section:text-slate-600 transition-colors"
            title="Drag to reorder"
          >
            <GripVertical className="w-4 h-4" />
          </div>

          {/* Eye visibility toggler */}
          <button
            id={`toggle-sec-${section.id}`}
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              toggleSection(section.id);
            }}
            title={section.enabled ? "Disable section" : "Enable section"}
            className={`p-1.5 rounded-lg border transition-all ${
              section.enabled 
                ? 'bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200' 
                : 'bg-red-50 border-red-200 text-red-500 hover:bg-red-100'
            }`}
          >
            {section.enabled ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
          </button>

          {/* Section Name Input */}
          <div className="flex-grow min-w-0">
            {isEditingName ? (
              <input
                id={`rename-sec-input-${section.id}`}
                type="text"
                value={tempName}
                onChange={(e) => setTempName(e.target.value)}
                onBlur={handleRenameSubmit}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleRenameSubmit();
                  if (e.key === 'Escape') {
                    setTempName(section.name);
                    setIsEditingName(false);
                  }
                }}
                autoFocus
                onClick={(e) => e.stopPropagation()}
                className="w-full text-sm font-semibold text-slate-900 border-b border-slate-800 focus:outline-none bg-transparent py-0.5"
              />
            ) : (
              <div className="flex items-center gap-1.5">
                <span
                  id={`sec-name-text-${section.id}`}
                  onDoubleClick={(e) => {
                    e.stopPropagation();
                    setIsEditingName(true);
                  }}
                  className="text-sm font-semibold text-slate-800 cursor-pointer hover:bg-slate-100/70 px-1 rounded truncate block"
                  title="Double click to rename"
                >
                  {section.name}
                </span>
                <span className={`text-[10px] font-bold tracking-wider uppercase px-1.5 py-0.5 rounded shrink-0 ${
                  isSelected ? 'bg-indigo-100 text-indigo-700' : 'bg-slate-100 text-slate-400'
                }`}>
                  {section.type}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-1 shrink-0 ml-2" onClick={(e) => e.stopPropagation()}>
          {/* Quick arrow keys for accessibility reordering */}
          <button
            id={`sec-move-up-${section.id}`}
            disabled={index === 0}
            onClick={() => reorderSections(index, index - 1)}
            title="Move Section Up"
            className="p-1 rounded text-slate-400 hover:bg-slate-100 hover:text-slate-800 disabled:opacity-30 disabled:hover:bg-transparent"
          >
            <ArrowUp className="w-3.5 h-3.5" />
          </button>
          <button
            id={`sec-move-down-${section.id}`}
            disabled={index === totalSections - 1}
            onClick={() => reorderSections(index, index + 1)}
            title="Move Section Down"
            className="p-1 rounded text-slate-400 hover:bg-slate-100 hover:text-slate-800 disabled:opacity-30 disabled:hover:bg-transparent"
          >
            <ArrowDown className="w-3.5 h-3.5" />
          </button>

          <div className="w-[1px] h-4 bg-slate-200 mx-1" />

          {/* Duplicate section */}
          <button
            id={`sec-dup-${section.id}`}
            onClick={() => duplicateSection(section.id)}
            title="Duplicate Section"
            className="p-1 rounded text-slate-500 hover:bg-slate-100 hover:text-slate-800 transition-colors"
          >
            <Copy className="w-3.5 h-3.5" />
          </button>

          {/* Delete section */}
          <button
            id={`sec-del-${section.id}`}
            onClick={() => deleteSection(section.id)}
            title="Delete Section"
            className="p-1 rounded text-red-500 hover:bg-red-50 hover:text-red-700 transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>

          <div className="w-[1px] h-4 bg-slate-200 mx-1" />

          {/* Expand/Collapse Chevron */}
          <button
            id={`sec-expand-toggle-${section.id}`}
            onClick={() => toggleSectionCollapse(section.id)}
            title={section.isCollapsed ? "Expand columns" : "Collapse columns"}
            className="p-1 rounded text-slate-500 hover:bg-slate-100 hover:text-slate-800 transition-all"
          >
            {section.isCollapsed ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Columns List & Settings - Visible when Expanded */}
      {!section.isCollapsed && (
        <div className="p-4 bg-slate-50/20">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-[11px] font-bold text-slate-400 tracking-wider uppercase flex items-center gap-1">
              <FileSpreadsheet className="w-3.5 h-3.5 text-slate-400" />
              Configurable Columns ({section.columns.length})
            </h4>
            
            {section.enabled && (
              <button
                id={`add-column-btn-${section.id}`}
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleAddNewColumn();
                }}
                className="flex items-center gap-1 px-2 py-1 text-xs font-semibold text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-md border border-slate-200 bg-white transition-all cursor-pointer"
              >
                <Plus className="w-3 h-3 text-slate-500" />
                Add Column
              </button>
            )}
          </div>

          {section.columns.length === 0 ? (
            <div className="text-center py-6 text-slate-400 text-xs border border-dashed border-slate-200 rounded-lg bg-white">
              No columns in this section. Click 'Add Column' to start visual configuration.
            </div>
          ) : (
            <div className="space-y-2">
              {section.columns.map((column, colIdx) => {
                const isColumnMatch = column.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                                     column.key.toLowerCase().includes(searchTerm.toLowerCase());
                
                if (searchTerm && !isColumnMatch) return null;

                return (
                  <ColumnCard
                    key={column.id}
                    column={column}
                    sectionId={section.id}
                    index={colIdx}
                    totalColumns={section.columns.length}
                    selectedColumnId={selectedColumnId}
                    
                    toggleColumn={toggleColumn}
                    renameColumn={renameColumn}
                    reorderColumns={reorderColumns}
                    deleteColumnFromSection={deleteColumnFromSection}
                    setSelectedColumnId={setSelectedColumnId}
                  />
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
