import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { Download as DownloadIcon, Cpu, Shield, Zap } from 'lucide-react';

export default function Download() {
  const containerRef = useRef(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const smoothProgress = useSpring(scrollYProgress, { damping: 25, stiffness: 80 });

  // 1. FONDO OPTIMIZADO: Sin rotaciones en 3D (rotateX). Solo escala pura (muy barato para la GPU)
  const gridScale = useTransform(smoothProgress, [0, 1], [1, 1.15]);
  const gridOpacity = useTransform(smoothProgress, [0, 0.5], [0, 0.15]);

  // 2. LENTE/OJO IA OPTIMIZADO: Eliminados los 'box-shadow' que matan los FPS
  const ringRotate = useTransform(smoothProgress, [0, 1], [0, 90]);
  const ringScale = useTransform(smoothProgress, [0, 0.5], [0.6, 1.1]);
  const ringOpacity = useTransform(smoothProgress, [0, 0.4], [0, 0.8]);

  // 3. TARJETA OPTIMIZADA: Transformación sencilla de Y (arriba/abajo)
  const cardY = useTransform(smoothProgress, [0, 0.5], [150, 0]);
  const cardOpacity = useTransform(smoothProgress, [0, 0.4], [0, 1]);

  return (
    <section ref={containerRef} className="poetic-section" style={{ minHeight: '130vh', position: 'relative', overflow: 'hidden', backgroundColor: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      
      {/* CAPA 1: FONDO OPTIMIZADO */}
      <motion.div 
        style={{
          position: 'absolute', inset: -200,
          backgroundImage: 'linear-gradient(rgba(79, 70, 229, 0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(79, 70, 229, 0.15) 1px, transparent 1px)',
          backgroundSize: '100px 100px',
          opacity: gridOpacity,
          scale: gridScale,
          transformOrigin: 'center center',
          pointerEvents: 'none',
          zIndex: 0,
          willChange: 'transform, opacity' // ⚡ IMPORTANTE: Le dice a la tarjeta gráfica que procese esto por separado
        }}
      />

      {/* CAPA 2: ANILLOS (Sin sombras pesadas) */}
      <motion.div
        style={{
          position: 'absolute', top: '50%', left: '50%', x: '-50%', y: '-50%',
          width: '80vw', height: '80vw',
          maxWidth: '1000px', maxHeight: '1000px',
          borderRadius: '50%',
          border: '2px dashed rgba(79, 70, 229, 0.4)',
          rotate: ringRotate,
          scale: ringScale,
          opacity: ringOpacity,
          pointerEvents: 'none',
          zIndex: 1,
          display: 'flex', justifyContent: 'center', alignItems: 'center',
          willChange: 'transform, opacity' // ⚡ Optimización GPU
        }}
      >
         <div style={{ width: '65%', height: '65%', borderRadius: '50%', border: '1px solid rgba(255,255,255,0.1)' }} />
      </motion.div>

      {/* CAPA 3: TARJETA (Sin blur extremo) */}
      <motion.div 
        style={{ 
          y: cardY, opacity: cardOpacity,
          zIndex: 2, position: 'relative',
          // En lugar de usar backdrop-filter (blur) que destruye los FPS, usamos un gradiente casi opaco
          background: 'linear-gradient(145deg, rgba(20,20,25,0.98) 0%, rgba(5,5,10,0.98) 100%)',
          border: '1px solid rgba(255,255,255,0.05)',
          borderRadius: '32px',
          padding: '5rem 4rem', maxWidth: '900px', width: '90%',
          display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center',
          willChange: 'transform, opacity' // ⚡ Optimización GPU
        }}
      >
        <div style={{ display: 'flex', gap: '1.5rem', marginBottom: '2.5rem' }}>
           <Cpu size={32} color="#4f46e5" />
           <Shield size={32} color="#4f46e5" />
           <Zap size={32} color="#4f46e5" />
        </div>

        <h2 className="poetic-title-huge" style={{ fontSize: '4rem', marginBottom: '1.5rem', background: 'linear-gradient(to right, #ffffff, #737373)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', lineHeight: '1.1' }}>
          Instala el futuro.
        </h2>
        <p className="poetic-subtitle" style={{ marginBottom: '4rem', fontSize: '1.3rem', color: '#a3a3a3', maxWidth: '600px', lineHeight: '1.6' }}>
          La vigilancia inteligente y privada, corriendo nativamente en tu hardware. Sin retrasos. Sin la nube.
        </p>

        <motion.button 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          style={{
            position: 'relative', overflow: 'hidden',
            display: 'flex', alignItems: 'center', gap: '15px',
            padding: '1.5rem 3.5rem',
            background: '#ffffff', color: '#000000',
            border: 'none', borderRadius: '50px',
            fontSize: '1.2rem', fontWeight: '600', fontFamily: 'var(--font-sans)',
            cursor: 'pointer'
          }}
        >
          <DownloadIcon size={22} />
          Descargar SVIVIA 1.0
        </motion.button>

        <div style={{ marginTop: '4rem', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '3rem', width: '100%', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '3rem', color: '#737373', fontSize: '1rem', fontFamily: 'var(--font-sans)', textAlign: 'left' }}>
          <div>
            <strong style={{ color: '#fff', display: 'block', marginBottom: '0.5rem', fontSize: '1.1rem' }}>OS</strong>
            Windows 10 / 11 (64-bit)
          </div>
          <div>
             <strong style={{ color: '#fff', display: 'block', marginBottom: '0.5rem', fontSize: '1.1rem' }}>Hardware</strong>
            NVIDIA RTX (Recomendado)
          </div>
          <div>
             <strong style={{ color: '#fff', display: 'block', marginBottom: '0.5rem', fontSize: '1.1rem' }}>Tamaño</strong>
            ~450 MB (Instalador Offline)
          </div>
        </div>
      </motion.div>
    </section>
  );
}
