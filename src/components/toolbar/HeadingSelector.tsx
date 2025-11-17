import React from 'react';
import { Editor } from '@tiptap/react';
import { setHeadingOnSelection } from '../../utils/editorCommands';

interface HeadingSelectorProps {
  editor: Editor;
}

const HeadingSelector: React.FC<HeadingSelectorProps> = ({ editor }) => {
  const getCurrentValue = () => {
    if (editor.isActive('heading', { level: 1 })) return 'h1';
    if (editor.isActive('heading', { level: 2 })) return 'h2';
    if (editor.isActive('heading', { level: 3 })) return 'h3';
    if (editor.isActive('heading', { level: 4 })) return 'h4';
    return 'p';
  };

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    if (value === 'p') {
      editor.chain().focus().setParagraph().run();
    } else {
      const level = parseInt(value.replace('h', '')) as 1 | 2 | 3 | 4;
      setHeadingOnSelection(editor, level);
    }
  };

  return (
    <select
      value={getCurrentValue()}
      onChange={handleChange}
      className="px-3 py-2 text-sm border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
    >
      <option value="p">Paragraph</option>
      <option value="h1">Heading 1</option>
      <option value="h2">Heading 2</option>
      <option value="h3">Heading 3</option>
      <option value="h4">Heading 4</option>
    </select>
  );
};

export default HeadingSelector;
