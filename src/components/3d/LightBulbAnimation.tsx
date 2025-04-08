import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Environment } from '@react-three/drei';
import * as THREE from 'three';

// Tungsten filament component
const TungstenFilament = () => {
  const filamentRef = useRef<THREE.Group>(null);
  const filamentMaterial = useRef<THREE.MeshStandardMaterial>(null);
  
  // Create filament shape
  const createFilamentShape = () => {
    const curve = new THREE.CurvePath();
    
    // Create a zigzag pattern for the filament
    const points = [];
    const zigzagCount = 5;
    const zigzagHeight = 0.4;
    const zigzagWidth = 0.15;
    
    for (let i = 0; i <= zigzagCount * 2; i++) {
      const t = i / (zigzagCount * 2);
      const x = (i % 2 === 0) ? -zigzagWidth : zigzagWidth;
      const y = -zigzagHeight + t * zigzagHeight * 2;
      const z = 0;
      
      points.push(new THREE.Vector3(x, y, z));
    }
    
    // Add curves between points
    for (let i = 0; i < points.length - 1; i++) {
      const curve1 = new THREE.LineCurve3(points[i], points[i + 1]);
      curve.add(curve1);
    }
    
    return curve;
  };
  
  const filamentCurve = createFilamentShape();
  const tubeGeometry = new THREE.TubeGeometry(filamentCurve, 64, 0.01, 8, false);
  
  // Animate filament glow
  useFrame(({ clock }) => {
    if (filamentMaterial.current) {
      const time = clock.getElapsedTime();
      // Pulsing glow effect
      const intensity = 2 + Math.sin(time * 2) * 0.5;
      filamentMaterial.current.emissiveIntensity = intensity;
    }
  });
  
  return (
    <group ref={filamentRef}>
      <mesh>
        <primitive object={tubeGeometry} />
        <meshStandardMaterial 
          ref={filamentMaterial}
          color="#ff9500"
          emissive="#ff7b00"
          emissiveIntensity={2}
          metalness={0.8}
          roughness={0.2}
        />
      </mesh>
    </group>
  );
};

// Light bulb glass component
const BulbGlass = () => {
  const glassRef = useRef<THREE.Mesh>(null);
  const glassMaterial = useRef<THREE.MeshPhysicalMaterial>(null);
  
  // Animate glass glow
  useFrame(({ clock }) => {
    if (glassMaterial.current) {
      const time = clock.getElapsedTime();
      // Subtle pulsing effect
      const transmission = 0.9 + Math.sin(time * 2) * 0.05;
      glassMaterial.current.transmission = transmission;
    }
  });
  
  return (
    <mesh ref={glassRef}>
      <sphereGeometry args={[0.5, 32, 32]} />
      <meshPhysicalMaterial
        ref={glassMaterial}
        color="#ffffff"
        transmission={0.95}
        transparent={true}
        opacity={0.8}
        metalness={0.1}
        roughness={0.1}
        clearcoat={1}
        clearcoatRoughness={0.1}
        thickness={0.1}
      />
    </mesh>
  );
};

// Bulb base component
const BulbBase = () => {
  return (
    <group position={[0, -0.6, 0]}>
      {/* Screw base */}
      <mesh position={[0, -0.15, 0]}>
        <cylinderGeometry args={[0.2, 0.2, 0.3, 32]} />
        <meshStandardMaterial 
          color="#b0b0b0"
          metalness={0.8}
          roughness={0.2}
        />
      </mesh>
      
      {/* Connection between glass and base */}
      <mesh position={[0, 0.05, 0]}>
        <cylinderGeometry args={[0.25, 0.2, 0.1, 32]} />
        <meshStandardMaterial 
          color="#b0b0b0"
          metalness={0.8}
          roughness={0.2}
        />
      </mesh>
    </group>
  );
};

// Light rays component
const LightRays = () => {
  const raysRef = useRef<THREE.Group>(null);
  const rays = useRef<THREE.Mesh[]>([]);
  
  // Create rays
  React.useEffect(() => {
    if (raysRef.current) {
      // Clear any existing rays
      while (raysRef.current.children.length > 0) {
        raysRef.current.remove(raysRef.current.children[0]);
      }
      
      rays.current = [];
      
      // Create new rays
      const rayCount = 20;
      
      for (let i = 0; i < rayCount; i++) {
        const length = Math.random() * 2 + 1;
        const thickness = Math.random() * 0.03 + 0.01;
        
        const geometry = new THREE.CylinderGeometry(thickness, 0, length, 8, 1);
        const material = new THREE.MeshBasicMaterial({
          color: new THREE.Color(0xffcc77),
          transparent: true,
          opacity: 0.3,
        });
        
        const ray = new THREE.Mesh(geometry, material);
        
        // Random direction from bulb center
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.random() * Math.PI;
        
        ray.position.x = 0.5 * Math.sin(phi) * Math.cos(theta);
        ray.position.y = 0.5 * Math.sin(phi) * Math.sin(theta);
        ray.position.z = 0.5 * Math.cos(phi);
        
        // Point away from center
        ray.lookAt(
          ray.position.x * 2,
          ray.position.y * 2,
          ray.position.z * 2
        );
        
        // Rotate to align cylinder with direction
        ray.rotateX(Math.PI / 2);
        
        // Store animation parameters
        ray.userData = {
          speed: Math.random() * 0.5 + 0.5,
          offset: Math.random() * Math.PI * 2,
          initialOpacity: material.opacity,
        };
        
        raysRef.current.add(ray);
        rays.current.push(ray);
      }
    }
  }, []);
  
  // Animate rays
  useFrame(({ clock }) => {
    const time = clock.getElapsedTime();
    
    rays.current.forEach((ray) => {
      const { speed, offset, initialOpacity } = ray.userData;
      
      // Pulsing opacity
      const material = ray.material as THREE.MeshBasicMaterial;
      material.opacity = initialOpacity * (0.7 + Math.sin(time * speed + offset) * 0.3);
    });
  });
  
  return <group ref={raysRef} />;
};

// Floating particles (like dust or energy)
const FloatingParticles = () => {
  const particlesRef = useRef<THREE.Group>(null);
  const particles = useRef<THREE.Mesh[]>([]);
  
  // Create particles
  React.useEffect(() => {
    if (particlesRef.current) {
      // Clear any existing particles
      while (particlesRef.current.children.length > 0) {
        particlesRef.current.remove(particlesRef.current.children[0]);
      }
      
      particles.current = [];
      
      // Create new particles
      const particleCount = 50;
      
      for (let i = 0; i < particleCount; i++) {
        const size = Math.random() * 0.03 + 0.01;
        const geometry = new THREE.SphereGeometry(size, 8, 8);
        const material = new THREE.MeshBasicMaterial({
          color: new THREE.Color(0xffcc77),
          transparent: true,
          opacity: Math.random() * 0.5 + 0.2,
        });
        
        const particle = new THREE.Mesh(geometry, material);
        
        // Random position around the bulb
        const radius = Math.random() * 3 + 1;
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.random() * Math.PI;
        
        particle.position.x = radius * Math.sin(phi) * Math.cos(theta);
        particle.position.y = radius * Math.sin(phi) * Math.sin(theta);
        particle.position.z = radius * Math.cos(phi);
        
        // Store animation parameters
        particle.userData = {
          speed: Math.random() * 0.2 + 0.1,
          offset: Math.random() * Math.PI * 2,
          initialRadius: radius,
          theta: theta,
          phi: phi,
        };
        
        particlesRef.current.add(particle);
        particles.current.push(particle);
      }
    }
  }, []);
  
  // Animate particles
  useFrame(({ clock }) => {
    const time = clock.getElapsedTime();
    
    particles.current.forEach((particle) => {
      const { speed, offset, initialRadius, theta, phi } = particle.userData;
      
      // Spiral movement
      particle.userData.theta += speed * 0.01;
      
      const radius = initialRadius + Math.sin(time * speed + offset) * 0.2;
      
      particle.position.x = radius * Math.sin(phi) * Math.cos(particle.userData.theta);
      particle.position.y = radius * Math.sin(phi) * Math.sin(particle.userData.theta);
      particle.position.z = radius * Math.cos(phi);
    });
  });
  
  return <group ref={particlesRef} />;
};

// Complete light bulb assembly
const LightBulb = () => {
  const bulbRef = useRef<THREE.Group>(null);
  
  // Gentle floating animation
  useFrame(({ clock }) => {
    if (bulbRef.current) {
      const time = clock.getElapsedTime();
      bulbRef.current.position.y = Math.sin(time * 0.5) * 0.1;
      bulbRef.current.rotation.y = time * 0.2;
    }
  });
  
  return (
    <group ref={bulbRef}>
      <TungstenFilament />
      <BulbGlass />
      <BulbBase />
      <LightRays />
      <FloatingParticles />
    </group>
  );
};

// Main component
const LightBulbAnimation = () => {
  return (
    <div className="w-full h-full">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 40 }}
        style={{ background: 'transparent' }}
        gl={{ alpha: true }}
      >
        <ambientLight intensity={0.2} />
        <pointLight position={[0, 0, 0]} intensity={2} color="#ffcc77" />
        <spotLight position={[5, 5, 5]} angle={0.15} penumbra={1} intensity={0.5} castShadow />
        
        <LightBulb />
        
        <Environment preset="sunset" />
        <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.5} />
      </Canvas>
    </div>
  );
};

export default LightBulbAnimation;
