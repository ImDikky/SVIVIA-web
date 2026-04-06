import React from 'react';
import PoeticReveal from './ui/PoeticReveal';

export default function Footer() {
  return (
    <section className="poetic-section" style={{ minHeight: '100vh' }}>
      <div className="container center-flow">
        <PoeticReveal blur={false} offset={["start 80%", "end 20%"]}>
           <h2 className="poetic-title-huge">Empieza ahora.</h2>
           <button className="btn-minimal" style={{ marginTop: '2rem' }}>Descargar Engine .exe</button>
        </PoeticReveal>
        
        <div style={{ marginTop: '20vh', color: 'var(--text-dark)', fontSize: '0.75rem', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
          SVIVA © {new Date().getFullYear()} / Edge Security
        </div>
      </div>
    </section>
  );
}
