import React from 'react';
import { Clock } from 'lucide-react';
import { formatDuration } from '../utils/audioUtils';

interface TimerProps {
  duration: number;
}

export const Timer: React.FC<TimerProps> = ({ duration }) => {
  return (
    <div className="flex items-center space-x-2 text-gray-600 bg-white px-3 py-1 rounded-md shadow-sm">
      <Clock className="h-5 w-5" />
      <span className="font-mono text-lg">{formatDuration(duration)}</span>
    </div>
  );
};