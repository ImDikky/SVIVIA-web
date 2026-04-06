import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

export default function PoeticReveal({ children, offset = ["start 90%", "end 10%"], blur = true }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: offset
  });
  
  const opacity = useTransform(scrollYProgress, [0, 0.4, 0.6, 1], [0, 1, 1, 0]);
  const blurValue = useTransform(scrollYProgress, [0, 0.4, 0.6, 1], [10, 0, 0, 10]);
  const filter = useTransform(blurValue, (value) => blur ? `blur(${value}px)` : 'none');
  const y = useTransform(scrollYProgress, [0, 1], [30, -30]);

  return (
    <motion.div ref={ref} style={{ opacity, filter, y }} className="center-flow">
      {children}
    </motion.div>
  );
}
