import React, { useRef, Suspense, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF, Environment, Float, Center, Sparkles, ContactShadows, OrbitControls, Html } from '@react-three/drei';
import { motion, useScroll, useInView } from 'framer-motion';
import { MousePointer2, Cpu } from 'lucide-react';
import * as THREE from 'three';
import SpotlightOverlay from './ui/SpotlightOverlay';
import EditorialTextDrift from './ui/EditorialTextDrift';
import SplitLetterReveal from './ui/SplitLetterReveal';

// ==========================================
// EL COMPONENTE DEL MODELO 3D CON EXPLOSIÓN Y CURSOR
// ==========================================
function Model({ scrollYProgress, domRefs }) {
  const { scene } = useGLTF('/camera.glb');
  const groupRef = useRef();
  const laserRef = useRef();
  const shadowRef = useRef();

  const [showHotspots, setShowHotspots] = useState(false);
  const hotspot1Ref = useRef();
  const hotspot2Ref = useRef();
  const hotspot3Ref = useRef();
  const hotspot4Ref = useRef();

  useFrame((state) => {
    const progress = scrollYProgress.get(); // 0 a 1

    // 1. Calcular el factor de explosión con una meseta (hold) extendida
    let explodeFactor = 0;
    if (progress >= 0.1 && progress < 0.35) {
      explodeFactor = (progress - 0.1) / 0.25; // explota de 0 a 1
    } else if (progress >= 0.35 && progress < 0.8) {
      explodeFactor = 1; // se mantiene 100% explotado para interacción
    } else if (progress >= 0.8 && progress <= 0.95) {
      explodeFactor = 1 - (progress - 0.8) / 0.15; // se contrae de 1 a 0
    } else if (progress > 0.95) {
      explodeFactor = 0;
    }

    // Actualizar elementos DOM directamente usando refs para evitar re-renders en el Canvas
    if (domRefs.bgRef.current) {
      domRefs.bgRef.current.style.background = `radial-gradient(circle at 75% 50%, rgba(239, 68, 68, ${0.12 + explodeFactor * 0.1}) 0%, transparent 40%)`;
    }
    if (domRefs.statusRef.current) {
      domRefs.statusRef.current.textContent = explodeFactor > 0.1 ? 'STATUS: EXPLODED BLUEPRINT ACTIVE' : 'STATUS: CCTV RADAR ACTIVE';
    }
    if (domRefs.indexRef.current) {
      domRefs.indexRef.current.textContent = `${Math.floor(explodeFactor * 100)}%`;
    }
    if (domRefs.modeRef.current) {
      domRefs.modeRef.current.textContent = explodeFactor > 0.35 ? 'WIREFRAME' : 'SOLID';
    }

    // Toggle de estado local para montar/desmontar hotspots sin re-renderizar todo el Canvas
    const shouldShow = explodeFactor > 0.35;
    if (shouldShow !== showHotspots) {
      setShowHotspots(shouldShow);
    }

    // Actualizar posiciones de los hotspots de forma imperativa si están visibles
    if (shouldShow) {
      if (hotspot1Ref.current) hotspot1Ref.current.position.set(0, 1.2, 2.2 * explodeFactor * 4 + 3.2);
      if (hotspot2Ref.current) hotspot2Ref.current.position.set(0.5, 2.5 * explodeFactor * 4 + 3.8, -0.5);
      if (hotspot3Ref.current) hotspot3Ref.current.position.set(-2.0 * explodeFactor * 4 - 3.5, -0.8, 0.5);
      if (hotspot4Ref.current) hotspot4Ref.current.position.set(0, 1.8, -1.5 * explodeFactor * 4 - 3.2);
    }

    // Actualizar opacidad de ContactShadows imperativamente
    if (shadowRef.current) {
      shadowRef.current.traverse((child) => {
        if (child.isMesh && child.material) {
          child.material.opacity = 0.45 * (1 - explodeFactor);
        }
      });
    }

    // 2. Rotación del grupo: Solo por progreso de scroll para mantener estables los hotspots
    if (groupRef.current) {
      groupRef.current.rotation.y = THREE.MathUtils.lerp(
        groupRef.current.rotation.y,
        progress * Math.PI * 2.5,
        0.08
      );
      groupRef.current.rotation.x = THREE.MathUtils.lerp(
        groupRef.current.rotation.x,
        0,
        0.08
      );
    }

    // 3. Efecto de barrido del láser volumétrico
    if (laserRef.current && laserRef.current.material) {
      laserRef.current.rotation.z = Math.sin(state.clock.getElapsedTime() * 2.5) * 0.16;
      laserRef.current.material.opacity = 0.18 * (1 - explodeFactor);
    }

    // 4. Travesía y desplazamiento local de componentes (Exploded View)
    scene.traverse((child) => {
      if (child.isMesh) {
        // Inicializar posiciones y direcciones una única vez de forma dinámica
        if (!child.userData.initialized) {
          child.userData.initialized = true;
          child.userData.origPos = child.position.clone();
          
          const name = child.name.toLowerCase();
          const dir = new THREE.Vector3();

          // Determinar dirección de explosión según nombre del nodo CAD
          if (name.includes('lens') || name.includes('optics') || name.includes('glass') || name.includes('laser')) {
            dir.set(0, 0, 2.2); // Expulsa hacia el frente
          } else if (name.includes('antenna') || name.includes('wire') || name.includes('signal')) {
            dir.set(0, 2.5, 0); // Expulsa hacia arriba
          } else if (name.includes('mount') || name.includes('base') || name.includes('bracket') || name.includes('stand')) {
            dir.set(-2.0, 0, 0); // Expulsa hacia atrás/izquierda
          } else if (name.includes('casing') || name.includes('body') || name.includes('shell')) {
            dir.set(0, 0, -1.5); // Carcasa hacia atrás
          } else {
            // Radial genérico si no encaja
            dir.copy(child.position).normalize().multiplyScalar(1.8);
            if (dir.length() < 0.1) dir.set(0, 0.8, 1.2);
          }
          child.userData.explodeDir = dir;
          child.userData.origMaterial = child.material;

          // Material holográfico wireframe para el plano desensamblado
          child.userData.wireMaterial = new THREE.MeshBasicMaterial({
            color: name.includes('lens') || name.includes('glass') ? 0xef4444 : 0xd97706,
            wireframe: true,
            transparent: true,
            opacity: 0.75
          });
        }

        // Interpolación lineal de la explosión
        const orig = child.userData.origPos;
        const dir = child.userData.explodeDir;
        child.position.x = orig.x + dir.x * explodeFactor;
        child.position.y = orig.y + dir.y * explodeFactor;
        child.position.z = orig.z + dir.z * explodeFactor;

        // Cambiar material a wireframe tras superar umbral de desensamblado
        if (explodeFactor > 0.35) {
          child.material = child.userData.wireMaterial;
          child.material.opacity = explodeFactor * 0.8;
        } else {
          child.material = child.userData.origMaterial;
        }
      }
    });
  });

  return (
    <>
      <Float speed={1.5} rotationIntensity={0.15} floatIntensity={0.3}>
        <group ref={groupRef} position={[2.5, -0.2, 0]} scale={0.25}>
          <Center>
            <primitive object={scene} />
          </Center>

          {/* Haz de barrido láser volumétrico */}
          <mesh ref={laserRef} position={[0, 0.4, 0.7]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.02, 1.3, 3.8, 16, 1, true]} />
            <meshBasicMaterial
              color="#ef4444"
              transparent
              opacity={0.18}
              side={THREE.DoubleSide}
              depthWrite={false}
            />
          </mesh>

          {/* Hotspots HTML 3D en la vista explotada */}
          {showHotspots && (
            <>
              {/* Hotspot 1: Lente (Ojos Inteligentes) */}
              <group ref={hotspot1Ref} position={[0, 1.2, 2.2 * 0.35 * 4 + 3.2]}>
                <Html center distanceFactor={15}>
                  <div className="cad-hotspot">
                    <div className="hotspot-dot pulse-red" />
                    <div className="hotspot-card">
                      <div className="hotspot-header">👁️ DETECTOR.PY</div>
                      <div className="hotspot-title">Ojos Inteligentes (YOLOv8)</div>
                      <div className="hotspot-desc">Diferenciación local entre humanos, vehículos y animales en tiempo real.</div>
                    </div>
                  </div>
                </Html>
              </group>

              {/* Hotspot 2: Antena (Túneles) */}
              <group ref={hotspot2Ref} position={[0.5, 2.5 * 0.35 * 4 + 3.8, -0.5]}>
                <Html center distanceFactor={15}>
                  <div className="cad-hotspot">
                    <div className="hotspot-dot pulse-yellow" />
                    <div className="hotspot-card">
                      <div className="hotspot-header">🔒 TUNNEL_MANAGER.PY</div>
                      <div className="hotspot-title">Cero Puertos Abiertos</div>
                      <div className="hotspot-desc">Túnel digital seguro encriptado de Cloudflare Zero Trust para acceso remoto.</div>
                    </div>
                  </div>
                </Html>
              </group>

              {/* Hotspot 3: Soporte / Base (Alarma) */}
              <group ref={hotspot3Ref} position={[-2.0 * 0.35 * 4 - 3.5, -0.8, 0.5]}>
                <Html center distanceFactor={15}>
                  <div className="cad-hotspot">
                    <div className="hotspot-dot pulse-yellow" />
                    <div className="hotspot-card">
                      <div className="hotspot-header">🚨 SECURITY_WORKER.PY</div>
                      <div className="hotspot-title">Disuasión Sonora Activa</div>
                      <div className="hotspot-desc">Dispara alarmas disuasorias desde la bocina local (4s común, 8s armada).</div>
                    </div>
                  </div>
                </Html>
              </group>

              {/* Hotspot 4: Cuerpo (Pre-búfer) */}
              <group ref={hotspot4Ref} position={[0, 1.8, -1.5 * 0.35 * 4 - 3.2]}>
                <Html center distanceFactor={15}>
                  <div className="cad-hotspot">
                    <div className="hotspot-dot pulse-red" />
                    <div className="hotspot-card">
                      <div className="hotspot-header">⏱️ RECORDER.PY</div>
                      <div className="hotspot-title">Pre-Búfer 5 Segundos</div>
                      <div className="hotspot-desc">Guarda continuamente los últimos 5s de video en RAM para capturar el inicio de alertas.</div>
                    </div>
                  </div>
                </Html>
              </group>
            </>
          )}
        </group>
      </Float>

      {/* ContactShadows */}
      <ContactShadows ref={shadowRef} position={[2.5, -2.5, 0]} opacity={0.45} scale={10} blur={2.5} far={4} color="#000000" />
    </>
  );
}

useGLTF.preload('/camera.glb');

// ==========================================
// SECCIÓN CAMERA3D
// ==========================================
export default function Camera3D() {
  const containerRef = useRef(null);
  const inView = useInView(containerRef, { amount: 0.05, margin: "200px 0px" });
  
  // Refs para actualizar elementos DOM de forma imperativa sin re-renderizar el Canvas
  const bgRef = useRef(null);
  const statusRef = useRef(null);
  const indexRef = useRef(null);
  const modeRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  return (
    <section ref={containerRef} style={{ height: '350vh', position: 'relative', backgroundColor: '#000' }}>
      
      {/* BRILLO DE FONDO RADIAL DINÁMICO */}
      <div 
        ref={bgRef}
        style={{ 
          position: 'absolute', 
          inset: 0, 
          background: 'radial-gradient(circle at 75% 50%, rgba(239, 68, 68, 0.12) 0%, transparent 40%)', 
          pointerEvents: 'none',
          transition: 'background 0.1s ease-out'
        }} 
      />

      <div style={{ position: 'sticky', top: 0, height: '100vh', width: '100%', display: 'flex', alignItems: 'center', overflow: 'hidden' }}>
        
        {/* LIENZO 3D */}
        <div data-cursor="ORBITAR CAD" style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
          <Canvas camera={{ position: [0, 0, 8], fov: 45 }} dpr={[1, 1.5]} frameloop={inView ? 'always' : 'never'} gl={{ powerPreference: 'high-performance', antialias: false }}>
            <Suspense fallback={null}>
              <OrbitControls enableZoom={false} enablePan={false} makeDefault />
              <ambientLight intensity={0.25} />
              <spotLight position={[10, 15, 10]} angle={0.2} penumbra={1} intensity={3.5} color="#ef4444" />
              <spotLight position={[-10, 0, -10]} angle={0.26} penumbra={1} intensity={2} color="#d97706" />
              
              <Model scrollYProgress={scrollYProgress} domRefs={{ bgRef, statusRef, indexRef, modeRef }} />
              
              <Sparkles count={50} scale={10} size={1} speed={0.4} opacity={0.3} color="#ef4444" />
              <Environment preset="city" />
            </Suspense>
          </Canvas>
        </div>

        {/* TEXTO INFORMATIVO HUD */}
        <div style={{ position: 'relative', zIndex: 1, paddingLeft: '10vw', maxWidth: '600px', pointerEvents: 'none' }}>
          <motion.div 
            style={{ 
               padding: '3rem', 
               background: 'rgba(8,8,12,0.82)', 
               borderRadius: '32px', 
               border: '1px solid rgba(255,255,255,0.06)',
               backdropFilter: 'blur(20px)',
               boxShadow: '0 30px 60px rgba(0,0,0,0.6)'
            }}
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
          >
            <h2 className="poetic-title-huge" style={{ fontSize: '3.6rem', marginBottom: '1.2rem', lineHeight: 1.1 }}>
              <EditorialTextDrift 
                line1={<SplitLetterReveal text="Hardware" delay={0.15} style={{ color: '#fff' }} />} 
                line2={<SplitLetterReveal text="Agnóstico." delay={0.4} style={{ color: '#ef4444' }} />} 
              />
            </h2>
            <p style={{ color: '#a3a3a3', fontSize: '1.1rem', lineHeight: 1.6, marginBottom: '2rem' }}>
              Cámaras IP, webcams antiguas o sistemas CCTV. SVIVIA extrae la señal RTSP pura y la inyecta de inteligencia artificial, reviviendo tu hardware existente sin complicaciones.
            </p>

            {/* TELEMETRÍA CAD HOLOGRÁFICA EN VIVO */}
            <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#ef4444', fontSize: '0.75rem', fontFamily: 'monospace', fontWeight: 'bold' }}>
                <Cpu size={14} /> <span ref={statusRef}>STATUS: CCTV RADAR ACTIVE</span>
              </div>
              <div style={{ display: 'flex', gap: '15px' }}>
                <div style={{ fontSize: '0.65rem', fontFamily: 'monospace', color: '#737373' }}>
                  EXPLODE INDEX: <span ref={indexRef} style={{ color: '#d97706' }}>0%</span>
                </div>
                <div style={{ fontSize: '0.65rem', fontFamily: 'monospace', color: '#737373' }}>
                  RENDER MODE: <span ref={modeRef} style={{ color: '#d97706' }}>SOLID</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* INDICADOR DE INTERACCIÓN */}
        <div style={{ position: 'absolute', bottom: '8%', right: '8vw', zIndex: 1, display: 'flex', alignItems: 'center', gap: '10px', opacity: 0.5 }}>
            <Cpu size={16} color="#ef4444" />
            <span style={{ color: '#a3a3a3', fontSize: '0.75rem', letterSpacing: '3px', fontFamily: 'monospace', textTransform: 'uppercase' }}>
              DIAGRAMA CAD INTERACTIVO
            </span>
        </div>

        {/* SPOTLIGHT CAD OVERLAY */}
        <SpotlightOverlay sectionRef={containerRef} />

      </div>
    </section>
  );
}
