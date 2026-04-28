import React, { useRef, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF, Environment, Float, Center, Sparkles, ContactShadows, OrbitControls } from '@react-three/drei';
import { useScroll } from 'framer-motion';
import { MousePointer2 } from 'lucide-react';

// ==========================================
// EL COMPONENTE DEL MODELO 3D
// ==========================================
function Model({ scrollYProgress }) {
  const { scene } = useGLTF('/camera.glb');
  const groupRef = useRef();

  useFrame(() => {
    if (groupRef.current) {
      const progress = scrollYProgress.get();
      // Le damos 1 vuelta y media para que gire un poco más mientras bajas
      groupRef.current.rotation.y = progress * Math.PI * 3; 
      groupRef.current.rotation.x = progress * 0.3;
    }
  });

  return (
    <Float speed={2} rotationIntensity={0.2} floatIntensity={0.5}>
      {/* Centramos el modelo a la derecha (X:2.5) pero sin bajarlo tanto (Y:0) */}
      <group ref={groupRef} position={[2.5, 0, 0]}>
        <Center>
          <primitive object={scene} scale={0.2} />
        </Center>
      </group>
    </Float>
  );
}

// Pre-carga
useGLTF.preload('/camera.glb');

export default function Camera3D() {
  const containerRef = useRef(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  return (
    <section ref={containerRef} style={{ height: '200vh', position: 'relative', backgroundColor: '#000', overflow: 'hidden', cursor: 'grab' }}>
      
      {/* BRILLO DE FONDO HTML */}
      <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at 75% 50%, rgba(79, 70, 229, 0.15) 0%, transparent 40%)', pointerEvents: 'none' }} />

      <div style={{ position: 'sticky', top: 0, height: '100vh', width: '100vw', display: 'flex', alignItems: 'center' }}>
        
        {/* LIENZO 3D */}
        <div style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
          <Canvas camera={{ position: [0, 0, 8], fov: 45 }} dpr={[1, 2]}>
            <Suspense fallback={null}>
              
              {/* ORBIT CONTROLS: Permite al usuario arrastrar el modelo con el click. 
                  enableZoom={false} es VITAL para que la rueda del ratón siga bajando la página en lugar de hacer zoom. */}
              <OrbitControls enableZoom={false} enablePan={false} makeDefault />

              {/* LUCES CINEMATOGRÁFICAS */}
              <ambientLight intensity={0.2} />
              <spotLight position={[10, 10, 10]} angle={0.2} penumbra={1} intensity={3} color="#4f46e5" />
              <spotLight position={[-10, 0, -10]} angle={0.2} penumbra={1} intensity={2} color="#ec4899" />
              <pointLight position={[2.5, 0, 4]} intensity={1.5} color="#ffffff" distance={10} />
              
              <Model scrollYProgress={scrollYProgress} />
              
              {/* EFECTO PARTÍCULAS */}
              <Sparkles position={[2.5, 0, 0]} count={150} scale={6} size={2} speed={0.4} opacity={0.6} color="#4f46e5" />
              <Sparkles position={[2.5, 0, 0]} count={50} scale={4} size={3} speed={0.2} opacity={0.4} color="#ffffff" />
              
              {/* SOMBRA OPTIMIZADA */}
              <ContactShadows position={[2.5, -2.5, 0]} opacity={0.8} scale={10} blur={3} far={3} resolution={256} color="#000000" />
              
              <Environment preset="city" />
            </Suspense>
          </Canvas>
        </div>

        {/* TEXTOS CON CRISTAL */}
        <div style={{ position: 'relative', zIndex: 1, paddingLeft: '10vw', maxWidth: '600px', pointerEvents: 'none' }}>
          <div style={{ padding: '3.5rem', background: 'rgba(10,10,10,0.5)', backdropFilter: 'blur(15px)', borderRadius: '32px', border: '1px solid rgba(255,255,255,0.05)', boxShadow: '0 30px 60px rgba(0,0,0,0.5)' }}>
            <h2 className="poetic-title-huge" style={{ fontSize: '4.5rem', marginBottom: '1.5rem', background: 'linear-gradient(to right, #fff, #4f46e5)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', lineHeight: 1.1 }}>
              Hardware <br/>Agnóstico.
            </h2>
            <p style={{ color: '#a3a3a3', fontSize: '1.3rem', lineHeight: 1.6 }}>
              Cámaras IP, webcams antiguas o sistemas CCTV cerrados. SVIVIA extrae la señal RTSP pura y la inyecta de inteligencia artificial, reviviendo tu hardware existente.
            </p>
            
            <div style={{ marginTop: '2.5rem', display: 'inline-flex', alignItems: 'center', gap: '10px', padding: '10px 20px', background: 'rgba(79, 70, 229, 0.1)', borderRadius: '100px', border: '1px solid rgba(79, 70, 229, 0.3)' }}>
               <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#4f46e5', boxShadow: '0 0 10px #4f46e5' }} />
               <span style={{ fontSize: '0.85rem', color: '#e0e7ff', fontWeight: 600, letterSpacing: '1.5px', textTransform: 'uppercase' }}>RTSP Stream Ready</span>
            </div>
          </div>
        </div>

        {/* INDICADOR DE INTERACCIÓN (Arrástrame) */}
        <div style={{ position: 'absolute', bottom: '10%', right: '10vw', zIndex: 1, display: 'flex', alignItems: 'center', gap: '10px', opacity: 0.5, pointerEvents: 'none' }}>
            <MousePointer2 size={24} color="#a3a3a3" />
            <span style={{ color: '#a3a3a3', fontSize: '0.9rem', letterSpacing: '2px', textTransform: 'uppercase' }}>Haz click y arrastra para inspeccionar</span>
        </div>

      </div>
    </section>
  );
}
