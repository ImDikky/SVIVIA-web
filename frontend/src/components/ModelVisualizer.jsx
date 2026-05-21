import React, { useRef, useState, useEffect } from 'react';
import { Camera, Layers, Cpu, Eye, CheckCircle } from 'lucide-react';
import surveillanceVideo from '../assets/videovigilancia-deteccion.mp4';

// Pausar/reanudar videos cuando la sección sale/entra del viewport
function useVisibility(ref, callback) {
  useEffect(() => {
    if (!ref.current) return;
    const obs = new IntersectionObserver(
      ([entry]) => callback(entry.isIntersecting),
      { rootMargin: '200px 0px' }
    );
    obs.observe(ref.current);
    return () => obs.disconnect();
  }, [ref, callback]);
}

export default function ModelVisualizer() {
  const [activeLayer, setActiveLayer] = useState('heatmap'); // 'input', 'edges', 'heatmap'
  const [isExpanded, setIsExpanded] = useState(true);
  const [useWebcam, setUseWebcam] = useState(false);
  const [webcamError, setWebcamError] = useState(null);
  
  const videoRef1 = useRef(null);
  const videoRef2 = useRef(null);
  const videoRef3 = useRef(null);
  const webcamStreamRef = useRef(null);
  const sectionRef = useRef(null);

  // Pause videos when out of view to free GPU
  useVisibility(sectionRef, (visible) => {
    [videoRef1, videoRef2, videoRef3].forEach(r => {
      if (!r.current) return;
      if (visible) r.current.play().catch(() => {});
      else r.current.pause();
    });
  });

  // Sincroniza y controla el canal de video para las tres capas isométricas simultáneamente
  useEffect(() => {
    const startVideo = async () => {
      // Limpia streams activos anteriores
      if (webcamStreamRef.current) {
        webcamStreamRef.current.getTracks().forEach(track => track.stop());
        webcamStreamRef.current = null;
      }

      if (useWebcam) {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({ 
            video: { width: 640, height: 480 } 
          });
          webcamStreamRef.current = stream;
          applyStreamToVideos(stream, true);
          setWebcamError(null);
        } catch (err) {
          console.warn("Acceso a cámara denegado o no disponible: ", err);
          setWebcamError("Acceso denegado o dispositivo ocupado. Usando simulación táctica...");
          setUseWebcam(false);
          applyStreamToVideos(null, false);
        }
      } else {
        applyStreamToVideos(null, false);
      }
    };

    const applyStreamToVideos = (stream, isWebcam) => {
      const refs = [videoRef1.current, videoRef2.current, videoRef3.current];
      refs.forEach(video => {
        if (!video) return;
        if (isWebcam && stream) {
          video.srcObject = stream;
          video.src = "";
        } else {
          video.srcObject = null;
          video.src = surveillanceVideo;
        }
        
        // Reproducir de manera segura controlando promesas de navegadores modernos
        const playPromise = video.play();
        if (playPromise !== undefined) {
          playPromise.catch(error => {
            console.log("Auto-play de video interactivo esperando interacción del usuario: ", error);
          });
        }
      });
    };

    startVideo();

    return () => {
      if (webcamStreamRef.current) {
        webcamStreamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, [useWebcam]);

  // Metadatos de telemetría de red neuronal YOLOv8 convolucional
  const layerMetadata = {
    input: {
      title: "Input Frame (Video Crudo)",
      desc: "Representa el flujo de captura de video digital crudo proveniente del canal de video local (o tu cámara web). Esta capa sirve como el tensor de entrada inicial [1, 3, 640, 640] antes de cualquier extracción de características.",
      filter: "Ninguno (Canal RGB)",
      kernel: "N/A",
      stride: "N/A",
      activation: "N/A",
      shape: "1 x 3 x 640 x 640",
      gflops: "0.0 (Pre-procesamiento)"
    },
    edges: {
      title: "Feature Edge Map (Filtro Convolucional)",
      desc: "Un mapeo convolucional de alta frecuencia. Aplicamos pesos neuronales simulando un kernel de paso alto (tipo Laplacian/Sobel) que aísla los bordes geométricos, siluetas e información de texturas clave para la detección de contornos físicos.",
      filter: "Sobel-Convolucional 2D",
      kernel: "3 x 3 (Bordes de contraste)",
      stride: "1 x 1",
      activation: "LeakyReLU (alpha=0.1)",
      shape: "1 x 32 x 320 x 320",
      gflops: "2.8 GFLOPs"
    },
    heatmap: {
      title: "Attention Heatmap (Activación Inferencia)",
      desc: "Muestra las neuronas de activación en las capas más profundas de la red (YOLOv8 Neck/Head). Las zonas de alta densidad térmica (rojo brillante/amarillo) representan regiones donde la red tiene una confianza del >95% en la presencia de una amenaza humana.",
      filter: "Feature Pyramid Grid (FPN)",
      kernel: "1 x 1 Conv2D (Clasificación)",
      stride: "1 x 1",
      activation: "SiLU (Sigmoid Linear Unit)",
      shape: "1 x 64 x 80 x 80",
      gflops: "8.4 GFLOPs"
    }
  };

  const meta = layerMetadata[activeLayer];

  return (
    <section ref={sectionRef} className="model-vis-section">
      <div className="model-vis-container">
        
        {/* LADO IZQUIERDO: Isometric Stage 3D */}
        <div className="isometric-stage">
          <div className={`isometric-scene ${isExpanded ? 'expanded' : ''}`}>
            
            {/* Capa 1: Input Frame */}
            <div 
              className="vis-layer-wrapper layer-input"
              onMouseEnter={() => setActiveLayer('input')}
              onClick={() => setActiveLayer('input')}
            >
              <div className={`vis-layer-glass ${activeLayer === 'input' ? 'active-layer' : ''}`}>
                <div className="laser-scanner"></div>
                <video 
                  ref={videoRef1}
                  src={surveillanceVideo}
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="vis-layer-content"
                  style={{ filter: 'none' }}
                />
                <div style={{ position: 'absolute', bottom: '12px', left: '12px', background: 'rgba(0,0,0,0.85)', padding: '4px 8px', borderRadius: '4px', fontSize: '0.65rem', fontFamily: 'monospace', color: '#fff', border: '1px solid rgba(255,255,255,0.1)', zIndex: 10 }}>
                  INPUT_RGB [C1]
                </div>
              </div>
            </div>

            {/* Capa 2: Feature Edge Map */}
            <div 
              className="vis-layer-wrapper layer-edges"
              onMouseEnter={() => setActiveLayer('edges')}
              onClick={() => setActiveLayer('edges')}
            >
              <div className={`vis-layer-glass ${activeLayer === 'edges' ? 'active-layer' : ''}`}>
                <video 
                  ref={videoRef2}
                  src={surveillanceVideo}
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="vis-layer-content"
                  style={{ filter: 'grayscale(1) contrast(3) invert(1)' }}
                />
                <div style={{ position: 'absolute', bottom: '12px', left: '12px', background: 'rgba(0,0,0,0.85)', padding: '4px 8px', borderRadius: '4px', fontSize: '0.65rem', fontFamily: 'monospace', color: '#00ffcc', border: '1px solid rgba(0,255,204,0.2)', zIndex: 10 }}>
                  CONV_EDGES [C16]
                </div>
              </div>
            </div>

            {/* Capa 3: Attention Heatmap */}
            <div 
              className="vis-layer-wrapper layer-heatmap"
              onMouseEnter={() => setActiveLayer('heatmap')}
              onClick={() => setActiveLayer('heatmap')}
            >
              <div className={`vis-layer-glass ${activeLayer === 'heatmap' ? 'active-layer' : ''}`}>
                <div style={{ position: 'absolute', inset: 0, background: 'rgba(239, 68, 68, 0.1)', mixBlendMode: 'color-burn', pointerEvents: 'none', zIndex: 5 }}></div>
                <video 
                  ref={videoRef3}
                  src={surveillanceVideo}
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="vis-layer-content"
                  style={{ filter: 'hue-rotate(240deg) saturate(5) contrast(1.8)' }}
                />
                <div style={{ position: 'absolute', bottom: '12px', left: '12px', background: 'rgba(0,0,0,0.85)', padding: '4px 8px', borderRadius: '4px', fontSize: '0.65rem', fontFamily: 'monospace', color: '#ef4444', border: '1px solid rgba(239,68,68,0.2)', zIndex: 10 }}>
                  HEATMAP_ATTN [C64]
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* LADO DERECHO: Panel de Control e Inferencia Lateral */}
        <div className="model-vis-info">
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Cpu size={18} color="#4f46e5" />
            <span style={{ fontSize: '0.85rem', color: '#4f46e5', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
              Deconstrucción de Pesos YOLOv8
            </span>
          </div>

          <div className="vis-cyber-panel">
            <h3 className="vis-title">{meta.title}</h3>
            <p className="vis-desc">{meta.desc}</p>

            <div className="vis-metadata-table">
              <div className="vis-meta-row">
                <span className="vis-meta-label">Operador Neural</span>
                <span className="vis-meta-value">{meta.filter}</span>
              </div>
              <div className="vis-meta-row">
                <span className="vis-meta-label">Tamaño del Kernel</span>
                <span className="vis-meta-value">{meta.kernel}</span>
              </div>
              <div className="vis-meta-row">
                <span className="vis-meta-label">Stride convolucional</span>
                <span className="vis-meta-value">{meta.stride}</span>
              </div>
              <div className="vis-meta-row">
                <span className="vis-meta-label">Función de Activación</span>
                <span className="vis-meta-value">{meta.activation}</span>
              </div>
              <div className="vis-meta-row">
                <span className="vis-meta-label">Estructura del Tensor</span>
                <span className="vis-meta-value" style={{ color: '#fff' }}>{meta.shape}</span>
              </div>
              <div className="vis-meta-row">
                <span className="vis-meta-label">Coste Computacional</span>
                <span className="vis-meta-value" style={{ color: '#10b981' }}>{meta.gflops}</span>
              </div>
            </div>

            {/* Webcam and expansion tools */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <button 
                onClick={() => setUseWebcam(!useWebcam)}
                className={`webcam-toggle-btn ${useWebcam ? 'active' : ''}`}
              >
                <Camera size={16} /> 
                {useWebcam ? "DESACTIVAR CÁMARA WEB" : "VER CON MI CÁMARA WEB EN VIVO"}
              </button>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '8px' }}>
                <span style={{ fontSize: '0.85rem', color: '#737373' }}>
                  Alineación 3D: <strong>{isExpanded ? "Expandida" : "Apilada"}</strong>
                </span>
                <button 
                  onClick={() => setIsExpanded(!isExpanded)}
                  style={{ background: 'none', border: 'none', color: '#4f46e5', fontSize: '0.85rem', textDecoration: 'underline', cursor: 'pointer', fontWeight: 600 }}
                >
                  {isExpanded ? "Apilar Capas" : "Separar Capas (3D)"}
                </button>
              </div>

              {webcamError && (
                <div style={{ padding: '8px 12px', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: '6px', fontSize: '0.75rem', color: '#f87171', marginTop: '10px', textAlign: 'center' }}>
                  {webcamError}
                </div>
              )}
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
