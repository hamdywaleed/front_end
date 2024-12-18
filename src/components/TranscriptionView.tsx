import React from 'react';
import { Download } from 'lucide-react';
import { TranscriptionMessage } from '../types';
import { formatTimestamp, downloadText } from '../utils/audio';

interface TranscriptionViewProps {
  messages: TranscriptionMessage[];
}

export const TranscriptionView: React.FC<TranscriptionViewProps> = ({ messages }) => {
  const handleDownload = () => {
    const content = messages
      .map(msg => `[${formatTimestamp(msg.timestamp)}] ${msg.text}`)
      .join('\n');
    downloadText(content, 'transcription.txt');
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Transcription</h2>
        {messages.length > 0 && (
          <button
            onClick={handleDownload}
            className="flex items-center space-x-2 text-blue-600 hover:text-blue-700"
          >
            <Download className="h-5 w-5" />
            <span>Download</span>
          </button>
        )}
      </div>
      <div className="h-[400px] overflow-y-auto space-y-2">
        {messages.map((msg, index) => (
          <div key={index} className="border-b border-gray-100 py-2">
            <span className="text-sm text-gray-500">[{formatTimestamp(msg.timestamp)}]</span>
            <p className="mt-1">{msg.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
};