import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

function Particles({ count = 1500 }) {
  const mesh = useRef();
  const mouse = useRef([0, 0]);

  // Generamos posiciones aleatorias para las partículas
  const particles = useMemo(() => {
    const temp = [];
    for (let i = 0; i < count; i++) {
      const x = THREE.MathUtils.randFloatSpread(100);
      const y = THREE.MathUtils.randFloatSpread(100);
      const z = THREE.MathUtils.randFloatSpread(100);
      temp.push(x, y, z);
    }
    return new Float32Array(temp);
  }, [count]);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    
    // Rotación suave del sistema de partículas
    mesh.current.rotation.y = time * 0.05;
    mesh.current.rotation.x = time * 0.02;

    // Movimiento reactivo al mouse (sutil)
    const { x, y } = state.mouse;
    mesh.current.position.x = THREE.MathUtils.lerp(mesh.current.position.x, x * 2, 0.1);
    mesh.current.position.y = THREE.MathUtils.lerp(mesh.current.position.y, y * 2, 0.1);
  });

  return (
    <points ref={mesh}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particles.length / 3}
          array={particles}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.15}
        color="#4f46e5"
        transparent
        opacity={0.4}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

export default function NeuralBackground() {
  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      zIndex: -2, // Por detrás de todo, incluso del ambient-glow
      pointerEvents: 'none',
      background: '#000'
    }}>
      <Canvas camera={{ position: [0, 0, 50], fov: 60 }}>
        <fog attach="fog" args={['#000', 30, 90]} />
        <Particles />
      </Canvas>
    </div>
  );
}
