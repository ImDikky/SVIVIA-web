import React, { useState, lazy, Suspense } from 'react';
import { ReactLenis } from 'lenis/react';
import { motion, useScroll, useVelocity, useTransform, useSpring } from 'framer-motion';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Monologue from './components/Monologue';
import Features from './components/Features';
import DataTunnel from './components/DataTunnel';
import HorizontalShowcase from './components/HorizontalShowcase';
import Dashboard from './components/Dashboard';
import Pricing from './components/Pricing';
import Download from './components/Download';
import Footer from './components/Footer';
import CustomCursor from './components/CustomCursor';
import NeuralBackground from './components/NeuralBackground';
import LoadingScreen from './components/LoadingScreen';
import SideNavIndex from './components/ui/SideNavIndex';
import CustomScrollbar from './components/ui/CustomScrollbar';
import SVGLineTracing from './components/ui/SVGLineTracing';
import './App.css';

// Heavy 3D components — lazy loaded so they initialize during the loading screen
const Camera3D       = lazy(() => import('./components/Camera3D'));
const ModelVisualizer = lazy(() => import('./components/ModelVisualizer'));
const RobotSection   = lazy(() => import('./components/RobotSection'));

function App() {
  const [loaded, setLoaded] = useState(false);

  const { scrollY } = useScroll();
  const scrollVelocity = useVelocity(scrollY);
  const smoothVelocity = useSpring(useTransform(scrollVelocity, (v) => Math.min(Math.abs(v) / 1000, 2)), {
    damping: 30,
    stiffness: 120
  });

  const glowScale = useTransform(smoothVelocity, [0, 2], [1, 1.2]);
  const glowOpacity = useTransform(smoothVelocity, [0, 2], [1, 1.5]);

  const glowY1 = useTransform(scrollY, [0, 5000], [0, -350]);
  const glowY2 = useTransform(scrollY, [0, 5000], [0, 350]);

  return (
    <>
      {/* Loading screen — always mounted first, sits above everything */}
      <LoadingScreen onComplete={() => setLoaded(true)} />

      {/* Main app — rendered immediately but hidden until loader exits */}
      <ReactLenis root options={{ lerp: 0.05 }}>
        <NeuralBackground />
        <CustomCursor />
        {/* CAPA 2: Micro-Geometría HUD sutil */}
        <div className="hud-geometry">
           <div className="hud-cross hud-tl"></div>
           <div className="hud-cross hud-tr"></div>
           <div className="hud-cross hud-bl"></div>
           <div className="hud-cross hud-br"></div>
        </div>

        <Navbar />
        <SideNavIndex />
        <CustomScrollbar />
        <div className="app-container">
          {/* Orbe orgánico sutil para cumplir la cuota estética GentleRain/Aurora */}
          <motion.div className="ambient-glow" style={{ scale: glowScale, opacity: glowOpacity, y: glowY1 }}></motion.div>
          <motion.div className="ambient-glow secondary" style={{ scale: glowScale, opacity: glowOpacity, y: glowY2 }}></motion.div>
          
          <div id="hero"><Hero /></div>
          <SVGLineTracing orientation="horizontal" color="rgba(239, 68, 68, 0.12)" />
          
          <div id="monologue"><Monologue /></div>
          <SVGLineTracing orientation="horizontal" color="rgba(239, 68, 68, 0.12)" />

          {/* AI Robot — lazy loaded Spline 3D scene */}
          <div id="robot">
            <Suspense fallback={<div style={{ height: '100vh', background: '#000' }} />}>
              <RobotSection />
            </Suspense>
          </div>
          <SVGLineTracing orientation="horizontal" color="rgba(239, 68, 68, 0.12)" />

          <div id="features"><Features /></div>
          <SVGLineTracing orientation="horizontal" color="rgba(239, 68, 68, 0.12)" />
          
          <div id="tunnel"><DataTunnel /></div>
          <SVGLineTracing orientation="horizontal" color="rgba(239, 68, 68, 0.12)" />
          
          <div id="showcase"><HorizontalShowcase /></div>
          <SVGLineTracing orientation="horizontal" color="rgba(239, 68, 68, 0.12)" />
          
          <div id="dashboard"><Dashboard /></div>
          <SVGLineTracing orientation="horizontal" color="rgba(239, 68, 68, 0.12)" />

          {/* Heavy 3D — wrapped in Suspense, pre-initialized while loader is shown */}
          <Suspense fallback={<div style={{ height: '200vh', background: '#000' }} />}>
            <Camera3D />
          </Suspense>
          <SVGLineTracing orientation="horizontal" color="rgba(239, 68, 68, 0.12)" />

          <Suspense fallback={<div style={{ height: '100vh', background: '#000' }} />}>
            <ModelVisualizer />
          </Suspense>
          <SVGLineTracing orientation="horizontal" color="rgba(239, 68, 68, 0.12)" />

          <div id="pricing"><Pricing /></div>
          <div id="download"><Download /></div>
          <Footer />
        </div>
      </ReactLenis>
    </>
  );
}

export default App;
