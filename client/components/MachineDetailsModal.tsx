import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { X, Play, Pause, RotateCcw, Clock } from "lucide-react";

interface Machine {
  id: number;
  name: string;
  technique: string;
  difficulty: string;
  os: string;
  cert: string;
}

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
  const [timeLeft, setTimeLeft] = useState(25 * 60); // 25 minutes in seconds
  const [isRunning, setIsRunning] = useState(false);

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

  const toggleTimer = () => setIsRunning(!isRunning);
  const resetTimer = () => {
    setIsRunning(false);
    setTimeLeft(25 * 60);
  };

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  if (!isOpen || !machine) return null;

  if (!isAuthenticated) {
    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div className="glow-box border-destructive/40 neon-border rounded-sm max-w-md w-full p-8 space-y-6 animate-slide-up">
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
            Necesitas iniciar sesión para acceder a los detalles de la máquina y
            usar el entrenador.
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

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-[5%]">
      <div className="glow-box border-primary/30 neon-border rounded-sm w-full h-[90vh] overflow-y-auto p-8 space-y-6 animate-slide-up">
        <div className="flex items-center justify-between sticky top-0 bg-background/90 pb-4 border-b border-primary/30 z-10">
          <h2 className="text-3xl font-bold text-primary uppercase tracking-widest">
            {machine.name}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-card rounded-sm transition-colors text-primary/70 hover:text-primary flex-shrink-0"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* YouTube Video */}
          <div className="space-y-2 order-2 lg:order-1">
            <h3 className="text-sm font-bold text-secondary/70 uppercase tracking-widest mb-4">
              &gt; tutorial
            </h3>
            <div
              className="relative w-full bg-black rounded-sm overflow-hidden border border-secondary/30"
              style={{ paddingBottom: "56.25%" }}
            >
              <iframe
                className="absolute top-0 left-0 w-full h-full"
                src="https://www.youtube.com/embed/LZSZ2oVk418"
                title="Machine Tutorial"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>

          {/* Machine Details */}
          <div className="space-y-6 order-1 lg:order-2">
            <div>
              <h3 className="text-sm font-bold text-primary/70 uppercase tracking-widest mb-3">
                &gt; información
              </h3>
              <div className="space-y-3 font-mono">
                <div className="glow-box p-4 border-primary/20 rounded-sm space-y-1">
                  <div className="text-xs text-foreground/60 uppercase tracking-wider">
                    Nombre
                  </div>
                  <div className="text-lg font-bold text-primary">
                    {machine.name}
                  </div>
                </div>

                <div className="glow-box p-4 border-primary/20 rounded-sm space-y-1">
                  <div className="text-xs text-foreground/60 uppercase tracking-wider">
                    Técnica
                  </div>
                  <div className="text-sm text-foreground">
                    {machine.technique}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="glow-box p-4 border-secondary/20 rounded-sm space-y-1">
                    <div className="text-xs text-foreground/60 uppercase tracking-wider">
                      Dificultad
                    </div>
                    <div
                      className={`text-sm font-bold ${
                        machine.difficulty === "Beginner"
                          ? "text-primary"
                          : machine.difficulty === "Intermediate"
                            ? "text-secondary"
                            : "text-accent"
                      }`}
                    >
                      {machine.difficulty}
                    </div>
                  </div>

                  <div className="glow-box p-4 border-accent/20 rounded-sm space-y-1">
                    <div className="text-xs text-foreground/60 uppercase tracking-wider">
                      SO
                    </div>
                    <div className="text-sm font-bold text-accent">
                      {machine.os}
                    </div>
                  </div>
                </div>

                <div className="glow-box p-4 border-primary/20 rounded-sm space-y-1">
                  <div className="text-xs text-foreground/60 uppercase tracking-wider">
                    Certificación
                  </div>
                  <div className="text-sm font-bold text-primary">
                    {machine.cert}
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="space-y-2">
              <Button className="w-full button-glow bg-primary text-background hover:bg-primary/90 font-mono uppercase tracking-widest rounded-sm h-11">
                $ iniciar máquina
              </Button>
              <Button
                variant="outline"
                className="w-full neon-border font-mono uppercase tracking-widest rounded-sm h-11 hover:bg-card/50"
              >
                $ ver writeup
              </Button>
            </div>
          </div>

          {/* Pomodoro Timer */}
          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-bold text-secondary/70 uppercase tracking-widest mb-4">
                &gt; pomodoro trainer
              </h3>
              <div className="glow-box border-secondary/40 neon-border-secondary p-8 rounded-sm space-y-6">
                {/* Timer Display */}
                <div className="text-center space-y-2">
                  <div className="text-6xl font-bold text-secondary font-mono tracking-tight glow-text-secondary">
                    {String(minutes).padStart(2, "0")}:
                    {String(seconds).padStart(2, "0")}
                  </div>
                  <div className="text-sm text-foreground/60 font-mono uppercase tracking-wider">
                    Sesión de 25 minutos
                  </div>
                </div>

                {/* Timer Controls */}
                <div className="flex gap-3">
                  <Button
                    onClick={toggleTimer}
                    className="flex-1 button-glow bg-secondary text-background hover:bg-secondary/90 font-mono uppercase tracking-widest rounded-sm h-10 gap-2"
                  >
                    {isRunning ? (
                      <>
                        <Pause className="w-4 h-4" />
                        pausa
                      </>
                    ) : (
                      <>
                        <Play className="w-4 h-4" />
                        iniciar
                      </>
                    )}
                  </Button>
                  <Button
                    onClick={resetTimer}
                    variant="outline"
                    className="flex-1 neon-border font-mono uppercase tracking-widest rounded-sm h-10 gap-2 hover:bg-card/50"
                  >
                    <RotateCcw className="w-4 h-4" />
                    reset
                  </Button>
                </div>

                {/* Progress Bar */}
                <div className="space-y-2">
                  <div className="h-2 bg-background rounded-sm overflow-hidden border border-secondary/30">
                    <div
                      className="h-full bg-gradient-to-r from-secondary to-primary transition-all duration-500"
                      style={{
                        width: `${((25 * 60 - timeLeft) / (25 * 60)) * 100}%`,
                      }}
                    />
                  </div>
                  <div className="text-xs text-foreground/60 font-mono text-center">
                    {Math.round(((25 * 60 - timeLeft) / (25 * 60)) * 100)}%
                    completado
                  </div>
                </div>

                {/* Tips */}
                <div className="pt-4 border-t border-secondary/30">
                  <div className="text-xs font-bold text-secondary/70 uppercase tracking-widest mb-2">
                    &gt; consejos
                  </div>
                  <ul className="text-xs text-foreground/60 font-mono space-y-1">
                    <li>✓ Trabaja sin distracciones durante 25 min</li>
                    <li>✓ Toma un descanso de 5 min después</li>
                    <li>✓ Repite para máxima productividad</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Session Stats */}
            <div className="glow-box border-primary/20 p-4 rounded-sm space-y-2">
              <div className="text-xs font-bold text-primary/70 uppercase tracking-widest">
                &gt; estadísticas
              </div>
              <div className="space-y-1 text-xs font-mono text-foreground/60">
                <div className="flex justify-between">
                  <span>Sesiones completadas:</span>
                  <span className="text-primary font-bold">0</span>
                </div>
                <div className="flex justify-between">
                  <span>Tiempo total:</span>
                  <span className="text-secondary font-bold">0h 0m</span>
                </div>
                <div className="flex justify-between">
                  <span>Racha actual:</span>
                  <span className="text-accent font-bold">0 días</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
