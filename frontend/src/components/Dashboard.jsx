import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Eye, Lock, Cpu, Database, Play, CheckCircle, 
  AlertTriangle, Shield, RefreshCw, Smartphone 
} from 'lucide-react';

import cctv1 from '../assets/svivadasboard.jpeg';
import cctv2 from '../assets/svivagrabaciones.jpeg';
import cctv3 from '../assets/svivalogin.jpeg';
import cctv4 from '../assets/svivaconfig.jpeg';
import clip1 from '../assets/svivaanaliticas.jpeg';
import clip2 from '../assets/svivaanaliticas2.jpeg';
import clip3 from '../assets/dashboard-deteccion.png';

// ─────────────────────────────────────────────────────────────
// SINTETIZADOR DE AUDIO TÁCTICO PARA INTERACCIONES
// ─────────────────────────────────────────────────────────────
const playSound = {
  click: () => {
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      if (ctx.state === 'suspended') ctx.resume();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(1200, ctx.currentTime);
      gain.gain.setValueAtTime(0.008, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.05);
    } catch (e) {}
  },
  action: () => {
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      if (ctx.state === 'suspended') ctx.resume();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(800, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(1500, ctx.currentTime + 0.1);
      gain.gain.setValueAtTime(0.01, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.1);
    } catch (e) {}
  }
};

export default function Dashboard() {
  // Tabs: 'monitoring' | 'clips' | 'hardware' | 'sqlite'
  const [activeTab, setActiveTab] = useState('monitoring');
  
  // Monitoring states
  const [selectedCam, setSelectedCam] = useState(1);
  const [gridMode, setGridMode] = useState(false); // false: single camera view, true: 2x2 grid

  // Clips states
  const [selectedClip, setSelectedClip] = useState(1);
  const [isEncrypted, setIsEncrypted] = useState(false);
  const [isNotified, setIsNotified] = useState(false);

  // Common states
  const [nightVision, setNightVision] = useState(false);
  const [utcTime, setUtcTime] = useState('');
  const [npuLoad, setNpuLoad] = useState(14);
  const [npuTemp, setNpuTemp] = useState(38);

  const videoRef = useRef(null);

  // Reloj UTC
  useEffect(() => {
    const updateTime = () => {
      const d = new Date();
      setUtcTime(d.toUTCString().replace('GMT', 'UTC'));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Fluctuación de carga de hardware local
  useEffect(() => {
    const interval = setInterval(() => {
      const baseLoad = activeTab === 'monitoring' ? 18 : activeTab === 'clips' ? 24 : 12;
      const baseTemp = activeTab === 'monitoring' ? 41 : activeTab === 'clips' ? 44 : 37;
      setNpuLoad(Math.round(baseLoad + Math.random() * 4 - 2));
      setNpuTemp(Math.round(baseTemp + Math.random() * 2 - 1));
    }, 1500);
    return () => clearInterval(interval);
  }, [activeTab]);

  // Datos de las Cámaras
  const cameras = [
    { id: 1, label: 'CAM_01', name: 'ACCESO_RECEPCION', image: cctv1, filter: 'grayscale(100%) brightness(0.95)', location: 'Puerta Principal' },
    { id: 2, label: 'CAM_02', name: 'SALA_SERVIDORES', image: cctv2, filter: 'grayscale(30%) contrast(1.1) brightness(0.9)', location: 'Rack Central' },
    { id: 3, label: 'CAM_03', name: 'PERIMETRO_NORTE', image: cctv3, filter: 'grayscale(50%) contrast(1.05) brightness(0.85)', location: 'Acceso Exterior' },
    { id: 4, label: 'CAM_04', name: 'PASILLO_OFICINAS', image: cctv4, filter: 'grayscale(70%) contrast(1.2) brightness(0.95)', location: 'Pasillo C' }
  ];

  // Datos de los Clips de Alerta Grabados
  const clips = [
    { id: 1, name: 'CLIP_824_RECEPCION', title: 'Detección de Humano', cam: 'CAM_01', image: clip1, time: 'Hace 3 min', confidence: '98.4%', details: 'Sujeto ingresando fuera de horario comercial.' },
    { id: 2, name: 'CLIP_819_EXTERIOR', title: 'Cruce de Línea', cam: 'CAM_03', image: clip2, time: 'Hace 14 min', confidence: '94.2%', details: 'Objeto cruzando límite perimetral norte.' },
    { id: 3, name: 'CLIP_811_SERVIDORES', title: 'Anomalía Detectada', cam: 'CAM_02', image: clip3, time: 'Hace 45 min', confidence: '92.1%', details: 'Variación física detectada en pasillo central.' }
  ];

  // Datos de la Base de Datos SQLite Local
  const dbLogs = [
    { time: '02:26:10', id: 'EV_194', cam: 'CAM_02', event: 'HUMANO_DET', conf: '98.4%', status: 'AES_ENCRYPTED' },
    { time: '02:24:15', id: 'EV_193', cam: 'CAM_01', event: 'CRUCE_LINEA', conf: '94.2%', status: 'AES_ENCRYPTED' },
    { time: '02:15:30', id: 'EV_192', cam: 'CAM_04', event: 'OBJETO_DET', conf: '92.1%', status: 'AES_ENCRYPTED' },
    { time: '01:52:04', id: 'EV_191', cam: 'SYS', event: 'BOOT_OK', conf: '100%', status: 'OFFLINE_MODE' },
    { time: '00:00:00', id: 'EV_190', cam: 'SYS', event: 'DB_BACKUP', conf: '100%', status: 'SQLITE_SAVE' }
  ];

  return (
    <section className="edge-showcase-section" style={{ backgroundColor: '#000', color: '#fff', padding: '100px 0', borderTop: '1px solid rgba(255,255,255,0.03)', position: 'relative', overflow: 'hidden' }}>
      
      <div className="showcase-container" style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 40px', display: 'flex', flexDirection: 'column', gap: '45px' }}>
        
        {/* Cabecera Estática Elegante */}
        <div className="showcase-header" style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxWidth: '650px' }}>
          <span style={{ fontSize: '9px', fontFamily: 'monospace', letterSpacing: '3px', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase' }}>[ PREVIO DEL APARTADO DE CLIENTE ]</span>
          <h2 style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.5rem)', fontWeight: '300', fontFamily: 'var(--font-serif, serif)', color: '#fff', margin: 0, letterSpacing: '-0.01em', lineHeight: '1.2' }}>
            Consola de Control SVIVIA
          </h2>
          <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.5)', lineHeight: '1.6', margin: 0, fontWeight: '300' }}>
            Interactúa con la interfaz de administración del software. Descubre cómo se gestionan las cámaras, las alertas y la base de datos local de forma sencilla y sin nube.
          </p>
        </div>

        {/* Consola SaaS Central */}
        <div 
          className={`saas-console-frame ${nightVision ? 'night-vision' : ''}`}
          style={{
            width: '100%',
            height: '560px',
            background: '#070709',
            border: '1px solid rgba(255, 255, 255, 0.06)',
            borderRadius: '12px',
            display: 'grid',
            gridTemplateColumns: '200px 1fr',
            overflow: 'hidden',
            boxShadow: '0 30px 100px rgba(0, 0, 0, 0.85)',
            fontFamily: 'monospace'
          }}
        >
          
          {/* PANEL IZQUIERDO: Navegación del Software */}
          <div style={{ background: '#0b0b0e', borderRight: '1px solid rgba(255, 255, 255, 0.05)', padding: '20px 16px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              
              {/* Logo e Identidad */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', borderBottom: '1px solid rgba(255, 255, 255, 0.05)', paddingBottom: '14px' }}>
                <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#ef4444', animation: 'blink 1.5s infinite' }} />
                <span style={{ fontSize: '10px', fontWeight: 'bold', letterSpacing: '1.5px', color: '#fff' }}>SVIVIA // CORE</span>
              </div>

              {/* Botones de Navegación */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {[
                  { id: 'monitoring', name: 'MONITOREO VIVO', icon: <Eye size={12} /> },
                  { id: 'clips', name: 'CLIPS GRABADOS', icon: <Play size={12} /> },
                  { id: 'hardware', name: 'TELEMETRÍA NPU', icon: <Cpu size={12} /> },
                  { id: 'sqlite', name: 'BITÁCORA SQLITE', icon: <Database size={12} /> }
                ].map((tab) => {
                  const isActive = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => { playSound.click(); setActiveTab(tab.id); }}
                      style={{
                        background: isActive ? 'rgba(255, 255, 255, 0.03)' : 'transparent',
                        border: 'none',
                        borderRadius: '4px',
                        padding: '10px 12px',
                        color: isActive ? '#ef4444' : 'rgba(255, 255, 255, 0.55)',
                        fontSize: '9px',
                        fontWeight: 'bold',
                        textAlign: 'left',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        transition: 'all 0.2s ease',
                        letterSpacing: '0.5px'
                      }}
                    >
                      {tab.icon}
                      <span>{tab.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Selector de Visión Nocturna en el Menú */}
            <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.05)', paddingTop: '14px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <button
                onClick={() => { playSound.click(); setNightVision(!nightVision); }}
                style={{
                  background: nightVision ? 'rgba(16, 185, 129, 0.1)' : 'transparent',
                  border: '1px solid ' + (nightVision ? '#10b981' : 'rgba(255, 255, 255, 0.1)'),
                  borderRadius: '4px',
                  padding: '6px 10px',
                  color: nightVision ? '#10b981' : 'rgba(255, 255, 255, 0.4)',
                  fontSize: '8.5px',
                  cursor: 'pointer',
                  fontWeight: 'bold',
                  textAlign: 'center',
                  width: '100%',
                  transition: 'all 0.2s ease'
                }}
              >
                {nightVision ? 'VISIÓN NOCTURNA [ON]' : 'VISIÓN NOCTURNA'}
              </button>
              <span style={{ fontSize: '7.5px', color: 'rgba(255, 255, 255, 0.3)', textAlign: 'center', display: 'block' }}>{utcTime.split(' ')[4] || ''} UTC</span>
            </div>

          </div>

          {/* PANEL DERECHO: Vistas Dinámicas */}
          <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px', overflow: 'hidden' }}>
            
            {/* VISTA 1: MONITOREO EN VIVO */}
            {activeTab === 'monitoring' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', height: '100%', overflow: 'hidden' }}>
                {/* Header de la Vista */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '10px', fontWeight: 'bold', color: 'rgba(255,255,255,0.8)' }}>
                    CANALES DE TRANSMISIÓN LOCAL (60 FPS)
                  </span>
                  <button 
                    onClick={() => { playSound.click(); setGridMode(!gridMode); }}
                    style={{ background: 'none', border: '1px solid rgba(255,255,255,0.15)', color: '#fff', fontSize: '8.5px', padding: '4px 8px', borderRadius: '4px', cursor: 'pointer' }}
                  >
                    {gridMode ? 'VER FEED ENFOCADO' : 'VER CUADRÍCULA 2x2'}
                  </button>
                </div>

                {gridMode ? (
                  /* Cuadrícula 2x2 */
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', flex: 1 }}>
                    {cameras.map((cam) => (
                      <div 
                        key={cam.id} 
                        onClick={() => { playSound.click(); setSelectedCam(cam.id); setGridMode(false); }}
                        style={{ border: '1px solid rgba(255,255,255,0.06)', borderRadius: '8px', overflow: 'hidden', position: 'relative', cursor: 'pointer', background: '#000' }}
                      >
                        <img 
                          src={cam.image} 
                          alt={cam.name}
                          style={{ width: '100%', height: '100%', objectFit: 'cover', filter: cam.filter, opacity: 0.65 }}
                        />
                        {/* Radar sweep sutil para la cuadrícula */}
                        <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.15, pointerEvents: 'none' }} viewBox="0 0 100 100">
                          <circle cx="50" cy="50" r="40" fill="none" stroke="#ef4444" strokeWidth="0.2" strokeDasharray="1 3" />
                          <circle cx="50" cy="50" r="25" fill="none" stroke="#ef4444" strokeWidth="0.2" />
                        </svg>
                        <div className="cctv-scanline" />
                        <div style={{ position: 'absolute', bottom: '10px', left: '10px', background: 'rgba(0,0,0,0.8)', padding: '3px 6px', borderRadius: '3px', fontSize: '7.5px', color: '#fff' }}>
                          {cam.label} // {cam.name}
                        </div>
                        <div style={{ position: 'absolute', top: '10px', right: '10px', display: 'flex', alignItems: 'center', gap: '4px', background: 'rgba(0,0,0,0.8)', padding: '2px 5px', borderRadius: '3px', fontSize: '6px', color: '#ef4444', fontWeight: 'bold' }}>
                          <span style={{ width: '4px', height: '4px', borderRadius: '50%', background: '#ef4444', animation: 'blink 1s infinite' }} />
                          LIVE
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  /* Feed Único Enfocado */
                  <div style={{ display: 'grid', gridTemplateColumns: '1.8fr 1.2fr', gap: '16px', flex: 1, overflow: 'hidden' }}>
                    {/* Visualizador de Cámara */}
                    <div style={{ border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px', overflow: 'hidden', position: 'relative', background: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <img
                        src={cameras.find(c => c.id === selectedCam).image}
                        alt="CCTV FEED"
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                          filter: cameras.find(c => c.id === selectedCam).filter,
                          opacity: 0.75
                        }}
                      />
                      <div className="cctv-scanline" />
                      
                      {/* Radar Sweep interactivo */}
                      <div style={{ position: 'absolute', top: '15px', right: '15px', width: '60px', height: '60px', borderRadius: '50%', border: '1px solid rgba(239, 68, 68, 0.25)', background: 'rgba(0,0,0,0.6)', overflow: 'hidden' }}>
                        <svg style={{ width: '100%', height: '100%' }} viewBox="0 0 100 100">
                          <circle cx="50" cy="50" r="45" fill="none" stroke="#ef4444" strokeWidth="0.5" strokeDasharray="2 2" />
                          <circle cx="50" cy="50" r="25" fill="none" stroke="#ef4444" strokeWidth="0.5" />
                          <line x1="50" y1="5" x2="50" y2="95" stroke="rgba(239,68,68,0.2)" strokeWidth="0.5" />
                          <line x1="5" y1="50" x2="95" y2="50" stroke="rgba(239,68,68,0.2)" strokeWidth="0.5" />
                          <g className="radar-sweep-group">
                            <line x1="50" y1="50" x2="50" y2="5" stroke="#ef4444" strokeWidth="1.2" />
                            <path d="M 50 50 L 50 5 A 45 45 0 0 1 80 18 Z" fill="rgba(239, 68, 68, 0.2)" />
                          </g>
                        </svg>
                      </div>

                      <div style={{ position: 'absolute', bottom: '10px', left: '10px', background: 'rgba(0,0,0,0.8)', padding: '4px 8px', borderRadius: '4px', fontSize: '8px', color: '#fff', border: '1px solid rgba(255,255,255,0.1)' }}>
                        FEED EN VIVO // {cameras.find(c => c.id === selectedCam).label}
                      </div>
                      <div style={{ position: 'absolute', top: '10px', left: '10px', display: 'flex', alignItems: 'center', gap: '5px', background: 'rgba(0,0,0,0.8)', padding: '3px 6px', borderRadius: '4px', fontSize: '7px', color: '#ef4444', fontWeight: 'bold' }}>
                        <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#ef4444', animation: 'blink 1.2s infinite' }} />
                        REC ● 60.0 FPS
                      </div>
                    </div>

                    {/* Selector y Detalles del canal */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      <span style={{ fontSize: '8.5px', color: 'rgba(255,255,255,0.4)' }}>SELECCIONAR CANAL:</span>
                      <div style={{ display: 'grid', gridTemplateRows: 'repeat(4, 1fr)', gap: '8px' }}>
                        {cameras.map((cam) => {
                          const isSel = selectedCam === cam.id;
                          return (
                            <button
                              key={cam.id}
                              onClick={() => { playSound.click(); setSelectedCam(cam.id); }}
                              style={{
                                background: isSel ? 'rgba(239, 68, 68, 0.06)' : 'transparent',
                                border: '1px solid ' + (isSel ? '#ef4444' : 'rgba(255,255,255,0.1)'),
                                borderRadius: '6px',
                                padding: '10px',
                                color: isSel ? '#ef4444' : 'rgba(255,255,255,0.6)',
                                fontSize: '8.5px',
                                fontWeight: 'bold',
                                textAlign: 'left',
                                cursor: 'pointer',
                                transition: 'all 0.2s ease',
                                display: 'flex',
                                justifyContent: 'space-between'
                              }}
                            >
                              <span>{cam.label} // {cam.name}</span>
                              <span style={{ fontSize: '7.5px', color: 'rgba(255,255,255,0.4)', fontWeight: 'normal' }}>{cam.location}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* VISTA 2: CLIPS GRABADOS (DETECCIONES) */}
            {activeTab === 'clips' && (
              <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1.8fr', gap: '20px', height: '100%', overflow: 'hidden' }}>
                
                {/* Lista de Clips a la izquierda */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <span style={{ fontSize: '8.5px', color: 'rgba(255,255,255,0.4)' }}>DETECCIONES DE IA GUARDADAS:</span>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {clips.map((clip) => {
                      const isSel = selectedClip === clip.id;
                      return (
                        <div
                          key={clip.id}
                          onClick={() => { playSound.click(); setSelectedClip(clip.id); setIsEncrypted(false); setIsNotified(false); }}
                          style={{
                            border: '1px solid ' + (isSel ? '#ef4444' : 'rgba(255,255,255,0.06)'),
                            background: isSel ? 'rgba(239, 68, 68, 0.03)' : 'rgba(255,255,255,0.01)',
                            borderRadius: '8px',
                            padding: '12px',
                            cursor: 'pointer',
                            transition: 'all 0.2s ease'
                          }}
                        >
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                            <span style={{ fontSize: '9px', fontWeight: 'bold', color: '#fff' }}>{clip.title}</span>
                            <span style={{ fontSize: '7.5px', color: '#ef4444' }}>{clip.confidence}</span>
                          </div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '7.5px', color: 'rgba(255,255,255,0.4)' }}>
                            <span>{clip.cam} • {clip.name}</span>
                            <span>{clip.time}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Reproductor de Clip y Acciones Tácticas */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', height: '100%', overflow: 'hidden' }}>
                  <div style={{ border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px', overflow: 'hidden', position: 'relative', flex: 1, background: '#000' }}>
                    <img
                      src={clips.find(c => c.id === selectedClip).image}
                      alt="CLIP THUMBNAIL"
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        filter: selectedClip === 2 
                          ? 'grayscale(30%) brightness(0.8) sepia(0.2)' 
                          : selectedClip === 3
                            ? 'grayscale(10%) contrast(1.2) brightness(0.85)'
                            : 'grayscale(100%) brightness(0.9)',
                        opacity: 0.8
                      }}
                    />
                    <div className="cctv-scanline" />
                    
                    {/* Bounding box de inferencia sutil (1px) */}
                    {selectedClip === 1 && (
                      <div style={{ position: 'absolute', top: '15%', left: '10%', width: '30%', height: '55%', border: '1px solid #ef4444', boxShadow: '0 0 10px rgba(239, 68, 68, 0.3)', pointerEvents: 'none' }}>
                        <span style={{ position: 'absolute', top: '-14px', left: '-1px', color: '#ef4444', fontSize: '7px', fontWeight: 'bold', fontFamily: 'monospace', background: 'rgba(0,0,0,0.85)', padding: '1px 4px', border: '1px solid rgba(239,68,68,0.2)' }}>HUMANO // 98.4%</span>
                      </div>
                    )}
                    {selectedClip === 2 && (
                      <>
                        <div style={{ position: 'absolute', top: '55%', left: '0%', width: '100%', height: '1px', borderTop: '1px dashed #ef4444', pointerEvents: 'none' }}>
                          <span style={{ position: 'absolute', top: '-12px', left: '10px', color: '#ef4444', fontSize: '7px', fontWeight: 'bold', fontFamily: 'monospace', background: 'rgba(0,0,0,0.85)', padding: '1px 4px' }}>LÍNEA DE CRUCE PERIMETRAL</span>
                        </div>
                        <div style={{ position: 'absolute', top: '48%', left: '45%', width: '12%', height: '22%', border: '1px solid #ef4444', boxShadow: '0 0 10px rgba(239, 68, 68, 0.3)', pointerEvents: 'none' }}>
                          <span style={{ position: 'absolute', top: '-14px', left: '-1px', color: '#ef4444', fontSize: '7px', fontWeight: 'bold', fontFamily: 'monospace', background: 'rgba(0,0,0,0.85)', padding: '1px 4px', border: '1px solid rgba(239,68,68,0.2)' }}>VEHÍCULO // 94.2%</span>
                        </div>
                      </>
                    )}
                    {selectedClip === 3 && (
                      <div style={{ position: 'absolute', top: '40%', left: '35%', width: '25%', height: '35%', border: '1px solid #3b82f6', boxShadow: '0 0 10px rgba(59, 130, 246, 0.3)', pointerEvents: 'none' }}>
                        <span style={{ position: 'absolute', top: '-14px', left: '-1px', color: '#3b82f6', fontSize: '7px', fontWeight: 'bold', fontFamily: 'monospace', background: 'rgba(0,0,0,0.85)', padding: '1px 4px', border: '1px solid rgba(59,130,246,0.2)' }}>OBJETO // ANOMALÍA 92.1%</span>
                      </div>
                    )}
                  </div>

                  {/* Acciones de Mitigación del Evento */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                    <button
                      onClick={() => { playSound.action(); setIsEncrypted(true); }}
                      style={{
                        background: isEncrypted ? 'rgba(16, 185, 129, 0.08)' : 'transparent',
                        border: '1px solid ' + (isEncrypted ? '#10b981' : 'rgba(255,255,255,0.15)'),
                        color: isEncrypted ? '#10b981' : '#fff',
                        fontSize: '8px',
                        padding: '8px',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontWeight: 'bold',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '6px'
                      }}
                    >
                      <Lock size={10} />
                      <span>{isEncrypted ? 'EVIDENCIA EXPORTADA' : 'EXPORTAR CIFRADO (AES)'}</span>
                    </button>
                    <button
                      onClick={() => { playSound.action(); setIsNotified(true); }}
                      style={{
                        background: isNotified ? 'rgba(59, 130, 246, 0.08)' : 'transparent',
                        border: '1px solid ' + (isNotified ? '#3b82f6' : 'rgba(255,255,255,0.15)'),
                        color: isNotified ? '#3b82f6' : '#fff',
                        fontSize: '8px',
                        padding: '8px',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontWeight: 'bold',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '6px'
                      }}
                    >
                      <Smartphone size={10} />
                      <span>{isNotified ? 'NOTIFICADO TELEGRAM' : 'ALERTA A TELEGRAM'}</span>
                    </button>
                  </div>
                </div>

              </div>
            )}

            {/* VISTA 3: TELEMETRÍA DEL PROCESADOR NPU */}
            {activeTab === 'hardware' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', height: '100%' }}>
                <span style={{ fontSize: '10px', fontWeight: 'bold', color: 'rgba(255,255,255,0.8)' }}>
                  ESTADO DE HARDWARE LOCAL Y ACELERADOR NPU
                </span>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  {/* Carga del Acelerador */}
                  <div style={{ border: '1px solid rgba(255,255,255,0.06)', borderRadius: '8px', padding: '16px', background: 'rgba(255,255,255,0.01)' }}>
                    <div style={{ fontSize: '8px', color: 'rgba(255,255,255,0.4)', marginBottom: '8px' }}>CARGA NPU (INFERENCIA PARALELA):</div>
                    <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#fff', marginBottom: '10px' }}>{npuLoad}%</div>
                    <div style={{ width: '100%', height: '4px', background: 'rgba(255,255,255,0.06)', borderRadius: '2px', overflow: 'hidden' }}>
                      <div style={{ width: `${npuLoad}%`, height: '100%', background: '#ef4444', transition: 'width 0.4s ease' }} />
                    </div>
                  </div>

                  {/* Temperatura */}
                  <div style={{ border: '1px solid rgba(255,255,255,0.06)', borderRadius: '8px', padding: '16px', background: 'rgba(255,255,255,0.01)' }}>
                    <div style={{ fontSize: '8px', color: 'rgba(255,255,255,0.4)', marginBottom: '8px' }}>TEMPERATURA NPU CORE:</div>
                    <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#fff', marginBottom: '10px' }}>{npuTemp}°C</div>
                    <div style={{ width: '100%', height: '4px', background: 'rgba(255,255,255,0.06)', borderRadius: '2px', overflow: 'hidden' }}>
                      <div style={{ width: `${(npuTemp / 80) * 100}%`, height: '100%', background: '#10b981', transition: 'width 0.4s ease' }} />
                    </div>
                  </div>
                </div>

                {/* Métricas Adicionales del Modelo */}
                <div style={{ border: '1px solid rgba(255,255,255,0.06)', borderRadius: '8px', padding: '16px', background: 'rgba(255,255,255,0.01)', display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '14px', fontSize: '9px' }}>
                  <div>
                    <span style={{ color: 'rgba(255,255,255,0.4)' }}>LATENCIA:</span>
                    <div style={{ color: '#10b981', fontWeight: 'bold', fontSize: '11px', marginTop: '4px' }}>4.2 ms</div>
                  </div>
                  <div>
                    <span style={{ color: 'rgba(255,255,255,0.4)' }}>VELOCIDAD FRAME:</span>
                    <div style={{ color: '#fff', fontSize: '11px', marginTop: '4px' }}>60.0 FPS / CANAL</div>
                  </div>
                  <div>
                    <span style={{ color: 'rgba(255,255,255,0.4)' }}>ESTADO RED WAN:</span>
                    <div style={{ color: '#ef4444', fontWeight: 'bold', fontSize: '11px', marginTop: '4px' }}>CONEXIÓN DESACTIVADA</div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', border: '1px solid rgba(16, 185, 129, 0.15)', background: 'rgba(16, 185, 129, 0.03)', padding: '10px 14px', borderRadius: '8px', fontSize: '8px', color: 'rgba(16, 185, 129, 0.85)' }}>
                  <Shield size={12} />
                  <span>PREPARADO PARA FALLO DE ENERGÍA: EL PROCESADOR REDUCE EL CONSUMO A MODO AHORRO SIN AFECTAR LA PRECISIÓN Y OPERA TOTALMENTE CON BATERÍA LOCAL.</span>
                </div>
              </div>
            )}

            {/* VISTA 4: BITÁCORA SQLITE LOCAL */}
            {activeTab === 'sqlite' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', height: '100%', overflow: 'hidden' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '10px', fontWeight: 'bold', color: 'rgba(255,255,255,0.8)' }}>
                    INSPECTOR DE BASE DE DATOS LOCAL (svivia_local.db)
                  </span>
                  <span style={{ fontSize: '7.5px', color: '#10b981' }}>● SQLITE OPERATIVO</span>
                </div>

                {/* Tabla de Base de Datos */}
                <div style={{ flex: 1, border: '1px solid rgba(255,255,255,0.06)', borderRadius: '8px', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                  {/* Header de Tabla */}
                  <div style={{ display: 'grid', gridTemplateColumns: '80px 70px 80px 100px 1fr', background: 'rgba(255,255,255,0.03)', padding: '8px 12px', borderBottom: '1px solid rgba(255,255,255,0.06)', fontSize: '8px', color: 'rgba(255,255,255,0.4)', fontWeight: 'bold' }}>
                    <span>HORA</span>
                    <span>EVENTO</span>
                    <span>CANAL</span>
                    <span>CONFIDENCIA</span>
                    <span>ESTADO REGISTRO</span>
                  </div>

                  {/* Cuerpo de Tabla */}
                  <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
                    {dbLogs.map((log, idx) => (
                      <div 
                        key={idx} 
                        style={{ 
                          display: 'grid', 
                          gridTemplateColumns: '80px 70px 80px 100px 1fr', 
                          padding: '10px 12px', 
                          borderBottom: '1px solid rgba(255,255,255,0.03)', 
                          fontSize: '8px', 
                          color: 'rgba(255,255,255,0.7)',
                          alignItems: 'center'
                        }}
                      >
                        <span style={{ color: 'rgba(255,255,255,0.45)' }}>{log.time}</span>
                        <span style={{ color: log.event.includes('SYS') ? '#fff' : '#ef4444', fontWeight: 'bold' }}>{log.id}</span>
                        <span>{log.cam}</span>
                        <span>{log.conf}</span>
                        <span style={{ color: log.status === 'AES_ENCRYPTED' ? '#10b981' : '#fff' }}>{log.status}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div style={{ fontSize: '7.5px', color: 'rgba(255,255,255,0.4)', textAlign: 'left' }}>
                  Nota: Al operar en modo local, toda la escritura se realiza en el almacenamiento de estado sólido integrado. Los clips se purgan automáticamente cada 14 días.
                </div>
              </div>
            )}

          </div>

        </div>

      </div>

      <style>{`
        @keyframes blink {
          0% { opacity: 0.35; }
          50% { opacity: 1; }
          100% { opacity: 0.35; }
        }
        @keyframes radar-sweep {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .radar-sweep-group {
          transform-origin: 50px 50px;
          animation: radar-sweep 5s linear infinite;
        }
        
        .cctv-scanline {
          position: absolute;
          left: 0;
          width: 100%;
          height: 2px;
          background: rgba(239, 68, 68, 0.35);
          box-shadow: 0 0 8px rgba(239, 68, 68, 0.8);
          opacity: 0.7;
          pointer-events: none;
          animation: scanline-move 4s linear infinite;
        }
        @keyframes scanline-move {
          0% { top: 0%; }
          100% { top: 100%; }
        }
        
        /* Overrides para el modo visión nocturna dentro del iframe simulado */
        .saas-console-frame.night-vision {
          border-color: rgba(57, 255, 20, 0.25) !important;
          box-shadow: 0 30px 100px rgba(57, 255, 20, 0.06) !important;
        }
      `}</style>
    </section>
  );
}
