import React, { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform, useMotionValue, useSpring } from 'framer-motion';
import videoSrc from '../assets/videovigilancia-deteccion.mp4';

// ─────────────────────────────────────────────────────────────
// COMPONENTE SECUNDARIO DE TELEMETRÍA (OPTIMIZADO PARA RENDIMIENTO)
// Aísla los re-renderizados frecuentes del cronómetro en este nodo.
// De esta forma, el Dashboard principal y Framer Motion no sufren stutters.
// ─────────────────────────────────────────────────────────────
function TelemetryDisplay() {
  const [stats, setStats] = useState({
    fps: 60,
    cpu: 76,
    gpuTemp: 62.4,
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setStats({
        fps: Math.floor(60 + (Math.random() * 4 - 2)), // 58 - 62
        cpu: Math.floor(75 + (Math.random() * 6 - 3)), // 72 - 78
        gpuTemp: parseFloat((62.0 + Math.random() * 1.5).toFixed(1)), // 62.0 - 63.5
      });
    }, 600); // Frecuencia de actualización más sutil
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="hud-diag-right">
      <div className="telemetry-badge">
        <span className="telemetry-lbl">CPU</span>
        <span className="telemetry-val">{stats.cpu}%</span>
      </div>
      <div className="telemetry-badge">
        <span className="telemetry-lbl">FPS</span>
        <span className="telemetry-val">{stats.fps}</span>
      </div>
      <div className="telemetry-badge">
        <span className="telemetry-lbl">GPU TEMP</span>
        <span className="telemetry-val">{stats.gpuTemp}°C</span>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// THE INTERACTIVE NEURAL DASHBOARD (AWWWARDS OPTIMIZED)
// ─────────────────────────────────────────────────────────────
export default function Dashboard() {
  const sectionRef = useRef(null);
  const containerRef = useRef(null);

  // ── 1. Modos Tácticos e Interacción
  const [gridActive, setGridActive] = useState(false);
  const [nightVision, setNightVision] = useState(false);
  const [camChannel, setCamChannel] = useState('CAM_01');
  const [crtFlash, setCrtFlash] = useState(false);

  const changeCamera = (camName) => {
    if (camName === camChannel) return;
    setCrtFlash(true);
    setCamChannel(camName);
    setTimeout(() => setCrtFlash(false), 200);
  };

  // ── 2. Rastreo del Cursor (AI User Tracking)
  // Sin re-renders de React: usamos MotionValues y Spring Physics directamente en estilos del DOM
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  // Resortes ligeros pero fluidos
  const springConfig = { damping: 30, stiffness: 150, mass: 0.5 };
  const springX = useSpring(mouseX, springConfig);
  const springY = useSpring(mouseY, springConfig);
  
  const [isHovered, setIsHovered] = useState(false);
  const rectRef = useRef(null);

  // Recalcular el rect solo cuando sea necesario para evitar layout thrashing
  const updateRect = () => {
    if (containerRef.current) {
      rectRef.current = containerRef.current.getBoundingClientRect();
    }
  };

  useEffect(() => {
    window.addEventListener('resize', updateRect);
    return () => window.removeEventListener('resize', updateRect);
  }, []);

  const handleMouseEnter = () => {
    setIsHovered(true);
    updateRect();
  };

  const handleMouseMove = (e) => {
    if (!rectRef.current) {
      updateRect();
    }
    if (!rectRef.current) return;
    const rect = rectRef.current;
    mouseX.set(e.clientX - rect.left);
    mouseY.set(e.clientY - rect.top);
  };

  // ── 3. Secuencia Coreográfica con Scroll (useScroll)
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end end'],
  });

  // Título Intro (0% - 20%)
  const titleOpacity = useTransform(scrollYProgress, [0, 0.05, 0.16, 0.22], [1, 1, 0, 0]);
  const titleY       = useTransform(scrollYProgress, [0, 0.22], [0, -35]);

  // Panel Monolito: Sube y se escala
  const panelY     = useTransform(scrollYProgress, [0, 0.22, 0.84, 0.95], ['100%', '0%', '0%', '-10%']);
  const panelScale = useTransform(scrollYProgress, [0, 0.22, 0.84, 0.95], [0.96, 1, 1, 0.94]);
  const panelAlpha = useTransform(scrollYProgress, [0.84, 0.95], [1, 0]);

  // Deslizamientos Coreografiados de los Paneles HUD (Boot-up effect)
  const hudOpacity = useTransform(scrollYProgress, [0.20, 0.26, 0.84, 0.92], [0, 1, 1, 0]);
  const topPanelY  = useTransform(scrollYProgress, [0.20, 0.28, 0.82, 0.88], [-50, 0, 0, -50]);
  const leftPanelX = useTransform(scrollYProgress, [0.21, 0.29, 0.82, 0.88], [-70, 0, 0, -70]);
  const rightPanelX= useTransform(scrollYProgress, [0.22, 0.30, 0.82, 0.88], [70, 0, 0, 70]);
  const bottomPanelY= useTransform(scrollYProgress, [0.23, 0.31, 0.82, 0.88], [60, 0, 0, 60]);

  // Video Parallax
  const videoScale = useTransform(scrollYProgress, [0, 0.35], [1.12, 1]);

  return (
    <section ref={sectionRef} className="monolith-section">
      <div className="monolith-sticky">

        {/* ── TÍTULO DE ENTRADA (Cinematic Intro) */}
        <motion.div
          className="monolith-eyebrow"
          style={{ opacity: titleOpacity, y: titleY }}
        >
          <h2 className="monolith-title">Intelligence,<br />Visualized.</h2>
          <p className="poetic-subtitle">
            Real-time inference. Zero latency. Total awareness.
          </p>
        </motion.div>

        {/* ── DASHBOARD MOCKUP SHELL (El Monolito) */}
        <div className="monolith-clip">
          <motion.div
            ref={containerRef}
            className={`monolith-panel ${nightVision ? 'night-vision-mode' : ''}`}
            style={{ y: panelY, scale: panelScale, opacity: panelAlpha }}
            onMouseMove={handleMouseMove}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={() => setIsHovered(false)}
          >
            {/* Contenedor de Video principal */}
            <div className="monolith-video-clip">
              <motion.video
                src={videoSrc}
                autoPlay loop muted playsInline
                className="monolith-video"
                style={{ scale: videoScale }}
              />
              {/* Velo translúcido con gradientes de viñeta */}
              <div className="monolith-veil" />
              
              {/* Grilla Cibernética Digital Táctica */}
              <div className={`tactical-grid-overlay ${gridActive ? 'active' : ''}`} />

              {/* Tinte Verde de Visión Nocturna sobre el video */}
              <div className={`night-vision-video-tint ${nightVision ? 'active' : ''}`} />
            </div>

            {/* ── CRT INTERFERENCE FLASH EFFECT */}
            {crtFlash && <div className="crt-flash-overlay" />}

            {/* ── AI USER TRACKING MODE (Cursor Bounding Box) */}
            {isHovered && (
              <motion.div
                className="hud-user-box"
                style={{
                  x: springX,
                  y: springY,
                }}
              >
                {/* Cuatro brackets vectoriales en las esquinas */}
                <div className="bracket-corner bracket-tl" />
                <div className="bracket-corner bracket-tr" />
                <div className="bracket-corner bracket-bl" />
                <div className="bracket-corner bracket-br" />
                
                {/* Datos técnicos estáticos pero responsivos para rendimiento óptimo */}
                <div className="hud-user-tag">
                  <span className="hud-user-lock">LOCK</span>
                  <span className="hud-user-subj">SUBJECT: VISITOR // CONF: 99.8%</span>
                </div>
              </motion.div>
            )}

            {/* ── DIAGNÓSTICOS SUPERIORES (Top bar) */}
            <motion.div
              className="hud-top-diagnostics"
              style={{ opacity: hudOpacity, y: topPanelY }}
            >
              <div className="hud-diag-left">
                <span className="hud-pulse-dot active" />
                <span className="hud-system-status">SVIVIA INFERENCE VISOR</span>
              </div>

              {/* Botones de Control Táctico */}
              <div className="hud-diag-center">
                <button 
                  className={`tactical-btn ${gridActive ? 'active' : ''}`} 
                  onClick={() => setGridActive(!gridActive)}
                >
                  GRID {gridActive ? 'ON' : 'OFF'}
                </button>
                <button 
                  className={`tactical-btn ${nightVision ? 'active' : ''}`} 
                  onClick={() => setNightVision(!nightVision)}
                >
                  NIGHT VISION
                </button>
                <div className="camera-selector">
                  <button className="tactical-btn cam-select-btn">
                    {camChannel} ▾
                  </button>
                  <div className="camera-dropdown">
                    <div onClick={() => changeCamera('CAM_01')}>CAM_01 (RECEPTION)</div>
                    <div onClick={() => changeCamera('CAM_02')}>CAM_02 (SERVER_ROOM)</div>
                  </div>
                </div>
              </div>

              {/* Componente de Telemetría Aislado */}
              <TelemetryDisplay />
            </motion.div>

            {/* ── PANEL DE DETECCIONES RECIENTES (Right Sidebar) */}
            <motion.div
              className="hud-sidebar-detections"
              style={{ opacity: hudOpacity, x: rightPanelX }}
            >
              <div className="sidebar-header">
                <span className="sidebar-title">Detecciones recientes</span>
                <span className="sidebar-live-tag">LIVE</span>
              </div>
              
              <div className="detections-list">
                {[
                  { id: 'Persona', time: '01:52:41 p. m.', confidence: '91%', loc: 'cell johan' },
                  { id: 'Persona', time: '01:52:35 p. m.', confidence: '90%', loc: 'cell johan' },
                  { id: 'Persona', time: '01:52:08 p. m.', confidence: '76%', loc: 'cell johan' },
                  { id: 'Persona', time: '01:52:04 p. m.', confidence: '83%', loc: 'cell johan' },
                ].map((det, i) => (
                  <div key={i} className="detection-card">
                    <div className="detection-thumb-wrapper">
                      <div className="detection-thumb-scan" />
                      <div className="detection-thumb-icon">👤</div>
                    </div>
                    <div className="detection-info">
                      <div className="det-row">
                        <span className="det-type">➜ {det.id}</span>
                      </div>
                      <div className="det-details">
                        <span>{det.loc} • {det.time}</span>
                      </div>
                      <div className="det-confidence-bar">
                        <div className="det-bar-fill" style={{ width: det.confidence }} />
                        <span className="det-confidence-text">{det.confidence} Confianza</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* ── FUENTE DE ACTIVIDAD LOGS (Bottom-Left) */}
            <motion.div
              className="hud-log-lateral"
              style={{ opacity: hudOpacity, x: leftPanelX }}
            >
              <span className="hud-log-title">FUENTE DE ACTIVIDAD</span>
              <div className="hud-log-entries">
                {[
                  { t: '14:23:01', m: 'Se ha verificado la integridad del sistema.' },
                  { t: '14:23:05', m: 'Reconocimiento facial activado.' },
                  { t: '14:23:12', m: 'Anomalía detectada: Sector 4.' },
                  { t: '14:23:15', m: 'Base de datos de referencias cruzadas...' },
                ].map((log, i) => (
                  <div key={i} className="hud-log-entry">
                    <span className="hud-log-time">{log.t}</span>
                    <span className="hud-log-msg">{log.m}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* ── BARRA DE ESTADO INFERIOR (Bottom Status Bar) */}
            <motion.div
              className="hud-status-bar"
              style={{ opacity: hudOpacity, y: bottomPanelY }}
            >
              <div className="hud-status-left">
                <span className="hud-status-dot green-pulse" />
                <span>TODOS LOS SISTEMAS NOMINALES</span>
                <span className="hud-status-sep">·</span>
                <span>LATENCIA RED: 12ms</span>
                <span className="hud-status-sep">·</span>
                <span>ZERO-TRUST ACTIVO</span>
              </div>
              <div className="hud-status-right">
                <span>SVIVIA VISOR SECURE v4.3.0</span>
              </div>
            </motion.div>

          </motion.div>
        </div> {/* /monolith-clip */}

      </div>
    </section>
  );
}
