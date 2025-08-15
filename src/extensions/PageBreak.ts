import { Node, mergeAttributes } from '@tiptap/core';

export interface PageBreakOptions {
  HTMLAttributes: Record<string, any>;
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    setPageBreak: {
      /**
       * Add a page break
       */
      setPageBreak: (options?: { manual?: boolean }) => ReturnType;
    };
  }
}

export const PageBreak = Node.create<PageBreakOptions>({
  name: 'pageBreak',

  group: 'block',

  addOptions() {
    return {
      HTMLAttributes: {},
    };
  },

  addAttributes() {
    return {
      'data-manual-page-break': {
        default: null,
        parseHTML: (element) => element.getAttribute('data-manual-page-break'),
      },
      'data-auto-page-break': {
        default: null,
        parseHTML: (element) => element.getAttribute('data-auto-page-break'),
      },
    };
  },

  parseHTML() {
    return [{ tag: 'hr[data-page-break]' }];
  },

  renderHTML({ HTMLAttributes }) {
    return ['hr', mergeAttributes(this.options.HTMLAttributes, HTMLAttributes, { 'data-page-break': 'true' })];
  },

  addCommands() {
    return {
      setPageBreak: (options) => ({ commands }) => {
        return commands.insertContent({ type: this.name, attrs: { 'data-manual-page-break': options?.manual ? 'true' : null } });
      },
    };
  },
});