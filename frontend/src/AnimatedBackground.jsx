// In src/AnimatedBackground.js
import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';

function Box(props) {
  const meshRef = useRef();
  // This hook will rotate the box on every frame
  useFrame((state, delta) => (meshRef.current.rotation.x = meshRef.current.rotation.y += delta * 0.5));
  return (
    <mesh {...props} ref={meshRef}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color={'#6d28d9'} roughness={0.5} />
    </mesh>
  );
}

function AnimatedBackground() {
  return (
    <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: -1, opacity: 0.1 }}>
      <Canvas>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} />
        <Box position={[-2, 1, -5]} />
        <Box position={[2, -1, -5]} />
        <Box position={[0, 2, -6]} />
      </Canvas>
    </div>
  );
}

export default AnimatedBackground;