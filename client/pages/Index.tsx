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
  Calendar,
  Award,
  Lightbulb,
  Map,
} from "lucide-react";
import { useState, useEffect } from "react";

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

// Sample machines data
const MACHINES = [
  {
    id: 1,
    name: "Linux Privesc",
    technique: "Privilege Escalation",
    difficulty: "Intermediate",
    os: "Linux",
    cert: "CEH",
  },
  {
    id: 2,
    name: "WAF Bypass",
    technique: "Web Exploitation",
    difficulty: "Advanced",
    os: "Windows",
    cert: "OSCP",
  },
  {
    id: 3,
    name: "AD Enumeration",
    technique: "Active Directory",
    difficulty: "Beginner",
    os: "Windows",
    cert: "CEH",
  },
  {
    id: 4,
    name: "Buffer Overflow",
    technique: "Reverse Engineering",
    difficulty: "Advanced",
    os: "Linux",
    cert: "OSCP",
  },
  {
    id: 5,
    name: "SQL Injection",
    technique: "Web Exploitation",
    difficulty: "Beginner",
    os: "Linux",
    cert: "CEH",
  },
  {
    id: 6,
    name: "Kerberoast",
    technique: "Active Directory",
    difficulty: "Intermediate",
    os: "Windows",
    cert: "OSCP",
  },
];

const TECHNIQUES = [
  "All",
  "Web Exploitation",
  "Privilege Escalation",
  "Reverse Engineering",
  "Active Directory",
  "Cryptography",
];
const DIFFICULTIES = ["All", "Beginner", "Intermediate", "Advanced", "Insane"];
const OS_OPTIONS = ["All", "Linux", "Windows", "macOS", "IoT"];
const CERTIFICATIONS = ["All", "CEH", "OSCP", "Security+", "CompTIA"];

export default function Index() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTechnique, setSelectedTechnique] = useState("All");
  const [selectedDifficulty, setSelectedDifficulty] = useState("All");
  const [selectedOS, setSelectedOS] = useState("All");
  const [selectedCert, setSelectedCert] = useState("All");
  const [randomMachine, setRandomMachine] = useState<
    (typeof MACHINES)[0] | null
  >(null);
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [selectedMachine, setSelectedMachine] = useState<
    (typeof MACHINES)[0] | null
  >(null);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);

  // Filter machines based on selected filters
  const filteredMachines = MACHINES.filter((machine) => {
    const matchesSearch = machine.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesTechnique =
      selectedTechnique === "All" || machine.technique === selectedTechnique;
    const matchesDifficulty =
      selectedDifficulty === "All" || machine.difficulty === selectedDifficulty;
    const matchesOS = selectedOS === "All" || machine.os === selectedOS;
    const matchesCert = selectedCert === "All" || machine.cert === selectedCert;

    return (
      matchesSearch &&
      matchesTechnique &&
      matchesDifficulty &&
      matchesOS &&
      matchesCert
    );
  });

  // Get random machine
  const getRandomMachine = () => {
    const randomIdx = Math.floor(Math.random() * MACHINES.length);
    setRandomMachine(MACHINES[randomIdx]);
  };

  const handleMachineClick = (machine: (typeof MACHINES)[0]) => {
    setSelectedMachine(machine);
    setDetailsModalOpen(true);
  };

  return (
    <Layout onLoginClick={() => setLoginModalOpen(true)}>
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-32 right-20 w-96 h-96 bg-primary/5 rounded-full blur-3xl opacity-20 animate-pulse" />
          <div
            className="absolute bottom-10 left-10 w-96 h-96 bg-secondary/5 rounded-full blur-3xl opacity-20 animate-pulse"
            style={{ animationDelay: "1s" }}
          />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          {/* Logo & Tagline */}
          <div className="text-center space-y-6 mb-12 animate-float-up">
            <div className="flex items-center justify-center gap-3">
              <div className="p-3 rounded-sm bg-gradient-to-br from-primary to-secondary">
                <Terminal className="w-8 h-8 text-background" />
              </div>
            </div>

            <div className="space-y-3">
              <h1 className="text-6xl md:text-7xl font-bold tracking-tighter">
                <span className="glow-text">[HACKING VAULT]</span>
              </h1>
              <p className="text-2xl md:text-3xl font-mono text-primary/80 uppercase tracking-widest">
                Tu entrenador personal de hacking ético
              </p>
            </div>

            <div className="flex items-center justify-center gap-2 font-mono text-sm text-primary">
              <Radio className="w-4 h-4 animate-pulse" />
              <span>Sistema listo para entrenar</span>
            </div>
          </div>

          {/* Advanced Search & Filters */}
          <div className="max-w-5xl mx-auto space-y-6">
            {/* Main Search Bar */}
            <div className="glow-box p-6 border-primary/30 neon-border rounded-sm space-y-4 animate-slide-up">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-4 top-3.5 w-5 h-5 text-primary/50" />
                  <input
                    type="text"
                    placeholder="$ buscar máquinas..."
                    className="w-full bg-background border border-primary/30 rounded-sm pl-12 pr-4 py-3 text-foreground font-mono text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/30"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <Button
                  onClick={getRandomMachine}
                  className="button-glow bg-secondary text-background hover:bg-secondary/90 font-mono uppercase tracking-widest rounded-sm h-12 px-6 gap-2 whitespace-nowrap"
                >
                  <Shuffle className="w-4 h-4" />
                  sugerencia aleatoria
                </Button>
              </div>

              {/* Filter Tags */}
              <div className="space-y-4">
                {/* Techniques */}
                <div>
                  <label className="text-xs font-bold text-primary/70 uppercase tracking-widest mb-2 block">
                    $ técnica
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {TECHNIQUES.map((tech) => (
                      <button
                        key={tech}
                        onClick={() => setSelectedTechnique(tech)}
                        className={`px-3 py-1 rounded-sm text-xs font-mono uppercase tracking-wider transition-all ${
                          selectedTechnique === tech
                            ? "bg-primary text-background font-bold shadow-lg shadow-primary/50"
                            : "bg-card border border-primary/30 text-foreground/70 hover:border-primary/60 hover:text-primary"
                        }`}
                      >
                        {tech}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Difficulty */}
                <div>
                  <label className="text-xs font-bold text-secondary/70 uppercase tracking-widest mb-2 block">
                    $ dificultad
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {DIFFICULTIES.map((diff) => (
                      <button
                        key={diff}
                        onClick={() => setSelectedDifficulty(diff)}
                        className={`px-3 py-1 rounded-sm text-xs font-mono uppercase tracking-wider transition-all ${
                          selectedDifficulty === diff
                            ? "bg-secondary text-background font-bold shadow-lg shadow-secondary/50"
                            : "bg-card border border-secondary/30 text-foreground/70 hover:border-secondary/60 hover:text-secondary"
                        }`}
                      >
                        {diff}
                      </button>
                    ))}
                  </div>
                </div>

                {/* OS */}
                <div>
                  <label className="text-xs font-bold text-accent/70 uppercase tracking-widest mb-2 block">
                    $ sistema operativo
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {OS_OPTIONS.map((os) => (
                      <button
                        key={os}
                        onClick={() => setSelectedOS(os)}
                        className={`px-3 py-1 rounded-sm text-xs font-mono uppercase tracking-wider transition-all ${
                          selectedOS === os
                            ? "bg-accent text-background font-bold shadow-lg shadow-accent/50"
                            : "bg-card border border-accent/30 text-foreground/70 hover:border-accent/60 hover:text-accent"
                        }`}
                      >
                        {os}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Certification */}
                <div>
                  <label className="text-xs font-bold text-primary/70 uppercase tracking-widest mb-2 block">
                    $ certificación
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {CERTIFICATIONS.map((cert) => (
                      <button
                        key={cert}
                        onClick={() => setSelectedCert(cert)}
                        className={`px-3 py-1 rounded-sm text-xs font-mono uppercase tracking-wider transition-all ${
                          selectedCert === cert
                            ? "bg-primary text-background font-bold shadow-lg shadow-primary/50"
                            : "bg-card border border-primary/30 text-foreground/70 hover:border-primary/60 hover:text-primary"
                        }`}
                      >
                        {cert}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Random Machine Suggestion */}
            {randomMachine && (
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
                      {randomMachine.technique}
                    </p>
                  </div>
                  <div className="flex items-end gap-3">
                    <div className="space-y-1 flex-1">
                      <div className="flex justify-between text-xs text-foreground/60 font-mono mb-1">
                        <span>Dificultad:</span>
                        <span className="text-secondary font-bold">
                          {randomMachine.difficulty}
                        </span>
                      </div>
                      <div className="flex justify-between text-xs text-foreground/60 font-mono mb-1">
                        <span>SO:</span>
                        <span className="text-accent font-bold">
                          {randomMachine.os}
                        </span>
                      </div>
                      <div className="flex justify-between text-xs text-foreground/60 font-mono">
                        <span>Cert:</span>
                        <span className="text-primary font-bold">
                          {randomMachine.cert}
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
            )}

            {/* Results */}
            <div className="glow-box p-6 border-primary/30 neon-border rounded-sm">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-mono text-primary/70 uppercase tracking-widest">
                  $ resultados: {filteredMachines.length} máquinas
                </span>
              </div>
              <div className="grid md:grid-cols-2 gap-4 max-h-96 overflow-y-auto">
                {filteredMachines.map((machine) => (
                  <button
                    key={machine.id}
                    onClick={() => handleMachineClick(machine)}
                    className="glow-box p-4 border-primary/20 rounded-sm card-hover space-y-2 text-left transition-all hover:border-primary/50 hover:shadow-lg hover:shadow-primary/20 cursor-pointer"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-bold text-sm uppercase tracking-wide text-primary">
                          {machine.name}
                        </h4>
                        <p className="text-xs text-foreground/60 mt-1 font-mono">
                          {machine.technique}
                        </p>
                      </div>
                      <span
                        className={`px-2 py-1 rounded-sm bg-background text-xs font-semibold uppercase tracking-wider ${
                          machine.difficulty === "Beginner"
                            ? "text-primary"
                            : machine.difficulty === "Intermediate"
                              ? "text-secondary"
                              : "text-accent"
                        }`}
                      >
                        {machine.difficulty}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-foreground/60 font-mono">
                      <span>{machine.os}</span>
                      <span>•</span>
                      <span>{machine.cert}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Key Features Section */}
      <section className="py-20 md:py-32 border-t border-primary/30 bg-card/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 mb-16">
            <div className="font-mono text-primary text-sm uppercase tracking-widest">
              &gt; funcionalidades principales
            </div>
            <h2 className="text-5xl md:text-6xl font-bold tracking-tighter">
              <span className="glow-text">[CARACTERÍSTICAS]</span>
            </h2>
            <p className="text-lg text-foreground/70 max-w-2xl mx-auto font-mono">
              Herramientas para dominar la ciberseguridad
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: BookOpen,
                title: "Tutoriales Detallados",
                desc: "Guías paso a paso para cada máquina y exploit",
                color: "text-primary border-primary/30",
              },
              {
                icon: Trophy,
                title: "Progreso Gamificado",
                desc: "Puntos, badges y leaderboards por logros",
                color: "text-secondary border-secondary/30",
              },
              {
                icon: Map,
                title: "Roadmaps por Certificación",
                desc: "Caminos estructurados para CEH, OSCP y más",
                color: "text-accent border-accent/30",
              },
              {
                icon: Lightbulb,
                title: "Notas con Timestamp",
                desc: "Guarda apuntes con marcas de tiempo durante prácticas",
                color: "text-primary border-primary/30",
              },
              {
                icon: Calendar,
                title: "Calendario de Progreso",
                desc: "Visualiza tu consistencia y racha de entrenamiento",
                color: "text-secondary border-secondary/30",
              },
              {
                icon: Award,
                title: "Certificaciones Tracked",
                desc: "Prepárate y sigue el progreso hacia tus certs",
                color: "text-accent border-accent/30",
              },
            ].map((feature, idx) => (
              <div
                key={idx}
                className={`glow-box p-6 border rounded-sm card-hover space-y-3 ${feature.color}`}
              >
                <div className="w-10 h-10 rounded-sm bg-background/50 flex items-center justify-center">
                  <feature.icon
                    className={`w-6 h-6 ${feature.color.split(" ")[0]}`}
                  />
                </div>
                <h3 className="text-lg font-bold font-mono uppercase tracking-wide">
                  {feature.title}
                </h3>
                <p className="text-foreground/70 text-sm font-mono">
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 md:py-32 border-t border-primary/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 mb-16">
            <div className="font-mono text-secondary text-sm uppercase tracking-widest">
              &gt; flujo de trabajo
            </div>
            <h2 className="text-5xl md:text-6xl font-bold tracking-tighter">
              Tu Entrenamiento
            </h2>
          </div>

          <div className="grid md:grid-cols-4 gap-6">
            {[
              {
                step: "01",
                title: "Busca & Filtra",
                desc: "Encuentra máquinas por técnica, dificultad o certificación",
              },
              {
                step: "02",
                title: "Estudia",
                desc: "Accede a tutoriales y documentación detallada",
              },
              {
                step: "03",
                title: "Practica",
                desc: "Exploita la máquina y toma notas durante el proceso",
              },
              {
                step: "04",
                title: "Aprende",
                desc: "Gana puntos, badges y avanza en tu roadmap",
              },
            ].map((item, idx) => (
              <div key={idx} className="relative">
                <div className="glow-box p-6 border-primary/30 neon-border rounded-sm space-y-4">
                  <div className="text-4xl font-bold text-primary/30 font-mono">
                    {item.step}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold font-mono uppercase tracking-wide text-primary mb-2">
                      {item.title}
                    </h3>
                    <p className="text-sm text-foreground/70 font-mono">
                      {item.desc}
                    </p>
                  </div>
                </div>
                {idx < 3 && (
                  <div className="hidden md:block absolute -right-3 top-1/2 transform -translate-y-1/2">
                    <ArrowRight className="w-6 h-6 text-primary/30" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
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
            <Button className="button-glow bg-primary text-background hover:bg-primary/90 text-base h-12 px-8 font-mono uppercase tracking-widest rounded-sm">
              $ acceso
              <ArrowRight className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              className="neon-border text-base h-12 px-8 font-mono uppercase tracking-widest rounded-sm hover:bg-card/50 hover:shadow-lg hover:shadow-primary/20"
            >
              $ explora
            </Button>
          </div>
        </div>
      </section>

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
    </Layout>
  );
}
