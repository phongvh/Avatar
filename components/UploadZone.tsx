import React, { useRef, useState } from 'react';
import { Upload, X, Image as ImageIcon } from 'lucide-react';

interface UploadZoneProps {
  onImageSelected: (file: File) => void;
  selectedImage: File | null;
  onClear: () => void;
  disabled: boolean;
}

export const UploadZone: React.FC<UploadZoneProps> = ({ onImageSelected, selectedImage, onClear, disabled }) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFile = (file: File) => {
    if (file && file.type.startsWith('image/')) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      onImageSelected(file);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (!disabled) setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (disabled) return;
    if (e.dataTransfer.files?.[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleClear = () => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(null);
    if (inputRef.current) inputRef.current.value = '';
    onClear();
  };

  if (selectedImage && previewUrl) {
    return (
      <div className="relative group w-full h-[400px] bg-gray-900 rounded-xl overflow-hidden shadow-md">
        <img 
          src={previewUrl} 
          alt="Preview" 
          className="w-full h-full object-contain"
        />
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <button 
            onClick={handleClear}
            className="p-3 bg-red-500/90 text-white rounded-full hover:bg-red-600 transition-transform hover:scale-105"
            disabled={disabled}
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        <div className="absolute bottom-4 left-4 bg-black/60 px-3 py-1 rounded text-white text-sm backdrop-blur-sm">
          Original Image
        </div>
      </div>
    );
  }

  return (
    <div
      onClick={() => inputRef.current?.click()}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`
        w-full h-[400px] rounded-xl border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-all duration-300
        ${isDragging 
          ? 'border-blue-500 bg-blue-50' 
          : 'border-gray-300 hover:border-blue-400 hover:bg-gray-50 bg-white'
        }
        ${disabled ? 'opacity-50 cursor-not-allowed pointer-events-none' : ''}
      `}
    >
      <input
        type="file"
        ref={inputRef}
        onChange={handleChange}
        accept="image/png, image/jpeg, image/webp"
        className="hidden"
        disabled={disabled}
      />
      <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-4">
        <ImageIcon className="w-8 h-8" />
      </div>
      <p className="text-lg font-medium text-gray-700 mb-1">
        Upload Reference Image
      </p>
      <p className="text-sm text-gray-500 max-w-xs text-center">
        Click or drag & drop a portrait to animate (PNG, JPG)
      </p>
    </div>
  );
};