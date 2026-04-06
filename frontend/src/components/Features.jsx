import React from 'react';
import PoeticReveal from './ui/PoeticReveal';

export default function Features() {
  return (
    <section className="poetic-section">
      <div className="container center-flow">
        <PoeticReveal offset={["start bottom", "center center"]}>
          <div style={{ fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.2em', color: 'var(--text-muted)' }}>
            Capacidades
          </div>
        </PoeticReveal>

        <div className="poetic-features">
          <PoeticReveal blur={false}>
            <div className="poetic-feature-item">
              <h3 className="poetic-feature-title">Telegram nativo.</h3>
              <p className="poetic-subtitle">Solo alertas con evidencia fotográfica 100% real.</p>
            </div>
          </PoeticReveal>

          <PoeticReveal blur={false}>
            <div className="poetic-feature-item">
              <h3 className="poetic-feature-title">Ecosistema abierto.</h3>
              <p className="poetic-subtitle">RTSP, Webcams USB, hardware antiguo revivido.</p>
            </div>
          </PoeticReveal>

          <PoeticReveal blur={false}>
            <div className="poetic-feature-item">
              <h3 className="poetic-feature-title">Motor Zero-Cloud.</h3>
              <p className="poetic-subtitle">Ningún modelo externo es contactado. Es tu red.</p>
            </div>
          </PoeticReveal>
        </div>
      </div>
    </section>
  );
}
