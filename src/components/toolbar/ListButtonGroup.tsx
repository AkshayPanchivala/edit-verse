import React from 'react';
import { Editor } from '@tiptap/react';
import { List, ListOrdered } from 'lucide-react';
import ToolbarButton from '../ToolbarButton';
import { toggleBulletListOnSelection, toggleOrderedListOnSelection } from '../../utils/editorCommands';

interface ListButtonGroupProps {
  editor: Editor;
}

const ListButtonGroup: React.FC<ListButtonGroupProps> = ({ editor }) => {
  return (
    <div className="flex items-center space-x-1 bg-gray-50 rounded-lg p-1">
      <ToolbarButton
        onClick={() => toggleBulletListOnSelection(editor)}
        isActive={editor.isActive('bulletList')}
        title="Bullet List"
      >
        <List size={16} />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => toggleOrderedListOnSelection(editor)}
        isActive={editor.isActive('orderedList')}
        title="Numbered List"
      >
        <ListOrdered size={16} />
      </ToolbarButton>
    </div>
  );
};

export default ListButtonGroup;
