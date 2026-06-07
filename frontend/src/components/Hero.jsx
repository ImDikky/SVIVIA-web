import React, { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform, useMotionValueEvent, useVelocity, useSpring } from 'framer-motion';

// Sabemos que Ezgif nos generó 143 imágenes
const FRAME_COUNT = 143;

export default function Hero() {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const [images, setImages] = useState([]);

  // ==========================================
  // PRECARGA DE IMÁGENES (Para que no haya lag al hacer scroll)
  // ==========================================
  useEffect(() => {
    const loadedImages = [];
    
    for (let i = 1; i <= FRAME_COUNT; i++) {
      const img = new Image();
      // Generamos el nombre: ezgif-frame-001.jpg, ezgif-frame-002.jpg...
      const paddedNumber = String(i).padStart(3, '0');
      img.src = `/hero-frames/ezgif-frame-${paddedNumber}.jpg`;
      
      img.onload = () => {
        // Cuando carga la primera foto, la pintamos en el canvas como portada inicial
        if (i === 1 && canvasRef.current) {
          const ctx = canvasRef.current.getContext('2d');
          canvasRef.current.width = img.width;
          canvasRef.current.height = img.height;
          ctx.drawImage(img, 0, 0);
        }
      };
      loadedImages.push(img);
    }
    // Guardamos todas las fotos en la memoria RAM
    setImages(loadedImages);
  }, []);

  // Reloj de tiempo real para la telemetría del HUD
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

  const scrollVelocity = useVelocity(scrollYProgress);
  const smoothVelocity = useSpring(scrollVelocity, {
    damping: 50,
    stiffness: 400
  });

  // Convertimos la velocidad en un ángulo de inclinación (skew)
  const skewX = useTransform(smoothVelocity, [-1, 1], [-20, 20]);

  const requestRef = useRef();

  // ==========================================
  // EL SECRETO DE APPLE: CANVAS IMAGE SEQUENCE + RGB SHIFT (Distorsión)
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

  // Animaciones de texto limpias y minimalistas
  const textOpacity = useTransform(scrollYProgress, [0, 0.25], [1, 0]);
  const textY = useTransform(scrollYProgress, [0, 0.25], [0, -80]);
  const textScale = useTransform(scrollYProgress, [0, 0.25], [1, 0.95]);

  // ==========================================
  // TIPOGRAFÍA REACTIVA: SPLIT & ANIMATE (Optimizado)
  // ==========================================
  const title1 = "Visión";
  const title2 = "absoluta.";
  
  // Función para renderizar letras animadas - Optimizada para suavidad
  const renderLetters = (text) => {
    return text.split("").map((char, i) => (
      <motion.span
        key={i}
        style={{ 
          display: 'inline-block', 
          whiteSpace: char === " " ? "pre" : "normal",
          willChange: 'transform, opacity' // Optimizamos para la GPU
        }}
        initial={{ opacity: 0, y: '100%' }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ 
          duration: 0.8, 
          delay: 0.2 + i * 0.03, // Stagger más rápido
          ease: [0.33, 1, 0.68, 1] // Ease Out Quart: súper suave
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
        
        {/* EL LIENZO MÁGICO (Sustituye al Video) */}
        <canvas 
          ref={canvasRef}
          style={{ 
             width: '100%', height: '100%', 
             objectFit: 'cover', 
             opacity: 0.65 
          }}
        />
        
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle, transparent 25%, #000 95%)' }} />

        {/* Capa de HUD de Cámara / Interfaz Táctica (Fades on scroll) */}
        <motion.div
          style={{
            position: 'absolute',
            inset: 0,
            pointerEvents: 'none',
            opacity: textOpacity,
            zIndex: 4
          }}
        >
          {/* L-brackets en las esquinas */}
          <div className="hud-bracket hud-bracket--tl" />
          <div className="hud-bracket hud-bracket--tr" />
          <div className="hud-bracket hud-bracket--bl" />
          <div className="hud-bracket hud-bracket--br" />

          {/* Línea de escaneo láser */}
          <div className="hud-laser-scanner" />

          {/* Indicador REC y Telemetría */}
          <div className="hud-panel hud-panel--top-left">
            <span className="hud-rec-dot" />
            <span className="hud-text">REC [CAM_01_FEED] // SERVIDOR_LOCAL_NEURAL</span>
          </div>

          <div className="hud-panel hud-panel--top-right">
            <span className="hud-text text-green">{liveTime}</span>
            <span className="hud-divider">|</span>
            <span className="hud-text">LATENCY: ~4.5ms</span>
            <span className="hud-divider">|</span>
            <span className="hud-text">FPS: 60</span>
          </div>

          <div className="hud-panel hud-panel--bottom-left">
            <span className="hud-text">TARGET: HUMANO_DETECTADO</span>
            <span className="hud-divider">|</span>
            <span className="hud-text">IA ENGINE: YOLO_LOCAL_v8</span>
          </div>

          <div className="hud-panel hud-panel--bottom-right">
            <span className="hud-text">SEGURIDAD: 100% PRIVADO</span>
            <span className="hud-divider">|</span>
            <span className="hud-text">NO CLOUD METRICS</span>
          </div>

          {/* Retícula de escaneo en el centro */}
          <div className="hud-center-crosshair">
            <div className="hud-crosshair-ring" />
            <div className="hud-crosshair-lines" />
            <div className="hud-crosshair-tag">SYS_SCAN: ACTIVE</div>
          </div>
        </motion.div>

        {/* Textos Reactivos (Cinemáticos y con alto contraste) */}
        <motion.div 
          style={{ 
            position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            opacity: textOpacity, y: textY, scale: textScale,
            skewX: skewX, // Inclinación por velocidad
            zIndex: 5
          }}
        >
          <h1 className="poetic-title-huge" style={{ textAlign: 'center', fontSize: '7.5vw', lineHeight: 1.05, willChange: 'transform', letterSpacing: '-0.02em' }}>
            <div style={{ overflow: 'hidden', color: '#ffffff', textShadow: '0 0 20px rgba(255,255,255,0.45)' }}>
              {renderLetters(title1)}
            </div>
            <div style={{ overflow: 'hidden', fontStyle: 'italic', color: '#ef4444', textShadow: '0 0 20px rgba(239, 68, 68, 0.65)' }}>
              {renderLetters(title2)}
            </div>
          </h1>
          
          <motion.div
            style={{ marginTop: '2.2rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.8rem' }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, delay: 1.2, ease: "easeOut" }}
          >
            <span style={{ 
              fontFamily: 'monospace', 
              fontSize: '0.75rem', 
              color: '#ef4444', 
              letterSpacing: '4px', 
              textTransform: 'uppercase',
              background: 'rgba(239, 68, 68, 0.06)',
              padding: '5px 14px',
              border: '1px solid rgba(239, 68, 68, 0.25)',
              borderRadius: '4px',
              textShadow: '0 0 8px rgba(239, 68, 68, 0.3)'
            }}>
              [ PROCESAMIENTO AUTÓNOMO EN EL BORDE // SIN NUBE ]
            </span>
            <p 
              className="poetic-subtitle" 
              style={{ 
                textAlign: 'center', 
                maxWidth: '750px', 
                fontSize: '1.25rem', 
                lineHeight: '1.65',
                color: 'rgba(255, 255, 255, 0.88)',
                textShadow: '0 2px 12px rgba(0,0,0,0.95)',
                fontWeight: '300',
                margin: 0
              }}
            >
              La inteligencia artificial no pertenece a la nube.
              <br/>
              <span style={{ color: '#ffffff', fontWeight: '400' }}>Reclama tu privacidad.</span> Transforma tus cámaras de seguridad en centinelas neuronales con Edge AI 100% local.
            </p>
          </motion.div>
        </motion.div>

      </div>

      {/* Estilos del HUD Encapsulados */}
      <style>{`
        /* Visor de Cámara brackets */
        .hud-bracket {
          position: absolute;
          width: 24px;
          height: 24px;
          border: 2px solid rgba(239, 68, 68, 0.35);
          pointer-events: none;
          z-index: 5;
        }
        .hud-bracket--tl {
          top: 40px;
          left: 40px;
          border-right: 0;
          border-bottom: 0;
        }
        .hud-bracket--tr {
          top: 40px;
          right: 40px;
          border-left: 0;
          border-bottom: 0;
        }
        .hud-bracket--bl {
          bottom: 40px;
          left: 40px;
          border-right: 0;
          border-top: 0;
        }
        .hud-bracket--br {
          bottom: 40px;
          right: 40px;
          border-left: 0;
          border-top: 0;
        }

        /* Línea de Escaneo Láser */
        .hud-laser-scanner {
          position: absolute;
          left: 0;
          width: 100%;
          height: 2px;
          background: linear-gradient(90deg, transparent, rgba(239, 68, 68, 0.45) 50%, transparent);
          box-shadow: 0 0 10px rgba(239, 68, 68, 0.35);
          z-index: 3;
          pointer-events: none;
          animation: laser-scan 5s infinite ease-in-out;
        }
        @keyframes laser-scan {
          0% { top: 0%; opacity: 0; }
          10% { opacity: 0.7; }
          90% { opacity: 0.7; }
          100% { top: 100%; opacity: 0; }
        }

        /* Paneles del HUD */
        .hud-panel {
          position: absolute;
          font-family: monospace;
          font-size: 0.72rem;
          color: rgba(255, 255, 255, 0.45);
          letter-spacing: 1.5px;
          display: flex;
          align-items: center;
          gap: 8px;
          pointer-events: none;
          background: rgba(0, 0, 0, 0.4);
          padding: 6px 14px;
          border: 1px solid rgba(255, 255, 255, 0.06);
          border-radius: 4px;
          backdrop-filter: blur(4px);
          z-index: 5;
        }
        .hud-panel--top-left {
          top: 40px;
          left: 80px;
        }
        .hud-panel--top-right {
          top: 40px;
          right: 80px;
        }
        .hud-panel--bottom-left {
          bottom: 40px;
          left: 80px;
        }
        .hud-panel--bottom-right {
          bottom: 40px;
          right: 80px;
        }

        .hud-rec-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #ef4444;
          box-shadow: 0 0 8px #ef4444;
          animation: blink 1s infinite alternate;
        }
        @keyframes blink {
          0% { opacity: 0.2; }
          100% { opacity: 1; }
        }

        .hud-divider {
          color: rgba(239, 68, 68, 0.35);
        }
        .hud-text {
          text-shadow: 0 1px 4px rgba(0,0,0,0.5);
        }
        .hud-text.text-green {
          color: #10b981;
          text-shadow: 0 0 6px rgba(16, 185, 129, 0.3);
        }

        /* Retícula de Escaneo Central */
        .hud-center-crosshair {
          position: absolute;
          top: 48%;
          left: 50%;
          transform: translate(-50%, -50%);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          pointer-events: none;
          opacity: 0.2;
          z-index: 3;
        }
        .hud-crosshair-ring {
          width: 90px;
          height: 90px;
          border: 1px dashed rgba(239, 68, 68, 0.5);
          border-radius: 50%;
          animation: spin-clockwise 20s infinite linear;
        }
        .hud-crosshair-lines {
          position: absolute;
          width: 130px;
          height: 130px;
          pointer-events: none;
        }
        .hud-crosshair-lines::before,
        .hud-crosshair-lines::after {
          content: '';
          position: absolute;
          background: rgba(239, 68, 68, 0.4);
        }
        .hud-crosshair-lines::before {
          top: 50%;
          left: 0;
          width: 100%;
          height: 1px;
        }
        .hud-crosshair-lines::after {
          left: 50%;
          top: 0;
          width: 1px;
          height: 100%;
        }
        .hud-crosshair-tag {
          margin-top: 12px;
          font-family: monospace;
          font-size: 0.55rem;
          letter-spacing: 2px;
          color: rgba(239, 68, 68, 0.5);
          text-transform: uppercase;
        }

        @keyframes spin-clockwise {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </section>
  );
}
