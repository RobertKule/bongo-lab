import React, { useState, useRef, useEffect } from 'react';
import { ArrowLeft, Info, Maximize2, Minimize2, Video, StopCircle, AlertCircle, BookOpen, Eye } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import useOptics from './hooks/useOptics';
import OpticsCanvas from './components/OpticsCanvas';
import OpticsControls from './components/OpticsControls';

const Optics = () => {
  const navigate = useNavigate();
  const containerRef = useRef(null);
  const [showHelp, setShowHelp] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [recordingTime, setRecordingTime] = useState(0);
  const timerRef = useRef(null);

  const t = {
    title: "Optique - Réflexion & Réfraction",
    description: "Explore les lois de Snell-Descartes avec des rayons lumineux.",
    editMode: "Ajuste l'angle et observe",
    recording: "Enregistrement..."
  };

  const {
    incidentAngle, setIncidentAngle,
    n1, setN1,
    n2, setN2,
    surfaceType, setSurfaceType,
    rayType, setRayType,
    wavelength, setWavelength,
    isRunning, setIsRunning,
    reflectedAngle,
    refractedAngle,
    criticalAngle,
    totalInternalReflection,
    getRayColor,
    predefinedMaterials
  } = useOptics();

  // Timer enregistrement
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
    if (!canvas) return;

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
        a.download = `optics-${date}.webm`;
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
          <button onClick={() => navigate('/')} className="p-2 -ml-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full">
            <ArrowLeft size={24} />
          </button>
          <span className="font-bold tracking-tight text-lg">{t.title}</span>
          <div className="flex items-center gap-2">
            <button 
              onClick={isRecording ? stopRecording : startRecording}
              className={`p-2 rounded-full transition-all ${
                isRecording 
                  ? 'bg-red-500 text-white animate-pulse' 
                  : 'hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
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
              className={`relative bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl border border-slate-100 dark:border-slate-800 overflow-hidden group transition-all ${
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
                   className="p-4 bg-slate-900/90 dark:bg-white/90 text-white dark:text-slate-900 rounded-2xl shadow-xl active:scale-90"
                 >
                   {isFullscreen ? <Minimize2 size={22} /> : <Maximize2 size={22} />}
                 </button>
              </div>

              <OpticsCanvas 
                incidentAngle={incidentAngle}
                reflectedAngle={reflectedAngle}
                refractedAngle={refractedAngle}
                surfaceType={surfaceType}
                rayType={rayType}
                n1={n1}
                n2={n2}
                totalInternalReflection={totalInternalReflection}
                getRayColor={getRayColor}
                isRunning={isRunning}
                isFullscreen={isFullscreen}
              />
            </div>

            <div className="bg-white dark:bg-slate-900 p-8 rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-sm">
              <h3 className="flex items-center gap-2 font-bold text-xl mb-3">
                <BookOpen className="text-blue-500" /> Observation
              </h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed italic text-lg">
                "n₁ sin θ₁ = n₂ sin θ₂ — La lumière change de direction en changeant de milieu."
              </p>
            </div>
          </div>

          {/* ZONE CONTRÔLES */}
          <aside className="lg:w-96 space-y-6">
            <OpticsControls
              incidentAngle={incidentAngle}
              onIncidentAngleChange={setIncidentAngle}
              n1={n1}
              onN1Change={setN1}
              n2={n2}
              onN2Change={setN2}
              surfaceType={surfaceType}
              onSurfaceTypeChange={setSurfaceType}
              rayType={rayType}
              onRayTypeChange={setRayType}
              wavelength={wavelength}
              onWavelengthChange={setWavelength}
              reflectedAngle={reflectedAngle}
              refractedAngle={refractedAngle}
              criticalAngle={criticalAngle}
              totalInternalReflection={totalInternalReflection}
              predefinedMaterials={predefinedMaterials}
              isRunning={isRunning}
              onToggleRunning={() => setIsRunning(!isRunning)}
              onReset={() => {
                setIncidentAngle(30);
                setN1(1.0);
                setN2(1.5);
                setSurfaceType('plan');
                setRayType('both');
                setWavelength(550);
                setIsRunning(false);
              }}
            />
          </aside>
        </div>
      </main>
    </div>
  );
};

export default Optics;