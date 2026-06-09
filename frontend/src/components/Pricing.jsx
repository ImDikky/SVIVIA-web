import React from 'react';
import { motion } from 'framer-motion';
import { 
  Cpu, Shield, ShieldCheck, Server, HardDrive, ChevronRight
} from 'lucide-react';

const PLANS = [
  {
    id: 'community',
    name: 'Community',
    price: '$0',
    priceSub: 'Licencia Gratuita',
    desc: 'Prueba la plataforma local y monitorea el punto de acceso principal.',
    features: [
      '1 Cámara activa',
      'Inferencia YOLOv8 estándar',
      'Registro de eventos local (SQLite)',
      'Actualizaciones comunitarias gratis'
    ],
    ctaText: 'DESCARGAR GRATIS',
    popular: false,
    icon: Shield
  },
  {
    id: 'personal',
    name: 'Personal',
    price: '$39',
    priceSub: 'Pago Único Perpetuo',
    desc: 'Monitoreo inteligente residencial y para oficinas domésticas.',
    features: [
      'Hasta 4 Cámaras activas',
      'Alertas instantáneas y clips a Telegram',
      'Filtros avanzados de falsas alarmas',
      'Soporte comunitario prioritario'
    ],
    ctaText: 'ADQUIRIR LICENCIA',
    popular: false,
    icon: HardDrive
  },
  {
    id: 'professional',
    name: 'Profesional',
    price: '$79',
    priceSub: 'Pago Único Perpetuo',
    desc: 'Vigilancia avanzada para locales comerciales, pymes y oficinas medianas.',
    features: [
      'Hasta 8 Cámaras activas',
      'Reconocimiento facial e IA de perímetros',
      'Consola de control y estadísticas avanzadas',
      'Soporte técnico por correo directo'
    ],
    ctaText: 'ADQUIRIR LICENCIA',
    popular: true, // Recommended/Popular plan
    icon: Cpu
  },
  {
    id: 'corporativo',
    name: 'Corporativo',
    price: '$199',
    priceSub: 'Pago Único Perpetuo',
    desc: 'Infraestructura de seguridad robusta para almacenes y corporativos.',
    features: [
      'Cámaras ilimitadas (según hardware)',
      'Soporte multi-servidor y redundancia local',
      'Integración con alarmas físicas y APIs',
      'Soporte corporativo prioritario 24/7'
    ],
    ctaText: 'ADQUIRIR LICENCIA',
    popular: false,
    icon: Server
  }
];

export default function Pricing() {
  // Trigger global tactile beep on interaction
  const triggerSound = (freq = 900, dur = 0.02) => {
    if (window.playTactileClick) {
      try {
        window.playTactileClick(freq, dur, 'sine', 0.12);
      } catch (e) {}
    }
  };

  return (
    <section className="pricing-section" style={{ position: 'relative', overflow: 'hidden', padding: '12vh 0', backgroundColor: '#000' }}>
      
      {/* Background soft red glow */}
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none', zIndex: 0 }}>
        <div style={{ position: 'absolute', top: '20%', left: '50%', transform: 'translate(-50%, -50%)', width: '70vw', height: '70vw', background: 'radial-gradient(circle, rgba(239, 68, 68, 0.03) 0%, transparent 60%)', filter: 'blur(120px)' }} />
      </div>

      <div className="container" style={{ position: 'relative', zIndex: 1, maxWidth: '1400px', margin: '0 auto', padding: '0 2rem' }}>
        
        {/* Title block */}
        <div style={{ textAlign: 'center', marginBottom: '5.5rem' }}>
          <span style={{ fontSize: '0.72rem', fontFamily: 'monospace', color: '#ef4444', letterSpacing: '3px', textTransform: 'uppercase', display: 'block', marginBottom: '0.8rem', fontWeight: 'bold' }}>
            // MODELO DE LICENCIAMIENTO
          </span>
          <h2 className="poetic-title-huge" style={{ fontSize: '3.6rem', lineHeight: 1.1, marginBottom: '1.2rem', color: '#fff', textTransform: 'uppercase' }}>
            Licencia local perpetua.<br />
            <span style={{ color: '#737373', fontStyle: 'italic', textTransform: 'none' }}>Sin cuotas. Sin nube. Privacidad total.</span>
          </h2>
          <p style={{ color: '#a3a3a3', fontSize: '1.1rem', maxWidth: '650px', margin: '0 auto', lineHeight: 1.6, fontFamily: 'var(--font-sans)' }}>
            Nuestra software se ejecuta 100% en tu propio hardware local. Paga una sola vez por la licencia y olvídate de las suscripciones mensuales para siempre.
          </p>
        </div>

        {/* Responsive Pricing Grid */}
        <div className="pricing-grid">
          {PLANS.map((plan) => {
            const IconComponent = plan.icon;
            return (
              <motion.div
                key={plan.id}
                onClick={() => triggerSound(900 + (plan.id === 'professional' ? 200 : 0), 0.02)}
                whileHover={{ 
                  y: -8, 
                  borderColor: plan.popular ? '#ef4444' : 'rgba(255, 255, 255, 0.15)',
                  boxShadow: plan.popular 
                    ? '0 20px 40px rgba(239, 68, 68, 0.15)' 
                    : '0 20px 40px rgba(255, 255, 255, 0.03)'
                }}
                transition={{ type: 'spring', stiffness: 350, damping: 25 }}
                style={{
                  background: 'rgba(5, 5, 8, 0.65)',
                  border: plan.popular ? '1px solid rgba(239, 68, 68, 0.35)' : '1px solid rgba(255, 255, 255, 0.06)',
                  borderRadius: '20px',
                  padding: '2.5rem 2rem',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  backdropFilter: 'blur(20px)',
                  WebkitBackdropFilter: 'blur(20px)',
                  position: 'relative',
                  overflow: 'hidden',
                  cursor: 'pointer',
                  transition: 'border-color 0.3s ease, box-shadow 0.3s ease'
                }}
              >
                {/* Popular Badge */}
                {plan.popular && (
                  <div style={{
                    position: 'absolute',
                    top: 0,
                    right: 0,
                    background: '#ef4444',
                    color: '#000',
                    fontFamily: 'monospace',
                    fontSize: '9px',
                    fontWeight: 'bold',
                    padding: '6px 14px',
                    borderBottomLeftRadius: '12px',
                    letterSpacing: '1.5px',
                    textTransform: 'uppercase',
                    zIndex: 2
                  }}>
                    RECOMENDADO
                  </div>
                )}

                {/* Popular Subtle Glow Gradient */}
                {plan.popular && (
                  <div style={{
                    position: 'absolute',
                    top: '-50%',
                    left: '-50%',
                    width: '200%',
                    height: '200%',
                    background: 'radial-gradient(circle, rgba(239, 68, 68, 0.04) 0%, transparent 65%)',
                    pointerEvents: 'none',
                    zIndex: 0
                  }} />
                )}

                <div style={{ position: 'relative', zIndex: 1 }}>
                  {/* Icon & Plan Name */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '1.5rem' }}>
                    <div style={{
                      width: '42px',
                      height: '42px',
                      borderRadius: '10px',
                      background: plan.popular ? 'rgba(239, 68, 68, 0.1)' : 'rgba(255, 255, 255, 0.02)',
                      border: plan.popular ? '1px solid rgba(239, 68, 68, 0.25)' : '1px solid rgba(255, 255, 255, 0.08)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <IconComponent size={20} color={plan.popular ? '#ef4444' : '#a3a3a3'} />
                    </div>
                    <div>
                      <h3 style={{ 
                        fontSize: '1.4rem', 
                        fontWeight: '700', 
                        color: '#fff', 
                        margin: 0,
                        letterSpacing: '-0.01em',
                        fontFamily: 'var(--font-sans)'
                      }}>
                        {plan.name}
                      </h3>
                      <span style={{ 
                        fontSize: '0.75rem', 
                        fontFamily: 'monospace', 
                        color: plan.popular ? '#ef4444' : '#737373',
                        letterSpacing: '1px',
                        textTransform: 'uppercase'
                      }}>
                        {plan.priceSub}
                      </span>
                    </div>
                  </div>

                  {/* Description */}
                  <p style={{ 
                    color: '#a3a3a3', 
                    fontSize: '0.88rem', 
                    lineHeight: '1.5', 
                    marginBottom: '2rem',
                    minHeight: '44px',
                    fontFamily: 'var(--font-sans)',
                    fontWeight: '300'
                  }}>
                    {plan.desc}
                  </p>

                  {/* Price */}
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px', marginBottom: '2rem' }}>
                    <span style={{ 
                      fontSize: '3rem', 
                      fontWeight: '800', 
                      color: '#fff',
                      fontFamily: 'var(--font-sans)',
                      letterSpacing: '-0.04em'
                    }}>
                      {plan.price}
                    </span>
                    <span style={{ 
                      fontSize: '0.8rem', 
                      color: '#525252', 
                      fontFamily: 'monospace',
                      textTransform: 'uppercase'
                    }}>
                      USD
                    </span>
                  </div>

                  {/* Separator */}
                  <div style={{ height: '1px', background: 'rgba(255, 255, 255, 0.06)', margin: '2rem 0' }} />

                  {/* Features List */}
                  <ul style={{ 
                    listStyle: 'none', 
                    padding: 0, 
                    margin: '0 0 2.5rem 0', 
                    display: 'flex', 
                    flexDirection: 'column', 
                    gap: '12px' 
                  }}>
                    {plan.features.map((feature, idx) => (
                      <li key={idx} style={{ 
                        display: 'flex', 
                        alignItems: 'flex-start', 
                        gap: '10px',
                        fontSize: '0.85rem',
                        color: '#d4d4d4',
                        lineHeight: '1.4',
                        fontFamily: 'var(--font-sans)'
                      }}>
                        <ShieldCheck size={14} color="#ef4444" style={{ marginTop: '3px', flexShrink: 0 }} />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* CTA Button */}
                <motion.button
                  onClick={(e) => {
                    e.stopPropagation();
                    triggerSound(1100, 0.05);
                  }}
                  whileTap={{ scale: 0.97 }}
                  style={{
                    width: '100%',
                    background: plan.popular 
                      ? 'linear-gradient(135deg, #ef4444 0%, #991b1b 100%)' 
                      : 'rgba(255, 255, 255, 0.03)',
                    border: plan.popular 
                      ? '1px solid rgba(255, 255, 255, 0.15)' 
                      : '1px solid rgba(255, 255, 255, 0.08)',
                    color: '#fff',
                    borderRadius: '10px',
                    padding: '0.95rem',
                    fontWeight: '600',
                    fontSize: '0.78rem',
                    letterSpacing: '0.06em',
                    fontFamily: 'monospace',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                    cursor: 'pointer',
                    position: 'relative',
                    zIndex: 1,
                    transition: 'background 0.3s, border-color 0.3s'
                  }}
                  className="plan-cta-btn"
                >
                  {plan.ctaText} <ChevronRight size={13} />
                </motion.button>
              </motion.div>
            );
          })}
        </div>

        {/* Footer Note */}
        <p style={{ textAlign: 'center', color: '#525252', fontSize: '0.72rem', marginTop: '4rem', fontFamily: 'monospace', letterSpacing: '1px' }}>
          * Las licencias adquiridas son permanentes y vinculadas a la firma de tu hardware local. Incluye soporte técnico y actualizaciones de modelos de IA gratis.
        </p>

      </div>

      {/* Grid specific CSS style block */}
      <style>{`
        .pricing-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 1.5rem;
          margin-top: 2rem;
        }
        @media (max-width: 1200px) {
          .pricing-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 1.5rem;
          }
        }
        @media (max-width: 680px) {
          .pricing-grid {
            grid-template-columns: 1fr;
            gap: 1.5rem;
          }
        }
        .plan-cta-btn:hover {
          background: linear-gradient(135deg, #f87171 0%, #b91c1c 100%) !important;
          border-color: rgba(255, 255, 255, 0.3) !important;
        }
        .pricing-grid > div:not(.popular):hover .plan-cta-btn {
          background: rgba(255, 255, 255, 0.07) !important;
          border-color: rgba(255, 255, 255, 0.15) !important;
        }
      `}</style>
    </section>
  );
}
