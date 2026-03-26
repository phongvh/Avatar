import React from 'react';
import { AspectRatio } from '../types';
import { Wand2, MonitorPlay, Smartphone } from 'lucide-react';

interface ControlsProps {
  prompt: string;
  setPrompt: (s: string) => void;
  aspectRatio: string;
  setAspectRatio: (ar: '16:9' | '9:16') => void;
  onGenerate: () => void;
  isGenerating: boolean;
}

export const Controls: React.FC<ControlsProps> = ({ 
  prompt, 
  setPrompt, 
  aspectRatio, 
  setAspectRatio, 
  onGenerate, 
  isGenerating 
}) => {
  const suggestions = [
    "A digital human woman talking naturally, professional lighting",
    "A futuristic cyberpunk character speaking with emotion",
    "A 3D stylized avatar giving a presentation, confident gestures"
  ];

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 h-full flex flex-col">
      <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
        <Wand2 className="w-5 h-5 text-blue-600" />
        Configuration
      </h2>
      
      <div className="space-y-6 flex-grow">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Prompt
          </label>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            disabled={isGenerating}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-h-[120px] resize-none text-gray-900 placeholder-gray-400"
            placeholder="Describe the movement and scene..."
          />
          <div className="mt-2 flex flex-wrap gap-2">
            {suggestions.map((s, i) => (
              <button
                key={i}
                onClick={() => setPrompt(s)}
                disabled={isGenerating}
                className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-600 px-2 py-1 rounded-md transition-colors text-left"
              >
                {s.substring(0, 40)}...
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Aspect Ratio
          </label>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => setAspectRatio('16:9')}
              disabled={isGenerating}
              className={`flex items-center justify-center gap-2 p-3 rounded-lg border-2 transition-all ${
                aspectRatio === AspectRatio.Landscape
                  ? 'border-blue-600 bg-blue-50 text-blue-700'
                  : 'border-gray-200 hover:border-gray-300 text-gray-600'
              }`}
            >
              <MonitorPlay className="w-5 h-5" />
              <span>Landscape (16:9)</span>
            </button>
            <button
              onClick={() => setAspectRatio('9:16')}
              disabled={isGenerating}
              className={`flex items-center justify-center gap-2 p-3 rounded-lg border-2 transition-all ${
                aspectRatio === AspectRatio.Portrait
                  ? 'border-blue-600 bg-blue-50 text-blue-700'
                  : 'border-gray-200 hover:border-gray-300 text-gray-600'
              }`}
            >
              <Smartphone className="w-5 h-5" />
              <span>Portrait (9:16)</span>
            </button>
          </div>
        </div>
      </div>

      <div className="mt-6">
        <button
          onClick={onGenerate}
          disabled={isGenerating || !prompt.trim()}
          className={`w-full py-4 px-6 rounded-lg font-semibold text-white shadow-md transition-all flex items-center justify-center gap-2
            ${isGenerating || !prompt.trim()
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 hover:shadow-lg transform active:scale-[0.98]'
            }
          `}
        >
          {isGenerating ? (
            <>
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Generating Video...
            </>
          ) : (
            <>
              <Wand2 className="w-5 h-5" />
              Generate Video
            </>
          )}
        </button>
        {isGenerating && (
          <p className="text-xs text-center text-gray-500 mt-3 animate-pulse">
            This may take a minute. Please don't close the tab.
          </p>
        )}
      </div>
    </div>
  );
};