import React from 'react';
import { Editor } from '@tiptap/react';

interface FontSizeSelectorProps {
  editor: Editor;
}

const FontSizeSelector: React.FC<FontSizeSelectorProps> = ({ editor }) => {
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const size = e.target.value;
    if (size === 'normal') {
      editor.chain().focus().unsetFontSize().run();
    } else {
      editor.chain().focus().setFontSize(size).run();
    }
  };

  return (
    <select
      onChange={handleChange}
      className="px-3 py-2 text-sm border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      defaultValue="normal"
    >
      <option value="normal">Normal</option>
      <option value="12pt">Small</option>
      <option value="14pt">Medium</option>
      <option value="18pt">Large</option>
      <option value="24pt">X-Large</option>
      <option value="32pt">XX-Large</option>
    </select>
  );
};

export default FontSizeSelector;
