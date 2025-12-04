import Layout from "@/components/Layout";
import { useAuth } from "@/context/AuthContext";
import { useProfile } from "@/hooks/useProfile";
import { 
  Trophy, 
  Target, 
  Calendar, 
  Book, 
  Settings, 
  LogOut,
  CheckCircle2,
  Star,
  LayoutGrid,
  Laptop
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useState } from "react";

export default function Profile() {
  const [activeTab, setActiveTab] = useState("progress");
  const { user, logout } = useAuth();
  const { stats, certProgress, userMachines, wishlist, loading } = useProfile();

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen pt-24 flex items-center justify-center">
          <div className="text-primary font-mono animate-pulse">
            $ cargando perfil...
          </div>
        </div>
      </Layout>
    );
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case "progress":
        return (
          <div className="space-y-6 animate-fade-in">
            <div className="border-l-2 border-secondary pl-4">
              <h2 className="text-xl font-bold text-secondary uppercase tracking-widest">
                &gt;&gt; Progreso por Certificación
              </h2>
              <p className="text-sm text-foreground/60 font-mono">
                Completa todas las máquinas de una certificación para estar preparado
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {certProgress?.map((cert) => (
                <div key={cert.id} className="bg-card/30 border border-white/5 p-4 rounded-sm hover:border-primary/20 transition-colors">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-bold text-primary/90 uppercase tracking-wide">
                      {cert.name}
                    </h3>
                    <span className="text-lg font-bold text-primary">
                      {cert.percentage}%
                    </span>
                  </div>
                  
                  <div className="h-3 bg-black/40 rounded-full overflow-hidden mb-2">
                    <div 
                      className="h-full bg-gradient-to-r from-primary/30 to-primary/80 rounded-full transition-all duration-1000"
                      style={{ width: `${cert.percentage}%` }}
                    />
                  </div>
                  
                  <div className="text-xs font-mono text-foreground/50">
                    {cert.completedMachines} de {cert.totalMachines} completadas
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      case "machines":
        return (
          <div className="space-y-6 animate-fade-in">
            <div className="border-l-2 border-primary pl-4">
              <h2 className="text-xl font-bold text-primary uppercase tracking-widest">
                &gt;&gt; Mis Máquinas Resueltas
              </h2>
              <p className="text-sm text-foreground/60 font-mono">
                Historial de conquistas en el sistema
              </p>
            </div>
            
            {userMachines && userMachines.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {userMachines.map((machine: any) => (
                  <div key={machine.id} className="glow-box p-4 border-primary/20 rounded-sm flex items-center gap-4">
                    <div className="w-12 h-12 rounded-sm bg-black/50 flex items-center justify-center border border-white/10">
                      {machine.avatar ? (
                        <img src={machine.avatar} alt={machine.name} className="w-full h-full object-contain p-1" />
                      ) : (
                        <Laptop className="w-6 h-6 text-primary/50" />
                      )}
                    </div>
                    <div>
                      <h4 className="font-bold text-primary uppercase">{machine.name}</h4>
                      <div className="flex gap-2 text-[10px] font-mono text-foreground/60">
                         <span>{machine.os}</span>
                         <span className="text-primary">{machine.points} PTS</span>
                      </div>
                      <div className="text-[10px] text-foreground/40 mt-1">
                        Resuelta: {new Date(machine.completed_at).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-foreground/50 font-mono">
                No has resuelto ninguna máquina aún. ¡Empieza a hackear!
              </div>
            )}
          </div>
        );
      case "trophies":
        return (
          <div className="text-center py-20 animate-fade-in">
             <Trophy className="w-16 h-16 text-accent/20 mx-auto mb-4" />
             <h3 className="text-xl font-bold text-accent uppercase tracking-widest mb-2">Sistema de Trofeos</h3>
             <p className="text-foreground/50 font-mono">Próximamente disponible...</p>
          </div>
        );
       case "notes":
        return (
          <div className="text-center py-20 animate-fade-in">
             <Book className="w-16 h-16 text-pink-400/20 mx-auto mb-4" />
             <h3 className="text-xl font-bold text-pink-400 uppercase tracking-widest mb-2">Mis Notas</h3>
             <p className="text-foreground/50 font-mono">Próximamente disponible...</p>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <Layout>
      <div className="min-h-screen pt-24 pb-12">
        <div className="w-[95%] max-w-7xl mx-auto space-y-8">
          
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-primary/30 pb-6">
            <div>
              <h1 className="text-3xl font-bold tracking-tighter uppercase flex items-center gap-2">
                <span className="text-primary">&gt;</span> MI PERFIL
              </h1>
              <p className="text-foreground/60 font-mono text-sm mt-1">
                $ Progreso del usuario
              </p>
            </div>
            <div className="flex items-center gap-4">
              {/* Username removed to avoid duplication with global header */}
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Solved */}
            <div className="glow-box p-6 border-primary/30 neon-border rounded-sm relative overflow-hidden group">
              <div className="flex justify-between items-start relative z-10">
                <div>
                  <div className="text-xs font-bold text-primary/70 uppercase tracking-widest mb-2">
                    RESUELTAS
                  </div>
                  <div className="text-4xl font-bold text-primary glow-text">
                    {stats?.solvedCount}
                  </div>
                </div>
                <CheckCircle2 className="w-8 h-8 text-primary/50 group-hover:text-primary transition-colors" />
              </div>
              <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-primary/5 rounded-full blur-xl group-hover:bg-primary/10 transition-all" />
            </div>

            {/* Wishlist */}
            <div className="glow-box p-6 border-secondary/30 neon-border-secondary rounded-sm relative overflow-hidden group">
              <div className="flex justify-between items-start relative z-10">
                <div>
                  <div className="text-xs font-bold text-secondary/70 uppercase tracking-widest mb-2">
                    DESEADAS
                  </div>
                  <div className="text-4xl font-bold text-secondary glow-text">
                    {stats?.wishlistCount}
                  </div>
                </div>
                <Star className="w-8 h-8 text-secondary/50 group-hover:text-secondary transition-colors" />
              </div>
              <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-secondary/5 rounded-full blur-xl group-hover:bg-secondary/10 transition-all" />
            </div>

            {/* Available */}
            <div className="glow-box p-6 border-accent/30 neon-border-accent rounded-sm relative overflow-hidden group">
              <div className="flex justify-between items-start relative z-10">
                <div>
                  <div className="text-xs font-bold text-accent/70 uppercase tracking-widest mb-2">
                    DISPONIBLES
                  </div>
                  <div className="text-4xl font-bold text-accent glow-text">
                    {stats?.totalMachines}
                  </div>
                </div>
                <LayoutGrid className="w-8 h-8 text-accent/50 group-hover:text-accent transition-colors" />
              </div>
              <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-accent/5 rounded-full blur-xl group-hover:bg-accent/10 transition-all" />
            </div>
          </div>

          {/* Level Progress */}
          <div className="glow-box p-6 border-primary/20 rounded-sm space-y-4">
            <div className="flex justify-between items-end">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-sm bg-primary/10 flex items-center justify-center border border-primary/30">
                  <Trophy className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <div className="text-xs text-foreground/50 uppercase tracking-widest mb-1">
                    TU NIVEL ACTUAL
                  </div>
                  <div className="text-2xl font-bold text-primary glow-text uppercase">
                    {stats?.level}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-xs text-foreground/50 uppercase tracking-widest mb-1">
                  SIGUIENTE NIVEL
                </div>
                <div className="text-xl font-bold text-foreground/80 uppercase flex items-center gap-2 justify-end">
                  {stats?.nextLevel}
                  <Laptop className="w-5 h-5 text-foreground/50" />
                </div>
              </div>
            </div>

            <div className="relative h-6 bg-black/40 rounded-sm overflow-hidden border border-white/5">
              <div 
                className="absolute top-0 left-0 h-full bg-gradient-to-r from-primary/50 to-primary transition-all duration-1000 ease-out"
                style={{ width: `${stats?.progressToNextLevel}%` }}
              />
              <div className="absolute inset-0 flex items-center justify-center text-[10px] font-bold tracking-widest text-white/80 z-10">
                {Math.round(stats?.progressToNextLevel || 0)}%
              </div>
            </div>

            <div className="flex justify-between text-xs font-mono text-foreground/50">
              <span>{stats?.solvedCount} máquinas resueltas</span>
              {stats?.level !== "Omniscient" && (
                <span>Faltan <span className="text-primary">{stats?.machinesToNextLevel}</span> para subir</span>
              )}
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex flex-wrap gap-2 md:gap-4 border-b border-white/5 pb-1">
            <Button 
              variant={activeTab === "progress" ? "default" : "outline"}
              onClick={() => setActiveTab("progress")}
              className={`rounded-sm font-mono uppercase tracking-widest gap-2 ${activeTab === "progress" ? "button-glow bg-primary text-background" : "border-white/10 text-foreground/60 hover:text-primary hover:border-primary/50"}`}
            >
              <Target className="w-4 h-4" /> Mi Progreso
            </Button>
            <Button 
              variant={activeTab === "machines" ? "default" : "outline"}
              onClick={() => setActiveTab("machines")}
              className={`rounded-sm font-mono uppercase tracking-widest gap-2 ${activeTab === "machines" ? "button-glow bg-primary text-background" : "border-white/10 text-foreground/60 hover:text-primary hover:border-primary/50"}`}
            >
              <Laptop className="w-4 h-4" /> Mis Máquinas
            </Button>
            <Button 
              variant={activeTab === "level" ? "default" : "outline"}
              onClick={() => setActiveTab("level")}
              className={`rounded-sm font-mono uppercase tracking-widest gap-2 ${activeTab === "level" ? "button-glow bg-secondary text-background" : "border-white/10 text-foreground/60 hover:text-secondary hover:border-secondary/50"}`}
            >
              <Star className="w-4 h-4" /> Mi Nivel
            </Button>
            <Button 
              variant={activeTab === "trophies" ? "default" : "outline"}
              onClick={() => setActiveTab("trophies")}
              className={`rounded-sm font-mono uppercase tracking-widest gap-2 ${activeTab === "trophies" ? "button-glow bg-accent text-background" : "border-white/10 text-foreground/60 hover:text-accent hover:border-accent/50"}`}
            >
              <Trophy className="w-4 h-4" /> Trofeos
            </Button>
            <Button 
              variant={activeTab === "calendar" ? "default" : "outline"}
              onClick={() => setActiveTab("calendar")}
              className={`rounded-sm font-mono uppercase tracking-widest gap-2 ${activeTab === "calendar" ? "button-glow bg-orange-400 text-background" : "border-white/10 text-foreground/60 hover:text-orange-400 hover:border-orange-400/50"}`}
            >
              <Calendar className="w-4 h-4" /> Calendario
            </Button>
            <Button 
              variant={activeTab === "notes" ? "default" : "outline"}
              onClick={() => setActiveTab("notes")}
              className={`rounded-sm font-mono uppercase tracking-widest gap-2 ${activeTab === "notes" ? "button-glow bg-pink-400 text-background" : "border-white/10 text-foreground/60 hover:text-pink-400 hover:border-pink-400/50"}`}
            >
              <Book className="w-4 h-4" /> Mis Notas
            </Button>
          </div>
          
          {/* Dynamic Content */}
          {renderTabContent()}

        </div>
      </div>
    </Layout>
  );
}
