export interface AudioConfig {
  channelCount: number;
  sampleRate: number;
  echoCancellation: boolean;
  noiseSuppression: boolean;
}

export interface AudioData {
  buffer: ArrayBuffer;
  timestamp: number;
  mode: 'both';
}