import React, { useEffect, useRef } from 'react';
import { useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { Underline } from '@tiptap/extension-underline';
import { TextAlign } from '@tiptap/extension-text-align';
import { TextStyle } from '@tiptap/extension-text-style';
import { PageBreak } from '../extensions/PageBreak';
import { FontSize } from '../extensions/FontSize';
import DocumentToolbar from './DocumentToolbar';
import DocumentHeader from './DocumentHeader';
import DocumentFooter from './DocumentFooter';
import DocumentPage from './DocumentPage';
import { useEditorState } from '../hooks/useEditorState';
import { usePagination } from '../hooks/usePagination';
import { useDocumentExport } from '../hooks/useDocumentExport';

interface DocumentEditorProps {
  initialContent?: string;
  onContentChange?: (content: string) => void;
}

const DocumentEditor: React.FC<DocumentEditorProps> = ({ initialContent, onContentChange }) => {
  const { state, dispatch } = useEditorState();
  const contentRef = useRef<HTMLDivElement>(null);
  const isInitialized = useRef(false);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3, 4],
        },
        bulletList: {
          keepMarks: true,
          keepAttributes: false,
        },
        orderedList: {
          keepMarks: true,
          keepAttributes: false,
        },
      }),
      Underline,
      TextStyle,
      FontSize,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
        defaultAlignment: 'left',
      }),
      PageBreak,
    ],
    content: initialContent,
    editorProps: {
      attributes: {
        class: 'focus:outline-none min-h-full',
        style: 'padding: 2rem; line-height: 1.6; font-family: "Times New Roman", serif; font-size: 12pt;',
      },
    },
    editable: true,
    enableInputRules: true,
    enablePasteRules: true,
  });

  // Initialize hooks
  const { calculatePagination, updateCurrentPage, schedulePagination } = usePagination({
    editor,
    contentRef,
    isAutoPaginationEnabled: state.isAutoPaginationEnabled,
    onTotalPagesChange: (pages) => dispatch({ type: 'SET_TOTAL_PAGES', payload: pages }),
    onCurrentPageChange: (page) => dispatch({ type: 'SET_CURRENT_PAGE', payload: page }),
  });

  const { handleExport, handlePrint } = useDocumentExport(editor);

  // Handle editor updates
  useEffect(() => {
    if (!editor) return;

    const handleUpdate = () => {
      if (state.isDebug) {
        console.log(editor.state.toJSON());
      }
      const content = editor.getHTML();
      const text = editor.getText();
      dispatch({ type: 'SET_WORD_COUNT', payload: text.split(/\s+/).filter((word) => word.length > 0).length });
      onContentChange?.(content);
      schedulePagination(content);
    };

    const handleSelectionUpdate = () => {
      updateCurrentPage();
    };

    const handleCreate = () => {
      const text = editor.getText();
      const wordCount = text.split(/\s+/).filter((word) => word.length > 0).length;
      dispatch({ type: 'SET_WORD_COUNT', payload: wordCount });

      // Trigger initial pagination after content is loaded
      if (!isInitialized.current) {
        isInitialized.current = true;
        setTimeout(() => {
          calculatePagination();
          updateCurrentPage();
        }, 100);
      }
    };

    editor.on('update', handleUpdate);
    editor.on('selectionUpdate', handleSelectionUpdate);
    editor.on('create', handleCreate);

    // Initialize word count and pagination if editor already has content
    if (editor.getText() && !isInitialized.current) {
      isInitialized.current = true;
      const text = editor.getText();
      const wordCount = text.split(/\s+/).filter((word) => word.length > 0).length;
      dispatch({ type: 'SET_WORD_COUNT', payload: wordCount });
      setTimeout(() => {
        calculatePagination();
        updateCurrentPage();
      }, 100);
    }

    return () => {
      editor.off('update', handleUpdate);
      editor.off('selectionUpdate', handleSelectionUpdate);
      editor.off('create', handleCreate);
    };
  }, [editor, state.isDebug, onContentChange, schedulePagination, updateCurrentPage, dispatch, calculatePagination]);

  // Insert page break handler
  const insertPageBreak = () => {
    if (editor) {
      editor.chain().focus().setPageBreak({ manual: true }).run();
    }
  };

  useEffect(() => {
    if (state.isAutoPaginationEnabled) {
      const timer = setTimeout(() => {
        calculatePagination();
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [calculatePagination, state.isAutoPaginationEnabled]);

  if (!editor) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading editor...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <DocumentHeader
        currentPage={state.currentPage}
        totalPages={state.totalPages}
        wordCount={state.wordCount}
        isAutoPaginationEnabled={state.isAutoPaginationEnabled}
        onAutoPaginationChange={() => dispatch({ type: 'TOGGLE_AUTO_PAGINATION' })}
        showPageBoundaries={state.showPageBoundaries}
        onShowPageBoundariesChange={() => dispatch({ type: 'TOGGLE_PAGE_BOUNDARIES' })}
        onInsertPageBreak={insertPageBreak}
        isPreviewMode={state.isPreviewMode}
        onPreviewModeChange={() => dispatch({ type: 'TOGGLE_PREVIEW_MODE' })}
        onPrint={handlePrint}
        onExport={handleExport}
      />

      {!state.isPreviewMode && <DocumentToolbar editor={editor} insertPageBreak={insertPageBreak} toggleDebug={() => dispatch({ type: 'TOGGLE_DEBUG' })} />}

      <div className="max-w-6xl mx-auto px-6 py-8">
        <DocumentPage editor={editor} contentRef={contentRef} showPageBoundaries={state.showPageBoundaries} currentPage={state.currentPage} />
        <DocumentFooter totalPages={state.totalPages} showPageBoundaries={state.showPageBoundaries} />
      </div>
    </div>
  );
};

export default DocumentEditor;