import React, { useRef, useEffect } from 'react';
import { useScroll, useVelocity } from 'framer-motion';

// ─── Wireframe CAD schematic lines of a security camera (isometric-ish) ───────
// Drawn as simple SVG paths in normalized 0-100 space, centered at (50, 50)
const CAD_PATHS = [
  // Camera body outline
  'M 30 40 L 70 40 L 70 62 L 30 62 Z',
  // Lens barrel
  'M 50 40 L 50 28 M 44 32 L 56 32 M 42 36 L 58 36',
  // Lens circle
  'M 50 34 m -6 0 a 6 6 0 1 0 12 0 a 6 6 0 1 0 -12 0',
  // Mount bracket
  'M 38 62 L 38 74 L 62 74 L 62 62',
  // Wall screw holes
  'M 34 70 m -2 0 a 2 2 0 1 0 4 0 a 2 2 0 1 0 -4 0',
  'M 66 70 m -2 0 a 2 2 0 1 0 4 0 a 2 2 0 1 0 -4 0',
  // IR sensor array (right side)
  'M 70 44 L 78 42 M 70 48 L 80 48 M 70 52 L 78 54 M 70 56 L 76 58',
  // Cable conduit
  'M 50 74 L 50 88 M 46 88 L 54 88',
  // Corner detail lines
  'M 30 40 L 24 36 M 70 40 L 76 36',
  // Scan arc decorative
  'M 32 30 Q 50 18 68 30',
  // Technical annotation lines
  'M 80 48 L 92 48 M 92 44 L 92 52',
  'M 8 48 L 20 48 M 8 44 L 8 52',
  // Cross-section detail
  'M 38 51 L 62 51',
  'M 44 44 L 44 58 M 56 44 L 56 58',
];

export default function SpotlightOverlay({ sectionRef }) {
  const svgRef = useRef(null);
  const circleRef = useRef(null);
  const maskCircleRef = useRef(null);
  const radialGradRef = useRef(null);
  const cadGroupRef = useRef(null);
  const rafRef = useRef(null);

  // Mouse position (normalized)
  const mouse = useRef({ x: 50, y: 50 });
  // Current animated radius
  const currentR = useRef(200);
  const targetR = useRef(200);

  const { scrollY } = useScroll();
  const scrollVelocity = useVelocity(scrollY);

  useEffect(() => {
    // Map velocity → spotlight radius: fast = small/focused, stopped = large/diffuse
    const unsubVel = scrollVelocity.on('change', (vel) => {
      const absVel = Math.min(Math.abs(vel), 2000);
      const t = absVel / 2000;
      // 200px at rest → 55px at max speed
      targetR.current = 200 - t * 145;
    });

    // Mouse tracking on the section
    const section = sectionRef?.current;
    const onMouseMove = (e) => {
      if (!section) return;
      const rect = section.getBoundingClientRect();
      mouse.current = {
        x: ((e.clientX - rect.left) / rect.width) * 100,
        y: ((e.clientY - rect.top) / rect.height) * 100,
      };
    };
    if (section) section.addEventListener('mousemove', onMouseMove);

    // Animation loop — smooth radius and update SVG DOM directly
    const animate = () => {
      currentR.current += (targetR.current - currentR.current) * 0.09;
      // Decay target back to 200 when no velocity
      targetR.current += (200 - targetR.current) * 0.04;

      const svg = svgRef.current;
      if (!svg) {
        rafRef.current = requestAnimationFrame(animate);
        return;
      }

      const W = svg.clientWidth || 1;
      const H = svg.clientHeight || 1;

      const cx = (mouse.current.x / 100) * W;
      const cy = (mouse.current.y / 100) * H;
      const r = currentR.current;

      // 1. Update mask circle position and radius
      if (maskCircleRef.current) {
        maskCircleRef.current.setAttribute('cx', cx);
        maskCircleRef.current.setAttribute('cy', cy);
        maskCircleRef.current.setAttribute('r', r);
      }

      // 2. Update soft edge ring position and radius (Fix 1)
      if (circleRef.current) {
        circleRef.current.setAttribute('cx', cx);
        circleRef.current.setAttribute('cy', cy);
        circleRef.current.setAttribute('r', r);
      }

      // 3. Update radial gradient center
      if (radialGradRef.current) {
        radialGradRef.current.setAttribute('cx', `${mouse.current.x}%`);
        radialGradRef.current.setAttribute('cy', `${mouse.current.y}%`);
      }

      // 4. Center and scale CAD lines to fit screen size and align with 3D model (Fix 2)
      if (cadGroupRef.current) {
        const scale = Math.min(W * 0.006, H * 0.006); // dynamic scale based on screen dimensions
        const tx = W / 2 - 50 * scale; // center horizontally
        const ty = H / 2 - 50 * scale; // center vertically
        cadGroupRef.current.setAttribute('transform', `translate(${tx}, ${ty}) scale(${scale})`);
      }

      rafRef.current = requestAnimationFrame(animate);
    };
    rafRef.current = requestAnimationFrame(animate);

    return () => {
      unsubVel();
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      if (section) section.removeEventListener('mousemove', onMouseMove);
    };
  }, [scrollVelocity, sectionRef]);

  return (
    <svg
      ref={svgRef}
      aria-hidden="true"
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 2,
        overflow: 'hidden',
      }}
    >
      <defs>
        {/* Mask: opaque circle = revealed area, everything else hidden */}
        <mask id="spotlight-mask">
          <rect width="100%" height="100%" fill="black" />
          <circle
            ref={maskCircleRef}
            cx="50%"
            cy="50%"
            r="200"
            fill="white"
          />
        </mask>

        {/* Radial gradient for spotlight glow edge */}
        <radialGradient id="spotlight-grad" ref={radialGradRef} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="rgba(239,68,68,0.06)" />
          <stop offset="60%" stopColor="rgba(239,68,68,0.02)" />
          <stop offset="100%" stopColor="rgba(0,0,0,0)" />
        </radialGradient>
      </defs>

      {/* CAD wireframe lines — revealed only inside the spotlight mask */}
      <g mask="url(#spotlight-mask)">
        {/* Glow background behind the lines */}
        <rect width="100%" height="100%" fill="url(#spotlight-grad)" />

        {/* Dynamically centered and scaled CAD paths group */}
        <g
          ref={cadGroupRef}
          stroke="rgba(239,68,68,0.22)"
          strokeWidth="0.15"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          {CAD_PATHS.map((d, i) => (
            <path key={i} d={d} />
          ))}
        </g>

        {/* Grid of faint dots */}
        <pattern id="cad-dot-grid" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
          <circle cx="20" cy="20" r="0.8" fill="rgba(239,68,68,0.12)" />
        </pattern>
        <rect width="100%" height="100%" fill="url(#cad-dot-grid)" />
      </g>

      {/* Soft edge ring around the spotlight */}
      <circle
        ref={circleRef}
        cx="50%"
        cy="50%"
        r="200"
        fill="none"
        stroke="rgba(239,68,68,0.18)"
        strokeWidth="1"
      />
    </svg>
  );
}
