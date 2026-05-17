import React, { useRef, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF, Environment, Float, Center, Sparkles, ContactShadows, OrbitControls } from '@react-three/drei';
import { motion, useScroll, useTransform } from 'framer-motion';
import { MousePointer2 } from 'lucide-react';

// ==========================================
// EL COMPONENTE DEL MODELO 3D (REVERTIDO)
// ==========================================
function Model({ scrollYProgress }) {
  const { scene } = useGLTF('/camera.glb');
  const groupRef = useRef();

  useFrame(() => {
    if (groupRef.current) {
      const progress = scrollYProgress.get();
      // Rotación suave continua con el scroll
      groupRef.current.rotation.y = progress * Math.PI * 4; 
      groupRef.current.rotation.x = progress * 0.2;
    }
  });

  return (
    <Float speed={2} rotationIntensity={0.2} floatIntensity={0.5}>
      <group ref={groupRef} position={[2.5, 0, 0]} scale={0.25}>
        <Center>
          <primitive object={scene} />
        </Center>
      </group>
    </Float>
  );
}

useGLTF.preload('/camera.glb');

export default function Camera3D() {
  const containerRef = useRef(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  return (
    <section ref={containerRef} style={{ height: '200vh', position: 'relative', backgroundColor: '#000', overflow: 'hidden' }}>
      
      {/* BRILLO DE FONDO */}
      <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at 75% 50%, rgba(79, 70, 229, 0.1) 0%, transparent 40%)', pointerEvents: 'none' }} />

      <div style={{ position: 'sticky', top: 0, height: '100vh', width: '100vw', display: 'flex', alignItems: 'center' }}>
        
        {/* LIENZO 3D */}
        <div style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
          <Canvas camera={{ position: [0, 0, 8], fov: 45 }} dpr={[1, 2]}>
            <Suspense fallback={null}>
              <OrbitControls enableZoom={false} enablePan={false} makeDefault />
              <ambientLight intensity={0.2} />
              <spotLight position={[10, 10, 10]} angle={0.2} penumbra={1} intensity={3} color="#4f46e5" />
              <spotLight position={[-10, 0, -10]} angle={0.2} penumbra={1} intensity={2} color="#ec4899" />
              
              <Model scrollYProgress={scrollYProgress} />
              
              <Sparkles count={100} scale={10} size={1} speed={0.3} opacity={0.3} color="#4f46e5" />
              <ContactShadows position={[2.5, -2.5, 0]} opacity={0.4} scale={10} blur={2} far={4} color="#000000" />
              <Environment preset="city" />
            </Suspense>
          </Canvas>
        </div>

        {/* TEXTO MINIMALISTA */}
        <div style={{ position: 'relative', zIndex: 1, paddingLeft: '10vw', maxWidth: '600px', pointerEvents: 'none' }}>
          <motion.div 
            style={{ 
               padding: '3rem', 
               background: 'rgba(10,10,10,0.4)', 
               backdropFilter: 'blur(20px)', 
               borderRadius: '40px', 
               border: '1px solid rgba(255,255,255,0.05)'
            }}
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
          >
            <h2 className="poetic-title-huge" style={{ fontSize: '4rem', marginBottom: '1rem', background: 'linear-gradient(to right, #fff, #4f46e5)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', lineHeight: 1.1 }}>
              Hardware <br/>Agnóstico.
            </h2>
            <p style={{ color: '#a3a3a3', fontSize: '1.2rem', lineHeight: 1.6 }}>
              Cámaras IP, webcams antiguas o sistemas CCTV. SVIVIA extrae la señal RTSP pura y la inyecta de inteligencia artificial, reviviendo tu hardware existente sin complicaciones.
            </p>
          </motion.div>
        </div>

        {/* INDICADOR INTERACCIÓN */}
        <div style={{ position: 'absolute', bottom: '10%', right: '10vw', zIndex: 1, display: 'flex', alignItems: 'center', gap: '10px', opacity: 0.4 }}>
            <MousePointer2 size={20} color="#a3a3a3" />
            <span style={{ color: '#a3a3a3', fontSize: '0.8rem', letterSpacing: '2px', textTransform: 'uppercase' }}>Interacción libre activa</span>
        </div>

      </div>
    </section>
  );
}
