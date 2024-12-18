import React from 'react';
import { Download, Loader } from 'lucide-react';
import { downloadText } from '../utils/audio';

interface SummaryViewProps {
  summary: string;
  isLoading: boolean;
  onGenerateSummary: () => void;
}

export const SummaryView: React.FC<SummaryViewProps> = ({
  summary,
  isLoading,
  onGenerateSummary,
}) => {
  const handleDownload = () => {
    downloadText(summary, 'summary.txt');
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Summary</h2>
        <div className="flex space-x-4">
          {summary && (
            <button
              onClick={handleDownload}
              className="flex items-center space-x-2 text-blue-600 hover:text-blue-700"
            >
              <Download className="h-5 w-5" />
              <span>Download</span>
            </button>
          )}
          <button
            onClick={onGenerateSummary}
            disabled={isLoading}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <Loader className="h-5 w-5 animate-spin" />
                <span>Generating...</span>
              </>
            ) : (
              <span>Generate Summary</span>
            )}
          </button>
        </div>
      </div>
      <div className="h-[400px] overflow-y-auto p-4 bg-gray-50 rounded-md">
        {isLoading ? (
          <div className="flex items-center justify-center h-full text-gray-500">
            Generating summary...
          </div>
        ) : summary ? (
          <p className="whitespace-pre-wrap">{summary}</p>
        ) : (
          <div className="flex items-center justify-center h-full text-gray-500">
            Click "Generate Summary" to create a summary of the recorded meeting
          </div>
        )}
      </div>
    </div>
  );
};