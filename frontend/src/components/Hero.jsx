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
  const textOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  const textY = useTransform(scrollYProgress, [0, 0.2], [0, -100]);
  const textScale = useTransform(scrollYProgress, [0, 0.2], [1, 0.9]);

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
             opacity: 0.7 
          }}
        />
        
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle, transparent 30%, #000 100%)' }} />

        {/* Textos Reactivos (Limpios) */}
        <motion.div 
          style={{ 
            position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            opacity: textOpacity, y: textY, scale: textScale,
            skewX: skewX // Inclinación por velocidad
          }}
        >
          <h1 className="poetic-title-huge" style={{ textAlign: 'center', fontSize: '8vw', lineHeight: 1.1, willChange: 'transform' }}>
            <div style={{ overflow: 'hidden' }}>
              {renderLetters(title1)}
            </div>
            <div style={{ overflow: 'hidden', fontStyle: 'italic', color: 'var(--text-muted)' }}>
              {renderLetters(title2, true)}
            </div>
          </h1>
          
          <motion.p 
            className="poetic-subtitle" 
            style={{ 
              marginTop: '2rem', textAlign: 'center', maxWidth: '700px', fontSize: '1.4rem', 
              textShadow: '0 4px 20px rgba(0,0,0,0.8)' 
            }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.5, delay: 1.5, ease: "easeOut" }}
          >
            La inteligencia artificial no pertenece a la nube.
            <br/>Reclama tu privacidad. Transforma tus cámaras con Edge AI local.
          </motion.p>
        </motion.div>

      </div>
    </section>
  );
}
