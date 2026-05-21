import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import PoeticReveal from './ui/PoeticReveal';

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
              <p className="poetic-subtitle" style={{ textAlign: 'left' }}>
                El viento, los árboles y las sombras solían ser un problema.<br />
                Ahora, YOLOv8 respira en tu hardware analizando cada píxel.
              </p>
            </PoeticReveal>
          </div>
          <TerminalWidget />
        </div>

        <div className="thin-separator" />

        {/* Bloque 2: El silencio de lo privado — con orbe animado */}
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
              <Shield />
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
              <p className="poetic-subtitle" style={{ textAlign: 'left' }}>
                Sin puertos abiertos, sin grabaciones expuestas.<br />
                La inferencia empieza y termina en tu habitación.
              </p>
            </PoeticReveal>
          </div>
        </div>

        <div className="thin-separator" />
      </div>
    </section>
  );
}

function Shield() {
  return (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="rgba(34,197,94,0.8)" strokeWidth="1.5">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  );
}
