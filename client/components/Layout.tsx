import Header from "./Header";
import { ReactNode } from "react";

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-16">
        {children}
      </main>
      <footer className="border-t border-border mt-20 bg-card/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="text-sm font-bold text-primary mb-4">Product</h3>
              <ul className="space-y-2 text-sm text-foreground/70">
                <li><a href="#" className="hover:text-primary transition-colors">Machines</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Certifications</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Learn</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-bold text-primary mb-4">Company</h3>
              <ul className="space-y-2 text-sm text-foreground/70">
                <li><a href="#" className="hover:text-primary transition-colors">About</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Contact</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-bold text-primary mb-4">Legal</h3>
              <ul className="space-y-2 text-sm text-foreground/70">
                <li><a href="#" className="hover:text-primary transition-colors">Privacy</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Terms</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-bold text-primary mb-4">Security</h3>
              <p className="text-sm text-foreground/70">
                Ethical hacking platform for cybersecurity professionals
              </p>
            </div>
          </div>
          <div className="border-t border-border pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-foreground/50">
              © 2024 Hacking Vault. All rights reserved.
            </p>
            <div className="flex gap-4">
              <a href="#" className="text-sm text-foreground/50 hover:text-primary transition-colors">Twitter</a>
              <a href="#" className="text-sm text-foreground/50 hover:text-primary transition-colors">GitHub</a>
              <a href="#" className="text-sm text-foreground/50 hover:text-primary transition-colors">Discord</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
