import React from 'react';
import { Settings } from 'lucide-react';

interface DocumentFooterProps {
  totalPages: number;
  showPageBoundaries: boolean;
}

const DocumentFooter: React.FC<DocumentFooterProps> = ({ totalPages, showPageBoundaries }) => {
  return (
    <>
      {totalPages > 1 && showPageBoundaries && (
        <div className="no-print mt-4 text-center">
          <div className="inline-flex items-center space-x-2 text-sm text-gray-500">
            <Settings size={14} />
            <span>Document has {totalPages} pages • Use Ctrl+Enter to insert manual page breaks</span>
          </div>
        </div>
      )}
    </>
  );
};

export default DocumentFooter;
