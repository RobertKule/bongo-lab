import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Info, Maximize2, Minimize2, Video, StopCircle, AlertCircle, BookOpen } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import useInclinedPlane from './hooks/useInclinedPlane';
import InclinedPlaneCanvas from './components/InclinedPlaneCanvas';
import InclinedPlaneControls from './components/InclinedPlaneControls';

const InclinedPlane = () => {
  const navigate = useNavigate();
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const [showHelp, setShowHelp] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [recordingTime, setRecordingTime] = useState(0);
  const timerRef = useRef(null);
  
  // Simulation i18n
  const t = {
    title: "Plan Incliné Interactif",
    description: "Découvre comment l'angle et la friction influencent la vitesse de glissement d'un objet.",
    editMode: "Ajustez puis cliquez sur Démarrer",
    recording: "Enregistrement..."
  };

  const {
  angle, setAngle,
  friction, setFriction,
  mass, setMass,
  isRunning, setIsRunning,
  canSlide, // ← Ajoute cette ligne
  getBlockPosition,
  resetPosition,
  planeData
} = useInclinedPlane(30, 0.2, 1);

  const [blockPos, setBlockPos] = useState({ x: 200, y: 200 });

  useEffect(() => {
    let frame;
    const loop = () => {
      setBlockPos(getBlockPosition());
      frame = requestAnimationFrame(loop);
    };
    loop();
    return () => cancelAnimationFrame(frame);
  }, [getBlockPosition]);

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

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const startRecording = () => {
    const canvas = document.querySelector('canvas');
    if (!canvas) {
      alert("Canvas non trouvé");
      return;
    }

    try {
      const stream = canvas.captureStream(30);
      const recorder = new MediaRecorder(stream, { 
        mimeType: 'video/webm;codecs=vp9',
        videoBitsPerSecond: 2500000
      });
      
      const chunks = [];

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunks.push(e.data);
      };

      recorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'video/webm' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        const date = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
        a.download = `plan-incline-${date}.webm`;
        a.click();
        URL.revokeObjectURL(url);
        setIsRecording(false);
        setRecordingTime(0);
      };

      recorder.start(1000);
      setMediaRecorder(recorder);
      setIsRecording(true);
      
    } catch (error) {
      console.error("Erreur d'enregistrement:", error);
      alert("Impossible de démarrer l'enregistrement.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorder && mediaRecorder.state !== 'inactive') {
      mediaRecorder.stop();
    }
  };

  return (
    <div className="min-h-screen bg-[#fcfcfd] dark:bg-slate-950 text-slate-900 dark:text-slate-100">
      <header className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <button onClick={() => navigate('/')} className="p-2 -ml-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors">
            <ArrowLeft size={24} />
          </button>
          <span className="font-bold tracking-tight text-lg">{t.title}</span>
          <div className="flex items-center gap-2">
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
              {!isRunning && (
                <div className="absolute top-6 left-1/2 -translate-x-1/2 z-20">
                  <div className="bg-amber-500 text-white px-4 py-1.5 rounded-full text-xs font-bold shadow-lg flex items-center gap-2">
                    <AlertCircle size={14} /> {t.editMode.toUpperCase()}
                  </div>
                </div>
              )}

              {isRecording && (
                <div className="absolute top-6 left-6 z-20 flex items-center gap-3 bg-red-500 text-white px-4 py-2 rounded-full shadow-lg">
                  <div className="w-3 h-3 bg-white rounded-full animate-pulse" />
                  <span className="text-sm font-bold">REC {formatTime(recordingTime)}</span>
                </div>
              )}

              <div className="absolute bottom-6 right-6 z-20 flex gap-3">
                 <button 
                   onClick={isRecording ? stopRecording : startRecording}
                   className={`p-4 rounded-2xl shadow-xl active:scale-90 transition-transform ${
                     isRecording 
                       ? 'bg-red-500 text-white animate-pulse' 
                       : 'bg-slate-900/90 dark:bg-white/90 text-white dark:text-slate-900'
                   }`}
                 >
                   {isRecording ? <StopCircle size={22} /> : <Video size={22} />}
                 </button>
                 <button 
                   onClick={() => setIsFullscreen(!isFullscreen)} 
                   className="p-4 bg-slate-900/90 dark:bg-white/90 text-white dark:text-slate-900 rounded-2xl shadow-xl active:scale-90 transition-transform"
                 >
                   {isFullscreen ? <Minimize2 size={22} /> : <Maximize2 size={22} />}
                 </button>
              </div>

              <InclinedPlaneCanvas 
  blockPosition={blockPos} 
  angle={angle} 
  planeData={planeData}
  canSlide={canSlide} // ← Ajoute cette prop
  isFullscreen={isFullscreen} 
/>
            </div>

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
              <InclinedPlaneControls
                angle={angle} onAngleChange={setAngle}
                friction={friction} onFrictionChange={setFriction}
                mass={mass} onMassChange={setMass}
                isRunning={isRunning} 
                onToggleRunning={() => setIsRunning(!isRunning)}
                onReset={() => { setAngle(30); setFriction(0.2); setMass(1); setIsRunning(false); }}
              />
              
              <div className="grid grid-cols-2 gap-4 mt-6">
                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-2xl text-center">
                  <p className="text-[10px] font-bold text-blue-400 uppercase">Angle</p>
                  <p className="text-xl font-black text-blue-700 dark:text-blue-300">{angle}°</p>
                </div>
                <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-2xl text-center">
                  <p className="text-[10px] font-bold text-purple-400 uppercase">Friction</p>
                  <p className="text-xl font-black text-purple-700 dark:text-purple-300">{friction.toFixed(2)}</p>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
};

export default InclinedPlane;