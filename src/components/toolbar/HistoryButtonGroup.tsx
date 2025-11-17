import React from 'react';
import { Editor } from '@tiptap/react';
import { RotateCcw, RotateCw } from 'lucide-react';
import ToolbarButton from '../ToolbarButton';

interface HistoryButtonGroupProps {
  editor: Editor;
}

const HistoryButtonGroup: React.FC<HistoryButtonGroupProps> = ({ editor }) => {
  return (
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
    </div>
  );
};

export default HistoryButtonGroup;
