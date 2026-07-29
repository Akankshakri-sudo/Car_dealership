import React from 'react';
import { AlertCircle, X } from 'lucide-react';

const ErrorMessage = ({ message, onClose }) => {
  if (!message) return null;

  return (
    <div className="flex items-center justify-between p-4 mb-6 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-300 text-sm animate-fade-in">
      <div className="flex items-center space-x-3">
        <AlertCircle className="w-5 h-5 text-rose-400 flex-shrink-0" />
        <span>{message}</span>
      </div>
      {onClose && (
        <button
          onClick={onClose}
          className="text-rose-400 hover:text-rose-200 p-1 rounded-lg hover:bg-rose-500/20 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};

export default ErrorMessage;
