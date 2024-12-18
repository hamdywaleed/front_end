export interface TranscriptionMessage {
  text: string;
  timestamp: number;
  mode: 'both';
}

export interface ErrorState {
  type: 'microphone' | 'connection' | 'transcription' | null;
  message: string;
}

export interface AudioState {
  isRecording: boolean;
  startTime: number | null;
  duration: number;
}

export * from './audio';