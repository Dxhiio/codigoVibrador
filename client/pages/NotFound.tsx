import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { AlertTriangle, Home, Radio } from "lucide-react";

export default function NotFound() {
  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32 flex items-center justify-center min-h-screen font-mono">
        <div className="text-center space-y-8 w-full max-w-md">
          <div className="flex justify-center">
            <div className="glow-box border-destructive/40 p-6 rounded-sm">
              <AlertTriangle className="w-16 h-16 text-destructive" />
            </div>
          </div>

          <div className="space-y-4">
            <div className="text-xs text-destructive uppercase tracking-widest flex items-center justify-center gap-2">
              <Radio className="w-3 h-3 animate-pulse" />
              <span>System Error</span>
            </div>
            <h1 className="text-6xl md:text-7xl font-bold tracking-tighter glow-text">404</h1>
            <h2 className="text-3xl md:text-4xl font-bold uppercase tracking-widest">ACCESS DENIED</h2>
            <p className="text-lg text-foreground/70">
              The target page does not exist or has been moved to a different location.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/">
              <Button className="button-glow bg-primary text-background hover:bg-primary/90 text-base h-12 px-8 gap-2 font-mono uppercase tracking-widest rounded-sm w-full sm:w-auto">
                <Home className="w-4 h-4" />
                $ home
              </Button>
            </Link>
            <Button variant="outline" className="neon-border text-base h-12 px-8 font-mono uppercase tracking-widest rounded-sm hover:bg-card/50 hover:shadow-lg hover:shadow-primary/20 w-full sm:w-auto">
              $ explore
            </Button>
          </div>

          <div className="pt-8 border-t border-primary/30 max-w-md mx-auto glow-box p-4 rounded-sm space-y-3">
            <p className="text-xs text-foreground/60 uppercase tracking-widest">
              Error Details
            </p>
            <div className="text-left text-xs font-mono text-foreground/70 space-y-1">
              <div><span className="text-primary">$</span> status: 404</div>
              <div><span className="text-primary">$</span> resource: not found</div>
              <div><span className="text-primary">$</span> action: contact support</div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
