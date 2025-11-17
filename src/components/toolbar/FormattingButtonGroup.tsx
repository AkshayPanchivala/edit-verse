import React from 'react';
import { Editor } from '@tiptap/react';
import { Bold, Italic, Underline } from 'lucide-react';
import ToolbarButton from '../ToolbarButton';

interface FormattingButtonGroupProps {
  editor: Editor;
}

const FormattingButtonGroup: React.FC<FormattingButtonGroupProps> = ({ editor }) => {
  return (
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
  );
};

export default FormattingButtonGroup;
