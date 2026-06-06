import React from 'react';
import { motion } from 'framer-motion';
import vantaLogo from '../assets/logovantaw.png';
import svivaLogo from '../assets/logo.png';

const LINKS = [
  {
    heading: 'Producto',
    items: ['Descargar SVIVIA', 'Características', 'Precios', 'Actualizaciones'],
  },
  {
    heading: 'Empresa',
    items: ['Sobre VANTA', 'Tecnología', 'Privacidad', 'Contacto'],
  },
  {
    heading: 'Legal',
    items: ['Términos de uso', 'Política de privacidad', 'Licencias de código abierto'],
  },
];

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.25, 0.8, 0.25, 1] } },
};

export default function Footer() {
  return (
    <footer className="footer-root">
      {/* Separador superior con gradiente */}
      <div className="footer-separator" />

      <div className="footer-inner container">
        {/* Columna de marca */}
        <motion.div
          className="footer-brand-col"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
        >
          <motion.div className="footer-logos" variants={itemVariants}>
            <img src={vantaLogo} alt="VANTA" className="footer-logo-vanta" />
            <span className="footer-brand-name">VANTA</span>
          </motion.div>

          <motion.p className="footer-tagline" variants={itemVariants}>
            Inteligencia artificial local.<br />
            Privacidad sin concesiones.
          </motion.p>

          <motion.div className="footer-product-badge" variants={itemVariants}>
            <img src={svivaLogo} alt="SVIVIA" className="footer-logo-svivia" />
            <div>
              <span className="footer-product-name">SVIVIA</span>
              <span className="footer-product-sub">Sistema de Vigilancia Edge AI</span>
            </div>
          </motion.div>
        </motion.div>

        {/* Columnas de links */}
        <div className="footer-links-grid">
          {LINKS.map((col, ci) => (
            <motion.div
              key={ci}
              className="footer-link-col"
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
            >
              <motion.h4 className="footer-col-heading" variants={itemVariants}>
                {col.heading}
              </motion.h4>
              {col.items.map((item, ii) => (
                <motion.a key={ii} href="#" className="footer-link" variants={itemVariants}>
                  {item}
                </motion.a>
              ))}
            </motion.div>
          ))}
        </div>
      </div>

      {/* Barra inferior */}
      <div className="footer-bottom">
        <div className="container footer-bottom-inner">
          <span className="footer-copy">
            © {new Date().getFullYear()} VANTA Technologies · Todos los derechos reservados
          </span>
          <div className="footer-bottom-right">
            <span className="footer-status-dot" />
            <span className="footer-status-text">Sistemas operativos</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
