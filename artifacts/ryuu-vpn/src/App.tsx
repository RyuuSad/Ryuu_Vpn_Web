import { Switch, Route, Router as WouterRouter, useLocation } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider, useAuth } from "@/context/AuthContext";
import { WelcomeAnnouncement } from "@/components/WelcomeAnnouncement";
import { useState, useEffect } from "react";
import HomePage from "@/pages/home";
import DashboardPage from "@/pages/dashboard";
import TopupPage from "@/pages/topup";
import AdminPage from "@/pages/admin";
import NotFound from "@/pages/not-found";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function Router() {
  const { user, loading } = useAuth();
  const [, navigate] = useLocation();
  const [showAnnouncement, setShowAnnouncement] = useState(true);
  const [hasInteracted, setHasInteracted] = useState(false);

  useEffect(() => {
    // Show announcement on every app open
    setShowAnnouncement(true);
    setHasInteracted(false);
  }, []);

  const handleDismissAnnouncement = () => {
    setShowAnnouncement(false);
    setHasInteracted(true);
    
    // After dismissing announcement, route based on auth state
    if (user) {
      // Logged in -> go to dashboard
      navigate('/dashboard');
    } else {
      // Not logged in -> stay on home page (or go to home if on different page)
      if (window.location.pathname !== '/') {
        navigate('/');
      }
    }
  };

  return (
    <>
      {showAnnouncement && !hasInteracted && <WelcomeAnnouncement onDismiss={handleDismissAnnouncement} />}
      <Switch>
        <Route path="/" component={HomePage} />
        <Route path="/dashboard" component={DashboardPage} />
        <Route path="/topup" component={TopupPage} />
        <Route path="/admin" component={AdminPage} />
        <Route component={NotFound} />
      </Switch>
    </>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
            <Router />
          </WouterRouter>
          <Toaster />
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
