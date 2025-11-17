import { useRef, useCallback } from 'react';
import { Editor } from '@tiptap/react';
import { DOMSerializer } from 'prosemirror-model';
import { CONTENT_HEIGHT } from '../constants';

interface UsePaginationProps {
  editor: Editor | null;
  contentRef: React.RefObject<HTMLDivElement>;
  isAutoPaginationEnabled: boolean;
  onTotalPagesChange: (pages: number) => void;
  onCurrentPageChange: (page: number) => void;
}

export const usePagination = ({
  editor,
  contentRef,
  isAutoPaginationEnabled,
  onTotalPagesChange,
  onCurrentPageChange,
}: UsePaginationProps) => {
  const paginationTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastContentHtml = useRef('');
  const isPaginating = useRef(false);

  const getNodeHeight = useCallback(
    (node: any): number => {
      if (!contentRef.current || !editor) return 0;

      // Create a temporary div to render the node and measure its height
      const tempDiv = document.createElement('div');
      tempDiv.style.width = `${contentRef.current.clientWidth}px`;
      tempDiv.style.visibility = 'hidden';
      tempDiv.style.position = 'absolute';
      tempDiv.style.pointerEvents = 'none'; // Ensure it doesn't interfere with events

      // Serialize the ProseMirror node to a DOM node
      const serializer = DOMSerializer.fromSchema(editor.schema);
      const domNode = serializer.serializeNode(node);

      tempDiv.appendChild(domNode);
      document.body.appendChild(tempDiv);

      const height = tempDiv.offsetHeight;
      document.body.removeChild(tempDiv); // Clean up the temporary div

      return height;
    },
    [contentRef, editor]
  );

  const calculatePagination = useCallback(() => {
    if (!editor || !contentRef.current || isPaginating.current) return;

    isPaginating.current = true;

    const editorElement = contentRef.current.querySelector('.ProseMirror');
    if (!editorElement) {
      isPaginating.current = false;
      return;
    }

    // Step 1: Remove all auto page breaks
    const removeTr = editor.state.tr;
    let hasChanges = false;
    const nodesToDelete: Array<{ pos: number; size: number }> = [];

    editor.state.doc.descendants((node, pos) => {
      if (node.type.name === 'pageBreak' && node.attrs['data-auto-page-break']) {
        nodesToDelete.push({ pos, size: node.nodeSize });
        hasChanges = true;
      }
    });

    // Delete in reverse order to maintain correct positions
    for (let i = nodesToDelete.length - 1; i >= 0; i--) {
      const { pos, size } = nodesToDelete[i];
      removeTr.delete(pos, pos + size);
    }

    if (hasChanges) {
      editor.view.dispatch(removeTr);
    }

    // Step 2: Calculate new page breaks and count pages
    requestAnimationFrame(() => {
      const insertTr = editor.state.tr;
      let currentHeight = 0;
      let pageCount = 1;
      const pagesToInsert: Array<{ pos: number }> = [];

      editor.state.doc.forEach((node, pos) => {
        if (node.type.name === 'pageBreak') {
          // Manual page break - reset height and increment page count
          currentHeight = 0;
          pageCount++;
          return;
        }

        const nodeHeight = getNodeHeight(editor.view.nodeDOM(pos));

        if (currentHeight + nodeHeight > CONTENT_HEIGHT && currentHeight > 0) {
          // Need to insert a page break before this node
          pagesToInsert.push({ pos });
          pageCount++;
          currentHeight = nodeHeight;
        } else {
          currentHeight += nodeHeight;
        }
      });

      // Insert page breaks in reverse order to maintain correct positions
      for (let i = pagesToInsert.length - 1; i >= 0; i--) {
        const { pos } = pagesToInsert[i];
        const pageBreakNode = editor.schema.nodes.pageBreak.create({ 'data-auto-page-break': 'true' });
        insertTr.insert(pos, pageBreakNode);
      }

      if (pagesToInsert.length > 0) {
        insertTr.setMeta('pagination', 'end');
        editor.view.dispatch(insertTr);
      }

      onTotalPagesChange(pageCount);

      setTimeout(() => {
        isPaginating.current = false;
      }, 100);
    });
  }, [editor, contentRef, getNodeHeight, onTotalPagesChange]);

  const updateCurrentPage = useCallback(() => {
    if (!editor || !contentRef.current) return;

    const selection = editor.state.selection;
    const pos = selection.$head.pos;

    const editorElement = contentRef.current.querySelector('.ProseMirror');
    if (!editorElement) return;

    let pageBreaksBefore = 0;
    editor.state.doc.nodesBetween(0, pos, (node) => {
      if (node.type.name === 'pageBreak') {
        pageBreaksBefore++;
      }
    });

    onCurrentPageChange(pageBreaksBefore + 1);
  }, [editor, contentRef, onCurrentPageChange]);

  const schedulePagination = useCallback(
    (content: string) => {
      if (!isAutoPaginationEnabled || content === lastContentHtml.current) return;

      if (editor?.state.tr.getMeta('pagination') === 'end') {
        lastContentHtml.current = content;
        return;
      }

      lastContentHtml.current = content;

      if (paginationTimeout.current) {
        clearTimeout(paginationTimeout.current);
      }

      paginationTimeout.current = setTimeout(() => {
        requestAnimationFrame(() => {
          calculatePagination();
        });
      }, 300);
    },
    [isAutoPaginationEnabled, calculatePagination, editor]
  );

  return {
    calculatePagination,
    updateCurrentPage,
    schedulePagination,
  };
};
