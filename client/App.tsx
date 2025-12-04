import "./global.css";

import { Toaster } from "@/components/ui/toaster";
import { createRoot } from "react-dom/client";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/context/AuthContext";
import Index from "./pages/Index";
import Features from "./pages/Features";
import Machines from "./pages/Machines";
import SkillTree from "./pages/SkillTree";
import NotFound from "./pages/NotFound";
import Profile from "./pages/Profile";

import Roadmap from "./pages/Roadmap";
import ProtectedRoute from "@/components/ProtectedRoute";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>


          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/features" element={<Features />} />
            
            {/* Protected Routes */}
            <Route path="/machines" element={
              <ProtectedRoute>
                <Machines />
              </ProtectedRoute>
            } />
            <Route path="/skill-tree" element={
              <ProtectedRoute>
                <SkillTree />
              </ProtectedRoute>
            } />
            <Route path="/certs" element={
              <ProtectedRoute>
                <Roadmap />
              </ProtectedRoute>
            } />
            <Route path="/profile" element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            } />
            
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

createRoot(document.getElementById("root")!).render(<App />);
