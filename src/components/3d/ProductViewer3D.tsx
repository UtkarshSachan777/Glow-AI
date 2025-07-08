import React, { useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Box, Cylinder, Environment, ContactShadows, Html } from '@react-three/drei';
import * as THREE from 'three';
import { motion } from 'framer-motion';

interface Product3DProps {
  productType: 'serum' | 'cream' | 'cleanser' | 'mask';
  color?: string;
  size?: number;
}

function SerumBottle({ color = "#e91e63", size = 1 }: { color?: string; size?: number }) {
  const bottleRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);
  
  useFrame((state, delta) => {
    if (bottleRef.current) {
      bottleRef.current.rotation.y += delta * 0.2;
      bottleRef.current.position.y = Math.sin(state.clock.elapsedTime) * 0.1;
    }
  });

  return (
    <group 
      ref={bottleRef} 
      scale={size}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      {/* Bottle body */}
      <Cylinder 
        args={[0.3, 0.35, 2, 32]} 
        position={[0, 0, 0]}
        castShadow
        receiveShadow
      >
        <meshPhysicalMaterial
          color={color}
          transparent
          opacity={0.8}
          roughness={0.1}
          metalness={0.1}
          clearcoat={1}
          clearcoatRoughness={0.1}
          transmission={0.9}
          thickness={0.5}
        />
      </Cylinder>
      
      {/* Bottle cap */}
      <Cylinder 
        args={[0.25, 0.25, 0.3, 32]} 
        position={[0, 1.15, 0]}
        castShadow
      >
        <meshStandardMaterial
          color="#2a2a2a"
          roughness={0.2}
          metalness={0.8}
        />
      </Cylinder>
      
      {/* Label */}
      <Box args={[0.6, 0.8, 0.01]} position={[0, 0, 0.36]}>
        <meshStandardMaterial color="#ffffff" />
      </Box>
      
      {/* Liquid inside */}
      <Cylinder 
        args={[0.28, 0.33, 1.8, 32]} 
        position={[0, -0.1, 0]}
      >
        <meshPhysicalMaterial
          color={color}
          transparent
          opacity={0.6}
          roughness={0.0}
          metalness={0.0}
          transmission={0.8}
        />
      </Cylinder>
      
      {hovered && (
        <Html position={[0, 2, 0]} center>
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white/90 backdrop-blur-sm p-2 rounded-lg shadow-lg text-sm font-medium"
          >
            Premium Serum
          </motion.div>
        </Html>
      )}
    </group>
  );
}

function CreamJar({ color = "#f8bbd9", size = 1 }: { color?: string; size?: number }) {
  const jarRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);
  
  useFrame((state, delta) => {
    if (jarRef.current) {
      jarRef.current.rotation.y += delta * 0.15;
      jarRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.8) * 0.08;
    }
  });

  return (
    <group 
      ref={jarRef} 
      scale={size}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      {/* Jar body */}
      <Cylinder 
        args={[0.4, 0.45, 1.2, 32]} 
        position={[0, 0, 0]}
        castShadow
        receiveShadow
      >
        <meshPhysicalMaterial
          color={color}
          transparent
          opacity={0.9}
          roughness={0.2}
          metalness={0.1}
          clearcoat={0.8}
        />
      </Cylinder>
      
      {/* Jar lid */}
      <Cylinder 
        args={[0.42, 0.42, 0.2, 32]} 
        position={[0, 0.7, 0]}
        castShadow
      >
        <meshStandardMaterial
          color="#d4af37"
          roughness={0.1}
          metalness={0.9}
        />
      </Cylinder>
      
      {/* Cream inside */}
      <Cylinder 
        args={[0.38, 0.43, 1.0, 32]} 
        position={[0, -0.1, 0]}
      >
        <meshStandardMaterial
          color="#ffffff"
          roughness={0.8}
        />
      </Cylinder>
      
      {hovered && (
        <Html position={[0, 1.5, 0]} center>
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white/90 backdrop-blur-sm p-2 rounded-lg shadow-lg text-sm font-medium"
          >
            Luxury Moisturizer
          </motion.div>
        </Html>
      )}
    </group>
  );
}

const ProductViewer3D: React.FC<Product3DProps> = ({ 
  productType, 
  color = "#e91e63", 
  size = 1 
}) => {
  const renderProduct = () => {
    switch (productType) {
      case 'serum':
        return <SerumBottle color={color} size={size} />;
      case 'cream':
        return <CreamJar color={color} size={size} />;
      default:
        return <SerumBottle color={color} size={size} />;
    }
  };

  return (
    <div className="w-full h-64 rounded-xl overflow-hidden">
      <Canvas 
        camera={{ position: [0, 1, 4], fov: 50 }}
        shadows
      >
        <ambientLight intensity={0.4} />
        <directionalLight 
          position={[10, 10, 5]} 
          intensity={1}
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
        />
        <pointLight position={[-10, 0, -20]} intensity={0.5} />
        <spotLight position={[0, 10, 0]} angle={0.3} penumbra={1} intensity={0.5} />
        
        <Environment preset="studio" />
        
        {renderProduct()}
        
        <ContactShadows 
          position={[0, -1.4, 0]} 
          opacity={0.4} 
          scale={10} 
          blur={1.5} 
          far={4.5} 
        />
        
        <OrbitControls 
          enableZoom={false}
          enablePan={false}
          autoRotate
          autoRotateSpeed={1}
          maxPolarAngle={Math.PI / 2}
          minPolarAngle={Math.PI / 4}
        />
      </Canvas>
    </div>
  );
};

export default ProductViewer3D;