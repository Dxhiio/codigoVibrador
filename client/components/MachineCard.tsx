import { Machine } from "@/hooks/useMachines";
import { CARD_CONFIG } from "@/constants/uiConfig";
import { Terminal, ArrowRight, Youtube } from "lucide-react";
import { CyberBadge } from "@/components/ui/CyberBadge";

interface MachineCardProps {
  machine: Machine;
  onClick: (machine: Machine) => void;
}

// Helper to get difficulty color intent
const getDifficultyIntent = (difficulty: string): "success" | "warning" | "danger" | "info" => {
  switch (difficulty) {
    case "Easy": return "success";
    case "Medium": return "info"; // Blue for medium to match previous design
    case "Hard": return "warning"; // Orange/Yellow
    case "Insane": return "danger";
    default: return "danger";
  }
};

// Helper to get OS color intent
const getOsIntent = (os: string): "info" | "warning" | "primary" => {
  switch (os) {
    case "Windows": return "info";
    case "Linux": return "warning";
    default: return "primary";
  }
};

export function MachineCard({ machine, onClick }: MachineCardProps) {
  const difficultyIntent = getDifficultyIntent(machine.difficulty_text);
  const osIntent = getOsIntent(machine.os);

  // Glitch effect class based on difficulty
  const glitchClass = 
    machine.difficulty_text === "Easy" ? "glitch-effect-easy" :
    machine.difficulty_text === "Medium" ? "glitch-effect-medium" :
    machine.difficulty_text === "Hard" ? "glitch-effect-hard" :
    "glitch-effect-insane";

  return (
    <button
      onClick={() => onClick(machine)}
      className={`group relative bg-card border border-primary/20 rounded-sm overflow-hidden hover:border-primary/60 transition-all duration-300 hover:shadow-[0_0_20px_rgba(34,197,94,0.1)] text-left flex flex-col h-full ${machine.status === 'retired' ? 'opacity-80 hover:opacity-100' : ''}`}
    >
      {/* Image Container */}
      <div className={`relative ${CARD_CONFIG.imageHeight} w-full bg-black/80 overflow-hidden border-b border-primary/20 group-hover:border-primary/50 transition-colors scanline-overlay ${glitchClass}`}>
        {/* Neon overlay effect */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent z-10" />

        {machine.avatar ? (
          <div className="w-full h-full p-4 flex items-center justify-center">
            <img
              src={machine.avatar.startsWith('http') ? machine.avatar : `https://htb-mp-prod-public-storage.s3.eu-central-1.amazonaws.com${machine.avatar}`}
              alt={machine.name}
              className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-105 opacity-90 group-hover:opacity-100 filter drop-shadow-[0_0_8px_rgba(34,197,94,0.3)]"
            />
          </div>
        ) : (
          <div className="w-full h-full flex items-center justify-center text-primary/20 bg-primary/5">
            <Terminal className="w-12 h-12" />
          </div>
        )}

        {/* Status Badge (Top Right) */}
        <div className="absolute top-2 right-2 z-20">
          <CyberBadge 
            variant="neon" 
            intent={machine.status === 'active' ? 'success' : 'danger'}
            className="bg-black/80 backdrop-blur-sm"
          >
            {machine.status === 'active' ? 'Active' : 'Retired'}
          </CyberBadge>
        </div>

        {/* Difficulty Badge (Bottom Left) */}
        <div className="absolute bottom-2 left-2 z-20">
          <CyberBadge 
            variant="neon" 
            intent={difficultyIntent}
            className="bg-black/90 backdrop-blur-sm"
          >
            {machine.difficulty_text}
          </CyberBadge>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-3 flex-1 flex flex-col w-full">
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-lg text-primary truncate group-hover:text-white transition-colors w-full">
            {machine.name}
          </h3>
          <div className="flex items-center gap-2 mt-1">
            <CyberBadge variant="ghost" size="sm" intent={osIntent} className="pl-0">
              {machine.os === 'Windows' ? 'WIN' : machine.os === 'Linux' ? 'LNX' : machine.os}
            </CyberBadge>
            <span className="text-xs text-foreground/40">•</span>
            <span className="text-xs font-mono text-foreground/60">{machine.points} pts</span>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-primary/10 flex items-center justify-between w-full">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-foreground/50">ID: #{machine.id}</span>
            {machine.video_url && (
              <CyberBadge 
                variant="neon" 
                intent="danger" 
                size="sm" 
                icon={<Youtube className="w-3 h-3" />}
                className="animate-pulse"
              >
                <span className="hidden sm:inline-block">VIDEO</span>
              </CyberBadge>
            )}
          </div>
          
          <div className="flex items-center gap-1 text-xs font-mono text-foreground/50 group-hover:text-primary/70 transition-colors group-hover:translate-x-1 duration-300">
            ACCESS <ArrowRight className="w-3 h-3" />
          </div>
        </div>
      </div>
    </button>
  );
}
