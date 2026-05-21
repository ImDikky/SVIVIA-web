import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Points, PointMaterial, Float, PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';
import { motion, useScroll, useTransform, useInView } from 'framer-motion';

// ==========================================
// EL CILINDRO DE PARTÍCULAS (DATA FIELD)
// ==========================================
function TunnelField() {
  const ref = useRef();
  
  // Generamos 5000 partículas en forma de túnel
  const count = 5000;
  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const radius = 5 + Math.random() * 2; // Radio del túnel
      const z = Math.random() * 100 - 50;   // Longitud del túnel
      
      pos[i * 3] = Math.cos(angle) * radius;
      pos[i * 3 + 1] = Math.sin(angle) * radius;
      pos[i * 3 + 2] = z;
    }
    return pos;
  }, [count]);

  useFrame((state, delta) => {
    // Rotación lenta del túnel para darle vida
    ref.current.rotation.z += delta * 0.1;
  });

  return (
    <Points ref={ref} positions={positions} stride={3} frustumCulled={false}>
      <PointMaterial
        transparent
        color="#4f46e5"
        size={0.05}
        sizeAttenuation={true}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </Points>
  );
}

// ==========================================
// TÉRMINOS FLOTANTES (FLYING DATA)
// ==========================================
function FlyingText({ word, zPos }) {
  const ref = useRef();
  const speed = useMemo(() => 0.05 + Math.random() * 0.1, []);
  const angle = useMemo(() => Math.random() * Math.PI * 2, []);
  const radius = useMemo(() => 3 + Math.random() * 2, []);

  useFrame((state, delta) => {
    if (ref.current) {
        // El texto se mueve hacia la cámara (hacia Z positivo)
        ref.current.position.z += speed;
        // Si sale de la cámara, vuelve al fondo
        if (ref.current.position.z > 5) {
            ref.current.position.z = -50;
        }
    }
  });

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
        <mesh ref={ref} position={[Math.cos(angle) * radius, Math.sin(angle) * radius, zPos]}>
            {/* Aquí usamos una caja simple para representar datos, 
                pero el efecto real viene del movimiento y el brillo */}
            <boxGeometry args={[0.2, 0.05, 0.01]} />
            <meshStandardMaterial color="#818cf8" emissive="#4f46e5" emissiveIntensity={2} />
        </mesh>
    </Float>
  );
}

// ==========================================
// COMPONENTE PRINCIPAL DATA TUNNEL
// ==========================================
export default function DataTunnel() {
  const containerRef = useRef(null);
  const inView = useInView(containerRef, { amount: 0.05, margin: "200px 0px" });

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  // Animamos la posición Z de la cámara con el scroll
  // Al scrollear, "viajamos" 40 unidades hacia adentro
  const cameraZ = useTransform(scrollYProgress, [0, 1], [10, -30]);
  const tunnelOpacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);

  return (
    <section ref={containerRef} style={{ height: '300vh', position: 'relative', backgroundColor: '#000' }}>
      <motion.div 
        style={{ 
            position: 'sticky', top: 0, height: '100vh', width: '100vw',
            opacity: tunnelOpacity
        }}
      >
        <Canvas dpr={[1, 1.5]} frameloop={inView ? 'always' : 'never'} gl={{ powerPreference: 'high-performance', antialias: false }}>
          <color attach="background" args={['#000']} />
          <fog attach="fog" args={['#000', 5, 25]} />
          <PerspectiveCamera makeDefault position={[0, 0, 10]} fov={75} />
          
          <ambientLight intensity={0.5} />
          <pointLight position={[0, 0, 5]} intensity={2} color="#4f46e5" />

          {/* Sincronizamos la cámara con el scroll usando un componente bridge */}
          <SceneController z={cameraZ} />

          <TunnelField />
          
          {/* Añadimos cubos de datos voladores */}
          {[...Array(20)].map((_, i) => (
            <FlyingText key={i} zPos={Math.random() * -50} />
          ))}
        </Canvas>

        {/* TEXTO NARRATIVO SOBREPUESTO */}
        <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none' }}>
            <motion.h2 
                style={{ 
                    fontSize: 'clamp(2rem, 8vw, 6rem)', color: '#fff', textAlign: 'center',
                    fontFamily: 'var(--font-serif)', letterSpacing: '-0.02em'
                }}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1 }}
            >
                Deep <br/> Intelligence.
            </motion.h2>
            <p style={{ color: '#4f46e5', textTransform: 'uppercase', letterSpacing: '0.5em', marginTop: '1rem', fontSize: '0.8rem', fontWeight: 700 }}>
                Processing Source
            </p>
        </div>
      </motion.div>
    </section>
  );
}

// Pequeño componente para animar la cámara desde el valor de Motion
function SceneController({ z }) {
  useFrame((state) => {
    state.camera.position.z = z.get();
    // Ligero movimiento de "sacudida" de cámara para realismo
    state.camera.position.x = Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
    state.camera.position.y = Math.cos(state.clock.elapsedTime * 0.5) * 0.1;
  });
  return null;
}
