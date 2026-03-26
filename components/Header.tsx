import React from 'react';
import { Film, User, Sparkles } from 'lucide-react';

export const Header: React.FC = () => {
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="bg-blue-600 p-2 rounded-lg">
            <Film className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-xl font-bold text-gray-900 tracking-tight">
            Veo <span className="text-blue-600">Animator</span>
          </h1>
        </div>
        
        <div className="flex items-center gap-4">
          <a 
            href="https://ai.google.dev/gemini-api/docs/models/veo" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-sm text-gray-500 hover:text-blue-600 transition-colors hidden sm:block"
          >
            Veo 3.1 Documentation
          </a>
          <button 
            onClick={() => window.aistudio?.openSelectKey()}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
          >
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>API Key</span>
          </button>
        </div>
      </div>
    </header>
  );
};