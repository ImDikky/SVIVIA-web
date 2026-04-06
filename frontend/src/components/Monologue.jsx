import React from 'react';
import PoeticReveal from './ui/PoeticReveal';

export default function Monologue() {
  return (
    <section className="poetic-section">
      <div className="container center-flow">
        <div className="thin-separator"></div>
        
        <PoeticReveal>
           <h2 className="poetic-title-huge" style={{ fontSize: '5vw' }}>Filtramos el ruido.</h2>
           <p className="poetic-subtitle">
             El viento, los árboles y las sombras solían ser un problema.<br/>
             Ahora, YOLOv8 respira en tu hardware analizando cada píxel.
           </p>
        </PoeticReveal>
        
        <div className="thin-separator"></div>

        <PoeticReveal>
           <h2 className="poetic-title-huge" style={{ fontSize: '5vw' }}>El silencio<br/>de lo privado.</h2>
           <p className="poetic-subtitle">
             Sin puertos abiertos, sin grabaciones expuestas.<br/>
             La inferencia empieza y termina en tu habitación.
           </p>
        </PoeticReveal>
      </div>
    </section>
  );
}
