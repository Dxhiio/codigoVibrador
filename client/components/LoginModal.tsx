import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { X, Lock, Mail, Loader } from "lucide-react";

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function LoginModal({ isOpen, onClose }: LoginModalProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSignup, setIsSignup] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login, signup } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!email) {
      setError("Email requerido");
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres");
      setLoading(false);
      return;
    }

    try {
      const result = isSignup
        ? await signup(email, password)
        : await login(email, password);

      if (result.success) {
        setEmail("");
        setPassword("");
        onClose();
      } else {
        setError(result.error || "Error en la autenticación");
      }
    } catch (err) {
      setError(String(err));
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="glow-box border-primary/30 neon-border rounded-sm max-w-md w-full p-8 space-y-6 animate-slide-up">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-primary uppercase tracking-widest">
            $ {isSignup ? "registrarse" : "login"}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-card rounded-sm transition-colors text-primary/70 hover:text-primary"
            disabled={loading}
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
                className="w-full bg-background border border-primary/30 rounded-sm pl-10 pr-4 py-2.5 text-foreground font-mono text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/30 disabled:opacity-50"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
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
                className="w-full bg-background border border-primary/30 rounded-sm pl-10 pr-4 py-2.5 text-foreground font-mono text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/30 disabled:opacity-50"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
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
            disabled={loading}
            className="w-full button-glow bg-primary text-background hover:bg-primary/90 font-mono uppercase tracking-widest rounded-sm h-11 disabled:opacity-50 disabled:cursor-not-allowed gap-2"
          >
            {loading && <Loader className="w-4 h-4 animate-spin" />}
            $ {isSignup ? "crear cuenta" : "acceso"}
          </Button>
        </form>

        {/* Toggle Signup/Login */}
        <div className="pt-4 border-t border-primary/30 text-center space-y-3">
          <p className="text-xs text-foreground/60 font-mono">
            {isSignup
              ? "¿Ya tienes cuenta?"
              : "¿No tienes cuenta?"}
          </p>
          <button
            onClick={() => {
              setIsSignup(!isSignup);
              setError("");
              setEmail("");
              setPassword("");
            }}
            disabled={loading}
            className="text-sm font-mono text-primary hover:text-primary/80 transition-colors uppercase tracking-wider disabled:opacity-50"
          >
            {isSignup ? "$ login" : "$ registrarse"}
          </button>
        </div>
      </div>
    </div>
  );
}
