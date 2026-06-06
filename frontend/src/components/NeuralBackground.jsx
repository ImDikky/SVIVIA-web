import React, { useRef, useMemo, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

function LiquidSynapses() {
  const pointsRef = useRef();
  const linesRef = useRef();
  const pointsGeomRef = useRef();
  const linesGeomRef = useRef();
  const { camera } = useThree();

  const SIZE = 78;    // 78×78 — cobertura total incluso en ultra-wide
  const SPACING = 1.5; // Cuadros finos y sutiles
  const COUNT = SIZE * SIZE;

  // Posiciones originales (referencia estática)
  const originalPositions = useMemo(() => {
    const arr = new Float32Array(COUNT * 3);
    for (let y = 0; y < SIZE; y++) {
      for (let x = 0; x < SIZE; x++) {
        const i = (y * SIZE + x) * 3;
        arr[i]     = (x - (SIZE - 1) / 2) * SPACING;
        arr[i + 1] = (y - (SIZE - 1) / 2) * SPACING;
        arr[i + 2] = 0;
      }
    }
    return arr;
  }, []);

  // Buffer de posiciones para PUNTOS (exclusivo)
  const pointPositions = useMemo(() => {
    const arr = new Float32Array(COUNT * 3);
    arr.set(originalPositions);
    return arr;
  }, [originalPositions]);

  // Buffer de posiciones para LINEAS (exclusivo, evita el error de WebGL al compartir buffer)
  const linePositions = useMemo(() => {
    const arr = new Float32Array(COUNT * 3);
    arr.set(originalPositions);
    return arr;
  }, [originalPositions]);

  // Velocidades compartidas
  const velocities = useMemo(() => new Float32Array(COUNT * 3), []);

  // Índices de líneas (conexiones entre vecinos)
  const lineIndices = useMemo(() => {
    const indices = [];
    for (let y = 0; y < SIZE; y++) {
      for (let x = 0; x < SIZE; x++) {
        const idx = y * SIZE + x;
        if (x < SIZE - 1) indices.push(idx, idx + 1);
        if (y < SIZE - 1) indices.push(idx, idx + SIZE);
      }
    }
    return new Uint16Array(indices);
  }, []);

  // Tracker de mouse global (el canvas tiene pointerEvents:none)
  const mouseNDC = useRef({ x: 0, y: 0 });
  useEffect(() => {
    const onMove = (e) => {
      mouseNDC.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouseNDC.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener('mousemove', onMove, { passive: true });
    return () => window.removeEventListener('mousemove', onMove);
  }, []);

  const mouseWorld = useMemo(() => new THREE.Vector3(), []);
  const tempDir    = useMemo(() => new THREE.Vector3(), []);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();

    // Leve rotación orgánica de fondo
    const rotZ = Math.sin(time * 0.035) * 0.06;
    const rotY = Math.cos(time * 0.018) * 0.04;
    if (pointsRef.current) {
      pointsRef.current.rotation.z = rotZ;
      pointsRef.current.rotation.y = rotY;
    }
    if (linesRef.current) {
      linesRef.current.rotation.z = rotZ;
      linesRef.current.rotation.y = rotY;
    }

    // Proyectar mouse a coordenadas mundo 3D
    mouseWorld.set(mouseNDC.current.x, mouseNDC.current.y, 0.5).unproject(camera);
    tempDir.copy(mouseWorld).sub(camera.position).normalize();
    const dist = -camera.position.z / tempDir.z;
    const mx = camera.position.x + tempDir.x * dist;
    const my = camera.position.y + tempDir.y * dist;

    // Física de resorte (radio pequeño, efecto sutil)
    const THRESHOLD      = 2.0; 
    const THRESHOLD_SQ   = THRESHOLD * THRESHOLD;
    const REPEL_STRENGTH = 0.9; 
    const SPRING         = 0.015; 
    const DAMPING        = 0.93;  

    let hasActiveMotion = false;

    for (let i = 0; i < COUNT; i++) {
      const idx = i * 3;

      const ox = originalPositions[idx];
      const oy = originalPositions[idx + 1];

      const px = pointPositions[idx];
      const py = pointPositions[idx + 1];

      let vx = velocities[idx];
      let vy = velocities[idx + 1];

      // Repulsión del cursor — Optimización matemática con distancia al cuadrado (evita Math.sqrt si no está en rango)
      const dx = px - mx;
      const dy = py - my;
      const dSq = dx * dx + dy * dy;

      if (dSq < THRESHOLD_SQ) {
        const d = Math.sqrt(dSq);
        if (d > 0.01) {
          const force = (1.0 - d / THRESHOLD) * REPEL_STRENGTH;
          vx += (dx / d) * force;
          vy += (dy / d) * force;
        }
      }

      // Resorte de retorno
      vx += (ox - px) * SPRING;
      vy += (oy - py) * SPRING;

      // Amortiguación
      vx *= DAMPING;
      vy *= DAMPING;

      const newX = px + vx;
      const newY = py + vy;

      // Si el punto se está moviendo o no ha retornado por completo a su posición de reposo original
      const distToOriginSq = (newX - ox) * (newX - ox) + (newY - oy) * (newY - oy);
      const isMoving = (vx * vx + vy * vy) > 0.00001 || distToOriginSq > 0.0001;

      if (isMoving) {
        hasActiveMotion = true;
      }

      // Actualizar buffer de PUNTOS
      pointPositions[idx]     = newX;
      pointPositions[idx + 1] = newY;
      pointPositions[idx + 2] = 0; // Plano (sin Math.sin por cuadro para máximo rendimiento)

      // Actualizar buffer de LINEAS (copia separada)
      linePositions[idx]     = newX;
      linePositions[idx + 1] = newY;
      linePositions[idx + 2] = 0;

      // Guardar velocidades
      velocities[idx]     = vx;
      velocities[idx + 1] = vy;
    }

    // Solo subimos los buffers a la GPU si hay movimiento real en la malla, ahorrando enorme ancho de banda PCI-e
    if (hasActiveMotion) {
      if (pointsGeomRef.current?.attributes?.position) {
        pointsGeomRef.current.attributes.position.needsUpdate = true;
      }
      if (linesGeomRef.current?.attributes?.position) {
        linesGeomRef.current.attributes.position.needsUpdate = true;
      }
    }
  });

  return (
    <group>
      {/* Nodos */}
      <points ref={pointsRef}>
        <bufferGeometry ref={pointsGeomRef}>
          <bufferAttribute
            attach="attributes-position"
            count={COUNT}
            array={pointPositions}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.14}
          color="#ef4444"
          transparent
          opacity={0.65}
          sizeAttenuation
          blending={THREE.AdditiveBlending}
        />
      </points>

      {/* Conexiones */}
      <lineSegments ref={linesRef}>
        <bufferGeometry ref={linesGeomRef}>
          <bufferAttribute
            attach="attributes-position"
            count={COUNT}
            array={linePositions}
            itemSize={3}
          />
          <bufferAttribute
            attach="index"
            count={lineIndices.length}
            array={lineIndices}
            itemSize={1}
          />
        </bufferGeometry>
        <lineBasicMaterial
          color="#991b1b"
          transparent
          opacity={0.3}
          blending={THREE.AdditiveBlending}
        />
      </lineSegments>
    </group>
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
      zIndex: -2,
      pointerEvents: 'none',
      background: '#000'
    }}>
      <Canvas
        camera={{ position: [0, 0, 52], fov: 62 }}
        gl={{ antialias: false, powerPreference: 'high-performance' }}
        frameloop="always"
      >
        <fog attach="fog" args={['#000', 30, 80]} />
        <LiquidSynapses />
      </Canvas>
    </div>
  );
}
