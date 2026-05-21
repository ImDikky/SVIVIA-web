import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useSpring, useInView } from 'framer-motion';
import { Download as DownloadIcon, ArrowRight, Cpu, Shield, Zap } from 'lucide-react';

// ─── Palabras que se revelan al scroll ───────────────────────────────────────
function WordReveal({ text, progress, startAt = 0, endAt = 1, className = '' }) {
  const words = text.split(' ');
  return (
    <span className={className}>
      {words.map((word, i) => {
        const wordStart = startAt + (i / words.length) * (endAt - startAt);
        const wordEnd = wordStart + (1 / words.length) * (endAt - startAt) * 1.5;
        // eslint-disable-next-line react-hooks/rules-of-hooks
        const opacity = useTransform(progress, [wordStart, wordEnd], [0.1, 1]);
        // eslint-disable-next-line react-hooks/rules-of-hooks
        const y = useTransform(progress, [wordStart, wordEnd], [18, 0]);
        return (
          <motion.span
            key={i}
            style={{ opacity, y, display: 'inline-block', marginRight: '0.28em' }}
          >
            {word}
          </motion.span>
        );
      })}
    </span>
  );
}

// ─── Stat que cuenta al entrar en view ───────────────────────────────────────
function CountingStat({ value, label, delay = 0 }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.8 });
  return (
    <motion.div
      ref={ref}
      className="dl-stat"
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay, ease: [0.25, 0.8, 0.25, 1] }}
    >
      <span className="dl-stat-value">{value}</span>
      <span className="dl-stat-label">{label}</span>
    </motion.div>
  );
}

// ─── Mockup de la UI emergiendo ────────────────────────────────────────────
function AppMockup({ progress }) {
  const y      = useTransform(progress, [0.4, 0.85], ['60px', '0px']);
  const opacity = useTransform(progress, [0.4, 0.75], [0, 1]);
  const scale  = useTransform(progress, [0.4, 0.85], [0.92, 1]);

  return (
    <motion.div className="dl-mockup" style={{ y, opacity, scale }}>
      {/* Barra superior tipo app */}
      <div className="dl-mockup-bar">
        <span className="dl-mockup-dot" style={{ background: '#ff5f57' }} />
        <span className="dl-mockup-dot" style={{ background: '#febc2e' }} />
        <span className="dl-mockup-dot" style={{ background: '#28c840' }} />
        <span className="dl-mockup-title">SVIVIA Engine — Panel de control</span>
        <span className="dl-mockup-status">
          <span className="dl-mockup-live" /> LIVE
        </span>
      </div>
      {/* Grid de cámaras */}
      <div className="dl-mockup-grid">
        {['CAM-01', 'CAM-02', 'CAM-03', 'CAM-04'].map((cam, i) => (
          <div key={cam} className="dl-mockup-cam">
            <div className="dl-mockup-scanline" />
            <span className="dl-mockup-cam-label">{cam}</span>
            {i === 1 && (
              <div className="dl-mockup-detection">
                <div className="dl-mockup-bbox" />
                <span className="dl-mockup-conf">0.94</span>
              </div>
            )}
          </div>
        ))}
      </div>
    </motion.div>
  );
}

// ─── Línea de progreso del scroll ─────────────────────────────────────────
function ScrollProgressLine({ progress }) {
  const scaleX = useTransform(progress, [0, 1], [0, 1]);
  return (
    <motion.div
      className="dl-progress-line"
      style={{ scaleX, transformOrigin: 'left center' }}
    />
  );
}

// ─── Componente principal ─────────────────────────────────────────────────
export default function Download() {
  const containerRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  const smooth = useSpring(scrollYProgress, { damping: 30, stiffness: 100 });

  // Parallax del fondo
  const bgY = useTransform(smooth, [0, 1], ['0%', '30%']);

  // Opacidad de la sección (fade in/out)
  const sectionOpacity = useTransform(smooth, [0, 0.05, 0.95, 1], [0, 1, 1, 0]);

  // Eyebrow aparece pronto
  const eyebrowOpacity = useTransform(smooth, [0.02, 0.12], [0, 1]);
  const eyebrowY       = useTransform(smooth, [0.02, 0.12], [20, 0]);

  // El CTA entra en fase final
  const ctaOpacity = useTransform(smooth, [0.7, 0.9], [0, 1]);
  const ctaY       = useTransform(smooth, [0.7, 0.9], [40, 0]);

  return (
    <section
      id="download"
      ref={containerRef}
      className="dl-section"
    >
      {/* Fondo con gradiente parallax */}
      <motion.div className="dl-bg" style={{ y: bgY }} />

      {/* Sticky viewport */}
      <motion.div className="dl-sticky" style={{ opacity: sectionOpacity }}>

        {/* Línea de progreso superior */}
        <ScrollProgressLine progress={smooth} />

        {/* Columna izquierda: narrativa */}
        <div className="dl-left">

          {/* Eyebrow */}
          <motion.div
            className="dl-eyebrow"
            style={{ opacity: eyebrowOpacity, y: eyebrowY }}
          >
            <span className="dl-eyebrow-dot" />
            SVIVIA Engine 1.0 — Disponible ahora
          </motion.div>

          {/* Título reveal por palabras */}
          <h2 className="dl-headline">
            <WordReveal
              text="Instala el futuro."
              progress={smooth}
              startAt={0.08}
              endAt={0.38}
            />
            <br />
            <WordReveal
              text="Protege el presente."
              progress={smooth}
              startAt={0.28}
              endAt={0.58}
              className="dl-headline-italic"
            />
          </h2>

          {/* Subtítulo */}
          <motion.p
            className="dl-subtext"
            style={{
              opacity: useTransform(smooth, [0.45, 0.62], [0, 1]),
              y:       useTransform(smooth, [0.45, 0.62], [20, 0]),
            }}
          >
            Vigilancia inteligente corriendo nativamente en tu hardware.<br />
            Sin latencia de red. Sin comprometer tu privacidad.
          </motion.p>

          {/* Stats */}
          <motion.div
            className="dl-stats"
            style={{
              opacity: useTransform(smooth, [0.55, 0.72], [0, 1]),
            }}
          >
            <CountingStat value="< 50ms" label="Latencia inferencia" delay={0} />
            <div className="dl-stat-sep" />
            <CountingStat value="99.2%" label="Precisión detección" delay={0.1} />
            <div className="dl-stat-sep" />
            <CountingStat value="0 bytes" label="Enviados a la nube" delay={0.2} />
          </motion.div>

          {/* CTA */}
          <motion.div
            className="dl-cta-wrap"
            style={{ opacity: ctaOpacity, y: ctaY }}
          >
            <motion.a
              href="#"
              className="dl-btn-primary"
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
            >
              <span className="dl-btn-shimmer" />
              <DownloadIcon size={18} strokeWidth={2} />
              Descargar gratis
              <ArrowRight size={16} className="dl-btn-arrow" />
            </motion.a>

            <div className="dl-specs">
              <span className="dl-spec"><Cpu size={12} /> Windows 10/11</span>
              <span className="dl-spec-sep">·</span>
              <span className="dl-spec"><Shield size={12} /> RTX recomendado</span>
              <span className="dl-spec-sep">·</span>
              <span className="dl-spec"><Zap size={12} /> ~450 MB</span>
            </div>
          </motion.div>
        </div>

        {/* Columna derecha: mockup de la app */}
        <div className="dl-right">
          <AppMockup progress={smooth} />
        </div>

      </motion.div>
    </section>
  );
}
