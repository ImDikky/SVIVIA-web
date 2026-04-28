import React from 'react';
import { ReactLenis } from 'lenis/react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Monologue from './components/Monologue';
import Features from './components/Features';
import HorizontalShowcase from './components/HorizontalShowcase';
import Camera3D from './components/Camera3D';
import Pricing from './components/Pricing';
import Download from './components/Download';
import Footer from './components/Footer';
import './App.css';

function App() {
  return (
    <ReactLenis root options={{ lerp: 0.05 }}>
      {/* CAPA 2: Micro-Geometría HUD sutil */}
      <div className="hud-geometry">
         <div className="hud-cross hud-tl"></div>
         <div className="hud-cross hud-tr"></div>
         <div className="hud-cross hud-bl"></div>
         <div className="hud-cross hud-br"></div>
      </div>

      <div className="app-container">
        {/* Orbe orgánico sutil para cumplir la cuota estética GentleRain/Aurora */}
        <div className="ambient-glow"></div>
        <div className="ambient-glow secondary"></div>
        
        <Navbar />
        <Hero />
        <Monologue />
        <Features />
        <HorizontalShowcase />
        <Camera3D />
        <Pricing />
        <Download />
        <Footer />
      </div>
    </ReactLenis>
  );
}

export default App;
