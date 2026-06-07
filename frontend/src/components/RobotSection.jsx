import React, { useRef, Suspense, lazy, useState, useEffect } from 'react';
import { motion, useScroll, useTransform, useInView, useVelocity, useSpring } from 'framer-motion';
import SplitLetterReveal from './ui/SplitLetterReveal';

// Lazy-load the heavy Spline viewer
const Spline = lazy(() => import('@splinetool/react-spline'));

// The public Spline scene URL for the Interactive 3D Robot
const SPLINE_SCENE_URL =
  'https://prod.spline.design/PyzDhpQ9E5f1E3MT/scene.splinecode';

// ─── Inference log lines that type out sequentially ───────────────────────────
const INFERENCE_LINES = [
  { text: '> inicializando motor neuronal...', color: '#a3a3a3', delay: 0 },
  { text: '> modelo: YOLOv8-nano @ CUDA:0', color: '#a3a3a3', delay: 420 },
  { text: '> stream RTSP vinculado: OK', color: '#a3a3a3', delay: 860 },
  { text: '> inferencia: 28ms · 36fps', color: '#d97706', delay: 1300 },
  { text: '> persona detectada — conf: 0.94', color: '#ef4444', delay: 1800 },
  { text: '> pre-buffer activado: 5s en RAM', color: '#a3a3a3', delay: 2350 },
  { text: '> alerta → Telegram enviada', color: '#22c55e', delay: 2900 },
  { text: '> grabación AES-256 guardada', color: '#a3a3a3', delay: 3350 },
  { text: '> volviendo al estado de guardia.', color: '#a3a3a3', delay: 3800 },
];

// ─── Animated counter that counts up from 0 to a target value ─────────────────
function Counter({ target, suffix = '', decimals = 0, active }) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (!active) return;
    let start = null;
    const duration = 1800;
    const step = (timestamp) => {
      if (!start) start = timestamp;
      const progress = Math.min((timestamp - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(parseFloat((eased * target).toFixed(decimals)));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [active, target, decimals]);
  return <>{value}{suffix}</>;
}

// ─── The main Neural HUD panel ────────────────────────────────────────────────
function NeuralHUD({ opacity, y, inView }) {
  const [visibleLines, setVisibleLines] = useState([]);
  const [cursorVisible, setCursorVisible] = useState(true);
  const timerRefs = useRef([]);

  // Blink cursor
  useEffect(() => {
    const blink = setInterval(() => setCursorVisible(v => !v), 530);
    return () => clearInterval(blink);
  }, []);

  // Trigger typewriter when inView
  useEffect(() => {
    if (!inView) {
      // Reset when out of view so it replays on re-entry
      timerRefs.current.forEach(t => clearTimeout(t));
      timerRefs.current = [];
      setVisibleLines([]);
      return;
    }
    timerRefs.current.forEach(t => clearTimeout(t));
    timerRefs.current = [];
    setVisibleLines([]);
    INFERENCE_LINES.forEach((line, i) => {
      const t = setTimeout(() => {
        setVisibleLines(prev => [...prev, i]);
      }, line.delay + 600); // 600ms offset so it starts after fade-in
      timerRefs.current.push(t);
    });
    return () => timerRefs.current.forEach(t => clearTimeout(t));
  }, [inView]);

  const metrics = [
    { label: 'LATENCIA', value: 28, suffix: 'ms', decimals: 0, accent: '#d97706' },
    { label: 'CONFIANZA', value: 94, suffix: '%', decimals: 0, accent: '#ef4444' },
    { label: 'FPS', value: 36, suffix: '', decimals: 0, accent: '#22c55e' },
  ];

  return (
    <motion.div
      className="robot-text-overlay"
      style={{ opacity, y }}
    >
      {/* ── Badge ── */}
      <motion.span
        className="robot-badge"
        initial={{ opacity: 0, scale: 0.8 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        EDGE AI ENGINE · SVIVIA v2
      </motion.span>

      {/* ── Headline ── */}
      <h2 className="robot-title">
        <SplitLetterReveal text="Ve lo que el ojo" delay={0.2} /><br />
        <span className="robot-title--accent">
          <SplitLetterReveal text="humano no puede." delay={0.5} />
        </span>
      </h2>

      {/* ── Subtitle ── */}
      <motion.p
        className="robot-subtitle"
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7, delay: 0.5, ease: 'easeOut' }}
      >
        YOLOv8 corre en tu hardware. Sin nube. Sin latencia. Sin excusas.
      </motion.p>

      {/* ── Live metric chips ── */}
      <motion.div
        style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginTop: '1.4rem' }}
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.65 }}
      >
        {metrics.map((m) => (
          <div key={m.label} style={{
            background: 'rgba(255,255,255,0.04)',
            border: `1px solid ${m.accent}33`,
            borderRadius: '10px',
            padding: '8px 14px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            minWidth: '72px',
          }}>
            <span style={{
              fontSize: '1.5rem', fontWeight: 700, fontFamily: 'monospace',
              color: m.accent, lineHeight: 1, letterSpacing: '-0.04em',
            }}>
              <Counter target={m.value} suffix={m.suffix} decimals={m.decimals} active={inView} />
            </span>
            <span style={{ fontSize: '0.58rem', color: '#737373', letterSpacing: '0.12em', marginTop: '3px' }}>
              {m.label}
            </span>
          </div>
        ))}
      </motion.div>

      {/* ── Inference terminal ── */}
      <motion.div
        style={{
          marginTop: '1.6rem',
          background: 'rgba(0,0,0,0.55)',
          border: '1px solid rgba(255,255,255,0.07)',
          borderRadius: '12px',
          padding: '14px 16px',
          fontFamily: 'monospace',
          fontSize: '0.72rem',
          lineHeight: 1.7,
          backdropFilter: 'blur(8px)',
          minHeight: '140px',
        }}
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.8 }}
      >
        <div style={{ color: '#ef4444', marginBottom: '6px', fontSize: '0.6rem', letterSpacing: '0.2em' }}>
          ● SVIVIA_ENGINE — SALIDA EN VIVO
        </div>
        {INFERENCE_LINES.map((line, i) => (
          visibleLines.includes(i) && (
            <div key={i} style={{ color: line.color, opacity: 0.92 }}>
              {line.text}
            </div>
          )
        ))}
        {/* Blinking cursor — only shows while terminal is still typing */}
        {visibleLines.length < INFERENCE_LINES.length && (
          <span style={{ color: '#ef4444', opacity: cursorVisible ? 1 : 0 }}>▋</span>
        )}
      </motion.div>
    </motion.div>
  );
}


export default function RobotSection() {
  const sectionRef = useRef(null);
  // Detectar si la sección está en el viewport
  const inView = useInView(sectionRef, { amount: 0.01, margin: "200px 0px" });

  const [hasLoaded, setHasLoaded] = useState(false);

  // Activar la precarga por primera vez al entrar en el viewport
  useEffect(() => {
    if (inView && !hasLoaded) {
      setHasLoaded(true);
    }
  }, [inView, hasLoaded]);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'center center'],
  });

  // Section fades + rises into view as you scroll
  const opacity = useTransform(scrollYProgress, [0, 0.4], [0, 1]);
  const y = useTransform(scrollYProgress, [0, 0.4], [80, 0]);

  // Velocity-based ambient glow reaction
  const { scrollY } = useScroll();
  const scrollVelocity = useVelocity(scrollY);
  const smoothVelocity = useSpring(useTransform(scrollVelocity, (v) => Math.min(Math.abs(v) / 1000, 2)), {
    damping: 30,
    stiffness: 120
  });
  
  const glowScale = useTransform(smoothVelocity, [0, 2], [1, 1.25]);
  const glowOpacity = useTransform(smoothVelocity, [0, 2], [0.65, 1.15]);

  return (
    <section
      ref={sectionRef}
      className="robot-section"
      style={{
        position: 'relative',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        background: '#000',
      }}
    >
      {/* ── Ambient glow orbs ────────────────────────────────────────────── */}
      <motion.div 
        className="robot-glow robot-glow--primary" 
        style={{ scale: glowScale, opacity: glowOpacity, x: "-50%", y: "-55%" }}
      />
      <motion.div 
        className="robot-glow robot-glow--secondary" 
        style={{ scale: glowScale, opacity: glowOpacity }}
      />

      {/* ── Spline 3-D Robot ─────────────────────────────────────────────── */}
      <motion.div
        style={{ opacity, y }}
        className="robot-canvas-wrapper"
      >
        <Suspense
          fallback={
            <div className="robot-fallback">
              <span className="robot-fallback-dot" />
              <span className="robot-fallback-dot" style={{ animationDelay: '0.2s' }} />
              <span className="robot-fallback-dot" style={{ animationDelay: '0.4s' }} />
            </div>
          }
        >
          {/* 
            Mantenemos el Canvas de Spline montado tras su carga inicial para evitar lag
            al reconstruir el contexto WebGL y recompilar shaders. Usamos display 'none' 
            cuando está fuera de vista para pausar el repintado del navegador y ahorrar GPU.
          */}
          {hasLoaded && (
            <div data-cursor="ROTAR ROBOT" style={{ display: inView ? 'block' : 'none', width: '100%', height: '100%' }}>
              <Spline scene={SPLINE_SCENE_URL} />
            </div>
          )}

          {!inView && (
            <div className="robot-fallback">
              <span className="robot-fallback-dot" />
              <span className="robot-fallback-dot" style={{ animationDelay: '0.2s' }} />
              <span className="robot-fallback-dot" style={{ animationDelay: '0.4s' }} />
            </div>
          )}
        </Suspense>
      </motion.div>

      {/* ── Neural Inference HUD overlay ────────────────────────────────── */}
      <NeuralHUD opacity={opacity} y={y} inView={inView} />
    </section>
  );
}
