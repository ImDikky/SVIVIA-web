import React from 'react';
import { motion } from 'framer-motion';

export default function Hero() {
  return (
    <section className="poetic-section" style={{ minHeight: '100vh', padding: 0 }}>
      <motion.div 
        className="center-flow container"
        initial={{ opacity: 0, filter: 'blur(20px)' }}
        animate={{ opacity: 1, filter: 'blur(0px)' }}
        transition={{ duration: 2, ease: "easeOut", delay: 0.5 }}
      >
        <h1 className="poetic-title-huge">
          Visión <br />
          <span style={{ fontStyle: 'italic', color: 'var(--text-muted)' }}>absoluta.</span>
        </h1>
        <p className="poetic-subtitle" style={{ marginTop: '2rem' }}>
          La inteligencia artificial no pertenece a la nube.
          <br/>Reclama tu privacidad. Transforma tus cámaras con Edge AI local.
        </p>
      </motion.div>
    </section>
  );
}
