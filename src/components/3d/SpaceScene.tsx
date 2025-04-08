import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment } from '@react-three/drei';
import RealisticStation from './RealisticStation';

const SpaceScene = () => {
  return (
    <div className="w-full h-full min-h-[400px] md:min-h-[500px] lg:min-h-[600px] xl:min-h-[700px]">
      <Canvas
        camera={{ position: [-5, 2, 15], fov: 40 }}
        style={{ background: 'transparent' }}
        gl={{ alpha: true }}
      >
        <ambientLight intensity={0.6} />
        <directionalLight position={[5, 5, 5]} intensity={1.2} />

        <Suspense fallback={null}>
          <RealisticStation />
          <Environment preset="sunset" />
        </Suspense>

        <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.5} />
      </Canvas>
    </div>
  );
};

export default SpaceScene;
