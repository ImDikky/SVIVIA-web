import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

export default function SplitLetterReveal({ text, className = '', style = {}, delay = 0, threshold = 0.1 }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: threshold });
  const letters = text.split('');

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.025,
        delayChildren: delay,
      }
    }
  };

  const letterVariants = {
    hidden: { opacity: 0, y: '75%' },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.7,
        ease: [0.16, 1, 0.3, 1] // Sleek cubic-bezier ease out
      }
    }
  };

  const inheritStyle = {
    background: 'inherit',
    WebkitBackgroundClip: 'inherit',
    WebkitTextFillColor: 'inherit',
    color: 'inherit'
  };

  return (
    <motion.span
      ref={ref}
      className={`split-letter-reveal ${className}`}
      style={{ 
        display: 'inline-block', 
        overflow: 'hidden', 
        verticalAlign: 'bottom',
        background: 'inherit',
        WebkitBackgroundClip: 'inherit',
        WebkitTextFillColor: 'inherit',
        color: 'inherit',
        ...style 
      }}
      variants={containerVariants}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
    >
      {letters.map((char, index) => (
        <motion.span
          key={index}
          variants={letterVariants}
          style={{
            display: 'inline-block',
            whiteSpace: char === ' ' ? 'pre' : 'normal',
            willChange: 'transform, opacity',
            ...inheritStyle
          }}
        >
          {char}
        </motion.span>
      ))}
    </motion.span>
  );
}
