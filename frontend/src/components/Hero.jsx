import React, { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform, useMotionValueEvent } from 'framer-motion';

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

  const requestRef = useRef();

  // ==========================================
  // EL SECRETO DE APPLE: CANVAS IMAGE SEQUENCE
  // ==========================================
  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    if (images.length === 0 || !canvasRef.current) return;

    // Calculamos qué foto (del 0 al 142) debemos mostrar según tu scroll
    const frameIndex = Math.min(
      FRAME_COUNT - 1,
      Math.floor(latest * FRAME_COUNT)
    );

    // Cancelamos el dibujo anterior si hiciste scroll muy rápido
    if (requestRef.current) cancelAnimationFrame(requestRef.current);

    // Dibujamos la nueva foto en el Canvas (Súper rápido y sin lag)
    requestRef.current = requestAnimationFrame(() => {
      const img = images[frameIndex];
      if (img && img.complete) {
        const ctx = canvasRef.current.getContext('2d');
        // Aseguramos que el lienzo tenga el tamaño exacto de la foto
        if (canvasRef.current.width !== img.width) {
          canvasRef.current.width = img.width;
          canvasRef.current.height = img.height;
        }
        ctx.drawImage(img, 0, 0);
      }
    });
  });

  // Animaciones de texto originales
  const textOpacity = useTransform(scrollYProgress, [0, 0.3], [1, 0]);
  const textY = useTransform(scrollYProgress, [0, 0.3], [0, -150]);
  const textScale = useTransform(scrollYProgress, [0, 0.3], [1, 0.9]);

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

        {/* Textos */}
        <motion.div 
          style={{ 
            position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            opacity: textOpacity, y: textY, scale: textScale
          }}
          initial={{ opacity: 0, filter: 'blur(20px)' }}
          animate={{ opacity: 1, filter: 'blur(0px)' }}
          transition={{ duration: 2, ease: "easeOut", delay: 0.5 }}
        >
          <h1 className="poetic-title-huge" style={{ textAlign: 'center', fontSize: '8vw', lineHeight: 1.1 }}>
            Visión <br />
            <span style={{ fontStyle: 'italic', color: 'var(--text-muted)' }}>absoluta.</span>
          </h1>
          <p className="poetic-subtitle" style={{ marginTop: '2rem', textAlign: 'center', maxWidth: '700px', fontSize: '1.4rem', textShadow: '0 4px 20px rgba(0,0,0,0.8)' }}>
            La inteligencia artificial no pertenece a la nube.
            <br/>Reclama tu privacidad. Transforma tus cámaras con Edge AI local.
          </p>
        </motion.div>

      </div>
    </section>
  );
}
