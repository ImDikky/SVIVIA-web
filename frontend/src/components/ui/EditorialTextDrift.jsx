import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';

export default function EditorialTextDrift({ line1, line2, className = '', style = {} }) {
  const ref = useRef(null);
  
  // Track scroll when the component is moving through the viewport
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });

  // Smooth out the progress slightly
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 60,
    damping: 20,
    restDelta: 0.001
  });

  // Map progress to subtle opposite drifts (-2.5vw to 2.5vw range)
  const xLeft = useTransform(smoothProgress, [0, 1], ["-2.5vw", "1vw"]);
  const xRight = useTransform(smoothProgress, [0, 1], ["2.5vw", "-1vw"]);

  const inheritStyle = {
    background: 'inherit',
    WebkitBackgroundClip: 'inherit',
    WebkitTextFillColor: 'inherit',
    color: 'inherit'
  };

  return (
    <div 
      ref={ref} 
      className={`editorial-text-drift ${className}`} 
      style={{ 
        display: 'flex', 
        flexDirection: 'column',
        background: 'inherit',
        WebkitBackgroundClip: 'inherit',
        WebkitTextFillColor: 'inherit',
        color: 'inherit',
        ...style 
      }}
    >
      <motion.span 
        style={{ 
          x: xLeft, 
          display: 'block',
          whiteSpace: 'nowrap',
          ...inheritStyle
        }}
      >
        {line1}
      </motion.span>
      <motion.span 
        style={{ 
          x: xRight, 
          display: 'block',
          whiteSpace: 'nowrap',
          ...inheritStyle
        }}
      >
        {line2}
      </motion.span>
    </div>
  );
}
