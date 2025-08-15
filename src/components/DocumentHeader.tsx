import React from 'react';
import { Download, Eye, FileText, Printer } from 'lucide-react';

interface DocumentHeaderProps {
  currentPage: number;
  totalPages: number;
  wordCount: number;
  isAutoPaginationEnabled: boolean;
  onAutoPaginationChange: (enabled: boolean) => void;
  showPageBoundaries: boolean;
  onShowPageBoundariesChange: (show: boolean) => void;
  onInsertPageBreak: () => void;
  isPreviewMode: boolean;
  onPreviewModeChange: (preview: boolean) => void;
  onPrint: () => void;
  onExport: () => void;
}

const DocumentHeader: React.FC<DocumentHeaderProps> = ({
  currentPage,
  totalPages,
  wordCount,
  isAutoPaginationEnabled,
  onAutoPaginationChange,
  showPageBoundaries,
  onShowPageBoundariesChange,
  onInsertPageBreak,
  isPreviewMode,
  onPreviewModeChange,
  onPrint,
  onExport,
}) => {
  return (
    <div className="no-print sticky top-0 z-20 bg-white shadow-sm border-b">
      <div className="w-16xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <FileText size={20} className="text-blue-600" />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">EditVerse</h1>
                <p className="text-sm text-gray-500">A robust and interactive web-based document editor.</p>
              </div>
            </div>
            <div className="flex items-center space-x-4 text-sm text-gray-600">
              <span className="flex items-center space-x-1">
                <span className="font-medium">Page:</span>
                <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded font-medium">
                  {currentPage} of {totalPages}
                </span>
              </span>
              <span>Words: <span className="font-medium">{wordCount.toLocaleString()}</span></span>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2">
              <label className="flex items-center space-x-2 text-sm cursor-pointer">
                <input
                  type="checkbox"
                  checked={isAutoPaginationEnabled}
                  onChange={(e) => onAutoPaginationChange(e.target.checked)}
                  className="rounded text-blue-600 focus:ring-blue-500"
                />
                <span>Auto pagination</span>
              </label>
              <label className="flex items-center space-x-2 text-sm cursor-pointer">
                <input
                  type="checkbox"
                  checked={showPageBoundaries}
                  onChange={(e) => onShowPageBoundariesChange(e.target.checked)}
                  className="rounded text-blue-600 focus:ring-blue-500"
                />
                <span>Page boundaries</span>
              </label>
            </div>
            <div className="w-px h-6 bg-gray-300" />
            <button
              onClick={onInsertPageBreak}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm"
            >
              Insert Page Break
            </button>
            <button
              onClick={() => onPreviewModeChange(!isPreviewMode)}
              className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
              title="Toggle Preview"
            >
              <Eye size={18} />
            </button>
            <button
              onClick={onPrint}
              className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
              title="Print Document"
            >
              <Printer size={18} />
            </button>
            <button
              onClick={onExport}
              className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
              title="Export Document"
            >
              <Download size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentHeader;
