import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
// Importamos la imagen que acabas de subir
import tommyImg from '../assets/tommy-lindo.jpeg';

export default function Features() {
  const containerRef = useRef(null);

  // Rastreamos el scroll solo dentro de esta inmensa sección
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  // Hacemos que la imagen estática haga "zoom" sutilmente conforme vas leyendo las fases
  const imageScale = useTransform(scrollYProgress, [0, 1], [1, 1.2]);
  const imageFilter = useTransform(scrollYProgress, [0, 0.5, 1], ['brightness(1) blur(0px)', 'brightness(0.6) blur(2px)', 'brightness(0.3) blur(5px)']);

  return (
    // La sección dura "300vh" (3 veces el tamaño de la pantalla) para dar tiempo a scrollear
    <section ref={containerRef} style={{ position: 'relative', height: '300vh', backgroundColor: '#000' }}>
      
      {/* =========================================
          EL TRUCO DE MAGIA: POSITION STICKY
          Esto hace que el contenedor de la imagen se "pegue" a la pantalla 
          y no se mueva mientras sigues bajando por los 300vh.
      ============================================= */}
      <div style={{ position: 'sticky', top: 0, height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
        
        {/* Imagen central con animaciones atadas a la rueda de tu ratón */}
        <motion.div 
           style={{ 
             width: '60vw', height: '70vh', 
             borderRadius: '32px', overflow: 'hidden',
             boxShadow: '0 0 80px rgba(79, 70, 229, 0.2)',
             scale: imageScale,
             filter: imageFilter
           }}
        >
          <img src={tommyImg} alt="Tommy Lindo" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          
          {/* Un viñeteado (sombras en los bordes) para que el texto por encima se lea bien */}
          <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle, transparent 40%, rgba(0,0,0,0.8) 100%)' }} />
        </motion.div>
      </div>

      {/* =========================================
          LOS TEXTOS EN FASES (Hacen scroll normal)
          Como están posicionados relativamente y les quitamos el primer 100vh con marginTop,
          van a pasar por encima de la imagen pegada.
      ============================================= */}
      <div style={{ position: 'relative', zIndex: 10, marginTop: '-100vh', paddingBottom: '20vh' }}>
        
        {/* Fase 1: Aparece al principio, alineado a la izquierda */}
        <div style={{ height: '100vh', display: 'flex', alignItems: 'center', paddingLeft: '10vw' }}>
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: false, amount: 0.5 }}
            transition={{ duration: 0.8 }}
            style={{ background: 'rgba(10,10,10,0.85)', padding: '3.5rem', borderRadius: '24px', backdropFilter: 'blur(15px)', border: '1px solid rgba(255,255,255,0.1)', maxWidth: '450px', boxShadow: '0 30px 60px rgba(0,0,0,0.5)' }}
          >
             <h3 className="poetic-feature-title" style={{ fontSize: '2.8rem', marginBottom: '1rem', background: 'linear-gradient(to right, #fff, #4f46e5)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', lineHeight: 1.2 }}>
               Fase 1:<br/>Identificación.
             </h3>
             <p style={{ color: '#a3a3a3', fontSize: '1.2rem', lineHeight: 1.6 }}>El modelo YOLOv8 escanea la geometría en tiempo real. Cada píxel es analizado buscando amenazas potenciales. La luz y la sombra ya no son excusa.</p>
          </motion.div>
        </div>

        {/* Fase 2: Aparece a la mitad del scroll, alineado a la derecha */}
        <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', paddingRight: '10vw' }}>
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: false, amount: 0.5 }}
            transition={{ duration: 0.8 }}
            style={{ background: 'rgba(10,10,10,0.85)', padding: '3.5rem', borderRadius: '24px', backdropFilter: 'blur(15px)', border: '1px solid rgba(255,255,255,0.1)', maxWidth: '450px', boxShadow: '0 30px 60px rgba(0,0,0,0.5)' }}
          >
             <h3 className="poetic-feature-title" style={{ fontSize: '2.8rem', marginBottom: '1rem', background: 'linear-gradient(to right, #fff, #4f46e5)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', lineHeight: 1.2 }}>
               Fase 2:<br/>Motor Cero Nube.
             </h3>
             <p style={{ color: '#a3a3a3', fontSize: '1.2rem', lineHeight: 1.6 }}>Tu imagen, como esta, no sale de tu red. El procesamiento neuronal ocurre en el hardware local garantizando una privacidad que ninguna empresa grande te ofrece.</p>
          </motion.div>
        </div>

        {/* Fase 3: Aparece al final del scroll, centrado */}
        <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.5 }}
            transition={{ duration: 0.8 }}
            style={{ background: 'rgba(10,10,10,0.85)', padding: '3.5rem', borderRadius: '24px', backdropFilter: 'blur(15px)', border: '1px solid rgba(255,255,255,0.1)', maxWidth: '550px', textAlign: 'center', boxShadow: '0 30px 60px rgba(0,0,0,0.5)' }}
          >
             <h3 className="poetic-feature-title" style={{ fontSize: '2.8rem', marginBottom: '1rem', background: 'linear-gradient(to right, #fff, #4f46e5)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', lineHeight: 1.2 }}>
               Fase 3:<br/>Evidencia Directa.
             </h3>
             <p style={{ color: '#a3a3a3', fontSize: '1.2rem', lineHeight: 1.6 }}>En caso de detección positiva, los frames en alta definición se encriptan y se envían de forma nativa a tu dispositivo a través de la integración con Telegram.</p>
          </motion.div>
        </div>

      </div>
    </section>
  );
}
