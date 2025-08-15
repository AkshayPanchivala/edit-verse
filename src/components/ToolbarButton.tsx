import React from 'react';

interface ToolbarButtonProps {
  onClick: () => void;
  isActive?: boolean;
  children: React.ReactNode;
  title: string;
  disabled?: boolean;
}

const ToolbarButton: React.FC<ToolbarButtonProps> = ({ onClick, isActive = false, children, title, disabled = false }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={`p-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
      isActive
        ? 'bg-blue-600 text-white shadow-sm'
        : disabled
        ? 'text-gray-400 cursor-not-allowed'
        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
    }`}
    title={title}
  >
    {children}
  </button>
);

export default ToolbarButton;
