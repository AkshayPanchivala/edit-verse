import React from 'react';
import { Editor } from '@tiptap/react';
import ToolbarButton from './ToolbarButton';
import ToolbarSeparator from './ToolbarSeparator';
import FormattingButtonGroup from './toolbar/FormattingButtonGroup';
import AlignmentButtonGroup from './toolbar/AlignmentButtonGroup';
import ListButtonGroup from './toolbar/ListButtonGroup';
import FontSizeSelector from './toolbar/FontSizeSelector';
import HeadingSelector from './toolbar/HeadingSelector';
import HistoryButtonGroup from './toolbar/HistoryButtonGroup';

interface DocumentToolbarProps {
  editor: Editor | null;
  insertPageBreak: () => void;
  toggleDebug: () => void;
}

const DocumentToolbar: React.FC<DocumentToolbarProps> = ({ editor, insertPageBreak, toggleDebug }) => {
  if (!editor) return null;

  return (
    <div className="no-print bg-white border-b sticky top-20 z-10 shadow-sm">
      <div className="max-w-6xl mx-auto px-6 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-1">
            <FormattingButtonGroup editor={editor} />
            <ToolbarSeparator />
            <FontSizeSelector editor={editor} />
            <ToolbarSeparator />
            <AlignmentButtonGroup editor={editor} />
            <ToolbarSeparator />
            <ListButtonGroup editor={editor} />
            <ToolbarSeparator />
            <HeadingSelector editor={editor} />
          </div>
          <div className="flex items-center space-x-1">
            <HistoryButtonGroup editor={editor} />
            <ToolbarSeparator />
            <ToolbarButton onClick={insertPageBreak} title="Insert Page Break">
              Insert Page Break
            </ToolbarButton>
            <ToolbarSeparator />
            <ToolbarButton onClick={toggleDebug} title="Toggle Debug Mode">
              Debug
            </ToolbarButton>
            <ToolbarSeparator />
            <div className="text-sm text-gray-500 bg-gray-50 px-3 py-2 rounded-lg">
              Use <kbd className="bg-gray-200 px-1 rounded text-xs">Ctrl+Enter</kbd> for page breaks
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentToolbar;
