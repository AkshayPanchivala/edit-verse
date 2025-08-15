import React from 'react';
import { EditorContent } from '@tiptap/react';
import { A4_WIDTH_PX, A4_HEIGHT_PX, HEADER_HEIGHT, FOOTER_HEIGHT, PAGE_MARGIN, CONTENT_HEIGHT } from '../constants';

interface DocumentPageProps {
  editor: any;
  contentRef: React.RefObject<HTMLDivElement>;
  showPageBoundaries: boolean;
  currentPage: number;
}

const DocumentPage: React.FC<DocumentPageProps> = ({ editor, contentRef, showPageBoundaries, currentPage }) => {
  return (
    <div className="flex justify-center">
      <div
        ref={contentRef}
        className={`document-page bg-white shadow-xl transition-all duration-300 ${
          showPageBoundaries ? 'shadow-2xl border border-gray-200' : 'shadow-lg'
        }`}
        style={{
          width: `${A4_WIDTH_PX}px`,
          minHeight: `${A4_HEIGHT_PX}px`,
          position: 'relative',
          transformOrigin: 'top center',
          transform: window.innerWidth < 900 ? 'scale(0.8)' : 'scale(1)',
        }}
      >
        {showPageBoundaries && (
          <div
            className="no-print absolute top-0 left-0 right-0 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-blue-200 flex items-center justify-center text-sm text-blue-700 font-medium"
            style={{ height: `${HEADER_HEIGHT}px` }}
          >
            Legal Document - A4 Format
          </div>
        )}
        <div
          style={{
            paddingTop: showPageBoundaries ? `${HEADER_HEIGHT + PAGE_MARGIN}px` : `${PAGE_MARGIN}px`,
            paddingBottom: showPageBoundaries ? `${FOOTER_HEIGHT + PAGE_MARGIN}px` : `${PAGE_MARGIN}px`,
            paddingLeft: `${PAGE_MARGIN}px`,
            paddingRight: `${PAGE_MARGIN}px`,
            minHeight: `${CONTENT_HEIGHT}px`,
          }}
        >
          <EditorContent editor={editor} className="min-h-full focus:outline-none" />
        </div>
        {showPageBoundaries && (
          <div
            className="no-print absolute bottom-0 left-0 right-0 bg-gradient-to-r from-gray-50 to-slate-50 border-t border-gray-200 flex items-center justify-between px-6 text-sm text-gray-600"
            style={{ height: `${FOOTER_HEIGHT}px` }}
          >
            <span>A4 Document Editor</span>
            <span className="font-medium">Page {currentPage}</span>
          </div>
        )}
        {showPageBoundaries && (
          <div className="no-print absolute -top-2 -left-2 -right-2 -bottom-2 border-2 border-dashed border-blue-300 rounded-lg pointer-events-none opacity-50" />
        )}
      </div>
    </div>
  );
};

export default DocumentPage;
