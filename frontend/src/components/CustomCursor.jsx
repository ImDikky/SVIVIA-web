import React, { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

/**
 * CustomCursor — CONTEXTUAL BADGE CURSOR
 * 
 * Replaces the global cursor trail with a contextual action badge.
 * The default browser pointer is preserved everywhere to ensure usability,
 * and this indicator only fades in near the cursor when hovering over
 * specific interactive components that define a `data-cursor` attribute.
 */
export default function CustomCursor() {
  const [cursorText, setCursorText] = useState('');
  const [isActive, setIsActive] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  
  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);

  useEffect(() => {
    const isTouch = window.matchMedia('(pointer: coarse)').matches;
    setIsTouchDevice(isTouch);
  }, []);

  // Soft spring config for smooth trailing motion
  const springConfig = { damping: 30, stiffness: 300 };
  const cursorX = useSpring(mouseX, springConfig);
  const cursorY = useSpring(mouseY, springConfig);

  useEffect(() => {
    if (isTouchDevice) return;

    const moveMouse = (e) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };

    const handleMouseOver = (e) => {
      const target = e.target;
      if (!target) return;
      
      // Look for any ancestor holding the data-cursor attribute
      const cursorTarget = target.closest('[data-cursor]');
      if (cursorTarget) {
        setCursorText(cursorTarget.getAttribute('data-cursor'));
        setIsActive(true);
      } else {
        setIsActive(false);
      }
    };

    window.addEventListener('mousemove', moveMouse, { passive: true });
    window.addEventListener('mouseover', handleMouseOver, { passive: true });

    return () => {
      window.removeEventListener('mousemove', moveMouse);
      window.removeEventListener('mouseover', handleMouseOver);
    };
  }, [mouseX, mouseY, isTouchDevice]);

  if (isTouchDevice) return null;

  return (
    <motion.div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        x: cursorX,
        y: cursorY,
        translateX: '-50%',
        translateY: '-50%',
        pointerEvents: 'none',
        zIndex: 99999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        opacity: isActive ? 1 : 0,
        scale: isActive ? 1 : 0.6,
      }}
      transition={{ type: 'spring', damping: 20, stiffness: 200 }}
    >
      <div
        style={{
          background: 'rgba(8, 10, 15, 0.88)',
          border: '1px solid rgba(239, 68, 68, 0.45)',
          color: '#fff',
          fontFamily: 'monospace',
          fontSize: '0.62rem',
          fontWeight: 'bold',
          letterSpacing: '0.15em',
          padding: '6px 14px',
          borderRadius: '20px',
          whiteSpace: 'nowrap',
          backdropFilter: 'blur(10px)',
          boxShadow: '0 8px 20px rgba(0, 0, 0, 0.45)',
        }}
      >
        {cursorText}
      </div>
    </motion.div>
  );
}
