import React, { useEffect, useRef, useReducer, useCallback } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { Bold } from '@tiptap/extension-bold';
import { Italic } from '@tiptap/extension-italic';
import { Underline } from '@tiptap/extension-underline';
import { TextAlign } from '@tiptap/extension-text-align';
import { PageBreak } from '../extensions/PageBreak';
import DocumentToolbar from './DocumentToolbar';
import { BulletList } from '@tiptap/extension-bullet-list';
import { OrderedList } from '@tiptap/extension-ordered-list';
import { CONTENT_HEIGHT } from '../constants';
import DocumentHeader from './DocumentHeader';
import DocumentFooter from './DocumentFooter';
import DocumentPage from './DocumentPage';
import { DOMSerializer } from 'prosemirror-model';

interface DocumentEditorProps {
  initialContent?: string;
  onContentChange?: (content: string) => void;
}

interface EditorState {
  isDebug: boolean;
  currentPage: number;
  totalPages: number;
  isAutoPaginationEnabled: boolean;
  showPageBoundaries: boolean;
  isPreviewMode: boolean;
  wordCount: number;
}

type EditorAction =
  | { type: 'TOGGLE_DEBUG' }
  | { type: 'SET_CURRENT_PAGE'; payload: number }
  | { type: 'SET_TOTAL_PAGES'; payload: number }
  | { type: 'TOGGLE_AUTO_PAGINATION' }
  | { type: 'TOGGLE_PAGE_BOUNDARIES' }
  | { type: 'TOGGLE_PREVIEW_MODE' }
  | { type: 'SET_WORD_COUNT'; payload: number };

const initialState: EditorState = {
  isDebug: false,
  currentPage: 1,
  totalPages: 1,
  isAutoPaginationEnabled: true,
  showPageBoundaries: true,
  isPreviewMode: false,
  wordCount: 0,
};

const editorReducer = (state: EditorState, action: EditorAction): EditorState => {
  switch (action.type) {
    case 'TOGGLE_DEBUG':
      return { ...state, isDebug: !state.isDebug };
    case 'SET_CURRENT_PAGE':
      return { ...state, currentPage: action.payload };
    case 'SET_TOTAL_PAGES':
      return { ...state, totalPages: action.payload };
    case 'TOGGLE_AUTO_PAGINATION':
      return { ...state, isAutoPaginationEnabled: !state.isAutoPaginationEnabled };
    case 'TOGGLE_PAGE_BOUNDARIES':
      return { ...state, showPageBoundaries: !state.showPageBoundaries };
    case 'TOGGLE_PREVIEW_MODE':
      return { ...state, isPreviewMode: !state.isPreviewMode };
    case 'SET_WORD_COUNT':
      return { ...state, wordCount: action.payload };
    default:
      return state;
  }
};

const DocumentEditor: React.FC<DocumentEditorProps> = ({ initialContent, onContentChange }) => {
  const [state, dispatch] = useReducer(editorReducer, initialState);
  const contentRef = useRef<HTMLDivElement>(null);
  const paginationTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastContentHtml = useRef('');
  const isPaginating = useRef(false);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Bold,
      Italic,
      Underline,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
        defaultAlignment: 'left',
      }),
      PageBreak,
      BulletList,
      OrderedList,
    ],
    content: initialContent,
    onCreate: ({ editor: createdEditor }) => {
      const text = createdEditor.getText();
      dispatch({ type: 'SET_WORD_COUNT', payload: text.split(/\s+/).filter((word) => word.length > 0).length });
    },
    onUpdate: ({ editor }) => {
      if (state.isDebug) {
        console.log(editor.state.toJSON());
      }
      const content = editor.getHTML();
      const text = editor.getText();
      dispatch({ type: 'SET_WORD_COUNT', payload: text.split(/\s+/).filter((word) => word.length > 0).length });
      onContentChange?.(content);

      if (state.isAutoPaginationEnabled && content !== lastContentHtml.current) {
        if (editor.state.tr.getMeta('pagination') === 'end') {
          lastContentHtml.current = content;
          return;
        }

        lastContentHtml.current = content;

        if (paginationTimeout.current) {
          clearTimeout(paginationTimeout.current);
        }

        paginationTimeout.current = setTimeout(() => {
          requestAnimationFrame(() => {
            calculatePagination();
          });
        }, 300);
      }
    },
    onSelectionUpdate: () => {
      updateCurrentPage();
    },
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-2xl focus:outline-none min-h-full',
        style: 'padding: 2rem; line-height: 1.6; font-family: "Times New Roman", serif; font-size: 12pt;',
      },
    },
  });

  const getNodeHeight = (node: any): number => {
    if (!contentRef.current || !editor) return 0;

    // Create a temporary div to render the node and measure its height
    const tempDiv = document.createElement('div');
    tempDiv.style.width = `${contentRef.current.clientWidth}px`;
    tempDiv.style.visibility = 'hidden';
    tempDiv.style.position = 'absolute';
    tempDiv.style.pointerEvents = 'none'; // Ensure it doesn't interfere with events
    // Serialize the ProseMirror node to a DOM node
    // Import DOMSerializer from prosemirror-model at the top of the file:
    // import { DOMSerializer } from 'prosemirror-model';
    const serializer = DOMSerializer.fromSchema(editor.schema);
    const domNode = serializer.serializeNode(node);

    tempDiv.appendChild(domNode);
    document.body.appendChild(tempDiv);
    document.body.appendChild(tempDiv);

    const height = tempDiv.offsetHeight;
    document.body.removeChild(tempDiv); // Clean up the temporary div

    return height;
  };

  const calculatePagination = useCallback(() => {
    if (!editor || !contentRef.current || isPaginating.current) return;

    isPaginating.current = true;

    const editorElement = contentRef.current.querySelector('.ProseMirror');
    if (!editorElement) {
      isPaginating.current = false;
      return;
    }

    const { tr } = editor.state;

    let modified = false;
    editor.state.doc.descendants((node, pos) => {
      if (node.type.name === 'pageBreak' && node.attrs['data-auto-page-break']) {
        tr.delete(pos, pos + node.nodeSize);
        modified = true;
      }
    });

    if (modified) {
      editor.view.dispatch(tr);
    }

    const newTr = editor.state.tr;
    let currentHeight = 0;
    let pageCount = 1;
    let newModified = false;

    editor.state.doc.forEach((node, pos) => {
      if (node.type.name === 'pageBreak') {
        if (node.attrs['data-manual-page-break']) {
          currentHeight = 0;
          pageCount++;
        }
        return;
      }

      const nodeHeight = getNodeHeight(editor.view.nodeDOM(pos));

      if (currentHeight + nodeHeight > CONTENT_HEIGHT && currentHeight > 0) {
        const pageBreakNode = editor.schema.nodes.pageBreak.create({ 'data-auto-page-break': 'true' });
        newTr.insert(pos, pageBreakNode);
        newModified = true;
        pageCount++;
        currentHeight = nodeHeight;
      } else {
        currentHeight += nodeHeight;
      }
    });

    if (newModified) {
      editor.view.dispatch(newTr);
    }

    dispatch({ type: 'SET_TOTAL_PAGES', payload: pageCount });

    setTimeout(() => {
      isPaginating.current = false;
    }, 100);
  }, [editor]);

  const updateCurrentPage = useCallback(() => {
    if (!editor || !contentRef.current) return;

    const selection = editor.state.selection;
    const pos = selection.$head.pos;

    const editorElement = contentRef.current.querySelector('.ProseMirror');
    if (!editorElement) return;

    let pageBreaksBefore = 0;
    editor.state.doc.nodesBetween(0, pos, (node, nodePos) => {
      if (node.type.name === 'pageBreak') {
        pageBreaksBefore++;
      }
    });

    dispatch({ type: 'SET_CURRENT_PAGE', payload: pageBreaksBefore + 1 });
  }, [editor]);

  const insertPageBreak = () => {
    if (editor) {
      editor.chain().focus().setPageBreak({ manual: true }).run();
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleExport = () => {
    const content = editor?.getHTML();
    if (!content) return;

    const exportContent = `
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8">
          <title>Legal Document Export</title>
          <style>${getExportStyles()}</style>
        </head>
        <body>
          <div class="document-export">${content}</div>
        </body>
      </html>
    `;

    const blob = new Blob([exportContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'document.html';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const getExportStyles = () => {
    return `
      @page {
        size: A4;
        margin: 2cm;
        counter-increment: page;

        @top-center {
          content: "Legal Document";
          font-family: Arial, sans-serif;
          font-size: 10pt;
          color: #666;
          border-bottom: 1px solid #ddd;
          padding-bottom: 0.5cm;
        }

        @bottom-center {
          content: "Page " counter(page) " of " counter(pages);
          font-family: Arial, sans-serif;
          font-size: 10pt;
          color: #666;
          border-top: 1px solid #ddd;
          padding-top: 0.5cm;
        }
      }

      body {
        font-family: 'Times New Roman', serif;
        font-size: 12pt;
        line-height: 1.6;
        margin: 0;
        padding: 0;
        counter-reset: page;
      }

      .document-export {
        max-width: 100%;
      }

      [data-page-break] {
        page-break-before: always !important;
        break-before: page !important;
        height: 0 !important;
        border: none !important;
        margin: 0 !important;
        padding: 0 !important;
        display: block !important;
      }

      h1, h2, h3, h4, h5, h6 {
        break-after: avoid;
        page-break-after: avoid;
        orphans: 3;
        widows: 3;
      }

      p {
        margin: 0 0 12pt 0;
        orphans: 3;
        widows: 3;
      }

      ul, ol {
        break-inside: avoid;
        page-break-inside: avoid;
      }
    `;
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