import React from 'react'
import { Editor } from '@tiptap/react'
import { 
  Bold, 
  Italic, 
  Underline, 
  AlignLeft, 
  AlignCenter, 
  AlignRight,
  List,
  ListOrdered,
  Type,
  Minus,
  RotateCcw,
  RotateCw
} from 'lucide-react'

interface DocumentToolbarProps {
  editor: Editor | null
}

const DocumentToolbar: React.FC<DocumentToolbarProps> = ({ editor }) => {
  if (!editor) return null

  const ToolbarButton: React.FC<{
    onClick: () => void
    isActive?: boolean
    children: React.ReactNode
    title: string
    disabled?: boolean
  }> = ({ onClick, isActive = false, children, title, disabled = false }) => (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`p-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
        isActive 
          ? 'bg-blue-600 text-white shadow-sm' 
          : disabled
          ? 'text-gray-400 cursor-not-allowed'
          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
      }`}
      title={title}
    >
      {children}
    </button>
  )

  const ToolbarSeparator = () => (
    <div className="w-px h-6 bg-gray-300 mx-1" />
  )

  return (
    <div className="no-print bg-white border-b sticky top-20 z-10 shadow-sm">
      <div className="max-w-6xl mx-auto px-6 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-1">
            {/* Text Formatting */}
            <div className="flex items-center space-x-1 bg-gray-50 rounded-lg p-1">
              <ToolbarButton
                onClick={() => editor.chain().focus().toggleBold().run()}
                isActive={editor.isActive('bold')}
                title="Bold (Ctrl+B)"
              >
                <Bold size={16} />
              </ToolbarButton>
              
              <ToolbarButton
                onClick={() => editor.chain().focus().toggleItalic().run()}
                isActive={editor.isActive('italic')}
                title="Italic (Ctrl+I)"
              >
                <Italic size={16} />
              </ToolbarButton>
              
              <ToolbarButton
                onClick={() => editor.chain().focus().toggleUnderline().run()}
                isActive={editor.isActive('underline')}
                title="Underline (Ctrl+U)"
              >
                <Underline size={16} />
              </ToolbarButton>
            </div>

            <ToolbarSeparator />
            
            {/* Text Alignment */}
            <div className="flex items-center space-x-1 bg-gray-50 rounded-lg p-1">
              <ToolbarButton
                onClick={() => editor.chain().focus().setTextAlign('left').run()}
                isActive={editor.isActive({ textAlign: 'left' }) || !editor.isActive({ textAlign: 'center' }) && !editor.isActive({ textAlign: 'right' })}
                title="Align Left"
              >
                <AlignLeft size={16} />
              </ToolbarButton>
              
              <ToolbarButton
                onClick={() => editor.chain().focus().setTextAlign('center').run()}
                isActive={editor.isActive({ textAlign: 'center' })}
                title="Align Center"
              >
                <AlignCenter size={16} />
              </ToolbarButton>
              
              <ToolbarButton
                onClick={() => editor.chain().focus().setTextAlign('right').run()}
                isActive={editor.isActive({ textAlign: 'right' })}
                title="Align Right"
              >
                <AlignRight size={16} />
              </ToolbarButton>
            </div>

            <ToolbarSeparator />
            
            {/* Lists */}
            <div className="flex items-center space-x-1 bg-gray-50 rounded-lg p-1">
              <ToolbarButton
                onClick={() => editor.chain().focus().toggleBulletList().run()}
                isActive={editor.isActive('bulletList')}
                title="Bullet List"
              >
                <List size={16} />
              </ToolbarButton>
              
              <ToolbarButton
                onClick={() => editor.chain().focus().toggleOrderedList().run()}
                isActive={editor.isActive('orderedList')}
                title="Numbered List"
              >
                <ListOrdered size={16} />
              </ToolbarButton>
            </div>

            <ToolbarSeparator />

            {/* Headings */}
            <div className="flex items-center space-x-1">
              <select
                value={
                  editor.isActive('heading', { level: 1 }) ? 'h1' :
                  editor.isActive('heading', { level: 2 }) ? 'h2' :
                  editor.isActive('heading', { level: 3 }) ? 'h3' :
                  'p'
                }
                onChange={(e) => {
                  const value = e.target.value
                  if (value === 'p') {
                    editor.chain().focus().setParagraph().run()
                  } else {
                    const level = parseInt(value.replace('h', ''))
                    editor.chain().focus().toggleHeading({ level }).run()
                  }
                }}
                className="px-3 py-2 text-sm border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="p">Paragraph</option>
                <option value="h1">Heading 1</option>
                <option value="h2">Heading 2</option>
                <option value="h3">Heading 3</option>
              </select>
            </div>
          </div>

          {/* Right side controls */}
          <div className="flex items-center space-x-1">
            <ToolbarButton
              onClick={() => editor.chain().focus().undo().run()}
              disabled={!editor.can().undo()}
              title="Undo (Ctrl+Z)"
            >
              <RotateCcw size={16} />
            </ToolbarButton>
            
            <ToolbarButton
              onClick={() => editor.chain().focus().redo().run()}
              disabled={!editor.can().redo()}
              title="Redo (Ctrl+Y)"
            >
              <RotateCw size={16} />
            </ToolbarButton>

            <ToolbarSeparator />

            <div className="text-sm text-gray-500 bg-gray-50 px-3 py-2 rounded-lg">
              Use <kbd className="bg-gray-200 px-1 rounded text-xs">Ctrl+Enter</kbd> for page breaks
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DocumentToolbar