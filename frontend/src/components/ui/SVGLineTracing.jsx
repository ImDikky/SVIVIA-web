import React, { useRef } from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';

export default function SVGLineTracing({ orientation = 'horizontal', className = '', color = 'rgba(255, 255, 255, 0.12)' }) {
  const ref = useRef(null);
  
  // We want the drawing to start when the line enters the viewport (bottom 90%)
  // and complete when it is well into view (e.g. at 50% of the viewport).
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: orientation === 'vertical' 
      ? ["start 95%", "end 30%"]
      : ["start 90%", "start 50%"]
  });

  const pathLength = useSpring(scrollYProgress, {
    stiffness: 70,
    damping: 22,
    restDelta: 0.001
  });

  if (orientation === 'vertical') {
    return (
      <div 
        ref={ref} 
        className={`svg-line-tracing vertical ${className}`} 
        style={{ 
          width: '1px', 
          height: '100%', 
          overflow: 'visible', 
          position: 'relative' 
        }}
      >
        <svg 
          style={{ 
            position: 'absolute', 
            top: 0, 
            left: 0, 
            width: '1px', 
            height: '100%', 
            overflow: 'visible' 
          }}
        >
          <motion.line
            x1="0.5"
            y1="0"
            x2="0.5"
            y2="100%"
            stroke={color}
            strokeWidth="1"
            style={{ pathLength }}
          />
        </svg>
      </div>
    );
  }

  return (
    <div 
      ref={ref} 
      className={`svg-line-tracing horizontal ${className}`} 
      style={{ 
        height: '1px', 
        width: '100%', 
        overflow: 'visible', 
        position: 'relative' 
      }}
    >
      <svg 
        style={{ 
          position: 'absolute', 
          top: 0, 
          left: 0, 
          width: '100%', 
          height: '1px', 
          overflow: 'visible' 
        }}
      >
        <motion.line
          x1="0"
          y1="0.5"
          x2="100%"
          y2="0.5"
          stroke={color}
          strokeWidth="1"
          style={{ pathLength }}
        />
      </svg>
    </div>
  );
}
