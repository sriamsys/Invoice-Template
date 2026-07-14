/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  Sliders, 
  Eye, 
  Settings2, 
  HelpCircle, 
  Maximize2, 
  X, 
  CheckCircle, 
  Layers, 
  Laptop, 
  Sparkles,
  Info
} from 'lucide-react';
import { useDesignerState } from '../hooks/useDesignerState';
import { DesignerToolbar } from './DesignerToolbar';
import { ResponsiveLayout } from './ResponsiveLayout';
import { SectionList } from './SectionList';
import { PreviewCanvas } from './PreviewCanvas';
import { PropertiesPanel } from './PropertiesPanel';
import { SectionSchema } from '../types';

export function InvoiceDesigner() {
  const {
    document,
    preview,
    searchTerm,
    selectedSectionId,
    selectedColumnId,
    canUndo,
    canRedo,
    lastSaved,
    isSaving,
    
    loadSchema,
    undo,
    redo,
    updateTheme,
    updatePage,
    toggleSection,
    toggleSectionCollapse,
    renameSection,
    duplicateSection,
    deleteSection,
    reorderSections,
    
    toggleColumn,
    renameColumn,
    updateColumn,
    reorderColumns,
    addColumnToSection,
    deleteColumnFromSection,
    
    updatePreview,
    setSearchTerm,
    setSelectedSectionId,
    setSelectedColumnId,
    resetDocumentToDefault,
  } = useDesignerState();

  // Desktop show/hide right advanced inspector sidebar state
  const [showInspector, setShowInspector] = useState(true);

  // Keyboard Shortcuts Listener for Undo/Redo (Ctrl+Z / Ctrl+Y)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl + Z
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'z') {
        e.preventDefault();
        if (canUndo) undo();
      }
      // Ctrl + Y
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'y') {
        e.preventDefault();
        if (canRedo) redo();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [canUndo, canRedo, undo, redo]);

  // Rename document title helper
  const handleRenameDocument = (newName: string) => {
    updatePage({}); // dummy to record history
    updatePreview({}); // trigger refresh
    // We can directly mutate document name by modifying schema inside hook
    // Let's directly handle this inside useDesignerState by updating page/theme or creating a raw schema setter.
    // Since we want to update the schema name:
    const clonedDoc = JSON.parse(JSON.stringify(document));
    clonedDoc.name = newName;
    // We can trigger this through updatePage or simple direct mutation via a custom updater.
    // Let's create a callback inside hook or we can update document.name.
    // In our hook, we can handle it beautifully:
    // To support renaming doc, we can directly mutate document.name.
    // Let's update using our page properties or direct custom updater:
    // Let's just update the name using custom updater we passed to DesignerToolbar.
    document.name = newName;
  };

  // Add completely custom section block
  const handleAddNewCustomSection = (
    name: string, 
    type: 'header' | 'items' | 'totals' | 'footer' | 'custom'
  ) => {
    const newSectionId = `sec_cust_${Math.random().toString(36).substr(2, 9)}`;
    const newSection: SectionSchema = {
      id: newSectionId,
      name: name,
      type: type,
      enabled: true,
      isCollapsed: false,
      columns: type === 'items' ? [
        { id: `col_c_${Math.random().toString(36).substr(2, 5)}`, name: 'Description', key: 'description', enabled: true, width: '60%', align: 'left', dataType: 'string', grouped: false, sorted: 'none', aggregated: 'none' },
        { id: `col_c_${Math.random().toString(36).substr(2, 5)}`, name: 'Amount', key: 'total', enabled: true, width: '40%', align: 'right', dataType: 'currency', grouped: false, sorted: 'none', aggregated: 'sum' }
      ] : [
        { id: `col_c_${Math.random().toString(36).substr(2, 5)}`, name: 'Custom Field', key: 'custom_field', enabled: true, width: '100%', align: 'left', dataType: 'string', grouped: false, sorted: 'none', aggregated: 'none', placeholder: 'Click edit to write details' }
      ]
    };

    // Inject section to end of sections list
    const updatedSections = [...document.sections, newSection];
    // Record history first
    updateTheme({}); // records history
    document.sections = updatedSections;
    setSelectedSectionId(newSectionId);
    setSelectedColumnId(null);
  };

  return (
    <div id="invoice-designer-root" className="h-screen w-screen flex flex-col overflow-hidden bg-slate-50 font-sans">
      {/* 1. Header Toolbar */}
      <DesignerToolbar
        document={document}
        preview={preview}
        searchTerm={searchTerm}
        canUndo={canUndo}
        canRedo={canRedo}
        isSaving={isSaving}
        lastSaved={lastSaved}
        
        loadSchema={loadSchema}
        undo={undo}
        redo={redo}
        updatePage={updatePage}
        updatePreview={updatePreview}
        setSearchTerm={setSearchTerm}
        resetDocumentToDefault={resetDocumentToDefault}
        renameDocument={handleRenameDocument}
      />

      {/* 2. Main Workspace Layout */}
      <div className="flex-grow flex min-h-0 relative">
        <ResponsiveLayout
          preview={preview}
          updatePreview={updatePreview}
          leftPane={
            /* Left Workspace Pane */
            <SectionList
              document={document}
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
              addNewCustomSection={handleAddNewCustomSection}
            />
          }
          rightPane={
            /* Center Canvas + Inspector layout split */
            <div className="h-full w-full flex min-w-0 relative">
              <div className="flex-grow h-full min-w-0">
                <PreviewCanvas
                  document={document}
                  preview={preview}
                  updatePreview={updatePreview}
                  updatePage={updatePage}
                />
              </div>

              {/* Advanced Inspector Sidebar on Desktop */}
              {showInspector && preview.viewMode !== 'mobile' && (
                <div 
                  id="desktop-inspector-sidebar" 
                  className="w-80 h-full border-l border-slate-200 bg-white shrink-0 shadow-xs animate-slide-in-right"
                >
                  <PropertiesPanel
                    document={document}
                    selectedSectionId={selectedSectionId}
                    selectedColumnId={selectedColumnId}
                    
                    updateTheme={updateTheme}
                    updatePage={updatePage}
                    updateColumn={updateColumn}
                    toggleSection={toggleSection}
                    renameSection={renameSection}
                    duplicateSection={duplicateSection}
                    deleteSection={deleteSection}
                    deleteColumnFromSection={deleteColumnFromSection}
                    
                    setSelectedSectionId={setSelectedSectionId}
                    setSelectedColumnId={setSelectedColumnId}
                  />
                </div>
              )}

              {/* Mini float button to toggle Inspector Sidebar */}
              {preview.viewMode !== 'mobile' && (
                <button
                  id="toggle-inspector-btn"
                  type="button"
                  onClick={() => setShowInspector(!showInspector)}
                  title={showInspector ? "Hide properties panel" : "Show properties panel"}
                  className={`absolute right-4 top-16 p-2 rounded-full shadow-md border z-20 cursor-pointer transition-all ${
                    showInspector 
                      ? 'bg-slate-900 text-white border-slate-900 hover:bg-slate-800' 
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <Settings2 className="w-4 h-4 animate-hover-spin" />
                </button>
              )}
            </div>
          }
        />
      </div>

      {/* Mobile Drawer representation of the Inspector Panel if active */}
      {preview.viewMode === 'mobile' && preview.activeTab === 'preview' && (selectedSectionId || selectedColumnId) && (
        <div className="fixed bottom-14 left-0 right-0 max-h-[60%] bg-white border-t border-slate-300 rounded-t-2xl shadow-2xl overflow-y-auto z-30 p-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2 mb-3">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Advanced Properties</span>
            <button
              onClick={() => {
                setSelectedSectionId(null);
                setSelectedColumnId(null);
              }}
              className="p-1 hover:bg-slate-100 rounded text-slate-500"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <PropertiesPanel
            document={document}
            selectedSectionId={selectedSectionId}
            selectedColumnId={selectedColumnId}
            
            updateTheme={updateTheme}
            updatePage={updatePage}
            updateColumn={updateColumn}
            toggleSection={toggleSection}
            renameSection={renameSection}
            duplicateSection={duplicateSection}
            deleteSection={deleteSection}
            deleteColumnFromSection={deleteColumnFromSection}
            
            setSelectedSectionId={setSelectedSectionId}
            setSelectedColumnId={setSelectedColumnId}
          />
        </div>
      )}
    </div>
  );
}
