/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useRef, useCallback } from 'react';
import { 
  DocumentSchema, 
  DocumentType, 
  DesignerState, 
  ThemeSettings, 
  PageSettings, 
  SectionSchema, 
  ColumnSchema,
  PreviewState
} from '../types';
import { DEFAULT_SCHEMAS } from '../data/defaultSchemas';

const LOCAL_STORAGE_KEY = 'invoice_template_designer_v1';

export function useDesignerState() {
  // Main designer state
  const [state, setState] = useState<DesignerState>(() => {
    // Initial setup
    const defaultDocType: DocumentType = 'invoice';
    const defaultDoc = DEFAULT_SCHEMAS[defaultDocType];
    
    return {
      document: JSON.parse(JSON.stringify(defaultDoc)),
      preview: {
        zoom: 100,
        zoomMode: 'actual',
        viewMode: 'desktop',
        activeTab: 'config',
      },
      searchTerm: '',
      selectedSectionId: null,
      selectedColumnId: null,
    };
  });

  // Save/Restore from LocalStorage if available
  useEffect(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.document) {
          setState(prev => ({
            ...prev,
            document: parsed.document,
            preview: {
              ...prev.preview,
              ...parsed.preview,
            }
          }));
        }
      }
    } catch (e) {
      console.warn('Could not restore state from local storage', e);
    }
  }, []);

  // History state for Undo / Redo
  const historyRef = useRef<DocumentSchema[]>([]);
  const futureRef = useRef<DocumentSchema[]>([]);
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Helper to push to history and reset future
  const recordHistory = useCallback((currentDoc: DocumentSchema) => {
    const cloned = JSON.parse(JSON.stringify(currentDoc));
    historyRef.current.push(cloned);
    futureRef.current = []; // Clear redo stack on new action
    setCanUndo(historyRef.current.length > 0);
    setCanRedo(false);
  }, []);

  // Autosave action trigger with visual indicator
  useEffect(() => {
    setIsSaving(true);
    const handler = setTimeout(() => {
      try {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify({
          document: state.document,
          preview: state.preview,
        }));
        setLastSaved(new Date());
      } catch (e) {
        console.error('Failed to autosave state', e);
      } finally {
        setIsSaving(false);
      }
    }, 1000);

    return () => clearTimeout(handler);
  }, [state.document, state.preview]);

  // Load a preset schema
  const loadSchema = useCallback((type: DocumentType) => {
    recordHistory(state.document);
    const newDoc = DEFAULT_SCHEMAS[type];
    setState(prev => ({
      ...prev,
      document: JSON.parse(JSON.stringify(newDoc)),
      selectedSectionId: null,
      selectedColumnId: null,
    }));
  }, [state.document, recordHistory]);

  // Update complete schema directly (for undo/redo/raw edit)
  const setDocumentSchema = useCallback((newDoc: DocumentSchema) => {
    setState(prev => ({
      ...prev,
      document: newDoc,
    }));
  }, []);

  // Undo implementation
  const undo = useCallback(() => {
    if (historyRef.current.length === 0) return;
    
    const prevDoc = historyRef.current.pop()!;
    futureRef.current.push(JSON.parse(JSON.stringify(state.document)));
    
    setDocumentSchema(prevDoc);
    setCanUndo(historyRef.current.length > 0);
    setCanRedo(true);
  }, [state.document, setDocumentSchema]);

  // Redo implementation
  const redo = useCallback(() => {
    if (futureRef.current.length === 0) return;
    
    const nextDoc = futureRef.current.pop()!;
    historyRef.current.push(JSON.parse(JSON.stringify(state.document)));
    
    setDocumentSchema(nextDoc);
    setCanUndo(true);
    setCanRedo(futureRef.current.length > 0);
  }, [state.document, setDocumentSchema]);

  // Theme updates
  const updateTheme = useCallback((themeUpdates: Partial<ThemeSettings>) => {
    recordHistory(state.document);
    setState(prev => ({
      ...prev,
      document: {
        ...prev.document,
        theme: {
          ...prev.document.theme,
          ...themeUpdates,
        },
      },
    }));
  }, [state.document, recordHistory]);

  // Page updates
  const updatePage = useCallback((pageUpdates: Partial<PageSettings>) => {
    recordHistory(state.document);
    setState(prev => ({
      ...prev,
      document: {
        ...prev.document,
        page: {
          ...prev.document.page,
          ...pageUpdates,
        },
      },
    }));
  }, [state.document, recordHistory]);

  // Section CRUD
  const toggleSection = useCallback((sectionId: string) => {
    recordHistory(state.document);
    setState(prev => {
      const updatedSections = prev.document.sections.map(s => {
        if (s.id === sectionId) return { ...s, enabled: !s.enabled };
        return s;
      });
      return {
        ...prev,
        document: { ...prev.document, sections: updatedSections },
      };
    });
  }, [state.document, recordHistory]);

  const toggleSectionCollapse = useCallback((sectionId: string) => {
    setState(prev => {
      const updatedSections = prev.document.sections.map(s => {
        if (s.id === sectionId) return { ...s, isCollapsed: !s.isCollapsed };
        return s;
      });
      return {
        ...prev,
        document: { ...prev.document, sections: updatedSections },
      };
    });
  }, []);

  const renameSection = useCallback((sectionId: string, newName: string) => {
    recordHistory(state.document);
    setState(prev => {
      const updatedSections = prev.document.sections.map(s => {
        if (s.id === sectionId) return { ...s, name: newName };
        return s;
      });
      return {
        ...prev,
        document: { ...prev.document, sections: updatedSections },
      };
    });
  }, [state.document, recordHistory]);

  const duplicateSection = useCallback((sectionId: string) => {
    recordHistory(state.document);
    setState(prev => {
      const targetSec = prev.document.sections.find(s => s.id === sectionId);
      if (!targetSec) return prev;
      
      const newSecId = `sec_dup_${Math.random().toString(36).substr(2, 9)}`;
      const duplicatedSec: SectionSchema = {
        ...JSON.parse(JSON.stringify(targetSec)),
        id: newSecId,
        name: `${targetSec.name} (Copy)`,
        columns: targetSec.columns.map(col => ({
          ...col,
          id: `col_dup_${Math.random().toString(36).substr(2, 9)}`,
        })),
      };

      const index = prev.document.sections.findIndex(s => s.id === sectionId);
      const updatedSections = [...prev.document.sections];
      updatedSections.splice(index + 1, 0, duplicatedSec);

      return {
        ...prev,
        document: { ...prev.document, sections: updatedSections },
        selectedSectionId: newSecId,
        selectedColumnId: null,
      };
    });
  }, [state.document, recordHistory]);

  const deleteSection = useCallback((sectionId: string) => {
    recordHistory(state.document);
    setState(prev => {
      const updatedSections = prev.document.sections.filter(s => s.id !== sectionId);
      return {
        ...prev,
        document: { ...prev.document, sections: updatedSections },
        selectedSectionId: prev.selectedSectionId === sectionId ? null : prev.selectedSectionId,
        selectedColumnId: null,
      };
    });
  }, [state.document, recordHistory]);

  const reorderSections = useCallback((startIndex: number, endIndex: number) => {
    if (startIndex < 0 || endIndex < 0 || startIndex >= state.document.sections.length || endIndex >= state.document.sections.length) return;
    recordHistory(state.document);
    setState(prev => {
      const updatedSections = [...prev.document.sections];
      const [removed] = updatedSections.splice(startIndex, 1);
      updatedSections.splice(endIndex, 0, removed);
      return {
        ...prev,
        document: { ...prev.document, sections: updatedSections },
      };
    });
  }, [state.document, recordHistory]);

  // Column Actions
  const toggleColumn = useCallback((sectionId: string, columnId: string) => {
    recordHistory(state.document);
    setState(prev => {
      const updatedSections = prev.document.sections.map(s => {
        if (s.id !== sectionId) return s;
        return {
          ...s,
          columns: s.columns.map(col => {
            if (col.id === columnId) return { ...col, enabled: !col.enabled };
            return col;
          }),
        };
      });
      return {
        ...prev,
        document: { ...prev.document, sections: updatedSections },
      };
    });
  }, [state.document, recordHistory]);

  const renameColumn = useCallback((sectionId: string, columnId: string, newName: string) => {
    recordHistory(state.document);
    setState(prev => {
      const updatedSections = prev.document.sections.map(s => {
        if (s.id !== sectionId) return s;
        return {
          ...s,
          columns: s.columns.map(col => {
            if (col.id === columnId) return { ...col, name: newName };
            return col;
          }),
        };
      });
      return {
        ...prev,
        document: { ...prev.document, sections: updatedSections },
      };
    });
  }, [state.document, recordHistory]);

  const updateColumn = useCallback((sectionId: string, columnId: string, updates: Partial<ColumnSchema>) => {
    recordHistory(state.document);
    setState(prev => {
      const updatedSections = prev.document.sections.map(s => {
        if (s.id !== sectionId) return s;
        return {
          ...s,
          columns: s.columns.map(col => {
            if (col.id === columnId) return { ...col, ...updates };
            return col;
          }),
        };
      });
      return {
        ...prev,
        document: { ...prev.document, sections: updatedSections },
      };
    });
  }, [state.document, recordHistory]);

  const reorderColumns = useCallback((sectionId: string, startIndex: number, endIndex: number) => {
    recordHistory(state.document);
    setState(prev => {
      const updatedSections = prev.document.sections.map(s => {
        if (s.id !== sectionId) return s;
        
        const updatedColumns = [...s.columns];
        if (startIndex < 0 || endIndex < 0 || startIndex >= updatedColumns.length || endIndex >= updatedColumns.length) return s;
        
        const [removed] = updatedColumns.splice(startIndex, 1);
        updatedColumns.splice(endIndex, 0, removed);
        
        return {
          ...s,
          columns: updatedColumns,
        };
      });
      return {
        ...prev,
        document: { ...prev.document, sections: updatedSections },
      };
    });
  }, [state.document, recordHistory]);

  const addColumnToSection = useCallback((sectionId: string, columnData: Omit<ColumnSchema, 'id'>) => {
    recordHistory(state.document);
    const newColId = `col_new_${Math.random().toString(36).substr(2, 9)}`;
    const newCol: ColumnSchema = {
      ...columnData,
      id: newColId,
    };
    setState(prev => {
      const updatedSections = prev.document.sections.map(s => {
        if (s.id !== sectionId) return s;
        return {
          ...s,
          columns: [...s.columns, newCol],
        };
      });
      return {
        ...prev,
        document: { ...prev.document, sections: updatedSections },
        selectedSectionId: sectionId,
        selectedColumnId: newColId,
      };
    });
  }, [state.document, recordHistory]);

  const deleteColumnFromSection = useCallback((sectionId: string, columnId: string) => {
    recordHistory(state.document);
    setState(prev => {
      const updatedSections = prev.document.sections.map(s => {
        if (s.id !== sectionId) return s;
        return {
          ...s,
          columns: s.columns.filter(col => col.id !== columnId),
        };
      });
      return {
        ...prev,
        document: { ...prev.document, sections: updatedSections },
        selectedColumnId: prev.selectedColumnId === columnId ? null : prev.selectedColumnId,
      };
    });
  }, [state.document, recordHistory]);

  // Preview operations
  const updatePreview = useCallback((previewUpdates: Partial<PreviewState>) => {
    setState(prev => ({
      ...prev,
      preview: {
        ...prev.preview,
        ...previewUpdates,
      },
    }));
  }, []);

  const setSearchTerm = useCallback((term: string) => {
    setState(prev => ({
      ...prev,
      searchTerm: term,
    }));
  }, []);

  const setSelectedSectionId = useCallback((id: string | null) => {
    setState(prev => ({
      ...prev,
      selectedSectionId: id,
      // Clear column selection if section changes
      selectedColumnId: id === null ? null : prev.selectedColumnId,
    }));
  }, []);

  const setSelectedColumnId = useCallback((id: string | null) => {
    setState(prev => ({
      ...prev,
      selectedColumnId: id,
    }));
  }, []);

  // Preset resetting of document settings
  const resetDocumentToDefault = useCallback(() => {
    recordHistory(state.document);
    const currentType = state.document.type;
    const defaultDoc = DEFAULT_SCHEMAS[currentType];
    setState(prev => ({
      ...prev,
      document: JSON.parse(JSON.stringify(defaultDoc)),
      selectedSectionId: null,
      selectedColumnId: null,
    }));
  }, [state.document, recordHistory]);

  return {
    document: state.document,
    preview: state.preview,
    searchTerm: state.searchTerm,
    selectedSectionId: state.selectedSectionId,
    selectedColumnId: state.selectedColumnId,
    canUndo,
    canRedo,
    lastSaved,
    isSaving,
    
    // Actions
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
  };
}
