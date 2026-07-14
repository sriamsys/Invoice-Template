/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useRef, useEffect, useState } from 'react';
import { 
  ZoomIn, 
  ZoomOut, 
  Maximize2, 
  Smartphone, 
  Tablet as TabletIcon, 
  Monitor, 
  Printer,
  ChevronLeft,
  ChevronRight,
  Sparkles
} from 'lucide-react';
import { DocumentSchema, PreviewState } from '../types';
import { PreviewRenderer } from './PreviewRenderer';

interface PreviewCanvasProps {
  document: DocumentSchema;
  preview: PreviewState;
  updatePreview: (updates: Partial<PreviewState>) => void;
  updatePage: (updates: any) => void;
}

export function PreviewCanvas({
  document,
  preview,
  updatePreview,
  updatePage,
}: PreviewCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [fitScale, setFitScale] = useState(1);

  // Paper base dimensions at standard 96 DPI
  const paperDimensions = {
    Letter: {
      portrait: { width: 816, height: 1056 },
      landscape: { width: 1056, height: 816 },
    },
    A4: {
      portrait: { width: 794, height: 1123 },
      landscape: { width: 1123, height: 794 },
    },
  };

  const { paperSize, orientation, margin } = document.page;
  const dimensions = paperDimensions[paperSize][orientation];
  
  // Calculate margins in pixels (96 DPI * inches)
  const paddingPx = margin * 96;

  // Auto-calculate "Fit Width" scale
  useEffect(() => {
    const calculateFit = () => {
      if (!containerRef.current) return;
      const containerWidth = containerRef.current.clientWidth - 48; // padding fallback
      const scaleValue = containerWidth / dimensions.width;
      setFitScale(Math.min(Math.max(scaleValue, 0.4), 1.5));
    };

    calculateFit();
    
    // Resize observer
    const observer = new ResizeObserver(() => {
      calculateFit();
    });
    
    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, [dimensions.width, preview.viewMode]);

  // Determine current active scale
  const currentScale = preview.zoomMode === 'fit' ? fitScale : preview.zoom / 100;

  const handleZoomIn = () => {
    const nextZoom = Math.min(preview.zoom + 10, 150);
    updatePreview({ zoom: nextZoom, zoomMode: 'custom' });
  };

  const handleZoomOut = () => {
    const nextZoom = Math.max(preview.zoom - 10, 50);
    updatePreview({ zoom: nextZoom, zoomMode: 'custom' });
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div id="preview-canvas-wrapper" className="flex flex-col h-full bg-slate-100 select-none">
      {/* Canvas Header Toolbar */}
      <div className="flex items-center justify-between px-4 py-2 bg-slate-50 border-b border-slate-200 shrink-0 text-slate-700">
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">PDF Print Mockup</span>
          <span className="bg-slate-200 px-1.5 py-0.5 rounded text-[10px] font-bold">
            {paperSize} • {orientation === 'portrait' ? 'Portrait' : 'Landscape'}
          </span>
        </div>

        {/* View Mode & Zoom Controllers */}
        <div className="flex items-center gap-3">
          {/* Quick Page Orientation toggler */}
          <div className="flex bg-slate-200 p-0.5 rounded-lg border border-slate-200 text-xs">
            <button
              id="orientation-portrait-btn"
              onClick={() => updatePage({ orientation: 'portrait' })}
              className={`px-2 py-1 rounded-md font-semibold transition-all ${
                orientation === 'portrait'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Portrait
            </button>
            <button
              id="orientation-landscape-btn"
              onClick={() => updatePage({ orientation: 'landscape' })}
              className={`px-2 py-1 rounded-md font-semibold transition-all ${
                orientation === 'landscape'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Landscape
            </button>
          </div>

          <div className="w-[1px] h-4 bg-slate-300" />

          {/* Zoom Actions */}
          <div className="flex items-center gap-1">
            <button
              id="zoom-out-btn"
              onClick={handleZoomOut}
              disabled={preview.zoom <= 50 && preview.zoomMode !== 'fit'}
              title="Zoom Out"
              className="p-1 rounded hover:bg-slate-200 disabled:opacity-30"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <span className="text-xs font-bold w-12 text-center">
              {preview.zoomMode === 'fit' ? 'Fit' : `${preview.zoom}%`}
            </span>
            <button
              id="zoom-in-btn"
              onClick={handleZoomIn}
              disabled={preview.zoom >= 150 && preview.zoomMode !== 'fit'}
              title="Zoom In"
              className="p-1 rounded hover:bg-slate-200 disabled:opacity-30"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
            <button
              id="zoom-fit-btn"
              onClick={() => updatePreview({ zoomMode: 'fit' })}
              title="Fit to screen width"
              className={`p-1 rounded hover:bg-slate-200 ${preview.zoomMode === 'fit' ? 'bg-slate-200' : ''}`}
            >
              <Maximize2 className="w-4 h-4" />
            </button>
          </div>

          <div className="w-[1px] h-4 bg-slate-300" />

          {/* Trigger System Print */}
          <button
            id="print-document-btn"
            onClick={handlePrint}
            title="Print Document"
            className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all text-xs font-semibold shadow-sm cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print / PDF</span>
          </button>
        </div>
      </div>

      {/* Canvas Paper Workspace Container */}
      <div 
        ref={containerRef}
        id="preview-paper-workspace"
        className="flex-grow overflow-auto p-8 flex items-start justify-center relative cursor-grab active:cursor-grabbing"
      >
        {/* Dynamic Zoom Scale Wrapper */}
        <div 
          style={{ 
            transform: `scale(${currentScale})`,
            transformOrigin: 'top center',
            width: `${dimensions.width}px`,
            height: `${dimensions.height}px`,
            transition: 'transform 0.1s ease-out',
          }}
          className="shrink-0 relative"
        >
          {/* Printable Sheet mockup */}
          <div
            id="invoice-paper-mockup"
            style={{
              width: `${dimensions.width}px`,
              height: `${dimensions.height}px`,
              padding: `${paddingPx}px`,
            }}
            className="bg-white border border-slate-300 shadow-xl rounded-md flex flex-col justify-between relative group/paper"
          >
            {/* Visual indicator lines of print margins on Hover */}
            <div 
              style={{
                top: `${paddingPx}px`,
                bottom: `${paddingPx}px`,
                left: `${paddingPx}px`,
                right: `${paddingPx}px`,
              }}
              className="absolute pointer-events-none border border-dashed border-sky-400/0 group-hover/paper:border-sky-400/20 transition-all rounded"
              title="Print Margin Guidelines"
            />

            {/* Render the actual schema-driven content inside the margins */}
            <PreviewRenderer document={document} />

            {/* Page number footer */}
            <div 
              style={{ bottom: `${paddingPx / 2}px` }}
              className="absolute left-1/2 -translate-x-1/2 text-[9px] font-bold text-slate-400 tracking-wider uppercase pointer-events-none"
            >
              Page 1 of 1
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
