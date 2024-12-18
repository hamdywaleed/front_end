import React from 'react';
import { AlertCircle } from 'lucide-react';
import { ErrorState } from '../types';

interface ErrorMessageProps {
  error: ErrorState;
  onDismiss: () => void;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({ error, onDismiss }) => {
  if (!error.type) return null;

  return (
    <div className="fixed top-4 right-4 bg-red-50 border-l-4 border-red-500 p-4 max-w-md">
      <div className="flex items-start">
        <AlertCircle className="h-5 w-5 text-red-500 mt-0.5" />
        <div className="ml-3">
          <h3 className="text-sm font-medium text-red-800">Error</h3>
          <p className="mt-1 text-sm text-red-700">{error.message}</p>
        </div>
        <button
          onClick={onDismiss}
          className="ml-auto -mx-1.5 -my-1.5 bg-red-50 text-red-500 rounded-lg p-1.5 hover:bg-red-100"
        >
          <span className="sr-only">Dismiss</span>
          <span className="h-5 w-5">×</span>
        </button>
      </div>
    </div>
  );
};