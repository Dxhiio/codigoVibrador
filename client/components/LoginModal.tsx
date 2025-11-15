import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { X, Lock, Mail, Loader, Check, AlertCircle } from "lucide-react";

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// Password validation requirements
const PASSWORD_REQUIREMENTS = {
  minLength: { regex: /.{8,}/, label: "Mínimo 8 caracteres" },
  hasUppercase: { regex: /[A-Z]/, label: "Una letra mayúscula" },
  hasLowercase: { regex: /[a-z]/, label: "Una letra minúscula" },
  hasNumber: { regex: /\d/, label: "Un número" },
  hasSymbol: {
    regex: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/,
    label: "Un símbolo especial",
  },
};

export default function LoginModal({ isOpen, onClose }: LoginModalProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [isSignup, setIsSignup] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login, signup } = useAuth();

  // Validate password strength
  const validatePassword = (pwd: string) => {
    return Object.values(PASSWORD_REQUIREMENTS).every((req) =>
      req.regex.test(pwd),
    );
  };

  // Check which requirements are met
  const getPasswordStatus = (pwd: string) => {
    return Object.entries(PASSWORD_REQUIREMENTS).map(([key, req]) => ({
      key,
      met: req.regex.test(pwd),
      label: req.label,
    }));
  };

  const passwordStatus = getPasswordStatus(password);
  const isPasswordValid = validatePassword(password);
  const passwordsMatch = password === confirmPassword && password.length > 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!email) {
      setError("Email requerido");
      setLoading(false);
      return;
    }

    if (isSignup) {
      if (!isPasswordValid) {
        setError("La contraseña no cumple los requisitos");
        setLoading(false);
        return;
      }

      if (!passwordsMatch) {
        setError("Las contraseñas no coinciden");
        setLoading(false);
        return;
      }
    } else {
      if (password.length < 6) {
        setError("Contraseña requerida");
        setLoading(false);
        return;
      }
    }

    try {
      const result = isSignup
        ? await signup(email, password)
        : await login(email, password);

      if (result.success) {
        if (isSignup) {
          setError("");
          setPassword("");
          setConfirmPassword("");
          setIsSignup(false);
        } else {
          setEmail("");
          setPassword("");
          setConfirmPassword("");
          onClose();
        }
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
      <div className="glow-box border-primary/30 neon-border rounded-sm max-w-md w-full p-8 space-y-6 animate-slide-up max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between sticky top-0 bg-background/90">
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

            {/* Password Requirements (only show on signup) */}
            {isSignup && password.length > 0 && (
              <div className="mt-3 p-3 bg-card border border-primary/20 rounded-sm space-y-2">
                <div className="text-xs font-bold text-primary/70 uppercase tracking-wider">
                  Requisitos de seguridad
                </div>
                <div className="space-y-1">
                  {passwordStatus.map((status) => (
                    <div
                      key={status.key}
                      className="flex items-center gap-2 text-xs font-mono"
                    >
                      {status.met ? (
                        <Check className="w-4 h-4 text-primary flex-shrink-0" />
                      ) : (
                        <AlertCircle className="w-4 h-4 text-foreground/40 flex-shrink-0" />
                      )}
                      <span
                        className={
                          status.met ? "text-primary" : "text-foreground/50"
                        }
                      >
                        {status.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Confirm Password (only on signup) */}
          {isSignup && (
            <div className="space-y-2">
              <label className="text-sm font-mono text-primary/70 uppercase tracking-wider">
                Confirmar contraseña
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-3.5 w-5 h-5 text-primary/50" />
                <input
                  type="password"
                  placeholder="••••••••"
                  className={`w-full bg-background border rounded-sm pl-10 pr-4 py-2.5 text-foreground font-mono text-sm focus:outline-none focus:ring-1 focus:ring-primary/30 disabled:opacity-50 ${
                    confirmPassword.length > 0
                      ? passwordsMatch
                        ? "border-primary focus:border-primary"
                        : "border-destructive focus:border-destructive"
                      : "border-primary/30 focus:border-primary"
                  }`}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  disabled={loading}
                />
                {confirmPassword.length > 0 && (
                  <div className="absolute right-3 top-3.5">
                    {passwordsMatch ? (
                      <Check className="w-5 h-5 text-primary" />
                    ) : (
                      <AlertCircle className="w-5 h-5 text-destructive" />
                    )}
                  </div>
                )}
              </div>
              {confirmPassword.length > 0 && !passwordsMatch && (
                <p className="text-xs text-destructive font-mono">
                  Las contraseñas no coinciden
                </p>
              )}
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="p-3 bg-destructive/10 border border-destructive/50 rounded-sm text-destructive text-sm font-mono flex gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={
              loading ||
              (isSignup && !isPasswordValid) ||
              (isSignup && !passwordsMatch)
            }
            className="w-full button-glow bg-primary text-background hover:bg-primary/90 font-mono uppercase tracking-widest rounded-sm h-11 disabled:opacity-50 disabled:cursor-not-allowed gap-2"
          >
            {loading && <Loader className="w-4 h-4 animate-spin" />}${" "}
            {isSignup ? "crear cuenta" : "acceso"}
          </Button>
        </form>

        {/* Toggle Signup/Login */}
        <div className="pt-4 border-t border-primary/30 text-center space-y-3">
          <p className="text-xs text-foreground/60 font-mono">
            {isSignup ? "¿Ya tienes cuenta?" : "¿No tienes cuenta?"}
          </p>
          <button
            onClick={() => {
              setIsSignup(!isSignup);
              setError("");
              setEmail("");
              setPassword("");
              setConfirmPassword("");
            }}
            disabled={loading}
            className="text-sm font-mono text-primary hover:text-primary/80 transition-colors uppercase tracking-wider disabled:opacity-50"
          >
            {isSignup ? "$ login" : "$ registrarse"}
          </button>
        </div>

        {/* Info Message */}
        {isSignup && (
          <div className="p-3 bg-secondary/10 border border-secondary/30 rounded-sm text-secondary text-xs font-mono">
            <div className="font-bold mb-1">ℹ️ Verificación de email</div>
            <div>
              Recibirás un email de confirmación. Verifica tu cuenta para
              acceder.
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
