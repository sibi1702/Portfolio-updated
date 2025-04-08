import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const TextLogo = () => {
  const groupRef = useRef<THREE.Group>(null);
  
  // Rotate the group
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.01;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Main sphere */}
      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[1.5, 32, 32]} />
        <meshStandardMaterial 
          color="#ffffff" 
          metalness={0.9}
          roughness={0.1}
          emissive="#004080"
          emissiveIntensity={0.3}
        />
      </mesh>
      
      {/* Orbiting torus */}
      <mesh position={[0, 0, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[3, 0.2, 16, 100]} />
        <meshStandardMaterial 
          color="#00ffff" 
          metalness={0.8}
          roughness={0.2}
          emissive="#00ffff"
          emissiveIntensity={0.5}
        />
      </mesh>
      
      {/* Second orbiting torus at different angle */}
      <mesh position={[0, 0, 0]} rotation={[Math.PI / 4, Math.PI / 4, 0]}>
        <torusGeometry args={[2.5, 0.1, 16, 100]} />
        <meshStandardMaterial 
          color="#ffffff" 
          metalness={0.8}
          roughness={0.2}
          emissive="#ffffff"
          emissiveIntensity={0.5}
        />
      </mesh>
      
      {/* Small orbiting spheres */}
      {[0, 1, 2, 3, 4].map((i) => (
        <mesh 
          key={i} 
          position={[
            Math.cos(i * Math.PI * 0.4) * 3,
            Math.sin(i * Math.PI * 0.4) * 0.5,
            Math.sin(i * Math.PI * 0.4) * 3
          ]}
        >
          <sphereGeometry args={[0.2, 16, 16]} />
          <meshStandardMaterial 
            color="#ffffff" 
            emissive="#ffffff"
            emissiveIntensity={1}
          />
        </mesh>
      ))}
    </group>
  );
};

export default TextLogo;
