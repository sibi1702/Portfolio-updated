import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, Html } from '@react-three/drei';
import { ErrorBoundary } from 'react-error-boundary';
import RealisticStation from './RealisticStation';

const ModelLoader = () => (
  <Html center>
    <div className="bg-black/70 p-3 rounded-lg text-white text-center">
      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-white mx-auto mb-2"></div>
      <p className="text-sm">Loading 3D model...</p>
      <p className="text-xs mt-1 opacity-70">This may take a moment</p>
    </div>
  </Html>
);

const SceneLoading = () => (
  <div className="w-full h-full min-h-[400px] md:min-h-[500px] lg:min-h-[600px] xl:min-h-[700px] flex items-center justify-center bg-black/30 backdrop-blur-sm rounded-xl">
    <div className="text-white text-center p-4">
      <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-white mb-4"></div>
      <p>Loading 3D Scene...</p>
    </div>
  </div>
);

const FallbackScene = ({ error }: { error: Error }) => (
  <div className="w-full h-full min-h-[400px] md:min-h-[500px] lg:min-h-[600px] xl:min-h-[700px] flex items-center justify-center bg-black/30 backdrop-blur-sm rounded-xl">
    <div className="text-white text-center p-4">
      <div className="mb-4 text-4xl">🌌</div>
      <h3 className="text-xl font-bold mb-2">3D Scene Unavailable</h3>
      <p className="mb-2">We couldn't load the 3D model</p>
      <p className="text-sm opacity-70">{error.message || 'WebGL context lost'}</p>
    </div>
  </div>
);

const SpaceScene = () => {
  console.log('SpaceScene rendering with S3 model');

  return (
    <div className="w-full h-full min-h-[300px] md:min-h-[500px] lg:min-h-[600px] xl:min-h-[700px] relative">
      <ErrorBoundary FallbackComponent={FallbackScene}>
        <Suspense fallback={<SceneLoading />}>
          {/* Using increased FOV and lower resolution for better mobile experience */}
          <Canvas
            camera={{ position: [10, 5, 10], fov: 60 }}
            style={{ background: 'transparent' }}
            gl={{
              alpha: true,
              antialias: true,
              powerPreference: window.innerWidth < 768 ? 'default' : 'high-performance',
              failIfMajorPerformanceCaveat: false
            }}
            dpr={window.innerWidth < 768 ? [0.8, 1.5] : [1, 2]}
          >
            {/* Lighting */}
            <ambientLight intensity={0.6} />
            <directionalLight position={[5, 5, 5]} intensity={1.2} />
            <directionalLight position={[-5, 5, 5]} intensity={0.8} />
            <directionalLight position={[0, 5, -5]} intensity={0.5} />

            {/* 3D Model with loading indicator */}
            <Suspense fallback={<ModelLoader />}>
              <RealisticStation />
              <Environment preset="sunset" />
            </Suspense>

            {/* Controls - zoom disabled */}
            <OrbitControls
              enableZoom={false}
              enablePan={false}
              autoRotate
              autoRotateSpeed={0.5}
              enableDamping
              dampingFactor={0.05}
            />
          </Canvas>
        </Suspense>
      </ErrorBoundary>
    </div>
  );
};

export default SpaceScene;
