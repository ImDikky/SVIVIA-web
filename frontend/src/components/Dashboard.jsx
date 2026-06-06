import React, { useRef, useState, useEffect, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Sparkles } from '@react-three/drei';
import { motion, AnimatePresence, useScroll, useTransform, useMotionValue, useSpring, useMotionTemplate } from 'framer-motion';
import { ShieldAlert, Cpu, Eye, X, Activity, ShieldCheck, AlertTriangle, Play, Settings } from 'lucide-react';
import * as THREE from 'three';
import videoSrc from '../assets/videovigilancia-deteccion.mp4';

// ─────────────────────────────────────────────────────────────
// SINTETIZADOR DE AUDIO TÁCTICO DE ADVERTENCIA & INFERENCIA
// ─────────────────────────────────────────────────────────────
const playSound = {
  click: () => {
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      if (ctx.state === 'suspended') ctx.resume();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(1000, ctx.currentTime);
      gain.gain.setValueAtTime(0.02, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.08);
    } catch (e) {}
  },
  glitch: () => {
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      if (ctx.state === 'suspended') ctx.resume();
      const bufferSize = ctx.sampleRate * 0.15;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }
      const noise = ctx.createBufferSource();
      noise.buffer = buffer;
      const filter = ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.value = 600;
      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.03, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);
      noise.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);
      noise.start();
    } catch (e) {}
  },
  alarm: () => {
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      if (ctx.state === 'suspended') ctx.resume();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(440, ctx.currentTime);
      osc.frequency.setValueAtTime(660, ctx.currentTime + 0.1);
      gain.gain.setValueAtTime(0.025, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.25);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.25);
    } catch (e) {}
  },
  success: () => {
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      if (ctx.state === 'suspended') ctx.resume();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, ctx.currentTime);
      osc.frequency.setValueAtTime(1320, ctx.currentTime + 0.08);
      gain.gain.setValueAtTime(0.03, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.22);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.22);
    } catch (e) {}
  }
};

// ─────────────────────────────────────────────────────────────
// COMPONENTE GRÁFICO NEURAL DINÁMICO
// ─────────────────────────────────────────────────────────────
function NeuralWaveChart() {
  const [points, setPoints] = useState([]);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setPoints(Array.from({ length: 14 }, () => Math.floor(Math.random() * 25 + 5)));
    }, 120);
    return () => clearInterval(interval);
  }, []);

  const dPath = points.length > 0 
    ? `M 0 ${points[0]} ` + points.map((p, i) => `L ${(i / 13) * 140} ${p}`).join(' ') 
    : 'M 0 15 L 140 15';

  return (
    <div className="neural-wave-hud" style={{ border: 'none', padding: 0, marginTop: 0 }}>
      <span className="hud-small-lbl" style={{ color: 'rgba(255, 255, 255, 0.35)', fontSize: '8px' }}>NEURAL FRAME RATIO</span>
      <svg width="140" height="35" viewBox="0 0 140 35" style={{ display: 'block', marginTop: '4px' }}>
        <path d={dPath} fill="none" stroke="#ef4444" strokeWidth="1" />
        <path d={dPath} fill="none" stroke="#ef4444" strokeWidth="3" opacity="0.15" style={{ filter: 'blur(1px)' }} />
      </svg>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// COMPONENTES 3D WEBGL (PLANOS Y NODOS HOLOGRÁFICOS)
// ─────────────────────────────────────────────────────────────

function CentralCore() {
  const coreRef = useRef();
  useFrame((state) => {
    if (coreRef.current) {
      coreRef.current.rotation.y = state.clock.getElapsedTime() * 0.4;
      coreRef.current.rotation.x = state.clock.getElapsedTime() * 0.2;
    }
  });
  return (
    <mesh ref={coreRef} position={[0, 0.5, 0]}>
      <octahedronGeometry args={[0.65]} />
      <meshBasicMaterial color="#ef4444" wireframe transparent opacity={0.25} />
    </mesh>
  );
}

function HolographicFloorPlan() {
  const serverRacks = [
    { pos: [-3, 0.4, -2.5], size: [0.8, 1.4, 0.5] },
    { pos: [-1.8, 0.4, -2.5], size: [0.8, 1.4, 0.5] },
    { pos: [1.8, 0.4, -2.5], size: [0.8, 1.4, 0.5] },
    { pos: [3, 0.4, -2.5], size: [0.8, 1.4, 0.5] },
    { pos: [-3, 0.4, 2.5], size: [0.8, 1.4, 0.5] },
    { pos: [3, 0.4, 2.5], size: [0.8, 1.4, 0.5] },
  ];

  return (
    <group position={[0, -0.6, 0]}>
      {/* Suelo Táctico */}
      <gridHelper args={[20, 20, '#ef4444', 'rgba(255, 255, 255, 0.03)']} position={[0, -0.1, 0]} />
      
      {/* Núcleo de Red */}
      <CentralCore />

      {/* Paredes exteriores de la instalación */}
      <mesh position={[0, 0.4, -5.5]}>
        <boxGeometry args={[11, 1, 0.04]} />
        <meshBasicMaterial color="#d97706" wireframe transparent opacity={0.06} />
      </mesh>
      <mesh position={[0, 0.4, 5.5]}>
        <boxGeometry args={[11, 1, 0.04]} />
        <meshBasicMaterial color="#d97706" wireframe transparent opacity={0.06} />
      </mesh>
      <mesh position={[-5.5, 0.4, 0]} rotation={[0, Math.PI / 2, 0]}>
        <boxGeometry args={[11, 1, 0.04]} />
        <meshBasicMaterial color="#d97706" wireframe transparent opacity={0.06} />
      </mesh>
      <mesh position={[5.5, 0.4, 0]} rotation={[0, Math.PI / 2, 0]}>
        <boxGeometry args={[11, 1, 0.04]} />
        <meshBasicMaterial color="#d97706" wireframe transparent opacity={0.06} />
      </mesh>

      {/* Racks de servidores wireframe */}
      {serverRacks.map((rack, idx) => (
        <mesh key={idx} position={rack.pos}>
          <boxGeometry args={rack.size} />
          <meshBasicMaterial color="#d97706" wireframe transparent opacity={0.14} />
        </mesh>
      ))}
    </group>
  );
}

function CameraNode({ cam, activeCam, threatCam, onSelect, setHoveredCam }) {
  const isSelected = activeCam === cam.id;
  const isThreat = threatCam === cam.id;
  const ringRef = useRef();

  useFrame((state) => {
    if (ringRef.current && ringRef.current.material) {
      const speed = isThreat ? 9 : 3.5;
      const scale = 1 + Math.sin(state.clock.getElapsedTime() * speed + cam.id) * 0.45;
      ringRef.current.scale.set(scale, scale, scale);
      ringRef.current.material.opacity = (1.55 - scale) * 0.45;
    }
  });

  return (
    <group position={cam.pos}>
      {/* Aro de Radar Pulsante */}
      <mesh ref={ringRef} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.2, 0.45, 32]} />
        <meshBasicMaterial 
          color={isThreat ? '#ef4444' : isSelected ? '#ef4444' : '#d97706'} 
          transparent 
          opacity={0.5} 
          side={THREE.DoubleSide} 
        />
      </mesh>

      {/* Punto Central Interactivo */}
      <mesh 
        onClick={(e) => { e.stopPropagation(); onSelect(cam.id); }}
        onPointerOver={(e) => { 
          e.stopPropagation(); 
          setHoveredCam(cam.id);
          document.body.style.cursor = 'pointer'; 
        }}
        onPointerOut={(e) => {
          setHoveredCam(null);
          document.body.style.cursor = 'none';
        }}
      >
        <sphereGeometry args={[0.13, 16, 16]} />
        <meshBasicMaterial color={isThreat ? '#ef4444' : isSelected ? '#ef4444' : '#f59e0b'} />
      </mesh>

      {/* Haz Láser Vertical de Alerta */}
      {isThreat && (
        <mesh position={[0, 1.2, 0]}>
          <cylinderGeometry args={[0.015, 0.08, 2.4, 16, 1, true]} />
          <meshBasicMaterial color="#ef4444" transparent opacity={0.35} side={THREE.DoubleSide} />
        </mesh>
      )}
    </group>
  );
}

// ─────────────────────────────────────────────────────────────
// COMPONENTE PRINCIPAL: HOLOGRAPHIC 3D MAP DASHBOARD
// ─────────────────────────────────────────────────────────────
export default function Dashboard() {
  const sectionRef = useRef(null);
  const containerRef = useRef(null);
  const videoRef = useRef(null);
  const videoThermalRef = useRef(null);

  // Estados
  const [activeCam, setActiveCam] = useState(null); // null (sin PIP) o 1,2,3,4
  const [threatCam, setThreatCam] = useState(null); // null o 1,2,3,4 (pulsando rojo)
  const [threatMsg, setThreatMsg] = useState('');
  const [hoveredCam, setHoveredCam] = useState(null);
  
  const [gridActive, setGridActive] = useState(true);
  const [nightVision, setNightVision] = useState(false);
  const [inView, setInView] = useState(false);
  const [utcTime, setUtcTime] = useState('');
  const [logs, setLogs] = useState([
    { t: '03:00:00', m: 'SISTEMA INICIALIZADO. MODO ZERO-TRUST ACTIVO.' },
    { t: '03:00:05', m: 'MAPA HOLOGRÁFICO CARGADO. ENLACE ENCRIPTADO.' },
  ]);

  // Feeds y Datos de Cámaras
  const cameraFeeds = [
    { id: 1, name: 'CAM_01 // ACCESO_PRINCIPAL', filter: 'grayscale(100%)', timeOffset: 0, bitrate: '4.8 Mbps', location: 'Puerta Recepción', pos: [-3.5, -0.1, 1.8] },
    { id: 2, name: 'CAM_02 // SALA_SERVIDORES', filter: 'hue-rotate(200deg) saturate(2.5) contrast(1.2) brightness(0.75)', timeOffset: 4, bitrate: '6.2 Mbps', location: 'Rack Central', pos: [1.2, -0.1, -1.5] },
    { id: 3, name: 'CAM_03 // PERÍMETRO_NORTE', filter: 'hue-rotate(90deg) saturate(3) contrast(1.5) brightness(0.65)', timeOffset: 8, bitrate: '3.9 Mbps', location: 'Acceso Exterior', pos: [3.8, -0.1, 3.2] },
    { id: 4, name: 'CAM_04 // PASILLO_OFICINAS', filter: 'grayscale(70%) contrast(1.4) brightness(0.8) scaleX(-1)', timeOffset: 12, bitrate: '5.1 Mbps', location: 'Pasillo C', pos: [-2.5, -0.1, -2.8] }
  ];

  // Observador de visibilidad para suspender WebGL
  useEffect(() => {
    if (!sectionRef.current) return;
    const obs = new IntersectionObserver(([entry]) => {
      setInView(entry.isIntersecting);
    }, { threshold: 0.05 });
    obs.observe(sectionRef.current);
    return () => obs.disconnect();
  }, []);

  // Reloj UTC
  useEffect(() => {
    const updateTime = () => {
      const d = new Date();
      setUtcTime(d.toUTCString().replace('GMT', 'UTC'));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Bloquear scroll de la página de forma segura (previniendo saltos al inicio)
  useEffect(() => {
    if (activeCam !== null) {
      const preventDefault = (e) => {
        const keys = [' ', 'PageUp', 'PageDown', 'End', 'Home', 'ArrowUp', 'ArrowDown'];
        if (keys.includes(e.key)) {
          e.preventDefault();
        }
      };
      const preventScroll = (e) => {
        e.preventDefault();
      };

      // Registrar listeners pasivos false para anular el scroll nativo e inercias
      window.addEventListener('wheel', preventScroll, { passive: false });
      window.addEventListener('touchmove', preventScroll, { passive: false });
      window.addEventListener('keydown', preventDefault, { passive: false });

      return () => {
        window.removeEventListener('wheel', preventScroll);
        window.removeEventListener('touchmove', preventScroll);
        window.removeEventListener('keydown', preventDefault);
      };
    }
  }, [activeCam]);

  // Evitar foco y auto-scroll nativo del navegador al interactuar con el canvas 3D
  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      const canvas = container.querySelector('.holographic-map-viewport canvas');
      if (canvas) {
        // Sobrescribir el método focus nativo del canvas para desactivar auto-scroll
        const originalFocus = canvas.focus;
        canvas.focus = function(options) {
          if (originalFocus) {
            originalFocus.call(this, { preventScroll: true, ...options });
          }
        };
        // Desactivar el foco de teclado por clicks
        canvas.setAttribute('tabindex', '-1');
      }
    }
  }, [inView]);

  // Sincronización Térmica Segura & inicialización de offset
  useEffect(() => {
    if (activeCam !== null) {
      const sync = () => {
        const main = videoRef.current;
        const thermal = videoThermalRef.current;
        if (main && thermal && main.readyState >= 1 && thermal.readyState >= 1) {
          if (Math.abs(thermal.currentTime - main.currentTime) > 0.15) {
            thermal.currentTime = main.currentTime;
          }
        }
      };
      
      // Aplicar offset inicial
      const camData = cameraFeeds.find(c => c.id === activeCam);
      const main = videoRef.current;
      const thermal = videoThermalRef.current;
      if (main) main.currentTime = camData.timeOffset;
      if (thermal) thermal.currentTime = camData.timeOffset;

      const interval = setInterval(sync, 500);
      return () => clearInterval(interval);
    }
  }, [activeCam]);

  // Generador de Amenazas Aleatorias (cada 16s si no hay amenaza activa)
  useEffect(() => {
    const triggerThreat = () => {
      if (threatCam === null && activeCam === null) {
        const randomId = Math.floor(Math.random() * 4) + 1;
        const camData = cameraFeeds.find(c => c.id === randomId);
        
        playSound.alarm();
        setThreatCam(randomId);
        setThreatMsg(`⚠️ ALERTA DE INTRUSIÓN: SECTOR ${camData.location.toUpperCase()} // YOLOv8 INFERENCIA LOCAL`);
        
        const nowStr = new Date().toTimeString().split(' ')[0];
        setLogs(prev => [
          { t: nowStr, m: `🚨 ALERTA: INTROMISIÓN EN SECTOR ${camData.location.toUpperCase()}` },
          ...prev.slice(0, 5)
        ]);
      }
    };
    const interval = setInterval(triggerThreat, 16000);
    return () => clearInterval(interval);
  }, [threatCam, activeCam]);

  // Manejar selección de nodo
  const handleCamSelect = (id) => {
    playSound.glitch();
    setActiveCam(id);
    const camData = cameraFeeds.find(c => c.id === id);
    const nowStr = new Date().toTimeString().split(' ')[0];
    setLogs(prev => [
      { t: nowStr, m: `📡 CONEXIÓN ESTABLECIDA CON CANAL: ${camData.name}` },
      ...prev.slice(0, 5)
    ]);
  };

  // Resolver y Encriptar Amenaza
  const handleResolveThreat = () => {
    if (threatCam !== null) {
      playSound.success();
      const camData = cameraFeeds.find(c => c.id === threatCam);
      const nowStr = new Date().toTimeString().split(' ')[0];
      setLogs(prev => [
        { t: nowStr, m: `🔒 AMENAZA RESUELTA EN SECTOR: ${camData.location.toUpperCase()}` },
        { t: nowStr, m: `✅ ARCHIVO DE EVIDENCIAS ENCRIPTADO (AES-GCM-256) Y TRANSFERIDO.` },
        ...prev.slice(0, 5)
      ]);
      setThreatCam(null);
      setThreatMsg('');
    }
  };

  // ── Inclinación 3D del Panel e Infrarrojo
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { damping: 28, stiffness: 140, mass: 0.45 });
  const springY = useSpring(mouseY, { damping: 28, stiffness: 140, mass: 0.45 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    mouseX.set(e.clientX - rect.left);
    mouseY.set(e.clientY - rect.top);
  };

  const maskRadius = useMotionValue(0);
  const springRadius = useSpring(maskRadius, { damping: 20, stiffness: 95 });

  useEffect(() => {
    maskRadius.set(isHovered && activeCam !== null ? 120 : 0);
  }, [isHovered, activeCam]);

  const clipPath = useMotionTemplate`circle(${springRadius}px at ${springX}px ${springY}px)`;

  // Scroll Choreography
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end end'],
  });

  const titleOpacity = useTransform(scrollYProgress, [0, 0.05, 0.12], [1, 1, 0]);
  const titleY       = useTransform(scrollYProgress, [0, 0.12], [0, -100]);

  const panelY     = useTransform(scrollYProgress, [0, 0.10, 0.24, 0.84, 0.95], ['100%', '100%', '0%', '0%', '-10%']);
  const panelScale = useTransform(scrollYProgress, [0, 0.24, 0.84, 0.95], [0.96, 1, 1, 0.95]);
  const panelAlpha = useTransform(scrollYProgress, [0.84, 0.95], [1, 0]);

  return (
    <section ref={sectionRef} className="monolith-section" style={{ perspective: 1000 }}>
      <div className="monolith-sticky">

        {/* Cinematic Intro Title */}
        <motion.div
          className="monolith-eyebrow"
          style={{ opacity: titleOpacity, y: titleY }}
        >
          <h2 className="monolith-title">Holographic Map.</h2>
          <p className="poetic-subtitle">
            Monitoreo en AR. Detección activa de amenazas. Control tridimensional.
          </p>
        </motion.div>

        {/* 3D BOARD SHELL */}
        <div className="monolith-clip">
          <motion.div
            ref={containerRef}
            className={`monolith-panel ${activeCam !== null ? 'focused-active' : ''}`}
            style={{ 
              y: activeCam !== null ? '0%' : panelY, 
              scale: activeCam !== null ? 1 : panelScale, 
              opacity: activeCam !== null ? 1 : panelAlpha,
              transformStyle: 'preserve-3d',
              backgroundColor: 'rgba(4, 4, 6, 0.95)',
              border: '1px solid rgba(255, 255, 255, 0.05)'
            }}
            onMouseMove={handleMouseMove}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => {
              setIsHovered(false);
              document.body.style.cursor = 'none';
            }}
          >
            {/* AMENAZAS TOP BANNER SLIDE DOWN */}
            <AnimatePresence>
              {threatCam !== null && (
                <motion.div 
                  className="tactical-threat-banner"
                  initial={{ y: -60, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -60, opacity: 0 }}
                  transition={{ type: 'spring', damping: 20 }}
                >
                  <div className="threat-banner-content">
                    <AlertTriangle size={18} color="#ef4444" className="blink-icon" />
                    <span>{threatMsg}</span>
                    <button 
                      onClick={() => handleCamSelect(threatCam)}
                      className="threat-banner-btn"
                    >
                      INVESTIGAR
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* WEBGL 3D FACILITY VIEWPORT */}
            <div className="holographic-map-viewport" style={{ width: '100%', height: '100%', position: 'absolute', inset: 0, zIndex: 1 }}>
              <Canvas 
                camera={{ position: [0, 6, 8], fov: 40 }} 
                dpr={[1, 1.5]} 
                frameloop={inView ? 'always' : 'never'}
                gl={{ powerPreference: 'high-performance', antialias: true }}
              >
                <Suspense fallback={null}>
                  <OrbitControls 
                    enableZoom={true} 
                    maxPolarAngle={Math.PI / 2.2} 
                    minDistance={4} 
                    maxDistance={12} 
                    autoRotate={activeCam === null} 
                    autoRotateSpeed={0.4} 
                    makeDefault 
                  />
                  <ambientLight intensity={0.15} />
                  <pointLight position={[10, 10, 10]} intensity={1.5} color="#ef4444" />
                  
                  {/* Plano de la Planta */}
                  <HolographicFloorPlan />

                  {/* Nodos de Cámaras Tácticas */}
                  {cameraFeeds.map(cam => (
                    <CameraNode 
                      key={cam.id} 
                      cam={cam} 
                      activeCam={activeCam} 
                      threatCam={threatCam}
                      onSelect={handleCamSelect}
                      setHoveredCam={setHoveredCam}
                    />
                  ))}

                  <Sparkles count={30} scale={9} size={1} speed={0.3} color="#d97706" opacity={0.35} />
                </Suspense>
              </Canvas>
            </div>

            {/* ── INTERACTIVE BADGE OVERLAYS (GLASS HUD) ── */}

            {/* HUD ESQUINA INFERIOR IZQUIERDA: LOGS DEL SOC */}
            <div className="holographic-hud-card hud-logs" style={{ position: 'absolute', bottom: '20px', left: '20px', zIndex: 10, width: '280px', background: 'rgba(0,0,0,0.78)', border: '1px solid rgba(255,255,255,0.06)', padding: '12px 16px', borderRadius: '8px', fontFamily: 'monospace', fontSize: '9px', pointerEvents: 'none' }}>
              <div style={{ color: '#ef4444', fontWeight: 'bold', marginBottom: '8px', letterSpacing: '1px', borderBottom: '1px solid rgba(239, 68, 68, 0.2)', paddingBottom: '4px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span>● LOGS DE SEGURIDAD</span>
                <span style={{ fontSize: '8px', opacity: 0.5 }}>SOC LIVE</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                {logs.map((log, i) => (
                  <div key={i} style={{ display: 'grid', gridTemplateColumns: '50px 1fr', gap: '6px', opacity: 1 - i * 0.16 }}>
                    <span style={{ color: 'rgba(255,255,255,0.35)' }}>[{log.t}]</span>
                    <span style={{ color: log.m.includes('🚨') ? '#ef4444' : log.m.includes('🔒') ? '#10b981' : '#fff' }}>{log.m}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* HUD ESQUINA SUPERIOR IZQUIERDA: ESTADO GENERAL */}
            <div className="holographic-hud-card" style={{ position: 'absolute', top: '20px', left: '20px', zIndex: 10, background: 'rgba(0,0,0,0.78)', border: '1px solid rgba(255,255,255,0.06)', padding: '10px 14px', borderRadius: '6px', fontFamily: 'monospace', fontSize: '9px', color: 'rgba(255,255,255,0.7)', pointerEvents: 'none' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#10b981', fontWeight: 'bold', marginBottom: '4px' }}>
                <span className="cctv-status-dot active" style={{ backgroundColor: '#10b981' }} />
                <span>SISTEMA OPERATIVO NOMINAL</span>
              </div>
              <div style={{ fontSize: '8px', color: 'rgba(255,255,255,0.4)' }}>
                LATENCIA SOC: 12ms • ZERO-TRUST ENFORCED
              </div>
              <div style={{ fontSize: '8px', color: 'rgba(255,255,255,0.4)', marginTop: '2px' }}>
                {utcTime}
              </div>
            </div>

            {/* TOOLTIP FLOTANTE TÁCTICO */}
            <AnimatePresence>
              {hoveredCam !== null && (
                <motion.div 
                  className="holographic-map-tooltip"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  style={{ position: 'absolute', top: '20px', right: '20px', zIndex: 10, width: '220px', background: 'rgba(0,0,0,0.85)', border: '1px solid rgba(245,158,11,0.35)', padding: '12px 14px', borderRadius: '6px', pointerEvents: 'none' }}
                >
                  <div style={{ color: '#f59e0b', fontSize: '10px', fontFamily: 'monospace', fontWeight: 'bold' }}>
                    {cameraFeeds.find(c => c.id === hoveredCam).name}
                  </div>
                  <div style={{ color: '#fff', fontSize: '9px', fontFamily: 'monospace', marginTop: '4px' }}>
                    Ubicación: {cameraFeeds.find(c => c.id === hoveredCam).location}
                  </div>
                  <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '8px', fontFamily: 'monospace', marginTop: '2px' }}>
                    Click en el sensor para conectar feed.
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* ── VISOR FLOTANTE PICTURE-IN-PICTURE (PIP) ── */}
            <AnimatePresence>
              {activeCam !== null && (
                <motion.div 
                  className="pip-visor-overlay"
                  initial={{ opacity: 0, x: 100, scale: 0.98 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  exit={{ opacity: 0, x: 100, scale: 0.98 }}
                  transition={{ type: 'spring', damping: 22 }}
                  style={{ position: 'absolute', top: '20px', bottom: '20px', right: '20px', width: '380px', zIndex: 20, background: 'rgba(8, 8, 12, 0.88)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '12px', backdropFilter: 'blur(16px)', display: 'flex', flexDirection: 'column', overflow: 'hidden', boxShadow: '-10px 0 30px rgba(0,0,0,0.5)' }}
                >
                  {/* Header */}
                  <div className="pip-header" style={{ padding: '12px 16px', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span className="cctv-status-dot active" />
                      <span style={{ fontSize: '10px', fontFamily: 'monospace', fontWeight: 'bold', color: '#fff', letterSpacing: '0.05em' }}>
                        FEED: {cameraFeeds.find(c => c.id === activeCam).location.toUpperCase()}
                      </span>
                    </div>
                    <button 
                      onClick={() => { playSound.click(); setActiveCam(null); }}
                      style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.5)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                    >
                      <X size={16} />
                    </button>
                  </div>

                  {/* Video Screen Area */}
                  <div className="pip-video-area" style={{ flex: 1.2, position: 'relative', overflow: 'hidden', background: '#000' }}>
                    <div className="focused-video-wrapper" style={{ width: '100%', height: '100%', position: 'absolute', inset: 0 }}>
                      {/* Capa Base */}
                      <video
                        ref={videoRef}
                        src={videoSrc}
                        autoPlay loop muted playsInline
                        className="focused-main-video"
                        style={{ 
                          width: '100%', 
                          height: '100%', 
                          objectFit: 'cover',
                          filter: cameraFeeds.find(c => c.id === activeCam).filter 
                        }}
                      />

                      {/* Capa Infrarroja Revelada */}
                      <motion.video
                        ref={videoThermalRef}
                        src={videoSrc}
                        autoPlay loop muted playsInline
                        className="focused-thermal-video"
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                          filter: 'hue-rotate(270deg) saturate(3.5) contrast(1.5) brightness(0.9)',
                          clipPath: clipPath,
                          position: 'absolute',
                          inset: 0,
                          zIndex: 2,
                          pointerEvents: 'none'
                        }}
                      />

                      {/* Velo y grilla táctica */}
                      <div className="monolith-veil" style={{ zIndex: 3 }} />
                      {gridActive && <div className="tactical-grid-overlay active" style={{ zIndex: 3 }} />}
                      <div className={`night-vision-video-tint ${nightVision ? 'active' : ''}`} style={{ zIndex: 3 }} />
                    </div>

                    {/* MIRA HUD FLOTANTE SOBRE EL CURSOR (AI Tracking Box) */}
                    {isHovered && (
                      <motion.div
                        className="hud-user-box"
                        style={{
                          x: springX,
                          y: springY,
                          zIndex: 5
                        }}
                      >
                        <div className="bracket-corner bracket-tl" />
                        <div className="bracket-corner bracket-tr" />
                        <div className="bracket-corner bracket-bl" />
                        <div className="bracket-corner bracket-br" />
                        <div className="hud-user-tag">
                          <span className="hud-user-lock" style={{ background: '#ef4444' }}>BUSCADOR TÉRMICO</span>
                          <span className="hud-user-subj">YOLOv8 ACTIVE</span>
                        </div>
                      </motion.div>
                    )}
                  </div>

                  {/* Controls & Telemetry */}
                  <div className="pip-footer" style={{ padding: '16px', background: 'rgba(4, 4, 6, 0.95)', borderTop: '1px solid rgba(255,255,255,0.06)', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ display: 'flex', gap: '6px' }}>
                        <button 
                          className={`tactical-btn ${gridActive ? 'active' : ''}`} 
                          onClick={() => { playSound.click(); setGridActive(!gridActive); }}
                          style={{ fontSize: '8px', padding: '5px 8px' }}
                        >
                          GRID
                        </button>
                        <button 
                          className={`tactical-btn ${nightVision ? 'active' : ''}`} 
                          onClick={() => { playSound.click(); setNightVision(!nightVision); }}
                          style={{ fontSize: '8px', padding: '5px 8px' }}
                        >
                          NIGHT VISION
                        </button>
                      </div>
                      <span style={{ fontSize: '8.5px', fontFamily: 'monospace', color: '#f59e0b' }}>
                        CONFIDENCIA: 96.8%
                      </span>
                    </div>

                    {/* Fila de telemetría */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', borderTop: '1px solid rgba(255,255,255,0.04)', paddingTop: '10px', fontSize: '8px', fontFamily: 'monospace', color: 'rgba(255,255,255,0.5)' }}>
                      <div>STREAM_FPS: <span style={{ color: '#fff' }}>60 FPS</span></div>
                      <div>BITRATE: <span style={{ color: '#fff' }}>{cameraFeeds.find(c => c.id === activeCam).bitrate}</span></div>
                      <div>ANÁLISIS: <span style={{ color: '#ef4444' }}>YOLOv8 LOCAL</span></div>
                      <div>CIFRADO: <span style={{ color: '#fff' }}>AES-256</span></div>
                    </div>

                    {/* Gráfico SVG Neural y Botón Resolver */}
                    <div style={{ borderTop: '1px solid rgba(255,255,255,0.04)', paddingTop: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <NeuralWaveChart />
                      
                      {threatCam === activeCam ? (
                        <button 
                          onClick={handleResolveThreat}
                          className="resolve-threat-btn blink-red"
                          style={{ background: '#ef4444', color: '#fff', border: 'none', padding: '8px 12px', borderRadius: '4px', fontFamily: 'monospace', fontSize: '8.5px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
                        >
                          <AlertTriangle size={10} /> RESOLVER ALERTA
                        </button>
                      ) : (
                        <button 
                          onClick={() => {
                            playSound.success();
                            const nowStr = new Date().toTimeString().split(' ')[0];
                            setLogs(prev => [{ t: nowStr, m: `🔒 CANAL SEGURIZADO DE MANERA TÁCTICA.` }, ...prev]);
                          }}
                          className="resolve-threat-btn"
                          style={{ background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.8)', border: '1px solid rgba(255,255,255,0.1)', padding: '8px 12px', borderRadius: '4px', fontFamily: 'monospace', fontSize: '8.5px', cursor: 'pointer' }}
                        >
                          <ShieldCheck size={10} style={{ display: 'inline', marginRight: '4px', verticalAlign: 'middle' }} /> SEGURIZAR
                        </button>
                      )}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

          </motion.div>
        </div>

      </div>
    </section>
  );
}
