import React, { useRef, Suspense, lazy } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

// Lazy-load the heavy Spline viewer — same pattern as Camera3D / ModelVisualizer
const Spline = lazy(() => import('@splinetool/react-spline'));

// The public Spline scene URL for the Interactive 3D Robot (21st.dev #1166)
const SPLINE_SCENE_URL =
  'https://prod.spline.design/PyzDhpQ9E5f1E3MT/scene.splinecode';

export default function RobotSection() {
  const sectionRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'center center'],
  });

  // Section fades + rises into view as you scroll
  const opacity = useTransform(scrollYProgress, [0, 0.4], [0, 1]);
  const y = useTransform(scrollYProgress, [0, 0.4], [80, 0]);

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
      {/* ── Ambient glow rings ────────────────────────────────────────────── */}
      <div className="robot-glow robot-glow--primary" />
      <div className="robot-glow robot-glow--secondary" />

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
          <Spline scene={SPLINE_SCENE_URL} />
        </Suspense>
      </motion.div>

      {/* ── Text overlay ─────────────────────────────────────────────────── */}
      <motion.div
        className="robot-text-overlay"
        style={{ opacity, y }}
      >
        <motion.span
          className="robot-badge"
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          EDGE AI ENGINE
        </motion.span>

        <motion.h2
          className="robot-title"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.5, ease: [0.33, 1, 0.68, 1] }}
        >
          Inteligencia que<br />
          <span className="robot-title--accent">nunca duerme.</span>
        </motion.h2>

        <motion.p
          className="robot-subtitle"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.7, ease: 'easeOut' }}
        >
          Procesamiento neuronal continuo. Sin latencia. Sin nube.
        </motion.p>
      </motion.div>
    </section>
  );
}
