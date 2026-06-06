import React, { useRef, useMemo } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';

/**
 * SplitTextReveal — SELF-CONTAINED VERSION
 *
 * Automatically tracks its own visibility within the viewport.
 * Words illuminate progressively with a red leading-edge flash
 * as the reading frontier passes each word.
 *
 * Props:
 *   text   — string to split and reveal
 *   offset — scroll offset array mapping viewport position (default: start when top is at 80% screen, end when top is at 35%)
 */
export default function SplitTextReveal({
  text,
  offset = ['start 80%', 'start 35%'],
}) {
  const containerRef = useRef(null);

  // Set up local useScroll on the text container itself
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: offset,
  });

  // Spring smoothing for a beautiful, organic reveal
  const smoothProgress = useSpring(scrollYProgress, { stiffness: 60, damping: 20 });

  const words = useMemo(() => {
    const result = [];
    text.split(/(\n)/).forEach((token) => {
      if (token === '\n') {
        result.push({ type: 'break' });
      } else {
        token.split(' ').forEach((w) => {
          if (w) result.push({ type: 'word', text: w });
        });
      }
    });
    return result;
  }, [text]);

  const wordCount = words.filter((w) => w.type === 'word').length;

  return (
    <span ref={containerRef} className="split-text-reveal" style={{ display: 'block' }}>
      {words.map((token, idx) => {
        if (token.type === 'break') return <br key={`br-${idx}`} />;

        const wordIdx = words.slice(0, idx).filter((t) => t.type === 'word').length;
        const wordStart = wordIdx / wordCount;
        const wordEnd = Math.min(1, (wordIdx + 3) / wordCount); // wider window = softer cascade

        return (
          <AnimatedWord
            key={idx}
            text={token.text}
            smoothProgress={smoothProgress}
            wordStart={wordStart}
            wordEnd={wordEnd}
          />
        );
      })}
    </span>
  );
}

function AnimatedWord({ text, smoothProgress, wordStart, wordEnd }) {
  const lit = useTransform(smoothProgress, [wordStart, wordEnd], [0, 1]);

  const color = useTransform(lit, [0, 0.35, 0.65, 1], [
    'rgba(255,255,255,0.12)',
    'rgba(239, 68, 68, 0.95)',   // red frontier flash
    'rgba(255,255,255,0.80)',
    'rgba(255,255,255,0.95)',
  ]);

  const y = useTransform(lit, [0, 1], ['5px', '0px']);

  return (
    <motion.span
      style={{ color, y, display: 'inline-block', marginRight: '0.28em' }}
      className="split-word"
    >
      {text}
    </motion.span>
  );
}
