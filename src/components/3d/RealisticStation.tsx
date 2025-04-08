import React from 'react';
import { useGLTF } from '@react-three/drei';

const RealisticStation = () => {
  const { scene } = useGLTF('/models/space_station_3.glb');
  
  return (
    <primitive 
      object={scene} 
      scale={[3.0, 3.0, 3.0]} 
      position={[0, 0, 0]} 
      rotation={[0, Math.PI / 4, 0]}
    />
  );
};

export default RealisticStation;
