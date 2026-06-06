import React, { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { 
  Eye, Server, Lock, Smartphone, Play, Volume2, 
  ArrowLeft, Send, ShieldAlert, Clock, UserCheck, Cpu, HelpCircle 
} from 'lucide-react';
import DecryptedText from './DecryptedText';

// Importar imágenes reales de los assets
import alertImage from '../assets/ALERTAS-TELEGRAM.jpeg';
import tommyImage from '../assets/tommy-lindo.jpeg';
import configImage from '../assets/svivaconfig.jpeg';
import recordingsImage from '../assets/svivagrabaciones.jpeg';
import dashboardImage1 from '../assets/svivadasboard.jpeg';
import dashboardImage2 from '../assets/svivadashboard2.jpeg';
import svivaLogo from '../assets/logo.png';

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
      <div style={{ flex: 1.2, padding: '3.5rem 2.5rem 3.5rem 3.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <Smartphone size={40} color="#ef4444" style={{ marginBottom: '1.2rem' }} />
        <span style={{ fontSize: '0.7rem', color: '#ef4444', fontFamily: 'monospace', fontWeight: 700, letterSpacing: '2px', marginBottom: '0.4rem' }}>
          ALERT_BOT.PY & EVENT_AGGREGATOR.PY
        </span>
        <h3 className="poetic-feature-title" style={{ fontSize: '2.2rem', marginBottom: '0.8rem', color: '#fff', lineHeight: 1.1 }}>
          Alertas Telegram.
        </h3>
        <p style={{ color: '#a3a3a3', fontSize: '0.95rem', lineHeight: 1.5, marginBottom: '1.8rem' }}>
          Sincronización en tiempo real directo a Telegram. El filtro anti-spam agrupa detecciones continuas del motor de seguridad para mantener tu historial limpio y libre de spam.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <button 
            onClick={triggerInference}
            className="btn-minimal" 
            style={{ 
              background: 'linear-gradient(135deg, #ef4444 0%, #7f1d1d 100%)',
              border: '1px solid rgba(255,255,255,0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '12px',
              padding: '0.9rem 1.8rem',
              borderRadius: '8px',
              fontSize: '0.8rem',
              letterSpacing: '0.08em',
              fontWeight: 600,
              color: '#fff'
            }}
          >
            <Play size={14} fill="#fff" /> SIMULAR INFERENCIA
          </button>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Volume2 size={16} color={soundEnabled ? "#ef4444" : "#737373"} />
            <span style={{ fontSize: '0.8rem', color: '#737373' }}>
              Tono de Alerta: <strong>{soundEnabled ? "Activado" : "Silenciado"}</strong>
            </span>
            <button 
              onClick={() => setSoundEnabled(!soundEnabled)}
              style={{ 
                background: 'none', border: 'none', color: '#ef4444', 
                fontSize: '0.8rem', textDecoration: 'underline', marginLeft: 'auto',
                cursor: 'pointer'
              }}
            >
              {soundEnabled ? "Silenciar" : "Activar"}
            </button>
          </div>

          {/* Indicador de Ondas de sonido táctico */}
          <div className="cyber-sound-indicator" style={{ height: '20px' }}>
            <div className={`cyber-sound-dot ${isVibrating ? 'active' : ''}`} style={{ animationDelay: '0.1s' }}></div>
            <div className={`cyber-sound-dot ${isVibrating ? 'active' : ''}`} style={{ animationDelay: '0.3s' }}></div>
            <div className={`cyber-sound-dot ${isVibrating ? 'active' : ''}`} style={{ animationDelay: '0.5s' }}></div>
            <div className={`cyber-sound-dot ${isVibrating ? 'active' : ''}`} style={{ animationDelay: '0.2s' }}></div>
            <div className={`cyber-sound-dot ${isVibrating ? 'active' : ''}`} style={{ animationDelay: '0.4s' }}></div>
          </div>
        </div>
      </div>

      {/* Columna Derecha: iPhone Mockup en Vidrio CSS (60%) */}
      <div style={{ flex: 1.8, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'radial-gradient(circle at center, rgba(239,68,68,0.1) 0%, transparent 70%)', borderLeft: '1px solid rgba(255,255,255,0.03)' }}>
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
                    <span style={{ fontSize: '9px', color: '#ef4444', fontWeight: 600, lineHeight: 1 }}>SVIVIA ACTIVE</span>
                    <span style={{ fontSize: '10px', color: '#fff', fontWeight: 'bold', lineHeight: 1.2 }}>⚠️ ALERTA: SOSPECHOSO</span>
                  </div>
                  <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#ef4444' }}></div>
                </div>
              ) : null}
            </div>

            <div className="iphone-screen">
              
              {/* LOCKSCREEN VIEW */}
              {phoneState === 'locked' && (
                <div className="iphone-lockscreen">
                  {/* SVIVA Logo Wallpaper Watermark */}
                  <div 
                    style={{
                      position: 'absolute',
                      inset: 0,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      opacity: 0.12,
                      pointerEvents: 'none',
                      zIndex: 0
                    }}
                  >
                    <img 
                      src={svivaLogo} 
                      alt="" 
                      style={{ 
                        width: '70%', 
                        height: 'auto', 
                        objectFit: 'contain',
                        filter: 'brightness(0) invert(1)'
                      }} 
                    />
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', zIndex: 1 }}>
                    <Lock size={14} className="iphone-lock-icon" style={{ color: 'rgba(255,255,255,0.6)' }} />
                    <div className="iphone-time">{currentTime}</div>
                    <div className="iphone-date">{currentDate}</div>
                  </div>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', zIndex: 1 }}>
                    <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      Simular alerta de intruso
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
                    <span className="tg-alert-action">Tocar para ver telemetría y evidencia...</span>
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
                      <span style={{ fontWeight: 'bold', color: '#ef4444', fontSize: '0.75rem' }}>🚨 INTRUSIÓN CAPTURADA</span>
                      <span>Se ha detectado una amenaza humana en el feed de seguridad.</span>
                      
                      <div className="tg-telemetry">
                        <div>SISTEMA: SVIVIA-TacticalEdge</div>
                        <div>MÓDULO: detector.py + alert_bot.py</div>
                        <div>OBJETO: Humano (Confidence: 98.4%)</div>
                        <div>HORA: {currentTime}</div>
                        <div>CANAL: Cámara N1 (Norte)</div>
                        <div>AGRUPACIÓN: event_aggregator.py</div>
                      </div>

                      <div className="tg-alert-card" onClick={() => setShowFullscreen(true)}>
                        <img src={alertImage} className="tg-alert-image" alt="Inferencia Táctica" />
                        <div style={{ padding: '6px', background: '#090d16', fontSize: '0.65rem', color: '#ef4444', textAlign: 'center', fontWeight: 600 }}>
                          Pulsar para ampliar imagen
                        </div>
                      </div>

                      <span className="tg-message-time">{currentTime}</span>
                    </div>
                  </div>

                  {/* Input Block */}
                  <div className="tg-footer-input">
                    <div className="tg-input-box">Canal cifrado Cloudflare...</div>
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

  const entryScale = useTransform(scrollYProgress, [0, 0.08], [0.88, 1]);
  const entryOpacity = useTransform(scrollYProgress, [0, 0.07], [0, 1]);
  const entryRadius = useTransform(scrollYProgress, [0, 0.08], ['28px', '0px']);

  // Exit morphing: section collapses back into a card at the end
  const exitScale = useTransform(scrollYProgress, [0.92, 1], [1, 0.88]);
  const exitRadius = useTransform(scrollYProgress, [0.92, 1], ['0px', '28px']);
  const exitOpacity = useTransform(scrollYProgress, [0.94, 1], [1, 0]);

  // Combine entry + exit scale and radius
  const combinedScale = useTransform(
    [entryScale, exitScale],
    ([entry, exit]) => entry * exit
  );
  const combinedRadius = useTransform(
    [entryRadius, exitRadius],
    ([entry, exit]) => exit !== '0px' ? exit : entry
  );
  
  // Mover el tren horizontal (8 tarjetas -> 800vw. Desplazamiento de 0% a -87.5% para cubrir las 8 pantallas)
  const x = useTransform(scrollYProgress, [0, 1], ["0%", "-87.5%"]);

  return (
    <section ref={targetRef} style={{ height: '750vh', position: 'relative', background: '#000' }}>
      
      {/* Contenedor Sticky */}
      <motion.div 
        style={{ 
          position: 'sticky', top: 0, height: '100vh', 
          display: 'flex', alignItems: 'center', overflow: 'hidden',
          scale: combinedScale,
          opacity: entryOpacity,
          borderRadius: combinedRadius,
        }}
      >
        
        {/* Título fijo */}
        <div style={{ position: 'absolute', top: '12vh', left: '5vw', zIndex: 10 }}>
            <h2 className="poetic-title-huge" style={{ fontSize: '3vw', color: '#fff' }}>
              <DecryptedText text="Características de Operación." />
            </h2>
            <div style={{ width: '60px', height: '2px', background: '#ef4444', marginTop: '0.8rem' }}></div>
        </div>

        {/* El Tren Horizontal: 800vw de ancho total */}
        <motion.div style={{ x, display: 'flex', width: '800vw', paddingLeft: '5vw' }}>
          
          {/* Tarjeta 1: Ojos Inteligentes (detector.py) */}
          <div style={{ width: '100vw', display: 'flex', alignItems: 'center', justifyContent: 'flex-start' }}>
             <div className="horizontal-feature-card">
                <div className="horizontal-card-text">
                   <Eye size={40} color="#ef4444" style={{ marginBottom: '1.5rem' }} />
                   <span className="horizontal-card-script">DETECTOR.PY // LIVE OBJECT DETECTION</span>
                   <h3 className="poetic-feature-title" style={{ fontSize: '2.5rem', marginBottom: '1rem', color: '#fff' }}>Ojos Inteligentes.</h3>
                   <p style={{ color: '#a3a3a3', fontSize: '1.05rem', lineHeight: 1.6 }}>
                     En lugar de grabaciones pasivas, SVIVA analiza cada segundo de grabación distinguiendo con precisión entre humanos, vehículos, motocicletas y animales en tiempo real.
                   </p>
                </div>
                <div className="horizontal-card-media">
                  <img src={dashboardImage1} className="horizontal-media-img" alt="YOLOv8 Detection" />
                  <div className="horizontal-media-overlay" />
                </div>
             </div>
          </div>

          {/* Tarjeta 2: Re-Identificación (reid_tracker.py) */}
          <div style={{ width: '100vw', display: 'flex', alignItems: 'center', justifyContent: 'flex-start' }}>
             <div className="horizontal-feature-card">
                <div className="horizontal-card-text">
                   <UserCheck size={40} color="#ef4444" style={{ marginBottom: '1.5rem' }} />
                   <span className="horizontal-card-script">REID_TRACKER.PY // CLOTHING REID</span>
                   <h3 className="poetic-feature-title" style={{ fontSize: '2.5rem', marginBottom: '1rem', color: '#fff' }}>Detective de Ropa.</h3>
                   <p style={{ color: '#a3a3a3', fontSize: '1.05rem', lineHeight: 1.6 }}>
                     Rastrea sospechosos asignándoles IDs militares (como TARGET-ALPHA) a lo largo de varias cámaras. Memoriza las tonalidades de color de su ropa (torso y pantalones) para ubicarlos sin invadir su privacidad facial.
                   </p>
                </div>
                <div className="horizontal-card-media">
                  <img src={dashboardImage2} className="horizontal-media-img" alt="Re-ID Tracker" />
                  <div className="horizontal-media-overlay" />
                </div>
             </div>
          </div>

          {/* Tarjeta 3: Detector de Armas (threat_detector.py) */}
          <div style={{ width: '100vw', display: 'flex', alignItems: 'center', justifyContent: 'flex-start' }}>
             <div className="horizontal-feature-card">
                <div className="horizontal-card-text">
                   <ShieldAlert size={40} color="#ef4444" style={{ marginBottom: '1.5rem' }} />
                   <span className="horizontal-card-script">THREAT_DETECTOR.PY // THREAT EVALUATION</span>
                   <h3 className="poetic-feature-title" style={{ fontSize: '2.5rem', marginBottom: '1rem', color: '#fff' }}>Detector de Armas.</h3>
                   <p style={{ color: '#a3a3a3', fontSize: '1.05rem', lineHeight: 1.6 }}>
                     SVIVA dispone de un sensor secundario especializado en detectar armas de fuego u objetos peligrosos. Para no sobrecargar tu procesador, permanece "dormido" y se activa instantáneamente solo ante sospechas humanas.
                   </p>
                </div>
                <div className="horizontal-card-media">
                  {/* Grid táctico animado con css */}
                  <div className="tactical-scanner-graphic">
                    <div className="scanner-line-vertical" />
                    <div className="radar-concentric-circle" />
                    <div className="radar-status-text">THREAT_DETECTOR: SLEEP_MODE</div>
                  </div>
                  <div className="horizontal-media-overlay" />
                </div>
             </div>
          </div>

          {/* Tarjeta 4: Grabación Pre-Búfer (recorder.py) */}
          <div style={{ width: '100vw', display: 'flex', alignItems: 'center', justifyContent: 'flex-start' }}>
             <div className="horizontal-feature-card">
                <div className="horizontal-card-text">
                   <Clock size={40} color="#ef4444" style={{ marginBottom: '1.5rem' }} />
                   <span className="horizontal-card-script">RECORDER.PY // TIME TRAVEL RECORDING</span>
                   <h3 className="poetic-feature-title" style={{ fontSize: '2.5rem', marginBottom: '1rem', color: '#fff' }}>Viaje en el Tiempo.</h3>
                   <p style={{ color: '#a3a3a3', fontSize: '1.05rem', lineHeight: 1.6 }}>
                     Evita alertas tardías. El grabador inteligente almacena constantemente los últimos 5 segundos de grabación en memoria temporal y los une a la alerta en vivo para que veas el ingreso exacto antes de cruzar la entrada.
                   </p>
                </div>
                <div className="horizontal-card-media">
                  <img src={recordingsImage} className="horizontal-media-img" alt="Pre-buffer recordings" />
                  <div className="horizontal-media-overlay" />
                </div>
             </div>
          </div>

          {/* Tarjeta 5: Disuasión Activa (security_worker.py) */}
          <div style={{ width: '100vw', display: 'flex', alignItems: 'center', justifyContent: 'flex-start' }}>
             <div className="horizontal-feature-card">
                <div className="horizontal-card-text">
                   <Volume2 size={40} color="#ef4444" style={{ marginBottom: '1.5rem' }} />
                   <span className="horizontal-card-script">SECURITY_WORKER.PY // ACTIVE DETERRENT</span>
                   <h3 className="poetic-feature-title" style={{ fontSize: '2.5rem', marginBottom: '1rem', color: '#fff' }}>Disuasión Activa.</h3>
                   <p style={{ color: '#a3a3a3', fontSize: '1.05rem', lineHeight: 1.6 }}>
                     Ahuyenta a los delincuentes al instante haciendo sonar alarmas directamente de las bocinas del equipo. Es inteligente: suena durante 4 segundos para intrusos comunes, y 8 segundos completos si detecta armas.
                   </p>
                </div>
                <div className="horizontal-card-media">
                  <div className="tactical-sound-wave-graphic">
                    <span className="wave-bar-pulse" style={{ animationDelay: '0.1s' }} />
                    <span className="wave-bar-pulse" style={{ animationDelay: '0.3s' }} />
                    <span className="wave-bar-pulse" style={{ animationDelay: '0.5s' }} />
                    <span className="wave-bar-pulse" style={{ animationDelay: '0.2s' }} />
                    <span className="wave-bar-pulse" style={{ animationDelay: '0.4s' }} />
                  </div>
                  <div className="horizontal-media-overlay" />
                </div>
             </div>
          </div>

          {/* Tarjeta 6: Simulador de Alertas (iPhone) */}
          <div style={{ width: '100vw', display: 'flex', alignItems: 'center', justifyContent: 'flex-start' }}>
             <div className="horizontal-feature-card" style={{ background: 'linear-gradient(145deg, #04091a 0%, #01030a 100%)' }}>
                <IPhoneSimulator />
             </div>
          </div>

          {/* Tarjeta 7: Privacidad Total (tunnel_manager.py) */}
          <div style={{ width: '100vw', display: 'flex', alignItems: 'center', justifyContent: 'flex-start' }}>
             <div className="horizontal-feature-card">
                <div className="horizontal-card-text">
                   <Lock size={40} color="#ef4444" style={{ marginBottom: '1.5rem' }} />
                   <span className="horizontal-card-script">TUNNEL_MANAGER.PY // CLOUDFLARE ZERO TRUST</span>
                   <h3 className="poetic-feature-title" style={{ fontSize: '2.5rem', marginBottom: '1rem', color: '#fff' }}>Privacidad Total.</h3>
                   <p style={{ color: '#a3a3a3', fontSize: '1.05rem', lineHeight: 1.6 }}>
                     Sin cuotas mensuales ni servidores en la nube. Tus datos permanecen en tu equipo local. Para el acceso externo seguro, crea un túnel digital cifrado militar con Cloudflare Zero Trust.
                   </p>
                </div>
                <div className="horizontal-card-media">
                  <img src={configImage} className="horizontal-media-img" alt="Cloudflare Tunnel settings" />
                  <div className="horizontal-media-overlay" />
                </div>
             </div>
          </div>

          {/* Tarjeta 8: Tommy Asistente Gatuno */}
          <div style={{ width: '100vw', display: 'flex', alignItems: 'center', justifyContent: 'flex-start' }}>
             <div className="horizontal-feature-card">
                <div className="horizontal-card-text">
                   <HelpCircle size={40} color="#ef4444" style={{ marginBottom: '1.5rem' }} />
                   <span className="horizontal-card-script">TOMMY // CYBER-CAT SETUP ASSISTANT</span>
                   <h3 className="poetic-feature-title" style={{ fontSize: '2.5rem', marginBottom: '1rem', color: '#fff' }}>Asistente Gatuno.</h3>
                   <p style={{ color: '#a3a3a3', fontSize: '1.05rem', lineHeight: 1.6 }}>
                     Olvídate de manuales aburridos. Al instalar la aplicación, serás recibido por Tommy, un gato cibernético animado con efectos de ciencia ficción que te guiará paso a paso para configurar tu red de forma interactiva y lúdica.
                   </p>
                </div>
                <div className="horizontal-card-media">
                  <img src={tommyImage} className="horizontal-media-img" alt="Tommy cyber assistant" />
                  <div className="horizontal-media-overlay" />
                </div>
             </div>
          </div>

        </motion.div>
      </motion.div>
    </section>
  );
}
