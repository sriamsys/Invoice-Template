/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { Sliders, Eye, FileSpreadsheet, Sparkles } from 'lucide-react';
import { PreviewState } from '../types';

interface ResponsiveLayoutProps {
  leftPane: React.ReactNode;
  rightPane: React.ReactNode;
  preview: PreviewState;
  updatePreview: (updates: Partial<PreviewState>) => void;
}

export function ResponsiveLayout({
  leftPane,
  rightPane,
  preview,
  updatePreview,
}: ResponsiveLayoutProps) {
  const [splitPercentage, setSplitPercentage] = useState(45); // Left side width %
  const [isResizing, setIsResizing] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Handle Drag Resizing
  const startResizing = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsResizing(true);
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing || !containerRef.current) return;
      const containerRect = containerRef.current.getBoundingClientRect();
      const relativeX = e.clientX - containerRect.left;
      const percentage = (relativeX / containerRect.width) * 100;
      
      // Constrain resizable boundary between 25% and 70%
      const constrained = Math.min(Math.max(percentage, 25), 70);
      setSplitPercentage(constrained);
    };

    const handleMouseUp = () => {
      setIsResizing(false);
    };

    if (isResizing) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isResizing]);

  // Sync window resizing to set mobile active tab state
  useEffect(() => {
    const handleResize = () => {
      const isMobile = window.innerWidth < 1024;
      updatePreview({
        viewMode: isMobile ? 'mobile' : 'desktop'
      });
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [updatePreview]);

  const isMobileLayout = preview.viewMode === 'mobile';

  return (
    <div 
      ref={containerRef} 
      id="responsive-workspace-root" 
      className="flex-grow flex flex-col min-h-0 relative select-none"
    >
      {isMobileLayout ? (
        /* ========================================== */
        /* MOBILE VIEWPORT TAB LAYOUT                 */
        /* ========================================== */
        <div className="flex-grow flex flex-col min-h-0">
          {/* Active mobile view frame */}
          <div className="flex-grow overflow-hidden min-h-0 flex flex-col">
            {preview.activeTab === 'config' ? (
              <div className="flex-grow overflow-y-auto bg-slate-50">
                {leftPane}
              </div>
            ) : (
              <div className="flex-grow bg-slate-100">
                {rightPane}
              </div>
            )}
          </div>

          {/* Sticky Bottom Action Tab Bar */}
          <div 
            id="mobile-bottom-action-bar" 
            className="sticky bottom-0 left-0 right-0 h-14 bg-white border-t border-slate-200 shadow-lg flex items-center justify-around px-4 z-20 shrink-0"
          >
            <button
              id="mobile-tab-config"
              type="button"
              onClick={() => updatePreview({ activeTab: 'config' })}
              className={`flex-1 h-full flex flex-col items-center justify-center gap-1 transition-all ${
                preview.activeTab === 'config'
                  ? 'text-slate-900 font-bold'
                  : 'text-slate-400 font-medium hover:text-slate-600'
              }`}
            >
              <Sliders className="w-4 h-4" />
              <span className="text-[10px] uppercase tracking-wider">Configure</span>
            </button>
            
            <div className="w-[1.5px] h-6 bg-slate-200" />

            <button
              id="mobile-tab-preview"
              type="button"
              onClick={() => updatePreview({ activeTab: 'preview' })}
              className={`flex-1 h-full flex flex-col items-center justify-center gap-1 transition-all ${
                preview.activeTab === 'preview'
                  ? 'text-slate-900 font-bold'
                  : 'text-slate-400 font-medium hover:text-slate-600'
              }`}
            >
              <Eye className="w-4 h-4" />
              <span className="text-[10px] uppercase tracking-wider">Live Preview</span>
            </button>
          </div>
        </div>
      ) : (
        /* ========================================== */
        /* DESKTOP SPLIT VIEW WITH RESIZABLE DIVIDER  */
        /* ========================================== */
        <div className="flex-grow flex min-h-0 relative bg-slate-100">
          {/* Left panel (Workspace) */}
          <div 
            id="left-resizable-workspace-pane" 
            style={{ width: `${splitPercentage}%` }}
            className="h-full overflow-y-auto bg-slate-50 border-r border-slate-200/50 flex flex-col shrink-0"
          >
            {leftPane}
          </div>

          {/* Resizable Divider bar */}
          <div
            id="workspace-split-divider"
            onMouseDown={startResizing}
            className={`w-[7px] hover:w-[10px] h-full cursor-col-resize hover:bg-slate-300 active:bg-slate-400 transition-all z-20 shrink-0 relative flex items-center justify-center ${
              isResizing ? 'bg-slate-400 w-[10px]' : 'bg-slate-200/50'
            }`}
          >
            {/* Visual small grip notches */}
            <div className="w-[2px] h-6 rounded bg-slate-400/80 pointer-events-none" />
          </div>

          {/* Right panel (Preview) */}
          <div 
            id="right-preview-pane" 
            className="flex-grow h-full overflow-hidden flex flex-col bg-slate-100"
          >
            {rightPane}
          </div>
        </div>
      )}
    </div>
  );
}
