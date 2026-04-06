import React from 'react';
import PoeticReveal from './ui/PoeticReveal';

export default function Pricing() {
  return (
    <section className="poetic-section">
      <div className="container center-flow">
        
        <PoeticReveal offset={["start bottom", "center center"]}>
          <h2 className="poetic-title-huge" style={{ fontSize: '4vw' }}>Adquiere tu licencia.</h2>
        </PoeticReveal>

        <div className="pricing-poetic">
          <PoeticReveal blur={false}>
            <div className="pricing-row">
              <div className="pricing-name">Personal</div>
              <div className="pricing-details">
                <div className="pricing-cost">Gratis</div>
                1 Cámara. Inferencia básica.
              </div>
            </div>
          </PoeticReveal>

          <PoeticReveal blur={false}>
             <div className="pricing-row">
              <div className="pricing-name" style={{ fontStyle: 'italic' }}>Hogar</div>
              <div className="pricing-details">
                <div className="pricing-cost">$9 / mes</div>
                4 Cámaras. Grabación Loop. Telegram.
              </div>
            </div>
          </PoeticReveal>

          <PoeticReveal blur={false}>
             <div className="pricing-row">
              <div className="pricing-name">Enterprise</div>
              <div className="pricing-details">
                <div className="pricing-cost">$29 / mes</div>
                Despliegue ilimitado. Modelos Custom.
              </div>
            </div>
          </PoeticReveal>
        </div>

      </div>
    </section>
  );
}
