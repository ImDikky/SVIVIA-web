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
  const assetsLoaded = useRef(false);
  const progressVal = useRef(0);

  const dustParticles = React.useMemo(() => {
    return Array.from({ length: 25 }).map((_, idx) => {
      const delay = (Math.random() * 6).toFixed(2);
      const duration = (8 + Math.random() * 8).toFixed(2);
      const size = (1.2 + Math.random() * 1.8).toFixed(1);
      const left = (Math.random() * 100).toFixed(1);
      const drift = Math.round(Math.random() * 60 - 30);
      return { idx, delay, duration, size, left, drift };
    });
  }, []);

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

    const checkRealProgress = () => {
      loaded++;
      if (loaded >= total) {
        assetsLoaded.current = true;
      }
    };

    // Precargar imágenes
    imageAssets.forEach((src) => {
      const img = new Image();
      img.onload = checkRealProgress;
      img.onerror = checkRealProgress; // no bloquear si falla
      img.src = src;
    });

    // Precargar GLB via fetch (lo mete en caché del browser)
    glbAssets.forEach((url) => {
      fetch(url)
        .then(checkRealProgress)
        .catch(checkRealProgress);
    });

    // Simular "init WebGL" con un pequeño delay realista
    setTimeout(checkRealProgress, 400);

    // Animación de carga simulada y fluida (mínimo 5.5s para apreciar la forja)
    const duration = 5500; // 5.5 segundos
    const intervalTime = 30;
    const totalSteps = duration / intervalTime;
    const stepIncrement = 1 / totalSteps;

    const timer = setInterval(() => {
      let nextProgress = progressVal.current + stepIncrement;

      // Si los assets reales aún no se cargaron, frenamos en 95%
      if (!assetsLoaded.current && nextProgress >= 0.95) {
        nextProgress = 0.95;
      }

      if (nextProgress >= 1) {
        nextProgress = 1;
        clearInterval(timer);
        setProgress(1);
        progressVal.current = 1;
        finish();
      } else {
        setProgress(nextProgress);
        progressVal.current = nextProgress;
      }
    }, intervalTime);

    return () => {
      clearInterval(timer);
    };
  }, []);

  const getForgeStyles = () => {
    const strokeOffset = 350 * (1 - progress);
    let strokeColor = "#022c22"; // Verde esmeralda oscuro
    let glowColor = "rgba(16, 185, 129, 0.1)";
    let fillColor = "rgba(16, 185, 129, 0.01)";
    
    if (progress > 0.15 && progress < 0.5) {
      strokeColor = "#047857"; // Verde medio
      glowColor = "rgba(4, 120, 87, 0.35)";
    } else if (progress >= 0.5 && progress < 0.85) {
      strokeColor = "#34d399"; // Verde menta brillante
      glowColor = "rgba(52, 211, 153, 0.75)";
      fillColor = "rgba(52, 211, 153, 0.08)";
    } else if (progress >= 0.85) {
      strokeColor = "#10b981"; // Verde corporativo sólido de VANTA al enfriarse
      glowColor = "rgba(16, 185, 129, 0.9)";
      fillColor = "rgba(16, 185, 129, 0.12)"; // Relleno verde translúcido de VANTA
    }

    return { strokeOffset, strokeColor, glowColor, fillColor };
  };

  const forge = getForgeStyles();

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

          {/* Elementos cinemáticos de fondo */}
          <div className="loader-overlay" />
          <div className="loader-nebula loader-nebula--top" />
          <div className="loader-nebula loader-nebula--bottom" />
          <div className="loader-lens-flare" />
          
          <div className="loader-dust-container">
            {dustParticles.map((p) => (
              <span
                key={p.idx}
                className="loader-dust-particle"
                style={{
                  left: `${p.left}%`,
                  width: `${p.size}px`,
                  height: `${p.size}px`,
                  animationDelay: `${p.delay}s`,
                  animationDuration: `${p.duration}s`,
                  '--drift': `${p.drift}px`,
                }}
              />
            ))}
          </div>

          {/* Logo VANTA Forjándose */}
          <motion.div
            className="loader-brand"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}
          >
            <div className="vanta-forge-container">
              {/* Backglow that expands and pulses with load */}
              <div 
                className="forge-glow-backdrop" 
                style={{ 
                  transform: `scale(${0.8 + progress * 0.4})`,
                  opacity: progress > 0.15 ? 1 : 0.2,
                  background: `radial-gradient(circle, ${forge.glowColor} 0%, transparent 70%)`
                }} 
              />
              
              {/* Inline SVG Monogram Vanta Logo */}
              <svg viewBox="0 0 120 120" className="vanta-forge-svg">
                <defs>
                  <filter id="forgeGlow" x="-20%" y="-20%" width="140%" height="140%">
                    <feGaussianBlur stdDeviation="3" result="blur" />
                    <feMerge>
                      <feMergeNode in="blur" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                </defs>

                {/* Outer structural hexagon (very thin HUD) */}
                <polygon 
                  points="60,5 110,30 110,90 60,115 10,90 10,30" 
                  fill="none" 
                  stroke="rgba(255, 255, 255, 0.05)" 
                  strokeWidth="0.8" 
                />

                {/* Left wing stroke of V */}
                <path 
                  d="M 28 25 L 44 25 L 60 85 L 48 95 Z" 
                  className="forge-part"
                  style={{
                    strokeDashoffset: forge.strokeOffset,
                    stroke: forge.strokeColor,
                    fill: forge.fillColor,
                    filter: progress > 0.5 ? 'url(#forgeGlow)' : 'none'
                  }}
                />
                
                {/* Right wing stroke of V */}
                <path 
                  d="M 92 25 L 76 25 L 60 85 L 72 95 Z" 
                  className="forge-part"
                  style={{
                    strokeDashoffset: forge.strokeOffset,
                    stroke: forge.strokeColor,
                    fill: forge.fillColor,
                    filter: progress > 0.5 ? 'url(#forgeGlow)' : 'none'
                  }}
                />
                
                {/* Inner glowing core delta triangle */}
                <polygon 
                  points="60,35 48,60 72,60" 
                  className="forge-part"
                  style={{
                    strokeDashoffset: Math.max(0, 350 * (1 - progress * 1.2)), // Core draws slightly faster at the end
                    stroke: forge.strokeColor,
                    fill: forge.fillColor,
                    filter: progress > 0.6 ? 'url(#forgeGlow)' : 'none'
                  }}
                />
              </svg>

              {/* Spark Particles during forging */}
              {progress < 0.95 && Array.from({ length: 15 }).map((_, i) => {
                const delay = (i * 0.14).toFixed(2);
                const duration = (1.0 + Math.random() * 1.0).toFixed(2);
                const drift = Math.round(Math.random() * 40 - 20);
                const size = Math.round(2 + Math.random() * 2.5);
                const left = Math.round(35 + Math.random() * 30);
                return (
                  <span 
                    key={i} 
                    className="spark" 
                    style={{
                      left: `${left}%`,
                      bottom: '24px',
                      width: `${size}px`,
                      height: `${size}px`,
                      animationDelay: `${delay}s`,
                      animationDuration: `${duration}s`,
                      '--drift': `${drift}px`,
                      background: progress > 0.5 ? '#6ee7b7' : '#10b981',
                      boxShadow: progress > 0.5 ? '0 0 8px #6ee7b7' : '0 0 8px #10b981',
                    }} 
                  />
                );
              })}
            </div>
            <span className="loader-name" style={{ color: '#10b981', textShadow: '0 0 8px rgba(16, 185, 129, 0.35)' }}>VANTA</span>
          </motion.div>

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
            <span style={{ fontSize: '0.58rem', color: 'rgba(239, 68, 68, 0.85)', fontFamily: 'monospace', letterSpacing: '3px', textTransform: 'uppercase', textShadow: '0 0 8px rgba(239, 68, 68, 0.3)' }}>
              Una creación hecha por VANTA
            </span>
          </motion.div>

          {/* Encapuslated Styles for Forging Animation */}
          <style>{`
            .vanta-forge-container {
              position: relative;
              width: 150px;
              height: 150px;
              display: flex;
              align-items: center;
              justify-content: center;
              margin-bottom: 20px;
            }
            .vanta-forge-svg {
              width: 120px;
              height: 120px;
              overflow: visible;
            }
            .forge-glow-backdrop {
              position: absolute;
              width: 140px;
              height: 140px;
              border-radius: 50%;
              filter: blur(25px);
              pointer-events: none;
              z-index: -1;
              transition: transform 0.25s linear, opacity 0.25s linear;
            }
            .forge-part {
              stroke-width: 1.5;
              stroke-dasharray: 350;
              transition: stroke-dashoffset 0.15s linear, fill 0.8s ease, stroke 0.4s ease;
            }
            .spark {
              position: absolute;
              border-radius: 50%;
              pointer-events: none;
              animation: flyUp infinite linear;
            }
            @keyframes flyUp {
              0% {
                transform: translateY(0) scale(1);
                opacity: 1;
              }
              80% {
                opacity: 0.8;
              }
              100% {
                transform: translateY(-85px) translateX(var(--drift)) scale(0.2);
                opacity: 0;
              }
            }
          `}</style>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
