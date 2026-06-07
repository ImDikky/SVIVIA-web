import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Cpu, Shield, ShieldCheck, Zap, AlertTriangle, 
  HelpCircle, Sliders, Server, HardDrive, BellRing, ChevronRight, Eye
} from 'lucide-react';

export default function Pricing() {
  const [cameras, setCameras] = useState(3);
  const [detectionLevel, setDetectionLevel] = useState('standard'); // 'standard' (siluetas/vehículos), 'advanced' (facial/zonas)
  const [alertType, setAlertType] = useState('telegram'); // 'local' (solo PC), 'telegram' (alertas móvil)

  // Trigger global tactile beep on interaction
  const triggerSound = (freq = 900, dur = 0.02) => {
    if (window.playTactileClick) {
      try {
        window.playTactileClick(freq, dur, 'sine', 0.12);
      } catch (e) {}
    }
  };

  // Dynamic calculations based on state (simpler for common people)
  const getSpecs = () => {
    let planName = "Plan Familiar";
    let hardware = "Mini PC / Computadora Hogareña";
    let speed = "Instantáneo (18ms)";
    let price = "$39";
    let priceSub = "Licencia Personal Perpetua";
    let ctaText = "OBTENER LICENCIA PERSONAL";
    let desc = "Protege el perímetro completo de tu casa o pequeña oficina.";
    let baseLatency = 18;

    if (cameras === 1) {
      planName = "Plan Inicial / Hogar";
      hardware = "Cualquier PC antigua o Portátil";
      speed = "Instantáneo (12ms)";
      price = "Gratis";
      priceSub = "Licencia Community (Comunidad)";
      ctaText = "DESCARGAR VERSIÓN GRATUITA";
      desc = "Ideal para probar el sistema con una cámara de acceso principal.";
      baseLatency = 12;
    } else if (cameras <= 4) {
      planName = "Plan Familiar / Oficina";
      hardware = "Mini PC de Bajo Consumo (ej. Intel N100)";
      speed = "Ultra Rápido (25ms)";
      price = "$39";
      priceSub = "Licencia Personal de por Vida";
      ctaText = "OBTENER LICENCIA PERSONAL";
      desc = "Ideal para casas familiares y locales comerciales estándar.";
      baseLatency = 25;
    } else if (cameras <= 8) {
      planName = "Plan Negocio / Pyme";
      hardware = "Computadora con Tarjeta de Video NVIDIA";
      speed = "Súper Rápido (35ms)";
      price = "$79";
      priceSub = "Licencia Profesional de por Vida";
      ctaText = "OBTENER LICENCIA PROFESIONAL";
      desc = "Diseñado para tiendas, depósitos y oficinas medianas.";
      baseLatency = 35;
    } else {
      planName = "Plan Corporativo / Enterprise";
      hardware = "Servidor Dedicado o Estación de Seguridad";
      speed = "Estable e Inmediato (48ms)";
      price = "$199";
      priceSub = "Licencia Comercial Ilimitada";
      ctaText = "OBTENER LICENCIA ENTERPRISE";
      desc = "Para vigilancia masiva en fábricas, edificios o retail multinacional.";
      baseLatency = 48;
    }

    // Dynamic latency adjustment based on advanced detection
    let calculatedLatency = detectionLevel === 'advanced' 
      ? Math.round(baseLatency * 1.5) 
      : baseLatency;

    return { planName, hardware, speed, price, priceSub, ctaText, desc, latency: calculatedLatency };
  };

  const specs = getSpecs();

  // Draw simulated system scanning line
  const [scanPoints, setScanPoints] = useState([]);
  useEffect(() => {
    const interval = setInterval(() => {
      const base = specs.latency * 0.45;
      const points = Array.from({ length: 18 }, () => {
        return Math.floor(base + Math.random() * 8 - 4);
      });
      setScanPoints(points);
    }, 180);
    return () => clearInterval(interval);
  }, [specs.latency]);

  const svgPath = scanPoints.length > 0
    ? `M 0 30 ` + scanPoints.map((p, i) => `L ${(i / 17) * 260} ${Math.max(5, Math.min(55, 30 - p))}`).join(' ')
    : 'M 0 30 L 260 30';

  return (
    <section className="pricing-section" style={{ position: 'relative', overflow: 'hidden', padding: '10vh 0', backgroundColor: '#000' }}>
      
      {/* Background soft red glow */}
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none', zIndex: 0 }}>
        <div style={{ position: 'absolute', top: '10%', left: '50%', transform: 'translate(-50%, 0)', width: '60vw', height: '60vw', background: 'radial-gradient(circle, rgba(239, 68, 68, 0.02) 0%, transparent 70%)', filter: 'blur(100px)' }} />
      </div>

      <div className="container" style={{ position: 'relative', zIndex: 1, maxWidth: '1200px', margin: '0 auto', padding: '0 2rem' }}>
        
        {/* Title block */}
        <div style={{ textAlign: 'center', marginBottom: '4.5rem' }}>
          <span style={{ fontSize: '0.75rem', fontFamily: 'monospace', color: '#ef4444', letterSpacing: '3px', textTransform: 'uppercase', display: 'block', marginBottom: '0.8rem', fontWeight: 'bold' }}>
            SIMULADOR DE LICENCIA Y REQUISITOS
          </span>
          <h2 className="poetic-title-huge" style={{ fontSize: '3.6rem', lineHeight: 1.1, marginBottom: '1.2rem', color: '#fff' }}>
            Encuentra tu plan ideal.<br />
            <span style={{ color: '#737373', fontStyle: 'italic' }}>Fácil, local y sin cuotas mensuales.</span>
          </h2>
          <p style={{ color: '#a3a3a3', fontSize: '1.1rem', maxWidth: '650px', margin: '0 auto', lineHeight: 1.6 }}>
            Ajusta los controles según el tamaño de tu propiedad para calcular el hardware recomendado y obtener tu licencia de pago único.
          </p>
        </div>

        {/* 2-Column Responsive Layout */}
        <div className="setup-planner-grid" style={{ display: 'grid', gridTemplateColumns: '1.1fr 0.9fr', gap: '3rem', alignItems: 'stretch' }}>
          
          {/* LEFT COLUMN: Simplified UI Sliders & Options */}
          <div style={{ background: 'rgba(5, 5, 8, 0.85)', border: '1px solid rgba(255, 255, 255, 0.05)', borderRadius: '24px', padding: '2.5rem 2.2rem', backdropFilter: 'blur(15px)', display: 'flex', flexDirection: 'column', gap: '2.2rem' }}>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '1.2rem' }}>
              <Sliders size={18} color="#ef4444" />
              <span style={{ fontFamily: 'monospace', fontSize: '0.8rem', letterSpacing: '2px', color: '#fff', fontWeight: 'bold' }}>
                CONFIGURA TU PROPIEDAD
              </span>
            </div>

            {/* Slider: Camera quantity */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.8rem', alignItems: 'baseline' }}>
                <label style={{ color: '#fff', fontSize: '0.95rem', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Server size={15} color="#ef4444" /> Número de cámaras:
                </label>
                <span style={{ fontFamily: 'monospace', fontSize: '1.4rem', fontWeight: 'bold', color: '#ef4444' }}>
                  {cameras} {cameras === 1 ? 'Cámara' : 'Cámaras'}
                </span>
              </div>
              <input 
                type="range" 
                min="1" 
                max="16" 
                value={cameras}
                onChange={(e) => {
                  setCameras(parseInt(e.target.value));
                  triggerSound(600 + (parseInt(e.target.value) * 30), 0.015);
                }}
                className="custom-range-slider"
                style={{
                  width: '100%',
                  height: '4px',
                  borderRadius: '2px',
                  background: 'rgba(255, 255, 255, 0.12)',
                  outline: 'none',
                  cursor: 'pointer',
                  appearance: 'none',
                  accentColor: '#ef4444'
                }}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.5rem', fontSize: '0.68rem', fontFamily: 'monospace', color: '#525252' }}>
                <span>01 CÁMARA (MIN)</span>
                <span>08 CÁMARAS</span>
                <span>16 CÁMARAS (MAX)</span>
              </div>
            </div>

            {/* Selector: Detection level */}
            <div>
              <label style={{ color: '#fff', fontSize: '0.95rem', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '0.8rem' }}>
                <Cpu size={15} color="#ef4444" /> Nivel de Inteligencia (IA):
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <button 
                  onClick={() => {
                    setDetectionLevel('standard');
                    triggerSound(800, 0.02);
                  }}
                  style={{
                    background: detectionLevel === 'standard' ? 'rgba(239, 68, 68, 0.08)' : 'rgba(255,255,255,0.02)',
                    border: detectionLevel === 'standard' ? '1px solid #ef4444' : '1px solid rgba(255,255,255,0.06)',
                    borderRadius: '12px',
                    padding: '1.2rem',
                    textAlign: 'left',
                    color: detectionLevel === 'standard' ? '#fff' : '#a3a3a3',
                    transition: 'all 0.3s ease',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '4px',
                    cursor: 'pointer'
                  }}
                >
                  <span style={{ fontSize: '0.8rem', fontWeight: 'bold', fontFamily: 'monospace', color: detectionLevel === 'standard' ? '#ef4444' : '#737373' }}>
                    Detección Estándar
                  </span>
                  <span style={{ fontSize: '0.72rem', color: '#737373', lineHeight: 1.4 }}>
                    Detecta personas, vehículos y mascotas al instante. Muy liviano.
                  </span>
                </button>

                <button 
                  onClick={() => {
                    setDetectionLevel('advanced');
                    triggerSound(1000, 0.02);
                  }}
                  style={{
                    background: detectionLevel === 'advanced' ? 'rgba(239, 68, 68, 0.08)' : 'rgba(255,255,255,0.02)',
                    border: detectionLevel === 'advanced' ? '1px solid #ef4444' : '1px solid rgba(255,255,255,0.06)',
                    borderRadius: '12px',
                    padding: '1.2rem',
                    textAlign: 'left',
                    color: detectionLevel === 'advanced' ? '#fff' : '#a3a3a3',
                    transition: 'all 0.3s ease',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '4px',
                    cursor: 'pointer'
                  }}
                >
                  <span style={{ fontSize: '0.8rem', fontWeight: 'bold', fontFamily: 'monospace', color: detectionLevel === 'advanced' ? '#ef4444' : '#737373' }}>
                    Detección Avanzada
                  </span>
                  <span style={{ fontSize: '0.72rem', color: '#737373', lineHeight: 1.4 }}>
                    Reconocimiento facial y configuración de zonas prohibidas.
                  </span>
                </button>
              </div>
            </div>

            {/* Selector: Alert options */}
            <div>
              <label style={{ color: '#fff', fontSize: '0.95rem', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '0.8rem' }}>
                <BellRing size={15} color="#ef4444" /> Almacenamiento y Alertas:
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <button 
                  onClick={() => {
                    setAlertType('local');
                    triggerSound(800, 0.02);
                  }}
                  style={{
                    background: alertType === 'local' ? 'rgba(239, 68, 68, 0.08)' : 'rgba(255,255,255,0.02)',
                    border: alertType === 'local' ? '1px solid #ef4444' : '1px solid rgba(255,255,255,0.06)',
                    borderRadius: '12px',
                    padding: '1.2rem',
                    textAlign: 'left',
                    color: alertType === 'local' ? '#fff' : '#a3a3a3',
                    transition: 'all 0.3s ease',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '4px',
                    cursor: 'pointer'
                  }}
                >
                  <span style={{ fontSize: '0.8rem', fontWeight: 'bold', fontFamily: 'monospace', color: alertType === 'local' ? '#ef4444' : '#737373' }}>
                    Solo Guardado Local
                  </span>
                  <span style={{ fontSize: '0.72rem', color: '#737373', lineHeight: 1.4 }}>
                    El video de incidentes se almacena solo en el disco de tu PC.
                  </span>
                </button>

                <button 
                  onClick={() => {
                    setAlertType('telegram');
                    triggerSound(1000, 0.02);
                  }}
                  style={{
                    background: alertType === 'telegram' ? 'rgba(239, 68, 68, 0.08)' : 'rgba(255,255,255,0.02)',
                    border: alertType === 'telegram' ? '1px solid #ef4444' : '1px solid rgba(255,255,255,0.06)',
                    borderRadius: '12px',
                    padding: '1.2rem',
                    textAlign: 'left',
                    color: alertType === 'telegram' ? '#fff' : '#a3a3a3',
                    transition: 'all 0.3s ease',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '4px',
                    cursor: 'pointer'
                  }}
                >
                  <span style={{ fontSize: '0.8rem', fontWeight: 'bold', fontFamily: 'monospace', color: alertType === 'telegram' ? '#ef4444' : '#737373' }}>
                    Alertas a tu Móvil
                  </span>
                  <span style={{ fontSize: '0.72rem', color: '#737373', lineHeight: 1.4 }}>
                    Envío instantáneo de clips de video cifrados a tu Telegram.
                  </span>
                </button>
              </div>
            </div>

          </div>

          {/* RIGHT COLUMN: Holographic Plan Spec Sheet */}
          <div style={{ background: 'rgba(4, 4, 6, 0.95)', border: '1px solid rgba(239, 68, 68, 0.15)', borderRadius: '24px', padding: '3rem 2.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', position: 'relative', overflow: 'hidden' }}>
            
            {/* Corner details */}
            <div style={{ position: 'absolute', top: 0, right: 0, width: '40px', height: '40px', borderRight: '1px solid rgba(239, 68, 68, 0.35)', borderTop: '1px solid rgba(239, 68, 68, 0.35)' }} />
            <div style={{ position: 'absolute', bottom: 0, left: 0, width: '40px', height: '40px', borderLeft: '1px solid rgba(239, 68, 68, 0.35)', borderBottom: '1px solid rgba(239, 68, 68, 0.35)' }} />

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(239, 68, 68, 0.15)', paddingBottom: '1.2rem', marginBottom: '2rem' }}>
                <span style={{ fontFamily: 'monospace', fontSize: '0.8rem', letterSpacing: '2px', color: '#ef4444', fontWeight: 'bold' }}>
                  DIAGNÓSTICO DEL SISTEMA
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.62rem', fontFamily: 'monospace', color: '#22c55e', fontWeight: 'bold' }}>
                  <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#22c55e', animation: 'pulse-dot 2s infinite' }} /> 100% LOCAL
                </span>
              </div>

              {/* Dynamic plan highlight */}
              <div style={{ marginBottom: '2rem' }}>
                <span style={{ fontSize: '0.65rem', fontFamily: 'monospace', color: '#737373', display: 'block', marginBottom: '4px' }}>
                  PLAN SELECCIONADO
                </span>
                <h3 style={{ fontSize: '1.8rem', fontWeight: 'bold', color: '#fff', margin: 0 }}>
                  {specs.planName}
                </h3>
                <p style={{ color: '#a3a3a3', fontSize: '0.85rem', marginTop: '6px', lineHeight: 1.4 }}>
                  {specs.desc}
                </p>
              </div>

              {/* Specs Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.6rem', marginBottom: '2.5rem' }}>
                <div>
                  <span style={{ fontSize: '0.65rem', fontFamily: 'monospace', color: '#737373', display: 'block', marginBottom: '4px' }}>
                    PC MÍNIMA RECOMENDADA
                  </span>
                  <span style={{ fontSize: '0.9rem', fontWeight: 'bold', color: '#fff', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Cpu size={14} color="#ef4444" /> {specs.hardware}
                  </span>
                </div>

                <div>
                  <span style={{ fontSize: '0.65rem', fontFamily: 'monospace', color: '#737373', display: 'block', marginBottom: '4px' }}>
                    TIEMPO DE RESPUESTA
                  </span>
                  <span style={{ fontSize: '0.9rem', fontWeight: 'bold', color: '#fff', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Zap size={14} color="#22c55e" /> {specs.speed}
                  </span>
                </div>

                <div>
                  <span style={{ fontSize: '0.65rem', fontFamily: 'monospace', color: '#737373', display: 'block', marginBottom: '4px' }}>
                    PRIVACIDAD DE IMAGEN
                  </span>
                  <span style={{ fontSize: '0.9rem', fontWeight: 'bold', color: '#22c55e', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <ShieldCheck size={14} /> 100% Privada (Sin Nube)
                  </span>
                </div>

                <div>
                  <span style={{ fontSize: '0.65rem', fontFamily: 'monospace', color: '#737373', display: 'block', marginBottom: '4px' }}>
                    ALERTAS CONFIGURADAS
                  </span>
                  <span style={{ fontSize: '0.9rem', fontWeight: 'bold', color: '#fff', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <BellRing size={14} color="#ef4444" /> {alertType === 'telegram' ? 'SMS / Telegram Activo' : 'Guardado Local en PC'}
                  </span>
                </div>
              </div>

              {/* Dynamic Oscilloscope wave */}
              <div style={{ background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(239, 68, 68, 0.1)', borderRadius: '12px', padding: '16px', position: 'relative', marginBottom: '2.5rem' }}>
                <span style={{ position: 'absolute', top: '8px', left: '12px', fontSize: '0.58rem', fontFamily: 'monospace', color: 'rgba(239,68,68,0.5)' }}>
                  PULSO DE VIGILANCIA EN VIVO (NEURAL SCAN)
                </span>
                <svg width="100%" height="60" viewBox="0 0 260 60" style={{ display: 'block', marginTop: '10px', overflow: 'visible' }}>
                  <line x1="0" y1="30" x2="260" y2="30" stroke="rgba(239, 68, 68, 0.05)" strokeDasharray="3 3" />
                  <path d={svgPath} fill="none" stroke="#ef4444" strokeWidth="1.2" style={{ transition: 'd 0.15s ease' }} />
                  <path d={svgPath} fill="none" stroke="#ef4444" strokeWidth="3" opacity="0.15" style={{ filter: 'blur(1.5px)', transition: 'd 0.15s ease' }} />
                </svg>
              </div>
            </div>

            {/* Price Block & Action Button */}
            <div>
              <div style={{ borderTop: '1px solid rgba(239, 68, 68, 0.15)', paddingTop: '1.8rem', marginBottom: '1.8rem' }}>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
                  <span style={{ fontSize: '2.6rem', fontWeight: 800, color: '#fff', fontFamily: 'var(--font-sans)', letterSpacing: '-0.03em', lineHeight: 1 }}>
                    {specs.price}
                  </span>
                  {specs.price !== "Gratis" && (
                    <span style={{ fontSize: '0.85rem', color: '#737373', fontFamily: 'monospace' }}>
                      (Pago Único)
                    </span>
                  )}
                </div>
                <span style={{ color: '#ef4444', fontSize: '0.78rem', fontWeight: 'bold', display: 'block', marginTop: '6px', letterSpacing: '0.05em', fontFamily: 'monospace' }}>
                  {specs.priceSub}
                </span>
              </div>

              <motion.button
                onClick={() => triggerSound(1100, 0.06)}
                className="btn-minimal"
                style={{
                  width: '100%',
                  background: 'linear-gradient(135deg, #ef4444 0%, #7f1d1d 100%)',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  color: '#fff',
                  borderRadius: '12px',
                  padding: '1.1rem',
                  fontWeight: 'bold',
                  fontSize: '0.8rem',
                  letterSpacing: '0.08em',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  cursor: 'pointer'
                }}
                whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
                whileTap={{ scale: 0.98 }}
              >
                {specs.ctaText} <ChevronRight size={14} />
              </motion.button>
            </div>

          </div>

        </div>

        {/* Footer Note */}
        <p style={{ textAlign: 'center', color: '#525252', fontSize: '0.72rem', marginTop: '3.5rem', fontFamily: 'monospace', letterSpacing: '1px' }}>
          * Las licencias son de un único pago perpetuo. Incluye actualizaciones gratuitas de inteligencia artificial para tu PC.
        </p>

      </div>
    </section>
  );
}
