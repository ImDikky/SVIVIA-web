import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Points, PointMaterial, Float, PerspectiveCamera, Text } from '@react-three/drei';
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
        color="#ef4444"
        size={0.05}
        sizeAttenuation={true}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </Points>
  );
}

const WORDS = [
  'YOLOv8', 'AES-256', 'LOCAL AI', 'RTSP LINK', 'ZERO TRUST', 
  'CLOUDFLARE', 'TELEGRAM BOT', 'DETECTOR.PY', 'REID_TRACKER.PY', 
  'PRE-BUFFER', 'TOMMY', 'THREAT_DETECTOR.PY', 'RECORDER.PY', 'SECURITY_WORKER.PY'
];

// ==========================================
// TÉRMINOS FLOTANTES (FLYING DATA)
// ==========================================
function FlyingText({ word, zPos }) {
  const ref = useRef();
  const speed = useMemo(() => 0.08 + Math.random() * 0.12, []);
  const angle = useMemo(() => Math.random() * Math.PI * 2, []);
  const radius = useMemo(() => 2.5 + Math.random() * 3.5, []);

  useFrame((state, delta) => {
    if (ref.current) {
        // El texto se mueve hacia la cámara (hacia Z positivo)
        ref.current.position.z += speed;
        // Si sale de la cámara, vuelve al fondo
        if (ref.current.position.z > 5) {
            ref.current.position.z = -60;
        }
    }
  });

  return (
    <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.2}>
        <group ref={ref} position={[Math.cos(angle) * radius, Math.sin(angle) * radius, zPos]}>
            <Text
              fontSize={0.26}
              color="#f59e0b"
              anchorX="center"
              anchorY="middle"
              depthTest={true}
            >
              {word}
            </Text>
        </group>
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
          <pointLight position={[0, 0, 5]} intensity={2} color="#ef4444" />

          {/* Sincronizamos la cámara con el scroll usando un componente bridge */}
          <SceneController z={cameraZ} />

          <TunnelField />
          
          {/* Añadimos textos 3D voladores */}
          {[...Array(25)].map((_, i) => (
            <FlyingText key={i} zPos={Math.random() * -60} word={WORDS[i % WORDS.length]} />
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
            <p style={{ color: '#ef4444', textTransform: 'uppercase', letterSpacing: '0.5em', marginTop: '1rem', fontSize: '0.8rem', fontWeight: 700 }}>
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
