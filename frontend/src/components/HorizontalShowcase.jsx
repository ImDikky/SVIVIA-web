import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Eye, Server, Lock, Smartphone } from 'lucide-react';

export default function HorizontalShowcase() {
  const targetRef = useRef(null);
  
  // Usamos el contenedor gigante para trackear el scroll
  const { scrollYProgress } = useScroll({
    target: targetRef,
  });

  // MAGIA: Transformamos el scroll Vertical (0 a 1) en movimiento Horizontal (X)
  // Como tenemos 4 tarjetas anchas, movemos el contenedor hacia la izquierda (-75%)
  const x = useTransform(scrollYProgress, [0, 1], ["0%", "-75%"]);

  return (
    // section de 400vh: Significa que el usuario tendrá que hacer "4 pantallas" de scroll hacia abajo
    <section ref={targetRef} style={{ height: '400vh', position: 'relative', background: '#000' }}>
      
      {/* Contenedor Sticky: Se queda pegado a la pantalla durante los 400vh */}
      <div style={{ position: 'sticky', top: 0, height: '100vh', display: 'flex', alignItems: 'center', overflow: 'hidden' }}>
        
        {/* Título fijo en la esquina superior izquierda */}
        <div style={{ position: 'absolute', top: '15vh', left: '5vw', zIndex: 10 }}>
            <h2 className="poetic-title-huge" style={{ fontSize: '3vw', color: '#fff' }}>El Flujo de Trabajo.</h2>
            <div style={{ width: '50px', height: '2px', background: '#4f46e5', marginTop: '1rem' }}></div>
        </div>

        {/* 
          El Tren Horizontal: 
          Su ancho total es 400vw (4 pantallas), pero solo vemos una a la vez.
          El estilo 'x' lo desliza mágicamente.
        */}
        <motion.div style={{ x, display: 'flex', width: '400vw', paddingLeft: '5vw' }}>
          
          {/* Tarjeta 1 */}
          <div style={{ width: '100vw', display: 'flex', alignItems: 'center', justifyContent: 'flex-start' }}>
             <div style={{ width: '70vw', height: '60vh', background: 'linear-gradient(145deg, rgba(20,20,20,1) 0%, rgba(5,5,5,1) 100%)', borderRadius: '32px', border: '1px solid rgba(255,255,255,0.05)', display: 'flex', overflow: 'hidden', boxShadow: '0 30px 60px rgba(0,0,0,0.5)' }}>
                <div style={{ flex: 1, padding: '4rem', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                   <Eye size={48} color="#4f46e5" style={{ marginBottom: '2rem' }} />
                   <h3 className="poetic-feature-title" style={{ fontSize: '3rem', marginBottom: '1rem' }}>Captura RTSP.</h3>
                   <p style={{ color: '#a3a3a3', fontSize: '1.2rem', lineHeight: 1.6 }}>Nos conectamos directamente al flujo de video crudo de tus cámaras IP existentes sin añadir latencia.</p>
                </div>
                <div style={{ flex: 1, background: 'radial-gradient(circle at center, rgba(79,70,229,0.2) 0%, transparent 70%)', borderLeft: '1px solid rgba(255,255,255,0.05)' }}></div>
             </div>
          </div>

          {/* Tarjeta 2 */}
          <div style={{ width: '100vw', display: 'flex', alignItems: 'center', justifyContent: 'flex-start' }}>
             <div style={{ width: '70vw', height: '60vh', background: 'linear-gradient(145deg, rgba(20,20,20,1) 0%, rgba(5,5,5,1) 100%)', borderRadius: '32px', border: '1px solid rgba(255,255,255,0.05)', display: 'flex', overflow: 'hidden', boxShadow: '0 30px 60px rgba(0,0,0,0.5)' }}>
                <div style={{ flex: 1, padding: '4rem', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                   <Server size={48} color="#4f46e5" style={{ marginBottom: '2rem' }} />
                   <h3 className="poetic-feature-title" style={{ fontSize: '3rem', marginBottom: '1rem' }}>Inferencia YOLOv8.</h3>
                   <p style={{ color: '#a3a3a3', fontSize: '1.2rem', lineHeight: 1.6 }}>El hardware local toma el control. Redes neuronales convolucionales analizan los frames en milisegundos buscando amenazas.</p>
                </div>
                <div style={{ flex: 1, background: 'radial-gradient(circle at center, rgba(79,70,229,0.2) 0%, transparent 70%)', borderLeft: '1px solid rgba(255,255,255,0.05)' }}></div>
             </div>
          </div>

          {/* Tarjeta 3 */}
          <div style={{ width: '100vw', display: 'flex', alignItems: 'center', justifyContent: 'flex-start' }}>
             <div style={{ width: '70vw', height: '60vh', background: 'linear-gradient(145deg, rgba(20,20,20,1) 0%, rgba(5,5,5,1) 100%)', borderRadius: '32px', border: '1px solid rgba(255,255,255,0.05)', display: 'flex', overflow: 'hidden', boxShadow: '0 30px 60px rgba(0,0,0,0.5)' }}>
                <div style={{ flex: 1, padding: '4rem', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                   <Lock size={48} color="#4f46e5" style={{ marginBottom: '2rem' }} />
                   <h3 className="poetic-feature-title" style={{ fontSize: '3rem', marginBottom: '1rem' }}>Criptografía.</h3>
                   <p style={{ color: '#a3a3a3', fontSize: '1.2rem', lineHeight: 1.6 }}>La evidencia se encripta inmediatamente. No hay servidores intermedios, tu privacidad está sellada herméticamente.</p>
                </div>
                <div style={{ flex: 1, background: 'radial-gradient(circle at center, rgba(79,70,229,0.2) 0%, transparent 70%)', borderLeft: '1px solid rgba(255,255,255,0.05)' }}></div>
             </div>
          </div>

          {/* Tarjeta 4 */}
          <div style={{ width: '100vw', display: 'flex', alignItems: 'center', justifyContent: 'flex-start' }}>
             <div style={{ width: '70vw', height: '60vh', background: 'linear-gradient(145deg, rgba(20,20,20,1) 0%, rgba(5,5,5,1) 100%)', borderRadius: '32px', border: '1px solid rgba(255,255,255,0.05)', display: 'flex', overflow: 'hidden', boxShadow: '0 30px 60px rgba(0,0,0,0.5)' }}>
                <div style={{ flex: 1, padding: '4rem', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                   <Smartphone size={48} color="#4f46e5" style={{ marginBottom: '2rem' }} />
                   <h3 className="poetic-feature-title" style={{ fontSize: '3rem', marginBottom: '1rem' }}>Alerta a Telegram.</h3>
                   <p style={{ color: '#a3a3a3', fontSize: '1.2rem', lineHeight: 1.6 }}>La notificación llega a tu dispositivo móvil en tiempo real. Tienes el control total, estés donde estés.</p>
                </div>
                <div style={{ flex: 1, background: 'radial-gradient(circle at center, rgba(79,70,229,0.2) 0%, transparent 70%)', borderLeft: '1px solid rgba(255,255,255,0.05)' }}></div>
             </div>
          </div>

        </motion.div>
      </div>
    </section>
  );
}
