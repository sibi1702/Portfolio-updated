import { useGLTF } from '@react-three/drei';
import { useRef, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { getS3ModelUrl } from '../../config/s3Config';

// Get URLs for both primary and fallback models
const PRIMARY_MODEL_URL = getS3ModelUrl('SPACE_STATION');
const FALLBACK_MODEL_URL = getS3ModelUrl('FALLBACK_MODEL');

const FallbackModel = () => {
  console.log('Rendering fallback model');
  return (
    <group>
      {/* Main body */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[1, 0.5, 2]} />
        <meshStandardMaterial color="#444444" metalness={0.8} roughness={0.2} />
      </mesh>

      {/* Solar panels */}
      <mesh position={[2, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <boxGeometry args={[2, 0.05, 1]} />
        <meshStandardMaterial color="#1a5fb4" metalness={0.5} roughness={0.2} />
      </mesh>

      <mesh position={[-2, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <boxGeometry args={[2, 0.05, 1]} />
        <meshStandardMaterial color="#1a5fb4" metalness={0.5} roughness={0.2} />
      </mesh>

      {/* Antenna */}
      <mesh position={[0, 0.5, -1.2]}>
        <cylinderGeometry args={[0.05, 0.05, 1, 8]} />
        <meshStandardMaterial color="#c0c0c0" metalness={0.8} roughness={0.2} />
      </mesh>

      {/* Dish */}
      <mesh position={[0, 0.5, -1.8]} rotation={[Math.PI / 2, 0, 0]}>
        <sphereGeometry args={[0.3, 16, 16, 0, Math.PI]} />
        <meshStandardMaterial color="#ffffff" metalness={0.5} roughness={0.2} />
      </mesh>
    </group>
  );
};

const RealisticStation = () => {
  console.log('RealisticStation rendering');
  const [modelLoaded, setModelLoaded] = useState(false);
  const [primaryLoadError, setPrimaryLoadError] = useState(false);
  const [fallbackLoadError, setFallbackLoadError] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const [usingFallback, setUsingFallback] = useState(false);
  const [loadStartTime] = useState<number>(Date.now());
  const modelRef = useRef<THREE.Group>(null);

  // Try to load the primary model first
  const { scene: primaryScene } = useGLTF(PRIMARY_MODEL_URL, undefined, undefined, (error) => {
    console.error('Error loading primary model:', error);
    setPrimaryLoadError(true);
  });

  // Load the fallback model if the primary fails
  const { scene: fallbackScene } = useGLTF(FALLBACK_MODEL_URL, undefined, undefined, (error) => {
    console.error('Error loading fallback model:', error);
    setFallbackLoadError(true);
  });

  // Track when the primary model is loaded
  useEffect(() => {
    if (primaryScene && !primaryLoadError) {
      const loadTime = Date.now() - loadStartTime;
      console.log(`Primary model loaded successfully in ${loadTime}ms`);
      setModelLoaded(true);
      setUsingFallback(false);
    }
  }, [primaryScene, primaryLoadError, loadStartTime]);

  // Switch to fallback model if primary fails
  useEffect(() => {
    if (primaryLoadError && !usingFallback) {
      console.log('Primary model failed to load, switching to fallback model');
      setUsingFallback(true);
    }
  }, [primaryLoadError, usingFallback]);

  // Track when the fallback model is loaded
  useEffect(() => {
    if (fallbackScene && usingFallback && !fallbackLoadError) {
      const loadTime = Date.now() - loadStartTime;
      console.log(`Fallback model loaded successfully in ${loadTime}ms`);
      setModelLoaded(true);
    }
  }, [fallbackScene, usingFallback, fallbackLoadError, loadStartTime]);

  // Handle errors for both models
  useEffect(() => {
    if (primaryLoadError && fallbackLoadError && retryCount < 2) {
      const timer = setTimeout(() => {
        console.log(`Both models failed, retrying (attempt ${retryCount + 1})`);
        setRetryCount(prev => prev + 1);
        // Force a reload of both models
        useGLTF.clear(PRIMARY_MODEL_URL);
        useGLTF.clear(FALLBACK_MODEL_URL);
        // Reset errors to trigger reload
        setPrimaryLoadError(false);
        setFallbackLoadError(false);
        setTimeout(() => {
          setPrimaryLoadError(true);
          setFallbackLoadError(true);
        }, 100);
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [primaryLoadError, fallbackLoadError, retryCount]);

  useFrame(() => {
    if (modelRef.current) {
      modelRef.current.rotation.y += 0.001; // Very slow rotation
    }
  });

  // Determine which model to render
  const renderModel = () => {
    // If both models failed to load after retries, show the built-in fallback
    if ((primaryLoadError && fallbackLoadError) || retryCount >= 2) {
      console.log('Both models failed, showing built-in fallback');
      return <FallbackModel />;
    }
    // If primary model loaded successfully
    else if (modelLoaded && primaryScene && !usingFallback) {
      console.log('Rendering primary model');
      return (
        <primitive
          object={primaryScene}
          scale={[3.0, 3.0, 3.0]}
          position={[0, 0, 0]}
          rotation={[0, Math.PI / 4, 0]}
        />
      );
    }
    // If fallback model loaded successfully
    else if (modelLoaded && fallbackScene && usingFallback) {
      console.log('Rendering fallback model from CDN');
      return (
        <primitive
          object={fallbackScene}
          scale={[0.01, 0.01, 0.01]}
          position={[0, -1, 0]}
          rotation={[0, Math.PI / 4, 0]}
        />
      );
    }
    // Return null while loading
    return null;
  };

  return <group ref={modelRef}>{renderModel()}</group>;
};

try {
  // Preload both models
  console.log('Preloading primary model:', PRIMARY_MODEL_URL);
  useGLTF.preload(PRIMARY_MODEL_URL);

  console.log('Preloading fallback model:', FALLBACK_MODEL_URL);
  useGLTF.preload(FALLBACK_MODEL_URL);
} catch (error) {
  console.error('Error preloading models:', error);
}

export default RealisticStation;
