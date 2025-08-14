import { Node, mergeAttributes } from '@tiptap/core'
import { ReactNodeViewRenderer } from '@tiptap/react'
import PageBreakComponent from '../components/PageBreakComponent'

export interface PageBreakOptions {
  HTMLAttributes: Record<string, any>
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    pageBreak: {
      setPageBreak: () => ReturnType
    }
  }
}

export const PageBreak = Node.create<PageBreakOptions>({
  name: 'pageBreak',

  group: 'block',

  atom: true,

  parseHTML() {
    return [
      {
        tag: 'div[data-page-break]',
      },
    ]
  },

  renderHTML({ HTMLAttributes }) {
    return [
      'div',
      mergeAttributes(HTMLAttributes, {
        'data-page-break': 'true',
        style: 'page-break-before: always; break-before: page; height: 0; border: none; margin: 0; padding: 0; display: block;'
      }),
    ]
  },

  addNodeView() {
    return ReactNodeViewRenderer(PageBreakComponent)
  },

  addCommands() {
    return {
      setPageBreak:
        () =>
        ({ chain }) => {
          return chain()
            .insertContent({ type: this.name })
            .run()
        },
    }
  },

  addKeyboardShortcuts() {
    return {
      'Ctrl-Enter': () => this.editor.commands.setPageBreak(),
      'Cmd-Enter': () => this.editor.commands.setPageBreak(),
    }
  },
})