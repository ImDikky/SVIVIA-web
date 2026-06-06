import React, { useState, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Check, Zap, Shield, Building2 } from 'lucide-react';

const plans = [
  {
    id: 'personal',
    name: 'Personal',
    price: 'Gratis',
    period: '',
    description: 'Para empezar a proteger tu espacio.',
    icon: Shield,
    features: [
      '1 cámara conectada',
      'Inferencia YOLOv8 básica',
      'Alertas por Telegram',
      'Resolución hasta 1080p',
    ],
    cta: 'Descargar gratis',
    accent: 'rgba(255,255,255,0.08)',
    glow: 'rgba(255,255,255,0.05)',
    featured: false,
  },
  {
    id: 'hogar',
    name: 'Hogar',
    price: '$9',
    period: '/ mes',
    description: 'Vigilancia completa para toda tu vivienda.',
    icon: Zap,
    features: [
      'Hasta 4 cámaras',
      'Grabación en loop continua',
      'Alertas Telegram con frames HD',
      'Dashboard analíticas en tiempo real',
      'Soporte prioritario',
    ],
    cta: 'Empezar ahora',
    accent: 'rgba(239, 68, 68, 0.16)',
    glow: 'rgba(239, 68, 68, 0.09)',
    featured: true,
    badge: 'Más popular',
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: '$29',
    period: '/ mes',
    description: 'Despliegue ilimitado para entornos profesionales.',
    icon: Building2,
    features: [
      'Cámaras ilimitadas',
      'Modelos IA personalizados',
      'API REST de integración',
      'Soporte dedicado 24/7',
      'SLA garantizado',
    ],
    cta: 'Contactar ventas',
    accent: 'rgba(29, 78, 216, 0.22)',
    glow: 'rgba(29, 78, 216, 0.14)',
    featured: false,
  },
];

function PricingCard({ plan, index }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.3 });
  const Icon = plan.icon;

  return (
    <motion.div
      ref={ref}
      className={`pricing-card ${plan.featured ? 'pricing-card--featured' : ''}`}
      style={{ '--accent': plan.accent, '--glow': plan.glow }}
      initial={{ opacity: 0, y: 80, rotateX: 18, transformOrigin: 'top center' }}
      animate={inView ? { opacity: 1, y: 0, rotateX: 0 } : {}}
      transition={{ duration: 0.9, delay: index * 0.18, ease: [0.25, 0.8, 0.25, 1] }}
      whileHover={{ y: -10, transition: { duration: 0.3, ease: 'easeOut' } }}
    >
      {plan.featured && (
        <div className="pricing-badge">
          <span className="pricing-badge-dot" />
          {plan.badge}
        </div>
      )}

      <div className="pricing-card-header">
        <div className="pricing-icon-wrap">
          <Icon size={20} strokeWidth={1.5} />
        </div>
        <h3 className="pricing-plan-name">{plan.name}</h3>
        <p className="pricing-plan-desc">{plan.description}</p>
      </div>

      <div className="pricing-price-block">
        <span className="pricing-amount">{plan.price}</span>
        {plan.period && <span className="pricing-period">{plan.period}</span>}
      </div>

      <ul className="pricing-features-list">
        {plan.features.map((f, i) => (
          <li key={i} className="pricing-feature-item">
            <Check size={14} strokeWidth={2} className="pricing-check" />
            {f}
          </li>
        ))}
      </ul>

      <motion.button
        className={`pricing-cta ${plan.featured ? 'pricing-cta--featured' : ''}`}
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
      >
        {plan.cta}
      </motion.button>
    </motion.div>
  );
}

export default function Pricing() {
  const titleRef = useRef(null);
  const titleInView = useInView(titleRef, { once: true, amount: 0.5 });

  return (
    <section id="pricing" className="pricing-section">
      {/* Fondo Aurora Mesh Gradient */}
      <div className="pricing-aurora-bg">
        <div className="aurora-blob aurora-blob-1" />
        <div className="aurora-blob aurora-blob-2" />
        <div className="aurora-blob aurora-blob-3" />
        <div className="aurora-noise" />
      </div>

      <div className="container" style={{ position: 'relative', zIndex: 2 }}>
        <motion.div
          ref={titleRef}
          className="pricing-header"
          initial={{ opacity: 0, y: 40 }}
          animate={titleInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.9 }}
        >
          <span className="pricing-eyebrow">Licencias SVIVIA</span>
          <h2 className="poetic-title-huge" style={{ fontSize: '4vw' }}>
            Elige tu nivel<br />
            <span style={{ fontStyle: 'italic', color: 'var(--text-muted)' }}>de protección.</span>
          </h2>
          <p className="poetic-subtitle" style={{ marginTop: '1rem' }}>
            Sin ataduras a la nube. Sin suscripciones ocultas.<br />
            Tu hardware, tu privacidad, tu control total.
          </p>
        </motion.div>

        <div className="pricing-grid">
          {plans.map((plan, i) => (
            <PricingCard key={plan.id} plan={plan} index={i} />
          ))}
        </div>

        <motion.p
          className="pricing-footer-note"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.5 }}
        >
          Todos los planes incluyen actualizaciones de modelo durante 12 meses · Sin tarjeta de crédito requerida para el plan gratuito
        </motion.p>
      </div>
    </section>
  );
}
