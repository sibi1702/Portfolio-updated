import { useGLTF } from '@react-three/drei';
import { useRef, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { getS3ModelUrl } from '../../config/s3Config';

const S3_MODEL_URL = getS3ModelUrl('SPACE_STATION');

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
  console.log('RealisticStation rendering with S3 model');
  const [modelLoaded, setModelLoaded] = useState(false);
  const [loadError, setLoadError] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const [s3LoadStartTime] = useState<number>(Date.now());
  const modelRef = useRef<THREE.Group>(null);

  // Load the model from S3 with error handling
  const { scene } = useGLTF(S3_MODEL_URL, undefined, undefined, (error) => {
    console.error('Error loading S3 model:', error);
    setLoadError(true);
  });

  // Track when the model is loaded
  useEffect(() => {
    if (scene) {
      const loadTime = Date.now() - s3LoadStartTime;
      console.log(`S3 model loaded successfully in ${loadTime}ms`);
      setModelLoaded(true);
      setLoadError(false);
    }
  }, [scene, s3LoadStartTime]);

  // Handle errors and retry loading
  useEffect(() => {
    if (loadError && retryCount < 2) {
      const timer = setTimeout(() => {
        console.log(`Retrying S3 model load (attempt ${retryCount + 1})`);
        setRetryCount(prev => prev + 1);
        // Force a reload of the model
        useGLTF.clear(S3_MODEL_URL);
        // Trigger a re-render
        setLoadError(false);
        setTimeout(() => setLoadError(true), 100);
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [loadError, retryCount]);

  useFrame(() => {
    if (modelRef.current) {
      modelRef.current.rotation.y += 0.001; // Very slow rotation
    }
  });

  // Determine which model to render
  const renderModel = () => {
    if (loadError || retryCount >= 2) {
      // Show fallback model if loading failed
      return <FallbackModel />;
    } else if (modelLoaded && scene) {
      // Show S3 model if loaded successfully
      return (
        <primitive
          object={scene}
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
  // Preload S3 model
  console.log('Preloading S3 model:', S3_MODEL_URL);
  useGLTF.preload(S3_MODEL_URL);
} catch (error) {
  console.error('Error preloading S3 model:', error);
}

export default RealisticStation;
