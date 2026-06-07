import React, { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Volume2, VolumeX } from 'lucide-react';
import vantaLogo from '../assets/logovantaw.png';
import svivaLogo from '../assets/logo.png';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [visible, setVisible] = useState(true);
  const [lastY, setLastY] = useState(0);

  const [audioActive, setAudioActive] = useState(false);
  const audioCtxRef = useRef(null);

  // Monitor scroll for glassmorphism
  useEffect(() => {
    let lastScrollY = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 40);
      setVisible(y < lastScrollY || y < 80);
      lastScrollY = y;
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Expose global playTactileClick function for site-wide micro-acoustics
  useEffect(() => {
    const playTactileClick = (freq = 800, duration = 0.04, type = 'sine', volume = 0.012) => {
      if (!window.SVIVIA_AUDIO_ACTIVE) return;
      try {
        const ctx = audioCtxRef.current || new (window.AudioContext || window.webkitAudioContext)();
        if (!audioCtxRef.current) audioCtxRef.current = ctx;
        if (ctx.state === 'suspended') ctx.resume();

        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = type;
        osc.frequency.setValueAtTime(freq, ctx.currentTime);

        gain.gain.setValueAtTime(volume, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start();
        osc.stop(ctx.currentTime + duration);
      } catch (e) {
        console.warn("Audio Context beep failed", e);
      }
    };

    window.playTactileClick = playTactileClick;
    return () => {
      window.playTactileClick = null;
      if (audioCtxRef.current) {
        try { audioCtxRef.current.close(); } catch(e){}
      }
    };
  }, []);

  const toggleSound = () => {
    const nextState = !audioActive;
    setAudioActive(nextState);
    window.SVIVIA_AUDIO_ACTIVE = nextState;

    if (nextState) {
      // Immediate startup chime
      setTimeout(() => {
        try {
          const ctx = audioCtxRef.current || new (window.AudioContext || window.webkitAudioContext)();
          if (!audioCtxRef.current) audioCtxRef.current = ctx;
          if (ctx.state === 'suspended') ctx.resume();

          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(700, ctx.currentTime);
          osc.frequency.setValueAtTime(1100, ctx.currentTime + 0.04);
          gain.gain.setValueAtTime(0.015, ctx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.12);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start();
          osc.stop(ctx.currentTime + 0.12);
        } catch (e) {}
      }, 50);
    } else {
      if (audioCtxRef.current) {
        try { audioCtxRef.current.close(); } catch(e){}
        audioCtxRef.current = null;
      }
    }
  };

  const playClick = () => {
    if (window.playTactileClick) {
      window.playTactileClick(800, 0.04, 'sine', 0.012);
    }
  };

  const playHover = () => {
    if (window.playTactileClick) {
      window.playTactileClick(1100, 0.015, 'triangle', 0.008);
    }
  };

  return (
    <motion.header
      className={`navbar-glass ${scrolled ? 'navbar-glass--scrolled' : ''}`}
      animate={{ y: visible ? 0 : -100, opacity: visible ? 1 : 0 }}
      transition={{ duration: 0.4, ease: [0.25, 0.8, 0.25, 1] }}
    >
      {/* Left section: company */}
      <motion.div
        className="navbar-brand"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, delay: 0.1 }}
      >
        <img src={vantaLogo} alt="VANTA" className="navbar-logo-vanta" />
        <span className="navbar-brand-text">VANTA</span>
      </motion.div>

      {/* Center section: product name */}
      <motion.div
        className="navbar-center"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        <img src={svivaLogo} alt="SVIVIA" className="navbar-logo-svivia" />
        <span className="navbar-product-label">SVIVIA</span>
      </motion.div>

      {/* Right section: sound control & links */}
      <motion.div
        className="navbar-actions"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, delay: 0.3 }}
      >
        {/* Sound toggle button */}
        <button 
          onClick={toggleSound} 
          className="navbar-sound-toggle"
          title={audioActive ? "Desactivar Efectos de Audio" : "Activar Efectos de Audio"}
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
          {audioActive ? <Volume2 size={16} color="#ef4444" /> : <VolumeX size={16} color="rgba(255,255,255,0.45)" />}
          <span className="sound-toggle-waves">
            <span className={`wave-bar ${audioActive ? 'active' : ''}`} style={{ animationDelay: '0.1s' }} />
            <span className={`wave-bar ${audioActive ? 'active' : ''}`} style={{ animationDelay: '0.3s' }} />
            <span className={`wave-bar ${audioActive ? 'active' : ''}`} style={{ animationDelay: '0.2s' }} />
          </span>
        </button>

        <a 
          href="#download" 
          className="navbar-link"
          onClick={playClick}
          onMouseEnter={playHover}
        >
          Sistema
        </a>
        <a 
          href="#pricing" 
          className="navbar-link"
          onClick={playClick}
          onMouseEnter={playHover}
        >
          Licencias
        </a>
        
        <motion.a
          href="#download"
          className="navbar-cta"
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.97 }}
          onClick={playClick}
          onMouseEnter={playHover}
        >
          <span className="navbar-cta-dot" />
          Descargar
        </motion.a>
      </motion.div>
    </motion.header>
  );
}
