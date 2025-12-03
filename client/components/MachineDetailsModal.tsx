import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { X, Play, Pause, RotateCcw, Minus, Maximize2, SkipForward, Square } from "lucide-react";

import { Machine } from "@/hooks/useMachines";
import { useMachineTechniques } from "@/hooks/useMachineTechniques";
import { useMachineCertifications } from "@/hooks/useMachineCertifications";
import { useUserProgress } from "@/hooks/useUserProgress";

interface MachineDetailsModalProps {
  isOpen: boolean;
  machine: Machine | null;
  onClose: () => void;
}

export default function MachineDetailsModal({
  isOpen,
  machine,
  onClose,
}: MachineDetailsModalProps) {
  const { isAuthenticated } = useAuth();
  const { markAsCompleted, isCompleted } = useUserProgress();
  const [timeLeft, setTimeLeft] = useState(25 * 60); // 25 minutes in seconds
  const [isRunning, setIsRunning] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const { techniques, loading: techniquesLoading } = useMachineTechniques(machine?.id || null);
  const { certifications, loading: certsLoading } = useMachineCertifications(machine?.id || null);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsRunning(false);
    }

    return () => clearInterval(interval);
  }, [isRunning, timeLeft]);

  // Prevent body scroll when modal is open AND not minimized
  useEffect(() => {
    if (isOpen && !isMinimized) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, isMinimized]);

  if (!isOpen || !machine) return null;

  const toggleTimer = () => setIsRunning(!isRunning);
  const resetTimer = () => {
    setIsRunning(false);
    setTimeLeft(25 * 60);
  };

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const formattedTime = `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;

  if (!isAuthenticated) {
    return (
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div className="glow-box border-destructive/40 neon-border rounded-sm max-w-md w-full p-8 space-y-6 animate-slide-up bg-black">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-destructive uppercase tracking-widest">
              acceso denegado
            </h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-card rounded-sm transition-colors text-destructive/70 hover:text-destructive"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <p className="text-foreground/70 font-mono">
            Necesitas iniciar sesión para acceder a los detalles de la máquina.
          </p>
          <Button
            onClick={onClose}
            className="w-full button-glow bg-destructive text-background hover:bg-destructive/90 font-mono uppercase tracking-widest rounded-sm h-11"
          >
            $ volver
          </Button>
        </div>
      </div>
    );
  }

  // Minimized View
  if (isMinimized) {
    return (
      <div className="fixed bottom-4 right-4 z-50 animate-slide-up">
        <div className="bg-black border border-primary/50 shadow-[0_0_15px_rgba(0,255,0,0.3)] rounded-md p-3 flex items-center gap-4 w-72">
          <div className="flex-1 min-w-0">
            <div className="text-xs text-primary font-bold truncate">Running: {machine.name}</div>
            <div className="text-xs text-purple-400 font-mono">{formattedTime}</div>
          </div>
          <div className="flex gap-2">
            <Button 
              size="icon" 
              variant="ghost" 
              className="h-8 w-8 text-primary hover:text-primary hover:bg-primary/10"
              onClick={() => setIsMinimized(false)}
            >
              <Maximize2 className="w-4 h-4" />
            </Button>
            <Button 
              size="icon" 
              variant="ghost" 
              className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
              onClick={onClose}
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Full View (Responsive)
  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center md:p-6 p-0">
      <div className="w-full h-full md:h-[90vh] md:max-w-5xl bg-black border-x-2 md:border-2 border-primary/50 shadow-[0_0_30px_rgba(0,255,0,0.15)] flex flex-col animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between p-3 border-b border-primary/30 bg-black/50 shrink-0">
          <div className="flex items-center gap-3 overflow-hidden">
            <span className="text-primary font-bold font-mono text-lg truncate flex items-center gap-2">
              <span className="text-primary/50">&gt;&gt;</span> 
              {machine.name}
            </span>
            <span className={`px-2 py-0.5 text-xs font-bold border rounded-sm uppercase ${
              machine.difficulty_text === "Easy" ? "border-green-500 text-green-500" :
              machine.difficulty_text === "Medium" ? "border-yellow-500 text-yellow-500" :
              machine.difficulty_text === "Hard" ? "border-orange-500 text-orange-500" :
              "border-red-500 text-red-500"
            }`}>
              {machine.difficulty_text}
            </span>
          </div>
          <div className="flex gap-2 shrink-0">
            <button
              onClick={() => setIsMinimized(true)}
              className="w-8 h-8 flex items-center justify-center border border-yellow-500/50 text-yellow-500 hover:bg-yellow-500/10 rounded-sm transition-colors"
            >
              <Minus className="w-5 h-5" />
            </button>
            <button
              onClick={onClose}
              className="w-8 h-8 flex items-center justify-center border border-red-500/50 text-red-500 hover:bg-red-500/10 rounded-sm transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-3 md:p-6 space-y-4 custom-scrollbar">
          
          {/* Video Section */}
          <div className="w-full border-2 border-primary/30 rounded-sm overflow-hidden bg-black shadow-[0_0_15px_rgba(0,255,0,0.1)]">
            <div className="relative w-full" style={{ paddingBottom: "56.25%" }}>
              {machine.video_url ? (
                <iframe
                  className="absolute top-0 left-0 w-full h-full"
                  src={machine.video_url.replace("watch?v=", "embed/")}
                  title="Machine Tutorial"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center text-primary/50 font-mono bg-primary/5">
                  [ VIDEO SIGNAL LOST ]
                </div>
              )}
            </div>
          </div>

          {/* Pomodoro Compact Section */}
          <div className="border-2 border-purple-500/50 rounded-sm p-4 bg-purple-900/5 shadow-[0_0_15px_rgba(168,85,247,0.1)]">
            <div className="flex justify-between items-center mb-3">
              <div className="flex items-center gap-2 text-purple-400 font-bold tracking-wider">
                <span className="text-xl">🍅</span> POMODORO
              </div>
              <Button size="sm" variant="ghost" className="h-6 w-6 p-0 text-purple-400 hover:text-purple-300 hover:bg-purple-500/20">
                <Maximize2 className="w-4 h-4" />
              </Button>
            </div>
            
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between bg-black/60 p-3 rounded border border-purple-500/30">
                <div className="px-3 py-1 bg-red-500/20 border border-red-500/50 text-red-400 text-xs font-bold rounded uppercase tracking-wider">
                  Trabajo
                </div>
                <span className="text-3xl font-mono font-bold text-white tracking-widest drop-shadow-[0_0_5px_rgba(255,255,255,0.5)]">
                  {formattedTime}
                </span>
              </div>
              
              <div className="grid grid-cols-3 gap-2">
                <Button 
                  onClick={toggleTimer}
                  className={`h-10 font-bold ${isRunning 
                    ? 'bg-yellow-600 hover:bg-yellow-700 text-white border-none' 
                    : 'bg-green-600 hover:bg-green-700 text-white border-none'}`}
                >
                  {isRunning ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                </Button>
                <Button 
                  onClick={resetTimer}
                  variant="secondary" 
                  className="h-10 bg-secondary/20 hover:bg-secondary/30 text-secondary border border-secondary/50"
                >
                  <RotateCcw className="w-5 h-5" />
                </Button>
                <Button 
                  className="h-10 bg-blue-600 hover:bg-blue-700 text-white border-none"
                >
                  <SkipForward className="w-5 h-5" />
                </Button>
              </div>
            </div>
          </div>

          {/* Info Grid */}
          <div className="grid grid-cols-3 gap-2">
            <div className="border border-primary/40 bg-primary/5 p-2 rounded-sm text-center">
              <div className="text-[10px] text-primary/70 uppercase tracking-wider mb-1">IP</div>
              <div className="font-mono font-bold text-sm text-primary truncate">{machine.ip}</div>
            </div>
            <div className="border border-primary/40 bg-primary/5 p-2 rounded-sm text-center">
              <div className="text-[10px] text-primary/70 uppercase tracking-wider mb-1">SO</div>
              <div className="font-mono font-bold text-sm text-primary truncate">{machine.os}</div>
            </div>
            <div className={`border p-2 rounded-sm text-center ${
               machine.difficulty_text === "Easy" ? "border-green-500/40 bg-green-500/5" :
               machine.difficulty_text === "Medium" ? "border-yellow-500/40 bg-yellow-500/5" :
               machine.difficulty_text === "Hard" ? "border-orange-500/40 bg-orange-500/5" :
               "border-red-500/40 bg-red-500/5"
            }`}>
              <div className="text-[10px] uppercase tracking-wider mb-1 opacity-70">Nivel</div>
              <div className={`font-mono font-bold text-sm truncate ${
                 machine.difficulty_text === "Easy" ? "text-green-500" :
                 machine.difficulty_text === "Medium" ? "text-yellow-500" :
                 machine.difficulty_text === "Hard" ? "text-orange-500" :
                 "text-red-500"
              }`}>{machine.difficulty_text}</div>
            </div>
          </div>

          {/* Techniques List */}
          <div className="border border-primary/40 rounded-sm flex flex-col h-64 bg-black/40">
            <div className="p-3 border-b border-primary/20 bg-primary/5">
              <h3 className="text-primary font-bold text-sm uppercase tracking-widest flex items-center gap-2">
                <span>$</span> Técnicas Explotadas <span className="text-primary/60">({techniques.length})</span>
              </h3>
            </div>
            <div className="flex-1 overflow-y-auto p-3 custom-scrollbar">
              {techniquesLoading ? (
                <div className="text-primary/50 animate-pulse text-sm font-mono">Escaneando sistema...</div>
              ) : techniques.length > 0 ? (
                <ul className="space-y-2">
                  {techniques.map((t, i) => (
                    <li key={i} className="text-sm font-mono text-primary/80 flex items-start gap-2 hover:text-primary transition-colors">
                      <span className="text-primary/40 mt-1">›</span>
                      {t.name}
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="text-primary/40 text-sm font-mono italic">No se detectaron técnicas específicas.</div>
              )}
            </div>
          </div>

          {/* Certifications List (New) */}
          {certifications.length > 0 && (
            <div className="border border-blue-500/40 rounded-sm flex flex-col bg-black/40">
              <div className="p-3 border-b border-blue-500/20 bg-blue-500/5">
                <h3 className="text-blue-400 font-bold text-sm uppercase tracking-widest flex items-center gap-2">
                  <span>$</span> Certificaciones Relacionadas
                </h3>
              </div>
              <div className="p-3 flex flex-wrap gap-2">
                {certifications.map((c, i) => (
                  <span key={i} className="px-2 py-1 bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-mono rounded-sm">
                    {c.name}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-3 pt-2 pb-6">
             <Button 
               onClick={() => machine && markAsCompleted.mutate(machine.id)}
               disabled={!machine || (machine && isCompleted(machine.id)) || markAsCompleted.isPending}
               className={`w-full button-glow font-mono uppercase tracking-widest rounded-sm h-12 font-bold transition-all ${
                 machine && isCompleted(machine.id)
                   ? "bg-green-500 text-black hover:bg-green-600 border-green-400 shadow-[0_0_20px_rgba(34,197,94,0.4)]" 
                   : "bg-primary text-background hover:bg-primary/90"
               }`}
             >
               {machine && isCompleted(machine.id) ? "$ SYSTEM PWNED" : "$ PWN MACHINE"}
             </Button>
             <Button
               variant="outline"
               className="w-full neon-border font-mono uppercase tracking-widest rounded-sm h-12 hover:bg-primary/10 hover:text-primary"
             >
               $ WRITEUP
             </Button>
          </div>

        </div>
      </div>
    </div>
  );
}
