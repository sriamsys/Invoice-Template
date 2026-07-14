/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Eye, 
  EyeOff, 
  Trash2, 
  GripVertical, 
  ArrowUp, 
  ArrowDown, 
  Settings,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Hash,
  Coins,
  Calendar,
  Type,
  ToggleLeft
} from 'lucide-react';
import { ColumnSchema } from '../types';

interface ColumnCardProps {
  column: ColumnSchema;
  sectionId: string;
  index: number;
  totalColumns: number;
  selectedColumnId: string | null;
  
  toggleColumn: (sectionId: string, columnId: string) => void;
  renameColumn: (sectionId: string, columnId: string, name: string) => void;
  reorderColumns: (sectionId: string, start: number, end: number) => void;
  deleteColumnFromSection: (sectionId: string, columnId: string) => void;
  setSelectedColumnId: (id: string | null) => void;
}

export function ColumnCard({
  column,
  sectionId,
  index,
  totalColumns,
  selectedColumnId,
  toggleColumn,
  renameColumn,
  reorderColumns,
  deleteColumnFromSection,
  setSelectedColumnId,
}: ColumnCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [tempName, setTempName] = useState(column.name);

  const handleRenameSubmit = () => {
    if (tempName.trim()) {
      renameColumn(sectionId, column.id, tempName.trim());
    } else {
      setTempName(column.name);
    }
    setIsEditing(false);
  };

  const isSelected = selectedColumnId === column.id;

  const renderDataTypeIcon = () => {
    switch (column.dataType) {
      case 'number':
        return <span title="Number type"><Hash className="w-3.5 h-3.5 text-slate-400" /></span>;
      case 'currency':
        return <span title="Currency type"><Coins className="w-3.5 h-3.5 text-emerald-500" /></span>;
      case 'date':
        return <span title="Date type"><Calendar className="w-3.5 h-3.5 text-sky-500" /></span>;
      case 'boolean':
        return <span title="Boolean type"><ToggleLeft className="w-3.5 h-3.5 text-amber-500" /></span>;
      default:
        return <span title="String/Text type"><Type className="w-3.5 h-3.5 text-slate-400" /></span>;
    }
  };

  const renderAlignIcon = () => {
    switch (column.align) {
      case 'center':
        return <AlignCenter className="w-3 h-3 text-slate-400" />;
      case 'right':
        return <AlignRight className="w-3 h-3 text-slate-400" />;
      default:
        return <AlignLeft className="w-3 h-3 text-slate-400" />;
    }
  };

  return (
    <div
      id={`column-card-${column.id}`}
      onClick={(e) => {
        e.stopPropagation();
        setSelectedColumnId(column.id);
      }}
      className={`group/column flex items-center justify-between px-3 py-2 border rounded-lg bg-white transition-all cursor-pointer select-none ${
        isSelected 
          ? 'border-indigo-500 shadow-sm bg-indigo-50/30 ring-1 ring-indigo-500/20' 
          : 'border-slate-200 hover:border-slate-300'
      } ${!column.enabled ? 'opacity-60 bg-slate-50/20' : ''}`}
    >
      <div className="flex items-center gap-2 flex-grow min-w-0">
        {/* Grip Icon */}
        <div className="text-slate-300 group-hover/column:text-slate-400 transition-colors cursor-grab">
          <GripVertical className="w-3.5 h-3.5" />
        </div>

        {/* Enable column switch */}
        <button
          id={`toggle-col-${column.id}`}
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            toggleColumn(sectionId, column.id);
          }}
          className={`p-1 rounded transition-colors ${
            column.enabled 
              ? 'text-slate-600 hover:bg-slate-100 hover:text-slate-900' 
              : 'text-red-400 hover:bg-red-50 hover:text-red-600'
          }`}
          title={column.enabled ? "Disable Column" : "Enable Column"}
        >
          {column.enabled ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
        </button>

        {/* Column DataType Icon */}
        <div className="shrink-0">
          {renderDataTypeIcon()}
        </div>

        {/* Column Alignment Icon */}
        <div className="shrink-0 hidden sm:block">
          {renderAlignIcon()}
        </div>

        {/* Column Name Input */}
        <div className="flex-grow min-w-0">
          {isEditing ? (
            <input
              id={`rename-col-input-${column.id}`}
              type="text"
              value={tempName}
              onChange={(e) => setTempName(e.target.value)}
              onBlur={handleRenameSubmit}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleRenameSubmit();
                if (e.key === 'Escape') {
                  setTempName(column.name);
                  setIsEditing(false);
                }
              }}
              autoFocus
              onClick={(e) => e.stopPropagation()}
              className="w-full text-xs font-semibold text-slate-800 border-b border-slate-700 bg-transparent focus:outline-none py-0.5"
            />
          ) : (
            <span
              id={`col-name-text-${column.id}`}
              onDoubleClick={(e) => {
                e.stopPropagation();
                setIsEditing(true);
              }}
              className="text-xs font-medium text-slate-700 hover:bg-slate-100 px-1 rounded truncate block"
              title="Double click to rename column"
            >
              {column.name}
            </span>
          )}
        </div>
      </div>

      {/* Column Actions (Reorder/Config/Delete) */}
      <div className="flex items-center gap-1 shrink-0 ml-2" onClick={(e) => e.stopPropagation()}>
        {/* Reorder arrows */}
        <button
          id={`col-move-up-${column.id}`}
          disabled={index === 0}
          onClick={() => reorderColumns(sectionId, index, index - 1)}
          title="Move Column Left/Up"
          className="p-0.5 rounded text-slate-400 hover:bg-slate-100 hover:text-slate-700 disabled:opacity-20 disabled:hover:bg-transparent transition-colors"
        >
          <ArrowUp className="w-3 h-3" />
        </button>
        <button
          id={`col-move-down-${column.id}`}
          disabled={index === totalColumns - 1}
          onClick={() => reorderColumns(sectionId, index, index + 1)}
          title="Move Column Right/Down"
          className="p-0.5 rounded text-slate-400 hover:bg-slate-100 hover:text-slate-700 disabled:opacity-20 disabled:hover:bg-transparent transition-colors"
        >
          <ArrowDown className="w-3 h-3" />
        </button>

        {/* Selection/Config gear */}
        <button
          id={`col-config-btn-${column.id}`}
          onClick={() => setSelectedColumnId(column.id)}
          title="Configure Column Properties"
          className={`p-1 rounded transition-all ${
            isSelected 
              ? 'bg-indigo-600 text-white' 
              : 'text-slate-400 hover:bg-slate-100 hover:text-slate-700'
          }`}
        >
          <Settings className="w-3 h-3" />
        </button>

        {/* Delete button */}
        <button
          id={`col-delete-btn-${column.id}`}
          onClick={() => deleteColumnFromSection(sectionId, column.id)}
          title="Delete Column"
          className="p-1 rounded text-red-400 hover:bg-red-50 hover:text-red-600 transition-colors"
        >
          <Trash2 className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
}
