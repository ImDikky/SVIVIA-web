import React, { useState, lazy, Suspense } from 'react';
import { ReactLenis } from 'lenis/react';
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
import LiquidDistortion from './components/ui/LiquidDistortion';
import './App.css';

// Heavy 3D components — lazy loaded so they initialize during the loading screen
const Camera3D       = lazy(() => import('./components/Camera3D'));
const ModelVisualizer = lazy(() => import('./components/ModelVisualizer'));
const RobotSection   = lazy(() => import('./components/RobotSection'));

function App() {
  const [loaded, setLoaded] = useState(false);

  return (
    <>
      {/* Loading screen — always mounted first, sits above everything */}
      <LoadingScreen onComplete={() => setLoaded(true)} />

      {/* Main app — rendered immediately but hidden until loader exits */}
      <ReactLenis root options={{ lerp: 0.05 }}>
        <LiquidDistortion />
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
        <div className="app-container">
          {/* Orbe orgánico sutil para cumplir la cuota estética GentleRain/Aurora */}
          <div className="ambient-glow"></div>
          <div className="ambient-glow secondary"></div>
          
          <Hero />
          <Monologue />

          {/* AI Robot — lazy loaded Spline 3D scene */}
          <Suspense fallback={<div style={{ height: '100vh', background: '#000' }} />}>
            <RobotSection />
          </Suspense>

          <Features />
          <DataTunnel />
          <HorizontalShowcase />
          <Dashboard />

          {/* Heavy 3D — wrapped in Suspense, pre-initialized while loader is shown */}
          <Suspense fallback={<div style={{ height: '200vh', background: '#000' }} />}>
            <Camera3D />
          </Suspense>

          <Suspense fallback={<div style={{ height: '100vh', background: '#000' }} />}>
            <ModelVisualizer />
          </Suspense>

          <Pricing />
          <Download />
          <Footer />
        </div>
      </ReactLenis>
    </>
  );
}

export default App;
