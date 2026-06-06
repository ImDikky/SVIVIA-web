import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import PoeticReveal from './ui/PoeticReveal';
import SplitTextReveal from './ui/SplitTextReveal';

const TERMINAL_LINES = [
  '> inicializando YOLOv8...',
  '> cargando pesos del modelo',
  '> dispositivo: CUDA:0 (RTX 3080)',
  '> stream de cámara: activo',
  '> confianza umbral: 0.72',
  '> inferencia: OK',
];

function TerminalWidget() {
  return (
    <motion.div
      className="monologue-terminal"
      initial={{ opacity: 0, x: 40 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, amount: 0.5 }}
      transition={{ duration: 0.9, delay: 0.3 }}
    >
      <div className="terminal-header">
        <span className="terminal-dot red" />
        <span className="terminal-dot yellow" />
        <span className="terminal-dot green" />
        <span className="terminal-title">svivia_engine.exe</span>
      </div>
      <div className="terminal-body">
        {TERMINAL_LINES.map((line, i) => (
          <motion.div
            key={i}
            className="terminal-line"
            initial={{ opacity: 0, x: -10 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5 + i * 0.12, duration: 0.4 }}
          >
            <span className="terminal-prompt">$</span>
            <span className={i === TERMINAL_LINES.length - 1 ? 'terminal-text terminal-text--ok' : 'terminal-text'}>
              {line}
            </span>
          </motion.div>
        ))}
        <motion.span
          className="terminal-cursor"
          animate={{ opacity: [1, 0, 1] }}
          transition={{ repeat: Infinity, duration: 1 }}
        >▋</motion.span>
      </div>
    </motion.div>
  );
}

export default function Monologue() {
  const sectionRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });
  const orbY = useTransform(scrollYProgress, [0, 1], [-60, 60]);

  return (
    <section ref={sectionRef} className="poetic-section monologue-section">
      {/* Orbe de fondo que se mueve con el scroll */}
      <motion.div className="monologue-orb" style={{ y: orbY }} />

      <div className="container">
        <div className="thin-separator" />

        {/* Bloque 1: Filtramos el ruido — con terminal a la derecha */}
        <div className="monologue-row">
          <div className="monologue-text-col">
            <motion.span
              className="monologue-line-number"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              01
            </motion.span>
            <PoeticReveal>
              <h2 className="poetic-title-huge" style={{ fontSize: '5vw', textAlign: 'left' }}>
                Filtramos el ruido.
              </h2>
              <p className="poetic-subtitle" style={{ textAlign: 'left', color: 'transparent' }}>
                <SplitTextReveal
                  text="El viento, los árboles y las sombras solían ser un problema. Ahora, YOLOv8 respira en tu hardware analizando cada píxel."
                />
              </p>
            </PoeticReveal>
          </div>
          <TerminalWidget />
        </div>

        <div className="thin-separator" />

        {/* Bloque 2: El silencio de lo privado — con candado animado */}
        <div className="monologue-row monologue-row--reverse">
          <motion.div
            className="monologue-privacy-visual"
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 1, ease: [0.25, 0.8, 0.25, 1] }}
          >
            <div className="privacy-ring privacy-ring--1" />
            <div className="privacy-ring privacy-ring--2" />
            <div className="privacy-ring privacy-ring--3" />
            <div className="privacy-core">
              <LockIcon />
            </div>
          </motion.div>

          <div className="monologue-text-col">
            <motion.span
              className="monologue-line-number"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              02
            </motion.span>
            <PoeticReveal>
              <h2 className="poetic-title-huge" style={{ fontSize: '5vw', textAlign: 'left' }}>
                El silencio<br />de lo privado.
              </h2>
              <p className="poetic-subtitle" style={{ textAlign: 'left', color: 'transparent' }}>
                <SplitTextReveal
                  text="Sin puertos abiertos, sin grabaciones expuestas. La inferencia empieza y termina en tu habitación."
                />
              </p>
            </PoeticReveal>
          </div>
        </div>

        <div className="thin-separator" />
      </div>
    </section>
  );
}

/* ─── Animated Lock Icon ─────────────────────────────────────────────────── */
function LockIcon() {
  return (
    <motion.svg
      width="52"
      height="52"
      viewBox="0 0 52 52"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.6 }}
    >
      {/* SVG Glow filter */}
      <defs>
        <filter id="lock-glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="2.5" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Shackle (arc on top) — draws in first via pathLength */}
      <motion.path
        d="M16 22V17C16 11.477 20.477 7 26 7C31.523 7 36 11.477 36 17V22"
        stroke="rgba(239, 68, 68, 0.9)"
        strokeWidth="2.2"
        strokeLinecap="round"
        filter="url(#lock-glow)"
        variants={{
          hidden: { pathLength: 0, opacity: 0 },
          visible: {
            pathLength: 1,
            opacity: 1,
            transition: { duration: 0.8, ease: 'easeOut', delay: 0.2 },
          },
        }}
      />

      {/* Lock body — scales in after shackle finishes */}
      <motion.rect
        x="11"
        y="22"
        width="30"
        height="23"
        rx="4"
        stroke="rgba(239, 68, 68, 0.9)"
        strokeWidth="2.2"
        filter="url(#lock-glow)"
        variants={{
          hidden: { opacity: 0, scaleY: 0.6 },
          visible: {
            opacity: 1,
            scaleY: 1,
            transition: { duration: 0.5, ease: 'easeOut', delay: 0.9 },
          },
        }}
        style={{ transformOrigin: '26px 22px' }}
      />

      {/* Keyhole circle */}
      <motion.circle
        cx="26"
        cy="33"
        r="3"
        fill="rgba(239, 68, 68, 0.85)"
        filter="url(#lock-glow)"
        variants={{
          hidden: { opacity: 0, scale: 0 },
          visible: {
            opacity: 1,
            scale: 1,
            transition: { duration: 0.35, ease: 'backOut', delay: 1.35 },
          },
        }}
        style={{ transformOrigin: '26px 33px' }}
      />

      {/* Keyhole stem */}
      <motion.rect
        x="24.5"
        y="35"
        width="3"
        height="5"
        rx="1.5"
        fill="rgba(239, 68, 68, 0.85)"
        filter="url(#lock-glow)"
        variants={{
          hidden: { opacity: 0, scaleY: 0 },
          visible: {
            opacity: 1,
            scaleY: 1,
            transition: { duration: 0.25, ease: 'easeOut', delay: 1.55 },
          },
        }}
        style={{ transformOrigin: '26px 35px' }}
      />

      {/* Pulse ring — continuous subtle heartbeat glow around keyhole */}
      <motion.circle
        cx="26"
        cy="33"
        r="7"
        stroke="rgba(239, 68, 68, 0.25)"
        strokeWidth="1"
        fill="none"
        animate={{ scale: [1, 1.6, 1], opacity: [0.4, 0, 0.4] }}
        transition={{ repeat: Infinity, duration: 2.4, ease: 'easeInOut', delay: 1.8 }}
        style={{ transformOrigin: '26px 33px' }}
      />
    </motion.svg>
  );
}
