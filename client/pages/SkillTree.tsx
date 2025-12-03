import { useState } from "react";
import Layout from "@/components/Layout";
import { CyberBadge } from "@/components/ui/cyber-badge";
import { useSkillTreeMachines } from "@/hooks/useSkillTreeMachines";
import { Machine } from "@/hooks/useMachines";
import { Brain, Network, Terminal, Key, Shield, Server, Zap, Lock, Unlock, Trophy, Play, CheckCircle } from "lucide-react";
import MachineDetailsModal from "@/components/MachineDetailsModal";
import { useUserProgress } from "@/hooks/useUserProgress";
import AntigravityParticles from "@/components/AntigravityParticles";

// SKILL CATEGORIES (PHASES)
const CATEGORIES = {
  recon: { id: 'recon', name: 'PHASE I: GHOST PROTOCOL', color: 'text-cyan-400', border: 'border-cyan-500', glow: 'shadow-cyan-500/50', bg: 'bg-cyan-950/30' },
  scan: { id: 'scan', name: 'PHASE II: VULN ANALYSIS', color: 'text-yellow-400', border: 'border-yellow-500', glow: 'shadow-yellow-500/50', bg: 'bg-yellow-950/30' },
  exploit: { id: 'exploit', name: 'PHASE III: RED ASSAULT', color: 'text-red-500', border: 'border-red-500', glow: 'shadow-red-500/50', bg: 'bg-red-950/30' },
  privesc: { id: 'privesc', name: 'PHASE IV: GOD MODE', color: 'text-purple-500', border: 'border-purple-500', glow: 'shadow-purple-500/50', bg: 'bg-purple-950/30' },
  post: { id: 'post', name: 'PHASE V: SHADOW OPS', color: 'text-emerald-500', border: 'border-emerald-500', glow: 'shadow-emerald-500/50', bg: 'bg-emerald-950/30' }
};

// MASSIVE SKILL TREE STRUCTURE (V5.2 - INTERNAL TIERS)
const SKILL_NODES = [
  // --- PHASE I: GHOST PROTOCOL (RECON) ---
  {
    id: "recon",
    title: "Reconnaissance",
    technique_name: "Reconnaissance",
    category: "recon",
    description: "El origen. Aprende a ver lo invisible.",
    status: "unlocked",
    x: 50,
    y: 5,
    icon: <Brain className="w-6 h-6" />,
    tier: 1, // Easy
    machines_count: 312
  },
  {
    id: "smb_enum",
    title: "SMB Enumeration",
    technique_name: "SMB Enumeration",
    category: "recon",
    description: "Protocolos compartidos inseguros.",
    status: "locked",
    x: 30,
    y: 12,
    icon: <Network className="w-5 h-5" />,
    tier: 1, // Easy
    machines_count: 20
  },
  {
    id: "subdomain_enum",
    title: "Subdomain Enum",
    technique_name: "Subdomain Enumeration",
    category: "recon",
    description: "Expande tu superficie de ataque.",
    status: "locked",
    x: 70,
    y: 12,
    icon: <Network className="w-5 h-5" />,
    tier: 2, // Medium
    machines_count: 27
  },
  {
    id: "info_leak",
    title: "Information Leakage",
    technique_name: "Information Leakage",
    category: "recon",
    description: "Detecta secretos expuestos.",
    status: "locked",
    x: 50,
    y: 18,
    icon: <Zap className="w-5 h-5" />,
    tier: 3, // Hard
    machines_count: 234
  },

  // --- PHASE II: VULN ANALYSIS (SCAN) ---
  {
    id: "web_discovery",
    title: "Web Discovery",
    technique_name: "Web Site Structure Discovery",
    category: "scan",
    description: "Mapeo de directorios ocultos.",
    status: "locked",
    x: 20,
    y: 28,
    icon: <Network className="w-5 h-5" />,
    tier: 2, // Medium
    machines_count: 156
  },
  {
    id: "user_enum",
    title: "User Enumeration",
    technique_name: "User Enumeration",
    category: "scan",
    description: "Identifica usuarios válidos.",
    status: "locked",
    x: 80,
    y: 28,
    icon: <Brain className="w-5 h-5" />,
    tier: 2, // Medium
    machines_count: 112
  },
  {
    id: "config_analysis",
    title: "Config Analysis",
    technique_name: "Configuration Analysis",
    category: "scan",
    description: "Explotación de configuraciones inseguras.",
    status: "locked",
    x: 35,
    y: 35,
    icon: <Zap className="w-5 h-5" />,
    tier: 3, // Hard
    machines_count: 108
  },
  {
    id: "fuzzing",
    title: "Fuzzing",
    technique_name: "Fuzzing",
    category: "scan",
    description: "Bombardea inputs para encontrar fallos.",
    status: "locked",
    x: 65,
    y: 35,
    icon: <Terminal className="w-5 h-5" />,
    tier: 4, // Insane
    machines_count: 105
  },

  // --- PHASE III: RED ASSAULT (EXPLOIT) ---
  {
    id: "brute_force",
    title: "Brute Force",
    technique_name: "Brute Force Attack",
    category: "exploit",
    description: "Ataques directos (SSH, FTP).",
    status: "locked",
    x: 50,
    y: 45,
    icon: <Key className="w-5 h-5" />,
    tier: 1, // Easy
    machines_count: 98
  },
  {
    id: "pass_reuse",
    title: "Pass Reuse",
    technique_name: "Password Reuse",
    category: "exploit",
    description: "Reutilización de credenciales.",
    status: "locked",
    x: 20,
    y: 52,
    icon: <Key className="w-5 h-5" />,
    tier: 1, // Easy
    machines_count: 150
  },
  {
    id: "pass_spraying",
    title: "Pass Spraying",
    technique_name: "Password Spraying",
    category: "exploit",
    description: "Una contraseña, muchos usuarios.",
    status: "locked",
    x: 80,
    y: 52,
    icon: <Key className="w-5 h-5" />,
    tier: 2, // Medium
    machines_count: 65
  },
  {
    id: "pass_cracking",
    title: "Pass Cracking",
    technique_name: "Password Cracking",
    category: "exploit",
    description: "Rompiendo hashes offline.",
    status: "locked",
    x: 35,
    y: 58,
    icon: <Unlock className="w-5 h-5" />,
    tier: 3, // Hard
    machines_count: 189
  },
  {
    id: "binary_exploit",
    title: "Binary Exploit",
    technique_name: "Binary Exploitation",
    category: "exploit",
    description: "Buffer Overflows y memoria.",
    status: "locked",
    x: 65,
    y: 58,
    icon: <Server className="w-5 h-5" />,
    tier: 5, // Insane
    machines_count: 45
  },

  // --- PHASE IV: GOD MODE (PRIVESC) ---
  {
    id: "sudo_exploit",
    title: "SUDO Exploit",
    technique_name: "SUDO Exploitation",
    category: "privesc",
    description: "Abuso de permisos SUDO.",
    status: "locked",
    x: 30,
    y: 72,
    icon: <Shield className="w-6 h-6" />,
    tier: 2, // Medium
    machines_count: 120
  },
  {
    id: "suid_exploit",
    title: "SUID Exploit",
    technique_name: "SUID Exploitation",
    category: "privesc",
    description: "Binarios con permisos especiales.",
    status: "locked",
    x: 70,
    y: 72,
    icon: <Shield className="w-6 h-6" />,
    tier: 3, // Hard
    machines_count: 110
  },
  {
    id: "cron_abuse",
    title: "Cron Abuse",
    technique_name: "Scheduled Job Abuse",
    category: "privesc",
    description: "Secuestro de tareas programadas.",
    status: "locked",
    x: 50,
    y: 78,
    icon: <Terminal className="w-5 h-5" />,
    tier: 4, // Insane
    machines_count: 78
  },

  // --- PHASE V: SHADOW OPS (POST) ---
  {
    id: "port_forwarding",
    title: "Port Forwarding",
    technique_name: "Port Forwarding",
    category: "post",
    description: "Acceso a servicios internos.",
    status: "locked",
    x: 30,
    y: 88,
    icon: <Network className="w-5 h-5" />,
    tier: 3, // Hard
    machines_count: 92
  },
  {
    id: "tunneling",
    title: "Tunneling",
    technique_name: "Tunneling",
    category: "post",
    description: "Encapsulamiento de tráfico.",
    status: "locked",
    x: 70,
    y: 88,
    icon: <Network className="w-5 h-5" />,
    tier: 4, // Insane
    machines_count: 85
  },
  {
    id: "pivoting",
    title: "Pivoting",
    technique_name: "Pivoting",
    category: "post",
    description: "Dominio total de la red.",
    status: "locked",
    x: 50,
    y: 95,
    icon: <Trophy className="w-8 h-8 text-yellow-500" />,
    tier: 5, // Insane
    machines_count: 145
  }
];

const CONNECTIONS = [
  // Phase 1 Internal
  { from: "recon", to: "smb_enum" },
  { from: "recon", to: "subdomain_enum" },
  { from: "smb_enum", to: "info_leak" },
  { from: "subdomain_enum", to: "info_leak" },

  // Phase 1 -> Phase 2
  { from: "info_leak", to: "web_discovery" },
  { from: "info_leak", to: "user_enum" },

  // Phase 2 Internal
  { from: "web_discovery", to: "fuzzing" },
  { from: "user_enum", to: "config_analysis" },

  // Phase 2 -> Phase 3
  { from: "fuzzing", to: "brute_force" },
  { from: "config_analysis", to: "brute_force" },

  // Phase 3 Internal
  { from: "brute_force", to: "pass_spraying" },
  { from: "brute_force", to: "pass_reuse" },
  { from: "pass_spraying", to: "pass_cracking" },
  { from: "pass_reuse", to: "pass_cracking" },
  { from: "pass_cracking", to: "binary_exploit" },

  // Phase 3 -> Phase 4
  { from: "binary_exploit", to: "sudo_exploit" },
  { from: "binary_exploit", to: "suid_exploit" },

  // Phase 4 Internal
  { from: "sudo_exploit", to: "cron_abuse" },
  { from: "suid_exploit", to: "cron_abuse" },

  // Phase 4 -> Phase 5
  { from: "cron_abuse", to: "tunneling" },
  { from: "cron_abuse", to: "port_forwarding" },

  // Phase 5 Internal
  { from: "tunneling", to: "pivoting" },
  { from: "port_forwarding", to: "pivoting" }
];

function MachineListItem({ machine, onClick, isCompleted }: { machine: Machine; onClick: (m: Machine) => void; isCompleted: boolean }) {
  return (
    <button 
      onClick={() => onClick(machine)}
      className={`w-full flex items-center gap-3 p-2 rounded border transition-all group text-left ${
        isCompleted 
          ? "bg-green-500/10 border-green-500/30 hover:bg-green-500/20" 
          : "bg-black/40 border-white/5 hover:border-primary/50 hover:bg-primary/5"
      }`}
    >
      <div className={`w-8 h-8 rounded flex items-center justify-center overflow-hidden border ${
        isCompleted ? "border-green-500/50 bg-green-500/20" : "border-white/10 bg-black"
      }`}>
        {machine.avatar ? (
          <img src={machine.avatar} alt={machine.name} className="w-full h-full object-cover" />
        ) : (
          <Terminal className={`w-4 h-4 ${isCompleted ? "text-green-500" : "text-primary/50"}`} />
        )}
      </div>
      <div className="flex-1 min-w-0">
        <div className={`text-sm font-bold truncate ${isCompleted ? "text-green-400" : "text-foreground group-hover:text-primary"}`}>
          {machine.name}
        </div>
        <div className="flex items-center gap-2 text-[10px] text-foreground/50 font-mono">
          <span className={machine.os === 'Windows' ? 'text-blue-400' : 'text-orange-400'}>{machine.os}</span>
          <span>•</span>
          <span>{machine.points} pts</span>
        </div>
      </div>
      {isCompleted ? (
        <CheckCircle className="w-4 h-4 text-green-500" />
      ) : (
        <Play className="w-4 h-4 text-foreground/30 group-hover:text-primary transition-colors" />
      )}
    </button>
  );
}

export default function SkillTree() {
  const [selectedNode, setSelectedNode] = useState<typeof SKILL_NODES[0] | null>(SKILL_NODES[0]);
  const [selectedMachine, setSelectedMachine] = useState<Machine | null>(null);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);

  const { data: skillPath, isLoading: isLoadingPath } = useSkillTreeMachines(selectedNode?.technique_name, selectedNode?.tier);
  const { isCompleted } = useUserProgress();

  const handleMachineClick = (machine: Machine) => {
    setSelectedMachine(machine);
    setDetailsModalOpen(true);
  };

  // Calculate progress for current node
  const totalMachinesInPath = skillPath ? 
    skillPath.level1.length + skillPath.level2.length + skillPath.level3.length + skillPath.level4.length 
    : 0;
  
  const completedCount = skillPath ? 
    [...skillPath.level1, ...skillPath.level2, ...skillPath.level3, ...skillPath.level4]
    .filter(m => isCompleted(m.id)).length 
    : 0;

  const progressPercentage = totalMachinesInPath > 0 ? (completedCount / totalMachinesInPath) * 100 : 0;

  return (
    <Layout disableDefaultParticles={true}>
      <div className="pt-24 pb-12 min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/5 via-background to-background relative z-10">
        <div className="w-[95%] mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          
          {/* Header */}
          <div className="text-center space-y-4 mb-8">
            <CyberBadge variant="neon" intent="accent" size="lg" className="animate-pulse">
              SYSTEM V5.2 // PHASE_GRID
            </CyberBadge>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tighter uppercase glow-text">
              Árbol de Habilidades
            </h1>
            <p className="text-xl text-foreground/70 font-mono max-w-2xl mx-auto">
              Domina las técnicas. Escala tu nivel. Conviértete en Root.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8 h-[1400px]">
            
            {/* Tree Visualization Area */}
            <div className="lg:col-span-2 glow-box border-primary/30 relative overflow-hidden rounded-sm bg-black/40 backdrop-blur-sm">
              {/* Grid Background */}
              <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-50" />
              
              {/* Phase Indicators (Background Labels) */}
              <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-[5%] left-4 text-cyan-500/10 text-6xl font-black uppercase tracking-widest rotate-90 origin-top-left">PHASE I</div>
                <div className="absolute top-[25%] right-4 text-yellow-500/10 text-6xl font-black uppercase tracking-widest -rotate-90 origin-top-right">PHASE II</div>
                <div className="absolute top-[45%] left-4 text-red-500/10 text-6xl font-black uppercase tracking-widest rotate-90 origin-top-left">PHASE III</div>
                <div className="absolute top-[65%] right-4 text-purple-500/10 text-6xl font-black uppercase tracking-widest -rotate-90 origin-top-right">PHASE IV</div>
                <div className="absolute top-[85%] left-4 text-emerald-500/10 text-6xl font-black uppercase tracking-widest rotate-90 origin-top-left">PHASE V</div>
              </div>

              <div className="relative w-full h-full p-8 z-10">
                <svg className="absolute inset-0 w-full h-full pointer-events-none">
                  {CONNECTIONS.map((conn, i) => {
                    const start = SKILL_NODES.find(n => n.id === conn.from);
                    const end = SKILL_NODES.find(n => n.id === conn.to);
                    
                    if (!start || !end) return null;

                    const categoryColor = CATEGORIES[start.category as keyof typeof CATEGORIES]?.color.replace('text-', 'stroke-') || 'stroke-primary';
                    
                    return (
                      <g key={i}>
                        <line
                          x1={`${start.x}%`}
                          y1={`${start.y}%`}
                          x2={`${end.x}%`}
                          y2={`${end.y}%`}
                          className={`stroke-2 opacity-30 ${categoryColor}`}
                        />
                        <circle r="2" fill="currentColor" className="text-primary animate-ping">
                          <animateMotion 
                            dur={`${2 + i % 3}s`} 
                            repeatCount="indefinite"
                            path={`M${start.x * 8} ${start.y * 6} L${end.x * 8} ${end.y * 6}`} 
                          />
                        </circle>
                      </g>
                    );
                  })}
                </svg>

                {SKILL_NODES.map((node) => {
                  const cat = CATEGORIES[node.category as keyof typeof CATEGORIES];
                  if (!cat) return null;

                  return (
                    <button
                      key={node.id}
                      onClick={() => setSelectedNode(node)}
                      className={`absolute transform -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-full border-2 flex items-center justify-center transition-all duration-300 hover:scale-110 z-10 ${
                        node.status === 'completed' ? `${cat.bg} ${cat.border} ${cat.color} ${cat.glow}` :
                        node.status === 'unlocked' ? `${cat.border} ${cat.color} animate-pulse bg-black` :
                        'bg-muted/10 border-muted text-muted-foreground grayscale opacity-70'
                      } ${selectedNode?.id === node.id ? 'ring-2 ring-white ring-offset-2 ring-offset-black scale-110' : ''}`}
                      style={{ left: `${node.x}%`, top: `${node.y}%` }}
                    >
                      {node.status === 'locked' ? <Lock className="w-6 h-6" /> : node.icon}
                      
                      <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 whitespace-nowrap">
                        <span className={`text-[10px] font-mono font-bold bg-black/80 px-2 py-0.5 rounded border border-white/10 ${cat.color}`}>
                          {cat.name.split(': ')[1]}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
              
              {/* Particles Layer - Moved to bottom for better layering */}
              <AntigravityParticles />
            </div>

            {/* Node Details Panel */}
            <div className="glow-box border-secondary/30 bg-card/50 p-6 rounded-sm flex flex-col h-full relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
                <Terminal className="w-64 h-64" />
              </div>

              {selectedNode ? (
                <div className="flex flex-col h-full space-y-6 animate-in fade-in slide-in-from-right duration-300 relative z-10 overflow-y-auto pr-2 custom-scrollbar">
                  <div className="space-y-2 flex-shrink-0">
                    <div className="flex items-center justify-between">
                      <CyberBadge 
                        variant={selectedNode.status === 'locked' ? 'outline' : 'neon'} 
                        intent={selectedNode.status === 'completed' ? 'success' : selectedNode.status === 'unlocked' ? 'info' : 'primary'}
                      >
                        {selectedNode.status.toUpperCase()}
                      </CyberBadge>
                      <span className="text-xs font-mono text-foreground/50">TIER {selectedNode.tier}</span>
                    </div>
                    <h2 className="text-2xl font-bold text-primary uppercase tracking-wide">
                      {selectedNode.title}
                    </h2>
                    
                    {/* Progress Bar */}
                    <div className="flex items-center gap-2 text-xs font-mono pt-2">
                      <div className="flex-1 h-2 bg-black/50 rounded-full overflow-hidden border border-white/10">
                        <div 
                          className="h-full bg-gradient-to-r from-primary to-green-400 transition-all duration-500" 
                          style={{ width: `${progressPercentage}%` }} 
                        />
                      </div>
                      <span className={progressPercentage === 100 ? "text-green-400 font-bold" : "text-primary"}>
                        {completedCount}/{totalMachinesInPath}
                      </span>
                    </div>
                  </div>

                  <p className="text-foreground/80 font-mono leading-relaxed border-l-2 border-primary/30 pl-4 flex-shrink-0">
                    {selectedNode.description}
                  </p>

                  {/* Recommended Machines Section */}
                  <div className="flex-1 space-y-6">
                    <h3 className="text-sm font-bold text-secondary uppercase tracking-widest border-b border-white/10 pb-2">
                      &gt; Ruta de Entrenamiento
                    </h3>

                    {isLoadingPath ? (
                      <div className="flex flex-col items-center justify-center py-8 space-y-2 text-foreground/50">
                        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                        <span className="text-xs font-mono">Calculando ruta óptima...</span>
                      </div>
                    ) : skillPath ? (
                      <div className="space-y-6">
                        {/* Level 1: Easy */}
                        {skillPath.level1.length > 0 && (
                          <div className="space-y-2">
                            <div className="flex items-center justify-between text-xs font-bold text-green-400 uppercase">
                              <span>Nivel I: Iniciado</span>
                              <span className="bg-green-500/10 px-2 py-0.5 rounded border border-green-500/20">{skillPath.level1.length} Máquinas</span>
                            </div>
                            <div className="space-y-2">
                              {skillPath.level1.map(m => (
                                <MachineListItem 
                                  key={m.id} 
                                  machine={m} 
                                  onClick={handleMachineClick}
                                  isCompleted={isCompleted(m.id)}
                                />
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Level 2: Medium */}
                        {skillPath.level2.length > 0 && (
                          <div className="space-y-2">
                            <div className="flex items-center justify-between text-xs font-bold text-blue-400 uppercase">
                              <span>Nivel II: Adepto</span>
                              <span className="bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/20">{skillPath.level2.length} Máquinas</span>
                            </div>
                            <div className="space-y-2">
                              {skillPath.level2.map(m => (
                                <MachineListItem 
                                  key={m.id} 
                                  machine={m} 
                                  onClick={handleMachineClick}
                                  isCompleted={isCompleted(m.id)}
                                />
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Level 3: Hard */}
                        {skillPath.level3.length > 0 && (
                          <div className="space-y-2">
                            <div className="flex items-center justify-between text-xs font-bold text-orange-400 uppercase">
                              <span>Nivel III: Maestro</span>
                              <span className="bg-orange-500/10 px-2 py-0.5 rounded border border-orange-500/20">{skillPath.level3.length} Máquinas</span>
                            </div>
                            <div className="space-y-2">
                              {skillPath.level3.map(m => (
                                <MachineListItem 
                                  key={m.id} 
                                  machine={m} 
                                  onClick={handleMachineClick}
                                  isCompleted={isCompleted(m.id)}
                                />
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Level 4: Insane */}
                        {skillPath.level4.length > 0 && (
                          <div className="space-y-2">
                            <div className="flex items-center justify-between text-xs font-bold text-red-500 uppercase">
                              <span>Nivel IV: Leyenda</span>
                              <span className="bg-red-500/10 px-2 py-0.5 rounded border border-red-500/20">{skillPath.level4.length} Máquinas</span>
                            </div>
                            <div className="space-y-2">
                              {skillPath.level4.map(m => (
                                <MachineListItem 
                                  key={m.id} 
                                  machine={m} 
                                  onClick={handleMachineClick}
                                  isCompleted={isCompleted(m.id)}
                                />
                              ))}
                            </div>
                          </div>
                        )}
                        
                        {skillPath.totalAvailable === 0 && (
                          <div className="text-center py-8 text-foreground/50 text-sm">
                            No hay máquinas disponibles para esta técnica aún.
                          </div>
                        )}
                      </div>
                    ) : null}
                  </div>
                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-4 text-foreground/40">
                  <div className="w-20 h-20 rounded-full border-2 border-dashed border-foreground/20 flex items-center justify-center animate-spin-slow">
                    <Brain className="w-8 h-8" />
                  </div>
                  <p className="font-mono text-sm">Selecciona un nodo del árbol para ver los detalles de la misión.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <MachineDetailsModal
        isOpen={detailsModalOpen}
        machine={selectedMachine}
        onClose={() => setDetailsModalOpen(false)}
      />
    </Layout>
  );
}
