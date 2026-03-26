import React, { useState } from 'react';
import { Header } from './components/Header';
import { UploadZone } from './components/UploadZone';
import { Controls } from './components/Controls';
import { VideoGenerationState, AspectRatio } from './types';
import { ensureApiKey, generateVideo } from './services/veoService';
import { AlertCircle, Download, Play, CheckCircle2 } from 'lucide-react';

const App: React.FC = () => {
  const [prompt, setPrompt] = useState('A professional digital human woman talking naturally, slight smile, blinking, studio lighting, 4k detail');
  const [aspectRatio, setAspectRatio] = useState<'16:9' | '9:16'>('9:16');
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [generationState, setGenerationState] = useState<VideoGenerationState>({ status: 'idle' });

  const handleImageSelect = (file: File) => {
    setSelectedImage(file);
    setGenerationState({ status: 'idle' });
  };

  const handleClear = () => {
    setSelectedImage(null);
    setGenerationState({ status: 'idle' });
  };

  const handleGenerate = async () => {
    if (!selectedImage) return;

    try {
      setGenerationState({ status: 'idle' }); // Reset errors
      
      // 1. Check API Key
      const hasKey = await ensureApiKey();
      if (!hasKey) {
        setGenerationState({ status: 'error', error: "API Key selection was cancelled or failed." });
        return;
      }

      // 2. Start Generation
      setGenerationState({ status: 'generating' });
      
      const videoUrl = await generateVideo(selectedImage, {
        prompt,
        aspectRatio,
        resolution: '720p',
      });

      setGenerationState({ status: 'completed', videoUrl });

    } catch (e: any) {
      console.error(e);
      let errorMessage = "An unexpected error occurred.";
      if (e.message) {
        if (e.message.includes('403')) errorMessage = "Access denied. Please check if your project has the Veo API enabled and billing set up.";
        else if (e.message.includes('429')) errorMessage = "Quota exceeded. Please try again later.";
        else errorMessage = e.message;
      }
      setGenerationState({ status: 'error', error: errorMessage });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />

      <main className="flex-grow container mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Bring Avatars to Life</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Upload a portrait and use AI to animate it into a video. Perfect for digital humans, virtual assistants, and creative storytelling.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column: Input */}
            <div className="space-y-6">
              <UploadZone 
                onImageSelected={handleImageSelect} 
                selectedImage={selectedImage}
                onClear={handleClear}
                disabled={generationState.status === 'generating' || generationState.status === 'polling'}
              />
              
              {/* Output for mobile layout (stacked) or just general output area if completed */}
              {generationState.status === 'completed' && generationState.videoUrl && (
                 <div className="block lg:hidden bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                   <h3 className="text-lg font-semibold mb-3 flex items-center gap-2 text-green-700">
                     <CheckCircle2 className="w-5 h-5"/> Result
                   </h3>
                   <video 
                     src={generationState.videoUrl} 
                     controls 
                     autoPlay 
                     loop 
                     className="w-full rounded-lg bg-black"
                   />
                    <div className="mt-4 flex justify-end">
                      <a 
                        href={generationState.videoUrl} 
                        download="veo_generated.mp4"
                        className="flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium"
                      >
                        <Download className="w-4 h-4" /> Download Video
                      </a>
                    </div>
                 </div>
              )}
            </div>

            {/* Right Column: Controls & Desktop Output */}
            <div className="flex flex-col h-full gap-6">
              <Controls 
                prompt={prompt}
                setPrompt={setPrompt}
                aspectRatio={aspectRatio}
                setAspectRatio={setAspectRatio}
                onGenerate={handleGenerate}
                isGenerating={generationState.status === 'generating' || generationState.status === 'polling'}
              />

              {/* Error Message */}
              {generationState.status === 'error' && (
                <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg animate-fade-in">
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <AlertCircle className="h-5 w-5 text-red-500" />
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-red-800">Generation Failed</h3>
                      <div className="mt-2 text-sm text-red-700">{generationState.error}</div>
                    </div>
                  </div>
                </div>
              )}

              {/* Desktop Output Preview (Only shows when completed) */}
              {generationState.status === 'completed' && generationState.videoUrl && (
                <div className="hidden lg:block bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex-grow">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                       <Play className="w-5 h-5 text-blue-600 fill-current" /> Generated Video
                    </h3>
                    <span className="text-xs font-mono text-gray-400 bg-gray-100 px-2 py-1 rounded">veo-3.1</span>
                  </div>
                  <div className="aspect-video bg-gray-900 rounded-lg overflow-hidden relative flex items-center justify-center">
                    <video 
                      src={generationState.videoUrl} 
                      controls 
                      autoPlay 
                      loop 
                      className="max-h-[400px] w-auto mx-auto"
                    />
                  </div>
                  <div className="mt-4 flex justify-end">
                    <a 
                      href={generationState.videoUrl} 
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors font-medium text-sm"
                    >
                      <Download className="w-4 h-4" /> Download
                    </a>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      
      <footer className="bg-white border-t border-gray-200 mt-auto">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex justify-between items-center text-sm text-gray-500">
          <p>© 2024 Veo Animator. Powered by Gemini API.</p>
          <p>Results may vary. Veo is an experimental model.</p>
        </div>
      </footer>
    </div>
  );
};

export default App;