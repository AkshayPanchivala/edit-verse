import React, { useEffect, useRef, useState, useCallback } from 'react'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { Bold } from '@tiptap/extension-bold'
import { Italic } from '@tiptap/extension-italic'
import { Underline } from '@tiptap/extension-underline'
import { TextAlign } from '@tiptap/extension-text-align'
import { PageBreak } from '../extensions/PageBreak'
import DocumentToolbar from './DocumentToolbar'
import { FileText, Printer, Download, Eye, Settings } from 'lucide-react'

interface DocumentEditorProps {
  initialContent?: string
  onContentChange?: (content: string) => void
}

const DocumentEditor: React.FC<DocumentEditorProps> = ({
  initialContent = '',
  onContentChange
}) => {
  const editorRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [isAutoPaginationEnabled, setIsAutoPaginationEnabled] = useState(true)
  const [showPageBoundaries, setShowPageBoundaries] = useState(true)
  const [isPreviewMode, setIsPreviewMode] = useState(false)
  const [wordCount, setWordCount] = useState(0)

  const editor = useEditor({
    extensions: [
      StarterKit,
      Bold,
      Italic,
      Underline,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      PageBreak,
    ],
    content: initialContent,
    onUpdate: ({ editor }) => {
      const content = editor.getHTML()
      const text = editor.getText()
      setWordCount(text.split(/\s+/).filter(word => word.length > 0).length)
      onContentChange?.(content)
      
      if (isAutoPaginationEnabled) {
        requestAnimationFrame(() => {
          calculatePagination()
        })
      }
    },
    onSelectionUpdate: ({ editor }) => {
      // Update current page based on cursor position
      updateCurrentPage()
    },
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-2xl focus:outline-none min-h-full',
        style: 'padding: 2rem; line-height: 1.6; font-family: "Times New Roman", serif; font-size: 12pt;'
      },
    },
  })

  // A4 dimensions at 96 DPI
  const A4_WIDTH_PX = 794   // 21cm at 96 DPI
  const A4_HEIGHT_PX = 1123 // 29.7cm at 96 DPI
  const PAGE_MARGIN = 80    // 2.1cm margins
  const HEADER_HEIGHT = 40
  const FOOTER_HEIGHT = 40
  const CONTENT_HEIGHT = A4_HEIGHT_PX - HEADER_HEIGHT - FOOTER_HEIGHT - (PAGE_MARGIN * 2)

  const calculatePagination = useCallback(() => {
    if (!editor || !contentRef.current) return

    const editorElement = contentRef.current.querySelector('.ProseMirror')
    if (!editorElement) return

    // Remove existing auto page breaks
    const existingBreaks = Array.from(editorElement.querySelectorAll('[data-auto-page-break="true"]'))
    existingBreaks.forEach(breakEl => {
      const pos = editor.view.posAtDOM(breakEl, 0)
      if (pos >= 0) {
        editor.chain().setTextSelection(pos).deleteSelection().run()
      }
    })

    // Calculate pagination
    let currentHeight = 0
    let pageCount = 1
    const children = Array.from(editorElement.children) as HTMLElement[]

    for (let i = 0; i < children.length; i++) {
      const child = children[i]
      if (child.hasAttribute('data-page-break')) continue
      
      const childRect = child.getBoundingClientRect()
      const childHeight = childRect.height

      // Check if adding this element would exceed page height
      if (currentHeight + childHeight > CONTENT_HEIGHT && currentHeight > 0) {
        // Insert automatic page break
        const pos = editor.view.posAtDOM(child, 0)
        if (pos >= 0) {
          editor.chain().setTextSelection(pos).insertContent({
            type: 'pageBreak',
            attrs: { 'data-auto-page-break': 'true' }
          }).run()
          pageCount++
          currentHeight = childHeight
        }
      } else {
        currentHeight += childHeight
      }
    }

    setTotalPages(pageCount)
  }, [editor, CONTENT_HEIGHT])

  const updateCurrentPage = useCallback(() => {
    if (!editor || !contentRef.current) return

    const selection = editor.state.selection
    const pos = selection.$head.pos
    
    const editorElement = contentRef.current.querySelector('.ProseMirror')
    if (!editorElement) return

    // Count page breaks before current position
    let pageBreaksBefore = 0
    const walker = document.createTreeWalker(
      editorElement,
      NodeFilter.SHOW_ELEMENT,
      (node) => {
        const element = node as Element
        return element.hasAttribute('data-page-break') ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_SKIP
      }
    )

    let node
    while (node = walker.nextNode()) {
      const nodePos = editor.view.posAtDOM(node as Element, 0)
      if (nodePos < pos) {
        pageBreaksBefore++
      } else {
        break
      }
    }

    setCurrentPage(pageBreaksBefore + 1)
  }, [editor])

  const insertPageBreak = () => {
    if (editor) {
      editor.chain().focus().setPageBreak().run()
    }
  }

  const handlePrint = () => {
    window.print()
  }

  const handleExport = () => {
    const content = editor?.getHTML()
    if (!content) return

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
    `

    const blob = new Blob([exportContent], { type: 'text/html' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'document.html'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

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
    `
  }

  useEffect(() => {
    if (isAutoPaginationEnabled) {
      const timer = setTimeout(() => {
        calculatePagination()
      }, 100)
      return () => clearTimeout(timer)
    }
  }, [calculatePagination, isAutoPaginationEnabled])

  if (!editor) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading editor...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Print Styles */}
      <style>{`
        @media print {
          @page {
            size: A4;
            margin: 2cm;
            counter-increment: page;
            
            @top-center {
              content: "Legal Document";
              font-family: Arial, sans-serif;
              font-size: 10pt;
              color: #333;
              border-bottom: 1px solid #ddd;
              padding-bottom: 0.3cm;
            }
            
            @bottom-center {
              content: "Page " counter(page);
              font-family: Arial, sans-serif;
              font-size: 10pt;
              color: #333;
              border-top: 1px solid #ddd;
              padding-top: 0.3cm;
            }
          }
          
          body { 
            font-size: 12pt !important; 
            line-height: 1.6 !important;
            -webkit-print-color-adjust: exact;
            color-adjust: exact;
          }
          
          .no-print { display: none !important; }
          .page-break-indicator { display: none !important; }
          [data-page-break] { 
            page-break-before: always !important; 
            break-before: page !important;
            display: block !important;
            height: 0 !important;
            margin: 0 !important;
            padding: 0 !important;
            border: none !important;
          }
          
          .document-page {
            box-shadow: none !important;
            margin: 0 !important;
            border: none !important;
          }
        }
        
        .page-break-indicator {
          position: relative;
          height: 2px;
          background: repeating-linear-gradient(
            90deg,
            #3B82F6 0px,
            #3B82F6 10px,
            transparent 10px,
            transparent 20px
          );
          margin: 1rem 0;
        }
        
        .page-break-indicator::after {
          content: "Page Break";
          position: absolute;
          top: -10px;
          left: 50%;
          transform: translateX(-50%);
          background: #3B82F6;
          color: white;
          padding: 2px 8px;
          font-size: 10px;
          border-radius: 4px;
          font-weight: 500;
        }
      `}</style>

      {/* Header */}
      <div className="no-print sticky top-0 z-20 bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <FileText size={20} className="text-blue-600" />
                </div>
                <div>
                  <h1 className="text-xl font-semibold text-gray-900">A4 Document Editor</h1>
                  <p className="text-sm text-gray-500">Professional document editing with pagination</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-4 text-sm text-gray-600">
                <span className="flex items-center space-x-1">
                  <span className="font-medium">Page:</span>
                  <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded font-medium">
                    {currentPage} of {totalPages}
                  </span>
                </span>
                <span>Words: <span className="font-medium">{wordCount.toLocaleString()}</span></span>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2">
                <label className="flex items-center space-x-2 text-sm cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isAutoPaginationEnabled}
                    onChange={(e) => setIsAutoPaginationEnabled(e.target.checked)}
                    className="rounded text-blue-600 focus:ring-blue-500"
                  />
                  <span>Auto pagination</span>
                </label>
                
                <label className="flex items-center space-x-2 text-sm cursor-pointer">
                  <input
                    type="checkbox"
                    checked={showPageBoundaries}
                    onChange={(e) => setShowPageBoundaries(e.target.checked)}
                    className="rounded text-blue-600 focus:ring-blue-500"
                  />
                  <span>Page boundaries</span>
                </label>
              </div>
              
              <div className="w-px h-6 bg-gray-300" />
              
              <button
                onClick={insertPageBreak}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm"
              >
                Insert Page Break
              </button>
              
              <button
                onClick={() => setIsPreviewMode(!isPreviewMode)}
                className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                title="Toggle Preview"
              >
                <Eye size={18} />
              </button>
              
              <button
                onClick={handlePrint}
                className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                title="Print Document"
              >
                <Printer size={18} />
              </button>
              
              <button
                onClick={handleExport}
                className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                title="Export Document"
              >
                <Download size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Toolbar */}
      {!isPreviewMode && <DocumentToolbar editor={editor} />}

      {/* Document Container */}
      <div className="max-w-6xl mx-auto px-6 py-8">
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
              transform: window.innerWidth < 900 ? 'scale(0.8)' : 'scale(1)'
            }}
          >
            {/* Page Header */}
            {showPageBoundaries && (
              <div className="no-print absolute top-0 left-0 right-0 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-blue-200 flex items-center justify-center text-sm text-blue-700 font-medium"
                   style={{ height: `${HEADER_HEIGHT}px` }}>
                Legal Document - A4 Format
              </div>
            )}
            
            {/* Content Area */}
            <div 
              style={{ 
                paddingTop: showPageBoundaries ? `${HEADER_HEIGHT + PAGE_MARGIN}px` : `${PAGE_MARGIN}px`,
                paddingBottom: showPageBoundaries ? `${FOOTER_HEIGHT + PAGE_MARGIN}px` : `${PAGE_MARGIN}px`,
                paddingLeft: `${PAGE_MARGIN}px`,
                paddingRight: `${PAGE_MARGIN}px`,
                minHeight: `${CONTENT_HEIGHT}px`
              }}
            >
              <EditorContent 
                editor={editor} 
                className="min-h-full focus:outline-none"
              />
            </div>
            
            {/* Page Footer */}
            {showPageBoundaries && (
              <div className="no-print absolute bottom-0 left-0 right-0 bg-gradient-to-r from-gray-50 to-slate-50 border-t border-gray-200 flex items-center justify-between px-6 text-sm text-gray-600"
                   style={{ height: `${FOOTER_HEIGHT}px` }}>
                <span>A4 Document Editor</span>
                <span className="font-medium">Page {currentPage}</span>
              </div>
            )}
            
            {/* Page boundaries indicator */}
            {showPageBoundaries && (
              <div className="no-print absolute -top-2 -left-2 -right-2 -bottom-2 border-2 border-dashed border-blue-300 rounded-lg pointer-events-none opacity-50" />
            )}
          </div>
        </div>
        
        {/* Additional pages indicator */}
        {totalPages > 1 && showPageBoundaries && (
          <div className="no-print mt-4 text-center">
            <div className="inline-flex items-center space-x-2 text-sm text-gray-500">
              <Settings size={14} />
              <span>Document has {totalPages} pages • Use Ctrl+Enter to insert manual page breaks</span>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default DocumentEditor