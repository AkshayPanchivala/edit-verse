import { useCallback } from 'react';
import { Editor } from '@tiptap/react';

export const useDocumentExport = (editor: Editor | null) => {
  const getExportStyles = useCallback(() => {
    return `
      @page {
        size: A4;
        margin: 2cm;
        counter-increment: page;

        @top-center {
          content: "Legal Document";
          font-family: Arial, sans-serif;
          font-size: 10pt;
          color: #666;
          border-bottom: 1px solid #ddd;
          padding-bottom: 0.5cm;
        }

        @bottom-center {
          content: "Page " counter(page) " of " counter(pages);
          font-family: Arial, sans-serif;
          font-size: 10pt;
          color: #666;
          border-top: 1px solid #ddd;
          padding-top: 0.5cm;
        }
      }

      body {
        font-family: 'Times New Roman', serif;
        font-size: 12pt;
        line-height: 1.6;
        margin: 0;
        padding: 0;
        counter-reset: page;
      }

      .document-export {
        max-width: 100%;
      }

      [data-page-break] {
        page-break-before: always !important;
        break-before: page !important;
        height: 0 !important;
        border: none !important;
        margin: 0 !important;
        padding: 0 !important;
        display: block !important;
      }

      h1, h2, h3, h4, h5, h6 {
        break-after: avoid;
        page-break-after: avoid;
        orphans: 3;
        widows: 3;
      }

      p {
        margin: 0 0 12pt 0;
        orphans: 3;
        widows: 3;
      }

      ul, ol {
        break-inside: avoid;
        page-break-inside: avoid;
      }
    `;
  }, []);

  const handleExport = useCallback(() => {
    const content = editor?.getHTML();
    if (!content) return;

    const exportContent = `
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8">
          <title>Legal Document Export</title>
          <style>${getExportStyles()}</style>
        </head>
        <body>
          <div class="document-export">${content}</div>
        </body>
      </html>
    `;

    const blob = new Blob([exportContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'document.html';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [editor, getExportStyles]);

  const handlePrint = useCallback(() => {
    window.print();
  }, []);

  return {
    handleExport,
    handlePrint,
  };
};
