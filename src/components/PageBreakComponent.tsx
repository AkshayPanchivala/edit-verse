import React from 'react'
import { NodeViewWrapper } from '@tiptap/react'
import { Scissors, Minus } from 'lucide-react'

const PageBreakComponent: React.FC = () => {
  return (
    <NodeViewWrapper className="page-break-wrapper my-6">
      <div className="page-break-indicator relative">
        <div className="flex items-center justify-center py-3">
          <div className="flex items-center space-x-3 bg-blue-50 text-blue-700 px-4 py-2 rounded-full border border-blue-200">
            <Scissors size={14} />
            <span className="text-sm font-medium">Page Break</span>
            <Scissors size={14} />
          </div>
        </div>
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t-2 border-dashed border-blue-300"></div>
        </div>
      </div>
    </NodeViewWrapper>
  )
}

export default PageBreakComponent