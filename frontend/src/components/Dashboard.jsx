import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import videoSrc from '../assets/videovigilancia-deteccion.mp4';

// ─────────────────────────────────────────────
// THE MONOLITH + SEQUENCE DASHBOARD
// Técnica: sticky scroll container (400vh)
// El panel sube desde abajo y los HUD se revelan
// en secuencia a medida que el usuario baja.
// ─────────────────────────────────────────────
export default function Dashboard() {
  const sectionRef = useRef(null);

  // Ancla todo al scroll de esta sección (400vh)
  // Sin useSpring → respuesta inmediata y sin lag
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end end'],
  });

  // ── Panel: sube desde abajo (0→22%)
  const panelY     = useTransform(scrollYProgress, [0, 0.22], ['100vh', '0vh']);
  const panelScale = useTransform(scrollYProgress, [0, 0.22], [0.97, 1]);

  // ── Video: zoom-out parallax suave
  const videoScale = useTransform(scrollYProgress, [0, 0.35], [1.12, 1]);

  // ── Título de entrada: aparece → se va antes de que suba el panel
  const titleOpacity = useTransform(scrollYProgress, [0, 0.06, 0.14, 0.20], [1, 1, 0, 0]);
  const titleY       = useTransform(scrollYProgress, [0, 0.20], [0, -30]);

  // ── HUD 1 — Cámara + Stats (aparece al llegar el panel, sale al 44%)
  const hud1Opacity = useTransform(scrollYProgress, [0.22, 0.30, 0.40, 0.46], [0, 1, 1, 0]);
  const hud1Y       = useTransform(scrollYProgress, [0.22, 0.30], [16, 0]);

  // ── HUD 2 — Número central masivo (entra en 46%, sale en 68%)
  const hud2Opacity = useTransform(scrollYProgress, [0.46, 0.54, 0.62, 0.68], [0, 1, 1, 0]);
  const hud2Y       = useTransform(scrollYProgress, [0.46, 0.54], [24, 0]);

  // ── HUD 3 — Log lateral (entra en 68%, sale en 84%)
  const hud3Opacity = useTransform(scrollYProgress, [0.68, 0.74, 0.80, 0.86], [0, 1, 1, 0]);
  const hud3X       = useTransform(scrollYProgress, [0.68, 0.74], [-16, 0]);

  // ── HUD 4 — Status bar (entra en 86%, sale en 96%)
  const hud4Opacity = useTransform(scrollYProgress, [0.86, 0.90, 0.93, 0.97], [0, 1, 1, 0]);
  const hud4Y       = useTransform(scrollYProgress, [0.86, 0.90], [8, 0]);

  return (
    <section ref={sectionRef} className="monolith-section">
      <div className="monolith-sticky">

        {/* ── TÍTULO — centrado con flex, sin transform que FM pueda pisar */}
        <motion.div
          className="monolith-eyebrow"
          style={{ opacity: titleOpacity, y: titleY }}
        >
          <h2 className="monolith-title">Intelligence,<br />Visualized.</h2>
          <p className="poetic-subtitle">
            Real-time inference. Zero latency. Total awareness.
          </p>
        </motion.div>

        {/* ── CLIP WRAPPER: solo este div tiene overflow:hidden */}
        {/* Así el panel se recorta correctamente sin afectar al título */}
        <div className="monolith-clip">
          <motion.div
            className="monolith-panel"
            style={{ y: panelY, scale: panelScale }}
          >
          {/* VIDEO con zoom-out parallax */}
          <div className="monolith-video-clip">
            <motion.video
              src={videoSrc}
              autoPlay loop muted playsInline
              className="monolith-video"
              style={{ scale: videoScale }}
            />
            {/* Velo negro sobre el video — da profundidad */}
            <div className="monolith-veil" />
          </div>

          {/* ── HUD LAYER 1: Header — Etiqueta de cámara (Top-Left) */}
          <motion.div
            className="hud-camera-label"
            style={{ opacity: hud1Opacity, y: hud1Y }}
          >
            <span className="hud-cam-id">CAM_01</span>
            <span className="hud-cam-divider">/</span>
            <span className="hud-cam-loc">RECEPTION — SECTOR 4</span>
            <span className="hud-rec-dot" />
            <span className="hud-rec-text">REC</span>
          </motion.div>

          {/* ── HUD LAYER 1: Stats — Top-Right */}
          <motion.div
            className="hud-stats-corner"
            style={{ opacity: hud1Opacity, y: hud1Y }}
          >
            <div className="hud-stat-row">
              <span className="hud-stat-label">INFERENCE</span>
              <span className="hud-stat-value">12 ms</span>
            </div>
            <div className="hud-stat-row">
              <span className="hud-stat-label">ACCURACY</span>
              <span className="hud-stat-value">99.8%</span>
            </div>
            <div className="hud-stat-row">
              <span className="hud-stat-label">STREAMS</span>
              <span className="hud-stat-value">08</span>
            </div>
          </motion.div>

          {/* ── HUD LAYER 2: Stat central masiva */}
          <motion.div
            className="hud-central-stat"
            style={{ opacity: hud2Opacity, y: hud2Y }}
          >
            <span className="hud-big-number">98.4</span>
            <span className="hud-big-unit">%</span>
            <span className="hud-big-label">Detection Confidence</span>
          </motion.div>

          {/* ── Bounding box elegante (aparece con HUD 2) */}
          <motion.div
            className="hud-elegant-box hud-box-a"
            style={{ opacity: hud2Opacity }}
          >
            <span className="hud-box-tag">ID-0041 · Human</span>
          </motion.div>
          <motion.div
            className="hud-elegant-box hud-box-b"
            style={{ opacity: hud2Opacity }}
          />

          {/* ── HUD LAYER 3: Log lateral izquierdo */}
          <motion.div
            className="hud-log-lateral"
            style={{ opacity: hud3Opacity, x: hud3X }}
          >
            <span className="hud-log-title">ACTIVITY FEED</span>
            {[
              { t: '14:23:01', m: 'System integrity verified.' },
              { t: '14:23:05', m: 'Facial recognition engaged.' },
              { t: '14:23:12', m: 'Anomaly detected: Sector 4.' },
              { t: '14:23:15', m: 'Cross-referencing database...' },
            ].map((log, i) => (
              <div key={i} className="hud-log-entry">
                <span className="hud-log-time">{log.t}</span>
                <span className="hud-log-msg">{log.m}</span>
              </div>
            ))}
          </motion.div>

          {/* ── HUD LAYER 4: Status bar inferior */}
          <motion.div
            className="hud-status-bar"
            style={{ opacity: hud4Opacity, y: hud4Y }}
          >
            <div className="hud-status-left">
              <span className="hud-status-dot" />
              <span>All systems nominal</span>
              <span className="hud-status-sep">·</span>
              <span>Zero-trust protocol active</span>
            </div>
            <div className="hud-status-right">
              <span>SVIVIA OS v4.2.1</span>
            </div>
          </motion.div>
          </motion.div>
        </div>{/* /monolith-clip */}

      </div>
    </section>
  );
}
