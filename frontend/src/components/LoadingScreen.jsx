import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import vantaLogo from '../assets/logovantaw.png';

/**
 * Pantalla de carga premium — bloquea scroll y preloads assets.
 * Se autodestruye cuando todos los recursos están listos.
 */
export default function LoadingScreen({ onComplete }) {
  const [progress, setProgress] = useState(0);
  const [phase, setPhase] = useState('loading'); // 'loading' | 'done' | 'exit'
  const startTime = useRef(Date.now());

  useEffect(() => {
    // Bloquear scroll mientras carga
    document.body.style.overflow = 'hidden';

    // Construir lista de assets a precargar
    const imageAssets = [
      '/src/assets/logovantaw.png',
      '/src/assets/logo.png',
      '/src/assets/hero.png',
    ];

    // Añadir los 143 frames de la secuencia de animación del Hero
    for (let i = 1; i <= 143; i++) {
      const paddedNumber = String(i).padStart(3, '0');
      imageAssets.push(`/hero-frames/ezgif-frame-${paddedNumber}.jpg`);
    }

    const glbAssets = ['/camera.glb'];

    let loaded = 0;
    const total = imageAssets.length + glbAssets.length + 1; // +1 para "init WebGL"

    const tick = () => {
      loaded++;
      const raw = loaded / total;
      setProgress(raw);
      if (loaded >= total) finish();
    };

    // Precargar imágenes
    imageAssets.forEach((src) => {
      const img = new Image();
      img.onload = tick;
      img.onerror = tick; // no bloquear si falla
      img.src = src;
    });

    // Precargar GLB via fetch (lo mete en caché del browser)
    glbAssets.forEach((url) => {
      fetch(url)
        .then(tick)
        .catch(tick);
    });

    // Simular "init WebGL" con un pequeño delay realista
    setTimeout(tick, 400);

    // Tiempo mínimo de pantalla — aunque todo cargue en 0ms,
    // mostramos al menos 1.2s para que el usuario lea "VANTA"
    const minTimer = setTimeout(() => {
      if (loaded >= total) finish();
    }, 1400);

    return () => clearTimeout(minTimer);
  }, []);

  const finish = () => {
    setProgress(1);
    setPhase('done');
    setTimeout(() => {
      setPhase('exit');
      document.body.style.overflow = '';
      setTimeout(onComplete, 900); // esperar a que termine la animación de salida
    }, 500);
  };

  return (
    <AnimatePresence>
      {phase !== 'exit' && (
        <motion.div
          className="loader-root"
          key="loader"
          initial={{ opacity: 1 }}
          exit={{
            opacity: 0,
            scale: 1.03,
            filter: 'blur(8px)',
          }}
          transition={{ duration: 0.85, ease: [0.25, 0.8, 0.25, 1] }}
        >
          {/* Fondo puro negro con un orbe de luz verde muy sutil */}
          <div className="loader-glow" />

          {/* Logo VANTA */}
          <motion.div
            className="loader-brand"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
          >
            <motion.img
              src={vantaLogo}
              alt="VANTA"
              className="loader-logo"
              animate={
                phase === 'done'
                  ? { filter: 'drop-shadow(0 0 20px rgba(239,68,68,0.8))' }
                  : { filter: 'drop-shadow(0 0 8px rgba(239,68,68,0.3))' }
              }
              transition={{ duration: 0.6 }}
            />
            <span className="loader-name">VANTA</span>
          </motion.div>

          {/* Producto */}
          <motion.p
            className="loader-product"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.35 }}
          >
            SVIVIA — Edge Surveillance AI
          </motion.p>

          {/* Barra de progreso */}
          <motion.div
            className="loader-bar-wrap"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <div className="loader-bar-track">
              <motion.div
                className="loader-bar-fill"
                animate={{ scaleX: progress }}
                transition={{ duration: 0.4, ease: 'easeOut' }}
                style={{ transformOrigin: 'left center' }}
              />
            </div>
            <div className="loader-status">
              {phase === 'done' ? (
                <motion.span
                  key="ready"
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="loader-status-ready"
                >
                  Listo
                </motion.span>
              ) : (
                <span className="loader-status-pct">
                  {Math.round(progress * 100)}%
                </span>
              )}
            </div>
          </motion.div>

          {/* Línea inferior decorativa */}
          <motion.div
            className="loader-footer"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
          >
            Vigilancia inteligente · Privacidad local · Sin compromisos
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
