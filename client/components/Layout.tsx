import Header from "./Header";
import { ReactNode } from "react";

interface LayoutProps {
  children: ReactNode;
  onLoginClick?: () => void;
}

export default function Layout({ children, onLoginClick }: LayoutProps) {
  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Background grid effect */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `
              linear-gradient(0deg, transparent 24%, rgba(0, 255, 0, .05) 25%, rgba(0, 255, 0, .05) 26%, transparent 27%, transparent 74%, rgba(0, 255, 0, .05) 75%, rgba(0, 255, 0, .05) 76%, transparent 77%, transparent),
              linear-gradient(90deg, transparent 24%, rgba(0, 255, 0, .05) 25%, rgba(0, 255, 0, .05) 26%, transparent 27%, transparent 74%, rgba(0, 255, 0, .05) 75%, rgba(0, 255, 0, .05) 76%, transparent 77%, transparent)
            `,
            backgroundSize: "50px 50px",
          }}
        />
      </div>

      <div className="relative z-10">
        <Header onLoginClick={onLoginClick} />
        <main className="pt-16">
          {children}
        </main>
        <footer className="border-t border-primary/30 mt-20 bg-card/50 neon-border" style={{ boxShadow: "0 0 20px rgba(0, 255, 0, 0.05)" }}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
              <div>
                <h3 className="text-sm font-bold text-primary mb-4 uppercase tracking-widest">&gt; product</h3>
                <ul className="space-y-2 text-sm text-foreground/70 font-mono">
                  <li><a href="#" className="hover:text-primary transition-all hover:glow-pulse">$ machines</a></li>
                  <li><a href="#" className="hover:text-primary transition-all hover:glow-pulse">$ certifications</a></li>
                  <li><a href="#" className="hover:text-primary transition-all hover:glow-pulse">$ learn</a></li>
                </ul>
              </div>
              <div>
                <h3 className="text-sm font-bold text-secondary mb-4 uppercase tracking-widest">&gt; company</h3>
                <ul className="space-y-2 text-sm text-foreground/70 font-mono">
                  <li><a href="#" className="hover:text-secondary transition-all hover:glow-pulse">$ about</a></li>
                  <li><a href="#" className="hover:text-secondary transition-all hover:glow-pulse">$ blog</a></li>
                  <li><a href="#" className="hover:text-secondary transition-all hover:glow-pulse">$ contact</a></li>
                </ul>
              </div>
              <div>
                <h3 className="text-sm font-bold text-accent mb-4 uppercase tracking-widest">&gt; legal</h3>
                <ul className="space-y-2 text-sm text-foreground/70 font-mono">
                  <li><a href="#" className="hover:text-accent transition-all hover:glow-pulse">$ privacy</a></li>
                  <li><a href="#" className="hover:text-accent transition-all hover:glow-pulse">$ terms</a></li>
                </ul>
              </div>
              <div>
                <h3 className="text-sm font-bold text-primary mb-4 uppercase tracking-widest">&gt; security</h3>
                <p className="text-sm text-foreground/70 font-mono">
                  Ethical hacking platform<br/>for professionals
                </p>
              </div>
            </div>
            <div className="border-t border-primary/30 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
              <p className="text-sm text-foreground/50 font-mono">
                © 2024 Hacking Vault. / All rights reserved.
              </p>
              <div className="flex gap-6">
                <a href="#" className="text-sm text-foreground/50 hover:text-primary transition-all hover:glow-pulse font-mono">twitter</a>
                <a href="#" className="text-sm text-foreground/50 hover:text-primary transition-all hover:glow-pulse font-mono">github</a>
                <a href="#" className="text-sm text-foreground/50 hover:text-primary transition-all hover:glow-pulse font-mono">discord</a>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
