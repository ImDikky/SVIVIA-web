import React, { useEffect, useState, useRef } from 'react';
import { motion, useScroll, useSpring, useTransform } from 'framer-motion';
import { useLenis } from 'lenis/react';

export default function CustomScrollbar() {
  const { scrollYProgress } = useScroll();
  const lenis = useLenis();
  
  // Smooth scroll progress for the thumb's movement
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 90,
    damping: 24,
    restDelta: 0.001
  });
  
  const [scrollPercent, setScrollPercent] = useState(0);
  const [currentY, setCurrentY] = useState(0);
  
  useEffect(() => {
    const unsubscribe = scrollYProgress.on("change", (v) => {
      setScrollPercent(Math.round(v * 100));
      setCurrentY(Math.round(window.scrollY));
    });
    return () => unsubscribe();
  }, [scrollYProgress]);
  
  // Track reference and drag states
  const trackRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);

  const handlePointerDown = (e) => {
    setIsDragging(true);
    e.target.setPointerCapture(e.pointerId);
    handlePointerMove(e);
    
    // Play tactile sound
    if (window.playTactileClick) {
      try {
        window.playTactileClick(600, 0.015, 'sine', 0.05);
      } catch (err) {}
    }
  };

  const handlePointerMove = (e) => {
    if (!isDragging && e.type !== 'pointerdown') return;
    if (!trackRef.current) return;
    
    const rect = trackRef.current.getBoundingClientRect();
    const clickY = e.clientY - rect.top;
    const progress = Math.max(0, Math.min(1, clickY / rect.height));
    
    const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
    if (lenis) {
      lenis.scrollTo(progress * scrollHeight, { immediate: true });
    } else {
      window.scrollTo(0, progress * scrollHeight);
    }
  };

  const handlePointerUp = (e) => {
    setIsDragging(false);
    try {
      e.target.releasePointerCapture(e.pointerId);
    } catch (err) {}
  };

  // Convert scroll progress (0-1) to vertical position in track
  const thumbY = useTransform(smoothProgress, [0, 1], ["0%", "calc(100% - 40px)"]);

  return (
    <div 
      className="custom-scrollbar-root"
      style={{
        position: 'fixed',
        right: '6px',
        top: '70px',
        bottom: '70px',
        width: '28px',
        zIndex: 99999,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        pointerEvents: 'none',
        userSelect: 'none'
      }}
    >
      {/* Top HUD text */}
      <span style={{
        fontFamily: 'monospace',
        fontSize: '7px',
        color: 'rgba(255, 255, 255, 0.25)',
        marginBottom: '8px',
        letterSpacing: '1px',
        transform: 'rotate(-90deg) translate(-4px, 0)',
        whiteSpace: 'nowrap'
      }}>
        GRID_POS
      </span>

      {/* Track (clickable) */}
      <div 
        ref={trackRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        style={{
          flex: 1,
          width: '100%',
          display: 'flex',
          justifyContent: 'center',
          cursor: 'ns-resize',
          pointerEvents: 'auto',
          position: 'relative',
        }}
      >
        {/* Track Line */}
        <div style={{
          width: '1px',
          height: '100%',
          background: 'rgba(255, 255, 255, 0.04)',
          position: 'absolute',
          left: '50%',
          transform: 'translateX(-50%)',
        }} />

        {/* Glow progress trace */}
        <motion.div 
          style={{
            width: '1px',
            background: 'linear-gradient(to bottom, transparent, #ef4444)',
            position: 'absolute',
            left: '50%',
            transform: 'translateX(-50%)',
            top: 0,
            bottom: 0,
            scaleY: scrollYProgress,
            transformOrigin: 'top center',
            opacity: 0.18
          }}
        />

        {/* Grab Thumb */}
        <motion.div
          style={{
            position: 'absolute',
            width: '4px',
            height: '40px',
            background: 'linear-gradient(180deg, #ef4444 0%, #991b1b 100%)',
            borderRadius: '2px',
            left: '50%',
            transform: 'translateX(-50%)',
            y: thumbY,
            boxShadow: '0 0 10px rgba(239, 68, 68, 0.8), 0 0 20px rgba(239, 68, 68, 0.25)',
            border: '1px solid rgba(255, 255, 255, 0.12)',
            cursor: isDragging ? 'grabbing' : 'grab'
          }}
          whileHover={{ width: '6px', boxShadow: '0 0 14px rgba(239, 68, 68, 1)' }}
        />
      </div>

      {/* Telemetry output */}
      <div style={{
        marginTop: '8px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '2px',
        fontFamily: 'monospace',
        fontSize: '7px',
        color: 'rgba(255, 255, 255, 0.35)',
        letterSpacing: '0.5px'
      }}>
        <span style={{ color: '#ef4444', fontWeight: 'bold' }}>{scrollPercent}%</span>
        <span>Y:{currentY}</span>
      </div>
    </div>
  );
}
