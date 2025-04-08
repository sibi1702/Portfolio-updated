import { useState, useEffect } from 'react';
import { getS3ModelUrl } from '../config/s3Config';
import * as THREE from 'three';
import { GLTF } from 'three/examples/jsm/loaders/GLTFLoader.js';

// Import GLTFLoader dynamically to avoid TypeScript issues
let GLTFLoader: any;

// This will be executed only in the browser, not during build
if (typeof window !== 'undefined') {
  import('three/examples/jsm/loaders/GLTFLoader.js').then(module => {
    GLTFLoader = module.GLTFLoader;
  });
}

interface UseS3ModelProps {
  modelKey: string;
  timeout?: number;
}

interface UseS3ModelReturn {
  scene: THREE.Group | null;
  isLoading: boolean;
  error: Error | null;
}

/**
 * Custom hook to load a 3D model from S3
 * @param modelKey - The key of the model in S3_CONFIG.MODELS
 * @param timeout - Optional timeout in milliseconds
 */
export const useS3Model = ({ modelKey, timeout = 15000 }: UseS3ModelProps): UseS3ModelReturn => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [scene, setScene] = useState<THREE.Group | null>(null);

  useEffect(() => {
    // Get the direct URL to the model
    const modelUrl = getS3ModelUrl(modelKey as any);
    console.log(`Loading model from: ${modelUrl}`);

    // For debugging - log when the hook is called
    console.log('useS3Model hook called with modelKey:', modelKey);

    // Set up timeout to prevent infinite loading
    const timeoutId = setTimeout(() => {
      if (isLoading && !scene && !error) {
        const timeoutError = new Error(`Model loading timed out after ${timeout}ms`);
        console.error(timeoutError);
        setError(timeoutError);
        setIsLoading(false);
      }
    }, timeout);

    // Load the model
    if (GLTFLoader) {
      const loader = new GLTFLoader();

      loader.load(
        modelUrl,
        (gltf: GLTF) => {
          console.log('Model loaded successfully:', gltf);
          setScene(gltf.scene);
          setIsLoading(false);
        },
        (progressEvent: { loaded: number; total: number }) => {
          // You can add progress tracking here if needed
          const percentComplete = Math.round((progressEvent.loaded / progressEvent.total) * 100);
          console.log(`Loading progress: ${percentComplete}%`);
        },
        (error: Error) => {
          console.error('Error loading model:', error);
          setError(error);
          setIsLoading(false);
        }
      );
    } else {
      // If GLTFLoader is not available yet, wait for it
      const checkLoaderInterval = setInterval(() => {
        if (GLTFLoader) {
          clearInterval(checkLoaderInterval);
          const loader = new GLTFLoader();

          loader.load(
            modelUrl,
            (gltf: GLTF) => {
              console.log('Model loaded successfully:', gltf);
              setScene(gltf.scene);
              setIsLoading(false);
            },
            (progressEvent: { loaded: number; total: number }) => {
              const percentComplete = Math.round((progressEvent.loaded / progressEvent.total) * 100);
              console.log(`Loading progress: ${percentComplete}%`);
            },
            (error: Error) => {
              console.error('Error loading model:', error);
              setError(error);
              setIsLoading(false);
            }
          );
        }
      }, 100);

      // Clean up interval
      return () => {
        clearInterval(checkLoaderInterval);
        clearTimeout(timeoutId);
      };
    }

    // Return cleanup function for the main effect
    return () => {
      clearTimeout(timeoutId);
    };
  }, [modelKey, timeout]);

  return { scene, isLoading, error };
};
