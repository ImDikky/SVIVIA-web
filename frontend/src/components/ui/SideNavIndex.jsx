import React, { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useSpring, useTransform } from 'framer-motion';

const SECTIONS = [
  { id: 'hero', name: 'INICIO', num: '01' },
  { id: 'monologue', name: 'FILTRO', num: '02' },
  { id: 'robot', name: 'CONEXIÓN', num: '03' },
  { id: 'features', name: 'DETECCIÓN', num: '04' },
  { id: 'tunnel', name: 'PRIVACIDAD', num: '05' },
  { id: 'showcase', name: 'OPERACIÓN', num: '06' },
  { id: 'dashboard', name: 'TELEMETRÍA', num: '07' },
  { id: 'pricing', name: 'CALCULADOR', num: '08' },
  { id: 'download', name: 'DESCARGAR', num: '09' }
];

export default function SideNavIndex() {
  const [activeSection, setActiveSection] = useState('hero');
  const [hoveredIndex, setHoveredIndex] = useState(null);

  // Global scroll progress for the indicator bar
  const { scrollYProgress } = useScroll();
  const scaleY = useSpring(scrollYProgress, { stiffness: 80, damping: 20 });

  useEffect(() => {
    const observerOptions = {
      root: null,
      // Target the middle-upper part of the screen to change active indicator
      rootMargin: '-20% 0px -40% 0px',
      threshold: 0.05
    };

    const handleIntersection = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    };

    const observer = new IntersectionObserver(handleIntersection, observerOptions);

    SECTIONS.forEach((section) => {
      const el = document.getElementById(section.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const handleScrollTo = (id) => {
    // Beep sound
    if (window.playTactileClick) {
      try {
        window.playTactileClick(750, 0.02, 'sine', 0.1);
      } catch (e) {}
    }

    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div 
      className="side-nav-index-root"
      style={{
        position: 'fixed',
        right: '2.5vw',
        top: '50%',
        transform: 'translateY(-50%)',
        zIndex: 9000,
        display: 'flex',
        flexDirection: 'row-reverse',
        alignItems: 'center',
        gap: '12px',
        pointerEvents: 'auto',
      }}
    >
      {/* 1px Vertical Progress Baseline & Active Bar */}
      <div 
        style={{
          width: '1px',
          height: '240px',
          background: 'rgba(255, 255, 255, 0.08)',
          position: 'relative',
          display: 'flex',
          justifyContent: 'center'
        }}
      >
        <motion.div 
          style={{
            position: 'absolute',
            top: 0,
            width: '1px',
            height: '100%',
            background: '#ef4444',
            scaleY,
            transformOrigin: 'top center',
            boxShadow: '0 0 8px rgba(239, 68, 68, 0.4)'
          }}
        />
      </div>

      {/* Dots and Labels Container */}
      <div 
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          height: '240px',
          padding: '4px 0',
          alignItems: 'flex-end'
        }}
      >
        {SECTIONS.map((sec, idx) => {
          const isActive = activeSection === sec.id;
          const isHovered = hoveredIndex === idx;
          
          return (
            <div 
              key={sec.id}
              onMouseEnter={() => setHoveredIndex(idx)}
              onMouseLeave={() => setHoveredIndex(null)}
              onClick={() => handleScrollTo(sec.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                cursor: 'pointer',
                height: '18px',
                position: 'relative'
              }}
            >
              {/* Mono Label (Revealed on hover or when active) */}
              <motion.span
                initial={{ opacity: 0, x: 10, filter: 'blur(2px)' }}
                animate={{
                  opacity: (isHovered || isActive) ? 1 : 0,
                  x: (isHovered || isActive) ? 0 : 10,
                  filter: (isHovered || isActive) ? 'blur(0px)' : 'blur(2px)'
                }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
                style={{
                  fontFamily: 'monospace',
                  fontSize: '0.62rem',
                  fontWeight: isActive ? 'bold' : 'normal',
                  color: isActive ? '#ef4444' : 'rgba(255, 255, 255, 0.45)',
                  letterSpacing: '1px',
                  pointerEvents: 'none',
                  whiteSpace: 'nowrap'
                }}
              >
                {sec.num} // {sec.name}
              </motion.span>

              {/* Tock/Dot */}
              <div 
                style={{
                  width: '16px',
                  height: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  position: 'relative'
                }}
              >
                <motion.div
                  animate={{
                    scale: isActive ? 1.35 : (isHovered ? 1.15 : 1),
                    backgroundColor: isActive ? '#ef4444' : 'rgba(255, 255, 255, 0.22)'
                  }}
                  transition={{ duration: 0.25 }}
                  style={{
                    width: '5px',
                    height: '5px',
                    borderRadius: '50%',
                    boxShadow: isActive ? '0 0 6px #ef4444' : 'none'
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
