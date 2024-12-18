import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Mic, MicOff } from 'lucide-react';
import { Socket } from 'socket.io-client';
import { TranscriptionMessage, ErrorState, AudioState } from './types';
import { initializeSocket, disconnectSocket } from './utils/socket';
import { AudioRecorder } from './utils/audioRecorder';
import { ErrorMessage } from './components/ErrorMessage';
import { Timer } from './components/Timer';
import { TranscriptionView } from './components/TranscriptionView';
import { SummaryView } from './components/SummaryView';

function App() {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [messages, setMessages] = useState<TranscriptionMessage[]>([]);
  const [summary, setSummary] = useState('');
  const [error, setError] = useState<ErrorState>({ type: null, message: '' });
  const [audioState, setAudioState] = useState<AudioState>({
    isRecording: false,
    startTime: null,
    duration: 0,
  });
  const [isGeneratingSummary, setIsGeneratingSummary] = useState(false);

  const audioRecorder = useRef<AudioRecorder | null>(null);
  const timerRef = useRef<number>();

  const updateDuration = useCallback(() => {
    if (audioState.startTime && audioState.isRecording) {
      const now = Date.now();
      setAudioState(prev => ({
        ...prev,
        duration: (now - prev.startTime!) / 1000,
      }));
      timerRef.current = requestAnimationFrame(updateDuration);
    }
  }, [audioState.startTime, audioState.isRecording]);

  useEffect(() => {
    try {
      const newSocket = initializeSocket();
      setSocket(newSocket);

      newSocket.on('connect_error', () => {
        setError({
          type: 'connection',
          message: 'Failed to connect to the server. Please try again.',
        });
      });

      newSocket.on('transcription', (data: TranscriptionMessage) => {
        setMessages(prev => [...prev, data]);
      });

      return () => {
        if (audioRecorder.current) {
          audioRecorder.current.stop();
        }
        if (timerRef.current) {
          cancelAnimationFrame(timerRef.current);
        }
        disconnectSocket();
      };
    } catch (err) {
      setError({
        type: 'connection',
        message: 'Failed to initialize connection.',
      });
    }
  }, []);

  const startRecording = async () => {
    try {
      if (!socket) {
        throw new Error('Socket connection not established');
      }

      audioRecorder.current = new AudioRecorder(socket);
      await audioRecorder.current.start();

      const startTime = Date.now();
      setAudioState({
        isRecording: true,
        startTime,
        duration: 0,
      });

      timerRef.current = requestAnimationFrame(updateDuration);
      setError({ type: null, message: '' });

    } catch (err) {
      console.error('Recording error:', err);
      setError({
        type: 'microphone',
        message: 'Failed to access microphone. Please check permissions.',
      });
    }
  };

  const stopRecording = () => {
    if (audioRecorder.current && audioState.isRecording) {
      audioRecorder.current.stop();
      audioRecorder.current = null;

      if (timerRef.current) {
        cancelAnimationFrame(timerRef.current);
      }

      setAudioState(prev => ({
        ...prev,
        isRecording: false,
      }));
    }
  };

  const generateSummary = async () => {
    if (!messages.length) return;
    
    setIsGeneratingSummary(true);
    try {
      const response = await fetch('http://localhost:5000/summary', {
        method: 'POST',
      });
      
      if (!response.ok) throw new Error('Failed to generate summary');
      
      const data = await response.json();
      setSummary(data.summary);
    } catch (err) {
      setError({
        type: 'transcription',
        message: 'Failed to generate summary. Please try again.',
      });
    } finally {
      setIsGeneratingSummary(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <ErrorMessage 
        error={error} 
        onDismiss={() => setError({ type: null, message: '' })} 
      />
      
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">Meeting Transcription</h1>
          <div className="flex items-center space-x-4">
            {audioState.isRecording && <Timer duration={audioState.duration} />}
            <button
              onClick={audioState.isRecording ? stopRecording : startRecording}
              className={`flex items-center space-x-2 px-4 py-2 rounded-md ${
                audioState.isRecording
                  ? 'bg-red-600 hover:bg-red-700 text-white'
                  : 'bg-blue-600 hover:bg-blue-700 text-white'
              }`}
            >
              {audioState.isRecording ? (
                <>
                  <MicOff className="h-5 w-5" />
                  <span>Stop Recording</span>
                </>
              ) : (
                <>
                  <Mic className="h-5 w-5" />
                  <span>Start Recording</span>
                </>
              )}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-8">
          <TranscriptionView messages={messages} />
          <SummaryView
            summary={summary}
            isLoading={isGeneratingSummary}
            onGenerateSummary={generateSummary}
          />
        </div>
      </div>
    </div>
  );
}

export default App;