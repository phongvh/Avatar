import { GoogleGenAI } from "@google/genai";
import { GenerationConfig } from "../types";

// Helper to convert File to Base64
const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const result = reader.result as string;
      // Remove data URL prefix (e.g., "data:image/png;base64,")
      const base64 = result.split(',')[1];
      resolve(base64);
    };
    reader.onerror = (error) => reject(error);
  });
};

export const ensureApiKey = async (): Promise<boolean> => {
  if (typeof window.aistudio !== 'undefined') {
    const hasKey = await window.aistudio.hasSelectedApiKey();
    if (!hasKey) {
      await window.aistudio.openSelectKey();
      // Assume success after opening dialog as per instructions to avoid race conditions
      return true;
    }
    return true;
  }
  return false;
};

export const generateVideo = async (
  imageFile: File,
  config: GenerationConfig
): Promise<string> => {
  // 1. Ensure fresh instance with latest key
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  // 2. Prepare Image
  const imageBase64 = await fileToBase64(imageFile);
  
  // 3. Initiate Generation
  // Using veo-3.1-fast-generate-preview as requested
  let operation = await ai.models.generateVideos({
    model: 'veo-3.1-fast-generate-preview',
    prompt: config.prompt,
    image: {
      imageBytes: imageBase64,
      mimeType: imageFile.type,
    },
    config: {
      numberOfVideos: 1,
      resolution: config.resolution,
      aspectRatio: config.aspectRatio,
    }
  });

  // 4. Poll for results
  while (!operation.done) {
    // Wait 5 seconds before next poll
    await new Promise(resolve => setTimeout(resolve, 5000));
    operation = await ai.operations.getVideosOperation({ operation: operation });
  }

  // 5. Extract Video URI
  const videoUri = operation.response?.generatedVideos?.[0]?.video?.uri;
  
  if (!videoUri) {
    throw new Error("No video URI returned from the API.");
  }

  // 6. Return fetchable URL (Needs API Key appended)
  return `${videoUri}&key=${process.env.API_KEY}`;
};