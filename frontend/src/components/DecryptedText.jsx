import React, { useState, useEffect, useRef } from 'react';
import { useInView, animate } from 'framer-motion';

const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';

export default function DecryptedText({ text, speed = 1, maxIterations = 10, className, style }) {
  const [displayText, setDisplayText] = useState(text);
  const containerRef = useRef(null);
  const isDone = useRef(false);
  const isInView = useInView(containerRef, { amount: 0.1, once: true });

  useEffect(() => {
    if (!isInView || isDone.current) return;

    // 1. Motor de Animación Principal
    const controls = animate(0, 1, {
      duration: 0.7,
      ease: "easeOut",
      onUpdate: (latest) => {
        if (isDone.current) return;
        const scrambled = text
          .split("")
          .map((char, index) => {
            if (char === " ") return " ";
            if (index < latest * text.length) return text[index];
            return chars[Math.floor(Math.random() * chars.length)];
          })
          .join("");
        setDisplayText(scrambled);
      },
      onComplete: () => {
        setDisplayText(text);
        isDone.current = true;
      }
    });

    // 2. SEGURO DE VIDA: Si a los 1.5s no ha terminado (por bloqueos del navegador), forzamos
    const safetyTimeout = setTimeout(() => {
      if (!isDone.current) {
        setDisplayText(text);
        isDone.current = true;
        controls.stop();
      }
    }, 1500);

    return () => {
      controls.stop();
      clearTimeout(safetyTimeout);
    };
  }, [isInView, text]);

  return (
    <span 
      ref={containerRef} 
      className={className} 
      translate="no" // PROTECCIÓN CONTRA GOOGLE TRANSLATE
      style={{ 
        ...style, 
        display: 'inline',
        wordBreak: 'break-word',
        letterSpacing: '0.02em'
      }}
    >
      {displayText}
    </span>
  );
}
