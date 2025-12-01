import Layout from "@/components/Layout";
import LoginModal from "@/components/LoginModal";
import MachineDetailsModal from "@/components/MachineDetailsModal";
import { Button } from "@/components/ui/button";
import {
  Shield,
  Target,
  Trophy,
  Users,
  Zap,
  BookOpen,
  ArrowRight,
  Lock,
  Code2,
  Clock,
  Terminal,
  Database,
  Cpu,
  Radio,
  Search,
  Shuffle,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { useMachines, Machine } from "@/hooks/useMachines";
import { useAuth } from "@/context/AuthContext";
import { CARD_CONFIG } from "@/constants/uiConfig";

function Typewriter({ text, delay = 50 }: { text: string; delay?: number }) {
  const [displayedText, setDisplayedText] = useState("");

  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      if (index < text.length) {
        setDisplayedText(text.slice(0, index + 1));
        index++;
      }
    }, delay);
    return () => clearInterval(interval);
  }, [text, delay]);

  return <span>{displayedText}</span>;
}



export default function Index() {
  const { isAuthenticated } = useAuth();
  const { machines, loading, error } = useMachines();
  const [randomMachine, setRandomMachine] = useState<Machine | null>(null);
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [selectedMachine, setSelectedMachine] = useState<Machine | null>(null);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);

  // Get random machine from the fetched list
  const getRandomMachine = () => {
    if (machines.length > 0) {
      const randomIdx = Math.floor(Math.random() * machines.length);
      setRandomMachine(machines[randomIdx]);
    }
  };

  useEffect(() => {
    if (machines.length > 0 && !randomMachine) {
      getRandomMachine();
    }
  }, [machines]);

  const handleMachineClick = (machine: Machine) => {
    setSelectedMachine(machine);
    setDetailsModalOpen(true);
  };

  return (
    <Layout onLoginClick={() => setLoginModalOpen(true)}>
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-4xl space-y-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/30 text-primary text-xs font-mono uppercase tracking-widest animate-fade-in">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              Sistema v2.0 Online
            </div>

            <h1 className="text-5xl md:text-7xl font-bold tracking-tighter leading-tight animate-slide-up">
              DOMINA EL ARTE DEL <br />
              <span className="glow-text">HACKING ÉTICO</span>
            </h1>

            <p className="text-xl md:text-2xl text-foreground/70 max-w-2xl font-mono animate-slide-up" style={{ animationDelay: "0.1s" }}>
              <span className="text-primary">&gt;</span> Plataforma de entrenamiento avanzado para profesionales de ciberseguridad.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 pt-4 animate-slide-up" style={{ animationDelay: "0.2s" }}>
              <Button
                onClick={() => setLoginModalOpen(true)}
                className="button-glow bg-primary text-background hover:bg-primary/90 text-lg h-14 px-8 font-mono uppercase tracking-widest rounded-sm"
              >
                $ iniciar_hack
              </Button>
              <Button
                variant="outline"
                className="neon-border text-lg h-14 px-8 font-mono uppercase tracking-widest rounded-sm hover:bg-card/50 hover:shadow-lg hover:shadow-primary/20"
              >
                $ ver_demo
              </Button>
            </div>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute top-1/2 right-0 -translate-y-1/2 translate-x-1/3 w-[800px] h-[800px] bg-primary/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -translate-x-1/3 translate-y-1/3 w-[600px] h-[600px] bg-secondary/5 rounded-full blur-3xl pointer-events-none" />
      </section>

      {/* Stats Section */}
      <section className="border-y border-primary/30 bg-card/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { label: "Usuarios", value: "10K+", icon: Users, color: "text-primary" },
              { label: "Máquinas", value: "500+", icon: Database, color: "text-secondary" },
              { label: "Desafíos", value: "1.2K", icon: Trophy, color: "text-accent" },
              { label: "Uptime", value: "99.9%", icon: Zap, color: "text-primary" },
            ].map((stat, index) => (
              <div key={index} className="space-y-2 font-mono">
                <div className="flex items-center gap-2 text-foreground/60 text-sm uppercase tracking-widest">
                  <stat.icon className={`w-4 h-4 ${stat.color}`} />
                  {stat.label}
                </div>
                <div className={`text-3xl font-bold ${stat.color} glow-text`}>
                  {stat.value}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24 md:py-40 relative">
        <div className="w-[95%] max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center space-y-6 max-w-3xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold tracking-tighter uppercase">
              <span className="border-b-4 border-primary/50 pb-2">Arsenal</span> de Herramientas
            </h2>
            <p className="text-lg md:text-xl text-foreground/70 font-mono">
              Todo lo que necesitas para pasar de script kiddie a elite hacker.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 lg:gap-8 pt-8">
            {[
              {
                title: "Laboratorios Virtuales",
                desc: "Entornos aislados y seguros para practicar sin riesgos.",
                icon: Shield,
                color: "text-primary",
                border: "border-primary/20",
              },
              {
                title: "Rutas de Aprendizaje",
                desc: "Curriculum estructurado desde básico hasta avanzado.",
                icon: BookOpen,
                color: "text-secondary",
                border: "border-secondary/20",
              },
              {
                title: "CTF Competitivos",
                desc: "Compite contra otros hackers en tiempo real.",
                icon: Target,
                color: "text-accent",
                border: "border-accent/20",
              },
            ].map((feature, index) => (
              <div
                key={index}
                className={`glow-box p-6 lg:p-8 ${feature.border} rounded-sm space-y-4 group hover:-translate-y-2 transition-all duration-300`}
              >
                <div className={`w-14 h-14 rounded-sm bg-background flex items-center justify-center border ${feature.border} group-hover:scale-110 transition-transform`}>
                  <feature.icon className={`w-7 h-7 ${feature.color}`} />
                </div>
                <h3 className="text-xl lg:text-2xl font-bold font-mono uppercase tracking-wide">
                  {feature.title}
                </h3>
                <p className="text-foreground/70 text-sm lg:text-base leading-relaxed">
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Advanced Search & Filters */}
      {/* Random Machine Suggestion */}
      {randomMachine && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
          <div className="glow-box p-6 border-secondary/40 neon-border-secondary rounded-sm animate-slide-up space-y-3">
            <div className="flex items-center gap-2 text-secondary font-mono text-sm">
              <Shuffle className="w-4 h-4" />
              <span className="uppercase tracking-widest">
                Máquina sugerida
              </span>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <h3 className="text-xl font-bold text-primary mb-2">
                  {randomMachine.name}
                </h3>
                <p className="text-foreground/70 text-sm font-mono">
                  {/* Technique placeholder */}
                  Web Exploitation
                </p>
              </div>
              <div className="flex items-end gap-3">
                <div className="space-y-1 flex-1">
                  <div className="flex justify-between text-xs text-foreground/60 font-mono mb-1">
                    <span>Dificultad:</span>
                    <span className="text-secondary font-bold">
                      {randomMachine.difficulty_text}
                    </span>
                  </div>
                  <div className="flex justify-between text-xs text-foreground/60 font-mono mb-1">
                    <span>SO:</span>
                    <span className="text-accent font-bold">
                      {randomMachine.os}
                    </span>
                  </div>
                  <div className="flex justify-between text-xs text-foreground/60 font-mono">
                    <span>Points:</span>
                    <span className="text-primary font-bold">
                      {randomMachine.points}
                    </span>
                  </div>
                </div>
                <Button
                  onClick={() => handleMachineClick(randomMachine)}
                  className="button-glow bg-secondary text-background hover:bg-secondary/90 font-mono uppercase tracking-widest rounded-sm px-6"
                >
                  $ ir
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Latest Active Machines */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 pb-20">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold tracking-tighter">
            <span className="glow-text">MÁQUINAS ACTIVAS</span>
          </h2>
          <Link to="/machines">
            <Button variant="outline" className="neon-border gap-2">
              VER TODAS <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>

        {loading ? (
          <div className="text-center py-10 font-mono text-primary animate-pulse">
            Cargando máquinas activas...
          </div>
        ) : (
          <div className={`grid ${CARD_CONFIG.gridCols} gap-4`}>
            {machines.slice(0, 20).map((machine) => (
              <button
                key={machine.id}
                onClick={() => handleMachineClick(machine)}
                className="glow-box p-4 border-primary/20 rounded-sm card-hover space-y-2 text-left transition-all hover:border-primary/50 hover:shadow-lg hover:shadow-primary/20 cursor-pointer"
              >
                <div className="flex items-start justify-between">
                  <div className="overflow-hidden">
                    <h4 className="font-bold text-sm uppercase tracking-wide text-primary truncate w-full" title={machine.name}>
                      {machine.name}
                    </h4>
                    <p className="text-[10px] text-foreground/60 mt-1 font-mono">
                      ACTIVA
                    </p>
                  </div>
                  <span
                    className={`px-2 py-1 rounded-sm bg-background text-[10px] font-semibold uppercase tracking-wider flex-shrink-0 ${machine.difficulty_text === "Easy"
                      ? "text-primary"
                      : machine.difficulty_text === "Medium"
                        ? "text-secondary"
                        : "text-accent"
                      }`}
                  >
                    {machine.difficulty_text}
                  </span>
                </div>

                <div className={`w-full ${CARD_CONFIG.imageHeight} bg-black/80 rounded-sm overflow-hidden mb-2 border border-primary/20 relative group scanline-overlay ${machine.difficulty_text === "Easy" ? "glitch-effect-easy" :
                  machine.difficulty_text === "Medium" ? "glitch-effect-medium" :
                    machine.difficulty_text === "Hard" ? "glitch-effect-hard" :
                      "glitch-effect-insane"
                  }`}>
                  {/* Neon overlay effect */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent z-10" />

                  {machine.avatar ? (
                    <div className="w-full h-full p-2 flex items-center justify-center">
                      <img
                        src={machine.avatar.startsWith('http') ? machine.avatar : `https://htb-mp-prod-public-storage.s3.eu-central-1.amazonaws.com${machine.avatar}`}
                        alt={machine.name}
                        className="w-full h-full object-contain opacity-90 group-hover:opacity-100 transition-all duration-300 group-hover:scale-105 filter drop-shadow-[0_0_5px_rgba(34,197,94,0.3)]"
                      />
                    </div>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-primary/20">
                      <Terminal className="w-8 h-8" />
                    </div>
                  )}
                  <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.8)] z-20" />
                </div>

                <div className="flex items-center justify-between gap-2 text-[10px] text-foreground/60 font-mono">
                  <span className="flex items-center gap-1">
                    {machine.os === 'Windows' ? <span className="text-blue-400">WIN</span> : machine.os === 'Linux' ? <span className="text-orange-400">LNX</span> : <span>{machine.os}</span>}
                  </span>
                  <span className="text-primary">{machine.points} PTS</span>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>




      {/* CTA Section - Only show if not authenticated */}
      {
        !isAuthenticated && (
          <section className="py-20 md:py-32 border-t border-primary/30 bg-gradient-to-b from-primary/5 to-secondary/5">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
              <div className="space-y-4 font-mono">
                <div className="text-primary uppercase tracking-widest text-sm">
                  &gt; ready
                </div>
                <h2 className="text-5xl md:text-6xl font-bold tracking-tighter">
                  <span className="glow-text">COMIENZA YA</span>
                </h2>
                <p className="text-xl text-foreground/70">
                  Únete a miles de hackers éticos. Acceso gratuito a máquinas
                  principiantes.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  onClick={() => setLoginModalOpen(true)}
                  className="button-glow bg-primary text-background hover:bg-primary/90 text-base h-12 px-8 font-mono uppercase tracking-widest rounded-sm"
                >
                  $ acceso
                  <ArrowRight className="w-4 h-4" />
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setLoginModalOpen(true)}
                  className="neon-border text-base h-12 px-8 font-mono uppercase tracking-widest rounded-sm hover:bg-card/50 hover:shadow-lg hover:shadow-primary/20"
                >
                  $ explora
                </Button>
              </div>
            </div>
          </section>
        )
      }

      {/* Modals */}
      <LoginModal
        isOpen={loginModalOpen}
        onClose={() => setLoginModalOpen(false)}
      />
      <MachineDetailsModal
        isOpen={detailsModalOpen}
        machine={selectedMachine}
        onClose={() => setDetailsModalOpen(false)}
      />
    </Layout >
  );
}
