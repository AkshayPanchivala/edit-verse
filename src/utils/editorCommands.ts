import { Editor } from '@tiptap/react';

export const toggleBulletListOnSelection = (editor: Editor) => {
  const { from, to, empty } = editor.state.selection;

  if (empty) {
    // No selection, toggle the current block
    editor.chain().focus().toggleBulletList().run();
    return;
  }

  // Get selected text
  const selectedText = editor.state.doc.textBetween(from, to, ' ');

  // Delete selected text and insert as bullet list
  editor
    .chain()
    .focus()
    .deleteRange({ from, to })
    .insertContent([
      {
        type: 'bulletList',
        content: [
          {
            type: 'listItem',
            content: [
              {
                type: 'paragraph',
                content: [{ type: 'text', text: selectedText }],
              },
            ],
          },
        ],
      },
    ])
    .run();
};

export const toggleOrderedListOnSelection = (editor: Editor) => {
  const { from, to, empty } = editor.state.selection;

  if (empty) {
    // No selection, toggle the current block
    editor.chain().focus().toggleOrderedList().run();
    return;
  }

  // Get selected text
  const selectedText = editor.state.doc.textBetween(from, to, ' ');

  // Delete selected text and insert as ordered list
  editor
    .chain()
    .focus()
    .deleteRange({ from, to })
    .insertContent([
      {
        type: 'orderedList',
        content: [
          {
            type: 'listItem',
            content: [
              {
                type: 'paragraph',
                content: [{ type: 'text', text: selectedText }],
              },
            ],
          },
        ],
      },
    ])
    .run();
};

export const setHeadingOnSelection = (editor: Editor, level: 1 | 2 | 3 | 4) => {
  const { from, to, empty } = editor.state.selection;

  if (empty) {
    // No selection, toggle the current block
    editor.chain().focus().toggleHeading({ level }).run();
    return;
  }

  // Get selected text
  const selectedText = editor.state.doc.textBetween(from, to, ' ');

  // Delete selected text and insert as heading
  editor
    .chain()
    .focus()
    .deleteRange({ from, to })
    .insertContent({
      type: 'heading',
      attrs: { level },
      content: [{ type: 'text', text: selectedText }],
    })
    .run();
};
