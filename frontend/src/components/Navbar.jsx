import React, { useEffect, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import vantaLogo from '../assets/logovantaw.png';
import svivaLogo from '../assets/svivalogo.png';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [visible, setVisible] = useState(true);
  const [lastY, setLastY] = useState(0);

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

      {/* Lado derecho: CTA */}
      <motion.div
        className="navbar-actions"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, delay: 0.3 }}
      >
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
