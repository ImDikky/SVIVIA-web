import React, { useEffect, useRef } from 'react';

/**
 * NeuralBackground — INTERACTIVE TACTILE DOT GRID (REFINED BRIGHT RED)
 * 
 * Renders a lightweight 2D canvas of micro-dots spaced in a grid.
 * Nearby dots are repelled by the cursor, morphing smoothly in size and color:
 * - Idle: 1.1px radius, light white-gray color, 0.11 opacity.
 * - Hover: 2.6px radius, intense solid red color, 0.92 opacity.
 */
export default function NeuralBackground() {
  const canvasRef = useRef(null);
  const mouseRef = useRef({ x: -1000, y: -1000, active: false });
  const dotsRef = useRef([]);
  const animationFrameId = useRef(null);
  const isAnimating = useRef(false);
  const scrollYRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: true });
    
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);
    const spacing = 45; // Dot grid size

    const initGrid = () => {
      const dpr = window.devicePixelRatio || 1;
      width = window.innerWidth;
      height = window.innerHeight;
      
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      
      ctx.scale(dpr, dpr);

      const cols = Math.ceil(width / spacing) + 1;
      // Generate extra rows to cover scrolling (parallax shifts dots up)
      const rows = Math.ceil((height + 1600) / spacing) + 1;
      
      const newDots = [];
      const scrollOffset = scrollYRef.current * 0.14;
      for (let c = 0; c < cols; c++) {
        for (let r = 0; r < rows; r++) {
          newDots.push({
            ox: c * spacing,
            oy: r * spacing,
            x: c * spacing,
            y: r * spacing - scrollOffset,
            vx: 0,
            vy: 0,
            alpha: 0.11,
          });
        }
      }
      dotsRef.current = newDots;
      draw();
    };

    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      const dots = dotsRef.current;
      
      for (let i = 0; i < dots.length; i++) {
        const dot = dots[i];
        
        // Calculate dynamic hover factor based on alpha range [0.11, 0.92]
        const hoverFactor = Math.min(1, Math.max(0, (dot.alpha - 0.11) / 0.81));
        
        // Morph color: solid 255 red, with green/blue dropping sharply to 0 as hoverFactor grows
        const r = 255;
        const g = Math.max(0, Math.min(240, Math.round(240 * (1 - hoverFactor * 1.8))));
        const b = Math.max(0, Math.min(240, Math.round(240 * (1 - hoverFactor * 1.8))));
        
        ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${dot.alpha})`;
        ctx.beginPath();
        
        // Size grows smoothly from 1.1px to 2.6px based on interaction
        const radius = 1.1 + hoverFactor * 1.5;
        ctx.arc(dot.x, dot.y, radius, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    const update = () => {
      const dots = dotsRef.current;
      const mouse = mouseRef.current;
      let needsNextFrame = false;

      const maxDist = 110; // Interaction radius
      const scrollOffset = scrollYRef.current * 0.14;

      for (let i = 0; i < dots.length; i++) {
        const dot = dots[i];
        
        const dx = dot.x - mouse.x;
        const dy = dot.y - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        
        let tx = dot.ox;
        let ty = dot.oy - scrollOffset;
        let ta = 0.11; // Idle opacity

        if (mouse.active && dist < maxDist) {
          const force = (maxDist - dist) / maxDist;
          const angle = Math.atan2(dy, dx);
          
          // Magnetic push away
          tx = (dot.ox) + Math.cos(angle) * force * 14;
          ty = (dot.oy - scrollOffset) + Math.sin(angle) * force * 14;
          
          // Glow intensity scales up to 0.92 (highly visible bright red)
          ta = 0.11 + force * 0.81;
        }

        // Spring physics interpolation
        const ax = (tx - dot.x) * 0.12;
        const ay = (ty - dot.y) * 0.12;
        
        dot.vx = (dot.vx + ax) * 0.82;
        dot.vy = (dot.vy + ay) * 0.82;
        dot.x += dot.vx;
        dot.y += dot.vy;

        // Smooth alpha interpolation
        dot.alpha += (ta - dot.alpha) * 0.12;

        // Frame check triggers animation shutdown when elements settle
        const deltaX = Math.abs(dot.x - tx);
        const deltaY = Math.abs(dot.y - ty);
        const deltaA = Math.abs(dot.alpha - ta);

        if (deltaX > 0.05 || deltaY > 0.05 || deltaA > 0.01 || Math.abs(dot.vx) > 0.01 || Math.abs(dot.vy) > 0.01) {
          needsNextFrame = true;
        }
      }

      draw();

      if (needsNextFrame) {
        animationFrameId.current = requestAnimationFrame(update);
      } else {
        isAnimating.current = false;
      }
    };

    const triggerAnimation = () => {
      if (!isAnimating.current) {
        isAnimating.current = true;
        animationFrameId.current = requestAnimationFrame(update);
      }
    };

    const handleMouseMove = (e) => {
      mouseRef.current.x = e.clientX;
      mouseRef.current.y = e.clientY;
      mouseRef.current.active = true;
      triggerAnimation();
    };

    const handleMouseLeave = () => {
      mouseRef.current.active = false;
      triggerAnimation();
    };

    const handleScroll = () => {
      scrollYRef.current = window.scrollY;
      triggerAnimation();
    };

    initGrid();
    window.addEventListener('resize', initGrid, { passive: true });
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('scroll', handleScroll, { passive: true });
    document.addEventListener('mouseleave', handleMouseLeave, { passive: true });

    return () => {
      window.removeEventListener('resize', initGrid);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('mouseleave', handleMouseLeave);
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        inset: 0,
        width: '100vw',
        height: '100vh',
        pointerEvents: 'none',
        zIndex: -1,
        background: 'transparent',
      }}
    />
  );
}
