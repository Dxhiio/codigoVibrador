import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { X, Lock, Mail } from "lucide-react";

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function LoginModal({ isOpen, onClose }: LoginModalProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login } = useAuth();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email) {
      setError("Email requerido");
      return;
    }

    if (password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres");
      return;
    }

    if (login(email, password)) {
      setEmail("");
      setPassword("");
      onClose();
    } else {
      setError("Credenciales inválidas");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="glow-box border-primary/30 neon-border rounded-sm max-w-md w-full p-8 space-y-6 animate-slide-up">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-primary uppercase tracking-widest">$ login</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-card rounded-sm transition-colors text-primary/70 hover:text-primary"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email Input */}
          <div className="space-y-2">
            <label className="text-sm font-mono text-primary/70 uppercase tracking-wider">
              Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-3.5 w-5 h-5 text-primary/50" />
              <input
                type="email"
                placeholder="tu@email.com"
                className="w-full bg-background border border-primary/30 rounded-sm pl-10 pr-4 py-2.5 text-foreground font-mono text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/30"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          {/* Password Input */}
          <div className="space-y-2">
            <label className="text-sm font-mono text-primary/70 uppercase tracking-wider">
              Contraseña
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-3.5 w-5 h-5 text-primary/50" />
              <input
                type="password"
                placeholder="••••••••"
                className="w-full bg-background border border-primary/30 rounded-sm pl-10 pr-4 py-2.5 text-foreground font-mono text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/30"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-3 bg-destructive/10 border border-destructive/50 rounded-sm text-destructive text-sm font-mono">
              {error}
            </div>
          )}

          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full button-glow bg-primary text-background hover:bg-primary/90 font-mono uppercase tracking-widest rounded-sm h-11"
          >
            $ acceso
          </Button>
        </form>

        <div className="pt-4 border-t border-primary/30 text-center">
          <p className="text-xs text-foreground/60 font-mono">
            Usa cualquier email y contraseña (6+ caracteres)
          </p>
        </div>
      </div>
    </div>
  );
}
