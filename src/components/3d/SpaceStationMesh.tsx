import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const SpaceStationMesh = () => {
  const stationRef = useRef<THREE.Group>(null);
  const ringRef = useRef<THREE.Mesh>(null);

  useFrame(() => {
    if (stationRef.current) {
      stationRef.current.rotation.y += 0.001;
    }
    if (ringRef.current) {
      ringRef.current.rotation.z += 0.002;
    }
  });

  return (
    <group ref={stationRef}>
      {/* Central Hub (Core) */}
      <mesh>
        <cylinderGeometry args={[0.4, 0.4, 2.5, 32]} />
        <meshStandardMaterial color="#777" metalness={0.8} roughness={0.3} />
      </mesh>

      {/* Solar Panels (Left/Right) */}
      {[1.2, -1.2].map((x, i) => (
        <mesh key={i} position={[x, 0, 0]}>
          <boxGeometry args={[1.2, 0.05, 0.8]} />
          <meshStandardMaterial color="#1a1a1a" emissive="#0055ff" emissiveIntensity={0.8} />
        </mesh>
      ))}

      {/* Rotating Ring */}
      <mesh ref={ringRef} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[1.6, 0.07, 32, 100]} />
        <meshStandardMaterial color="#555" metalness={0.9} roughness={0.2} />
      </mesh>

      {/* Engine Lights */}
      {[[-0.5, -1.2, 0], [0.5, -1.2, 0]].map((pos, i) => (
        <mesh key={i} position={pos as [number, number, number]}>
          <sphereGeometry args={[0.08, 16, 16]} />
          <meshBasicMaterial color="aqua" />
        </mesh>
      ))}
    </group>
  );
};

export default SpaceStationMesh;
