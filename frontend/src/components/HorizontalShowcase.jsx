import React, { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Eye, Server, Lock, Smartphone, Play, Volume2, ArrowLeft, Send } from 'lucide-react';
import DecryptedText from './DecryptedText';
import alertImage from '../assets/ALERTAS-TELEGRAM.jpeg';

function IPhoneSimulator() {
  const [phoneState, setPhoneState] = useState('locked'); // 'locked', 'unlocked'
  const [notificationActive, setNotificationActive] = useState(false);
  const [isVibrating, setIsVibrating] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [showFullscreen, setShowFullscreen] = useState(false);
  const [currentTime, setCurrentTime] = useState('');
  const [currentDate, setCurrentDate] = useState('');

  // Sincroniza la hora exacta del usuario en tiempo real
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      let hours = now.getHours().toString().padStart(2, '0');
      let minutes = now.getMinutes().toString().padStart(2, '0');
      setCurrentTime(`${hours}:${minutes}`);

      const options = { weekday: 'long', month: 'long', day: 'numeric' };
      setCurrentDate(now.toLocaleDateString('es-ES', options));
    };
    updateTime();
    const interval = setInterval(updateTime, 60000);
    return () => clearInterval(interval);
  }, []);

  // Generador de tono retro-táctico auto-contenido usando Web Audio API
  const playAlertSound = () => {
    if (!soundEnabled) return;
    try {
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const playBeep = (freq, duration, delay) => {
        setTimeout(() => {
          const osc = audioCtx.createOscillator();
          const gain = audioCtx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
          
          gain.gain.setValueAtTime(0.08, audioCtx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + duration - 0.02);
          
          osc.connect(gain);
          gain.connect(audioCtx.destination);
          
          osc.start();
          osc.stop(audioCtx.currentTime + duration);
        }, delay * 1000);
      };
      
      playBeep(980, 0.15, 0);
      playBeep(1200, 0.25, 0.12);
    } catch (e) {
      console.warn("Web Audio API blocked or not supported: ", e);
    }
  };

  const triggerInference = () => {
    setPhoneState('locked');
    setNotificationActive(false);
    setShowFullscreen(false);
    
    setIsVibrating(true);
    playAlertSound();
    
    setTimeout(() => {
      setIsVibrating(false);
      setNotificationActive(true);
    }, 800);
  };

  const handleNotificationClick = () => {
    setNotificationActive(false);
    setPhoneState('unlocked');
  };

  return (
    <div style={{ display: 'flex', width: '100%', height: '100%' }}>
      {/* Columna Izquierda: Panel de Control Técnico (40%) */}
      <div style={{ flex: 1.2, padding: '4rem 3rem 4rem 4rem', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <Smartphone size={48} color="#4f46e5" style={{ marginBottom: '1.5rem' }} />
        <h3 className="poetic-feature-title" style={{ fontSize: '2.5rem', marginBottom: '1rem', color: '#fff' }}>
          Alertas Telegram.
        </h3>
        <p style={{ color: '#a3a3a3', fontSize: '1.05rem', lineHeight: 1.6, marginBottom: '2rem' }}>
          Sincronización táctica con despacho instantáneo. Al ocurrir una intrusión o anomalía, la inferencia local YOLOv8 despacha un paquete encriptado a tu Telegram con total telemetría y evidencia visual.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
          <button 
            onClick={triggerInference}
            className="btn-minimal" 
            style={{ 
              background: 'linear-gradient(135deg, #4f46e5 0%, #1e1b4b 100%)',
              border: '1px solid rgba(255,255,255,0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '12px',
              padding: '1rem 2rem',
              borderRadius: '8px',
              fontSize: '0.85rem',
              letterSpacing: '0.08em',
              fontWeight: 600
            }}
          >
            <Play size={16} fill="#fff" /> SIMULAR INFERENCIA
          </button>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Volume2 size={16} color={soundEnabled ? "#10b981" : "#737373"} />
            <span style={{ fontSize: '0.85rem', color: '#737373' }}>
              Tono de Alerta: <strong>{soundEnabled ? "Activado" : "Silenciado"}</strong>
            </span>
            <button 
              onClick={() => setSoundEnabled(!soundEnabled)}
              style={{ 
                background: 'none', border: 'none', color: '#4f46e5', 
                fontSize: '0.85rem', textDecoration: 'underline', marginLeft: 'auto',
                cursor: 'pointer'
              }}
            >
              {soundEnabled ? "Silenciar" : "Activar"}
            </button>
          </div>

          {/* Indicador de Ondas de sonido táctico */}
          <div className="cyber-sound-indicator" style={{ height: '30px' }}>
            <div className={`cyber-sound-dot ${isVibrating ? 'active' : ''}`} style={{ animationDelay: '0.1s' }}></div>
            <div className={`cyber-sound-dot ${isVibrating ? 'active' : ''}`} style={{ animationDelay: '0.3s' }}></div>
            <div className={`cyber-sound-dot ${isVibrating ? 'active' : ''}`} style={{ animationDelay: '0.5s' }}></div>
            <div className={`cyber-sound-dot ${isVibrating ? 'active' : ''}`} style={{ animationDelay: '0.2s' }}></div>
            <div className={`cyber-sound-dot ${isVibrating ? 'active' : ''}`} style={{ animationDelay: '0.4s' }}></div>
          </div>
        </div>
      </div>

      {/* Columna Derecha: iPhone Mockup en Vidrio CSS (60%) */}
      <div style={{ flex: 1.8, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'radial-gradient(circle at center, rgba(79,70,229,0.12) 0%, transparent 70%)', borderLeft: '1px solid rgba(255,255,255,0.03)' }}>
        <div className="iphone-container">
          <div className={`iphone-shell ${isVibrating ? 'vibrating' : ''}`}>
            
            {/* Dynamic Island */}
            <div className={`iphone-dynamic-island ${notificationActive ? 'expanded' : ''}`} onClick={() => notificationActive && handleNotificationClick()}>
              {notificationActive ? (
                <div style={{ display: 'flex', alignItems: 'center', width: '100%', gap: '10px', height: '100%' }}>
                  <div style={{ width: '22px', height: '22px', borderRadius: '50%', background: '#229ED9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <span style={{ fontSize: '11px', fontWeight: 'bold', color: '#fff' }}>✈</span>
                  </div>
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', textAlign: 'left' }}>
                    <span style={{ fontSize: '10px', color: '#8b5cf6', fontWeight: 600, lineHeight: 1 }}>SVIVIA SECURE</span>
                    <span style={{ fontSize: '11px', color: '#fff', fontWeight: 'bold', lineHeight: 1.2 }}>⚠️ ALERTA DE AMENAZA</span>
                  </div>
                  <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#ef4444' }}></div>
                </div>
              ) : null}
            </div>

            <div className="iphone-screen">
              
              {/* LOCKSCREEN VIEW */}
              {phoneState === 'locked' && (
                <div className="iphone-lockscreen">
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <Lock size={16} className="iphone-lock-icon" style={{ color: 'rgba(255,255,255,0.6)' }} />
                    <div className="iphone-time">{currentTime}</div>
                    <div className="iphone-date">{currentDate}</div>
                  </div>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', zIndex: 10 }}>
                    <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      Pulsar botón de inferencia
                    </div>
                  </div>
                </div>
              )}

              {/* LOCKSCREEN NOTIFICATION POPUP */}
              {phoneState === 'locked' && notificationActive && (
                <div className="iphone-alert-banner" onClick={handleNotificationClick}>
                  <div className="tg-alert-icon">
                    <span style={{ fontSize: '18px', fontWeight: 'bold', color: '#fff' }}>✈</span>
                  </div>
                  <div className="tg-alert-content">
                    <div className="tg-alert-header">
                      <span className="tg-alert-title">Telegram • SVIVIA AI</span>
                      <span className="tg-alert-time">ahora</span>
                    </div>
                    <span className="tg-alert-body">⚠️ ALERTA: Detección Humana Confirmada en Zona Perimetral Norte.</span>
                    <span className="tg-alert-action">Tocar para ver telemetría y foto...</span>
                  </div>
                </div>
              )}

              {/* TELEGRAM CHAT VIEW */}
              {phoneState === 'unlocked' && (
                <div className="iphone-tg-chat">
                  
                  {/* Header */}
                  <div className="tg-header">
                    <ArrowLeft size={16} className="tg-back-arrow" onClick={() => setPhoneState('locked')} />
                    <div className="tg-avatar">SV</div>
                    <div className="tg-user-info">
                      <span className="tg-username">SVIVIA Secure Bot</span>
                      <span className="tg-status">en línea</span>
                    </div>
                  </div>

                  {/* Message Stream */}
                  <div className="tg-messages-area">
                    <div className="tg-message">
                      <span style={{ fontWeight: 'bold', color: '#ef4444', fontSize: '0.8rem' }}>🚨 DETECCIÓN DE INTRUSO</span>
                      <span>Se ha capturado una amenaza humana en el feed de seguridad.</span>
                      
                      <div className="tg-telemetry">
                        <div>SISTEMA: SVIVIA-TacticalEdge</div>
                        <div>OBJETO: Humano (Confidence: 98.4%)</div>
                        <div>HORA: {currentTime}</div>
                        <div>IP DETECTADA: 192.168.1.189</div>
                        <div>CANAL: Cámara N1 (Norte)</div>
                        <div>CIFRADO: AES-GCM 256bit</div>
                      </div>

                      <div className="tg-alert-card" onClick={() => setShowFullscreen(true)}>
                        <img src={alertImage} className="tg-alert-image" alt="Inferencia Táctica" />
                        <div style={{ padding: '6px', background: '#090d16', fontSize: '0.65rem', color: '#6366f1', textAlign: 'center', fontWeight: 600 }}>
                          Pulsar para ampliar imagen
                        </div>
                      </div>

                      <span className="tg-message-time">{currentTime}</span>
                    </div>
                  </div>

                  {/* Input Block */}
                  <div className="tg-footer-input">
                    <div className="tg-input-box">Canal seguro cifrado...</div>
                    <Send size={14} className="tg-send-icon" />
                  </div>
                </div>
              )}

              {/* Fullscreen Overlay inside iPhone Frame */}
              {showFullscreen && (
                <div className="iphone-fullscreen-modal">
                  <img src={alertImage} className="iphone-fullscreen-img" alt="Zoom Inferencia" />
                  <button className="iphone-fullscreen-close" onClick={() => setShowFullscreen(false)}>
                    CERRAR IMAGEN
                  </button>
                </div>
              )}

              {/* Bottom Home Indicator */}
              <div 
                className="iphone-bottom-bar" 
                onClick={() => phoneState === 'unlocked' && setPhoneState('locked')} 
                style={{ cursor: 'pointer' }}
              ></div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function HorizontalShowcase() {
  const targetRef = useRef(null);
  
  const { scrollYProgress } = useScroll({
    target: targetRef,
  });

  const entryScale = useTransform(scrollYProgress, [0, 0.2], [0.8, 1]);
  const entryOpacity = useTransform(scrollYProgress, [0, 0.15], [0, 1]);
  const x = useTransform(scrollYProgress, [0, 1], ["0%", "-75%"]);

  return (
    <section ref={targetRef} style={{ height: '400vh', position: 'relative', background: '#000' }}>
      
      {/* Contenedor Sticky */}
      <motion.div 
        style={{ 
          position: 'sticky', top: 0, height: '100vh', 
          display: 'flex', alignItems: 'center', overflow: 'hidden',
          scale: entryScale,
          opacity: entryOpacity
        }}
      >
        
        {/* Título fijo */}
        <div style={{ position: 'absolute', top: '15vh', left: '5vw', zIndex: 10 }}>
            <h2 className="poetic-title-huge" style={{ fontSize: '3vw', color: '#fff' }}>
              <DecryptedText text="El Flujo de Trabajo." />
            </h2>
            <div style={{ width: '50px', height: '2px', background: '#4f46e5', marginTop: '1rem' }}></div>
        </div>

        {/* 
          El Tren Horizontal: 
          Su ancho total es 400vw (4 pantallas), movemos el contenedor hacia la izquierda (-75%)
        */}
        <motion.div style={{ x, display: 'flex', width: '400vw', paddingLeft: '5vw' }}>
          
          {/* Tarjeta 1 */}
          <div style={{ width: '100vw', display: 'flex', alignItems: 'center', justifyContent: 'flex-start' }}>
             <div style={{ width: '70vw', height: '60vh', background: 'linear-gradient(145deg, rgba(20,20,20,1) 0%, rgba(5,5,5,1) 100%)', borderRadius: '32px', border: '1px solid rgba(255,255,255,0.05)', display: 'flex', overflow: 'hidden', boxShadow: '0 30px 60px rgba(0,0,0,0.5)' }}>
                <div style={{ flex: 1, padding: '4rem', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                   <Eye size={48} color="#4f46e5" style={{ marginBottom: '2rem' }} />
                   <h3 className="poetic-feature-title" style={{ fontSize: '3rem', marginBottom: '1rem' }}>Captura RTSP.</h3>
                   <p style={{ color: '#a3a3a3', fontSize: '1.2rem', lineHeight: 1.6 }}>Nos conectamos directamente al flujo de video crudo de tus cámaras IP existentes sin añadir latencia.</p>
                </div>
                <div style={{ flex: 1, background: 'radial-gradient(circle at center, rgba(79,70,229,0.2) 0%, transparent 70%)', borderLeft: '1px solid rgba(255,255,255,0.05)' }}></div>
             </div>
          </div>

          {/* Tarjeta 2 */}
          <div style={{ width: '100vw', display: 'flex', alignItems: 'center', justifyContent: 'flex-start' }}>
             <div style={{ width: '70vw', height: '60vh', background: 'linear-gradient(145deg, rgba(20,20,20,1) 0%, rgba(5,5,5,1) 100%)', borderRadius: '32px', border: '1px solid rgba(255,255,255,0.05)', display: 'flex', overflow: 'hidden', boxShadow: '0 30px 60px rgba(0,0,0,0.5)' }}>
                <div style={{ flex: 1, padding: '4rem', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                   <Server size={48} color="#4f46e5" style={{ marginBottom: '2rem' }} />
                   <h3 className="poetic-feature-title" style={{ fontSize: '3rem', marginBottom: '1rem' }}>Inferencia YOLOv8.</h3>
                   <p style={{ color: '#a3a3a3', fontSize: '1.2rem', lineHeight: 1.6 }}>El hardware local toma el control. Redes neuronales convolucionales analizan los frames en milisegundos buscando amenazas.</p>
                </div>
                <div style={{ flex: 1, background: 'radial-gradient(circle at center, rgba(79,70,229,0.2) 0%, transparent 70%)', borderLeft: '1px solid rgba(255,255,255,0.05)' }}></div>
             </div>
          </div>

          {/* Tarjeta 3 */}
          <div style={{ width: '100vw', display: 'flex', alignItems: 'center', justifyContent: 'flex-start' }}>
             <div style={{ width: '70vw', height: '60vh', background: 'linear-gradient(145deg, rgba(20,20,20,1) 0%, rgba(5,5,5,1) 100%)', borderRadius: '32px', border: '1px solid rgba(255,255,255,0.05)', display: 'flex', overflow: 'hidden', boxShadow: '0 30px 60px rgba(0,0,0,0.5)' }}>
                <div style={{ flex: 1, padding: '4rem', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                   <Lock size={48} color="#4f46e5" style={{ marginBottom: '2rem' }} />
                   <h3 className="poetic-feature-title" style={{ fontSize: '3rem', marginBottom: '1rem' }}>Criptografía.</h3>
                   <p style={{ color: '#a3a3a3', fontSize: '1.2rem', lineHeight: 1.6 }}>La evidencia se encripta inmediatamente. No hay servidores intermedios, tu privacidad está sellada herméticamente.</p>
                </div>
                <div style={{ flex: 1, background: 'radial-gradient(circle at center, rgba(79,70,229,0.2) 0%, transparent 70%)', borderLeft: '1px solid rgba(255,255,255,0.05)' }}></div>
             </div>
          </div>

          {/* Tarjeta 4: iOS Alert Simulator */}
          <div style={{ width: '100vw', display: 'flex', alignItems: 'center', justifyContent: 'flex-start' }}>
             <div style={{ width: '70vw', height: '60vh', background: 'linear-gradient(145deg, rgba(15,15,15,1) 0%, rgba(5,5,5,1) 100%)', borderRadius: '32px', border: '1px solid rgba(255,255,255,0.05)', display: 'flex', overflow: 'hidden', boxShadow: '0 30px 60px rgba(0,0,0,0.6)' }}>
                <IPhoneSimulator />
             </div>
          </div>

        </motion.div>
      </motion.div>
    </section>
  );
}
