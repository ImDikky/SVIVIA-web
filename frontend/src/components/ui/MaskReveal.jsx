import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

export default function MaskReveal({ children, className = '', duration = 1.4, delay = 0.1, threshold = 0.15 }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: threshold });

  return (
    <div
      ref={ref}
      className={`mask-reveal-wrapper ${className}`}
      style={{
        position: 'relative',
        overflow: 'hidden',
        width: '100%',
        height: '100%',
      }}
    >
      <motion.div
        initial={{ clipPath: 'inset(100% 0% 0% 0%)' }}
        animate={isInView ? { clipPath: 'inset(0% 0% 0% 0%)' } : { clipPath: 'inset(100% 0% 0% 0%)' }}
        transition={{ duration, delay, ease: [0.16, 1, 0.3, 1] }}
        style={{
          width: '100%',
          height: '100%',
        }}
      >
        <motion.div
          initial={{ scale: 1.1 }}
          animate={isInView ? { scale: 1.0 } : { scale: 1.1 }}
          transition={{ duration: duration + 0.4, delay, ease: [0.16, 1, 0.3, 1] }}
          style={{
            width: '100%',
            height: '100%',
          }}
        >
          {children}
        </motion.div>
      </motion.div>
    </div>
  );
}
