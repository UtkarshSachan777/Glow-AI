import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Sphere, Float, Environment, MeshDistortMaterial } from '@react-three/drei';
import * as THREE from 'three';

interface FloatingProductProps {
  color?: string;
  text?: string;
}

function AnimatedSphere({ color = "#e91e63" }: { color?: string }) {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += delta * 0.5;
      meshRef.current.rotation.y += delta * 0.3;
    }
  });

  return (
    <Float
      speed={1.5}
      rotationIntensity={1}
      floatIntensity={2}
      floatingRange={[0, 0.5]}
    >
      <Sphere ref={meshRef} args={[1, 64, 64]} position={[0, 0, 0]}>
        <MeshDistortMaterial
          color={color}
          attach="material"
          distort={0.3}
          speed={2}
          roughness={0.2}
          metalness={0.8}
        />
      </Sphere>
    </Float>
  );
}

function FloatingText({ text = "GLOW" }: { text?: string }) {
  return null; // Temporarily disabled to fix font loading issue
}

const FloatingProduct: React.FC<FloatingProductProps> = ({ 
  color = "#e91e63", 
  text = "GLOW" 
}) => {
  return (
    <div className="w-full h-64 sm:h-80 lg:h-96">
      <Canvas camera={{ position: [0, 0, 5], fov: 60 }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <spotLight position={[-10, -10, -10]} angle={0.15} penumbra={1} />
        
        <Environment preset="sunset" />
        
        <AnimatedSphere color={color} />
        <FloatingText text={text} />
        
        <OrbitControls 
          enableZoom={false} 
          autoRotate 
          autoRotateSpeed={0.5}
          enablePan={false}
          maxPolarAngle={Math.PI / 2}
          minPolarAngle={Math.PI / 3}
        />
      </Canvas>
    </div>
  );
};

export default FloatingProduct;