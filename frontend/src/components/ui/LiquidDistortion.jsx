import React, { useRef, useEffect } from 'react';
import { useScroll, useVelocity } from 'framer-motion';

/**
 * LiquidDistortion — HIGHLY VISIBLE & STABLE VERSION
 *
 * The SVG feTurbulence + feDisplacementMap filter is applied via a CSS class
 * directly to `.app-container` (which has actual rendered pixels).
 *
 * Behavior:
 *   - Reads scrollVelocity directly in the RAF loop using scrollVelocity.get()
 *   - Automatically maps real-time velocity to displacement scale (up to 45px)
 *   - Animates turbulence frequency only when active for organic liquid flow
 *   - Moves dynamically and stops smoothly when scrolling stops
 */
export default function LiquidDistortion() {
  const turbRef = useRef(null);
  const dispRef = useRef(null);
  const rafRef = useRef(null);
  const appContainerRef = useRef(null);

  const { scrollY } = useScroll();
  const scrollVelocity = useVelocity(scrollY);

  const currentScale = useRef(0);

  useEffect(() => {
    // Find the app-container element
    appContainerRef.current = document.querySelector('.app-container');

    const animate = () => {
      // Get current velocity from framer-motion MotionValue
      const vel = scrollVelocity.get();
      const absVel = Math.abs(vel);
      
      let target = 0;
      if (absVel > 150) { // low threshold to start distorting on gentle scrolls
        const clamped = Math.min(absVel, 2500);
        // Map 150–2500 px/s -> 0–45px displacement scale
        target = ((clamped - 150) / 2350) * 45;
      }

      // Smooth interpolation towards target scale (stiffness factor: 0.1)
      currentScale.current += (target - currentScale.current) * 0.1;

      const isActive = currentScale.current > 0.5;

      if (dispRef.current) {
        dispRef.current.setAttribute('scale', currentScale.current.toFixed(2));
      }

      // Animate turbulence for organic feel when active
      if (turbRef.current && isActive) {
        const t = performance.now() / 2000;
        const bfX = (0.006 + Math.sin(t * 1.3) * 0.002).toFixed(4);
        const bfY = (0.010 + Math.cos(t * 0.9) * 0.002).toFixed(4);
        turbRef.current.setAttribute('baseFrequency', `${bfX} ${bfY}`);
      }

      // Apply / remove the filter on the actual app container
      if (appContainerRef.current) {
        if (isActive) {
          appContainerRef.current.style.filter = 'url(#liquid-distort)';
        } else {
          appContainerRef.current.style.filter = '';
        }
      }

      rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      // Cleanup: ensure filter is removed on unmount
      if (appContainerRef.current) {
        appContainerRef.current.style.filter = '';
      }
    };
  }, [scrollVelocity]);

  return (
    /* Hidden SVG filter definition — zero visual footprint at rest */
    <svg
      xmlns="http://www.w3.org/2000/svg"
      style={{ position: 'fixed', width: 0, height: 0, overflow: 'hidden', pointerEvents: 'none' }}
      aria-hidden="true"
    >
      <defs>
        <filter
          id="liquid-distort"
          x="-10%"
          y="-10%"
          width="120%"
          height="120%"
          colorInterpolationFilters="sRGB"
        >
          <feTurbulence
            ref={turbRef}
            type="turbulence"
            baseFrequency="0.006 0.010"
            numOctaves="2"
            seed="7"
            result="noise"
          />
          <feDisplacementMap
            ref={dispRef}
            in="SourceGraphic"
            in2="noise"
            scale="0"
            xChannelSelector="R"
            yChannelSelector="G"
          />
        </filter>
      </defs>
    </svg>
  );
}
