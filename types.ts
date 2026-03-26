export interface VideoGenerationState {
  status: 'idle' | 'uploading' | 'generating' | 'polling' | 'completed' | 'error';
  progress?: number; // 0-100 for simulated progress
  error?: string;
  videoUrl?: string;
}

export interface GenerationConfig {
  prompt: string;
  aspectRatio: '16:9' | '9:16';
  resolution: '720p' | '1080p';
}

export enum AspectRatio {
  Landscape = '16:9',
  Portrait = '9:16',
}

// Augment window for the AI Studio helper
declare global {
  interface AIStudio {
    hasSelectedApiKey: () => Promise<boolean>;
    openSelectKey: () => Promise<void>;
  }
}
