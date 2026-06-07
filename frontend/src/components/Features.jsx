import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import DecryptedText from './DecryptedText';
import MaskReveal from './ui/MaskReveal';
import EditorialTextDrift from './ui/EditorialTextDrift';
import analyticsImg from '../assets/svivadasboard.jpeg';

export default function Features() {
  const containerRef = useRef(null);

  // Rastreamos el scroll solo dentro de esta inmensa sección
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  // Hacemos que la imagen estática haga "zoom" sutilmente conforme vas leyendo las fases
  const imageScale = useTransform(scrollYProgress, [0, 1], [1, 1.2]);
  const imageFilter = useTransform(scrollYProgress, [0, 0.5, 1], ['brightness(1) blur(0px)', 'brightness(0.6) blur(2px)', 'brightness(0.3) blur(5px)']);

  // Morphing de salida: Al final del scroll (0.8 a 1.0), la sección se "encoge" en un círculo
  const clipPath = useTransform(
    scrollYProgress,
    [0, 0.8, 1],
    [
      "inset(0% 0% 0% 0% round 0px)",
      "inset(0% 0% 0% 0% round 0px)",
      "inset(15% 15% 15% 15% round 500px)"
    ]
  );

  return (
    // Aumentamos ligeramente el height para que la fase de morphing sea suave
    <section ref={containerRef} style={{ position: 'relative', height: '350vh', backgroundColor: '#000' }}>
      
      {/* EL CONTENEDOR STICKY AHORA TIENE EL MASK MORPHING */}
      <motion.div 
        style={{ 
          position: 'sticky', top: 0, height: '100vh', 
          display: 'flex', alignItems: 'center', justifyContent: 'center', 
          overflow: 'hidden',
          clipPath: clipPath, // Aquí ocurre la magia del morphing
          zIndex: 5
        }}
      >
        
        {/* Imagen central con animaciones y EFECTO ESCÁNER */}
        <motion.div 
           className="scanner-container"
           style={{ 
             width: '60vw', height: '70vh', 
             borderRadius: '32px', overflow: 'hidden',
             boxShadow: '0 0 80px rgba(239, 68, 68, 0.25)',
             scale: imageScale,
             filter: imageFilter,
             position: 'relative'
           }}
           whileHover="hover"
        >
          <MaskReveal duration={1.6}>
            <img 
              src={analyticsImg} 
              alt="SVIVIA Analiticas" 
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </MaskReveal>
          
          {/* LÍNEA DE ESCANEO (SCANLINE) */}
          <div className="scan-line" />

          {/* HUD DE ESQUINAS (Se activan en Hover) */}
          <motion.div 
            className="hud-corners"
            variants={{
              initial: { opacity: 0, scale: 1.1 },
              hover: { opacity: 1, scale: 1 }
            }}
            initial="initial"
          >
            <div className="corner tl" />
            <div className="corner tr" />
            <div className="corner bl" />
            <div className="corner br" />
            
            {/* Texto de estado IA */}
            <div className="scan-status">
               <span className="dot" /> ANALYZING_STREAM...
            </div>
          </motion.div>
          
          <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle, transparent 40%, rgba(0,0,0,0.8) 100%)' }} />
        </motion.div>
      </motion.div>

      {/* LOS TEXTOS EN FASES (Ahora con pointer-events: none para no tapar la imagen) */}
      <div style={{ position: 'relative', zIndex: 10, marginTop: '-100vh', paddingBottom: '50vh', pointerEvents: 'none' }}>
        
        <div style={{ height: '100vh', display: 'flex', alignItems: 'center', paddingLeft: '10vw' }}>
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: false, amount: 0.5 }}
            transition={{ duration: 0.8 }}
            style={{ 
              background: 'rgba(10,10,10,0.85)', padding: '3.5rem', borderRadius: '24px', 
              backdropFilter: 'blur(15px)', border: '1px solid rgba(255,255,255,0.1)', 
              maxWidth: '450px', boxShadow: '0 30px 60px rgba(0,0,0,0.5)',
              pointerEvents: 'auto' // Re-activamos el mouse para el texto
            }}
          >
             <h3 className="poetic-feature-title" style={{ fontSize: '2.8rem', marginBottom: '1rem', lineHeight: 1.2 }}>
                <EditorialTextDrift 
                  line1={<DecryptedText text="Fase 1:" style={{ color: '#fff' }} />} 
                  line2={<DecryptedText text="Identificación." style={{ color: '#ef4444' }} />} 
                />
             </h3>
             <p style={{ color: '#a3a3a3', fontSize: '1.2rem', lineHeight: 1.6 }}>El modelo YOLOv8 escanea la geometría en tiempo real. Cada píxel es analizado buscando amenazas potenciales. La luz y la sombra ya no son excusa.</p>
          </motion.div>
        </div>

        <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', paddingRight: '10vw' }}>
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: false, amount: 0.5 }}
            transition={{ duration: 0.8 }}
            style={{ 
              background: 'rgba(10,10,10,0.85)', padding: '3.5rem', borderRadius: '24px', 
              backdropFilter: 'blur(15px)', border: '1px solid rgba(255,255,255,0.1)', 
              maxWidth: '450px', boxShadow: '0 30px 60px rgba(0,0,0,0.5)',
              pointerEvents: 'auto'
            }}
          >
             <h3 className="poetic-feature-title" style={{ fontSize: '2.8rem', marginBottom: '1rem', lineHeight: 1.2 }}>
                <EditorialTextDrift 
                  line1={<DecryptedText text="Fase 2:" style={{ color: '#fff' }} />} 
                  line2={<DecryptedText text="Motor Cero Nube." style={{ color: '#ef4444' }} />} 
                />
             </h3>
             <p style={{ color: '#a3a3a3', fontSize: '1.2rem', lineHeight: 1.6 }}>Tu imagen, como esta, no sale de tu red. El procesamiento neuronal ocurre en el hardware local garantizando una privacidad que ninguna empresa grande te ofrece.</p>
          </motion.div>
        </div>

        <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.5 }}
            transition={{ duration: 0.8 }}
            style={{ 
              background: 'rgba(10,10,10,0.85)', padding: '3.5rem', borderRadius: '24px', 
              backdropFilter: 'blur(15px)', border: '1px solid rgba(255,255,255,0.1)', 
              maxWidth: '550px', textAlign: 'center', boxShadow: '0 30px 60px rgba(0,0,0,0.5)',
              pointerEvents: 'auto'
            }}
          >
             <h3 className="poetic-feature-title" style={{ fontSize: '2.8rem', marginBottom: '1rem', lineHeight: 1.2 }}>
                <EditorialTextDrift 
                  line1={<DecryptedText text="Fase 3:" style={{ color: '#fff' }} />} 
                  line2={<DecryptedText text="Evidencia Directa." style={{ color: '#ef4444' }} />} 
                />
             </h3>
             <p style={{ color: '#a3a3a3', fontSize: '1.2rem', lineHeight: 1.6 }}>En caso de detección positiva, los frames en alta definición se encriptan y se envían de forma nativa a tu dispositivo a través de la integración con Telegram.</p>
          </motion.div>
        </div>

      </div>
    </section>
  );
}
