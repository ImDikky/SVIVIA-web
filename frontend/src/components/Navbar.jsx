import React, { useEffect, useState, useRef } from 'react';
import { motion, useScroll, useVelocity } from 'framer-motion';
import { Volume2, VolumeX } from 'lucide-react';
import vantaLogo from '../assets/logovantaw.png';
import svivaLogo from '../assets/logo.png';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [visible, setVisible] = useState(true);
  const [lastY, setLastY] = useState(0);

  const [audioActive, setAudioActive] = useState(false);
  const audioCtxRef = useRef(null);
  const droneNodeRef = useRef(null);
  const gainNodeRef = useRef(null);
  const filterNodeRef = useRef(null); // exposed for velocity modulation
  const osc1Ref = useRef(null);       // exposed for pitch modulation

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 40);
      setVisible(y < lastY || y < 80);
      setLastY(y);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [lastY]);

  // Limpiar audio al desmontar
  useEffect(() => {
    return () => {
      if (droneNodeRef.current) {
        try { droneNodeRef.current.stop(); } catch(e){}
      }
      if (audioCtxRef.current) {
        try { audioCtxRef.current.close(); } catch(e){}
      }
    };
  }, []);

  const startDrone = () => {
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      audioCtxRef.current = ctx;

      // 1. Gain Node de volumen general muy sutil
      const mainGain = ctx.createGain();
      mainGain.gain.setValueAtTime(0.04, ctx.currentTime);
      mainGain.connect(ctx.destination);
      gainNodeRef.current = mainGain;

      // 2. Hum binaural a 60Hz y 65Hz
      const osc1 = ctx.createOscillator();
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(60, ctx.currentTime);
      osc1Ref.current = osc1;
      
      const osc2 = ctx.createOscillator();
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(65, ctx.currentTime);

      // 3. Generar ruido marron para turbinas de ventilador
      const bufferSize = ctx.sampleRate * 2;
      const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = noiseBuffer.getChannelData(0);
      let lastOut = 0.0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        data[i] = (lastOut + (0.02 * white)) / 1.02;
        lastOut = data[i];
        data[i] *= 3.5;
      }

      const noiseSource = ctx.createBufferSource();
      noiseSource.buffer = noiseBuffer;
      noiseSource.loop = true;

      // Filtro pasa bajos — expuesto en filterNodeRef para modulacion por velocidad
      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(120, ctx.currentTime);
      filterNodeRef.current = filter;

      // Conectar todo
      osc1.connect(mainGain);
      osc2.connect(mainGain);
      noiseSource.connect(filter);
      filter.connect(mainGain);

      // Iniciar osciladores y ruido
      osc1.start();
      osc2.start();
      noiseSource.start();

      droneNodeRef.current = {
        osc1,
        osc2,
        noiseSource,
        stop: () => {
          try { osc1.stop(); } catch(e){}
          try { osc2.stop(); } catch(e){}
          try { noiseSource.stop(); } catch(e){}
        }
      };
      setAudioActive(true);
    } catch (e) {
      console.warn("Audio Context failed to start:", e);
    }
  };

  const stopDrone = () => {
    if (droneNodeRef.current) {
      try { droneNodeRef.current.stop(); } catch(e){}
      droneNodeRef.current = null;
    }
    if (gainNodeRef.current && audioCtxRef.current) {
      const mainGain = gainNodeRef.current;
      const ctx = audioCtxRef.current;
      mainGain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.4);
      setTimeout(() => {
        try { ctx.close(); } catch(e){}
      }, 500);
    }
    setAudioActive(false);
  };

  const toggleSound = () => {
    if (audioActive) stopDrone();
    else startDrone();
  };

  // ── Scroll velocity → synth modulation ──────────────────────────────────────
  const { scrollY } = useScroll();
  const scrollVelocity = useVelocity(scrollY);

  useEffect(() => {
    if (!audioActive) return;
    const unsubscribe = scrollVelocity.on('change', (vel) => {
      const ctx = audioCtxRef.current;
      const filter = filterNodeRef.current;
      const osc1 = osc1Ref.current;
      if (!ctx || !filter || !osc1) return;

      // Map absolute velocity (px/s) 0–2500 → filter 120–700 Hz
      const absVel = Math.min(Math.abs(vel), 2500);
      const t = absVel / 2500;
      const targetFilter = 120 + t * 580;   // 120 → 700 Hz
      const targetPitch  = 60 + t * 18;     // 60 → 78 Hz (subtle pitch rise)

      // Ramp smoothly — use setTargetAtTime for gentle exponential approach
      filter.frequency.setTargetAtTime(targetFilter, ctx.currentTime, 0.08);
      osc1.frequency.setTargetAtTime(targetPitch, ctx.currentTime, 0.12);
    });
    return () => unsubscribe();
  }, [audioActive, scrollVelocity]);

  return (
    <motion.header
      className={`navbar-glass ${scrolled ? 'navbar-glass--scrolled' : ''}`}
      animate={{ y: visible ? 0 : -100, opacity: visible ? 1 : 0 }}
      transition={{ duration: 0.4, ease: [0.25, 0.8, 0.25, 1] }}
    >
      {/* Lado izquierdo: VANTA (empresa) */}
      <motion.div
        className="navbar-brand"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, delay: 0.1 }}
      >
        <img src={vantaLogo} alt="VANTA" className="navbar-logo-vanta" />
        <span className="navbar-brand-text">VANTA</span>
      </motion.div>

      {/* Centro: producto SVIVIA */}
      <motion.div
        className="navbar-center"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        <img src={svivaLogo} alt="SVIVIA" className="navbar-logo-svivia" />
        <span className="navbar-product-label">SVIVIA</span>
      </motion.div>

      {/* Lado derecho: CTA & Audio Switch */}
      <motion.div
        className="navbar-actions"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, delay: 0.3 }}
      >
        {/* Botón de Sonido Procedural */}
        <button 
          onClick={toggleSound} 
          className="navbar-sound-toggle"
          title="Sonido Ambiental de Servidor"
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
          {audioActive ? <Volume2 size={16} color="#ef4444" /> : <VolumeX size={16} color="rgba(255,255,255,0.45)" />}
          <span className="sound-toggle-waves">
            <span className={`wave-bar ${audioActive ? 'active' : ''}`} style={{ animationDelay: '0.1s' }} />
            <span className={`wave-bar ${audioActive ? 'active' : ''}`} style={{ animationDelay: '0.3s' }} />
            <span className={`wave-bar ${audioActive ? 'active' : ''}`} style={{ animationDelay: '0.2s' }} />
          </span>
        </button>

        <a href="#download" className="navbar-link">Sistema</a>
        <a href="#pricing" className="navbar-link">Licencias</a>
        <motion.a
          href="#download"
          className="navbar-cta"
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.97 }}
        >
          <span className="navbar-cta-dot" />
          Descargar
        </motion.a>
      </motion.div>
    </motion.header>
  );
}
