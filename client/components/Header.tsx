import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Shield, Menu, X, Terminal, LogOut } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";

interface HeaderProps {
  onLoginClick?: () => void;
}

export default function Header({ onLoginClick }: HeaderProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { isAuthenticated, email, loading, logout } = useAuth();

  return (
    <header
      className="fixed w-full top-0 z-50 backdrop-blur-sm bg-background/90 border-b border-primary/30 neon-border"
      style={{ boxShadow: "0 0 20px rgba(0, 255, 0, 0.1)" }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo with terminal style */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="p-2 rounded-sm bg-gradient-to-br from-primary to-secondary group-hover:shadow-lg group-hover:shadow-primary/50 transition-all">
              <Terminal className="w-5 h-5 text-background" />
            </div>
            <span className="text-xl font-bold glow-text tracking-widest">
              [VAULT]
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <a
              href="#features"
              className="text-sm font-mono text-foreground/70 hover:text-primary transition-all hover:glow-pulse uppercase tracking-wide"
            >
              &gt; features
            </a>
            <a
              href="#machines"
              className="text-sm font-mono text-foreground/70 hover:text-primary transition-all hover:glow-pulse uppercase tracking-wide"
            >
              &gt; machines
            </a>
            <a
              href="#certifications"
              className="text-sm font-mono text-foreground/70 hover:text-primary transition-all hover:glow-pulse uppercase tracking-wide"
            >
              &gt; certs
            </a>
          </nav>

          {/* Desktop CTA Buttons */}
          <div className="hidden md:flex items-center gap-3">
            {loading ? (
              <div className="text-sm font-mono text-primary/70">
                $ cargando...
              </div>
            ) : isAuthenticated ? (
              <>
                <div className="text-sm font-mono text-primary/70 truncate max-w-xs">
                  {email}
                </div>
                <Button
                  onClick={logout}
                  variant="outline"
                  className="text-sm font-mono uppercase tracking-widest border-destructive/40 text-destructive/80 hover:text-destructive hover:border-destructive hover:shadow-lg hover:shadow-destructive/30 gap-2"
                >
                  <LogOut className="w-4 h-4" />
                  logout
                </Button>
              </>
            ) : (
              <>
                <Button
                  onClick={onLoginClick}
                  variant="outline"
                  className="text-sm font-mono uppercase tracking-widest border-primary/40 text-foreground/80 hover:text-primary hover:border-primary hover:shadow-lg hover:shadow-primary/30"
                >
                  $ login
                </Button>
                <Button className="text-sm font-mono uppercase tracking-widest button-glow bg-primary text-background hover:bg-primary/90">
                  $ execute
                </Button>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 hover:bg-card rounded-sm transition-colors neon-border"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? (
              <X className="w-5 h-5 text-primary" />
            ) : (
              <Menu className="w-5 h-5 text-primary" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden pb-4 space-y-3 animate-slide-up border-t border-primary/30 mt-4 pt-4">
            <a
              href="#features"
              className="block px-4 py-2 rounded-sm hover:bg-card transition-colors text-sm font-mono text-primary hover:glow-pulse uppercase"
              onClick={() => setIsOpen(false)}
            >
              &gt; features
            </a>
            <a
              href="#machines"
              className="block px-4 py-2 rounded-sm hover:bg-card transition-colors text-sm font-mono text-primary hover:glow-pulse uppercase"
              onClick={() => setIsOpen(false)}
            >
              &gt; machines
            </a>
            <a
              href="#certifications"
              className="block px-4 py-2 rounded-sm hover:bg-card transition-colors text-sm font-mono text-primary hover:glow-pulse uppercase"
              onClick={() => setIsOpen(false)}
            >
              &gt; certs
            </a>
            <div className="flex flex-col gap-2 pt-2 border-t border-primary/30">
              {loading ? (
                <div className="text-sm font-mono text-primary/70 px-4 py-2">
                  $ cargando...
                </div>
              ) : isAuthenticated ? (
                <>
                  <div className="text-sm font-mono text-primary/70 px-4 py-2 truncate">
                    {email}
                  </div>
                  <Button
                    onClick={() => {
                      logout();
                      setIsOpen(false);
                    }}
                    variant="outline"
                    className="w-full text-sm font-mono uppercase border-destructive/40 text-destructive/80 hover:border-destructive gap-2"
                  >
                    <LogOut className="w-4 h-4" />
                    logout
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    onClick={() => {
                      onLoginClick?.();
                      setIsOpen(false);
                    }}
                    variant="outline"
                    className="w-full text-sm font-mono uppercase border-primary/40 text-primary hover:border-primary"
                  >
                    $ login
                  </Button>
                  <Button className="w-full text-sm font-mono uppercase button-glow bg-primary text-background hover:bg-primary/90">
                    $ execute
                  </Button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
