import React, { useState, useEffect, useRef,useCallback } from 'react';
import { ArrowLeft, Info, Maximize2, Minimize2, Video, StopCircle, AlertCircle, BookOpen } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import usePendulum from './hooks/usePendulum';
import PendulumCanvas from './components/PendulumCanvas';
import PendulumControls from './components/PendulumControls';

const Pendulum = () => {
  const navigate = useNavigate();
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const [showHelp, setShowHelp] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [recordingTime, setRecordingTime] = useState(0);
  const timerRef = useRef(null);
  const handleCanvasResize = useCallback((width, height) => {
  // Cette fonction sera appelée quand le canvas change de taille
  console.log('Canvas redimensionné:', width, height);
}, []);

  // Simulation i18n
  const t = {
    title: "Pendule Interactif",
    description: "Le mouvement d'un pendule dépend de sa longueur et de la gravité. Imagine une balançoire : plus les cordes sont longues, plus le balancement est majestueux et lent.",
    editMode: "Ajustez puis cliquez sur Démarrer",
    recording: "Enregistrement..."
  };

  const {
    length, setLength, gravity, setGravity, isRunning, setIsRunning,
    angle, setNewAngle, getBobPosition
  } = usePendulum(200, 45, 1);

  const [bobPos, setBobPos] = useState({ x: 400, y: 300 });

  useEffect(() => {
    let frame;
    const loop = () => {
      setBobPos(getBobPosition());
      frame = requestAnimationFrame(loop);
    };
    loop();
    return () => cancelAnimationFrame(frame);
  }, [getBobPosition]);

  // Timer pour l'enregistrement
  useEffect(() => {
    if (isRecording) {
      timerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
    } else {
      clearInterval(timerRef.current);
      setRecordingTime(0);
    }
    return () => clearInterval(timerRef.current);
  }, [isRecording]);

  // Fonction pour formater le temps (MM:SS)
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Gestion de l'enregistrement vidéo
  const startRecording = () => {
    const canvas = document.querySelector('canvas');
    if (!canvas) {
      alert("Canvas non trouvé");
      return;
    }

    try {
      const stream = canvas.captureStream(30); // 30 FPS
      const recorder = new MediaRecorder(stream, { 
        mimeType: 'video/webm;codecs=vp9',
        videoBitsPerSecond: 2500000 // 2.5 Mbps pour bonne qualité
      });
      
      const chunks = [];

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunks.push(e.data);
        }
      };

      recorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'video/webm' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        const date = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
        a.download = `pendule-${date}.webm`;
        a.click();
        URL.revokeObjectURL(url);
        
        // Réinitialiser
        setIsRecording(false);
        setRecordingTime(0);
      };

      recorder.start(1000); // Capture par segments de 1 seconde
      setMediaRecorder(recorder);
      setIsRecording(true);
      
    } catch (error) {
      console.error("Erreur d'enregistrement:", error);
      alert("Impossible de démarrer l'enregistrement. Vérifie que ton navigateur supporte cette fonctionnalité.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorder && mediaRecorder.state !== 'inactive') {
      mediaRecorder.stop();
      // On ne met pas setIsRecording(false) ici car onstop le fera
    }
  };

  return (
    <div className="min-h-screen bg-[#fcfcfd] dark:bg-slate-950 text-slate-900 dark:text-slate-100">
      {/* Header Tactile */}
      <header className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <button onClick={() => navigate('/')} className="p-2 -ml-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors">
            <ArrowLeft size={24} />
          </button>
          <span className="font-bold tracking-tight text-lg">{t.title}</span>
          <div className="flex items-center gap-2">
            {/* Bouton d'enregistrement */}
            <button 
              onClick={isRecording ? stopRecording : startRecording}
              className={`p-2 rounded-full transition-all ${
                isRecording 
                  ? 'bg-red-500 text-white animate-pulse' 
                  : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
              }`}
              title={isRecording ? "Arrêter l'enregistrement" : "Enregistrer la simulation"}
            >
              {isRecording ? <StopCircle size={22} /> : <Video size={22} />}
            </button>
            <button onClick={() => setShowHelp(!showHelp)} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full">
              <Info size={22} className="text-blue-500" />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6 mb-20">
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* ZONE VISUELLE */}
          <div className="flex-1 space-y-6">
            <div 
              ref={containerRef}
              className={`relative bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-slate-800 overflow-hidden group transition-all ${
                isFullscreen ? 'fixed inset-0 z-50 rounded-none' : 'p-2'
              }`}
            >
              {/* Overlay d'état */}
              {!isRunning && (
                <div className="absolute top-6 left-1/2 -translate-x-1/2 z-20">
                  <div className="bg-amber-500 text-white px-4 py-1.5 rounded-full text-xs font-bold shadow-lg flex items-center gap-2">
                    <AlertCircle size={14} /> {t.editMode.toUpperCase()}
                  </div>
                </div>
              )}

              {/* Indicateur d'enregistrement */}
              {isRecording && (
                <div className="absolute top-6 left-6 z-20 flex items-center gap-3 bg-red-500 text-white px-4 py-2 rounded-full shadow-lg">
                  <div className="w-3 h-3 bg-white rounded-full animate-pulse" />
                  <span className="text-sm font-bold">REC {formatTime(recordingTime)}</span>
                </div>
              )}

              {/* Boutons flottants */}
              <div className="absolute bottom-6 right-6 z-20 flex gap-3">
                 <button 
                   onClick={isRecording ? stopRecording : startRecording}
                   className={`p-4 rounded-2xl shadow-xl active:scale-90 transition-transform ${
                     isRecording 
                       ? 'bg-red-500 text-white animate-pulse' 
                       : 'bg-slate-900/90 dark:bg-white/90 text-white dark:text-slate-900'
                   }`}
                   title={isRecording ? "Arrêter l'enregistrement" : "Enregistrer la simulation"}
                 >
                   {isRecording ? <StopCircle size={22} /> : <Video size={22} />}
                 </button>
                 <button 
                   onClick={() => setIsFullscreen(!isFullscreen)} 
                   className="p-4 bg-slate-900/90 dark:bg-white/90 text-white dark:text-slate-900 rounded-2xl shadow-xl active:scale-90 transition-transform"
                   title={isFullscreen ? "Quitter le plein écran" : "Plein écran"}
                 >
                   {isFullscreen ? <Minimize2 size={22} /> : <Maximize2 size={22} />}
                 </button>
              </div>
<PendulumCanvas 
  ref={canvasRef} 
  bobPosition={bobPos} 
  isFullscreen={isFullscreen}
  onDimensionsChange={handleCanvasResize}
/>
              
            </div>

            {/* DESCRIPTION LOCALE PÉDAGOGIQUE */}
            <div className="bg-white dark:bg-slate-900 p-8 rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-sm">
              <h3 className="flex items-center gap-2 font-bold text-xl mb-3">
                <BookOpen className="text-blue-500" /> Observation
              </h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed italic text-lg">
                "{t.description}"
              </p>
            </div>
          </div>

          {/* ZONE CONTRÔLES */}
          <aside className="lg:w-96">
            <div className="lg:sticky lg:top-24">
              <PendulumControls
                length={length} onLengthChange={setLength}
                angle={angle} onAngleChange={setNewAngle}
                gravity={gravity} onGravityChange={setGravity}
                isRunning={isRunning} 
                onToggleRunning={() => setIsRunning(!isRunning)}
                onReset={() => { setNewAngle(45); setIsRunning(false); }}
              />
              
              {/* Stats mobiles simplifiées */}
              <div className="grid grid-cols-2 gap-4 mt-6">
                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-2xl text-center">
                  <p className="text-[10px] font-bold text-blue-400 uppercase">Période</p>
                  <p className="text-xl font-black text-blue-700 dark:text-blue-300">
                    {(2 * Math.PI * Math.sqrt(length / 1000 / (gravity * 9.8))).toFixed(2)}s
                  </p>
                </div>
                <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-2xl text-center">
                  <p className="text-[10px] font-bold text-purple-400 uppercase">Gravité</p>
                  <p className="text-xl font-black text-purple-700 dark:text-purple-300">
                    {gravity.toFixed(1)}g
                  </p>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
};

export default Pendulum;