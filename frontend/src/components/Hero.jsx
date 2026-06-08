import React, { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform, useMotionValueEvent, useSpring } from 'framer-motion';

// Sabemos que Ezgif nos generó 143 imágenes
const FRAME_COUNT = 143;

export default function Hero({ isLoaded }) {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const [images, setImages] = useState([]);

  // Control de la animación inicial tras la carga
  const [startIntro, setStartIntro] = useState(false);
  useEffect(() => {
    if (isLoaded) {
      // Retardo de 250ms para que se sincronice con el desvanecimiento de la pantalla de carga
      const t = setTimeout(() => setStartIntro(true), 250);
      return () => clearTimeout(t);
    }
  }, [isLoaded]);

  // ==========================================
  // PRECARGA DE IMÁGENES (Para que no haya lag al hacer scroll)
  // ==========================================
  useEffect(() => {
    const loadedImages = [];
    
    for (let i = 1; i <= FRAME_COUNT; i++) {
      const img = new Image();
      const paddedNumber = String(i).padStart(3, '0');
      img.src = `/hero-frames/ezgif-frame-${paddedNumber}.jpg`;
      
      img.onload = () => {
        if (i === 1 && canvasRef.current) {
          const ctx = canvasRef.current.getContext('2d');
          canvasRef.current.width = img.width;
          canvasRef.current.height = img.height;
          ctx.drawImage(img, 0, 0);
        }
      };
      loadedImages.push(img);
    }
    setImages(loadedImages);
  }, []);

  // Reloj de tiempo real para la telemetría
  const [liveTime, setLiveTime] = useState("");
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const pad = (n) => String(n).padStart(2, '0');
      const dateStr = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
      const timeStr = `${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;
      setLiveTime(`${dateStr} ${timeStr}`);
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const requestRef = useRef();

  // ==========================================
  // CANVAS IMAGE SEQUENCE
  // ==========================================
  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    if (images.length === 0 || !canvasRef.current) return;

    const frameIndex = Math.min(
      FRAME_COUNT - 1,
      Math.floor(latest * FRAME_COUNT)
    );

    if (requestRef.current) cancelAnimationFrame(requestRef.current);

    requestRef.current = requestAnimationFrame(() => {
      const img = images[frameIndex];
      if (img && img.complete) {
        const ctx = canvasRef.current.getContext('2d');
        if (canvasRef.current.width !== img.width) {
          canvasRef.current.width = img.width;
          canvasRef.current.height = img.height;
        }
        ctx.drawImage(img, 0, 0);
      }
    });
  });

  // ==========================================
  // SCROLL-LINKED SPRING TRANSFORMS (Premium Scrollytelling)
  // ==========================================
  
  // 1. Desvanecimiento y desplazamiento vertical del texto central
  const textOpacity = useTransform(scrollYProgress, [0, 0.25], [1, 0]);
  const textYVal = useTransform(scrollYProgress, [0, 0.25], [0, -60]);
  const textY = useSpring(textYVal, { damping: 40, stiffness: 200 });
  const textScaleVal = useTransform(scrollYProgress, [0, 0.25], [1, 0.96]);
  const textScale = useSpring(textScaleVal, { damping: 40, stiffness: 200 });

  // 2. Expansión del espaciado de letras de la marca (de 24px a 56px para mayor elegancia)
  const letterSpacingVal = useTransform(scrollYProgress, [0, 0.25], [24, 56]);
  const letterSpacingSpring = useSpring(letterSpacingVal, { damping: 40, stiffness: 180 });
  const letterSpacing = useTransform(letterSpacingSpring, (v) => `${v}px`);

  // 3. Zoom cinemático lento del fondo (scale 1.02 a 1.12)
  const canvasScaleVal = useTransform(scrollYProgress, [0, 0.25], [1.02, 1.12]);
  const canvasScale = useSpring(canvasScaleVal, { damping: 50, stiffness: 300 });

  // 4. Parallax de las tarjetas laterales: VISIBLES AL INICIO (scroll 0) y se desvanecen al scrollear
  const cardLeftXVal = useTransform(scrollYProgress, [0, 0.10, 0.22], [0, 0, -80]);
  const cardLeftX = useSpring(cardLeftXVal, { damping: 40, stiffness: 200 });
  
  const cardLeftYVal = useTransform(scrollYProgress, [0, 0.10, 0.22], [0, 0, -40]);
  const cardLeftY = useSpring(cardLeftYVal, { damping: 40, stiffness: 200 });
  
  const cardLeftOpacity = useTransform(scrollYProgress, [0, 0.10, 0.20], [1, 1, 0]);

  const cardRightXVal = useTransform(scrollYProgress, [0, 0.10, 0.22], [0, 0, 80]);
  const cardRightX = useSpring(cardRightXVal, { damping: 40, stiffness: 200 });
  
  const cardRightYVal = useTransform(scrollYProgress, [0, 0.10, 0.22], [0, 0, -40]);
  const cardRightY = useSpring(cardRightYVal, { damping: 40, stiffness: 200 });
  
  const cardRightOpacity = useTransform(scrollYProgress, [0, 0.10, 0.20], [1, 1, 0]);

  // 5. Escala y opacidad del anillo del radar de fondo
  const ringScaleVal = useTransform(scrollYProgress, [0, 0.25], [1.0, 0.85]);
  const ringScale = useSpring(ringScaleVal, { damping: 45, stiffness: 200 });
  const ringOpacity = useTransform(scrollYProgress, [0, 0.20], [0.18, 0]);

  const title = "SVIVIA";

  const renderLetters = (text) => {
    return text.split("").map((char, i) => (
      <motion.span
        key={i}
        style={{ 
          display: 'inline-block', 
          whiteSpace: char === " " ? "pre" : "normal",
          willChange: 'transform, opacity'
        }}
        initial={{ opacity: 0, y: '80%' }}
        animate={startIntro ? { opacity: 1, y: 0 } : { opacity: 0, y: '80%' }}
        transition={{ 
          duration: 0.9, 
          delay: 0.15 + i * 0.06,
          ease: [0.33, 1, 0.68, 1]
        }}
      >
        {char}
      </motion.span>
    ));
  };

  return (
    <section ref={containerRef} style={{ height: '300vh', position: 'relative', backgroundColor: '#000' }}>
      
      {/* CONTENEDOR STICKY */}
      <div style={{ position: 'sticky', top: 0, height: '100vh', width: '100%', overflow: 'hidden' }}>
        
        {/* Envoltura del canvas para el fade-in de carga */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={startIntro ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 1.8, ease: "easeOut" }}
          style={{ width: '100%', height: '100%', position: 'absolute', inset: 0, zIndex: 1 }}
        >
          {/* EL LIENZO MÁGICO (Sustituye al Video) */}
          <motion.canvas 
            ref={canvasRef}
            style={{ 
               width: '100%', height: '100%', 
               objectFit: 'cover', 
               opacity: 0.22,
               filter: 'brightness(0.7) contrast(1.15)',
               scale: canvasScale
            }}
          />
        </motion.div>
        
        {/* Máscaras cinemáticas de profundidad */}
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at center, rgba(0,0,0,0.3) 0%, #000000 85%)', pointerEvents: 'none', zIndex: 2 }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, transparent 50%, #000000 100%)', pointerEvents: 'none', zIndex: 2 }} />

        {/* Retícula Táctica de Fondo (Radar Concentrico) */}
        <motion.div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            width: '650px',
            height: '650px',
            x: '-50%',
            y: '-50%',
            scale: ringScale,
            opacity: ringOpacity,
            pointerEvents: 'none',
            zIndex: 2
          }}
        >
          <svg style={{ width: '100%', height: '100%' }} viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="46" fill="none" stroke="#ef4444" strokeWidth="0.1" strokeDasharray="1 3" />
            <circle cx="50" cy="50" r="36" fill="none" stroke="#ef4444" strokeWidth="0.08" />
            <circle cx="50" cy="50" r="22" fill="none" stroke="#ef4444" strokeWidth="0.05" strokeDasharray="2 2" />
            <g style={{ transformOrigin: '50px 50px', animation: 'spin-clockwise 40s infinite linear' }}>
              <line x1="50" y1="4" x2="50" y2="8" stroke="#ef4444" strokeWidth="0.15" />
              <line x1="50" y1="92" x2="50" y2="96" stroke="#ef4444" strokeWidth="0.15" />
              <line x1="4" y1="50" x2="8" y2="50" stroke="#ef4444" strokeWidth="0.15" />
              <line x1="92" y1="50" x2="96" y2="50" stroke="#ef4444" strokeWidth="0.15" />
            </g>
          </svg>
        </motion.div>

        {/* TARJETA PARALLAX IZQUIERDA */}
        <motion.div
          style={{
            position: 'absolute',
            left: '8%',
            top: '54%',
            width: '290px',
            x: cardLeftX,
            y: cardLeftY,
            opacity: cardLeftOpacity,
            pointerEvents: 'none',
            zIndex: 10
          }}
        >
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={startIntro ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }}
            transition={{ duration: 1.2, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
            style={{
              background: 'rgba(255, 255, 255, 0.01)',
              border: '1px solid rgba(255, 255, 255, 0.07)',
              borderRadius: '8px',
              padding: '20px',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              display: 'flex',
              flexDirection: 'column',
              gap: '8px'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ width: '4px', height: '4px', borderRadius: '50%', background: '#ef4444' }} />
              <span style={{ fontSize: '9px', fontFamily: 'monospace', color: '#ef4444', letterSpacing: '2px', fontWeight: 'bold' }}>
                [ SECURE NODE // LOCAL NPU ]
              </span>
            </div>
            <p style={{ fontSize: '11px', color: 'rgba(255, 255, 255, 0.65)', lineHeight: '1.65', margin: 0, fontWeight: '300', fontFamily: 'var(--font-sans)' }}>
              Inferencia en el origen a 60 FPS. Procesamiento paralelo local con latencia ultrabaja de 4.2ms.
            </p>
          </motion.div>
        </motion.div>

        {/* TARJETA PARALLAX DERECHA */}
        <motion.div
          style={{
            position: 'absolute',
            right: '8%',
            top: '54%',
            width: '290px',
            x: cardRightX,
            y: cardRightY,
            opacity: cardRightOpacity,
            pointerEvents: 'none',
            zIndex: 10
          }}
        >
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={startIntro ? { opacity: 1, x: 0 } : { opacity: 0, x: 50 }}
            transition={{ duration: 1.2, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
            style={{
              background: 'rgba(255, 255, 255, 0.01)',
              border: '1px solid rgba(255, 255, 255, 0.07)',
              borderRadius: '8px',
              padding: '20px',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              display: 'flex',
              flexDirection: 'column',
              gap: '8px'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ width: '4px', height: '4px', borderRadius: '50%', background: '#ef4444' }} />
              <span style={{ fontSize: '9px', fontFamily: 'monospace', color: '#ef4444', letterSpacing: '2px', fontWeight: 'bold' }}>
                [ OFFLINE BY DESIGN // ZERO CLOUD ]
              </span>
            </div>
            <p style={{ fontSize: '11px', color: 'rgba(255, 255, 255, 0.65)', lineHeight: '1.65', margin: 0, fontWeight: '300', fontFamily: 'var(--font-sans)' }}>
              Privacidad absoluta por arquitectura. Base de datos SQLite local cifrada, inmune a caídas de red o WAN.
            </p>
          </motion.div>
        </motion.div>

        {/* Textos Reactivos (Cinemáticos y con alto contraste) */}
        <motion.div 
          style={{ 
            position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            opacity: textOpacity, y: textY, scale: textScale,
            zIndex: 5
          }}
        >
          <motion.span 
            initial={{ opacity: 0, y: -10 }}
            animate={startIntro ? { opacity: 0.85, y: 0 } : { opacity: 0, y: -10 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            style={{ 
              fontFamily: 'monospace', 
              fontSize: '0.75rem', 
              color: '#ef4444', 
              letterSpacing: '5px', 
              textTransform: 'uppercase',
              marginBottom: '1.2rem'
            }}
          >
            // SISTEMA NEURAL OFFLINE
          </motion.span>

          <h1 className="poetic-title-huge" style={{ textAlign: 'center', fontSize: '7.5vw', lineHeight: 1.05, willChange: 'transform', letterSpacing: letterSpacing, fontWeight: '800', margin: '0 0 2rem 0', textTransform: 'uppercase' }}>
            <div style={{ overflow: 'hidden', color: '#ef4444', textShadow: '0 0 20px rgba(239, 68, 68, 0.4), 0 0 4px rgba(239, 68, 68, 0.2)' }}>
              {renderLetters(title)}
            </div>
          </h1>
          
          <motion.div
            style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.2rem', padding: '0 20px' }}
            initial={{ opacity: 0, y: 15 }}
            animate={startIntro ? { opacity: 1, y: 0 } : { opacity: 0, y: 15 }}
            transition={{ duration: 1.0, delay: 0.9, ease: "easeOut" }}
          >
            <p 
              style={{ 
                textAlign: 'center', 
                maxWidth: '700px', 
                fontSize: '1.5rem', 
                lineHeight: '1.5',
                color: '#ffffff',
                fontWeight: '400',
                margin: 0,
                letterSpacing: '-0.01em',
                textShadow: '0 2px 10px rgba(0,0,0,0.9)'
              }}
            >
              La videovigilancia inteligente ya no pertenece a la nube.
            </p>
            <p
              style={{ 
                textAlign: 'center', 
                maxWidth: '620px', 
                fontSize: '1rem', 
                lineHeight: '1.7',
                color: 'rgba(255, 255, 255, 0.6)',
                fontWeight: '300',
                margin: 0,
                textShadow: '0 2px 8px rgba(0,0,0,0.9)'
              }}
            >
              Tus cámaras procesan, analizan y almacenan en el origen. 
              <br/>
              <span style={{ color: '#ef4444', fontWeight: '400' }}>Sin servidores externos. Cero filtraciones.</span>
            </p>
          </motion.div>
        </motion.div>

      </div>

      <style>{`
        @keyframes spin-clockwise {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </section>
  );
}
